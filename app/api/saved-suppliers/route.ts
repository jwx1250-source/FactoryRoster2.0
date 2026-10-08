import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { safeRecordServerGrowthEvent } from "@/lib/growth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ factory_id: z.uuid() });

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("saved_suppliers").select("id,factory_id,created_at,factories(id,slug,company_name,record_id,province,city)").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw error;
    return noStoreJson({ data: data ?? [] });
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { factory_id } = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("saved_suppliers").upsert({ user_id: user.id, factory_id }, { onConflict: "user_id,factory_id" }).select("id,factory_id,created_at").single();
    if (error) throw error;
    await safeRecordServerGrowthEvent("supplier_saved", { userId: user.id, entityType: "supplier", entityId: factory_id, idempotencyKey: `supplier_saved:${user.id}:${factory_id}` });
    return noStoreJson({ data }, { status: 201 });
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { factory_id } = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("saved_suppliers").delete().eq("user_id", user.id).eq("factory_id", factory_id);
    if (error) throw error;
    return noStoreJson({ success: true });
  } catch (error) { return apiError(error); }
}
