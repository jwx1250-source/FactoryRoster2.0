export const REQUIRED_VERIFICATIONS = [
  "government_registration",
  "business_contact",
  "factory_evidence",
] as const;

export type VerificationType = (typeof REQUIRED_VERIFICATIONS)[number];

export function canPublishFactory(records: Array<{ verification_type: string; status: string }>) {
  const verified = new Set(
    records.filter((record) => record.status === "verified").map((record) => record.verification_type),
  );
  return REQUIRED_VERIFICATIONS.every((type) => verified.has(type));
}

export function canIndexFactory(factory: {
  is_published: boolean;
  overview: string;
  main_products: string[];
}) {
  return factory.is_published && factory.overview.trim().length >= 80 && factory.main_products.length > 0;
}

export function contactPreview(hasContact: boolean) {
  return hasContact
    ? { available: true, label: "Verified contact available", fields: ["Phone", "Email", "Contact person"] }
    : { available: false, label: "No verified contact available", fields: [] };
}

export function applyContactUnlock(balance: number, alreadyUnlocked: boolean) {
  if (alreadyUnlocked) return { balance, creditsSpent: 0, allowed: true };
  if (balance < 1) return { balance, creditsSpent: 0, allowed: false };
  return { balance: balance - 1, creditsSpent: 1, allowed: true };
}
