import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { safeRecordServerGrowthEvent } from "@/lib/growth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ name: z.string().trim().min(1).max(120).default("Saved supplier search"), filters: z.record(z.string(), z.unknown()).default({}) });

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("saved_searches").select("id,name,filters,is_active,last_notified_at,created_at,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (error) throw error;
    return noStoreJson({ data: data ?? [] });
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const input = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("saved_searches").insert({ user_id: user.id, name: input.name, filters: input.filters }).select().single();
    if (error) throw error;
    await safeRecordServerGrowthEvent("search_saved", { userId: user.id, properties: { filters: input.filters }, idempotencyKey: `search_saved:${data.id}` });
    return noStoreJson({ data }, { status: 201 });
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const id = z.uuid().parse(new URL(request.url).searchParams.get("id"));
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("saved_searches").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    return noStoreJson({ success: true });
  } catch (error) { return apiError(error); }
}
