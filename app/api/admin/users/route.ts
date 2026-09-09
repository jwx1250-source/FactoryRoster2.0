import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
    const supabase = createSupabaseAdminClient();
    const [{ data: authData, error: authError }, balances, transactions] = await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase.from("credit_balances").select("user_id,balance,updated_at"),
      supabase.from("credit_transactions").select("id,user_id,type,amount,description,created_at").order("created_at", { ascending: false }).limit(100),
    ]);
    if (authError) throw authError;
    const balanceMap = new Map((balances.data ?? []).map((row) => [row.user_id, row.balance]));
    const users = authData.users.filter((user) => !query || user.email?.toLowerCase().includes(query)).map((user) => ({ id: user.id, email: user.email, created_at: user.created_at, last_sign_in_at: user.last_sign_in_at, balance: balanceMap.get(user.id) ?? 0 }));
    return noStoreJson({ users, transactions: transactions.data ?? [] });
  } catch (error) { return apiError(error); }
}
