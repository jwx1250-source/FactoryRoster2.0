import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { getPublicEnv } from "@/lib/env";
import { apiError, noStoreJson } from "@/lib/http";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    const { email } = schema.parse(await request.json());
    const env = getPublicEnv();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: "implicit",
        persistSession: false,
      },
    });
    const callbackUrl = new URL("/update-password", request.url);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl.toString(),
    });

    if (error) return noStoreJson({ error: error.message }, { status: 400 });

    return noStoreJson({
      message: "If an account exists for this email, a password reset link has been sent.",
    });
  } catch (error) {
    return apiError(error);
  }
}
