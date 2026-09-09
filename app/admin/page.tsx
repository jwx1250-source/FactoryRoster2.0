import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const [factories, verifications, requests, messages] = await Promise.all([
    supabase.from("factories").select("id,is_published"),
    supabase.from("verification_records").select("factory_id,verification_type,status"),
    supabase.from("verification_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  const rows = factories.data ?? [];
  const checks = verifications.data ?? [];
  const verifiedByFactory = new Map<string, Set<string>>();
  for (const check of checks) {
    if (check.status !== "verified") continue;
    const set = verifiedByFactory.get(check.factory_id) ?? new Set<string>();
    set.add(check.verification_type);
    verifiedByFactory.set(check.factory_id, set);
  }
  const missing = (type: string) => rows.filter((factory) => !verifiedByFactory.get(factory.id)?.has(type)).length;
  const cards = [
    ["Total factories", rows.length],
    ["Published", rows.filter((row) => row.is_published).length],
    ["Drafts", rows.filter((row) => !row.is_published).length],
    ["Ready for review", rows.filter((row) => !row.is_published && verifiedByFactory.get(row.id)?.size === 3).length],
    ["Missing registration", missing("government_registration")],
    ["Missing contact", missing("business_contact")],
    ["Missing evidence", missing("factory_evidence")],
    ["New verification requests", requests.count ?? 0],
    ["New contact messages", messages.count ?? 0],
  ] as const;
  return (
    <section>
      <div className="admin-heading"><div><h1 className="admin-title">Operations dashboard</h1><p className="admin-subtitle">Factory verification and buyer operations at a glance.</p></div><Link className="admin-primary" href="/admin/factories/new">Add factory</Link></div>
      <div className="admin-card-grid">{cards.map(([label, value]) => <article className="admin-stat" key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
      <div className="admin-panel"><h2>Quick actions</h2><div className="admin-actions"><Link href="/admin/factories/new">Add Factory</Link><Link href="/admin/factories">Review Draft Factories</Link><Link href="/admin/verification-requests">View Verification Requests</Link><Link href="/admin/guides">Manage Guides</Link></div></div>
    </section>
  );
}
