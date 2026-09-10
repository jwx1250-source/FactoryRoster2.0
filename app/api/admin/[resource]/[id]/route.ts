import { z } from "zod";

import { getAdminResource, sanitizeAdminPayload } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { EVIDENCE_BY_SUPPLIER_TYPE, SUPPLIER_TYPES, SUPPLY_EVIDENCE_TYPES } from "@/lib/domain/rules";

const bodySchema = z.record(z.string(), z.unknown());

export async function PATCH(request: Request, context: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    const adminUser = await requireAdmin();
    const { resource, id } = await context.params;
    const config = getAdminResource(resource);
    if (!config) return noStoreJson({ error: "Unknown admin resource" }, { status: 404 });
    if (config.update.length === 0) return noStoreJson({ error: "This resource is read-only" }, { status: 405 });

    const payload = sanitizeAdminPayload(bodySchema.parse(await request.json()), config.update);
    if (Object.keys(payload).length === 0) return noStoreJson({ error: "No supported fields supplied" }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    if (resource === "verification-records" && "status" in payload) {
      const { data: currentVerification, error: currentVerificationError } = await supabase.from("verification_records").select("verification_method,evidence_note").eq("id", id).maybeSingle();
      if (currentVerificationError) throw currentVerificationError;
      const method = String(payload.verification_method ?? currentVerification?.verification_method ?? "").trim();
      const note = String(payload.evidence_note ?? currentVerification?.evidence_note ?? "").trim();
      if (payload.status === "verified" && (!method || !note)) {
        return noStoreJson({ error: "Verification method and evidence notes are required before marking a check verified." }, { status: 400 });
      }
      payload.verified_by = payload.status === "verified" ? adminUser.id : null;
    }
    if (resource === "contacts" && ["verified_phone", "verified_email", "whatsapp", "wechat", "contact_verification_method"].some((field) => field in payload)) {
      payload.last_contact_verified_at = new Date().toISOString();
    }
    if (resource === "factories" && payload.is_published === true) {
      const [{ data: checks, error: checkError }, { data: supplier, error: supplierError }] = await Promise.all([
        supabase
        .from("verification_records")
        .select("verification_type,status,verification_method,evidence_note,verified_at")
        .eq("factory_id", id),
        supabase.from("factories").select("supplier_type,supply_evidence_type,industry_id,secondary_category_id").eq("id", id).maybeSingle(),
      ]);
      if (checkError || supplierError) throw checkError ?? supplierError;
      const supplierType = String(payload.supplier_type ?? supplier?.supplier_type ?? "");
      const evidenceType = String(payload.supply_evidence_type ?? supplier?.supply_evidence_type ?? "");
      if (!String(payload.industry_id ?? supplier?.industry_id ?? "") || !String(payload.secondary_category_id ?? supplier?.secondary_category_id ?? "")) {
        return noStoreJson({ error: "Primary Industry and Secondary Category are required before publishing." }, { status: 409 });
      }
      if (!SUPPLIER_TYPES.includes(supplierType as (typeof SUPPLIER_TYPES)[number]) || !SUPPLY_EVIDENCE_TYPES.includes(evidenceType as (typeof SUPPLY_EVIDENCE_TYPES)[number]) || !EVIDENCE_BY_SUPPLIER_TYPE[supplierType as keyof typeof EVIDENCE_BY_SUPPLIER_TYPE]?.includes(evidenceType as never)) {
        return noStoreJson({ error: "Select a valid supplier type and matching supply evidence type before publishing." }, { status: 409 });
      }
      const verified = new Set((checks ?? []).filter((check) => check.status === "verified").map((check) => check.verification_type));
      const required = [
        ["government_registration", "Government Registration"],
        ["business_contact", "Business Contact"],
        ["supply_evidence", "Supply Evidence"],
      ] as const;
      const missing = required.filter(([type]) => !verified.has(type)).map(([, label]) => label);
      if (missing.length) {
        return noStoreJson({
          error: "Supplier cannot be published until Government Registration, Business Contact, and Supply Evidence are all verified.",
          detail: `Cannot publish. Missing checks: ${missing.join(", ")}.`,
        }, { status: 409 });
      }
      const incompleteMetadata = (checks ?? []).filter((check) => check.status === "verified" && (!check.verified_at || !check.verification_method?.trim() || !check.evidence_note?.trim()));
      if (incompleteMetadata.length) return noStoreJson({ error: "Each verified check requires a verification method, evidence notes, and verified date." }, { status: 409 });
    }
    const { data, error } = await supabase.from(config.table).update(payload).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) return noStoreJson({ error: "Record not found" }, { status: 404 });
    return noStoreJson({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return noStoreJson({ error: error.message }, { status: 403 });
    }
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    await requireAdmin();
    const { resource, id } = await context.params;
    const config = getAdminResource(resource);
    if (!config?.deletable) return noStoreJson({ error: "Deletion is disabled for this resource" }, { status: 405 });
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) throw error;
    return noStoreJson({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
