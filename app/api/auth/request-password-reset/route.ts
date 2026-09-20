import { z } from "zod";

import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    const { email } = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const callbackUrl = new URL("/auth/callback?next=/update-password", request.url);
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
