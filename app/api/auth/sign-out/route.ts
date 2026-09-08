import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return noStoreJson({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
