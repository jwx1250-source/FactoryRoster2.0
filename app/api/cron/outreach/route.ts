import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildUnsubscribeUrl, escapeEmailHtml, sendResendEmail } from "@/lib/outreach";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.GROWTH_CRON_SECRET || process.env.CRON_SECRET;
  return Boolean(expected && request.headers.get("authorization") === `Bearer ${expected}`);
}

function buildMessage(contact: { id: string; email: string; full_name?: string | null; role_title?: string | null }, account: { company_name: string; industry?: string | null; website_url?: string | null }) {
  const recipient = contact.full_name?.trim() || "there";
  const industry = account.industry?.trim() || "your sourcing research";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://factoryroster.com").replace(/\/$/, "");
  const guideUrl = `${siteUrl}/guides`;
  const unsubscribeUrl = buildUnsubscribeUrl(contact.id);
  const subject = `A practical China supplier resource for ${industry}`;
  const text = `Hi ${recipient},\n\nWe publish practical research resources for buyers comparing verified China suppliers. This guide may be useful for ${industry}: ${guideUrl}\n\nIf it is relevant to your readers, feel free to reference it.\n\nUnsubscribe: ${unsubscribeUrl}\n\nFactoryRoster`;
  const html = `<p>Hi ${escapeEmailHtml(recipient)},</p><p>We publish practical research resources for buyers comparing verified China suppliers. This guide may be useful for ${escapeEmailHtml(industry)}:</p><p><a href="${guideUrl}">${guideUrl}</a></p><p>If it is relevant to your readers, feel free to reference it.</p><p><a href="${unsubscribeUrl}">Unsubscribe from future messages</a></p><p>FactoryRoster</p>`;
  return { to: contact.email, subject, text, html, unsubscribeUrl };
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (process.env.OUTREACH_AUTOSEND_ENABLED !== "true") return Response.json({ enabled: false, sent: 0, skipped: 0 });

  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const { data: contacts, error } = await supabase
    .from("prospect_contacts")
    .select("id,email,full_name,role_title,region,last_contacted_at,next_contact_at,account:prospect_accounts!inner(company_name,industry,website_url,source,legal_basis,outreach_status,auto_outreach_enabled,outreach_cadence_days)")
    .is("unsubscribed_at", null)
    .is("suppressed_at", null)
    .or(`next_contact_at.is.null,next_contact_at.lte.${now.toISOString()}`)
    .eq("account.outreach_status", "approved")
    .eq("account.auto_outreach_enabled", true)
    .limit(Number(process.env.OUTREACH_BATCH_SIZE || 25));
  if (error) return Response.json({ error: "Unable to load outreach contacts" }, { status: 500 });

  const emailList = (contacts ?? []).map((contact) => contact.email).filter(Boolean);
  const [{ data: suppressions }, { data: previousDeliveries }] = await Promise.all([
    emailList.length ? supabase.from("email_suppressions").select("email").in("email", emailList) : Promise.resolve({ data: [] as { email: string }[] }),
    emailList.length ? supabase.from("email_deliveries").select("email,sequence_no").eq("campaign", "backlink_outreach").in("email", emailList) : Promise.resolve({ data: [] as { email: string; sequence_no: number }[] }),
  ]);
  const suppressed = new Set((suppressions ?? []).map((row) => row.email.toLowerCase()));
  const sequenceByEmail = new Map<string, number>();
  for (const row of previousDeliveries ?? []) sequenceByEmail.set(row.email.toLowerCase(), Math.max(sequenceByEmail.get(row.email.toLowerCase()) || 0, row.sequence_no || 0));

  let sent = 0;
  let skipped = 0;
  for (const contact of contacts ?? []) {
    const account = Array.isArray(contact.account) ? contact.account[0] : contact.account;
    const email = contact.email.toLowerCase();
    const cadenceDays = Math.min(30, Math.max(7, Number(account?.outreach_cadence_days || 14)));
    const lastContactedAt = contact.last_contacted_at ? new Date(contact.last_contacted_at).getTime() : 0;
    if (!account || !account.source || !account.legal_basis || suppressed.has(email) || (lastContactedAt && Date.now() - lastContactedAt < cadenceDays * 86400000)) { skipped += 1; continue; }
    const sequenceNo = (sequenceByEmail.get(email) || 0) + 1;
    if (sequenceNo > 3) { skipped += 1; continue; }
    const dedupeKey = `outreach:${contact.id}:${sequenceNo}`;
    const { data: delivery, error: insertError } = await supabase.from("email_deliveries").insert({ email: contact.email, campaign: "backlink_outreach", sequence_no: sequenceNo, dedupe_key: dedupeKey, status: "queued" }).select("id").maybeSingle();
    if (insertError || !delivery) { skipped += 1; continue; }

    const result = await sendResendEmail(buildMessage(contact, account));
    if (result.sent) {
      await supabase.from("email_deliveries").update({ status: "sent", provider_message_id: result.providerMessageId, sent_at: now.toISOString() }).eq("id", delivery.id);
      await supabase.from("prospect_contacts").update({ last_contacted_at: now.toISOString(), next_contact_at: new Date(now.getTime() + cadenceDays * 86400000).toISOString() }).eq("id", contact.id);
      sequenceByEmail.set(email, sequenceNo);
      sent += 1;
    } else {
      await supabase.from("email_deliveries").update({ status: result.skipped ? "suppressed" : "failed", error_message: result.error }).eq("id", delivery.id);
      skipped += 1;
    }
  }
  return Response.json({ enabled: true, sent, skipped, candidates: contacts?.length || 0 });
}
