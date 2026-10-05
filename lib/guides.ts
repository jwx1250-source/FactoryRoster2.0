export type GuideClusterId =
  | "discovery"
  | "verification"
  | "supplier-types"
  | "communication"
  | "commercial"
  | "risk-control"
  | "operations";

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
  callout?: string;
};

export type GuideRecord = {
  slug: string;
  title: string;
  topic: string;
  clusterId: GuideClusterId;
  summary: string;
  readTime: number;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt?: string;
  sections?: GuideSection[];
  content?: string;
  source: "built-in" | "supabase";
};

export type GuideDatabaseRow = {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  content: string;
  read_time: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at?: string | null;
};

export const guideClusters: Array<{ id: GuideClusterId; title: string; description: string }> = [
  { id: "discovery", title: "Discovery & Shortlisting", description: "Turn a product brief into a focused China supplier shortlist." },
  { id: "verification", title: "Verification & Due Diligence", description: "Check registration, contacts, supply evidence, and warning signs before outreach." },
  { id: "supplier-types", title: "Supplier Types & Fit", description: "Choose between manufacturers, distributors, exporters, wholesalers, and agents." },
  { id: "communication", title: "Communication & RFQs", description: "Ask better questions and make first contact more productive." },
  { id: "commercial", title: "MOQ, Pricing & Commercial Terms", description: "Compare MOQ, samples, lead times, and quotes without false precision." },
  { id: "risk-control", title: "Risk Control & Red Flags", description: "Spot avoidable sourcing risks and build a safer review process." },
  { id: "operations", title: "Orders, Samples & Ongoing Sourcing", description: "Move from a verified contact to a practical supplier workflow." },
];

export const guideRoadmap: Array<{ slug: string; title: string; clusterId: GuideClusterId; status: "published" | "planned" | "existing" }> = [
  { slug: "find-verified-china-manufacturers", title: "How to Find Verified China Manufacturers", clusterId: "discovery", status: "existing" },
  { slug: "how-to-search-china-suppliers", title: "How to Search China Suppliers by Product", clusterId: "discovery", status: "planned" },
  { slug: "china-supplier-shortlist-template", title: "China Supplier Shortlist Template", clusterId: "discovery", status: "planned" },
  { slug: "how-to-verify-a-chinese-supplier", title: "How to Verify a Chinese Supplier", clusterId: "verification", status: "published" },
  { slug: "chinese-supplier-verification-checklist", title: "Chinese Supplier Verification Checklist", clusterId: "verification", status: "published" },
  { slug: "how-to-verify-a-chinese-business-license", title: "How to Verify a Chinese Business License", clusterId: "verification", status: "published" },
  { slug: "china-supplier-scam-red-flags", title: "China Supplier Scam Red Flags", clusterId: "verification", status: "published" },
  { slug: "how-factory-verification-works", title: "How Factory Verification Works", clusterId: "verification", status: "existing" },
  { slug: "manufacturer-vs-trading-company-china", title: "Manufacturer vs Trading Company in China", clusterId: "supplier-types", status: "published" },
  { slug: "china-distributor-vs-manufacturer", title: "China Distributor vs Manufacturer", clusterId: "supplier-types", status: "planned" },
  { slug: "exporter-vs-trading-company-china", title: "Exporter vs Trading Company in China", clusterId: "supplier-types", status: "planned" },
  { slug: "how-to-write-a-china-supplier-rfq", title: "How to Write a China Supplier RFQ", clusterId: "communication", status: "planned" },
  { slug: "questions-to-ask-china-suppliers", title: "Questions to Ask China Suppliers", clusterId: "communication", status: "planned" },
  { slug: "how-to-contact-chinese-suppliers", title: "How to Contact Chinese Suppliers", clusterId: "communication", status: "planned" },
  { slug: "china-supplier-quote-comparison", title: "How to Compare China Supplier Quotes", clusterId: "commercial", status: "planned" },
  { slug: "china-supplier-moq-guide", title: "China Supplier MOQ Guide", clusterId: "commercial", status: "planned" },
  { slug: "china-supplier-sample-order-guide", title: "China Supplier Sample Order Guide", clusterId: "commercial", status: "planned" },
  { slug: "china-supplier-lead-times", title: "China Supplier Lead Times", clusterId: "commercial", status: "planned" },
  { slug: "china-sourcing-payment-risk", title: "China Sourcing Payment Risk", clusterId: "risk-control", status: "planned" },
  { slug: "china-supplier-quality-control", title: "China Supplier Quality Control", clusterId: "risk-control", status: "planned" },
  { slug: "china-supplier-due-diligence", title: "China Supplier Due Diligence", clusterId: "risk-control", status: "planned" },
  { slug: "how-to-work-with-a-china-supplier", title: "How to Work with a China Supplier", clusterId: "operations", status: "planned" },
  { slug: "china-supplier-order-process", title: "China Supplier Order Process", clusterId: "operations", status: "planned" },
  { slug: "use-verified-factory-contacts", title: "How to Use Verified Factory Contacts", clusterId: "operations", status: "existing" },
];

