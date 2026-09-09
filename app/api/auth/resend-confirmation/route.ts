import { z } from "zod";

import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    const { email } = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const emailRedirectTo = new URL("/auth/callback?next=/dashboard", request.url).toString();
    const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo } });
    if (error && !error.message.toLowerCase().includes("already confirmed")) {
      return noStoreJson({ error: error.message }, { status: 400 });
    }
    return noStoreJson({ message: "If this address still needs confirmation, a new email has been sent." });
  } catch (error) {
    return apiError(error);
  }
}
