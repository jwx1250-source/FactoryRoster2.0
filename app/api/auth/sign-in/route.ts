import { z } from "zod";

import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.email(), password: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);
    if (error) return noStoreJson({ error: "Invalid email or password" }, { status: 401 });
    return noStoreJson({ user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    return apiError(error);
  }
}