const commonCta: GuideSection[] = [
  { heading: "Use this with FactoryRoster", paragraphs: ["FactoryRoster is a research directory, not a transaction intermediary. Use supplier profiles to compare public business details and verification checks, then confirm current product, commercial, compliance, and payment details directly with the supplier."] },
  { heading: "Next steps", bullets: ["Search verified China suppliers by industry and supplier type.", "Review the verification checks and evidence notes on the profile.", "Use the Verification page to understand what each check does and does not prove."] },
];

const verificationGuides: GuideRecord[] = [
  {
    slug: "how-to-verify-a-chinese-supplier",
    title: "How to Verify a Chinese Supplier",
    topic: "Verification",
    clusterId: "verification",
    summary: "A practical, evidence-led process for checking a Chinese supplier before you share a purchase brief or request payment details.",
    readTime: 12,
    seoTitle: "How to Verify a Chinese Supplier Before Buying",
    seoDescription: "Learn how to check a Chinese supplier's registration, contact details, supply evidence, and commercial fit before outreach.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["Verify a Chinese supplier in layers: confirm the legal entity, independently check a working business contact, review evidence that matches the supplier type, and then validate whether the supplier can actually serve your product, MOQ, market, and timeline. A listing or certificate is a starting point, not proof that every order will be successful."] },
      { heading: "1. Start with the exact legal entity", paragraphs: ["Ask for the registered Chinese company name, unified social credit code, registered address, legal representative, and the name used on invoices or contracts. Compare the information across the supplier's website, quotation, bank details, catalog, and any government registration source available to you.", "Do not treat an English trading name as the legal entity. Similar names, group companies, and sales offices can create confusion. Record the entity you actually intend to contract with."] },
      { heading: "2. Check the business contact", numbered: ["Use a domain email or a contact channel that can be tied to the business, while recognizing that small suppliers may use widely used messaging platforms.", "Call or message using details obtained independently from the supplier's first message when possible.", "Ask the contact to confirm the legal company name, address, product scope, and their role.", "Look for consistency over time: changing names, urgent payment requests, or refusal to confirm basic details are warning signs."] },
      { heading: "3. Match supply evidence to the supplier type", paragraphs: ["A manufacturer should be able to explain its production site, process, equipment, or factory evidence. An authorized distributor or first-tier agent should be able to explain its authorization or supplier relationship. A trading company may be suitable, but the evidence should describe its supply chain rather than imply it owns a factory. Exporters should show export capability; wholesalers should show inventory or fulfillment capability.", "The right question is not 'Can you send a certificate?' but 'What evidence supports the specific role you are claiming?'"] },
      { heading: "4. Validate product and commercial fit", bullets: ["Confirm product specifications, materials, packaging, customization, and compliance needs in writing.", "Ask for MOQ, sample availability, realistic lead time, destination-market experience, and whether private label is supported.", "Compare the quote, payment instructions, beneficiary name, and contract entity.", "Use a sample or small order to validate process before committing to a larger order when appropriate."] },
      { heading: "Red flags that deserve a pause", bullets: ["The beneficiary account name does not match the contracting entity and the explanation is unclear.", "The supplier will not share a legal entity name or keeps changing the company identity.", "Pressure to pay immediately, especially through an unrelated personal account or unusual channel.", "Evidence is generic, expired, unrelated to the product, or presented as proof of guarantees it cannot support.", "The supplier claims to be a factory but cannot explain production, ownership, or the relationship to the actual maker."] },
      { heading: "What verification does not prove", paragraphs: ["Verification does not guarantee product quality, delivery, pricing, exclusivity, regulatory compliance in your destination market, or a successful transaction. It does not replace samples, contracts, inspections, secure payment controls, sanctions screening, or professional legal and trade advice."] },
      ...commonCta,
    ],
  },
  {
    slug: "chinese-supplier-verification-checklist",
    title: "Chinese Supplier Verification Checklist",
    topic: "Verification",
    clusterId: "verification",
    summary: "A reusable checklist for reviewing registration, contacts, supply evidence, product fit, and risk before you shortlist a supplier.",
    readTime: 10,
    seoTitle: "Chinese Supplier Verification Checklist",
    seoDescription: "Downloadable-style checklist for verifying a Chinese supplier's legal identity, contacts, evidence, products, and commercial fit.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["A useful supplier checklist separates facts you can verify from claims you still need to test. Start with the legal entity and business contact, then review supply evidence appropriate to the supplier type. Finish with product, MOQ, sample, export, and payment questions before moving a supplier into an active buying process."] },
      { heading: "Identity and registration", bullets: ["Registered Chinese name and consistent English name.", "Unified social credit code or equivalent registration reference.", "Registered address and operating location explained if they differ.", "Legal representative and contracting entity identified.", "Invoice, contract, quotation, and beneficiary names compared."] },
      { heading: "Business contact", bullets: ["At least one working business contact verified.", "Contact person and role recorded.", "Company domain, email, phone, and messaging details compared.", "A callback or independent contact check completed.", "Unusual changes in identity or payment instructions documented."] },
      { heading: "Supply evidence by supplier type", numbered: ["Manufacturer: factory evidence such as a site, process, equipment, or production relationship.", "Authorized distributor: authorization evidence that identifies the principal, scope, and validity.", "First-tier agent: authorization or supplier relationship evidence.", "Trading company: supply-chain evidence and a clear explanation of the actual maker.", "Exporter: export evidence, destination-market experience, or fulfillment capability.", "Wholesaler: inventory or fulfillment evidence that supports the claimed availability."] },
      { heading: "Product and order fit", bullets: ["Product specifications and materials confirmed.", "MOQ level and small-batch or sample support recorded.", "Customization/private-label capability confirmed rather than assumed.", "Lead time, packaging, shipping terms, and destination market discussed.", "Certifications and test reports checked for the exact product and market."] },
      { heading: "How to use the checklist", paragraphs: ["Keep a dated record of each check and label it verified, pending, not applicable, or unresolved. A supplier should not become 'approved' simply because it answered quickly. Use unresolved items to shape your next question, sample order, inspection plan, and payment controls."] },
      { heading: "What verification does not prove", paragraphs: ["The checklist reduces avoidable uncertainty; it does not guarantee quality, delivery, pricing, or transaction outcomes. Re-check time-sensitive facts before every meaningful order."] },
      ...commonCta,
    ],
  },
  {
    slug: "manufacturer-vs-trading-company-china",
    title: "Manufacturer vs Trading Company in China",
    topic: "Supplier Types",
    clusterId: "supplier-types",
    summary: "Understand when a manufacturer, trading company, exporter, or distributor may be the better fit for an overseas order.",
    readTime: 11,
    seoTitle: "Manufacturer vs Trading Company in China",
    seoDescription: "Compare Chinese manufacturers and trading companies by MOQ, product range, communication, supply evidence, and order fit.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["A manufacturer makes products or controls production; a trading company coordinates supply from one or more manufacturers. Neither model is automatically better. Choose based on order size, product complexity, required customization, speed, communication, export support, and the evidence you can verify."] },
      { heading: "What a manufacturer may be best for", bullets: ["Repeatable products, custom tooling, process control, or private label at a suitable volume.", "A buyer who can manage technical specifications, samples, inspections, and production timelines.", "Direct visibility into production evidence when the factory relationship is real and current."] },
      { heading: "What a trading company may be best for", bullets: ["Small or mixed orders that would be inefficient to place with several factories.", "Broader catalogs, export coordination, packaging, consolidation, or faster supplier matching.", "Buyers who need one commercial contact while the trading company manages multiple sources."] },
      { heading: "Questions that reveal the model", numbered: ["Which legal entity will appear on the contract and invoice?", "Which company makes the product and where is it produced?", "What is the relationship between the seller and the production site?", "Can the supplier support samples, inspections, customization, and after-sales issues?", "Which claims are based on direct evidence, and which are supplied by a partner?"] },
      { heading: "Avoid the most common mistake", paragraphs: ["Do not call a trading company a manufacturer because it has a large catalog or uses factory photographs. Factory evidence belongs to the manufacturer relationship it actually supports. A credible trading company can still be a strong supplier; clarity about the supply model makes the relationship safer and easier to manage."] },
      { heading: "What verification does not prove", paragraphs: ["A verified supplier profile confirms specific registration, contact, and supply evidence checks. It does not guarantee that a supplier can meet every specification, price, quantity, or delivery date."] },
      ...commonCta,
    ],
  },
  {
    slug: "how-to-verify-a-chinese-business-license",
    title: "How to Verify a Chinese Business License",
    topic: "Verification",
    clusterId: "verification",
    summary: "Learn which business-license details to compare and how to handle mismatches before you contract with a Chinese supplier.",
    readTime: 9,
    seoTitle: "How to Verify a Chinese Business License",
    seoDescription: "A practical guide to comparing Chinese business-license details with supplier quotes, contracts, contacts, and payment instructions.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["Verify the legal name, unified social credit code, legal representative, registered address, business scope, and status shown on the license or registration record. Compare them to the entity on the quotation, contract, invoice, bank account, website, and contact signature. Resolve mismatches before sending a deposit."] },
      { heading: "Details to record", bullets: ["Chinese legal entity name and any translated name.", "Unified social credit code.", "Registration status and dates.", "Legal representative.", "Registered address and business scope.", "Whether the business scope reasonably covers the goods or services discussed."] },
      { heading: "A practical comparison process", numbered: ["Ask for a clear copy or official registration reference, not a cropped screenshot with key fields missing.", "Transcribe the legal name and code exactly; do not rely on a translation alone.", "Compare the entity with the supplier's quotation, contract, invoice, and payment beneficiary.", "Ask why an operating address, sales company, or export agent differs from the registered entity.", "Record the date of the check because registration and operating status can change."] },
      { heading: "Mismatches that need explanation", bullets: ["A personal account is requested for a company purchase.", "The beneficiary is a different company with no documented relationship.", "The business scope appears unrelated to the product and no supply relationship is explained.", "The company name changes between the quote, contract, and invoice.", "The supplier refuses to identify which entity carries the commercial obligation."] },
      { heading: "What a license cannot tell you", paragraphs: ["A business license can support identity and registration checks, but it cannot confirm current inventory, product quality, factory ownership, authorization, export performance, or honest commercial behavior. Pair it with contact and supply evidence, samples, and transaction controls."] },
      ...commonCta,
    ],
  },
  {
    slug: "china-supplier-scam-red-flags",
    title: "China Supplier Scam Red Flags",
    topic: "Risk Control",
    clusterId: "risk-control",
    summary: "Recognize identity, payment, evidence, and urgency signals that deserve a pause and a second check.",
    readTime: 10,
    seoTitle: "China Supplier Scam Red Flags to Check Before Payment",
    seoDescription: "Common China supplier scam red flags involving company identity, payment accounts, evidence, urgency, and inconsistent communication.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["The strongest red flags are combinations: an unclear legal entity, pressure to pay, a beneficiary mismatch, generic or recycled evidence, and refusal to answer basic questions. One unusual detail may have an innocent explanation; a pattern of evasiveness should change your next step."] },
      { heading: "Identity and communication red flags", bullets: ["The seller will not provide a legal company name or registration reference.", "The person, email domain, contract entity, and payment beneficiary keep changing.", "The supplier claims factory status but cannot explain its production relationship.", "Answers are copied, contradictory, or avoid the exact product and quantity questions."] },
      { heading: "Payment red flags", bullets: ["Urgency or a last-minute discount conditional on immediate payment.", "Payment to a personal account or unrelated company without a documented reason.", "Requests to move away from the agreed channel just before payment.", "A new beneficiary account appears after the quote or contract is approved."] },
      { heading: "Evidence red flags", bullets: ["Certificates are expired, generic, cropped, or for a different entity or product.", "Factory photographs cannot be tied to the supplier's legal entity or current site.", "Evidence is presented as a guarantee of quality, delivery, or transaction success.", "The supplier refuses a sample, inspection, video call, or basic product documentation."] },
      { heading: "A safer response", numbered: ["Pause the payment and preserve the messages, files, and account details.", "Repeat the legal-entity and beneficiary check through an independent channel.", "Ask one precise question that requires evidence, not reassurance.", "Use a sample, inspection, staged payment, and written contract where appropriate.", "Escalate to professional trade, legal, or payment advice for high-value orders."] },
      { heading: "What verification does not prove", paragraphs: ["A verified listing is not a warranty against fraud. It means specific checks were completed before publication; current behavior and transaction decisions still require buyer diligence."] },
      ...commonCta,
    ],
  },
  {
    slug: "how-factory-verification-works",
    title: "How Factory Verification Works",
    topic: "Verification",
    clusterId: "verification",
    summary: "Understand the three checks required before a factory profile is publicly listed and what each check can—and cannot—tell you.",
    readTime: 8,
    seoTitle: "How Factory Verification Works | FactoryRoster",
    seoDescription: "Learn how FactoryRoster reviews government registration, business contact, and factory evidence before listing a manufacturer.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    sections: [
      { heading: "The short answer", paragraphs: ["FactoryRoster requires Government Registration, Business Contact, and Factory Evidence checks before a manufacturer profile is publicly listed. The checks establish a documented basis for a factory record; they are not a guarantee of product quality, pricing, delivery, or commercial performance."] },
      { heading: "The three checks", bullets: ["Government Registration: the legal entity and registration details are reviewed against available records.", "Business Contact: a working business contact channel is checked and recorded.", "Factory Evidence: evidence appropriate to the manufacturer's production relationship is reviewed."] },
      { heading: "Why the checks are separate", paragraphs: ["A registered company may not be the company selling your product. A working contact does not prove production capability. A factory photograph does not prove legal ownership. Separating the checks makes it easier to understand what has actually been verified and what still needs buyer diligence."] },
      { heading: "How buyers should use the result", numbered: ["Read the profile's supplier type, industry, supply model, and evidence labels.", "Use the record to build a shortlist, not to skip product and commercial validation.", "Ask for current specifications, MOQ, sample terms, lead time, certifications, and payment details.", "Keep the contracting entity and beneficiary aligned, and use appropriate inspection and payment controls."] },
      { heading: "What verification does not prove", paragraphs: ["Verification confirms specific facts at a point in time. It does not guarantee product quality, delivery, price, exclusivity, regulatory approval in your market, or a successful transaction. FactoryRoster does not participate in buyer-supplier transactions."] },
      ...commonCta,
    ],
  },
];

