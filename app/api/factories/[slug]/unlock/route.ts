import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRecordServerGrowthEvent } from "@/lib/growth";

const CONTACT_FIELDS = "contact_person,contact_position:position,verified_phone,verified_email,whatsapp,wechat,contact_verification_method,last_contact_verified_at";

async function getPublishedFactory(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, slug: string) {
  const { data, error } = await supabase
    .from("factories")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function GET(_request: Request, context: RouteContext<"/api/factories/[slug]/unlock">) {
  try {
    const { slug } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return noStoreJson({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 });

    const factory = await getPublishedFactory(supabase, slug);
    if (!factory) return noStoreJson({ error: "Supplier not found" }, { status: 404 });

    const { data: unlock, error: unlockError } = await supabase
      .from("contact_unlocks")
      .select("factory_contact_id")
      .eq("user_id", authData.user.id)
      .eq("factory_id", factory.id)
      .maybeSingle();
    if (unlockError) throw unlockError;
    if (!unlock) return noStoreJson({ contact: null });

    const [{ data: contact, error: contactError }, { data: balance, error: balanceError }] = await Promise.all([
      supabase.from("factory_contacts").select(CONTACT_FIELDS).eq("id", unlock.factory_contact_id).eq("is_active", true).maybeSingle(),
      supabase.from("credit_balances").select("balance").eq("user_id", authData.user.id).maybeSingle(),
    ]);
    if (contactError) throw contactError;
    if (balanceError) throw balanceError;
    return noStoreJson({ contact: contact ? { ...contact, credits_remaining: balance?.balance ?? 0, already_unlocked: true } : null });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(_request: Request, context: RouteContext<"/api/factories/[slug]/unlock">) {
  try {
    const { slug } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return noStoreJson({ error: "Authentication required", code: "AUTH_REQUIRED" }, { status: 401 });

    const factory = await getPublishedFactory(supabase, slug);
    if (!factory) return noStoreJson({ error: "Supplier not found" }, { status: 404 });

    const { data, error } = await supabase.rpc("unlock_factory_contact", { p_factory_id: factory.id });
    if (error?.message.includes("Insufficient contact credits")) {
      return noStoreJson({ error: "Insufficient contact credits", code: "INSUFFICIENT_CREDITS" }, { status: 402 });
    }
    if (error) throw error;
    await safeRecordServerGrowthEvent("contact_unlocked", { userId: authData.user.id, entityType: "supplier", entityId: factory.id, idempotencyKey: `contact_unlocked:${authData.user.id}:${factory.id}` });
    return noStoreJson({ contact: data?.[0] ?? null });
  } catch (error) {
    return apiError(error);
  }
}
