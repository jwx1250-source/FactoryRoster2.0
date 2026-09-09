import { z } from "zod";

import { getAdminResource, sanitizeAdminPayload } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
      payload.verified_by = payload.status === "verified" ? adminUser.id : null;
    }
    if (resource === "contacts" && ["verified_phone", "verified_email", "whatsapp", "wechat", "contact_verification_method"].some((field) => field in payload)) {
      payload.last_contact_verified_at = new Date().toISOString();
    }
    if (resource === "factories" && payload.is_published === true) {
      const { data: checks, error: checkError } = await supabase
        .from("verification_records")
        .select("verification_type,status")
        .eq("factory_id", id);
      if (checkError) throw checkError;
      const verified = new Set((checks ?? []).filter((check) => check.status === "verified").map((check) => check.verification_type));
      const required = [
        ["government_registration", "Government Registration"],
        ["business_contact", "Business Contact"],
        ["factory_evidence", "Factory Evidence"],
      ] as const;
      const missing = required.filter(([type]) => !verified.has(type)).map(([, label]) => label);
      if (missing.length) {
        return noStoreJson({
          error: "Factory cannot be published until Government Registration, Business Contact, and Factory Evidence are all verified.",
          detail: `Cannot publish. Missing checks: ${missing.join(", ")}.`,
        }, { status: 409 });
      }
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