export const builtInGuides = verificationGuides;
export const publishedBuiltInGuides = builtInGuides.filter((guide) => guideRoadmap.some((item) => item.slug === guide.slug && item.status !== "planned"));

// These are fallback records for legacy URLs. Supabase remains the source of
// truth when those rows exist, but a temporary database outage must not turn
// established guide URLs into empty or missing pages.
export const legacyGuideFallbacks: GuideRecord[] = [
  {
    slug: "find-verified-china-manufacturers",
    title: "How to Find Verified China Manufacturers",
    topic: "Factory Search",
    clusterId: "discovery",
    summary: "Build a focused China manufacturer shortlist using verified supplier intelligence and buyer-side due diligence.",
    readTime: 9,
    seoTitle: "How to Find Verified China Manufacturers",
    seoDescription: "Build a China manufacturer shortlist using verified supplier intelligence and a practical buyer workflow.",
    publishedAt: "2026-09-01T08:00:00Z",
    source: "built-in",
    content: "Start with a precise product or industry query. Compare legal identity, supplier type, industry fit, verification labels, MOQ, sample support, and export experience. Contact a shortlist with the same RFQ, then confirm current specifications, lead time, certifications, beneficiary details, samples, and inspection plans. Verification supports research, but it is not a guarantee of product quality, pricing, delivery, or commercial performance.",
  },
  {
    slug: "use-verified-factory-contacts",
    title: "How to Use Verified Factory Contacts",
    topic: "Contact Intelligence",
    clusterId: "communication",
    summary: "Prepare effective outreach after unlocking a verified contact record, while keeping current commercial checks in place.",
    readTime: 8,
    seoTitle: "How to Use Verified Factory Contacts",
    seoDescription: "Use verified contact intelligence for focused factory outreach while keeping buyer due diligence in place.",
    publishedAt: "2026-09-01T08:00:00Z",
    source: "built-in",
    content: "Use the verified contact channel for a concise, specific introduction. Include product requirements, target quantity, destination market, compliance needs, and timing. Confirm the legal entity, beneficiary, sample terms, lead time, and current payment instructions before sharing sensitive information or arranging payment. FactoryRoster does not guarantee quality, delivery, pricing, or transaction outcomes.",
  },
];

