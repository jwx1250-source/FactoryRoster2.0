import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardActions from "@/components/dashboard-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import GrowthPreferences from "@/components/growth-preferences";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/sign-in?next=/dashboard");

  const [{ data: profile }, { data: balance }, { data: unlocks }, { data: savedSuppliers }, { data: savedSearches }] = await Promise.all([
    supabase.from("profiles").select("full_name,company_name,country").eq("user_id", authData.user.id).maybeSingle(),
    supabase.from("credit_balances").select("balance").eq("user_id", authData.user.id).maybeSingle(),
    supabase.from("contact_unlocks").select("id,factory_id,unlocked_at").eq("user_id", authData.user.id).order("unlocked_at", { ascending: false }),
    supabase.from("saved_suppliers").select("id,factory_id,created_at").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("saved_searches").select("id,name,filters,created_at").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(20),
  ]);
  const factoryIds = [...new Set([...(unlocks ?? []).map((unlock) => unlock.factory_id), ...(savedSuppliers ?? []).map((saved) => saved.factory_id)])];
  const { data: factories } = factoryIds.length
    ? await supabase.from("factories").select("id,slug,company_name,record_id").in("id", factoryIds)
    : { data: [] };
  const factoryById = new Map((factories ?? []).map((factory) => [factory.id, factory]));

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#F7F8FA" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#1E40AF" }}>BUYER WORKSPACE</p>
            <h1 style={{ fontSize: 32, margin: "8px 0" }}>Welcome, {profile?.full_name || authData.user.email}</h1>
            <p style={{ color: "#6B7280" }}>{profile?.company_name || "Supplier intelligence account"}</p>
          </div>
          <DashboardActions />
        </div>
        <div style={{ marginTop: 28, padding: 24, background: "white", border: "1px solid #E5E7EB", borderRadius: 12 }}>
          <strong style={{ fontSize: 28 }}>{balance?.balance ?? 0}</strong>
          <p style={{ color: "#6B7280", marginTop: 4 }}>Contact credits available</p>
        </div>
        <div style={{ marginTop: 16, padding: 24, background: "white", border: "1px solid #E5E7EB", borderRadius: 12 }}>
          <h2 style={{ fontSize: 18 }}>Unlocked contacts</h2>
          <p style={{ color: "#6B7280", marginTop: 6 }}>{unlocks?.length ?? 0} verified contact record(s)</p>
          {(unlocks ?? []).map((unlock) => {
            const factory = factoryById.get(unlock.factory_id);
            return factory ? (
              <Link key={unlock.id} href={`/factories/${factory.slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid #E5E7EB", color: "#1E40AF", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                <span>{factory.company_name}</span>
                <span style={{ color: "#9CA3AF", fontFamily: "monospace", fontSize: 12 }}>{factory.record_id}</span>
              </Link>
            ) : null;
          })}
        </div>
        <div style={{ marginTop: 16, padding: 24, background: "white", border: "1px solid #E5E7EB", borderRadius: 12 }}>
          <h2>Saved suppliers</h2>
          {(savedSuppliers ?? []).length === 0 ? <p style={{ color: "#6B7280", marginTop: 12 }}>Save suppliers while researching to build a shortlist.</p> : (savedSuppliers ?? []).map((saved) => { const factory = factoryById.get(saved.factory_id); return factory ? <Link key={saved.id} href={`/factories/${factory.slug}`} style={{ display: "block", marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB", color: "#1E40AF" }}>{factory.company_name}</Link> : null; })}
        </div>
        <div style={{ marginTop: 16, padding: 24, background: "white", border: "1px solid #E5E7EB", borderRadius: 12 }}>
          <h2>Saved searches</h2>
          {(savedSearches ?? []).length === 0 ? <p style={{ color: "#6B7280", marginTop: 12 }}>Save a supplier search to receive new-match alerts.</p> : (savedSearches ?? []).map((saved) => <div key={saved.id} style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}><strong>{saved.name}</strong><p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>{JSON.stringify(saved.filters)}</p></div>)}
        </div>
        <GrowthPreferences />
      </div>
    </main>
  );
}
