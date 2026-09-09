import AdminCreditManager from "@/components/admin-credit-manager";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const [authResult, balances, transactions] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from("credit_balances").select("user_id,balance"),
    supabase.from("credit_transactions").select("id,user_id,type,amount,description,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  const balanceMap = new Map((balances.data ?? []).map((row) => [row.user_id, row.balance]));
  const users = (authResult.data.users ?? []).map((user) => ({ id: user.id, email: user.email ?? "No email", created_at: user.created_at, last_sign_in_at: user.last_sign_in_at ?? null, balance: balanceMap.get(user.id) ?? 0 }));
  return <section><h1 className="admin-title">Users & credits</h1><p className="admin-subtitle">Grant or remove test credits through an atomic, audited ledger transaction.</p><AdminCreditManager initialUsers={users} initialTransactions={transactions.data ?? []} /></section>;
}
