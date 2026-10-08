import { z } from "zod";

import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRecordServerGrowthEvent } from "@/lib/growth";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(2).max(100),
  company_name: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const { email, password, ...metadata } = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const callbackUrl = new URL("/auth/callback?next=/dashboard", request.url);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata, emailRedirectTo: callbackUrl.toString() },
    });
    if (error) return noStoreJson({ error: error.message }, { status: 400 });
    if (data.user) await safeRecordServerGrowthEvent("signup_completed", { userId: data.user.id, properties: { email_domain: email.split("@")[1]?.toLowerCase() }, idempotencyKey: `signup_completed:${data.user.id}` });
    return noStoreJson({ user: data.user ? { id: data.user.id, email: data.user.email } : null, requiresEmailConfirmation: !data.session }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
