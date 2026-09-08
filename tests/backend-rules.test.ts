import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { applyContactUnlock, canIndexFactory, canPublishFactory, contactPreview } from "../lib/domain/rules";
import { PLAN_CATALOG } from "../lib/plans";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260908091039_create_factoryroster_schema.sql"),
  "utf8",
);

describe("factory publication rules", () => {
  it("requires all three verification checks", () => {
    expect(canPublishFactory([
      { verification_type: "government_registration", status: "verified" },
      { verification_type: "business_contact", status: "verified" },
    ])).toBe(false);

    expect(canPublishFactory([
      { verification_type: "government_registration", status: "verified" },
      { verification_type: "business_contact", status: "verified" },
      { verification_type: "factory_evidence", status: "verified" },
    ])).toBe(true);
  });

  it("requires sufficient content before indexing", () => {
    expect(canIndexFactory({ is_published: true, overview: "short", main_products: ["LED"] })).toBe(false);
    expect(canIndexFactory({ is_published: true, overview: "A".repeat(80), main_products: ["LED"] })).toBe(true);
  });
});

describe("locked contact contract", () => {
  it("returns only a safe preview before unlock", () => {
    expect(contactPreview(true)).toEqual({
      available: true,
      label: "Verified contact available",
      fields: ["Phone", "Email", "Contact person"],
    });
    expect(JSON.stringify(contactPreview(true))).not.toMatch(/@|\+86/);
  });

  it("spends exactly one credit on first unlock", () => {
    expect(applyContactUnlock(3, false)).toEqual({ balance: 2, creditsSpent: 1, allowed: true });
  });

  it("does not spend again for an existing unlock", () => {
    expect(applyContactUnlock(2, true)).toEqual({ balance: 2, creditsSpent: 0, allowed: true });
  });

  it("blocks users with zero credits", () => {
    expect(applyContactUnlock(0, false)).toEqual({ balance: 0, creditsSpent: 0, allowed: false });
  });
});

describe("payment and database safeguards", () => {
  it("uses the required Stripe credit amounts", () => {
    expect(PLAN_CATALOG.starter.credits).toBe(3);
    expect(PLAN_CATALOG.business.credits).toBe(15);
    expect(PLAN_CATALOG.pro.credits).toBe(60);
    expect(PLAN_CATALOG["sourcing-membership"].credits).toBe(100);
  });

  it("makes Stripe fulfillment and contact unlocks idempotent", () => {
    expect(migration).toContain("unique (user_id, factory_contact_id)");
    expect(migration).toContain("on conflict (event_id) do nothing");
    expect(migration).toContain("if not existing_unlock then");
  });

  it("keeps locked contacts unavailable to anonymous database clients", () => {
    expect(migration).toContain("revoke all on all tables in schema public from anon, authenticated");
    expect(migration).not.toMatch(/grant select on public\.factory_contacts[^;]*to anon/);
  });
});
