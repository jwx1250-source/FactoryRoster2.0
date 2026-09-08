import { z } from "zod";

import { getAdminResource, sanitizeAdminPayload } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.record(z.string(), z.unknown());

export async function PATCH(request: Request, context: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    await requireAdmin();
    const { resource, id } = await context.params;
    const config = getAdminResource(resource);
    if (!config) return noStoreJson({ error: "Unknown admin resource" }, { status: 404 });
    if (config.update.length === 0) return noStoreJson({ error: "This resource is read-only" }, { status: 405 });

    const payload = sanitizeAdminPayload(bodySchema.parse(await request.json()), config.update);
    if (Object.keys(payload).length === 0) return noStoreJson({ error: "No supported fields supplied" }, { status: 400 });
    const supabase = createSupabaseAdminClient();
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
