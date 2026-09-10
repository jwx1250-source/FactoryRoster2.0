export const REQUIRED_VERIFICATIONS = [
  "government_registration",
  "business_contact",
  "supply_evidence",
] as const;

export type VerificationType = (typeof REQUIRED_VERIFICATIONS)[number];

export const SUPPLIER_TYPES = [
  "manufacturer",
  "authorized_distributor",
  "first_tier_agent",
  "trading_company",
  "exporter",
  "wholesaler",
  "brand_owner",
  "sourcing_service_provider",
] as const;

export const SUPPLY_EVIDENCE_TYPES = [
  "factory_evidence",
  "authorization_evidence",
  "supplier_relationship_evidence",
  "supply_chain_evidence",
  "export_evidence",
  "inventory_evidence",
  "fulfillment_evidence",
  "showroom_evidence",
  "service_capability_evidence",
] as const;

export const MOQ_LEVELS = ["sample_supported", "low_moq", "standard_moq", "bulk_only", "unknown"] as const;

export const SUPPLY_MODELS = [
  "factory_direct",
  "authorized_distribution",
  "first_tier_agent",
  "wholesale_inventory",
  "export_trading",
  "sourcing_service",
] as const;

export type SupplierType = (typeof SUPPLIER_TYPES)[number];
export type SupplyEvidenceType = (typeof SUPPLY_EVIDENCE_TYPES)[number];

export const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
  manufacturer: "Verified Manufacturer",
  authorized_distributor: "Verified Authorized Distributor",
  first_tier_agent: "Verified First-tier Agent",
  trading_company: "Verified Trading Supplier",
  exporter: "Verified Exporter",
  wholesaler: "Verified Wholesaler",
  brand_owner: "Verified Brand Owner",
  sourcing_service_provider: "Verified Sourcing Service Provider",
};

export const SUPPLY_EVIDENCE_LABELS: Record<SupplyEvidenceType, string> = {
  factory_evidence: "Factory Evidence",
  authorization_evidence: "Authorization Evidence",
  supplier_relationship_evidence: "Supplier Relationship Evidence",
  supply_chain_evidence: "Supply Chain Evidence",
  export_evidence: "Export Evidence",
  inventory_evidence: "Inventory Evidence",
  fulfillment_evidence: "Fulfillment Evidence",
  showroom_evidence: "Showroom Evidence",
  service_capability_evidence: "Service Capability Evidence",
};

export const EVIDENCE_BY_SUPPLIER_TYPE: Record<SupplierType, readonly SupplyEvidenceType[]> = {
  manufacturer: ["factory_evidence"],
  authorized_distributor: ["authorization_evidence"],
  first_tier_agent: ["authorization_evidence", "supplier_relationship_evidence"],
  trading_company: ["supply_chain_evidence"],
  exporter: ["export_evidence"],
  wholesaler: ["inventory_evidence", "fulfillment_evidence", "showroom_evidence"],
  brand_owner: ["authorization_evidence", "supplier_relationship_evidence"],
  sourcing_service_provider: ["service_capability_evidence"],
};

export function supplierTypeLabel(value: unknown) {
  return SUPPLIER_TYPE_LABELS[value as SupplierType] ?? "Verified Supplier";
}

export function supplyEvidenceLabel(value: unknown) {
  return SUPPLY_EVIDENCE_LABELS[value as SupplyEvidenceType] ?? "Supply Evidence";
}

export function canPublishFactory(records: Array<{ verification_type: string; status: string }>) {
  const verified = new Set(
    records.filter((record) => record.status === "verified").map((record) => record.verification_type),
  );
  return REQUIRED_VERIFICATIONS.every((type) => verified.has(type));
}

export const canPublishSupplier = canPublishFactory;

export function canIndexFactory(factory: {
  is_published: boolean;
  overview: string;
  main_products: string[];
}) {
  return factory.is_published && factory.overview.trim().length >= 80 && factory.main_products.length > 0;
}

export function contactPreview(hasContact: boolean) {
  return hasContact
    ? { available: true, label: "Verified contact record available", fields: ["Phone", "Email", "Contact person"] }
    : { available: false, label: "No verified contact available", fields: [] };
}

export function applyContactUnlock(balance: number, alreadyUnlocked: boolean) {
  if (alreadyUnlocked) return { balance, creditsSpent: 0, allowed: true };
  if (balance < 1) return { balance, creditsSpent: 0, allowed: false };
  return { balance: balance - 1, creditsSpent: 1, allowed: true };
}
