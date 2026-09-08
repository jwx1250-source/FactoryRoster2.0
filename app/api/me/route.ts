import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return noStoreJson({ user: null, profile: null, credits: 0 });

    const [{ data: profile }, { data: balance }] = await Promise.all([
      supabase.from("profiles").select("full_name,company_name,country,role").eq("user_id", authData.user.id).maybeSingle(),
      supabase.from("credit_balances").select("balance").eq("user_id", authData.user.id).maybeSingle(),
    ]);
    return noStoreJson({ user: { id: authData.user.id, email: authData.user.email }, profile, credits: balance?.balance ?? 0 });
  } catch (error) {
    return apiError(error);
  }
}
