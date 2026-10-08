import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.GROWTH_CRON_SECRET || process.env.CRON_SECRET;
  return Boolean(expected && request.headers.get("authorization") === `Bearer ${expected}`);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  const since = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: users } = await supabase.from("profiles").select("user_id").gte("created_at", since).limit(500);
  const tasks = (users ?? []).map((user) => ({ task_type: "lifecycle_email", dedupe_key: `welcome:${user.user_id}`, title: "Review welcome email sequence", description: "Prepare the next welcome email only after a provider and consent policy are configured.", priority: 35, payload: { user_id: user.user_id, campaign: "welcome" } }));
  if (tasks.length) await supabase.from("growth_tasks").upsert(tasks, { onConflict: "dedupe_key", ignoreDuplicates: true });
  return Response.json({ tasks_created: tasks.length, provider_enabled: process.env.EMAIL_PROVIDER_ENABLED === "true" });
}
