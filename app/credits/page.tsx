import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardActions from "@/components/dashboard-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CreditsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/sign-in?next=/credits");
  const [{ data: balance }, { data: transactions }, { data: unlocks }] = await Promise.all([
    supabase.from("credit_balances").select("balance").eq("user_id", authData.user.id).maybeSingle(),
    supabase.from("credit_transactions").select("id,type,amount,package_slug,description,created_at").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(100),
    supabase.from("contact_unlocks").select("id,factory_id,unlocked_at").eq("user_id", authData.user.id).order("unlocked_at", { ascending: false }),
  ]);
  const purchased = (transactions ?? []).filter((row) => row.type === "purchase").reduce((sum, row) => sum + row.amount, 0);
  const used = (transactions ?? []).filter((row) => row.type === "unlock").reduce((sum, row) => sum + Math.abs(row.amount), 0);
  const factoryIds = [...new Set((unlocks ?? []).map((row) => row.factory_id))];
  const { data: factories } = factoryIds.length ? await supabase.from("factories").select("id,slug,company_name").in("id", factoryIds) : { data: [] };
  const factoryById = new Map((factories ?? []).map((row) => [row.id, row]));
  return <main style={{ minHeight: "100vh", background: "#F7F8FA", padding: "48px 24px" }}><div style={{ maxWidth: 900, margin: "0 auto" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><p style={{ color: "#1E40AF", fontFamily: "monospace", fontSize: 11 }}>ACCOUNT / CREDITS</p><h1 style={{ margin: "8px 0" }}>Contact Credits</h1><p style={{ color: "#6B7280" }}>{authData.user.email}</p></div><DashboardActions /></div><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28 }}><Stat label="Current balance" value={balance?.balance ?? 0} /><Stat label="Purchased credits" value={purchased} /><Stat label="Used credits" value={used} /></div><section style={{ marginTop: 16, padding: 24, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}><h2>Purchase history</h2><Link href="/pricing" style={{ color: "#1E40AF" }}>Buy credits</Link></div>{(transactions ?? []).length === 0 ? <p style={{ color: "#6B7280", marginTop: 16 }}>No credit transactions yet.</p> : <div style={{ marginTop: 14 }}>{transactions?.map((row) => <div key={row.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: "1px solid #F0F1F3", color: "#374151" }}><span>{row.description || row.type}</span><strong style={{ color: row.amount > 0 ? "#047857" : "#B91C1C" }}>{row.amount > 0 ? "+" : ""}{row.amount}</strong></div>)}</div>}</section><section style={{ marginTop: 16, padding: 24, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12 }}><h2>Unlocked manufacturers</h2>{(unlocks ?? []).length === 0 ? <p style={{ color: "#6B7280", marginTop: 16 }}>No manufacturers unlocked yet.</p> : <div>{unlocks?.map((row) => { const factory = factoryById.get(row.factory_id); return factory ? <Link key={row.id} href={`/factories/${factory.slug}`} style={{ display: "block", padding: "12px 0", borderTop: "1px solid #F0F1F3", color: "#1E40AF" }}>{factory.company_name}</Link> : null; })}</div>}</section></div></main>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div style={{ padding: 20, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12 }}><strong style={{ fontSize: 28 }}>{value}</strong><p style={{ color: "#6B7280", marginTop: 4 }}>{label}</p></div>; }
