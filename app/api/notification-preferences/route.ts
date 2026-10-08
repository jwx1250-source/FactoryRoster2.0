import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ marketing_email_enabled: z.boolean(), supplier_alerts_enabled: z.boolean(), frequency: z.enum(["immediate", "weekly", "off"]) });

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("notification_preferences").select("marketing_email_enabled,supplier_alerts_enabled,frequency").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    return noStoreJson({ data: data ?? { marketing_email_enabled: true, supplier_alerts_enabled: true, frequency: "weekly" } });
  } catch (error) { return apiError(error); }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const input = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("notification_preferences").upsert({ user_id: user.id, ...input }, { onConflict: "user_id" }).select().single();
    if (error) throw error;
    return noStoreJson({ data });
  } catch (error) { return apiError(error); }
}
