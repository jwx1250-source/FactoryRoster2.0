import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(_request: Request, context: RouteContext<"/api/factories/[slug]/unlock">) {
  try {
    const { slug } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return noStoreJson({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 });

    const { data: factory, error: factoryError } = await supabase
      .from("factories")
      .select("id")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (factoryError) throw factoryError;
    if (!factory) return noStoreJson({ error: "Supplier not found" }, { status: 404 });

    const { data, error } = await supabase.rpc("unlock_factory_contact", { p_factory_id: factory.id });
    if (error?.message.includes("Insufficient contact credits")) {
      return noStoreJson({ error: "Insufficient contact credits", code: "INSUFFICIENT_CREDITS" }, { status: 402 });
    }
    if (error) throw error;
    return noStoreJson({ contact: data?.[0] ?? null });
  } catch (error) {
    return apiError(error);
  }
}