const clusterByTopic: Record<string, GuideClusterId> = {
  "factory search": "discovery",
  verification: "verification",
  "supplier types": "supplier-types",
  "contact intelligence": "communication",
  "risk control": "risk-control",
};

export function clusterForTopic(topic: string): GuideClusterId {
  return clusterByTopic[topic.trim().toLowerCase()] ?? "discovery";
}

export function mergeGuides(rows: GuideDatabaseRow[] = []): GuideRecord[] {
  const bySlug = new Map<string, GuideRecord>();
  for (const guide of publishedBuiltInGuides) bySlug.set(guide.slug, guide);
  for (const guide of legacyGuideFallbacks) bySlug.set(guide.slug, guide);
  for (const row of rows) {
    if (!row.slug || !row.title || !row.content) continue;
    bySlug.set(row.slug, {
      slug: row.slug,
      title: row.title,
      topic: row.topic,
      clusterId: clusterForTopic(row.topic),
      summary: row.summary,
      readTime: row.read_time,
      seoTitle: row.seo_title || row.title,
      seoDescription: row.seo_description || row.summary,
      publishedAt: row.published_at || "2026-01-01T00:00:00Z",
      updatedAt: row.updated_at || undefined,
      content: row.content,
      source: "supabase",
    });
  }
  return [...bySlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBuiltInGuide(slug: string) {
  return publishedBuiltInGuides.find((guide) => guide.slug === slug);
}

export function getGuideBySlug(slug: string, rows: GuideDatabaseRow[] = []) {
  return mergeGuides(rows).find((guide) => guide.slug === slug) ?? getBuiltInGuide(slug);
}
