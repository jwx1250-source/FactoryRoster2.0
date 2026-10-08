import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const funnel = [
  ["organic_landing", "Organic landings"],
  ["supplier_search", "Supplier searches"],
  ["supplier_profile_view", "Supplier profiles viewed"],
  ["signup_completed", "Signups completed"],
  ["checkout_completed", "Credit purchases"],
  ["contact_unlocked", "Contact unlocks"],
] as const;

export default async function GrowthPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const [{ data: events }, { data: tasks }] = await Promise.all([
    supabase.from("growth_events").select("event_name,occurred_at").order("occurred_at", { ascending: false }).limit(5000),
    supabase.from("growth_tasks").select("id,task_type,title,status,priority,created_at").in("status", ["open", "approved", "in_progress"]).order("priority", { ascending: false }).limit(30),
  ]);
  const counts = new Map((events ?? []).map((event) => [event.event_name, 0]));
  for (const event of events ?? []) counts.set(event.event_name, (counts.get(event.event_name) ?? 0) + 1);
  return <section><div className="admin-heading"><div><h1 className="admin-title">Growth overview</h1><p className="admin-subtitle">Server-recorded funnel events and human-review tasks. No content or outreach is published automatically.</p></div></div><div className="admin-card-grid">{funnel.map(([key, label]) => <article className="admin-stat" key={key}><strong>{counts.get(key) ?? 0}</strong><span>{label}</span></article>)}</div><div className="admin-panel"><h2>Open growth tasks</h2>{(tasks ?? []).length === 0 ? <p className="admin-subtitle">No open tasks.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Type</th><th>Task</th><th>Priority</th><th>Status</th></tr></thead><tbody>{(tasks ?? []).map((task) => <tr key={task.id}><td>{task.task_type}</td><td>{task.title}</td><td>{task.priority}</td><td><span className="admin-badge warn">{task.status}</span></td></tr>)}</tbody></table></div>}</div></section>;
}
