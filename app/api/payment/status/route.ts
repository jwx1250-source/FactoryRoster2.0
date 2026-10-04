import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const querySchema = z.object({ session_id: z.string().regex(/^cs_[A-Za-z0-9_]+$/) });

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const { session_id: sessionId } = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const supabase = await createSupabaseServerClient();
    const [{ data: purchase }, { data: balance }] = await Promise.all([
      supabase.from("credit_transactions").select("amount,package_slug,created_at").eq("user_id", user.id).eq("checkout_session_id", sessionId).eq("type", "purchase").maybeSingle(),
      supabase.from("credit_balances").select("balance").eq("user_id", user.id).maybeSingle(),
    ]);
    return noStoreJson({ fulfilled: Boolean(purchase), purchase, balance: balance?.balance ?? 0 });
  } catch (error) {
    return apiError(error);
  }
}
