import { z } from "zod";

import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    if (error) return noStoreJson({ error: error.message }, { status: 400 });
    return noStoreJson({ user: data.user ? { id: data.user.id, email: data.user.email } : null, requiresEmailConfirmation: !data.session }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
