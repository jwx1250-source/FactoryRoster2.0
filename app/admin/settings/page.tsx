import { requireAdmin } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await requireAdmin();
  return <section><h1 className="admin-title">Settings</h1><p className="admin-subtitle">Operational configuration status. Secret values are never displayed.</p><div className="admin-card-grid"><article className="admin-stat"><strong>Ready</strong><span>Supabase database</span></article><article className="admin-stat"><strong>On</strong><span>Admin role enforcement</span></article><article className="admin-stat"><strong>Off</strong><span>Stripe payments</span></article></div><p className="admin-notice">Canonical public domain: https://factoryroster.com</p></section>;
}
