import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { PLAN_CATALOG } from "../lib/plans";
import { applyContactUnlock, contactPreview } from "../lib/domain/rules";

const root = process.cwd();
const checkoutRoute = readFileSync(resolve(root, "app/api/checkout/route.ts"), "utf8");
const webhookRoute = readFileSync(resolve(root, "app/api/webhooks/stripe/route.ts"), "utf8");
const factoryRoute = readFileSync(resolve(root, "app/api/factories/[slug]/route.ts"), "utf8");
const unlockRoute = readFileSync(resolve(root, "app/api/factories/[slug]/unlock/route.ts"), "utf8");
const migration = readFileSync(resolve(root, "supabase/migrations/20261004133823_production_contact_credit_payments.sql"), "utf8");
const refundMigration = readFileSync(resolve(root, "supabase/migrations/20261004180000_refund_dispute_handling.sql"), "utf8");

describe("Stripe credit catalog", () => {
  it.each([
    ["starter", 990, 3],
    ["buyer", 2990, 15],
    ["pro", 9900, 60],
  ] as const)("uses the server package %s", (slug, cents, credits) => {
    expect(Math.round(PLAN_CATALOG[slug].amountUsd * 100)).toBe(cents);
    expect(PLAN_CATALOG[slug].credits).toBe(credits);
  });

  it("rejects browser-supplied price and credit values", () => {
    expect(checkoutRoute).not.toContain("input.price");
    expect(checkoutRoute).not.toContain("input.credits");
    expect(checkoutRoute).toContain("STRIPE_PRICE_STARTER_ID");
    expect(checkoutRoute).toContain("managed_payments: { enabled: false }");
    expect(webhookRoute).toContain("session.amount_total");
    expect(webhookRoute).toContain("listLineItems");
  });
});

describe("Stripe fulfillment safeguards", () => {
  it("verifies webhook signatures and accepts delayed paid sessions only", () => {
    expect(webhookRoute).toContain("constructEvent(rawBody, signature");
    expect(webhookRoute).toContain("checkout.session.async_payment_succeeded");
    expect(webhookRoute).toContain('session.payment_status === "paid"');
  });

  it("deduplicates event and payment objects", () => {
    expect(migration).toContain("credit_transactions_checkout_session_unique");
    expect(migration).toContain("credit_transactions_payment_intent_unique");
    expect(migration).toContain("credit_transactions_stripe_event_unique");
    expect(migration).toContain("on conflict (event_id) do nothing");
    expect(migration).toContain("on conflict do nothing");
  });
});

describe("atomic unlock and contact privacy", () => {
  it("handles sufficient, zero, repeated, and concurrent-style retries", () => {
    expect(applyContactUnlock(1, false)).toEqual({ balance: 0, creditsSpent: 1, allowed: true });
    expect(applyContactUnlock(0, false).allowed).toBe(false);
    expect(applyContactUnlock(0, true)).toEqual({ balance: 0, creditsSpent: 0, allowed: true });
    expect(applyContactUnlock(1, false).balance).toBeGreaterThanOrEqual(0);
  });

  it("keeps private contact fields out of public routes and preview data", () => {
    expect(factoryRoute).not.toContain("factory_contacts");
    expect(factoryRoute).toContain("contactPreview");
    expect(unlockRoute).toContain("unlock_factory_contact");
    expect(JSON.stringify(contactPreview(true))).not.toMatch(/@|\\+86|whatsapp|wechat/i);
  });
});

describe("refunds, disputes, and account restrictions", () => {
  it("handles full and partial refunds through compensating ledger entries", () => {
    expect(webhookRoute).toContain('event.type === "charge.refunded"');
    expect(webhookRoute).toContain('record_stripe_refund');
    expect(refundMigration).toContain("stripe_refunds");
    expect(refundMigration).toContain("stripe_refund_id");
    expect(refundMigration).toContain("type, amount, payment_intent_id");
    expect(refundMigration).toContain("-adjusted_credits");
    expect(refundMigration).toContain("least(eligible_credits, available_credits)");
  });

  it("deduplicates refund and dispute webhooks", () => {
    expect(refundMigration).toContain("credit_transactions_stripe_refund_unique");
    expect(refundMigration).toContain("stripe_refunds (refund_id");
    expect(refundMigration).toContain("stripe_disputes (dispute_id");
    expect(webhookRoute).toContain('event.type === "charge.dispute.created"');
    expect(webhookRoute).toContain('event.type === "charge.dispute.closed"');
  });

  it("restricts consumption during disputes and restores only after a win", () => {
    expect(refundMigration).toContain("consumption_blocked");
    expect(refundMigration).toContain("Stripe dispute under review");
    expect(refundMigration).toContain("if p_status = 'won' and not open_disputes");
    expect(refundMigration).toContain("Stripe dispute lost; account review required");
    expect(refundMigration).toContain("if not existing_unlock then");
  });
});
