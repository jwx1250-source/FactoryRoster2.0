import { createHmac } from "node:crypto";

export type OutreachEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  unsubscribeUrl: string;
};

function secret() {
  return process.env.OUTREACH_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || process.env.GROWTH_CRON_SECRET || "";
}

export function signUnsubscribeToken(contactId: string) {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(contactId).digest("hex");
}

export function verifyUnsubscribeToken(contactId: string, token: string) {
  const expected = signUnsubscribeToken(contactId);
  return Boolean(expected && token && expected.length === token.length && createHmac("sha256", secret()).update(token).digest("hex") === createHmac("sha256", secret()).update(expected).digest("hex"));
}

export function buildUnsubscribeUrl(contactId: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://factoryroster.com").replace(/\/$/, "");
  return `${baseUrl}/api/outreach/unsubscribe?id=${encodeURIComponent(contactId)}&token=${encodeURIComponent(signUnsubscribeToken(contactId))}`;
}

export async function sendResendEmail(message: OutreachEmail) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return { sent: false, skipped: true, error: "Email provider is not configured" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { "List-Unsubscribe": `<${message.unsubscribeUrl}>` },
    }),
  });
  const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!response.ok) return { sent: false, skipped: false, error: body.message || `Provider returned ${response.status}` };
  return { sent: true, skipped: false, providerMessageId: body.id || null };
}

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}
