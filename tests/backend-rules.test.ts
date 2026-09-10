import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { applyContactUnlock, canIndexFactory, canPublishSupplier, contactPreview, supplierTypeLabel, supplyEvidenceLabel } from "../lib/domain/rules";
import { PLAN_CATALOG } from "../lib/plans";

const migration = ["20260908091039_create_factoryroster_schema.sql", "20260909042411_admin_foundation.sql", "20260909073911_automate_factory_internal_fields.sql", "20260910031558_expand_to_supplier_intelligence.sql"]
  .map((file) => readFileSync(resolve(process.cwd(), "supabase/migrations", file), "utf8"))
  .join("\n");

describe("supplier publication rules", () => {
  it("requires all three verification checks", () => {
    expect(canPublishSupplier([
      { verification_type: "government_registration", status: "verified" },
      { verification_type: "business_contact", status: "verified" },
    ])).toBe(false);

    expect(canPublishSupplier([
      { verification_type: "government_registration", status: "verified" },
      { verification_type: "business_contact", status: "verified" },
      { verification_type: "supply_evidence", status: "verified" },
    ])).toBe(true);
  });

  it("requires sufficient content before indexing", () => {
    expect(canIndexFactory({ is_published: true, overview: "short", main_products: ["LED"] })).toBe(false);
    expect(canIndexFactory({ is_published: true, overview: "A".repeat(80), main_products: ["LED"] })).toBe(true);
  });
});

describe("supplier intelligence labels", () => {
  it("does not call trading companies manufacturers", () => {
    expect(supplierTypeLabel("trading_company")).toBe("Verified Trading Supplier");
    expect(supplyEvidenceLabel("supply_chain_evidence")).toBe("Supply Chain Evidence");
  });

  it("keeps manufacturer factory evidence support", () => {
    expect(supplierTypeLabel("manufacturer")).toBe("Verified Manufacturer");
    expect(supplyEvidenceLabel("factory_evidence")).toBe("Factory Evidence");
  });
});

describe("locked contact contract", () => {
  it("returns only a safe preview before unlock", () => {
    expect(contactPreview(true)).toEqual({
      available: true,
      label: "Verified contact record available",
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

describe("admin foundation safeguards", () => {
  it("generates immutable factory identifiers and verification metadata", () => {
    expect(migration).toContain("factory_record_number_seq");
    expect(migration).toContain("factories_populate_system_fields");
    expect(migration).toContain("new.record_id := 'FR-' || to_char(current_date, 'YYYY')");
    expect(migration).toContain("new.slug := slug_base || '-' || lpad(sequence_number::text, 6, '0')");
    expect(migration).toContain("verification_records_populate_system_fields");
    expect(migration).toContain("verification_records_sync_factory_last_verified");
  });

  it("creates all three verification placeholders for every new factory", () => {
    expect(migration).toContain("factory_create_verification_placeholders");
    expect(migration).toContain("government_registration");
    expect(migration).toContain("business_contact");
    expect(migration).toContain("supply_evidence");
  });

  it("keeps unpublished suppliers out of public search", () => {
    expect(migration).toMatch(/search_verified_suppliers[\s\S]*where f\.is_published/);
  });

  it("resets supply verification when supplier classification changes", () => {
    expect(migration).toContain("reset_supply_evidence_after_supplier_change");
    expect(migration).toContain("set status = 'pending'");
  });

  it("keeps source notes and internal notes out of public factory grants", () => {
    const publicGrant = migration.match(/grant select \([\s\S]*?\) on public\.factories to anon, authenticated;/)?.[0] ?? "";
    expect(publicGrant).not.toContain("internal_notes");
    expect(publicGrant).not.toContain("source_notes");
  });

  it("limits manual credit adjustments to the service role", () => {
    expect(migration).toContain("revoke execute on function public.admin_adjust_contact_credits(uuid, integer, text) from public, anon, authenticated");
    expect(migration).toContain("grant execute on function public.admin_adjust_contact_credits(uuid, integer, text) to service_role");
  });
});
