import { verifyUnsubscribeToken } from "@/lib/outreach";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const contactId = url.searchParams.get("id") || "";
  const token = url.searchParams.get("token") || "";
  if (!contactId || !verifyUnsubscribeToken(contactId, token)) return new Response("Invalid unsubscribe link", { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { data: contact, error: contactError } = await supabase.from("prospect_contacts").select("email").eq("id", contactId).maybeSingle();
  if (contactError || !contact) return new Response("Contact not found", { status: 404 });
  const now = new Date().toISOString();
  await Promise.all([
    supabase.from("prospect_contacts").update({ unsubscribed_at: now, suppressed_at: now }).eq("id", contactId),
    supabase.from("email_suppressions").upsert({ email: contact.email, reason: "unsubscribe", source: "outreach_link" }, { onConflict: "email", ignoreDuplicates: true }),
  ]);
  return new Response("You have been unsubscribed from future FactoryRoster outreach messages.", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
