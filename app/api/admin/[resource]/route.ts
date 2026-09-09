import { z } from "zod";

import { getAdminResource, sanitizeAdminPayload } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.record(z.string(), z.unknown());

export async function GET(request: Request, context: RouteContext<"/api/admin/[resource]">) {
  try {
    await requireAdmin();
    const { resource } = await context.params;
    const config = getAdminResource(resource);
    if (!config) return noStoreJson({ error: "Unknown admin resource" }, { status: 404 });

    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 100);
    const from = (page - 1) * limit;
    const supabase = createSupabaseAdminClient();
    const selection = resource === "factories" ? "*,industries(name),verification_records(verification_type,status)" : "*";
    const { data, error, count } = await supabase
      .from(config.table)
      .select(selection, { count: "exact" })
      .order(config.orderBy ?? "created_at", { ascending: false })
      .range(from, from + limit - 1);
    if (error) throw error;
    return noStoreJson({ data, page, limit, total: count ?? 0 });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return noStoreJson({ error: error.message }, { status: 403 });
    }
    return apiError(error);
  }
}

export async function POST(request: Request, context: RouteContext<"/api/admin/[resource]">) {
  try {
    await requireAdmin();
    const { resource } = await context.params;
    const config = getAdminResource(resource);
    if (!config) return noStoreJson({ error: "Unknown admin resource" }, { status: 404 });
    if (config.create.length === 0) return noStoreJson({ error: "This resource is read-only" }, { status: 405 });

    const payload = sanitizeAdminPayload(bodySchema.parse(await request.json()), config.create);
    if (resource === "factories") {
      payload.is_published = false;
      payload.is_indexable = false;
    }
    if (resource === "contacts") {
      payload.is_locked = true;
      payload.last_contact_verified_at = new Date().toISOString();
    }
    if (Object.keys(payload).length === 0) return noStoreJson({ error: "No supported fields supplied" }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from(config.table).insert(payload).select().single();
    if (error) throw error;
    return noStoreJson({ data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
