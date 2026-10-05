export type GuideClusterId =
  | "discovery"
  | "verification"
  | "supplier-types"
  | "communication"
  | "commercial"
  | "quality"
  | "shipping"
  | "locations";

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
  checklist?: string[];
  comparisonTable?: { headers: string[]; rows: string[][] };
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
  socialHooks?: string[];
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
  { id: "discovery", title: "Find Suppliers", description: "Find manufacturers and suppliers, build a shortlist, and understand where to search." },
  { id: "verification", title: "Verify Suppliers", description: "Check company identity, supplier evidence, business contacts, and risk signals before payment." },
  { id: "supplier-types", title: "Supplier Types", description: "Understand manufacturers, trading companies, distributors, exporters, wholesalers, and agents." },
  { id: "communication", title: "Contact & RFQ", description: "Contact suppliers, write better inquiries, and create comparable RFQs." },
  { id: "commercial", title: "Pricing & Negotiation", description: "Understand MOQ, quotations, payment terms, tooling, pricing, and negotiation trade-offs." },
  { id: "quality", title: "Samples & Quality", description: "Order and approve samples, define quality expectations, and prepare for inspection." },
  { id: "shipping", title: "Shipping & Import", description: "Understand Incoterms, freight, landed cost, customs, and import responsibilities." },
  { id: "locations", title: "Sourcing Locations", description: "Navigate manufacturing hubs, wholesale markets, trade fairs, and major sourcing cities." },
];

export const guideJourneyOrder: GuideClusterId[] = ["discovery", "verification", "communication", "commercial", "quality", "shipping"];

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
  { slug: "questions-to-ask-china-suppliers", title: "Questions to Ask China Suppliers", clusterId: "communication", status: "planned" },
  { slug: "china-supplier-quote-comparison", title: "How to Compare China Supplier Quotes", clusterId: "commercial", status: "planned" },
  { slug: "china-supplier-lead-times", title: "China Supplier Lead Times", clusterId: "commercial", status: "planned" },
  { slug: "china-sourcing-payment-risk", title: "China Sourcing Payment Risk", clusterId: "verification", status: "planned" },
  { slug: "china-quality-control-guide", title: "China Quality Control Guide", clusterId: "quality", status: "published" },
  { slug: "china-supplier-due-diligence", title: "China Supplier Due Diligence", clusterId: "verification", status: "planned" },
  { slug: "how-to-work-with-a-china-supplier", title: "How to Work with a China Supplier", clusterId: "communication", status: "planned" },
  { slug: "china-supplier-order-process", title: "China Supplier Order Process", clusterId: "quality", status: "planned" },
  { slug: "use-verified-factory-contacts", title: "How to Use Verified Factory Contacts", clusterId: "communication", status: "existing" },
  { slug: "how-to-find-manufacturers-in-china", title: "How to Find Manufacturers in China", clusterId: "discovery", status: "published" },
  { slug: "how-to-contact-chinese-manufacturers", title: "How to Contact Chinese Manufacturers", clusterId: "communication", status: "published" },
  { slug: "how-to-write-an-rfq", title: "How to Write an RFQ", clusterId: "communication", status: "published" },
  { slug: "moq-explained", title: "MOQ Explained", clusterId: "commercial", status: "published" },
  { slug: "how-to-negotiate-moq-with-chinese-suppliers", title: "How to Negotiate MOQ with Chinese Suppliers", clusterId: "commercial", status: "published" },
  { slug: "how-to-order-samples-from-china", title: "How to Order Samples from China", clusterId: "quality", status: "published" },
  { slug: "golden-sample-explained", title: "Golden Sample Explained", clusterId: "quality", status: "published" },
  { slug: "pre-shipment-inspection-checklist", title: "Pre-Shipment Inspection Checklist", clusterId: "quality", status: "published" },
  { slug: "fob-vs-exw-vs-ddp", title: "FOB vs EXW vs DDP", clusterId: "shipping", status: "published" },
  { slug: "shipping-from-china", title: "Shipping from China", clusterId: "shipping", status: "published" },
  { slug: "landed-cost-explained", title: "Landed Cost Explained", clusterId: "shipping", status: "published" },
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
    readTime: 8,
    seoTitle: "How to Verify a Chinese Supplier Before Buying",
    seoDescription: "Learn how to check a Chinese supplier's registration, contact details, supply evidence, and commercial fit before outreach.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in", socialHooks: ["How to verify a Chinese supplier before you share payment details", "The evidence question every supplier review should ask", "Why a business license is only one part of verification"],
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
    source: "built-in", socialHooks: ["A printable Chinese supplier verification checklist", "The 10 checks to complete before a supplier shortlist", "What to mark verified, pending, or unresolved"],
    sections: [
      { heading: "The short answer", paragraphs: ["A useful supplier checklist separates facts you can verify from claims you still need to test. Start with the legal entity and business contact, then review supply evidence appropriate to the supplier type. Finish with product, MOQ, sample, export, and payment questions before moving a supplier into an active buying process."] },
      { heading: "Printable verification checklist", checklist: ["Legal Chinese company name confirmed", "Unified Social Credit Code recorded", "Registered address checked", "Contract entity matches the quotation", "Bank beneficiary reviewed", "Supplier type and supply model confirmed", "Business contact independently checked", "Supply evidence matches the claimed supplier type", "MOQ, sample, lead time, and export fit recorded", "Open questions marked pending or unresolved"] },
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
    source: "built-in", socialHooks: ["Factory or trading company? Ask this before shortlisting", "How supplier type changes the evidence you need", "The difference between production evidence and supply-chain evidence"],
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
    source: "built-in", socialHooks: ["How to compare a Chinese business license with payment details", "The company-name mismatch that deserves a pause", "What a Chinese business license cannot prove"],
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
    clusterId: "verification",
    summary: "Recognize identity, payment, evidence, and urgency signals that deserve a pause and a second check.",
    readTime: 10,
    seoTitle: "China Supplier Scam Red Flags to Check Before Payment",
    seoDescription: "Common China supplier scam red flags involving company identity, payment accounts, evidence, urgency, and inconsistent communication.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in", socialHooks: ["China supplier red flags that deserve a second check", "Why urgency and beneficiary changes matter", "A red flag is not proof—but it is a reason to verify"],
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
    source: "built-in", socialHooks: ["What FactoryRoster verifies before listing a manufacturer", "Three checks that answer three different questions", "Verification is evidence, not a transaction guarantee"],
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

const secondBatchGuides: GuideRecord[] = [
  {
    slug: "how-to-find-manufacturers-in-china", title: "How to Find Manufacturers in China", topic: "Find Suppliers", clusterId: "discovery",
    summary: "A practical workflow for defining a product, finding relevant manufacturers, comparing capability, and building a shortlist before payment.", readTime: 10,
    seoTitle: "How to Find Manufacturers in China | FactoryRoster", seoDescription: "Learn where to find Chinese manufacturers, how to compare supplier fit, and how to verify a shortlist before payment.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["How to go from 20 China suppliers to 2 serious candidates", "Alibaba is only one way to find Chinese manufacturers", "The 8-step China manufacturer search workflow", "Factory or trading company? Ask this before shortlisting"],
    sections: [
      { heading: "The short answer", paragraphs: ["Finding a manufacturer in China is not one search. The process is: define the product → identify sourcing channels → build a longlist → verify supplier type → compare capability → request samples and RFQs → shortlist → verify before payment."] },
      { heading: "Define the product before searching", paragraphs: ["Write down the product category, material, dimensions, target quantity, MOQ tolerance, packaging, customization, compliance market, destination country, target price range, and timeline. A vague request produces vague quotes because suppliers make different assumptions about materials, finish, packaging, and quantity. A clear brief lets you compare like with like and quickly see which suppliers are not a fit."] },
      { heading: "Where to find manufacturers", bullets: ["Alibaba can provide broad international discovery and platform-native communication.", "1688 can expose China-market suppliers, but buyers may need translation, local payment, and export support.", "Made-in-China and Global Sources can be useful for category discovery and export-oriented suppliers.", "Trade fairs, the Canton Fair, and industry clusters can provide direct conversations and factory context.", "Google, sourcing directories, customs/import databases, referrals, sourcing agents, and existing buyer networks each reveal different parts of the market."], callout: "No channel is automatically best. Match the channel to your language, order size, product complexity, need for export support, and ability to verify the supplier." },
      { heading: "Use FactoryRoster as a research layer", paragraphs: ["FactoryRoster is useful when the buyer wants to research supplier identity, supplier type, verification evidence, industries, and verified contact intelligence. It is one research input, not the only sourcing channel and not a substitute for samples, contracts, inspections, or payment diligence."] },
      { heading: "Manufacturer or trading company?", paragraphs: ["A manufacturer may be the better fit for repeat production, tooling, or private label. A trading company, exporter, distributor, or wholesaler may be more suitable for low MOQ, mixed products, existing inventory, or export coordination. Compare the claimed supplier type with the evidence; do not treat a trading supplier as a factory. Read the detailed comparison in Manufacturer vs Trading Company in China before making a decision."] },
      { heading: "Build a supplier longlist", numbered: ["Collect 10–20 candidates from three or four channels.", "Remove profiles with an unclear legal entity, mismatched product scope, or no workable contact path.", "Select about five serious candidates for the same RFQ.", "Choose two or three sample candidates after comparing fit, not just price.", "Move one or two suppliers forward only after evidence, sample, and commercial checks."], callout: "These are useful example ranges, not universal rules. Quality of fit matters more than a fixed number of suppliers." },
      { heading: "What to compare", bullets: ["Legal entity, supplier type, and product specialization.", "MOQ, customization, sample support, lead time, and export-market experience.", "Certifications and quality process relevant to the exact product and destination market.", "Communication quality, quotation completeness, payment terms, and responsiveness.", "Whether the supplier can explain production, packaging, inspection, and after-sales responsibilities."] },
      { heading: "An 8-step manufacturer search workflow", numbered: ["Define the product and destination requirements.", "Search three or four sourcing channels.", "Build a longlist and record the same fields for every candidate.", "Verify company identity and supplier type.", "Send one clear RFQ with quantity and specifications.", "Compare written quotes, samples, and unanswered questions.", "Shortlist suppliers and unlock contact only when there is a clear reason to reach out.", "Verify the supplier, contract entity, beneficiary, sample, and payment sequence before committing." ] },
      { heading: "Red flags that deserve a second check", bullets: ["The supplier claims it can make everything.", "The price is far below comparable quotes without a clear assumption.", "The company refuses legal information or gives inconsistent names.", "Production claims are vague and media looks copied or unrelated.", "The supplier pressures you to pay before specifications are clear.", "There is no reasonable sample, inspection, or quality process."], callout: "A red flag is not automatic proof of a scam. It is a signal to pause, ask a precise question, and verify through another channel." },
      { heading: "Verification limitations", paragraphs: ["FactoryRoster verification confirms specific facts at a point in time. It does not guarantee product quality, pricing, delivery, compliance, or transaction outcomes. Buyers should continue with product validation, written contracts, inspection, secure payment controls, and professional advice where appropriate."] },
      ...commonCta,
    ],
  },
  {
    slug: "how-to-contact-chinese-manufacturers", title: "How to Contact Chinese Manufacturers", topic: "Contact & RFQ", clusterId: "communication",
    summary: "Write a short, specific first message that gives a Chinese manufacturer enough information to answer usefully.", readTime: 8,
    seoTitle: "How to Contact Chinese Manufacturers | First Message Guide", seoDescription: "Learn what to include in a first supplier message, how to follow up, and when to use email, Alibaba, WhatsApp, or WeChat.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["Stop sending suppliers send catalog and best price", "What to include in your first message to a Chinese manufacturer", "A copy-paste first supplier message", "8 questions to ask before discussing price"],
    sections: [
      { heading: "The short answer", paragraphs: ["A good first supplier message is short, specific, and easy to answer. It explains who you are, what product you need, the key specification, quantity, destination, customization, questions, and next step."] },
      { heading: "What suppliers need from you", bullets: ["Product, quantity, specification, material, and dimensions.", "Target market, packaging, branding, sample request, expected timeline, and shipping destination.", "Any compliance or labeling requirements that affect the quote."] },
      { heading: "A weak opening", paragraphs: ["“Hi, send catalog and best price.” This gives the supplier no quantity, product definition, market, or commercial assumptions. The reply is likely to be a generic catalog or an incomparable headline price—not because every supplier is poor, but because the request is incomplete."] },
      { heading: "A copyable first message", callout: "Hello,\n\nWe are sourcing [product] for [market].\n\nInitial requirement:\n- Product: [name/reference]\n- Material/spec: [details]\n- Quantity: [quantity]\n- Packaging: [standard or custom]\n- Destination: [country/city]\n\nPlease confirm:\n1. MOQ\n2. Unit price and price basis\n3. Sample cost and timing\n4. Production lead time\n5. Customization options\n6. Relevant certifications\n\nPlease also confirm whether you are the manufacturer, distributor, exporter, or trading company.\n\nThank you." },
      { heading: "Email, Alibaba, WhatsApp, and WeChat", bullets: ["Email works well for formal requirements, drawings, photos, and a record that can be forwarded internally.", "Alibaba is useful for platform-native communication and keeping the initial inquiry in one marketplace context.", "WhatsApp or WeChat can be efficient for fast follow-up, photos, and short operational questions.", "Keep key commercial information in a saved, reviewable record even if the conversation moves to chat."] },
      { heading: "Questions to ask first", numbered: ["What is the MOQ and how is it calculated?", "What is the price basis and what is included?", "What is the sample cost and timing?", "What is the realistic production lead time?", "What customization is available?", "Are you the manufacturer or another supplier type?", "Which export markets do you serve?", "What payment terms do you use?"] },
      { heading: "Follow-up templates", bullets: ["No reply: “Following up on the [product] request below. Could you confirm MOQ, sample timing, and whether you can quote for [quantity] to [destination]?”", "Incomplete reply: “Thank you. To compare this quote, could you also confirm material, packaging, lead time, and the price basis?”", "Vague answer: “Could you answer the numbered questions one by one? If a point is not available, please mark it as pending.”"] },
      { heading: "Avoid these mistakes", bullets: ["Sending the same generic copy to hundreds of suppliers.", "Asking only for the lowest price while hiding quantity and destination.", "Requesting an NDA before sharing a useful product brief.", "Sending huge attachments immediately or negotiating before the specification is clear."] },
      ...commonCta,
    ],
  },
  {
    slug: "how-to-write-an-rfq", title: "How to Write an RFQ", topic: "Contact & RFQ", clusterId: "communication",
    summary: "A practical RFQ structure and copyable template for getting supplier quotes you can actually compare.", readTime: 10,
    seoTitle: "How to Write an RFQ for Chinese Manufacturers", seoDescription: "Learn what a China supplier RFQ should contain, with a copyable template and response comparison checklist.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["The 12 fields every China RFQ should include", "Why send me your best price gets bad supplier quotes", "A copy-paste RFQ template for Chinese manufacturers"],
    sections: [
      { heading: "The short answer", paragraphs: ["An RFQ turns a sourcing idea into a comparable request for quotation. It should give suppliers enough detail to price the same product, quantity, packaging, delivery assumptions, and timing. It is more specific than a casual inquiry, but it is not a purchase order or a promise to buy."] },
      { heading: "Inquiry, RFQ, and purchase order", bullets: ["An inquiry opens a conversation and tests general fit.", "An RFQ asks for a structured price and commercial response against known assumptions.", "A purchase order is a later buying instruction governed by the agreed commercial documents. The exact legal effect depends on the parties and contract."] },
      { heading: "What an RFQ should contain", checklist: ["Buyer or company introduction", "Product name and reference", "Drawing, photo, or reference sample", "Dimensions, materials, and relevant tolerances", "Quantity and forecast assumptions", "MOQ question", "Sample requirements", "Packaging and branding", "Compliance or documentation needs", "Destination country and city", "Requested shipping term", "Lead time, payment terms, and quotation validity"] },
      { heading: "Copyable RFQ template", callout: "Subject: RFQ — Custom Stainless Steel Bottle for [Market]\n\nHello,\n\nWe are sourcing custom stainless steel bottles for [market]. Please quote based on the information below.\n\nProduct: double-wall stainless steel bottle\nReference: [photo or drawing attached]\nMaterial: [grade if known]\nCapacity/dimensions: [details]\nQuantity: [initial quantity] with possible repeat orders\nColors/logo: [requirements]\nPackaging: [standard or custom box]\nDestination: [country/city]\nRequested shipping term: [state the term and named place if known]\nTarget sample date: [date]\n\nPlease confirm:\n1. MOQ and how it is calculated\n2. Unit price and price basis\n3. Sample fee, tooling, and timing\n4. Production lead time\n5. Packaging and branding options\n6. Available compliance documents\n7. Payment terms\n8. Quotation validity\n\nPlease identify whether you are the manufacturer, distributor, exporter, or trading company.\n\nThank you." },
      { heading: "Example: compare the responses", comparisonTable: { headers: ["Question", "Supplier A", "Supplier B", "Supplier C"], rows: [["MOQ", "500 pcs", "1,000 pcs per color", "300 pcs with setup fee"], ["Sample", "$45 / 10 days", "Free sample / 18 days", "$30 / 7 days"], ["Lead time", "35 days", "28 days", "45 days"], ["Packaging", "Standard included", "Custom + setup", "Not included"], ["Payment", "30/70", "50/50", "Not stated"]] } },
      { heading: "How many suppliers should receive an RFQ?", paragraphs: ["Five to ten qualified suppliers can be a useful starting range for a new product, but there is no universal rule. Quality of fit matters more than sending the request to a large number of unqualified contacts. Use the same assumptions so the responses are comparable."] },
      { heading: "Common mistakes", bullets: ["Incomplete specifications or no quantity.", "Asking only “best price.”", "No destination or unclear shipping term.", "Mixing a sample quote with a production quote.", "Ignoring tooling, packaging, compliance, or quotation validity.", "Comparing quotes that use different assumptions."] },
      ...commonCta,
    ],
  },
  {
    slug: "moq-explained", title: "MOQ Explained", topic: "MOQ, Pricing & Negotiation", clusterId: "commercial",
    summary: "Understand how Minimum Order Quantity is calculated, why packaging can change the real MOQ, and how to negotiate a smaller trial order.", readTime: 8,
    seoTitle: "MOQ Explained: China Supplier Minimum Order Quantity", seoDescription: "Learn how Chinese suppliers calculate MOQ for products, colors, packaging, materials, and production runs, with negotiation examples.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["Your product MOQ may be 500, but packaging MOQ may be 1,000", "6 ways to negotiate MOQ without simply demanding a lower number", "MOQ is not always measured in pieces", "Why low MOQ can come with a higher setup fee"],
    sections: [
      { heading: "The short answer", paragraphs: ["MOQ means Minimum Order Quantity, but the unit is not always a simple number of pieces. A supplier may calculate MOQ by pieces, cartons, color, size, SKU, material batch, production run, or packaging component. Always ask how the quoted MOQ is calculated."] },
      { heading: "Why manufacturers have MOQ", bullets: ["Raw-material MOQ from upstream suppliers.", "Machine setup, tooling, labor setup, printing, and production efficiency.", "Packaging minimums and supplier requirements upstream.", "The economics of changeovers, quality checks, and freight preparation."] },
      { heading: "Product MOQ versus packaging MOQ", paragraphs: ["A product may have a 500-piece MOQ while a custom printed box has a 1,000-unit MOQ. The result can be a 1,000-piece practical order, a packaging surcharge, or standard packaging for the first run. Ask for product MOQ, per-color or per-SKU MOQ, and packaging MOQ separately."] },
      { heading: "Illustrative examples", bullets: ["T-shirt: 500 pieces total, with 100 pieces per color.", "Bottle: 1,000 pieces per color for a custom finish.", "Custom box: 1,000 packaging units even if the product run is smaller.", "These are illustrative examples only, not fixed industry standards."] },
      { heading: "Can MOQ be negotiated?", numbered: ["Use stock materials and standard colors.", "Use standard packaging for a trial order.", "Accept a higher unit price for a smaller run.", "Combine variants where the supplier can run them together.", "Reuse existing tooling instead of requesting a new mold.", "Ask for a trial order and make any forecast or repeat commitment carefully."] },
      { heading: "A short MOQ negotiation script", callout: "We are testing this product with an initial order of [quantity]. Could you quote two options: your standard MOQ and a smaller trial run using stock material and standard packaging? Please show any setup fee, higher unit price, and the MOQ for each color or SKU." },
      { heading: "MOQ versus MOV", paragraphs: ["MOQ is Minimum Order Quantity. MOV is Minimum Order Value. A supplier may accept a low piece count if the order reaches a minimum dollar value, or may require both an item MOQ and an order-value threshold. Confirm which rule applies to your quote."] },
      { heading: "MOQ traps", bullets: ["Headline MOQ differs from customized MOQ.", "Sample quantity is confused with production MOQ.", "Per-color, per-SKU, material, and hidden packaging minimums.", "“Low MOQ” paired with a high setup fee or a different price basis."] },
      ...commonCta,
    ],
  },
  {
    slug: "how-to-order-samples-from-china", title: "How to Order Samples from China", topic: "Samples, Quality & Inspection", clusterId: "quality",
    summary: "Use samples to align specifications, test communication, and create a quality benchmark before a production order.", readTime: 9,
    seoTitle: "How to Order Samples from China", seoDescription: "Learn sample types, fees, shipping, approval records, comparison criteria, and red flags when sourcing from China.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["A good sample does not guarantee a good production run", "What to check before approving a supplier sample", "The difference between a prototype, pre-production sample, and golden sample", "Why looks good is not enough for sample approval"],
    sections: [
      { heading: "The short answer", paragraphs: ["A sample is a product and communication test, not proof that a supplier will always deliver identical quality. Use it to evaluate the product, align specifications, test packaging, compare suppliers, and create a written benchmark for later production."] },
      { heading: "Sample types", bullets: ["Off-the-shelf sample: an existing product used for initial evaluation.", "Customized sample: a product adjusted for material, color, logo, or packaging.", "Prototype: an early design or engineering version.", "Pre-production sample: a version made before a production run.", "Golden or approved sample: the agreed benchmark retained for comparison."] },
      { heading: "Information to include in a sample request", checklist: ["SKU or product reference", "Specification and material", "Dimensions and tolerances where relevant", "Color and logo", "Packaging and labeling", "Quantity", "Shipping address", "Courier preference or account details if relevant"] },
      { heading: "Sample fees and shipping", paragraphs: ["A sample can cost more per unit than a production order because setup, labor, customization, and courier handling are spread over a small quantity. There is no universal rule that samples must be free. Ask what is refundable, what is included, and what changes if a custom sample is required. DHL, FedEx, UPS, a supplier courier account, or a buyer courier account may be used; confirm current charges directly rather than relying on old rates."] },
      { heading: "How to compare samples", bullets: ["Appearance, dimensions, material, function, finish, packaging, labeling, defects, consistency, and documentation.", "Photograph the sample and record measurements, test notes, and the exact revision.", "Compare samples against the same written requirement, not memory or a marketing photograph."] },
      { heading: "Approval records", paragraphs: ["Record the date, supplier, version, photos, dimensions, test notes, and approved changes. A verbal “looks good” is not a reliable production benchmark. Mark the sample approved, revised, or rejected and keep the approved version available for later inspection."] },
      { heading: "Sample red flags", bullets: ["The supplier refuses a reasonable sample without explaining why.", "The sample differs from the quoted specification.", "Branding, dimensions, or materials change without explanation.", "Certificates do not relate to the sample or product.", "The supplier pressures you to order before approval."] },
      ...commonCta,
    ],
  },
  {
    slug: "fob-vs-exw-vs-ddp", title: "FOB vs EXW vs DDP", topic: "Shipping & Import", clusterId: "shipping",
    summary: "A practical comparison of EXW, FOB, and DDP responsibilities, questions, and trade-offs for China sourcing decisions.", readTime: 10,
    seoTitle: "FOB vs EXW vs DDP for China Sourcing", seoDescription: "Compare EXW, FOB, and DDP responsibilities, freight control, import questions, and common mistakes when buying from China.", publishedAt: "2026-10-05T00:00:00Z", source: "built-in", socialHooks: ["EXW, FOB or DDP? The simplest way to understand the difference", "Why the cheapest factory price may not mean the lowest landed cost", "8 questions to ask before accepting a DDP quote", "FOB does not mean the supplier handles all shipping"],
    sections: [
      { heading: "The short answer", paragraphs: ["EXW generally leaves the buyer with more transport responsibility from the seller's premises. FOB generally covers seller delivery through the named port and onboard stage for sea or inland waterway transport. DDP generally gives the seller extensive delivery responsibility to the named destination, including import clearance and duties under the Incoterm framework. The named place, transport mode, contract, and local rules still matter."] },
      { heading: "At-a-glance comparison", comparisonTable: { headers: ["Question", "EXW", "FOB", "DDP"], rows: [["Seller responsibility", "Goods available at premises", "Export-side delivery to named port/onboard stage", "Extensive delivery to named destination"], ["Export clearance", "Usually buyer responsibility", "Seller responsibility under the agreed term", "Seller responsibility under the agreed term"], ["Main freight", "Buyer", "Usually buyer", "Usually seller arranges"], ["Import clearance", "Buyer", "Buyer", "Seller framework responsibility; confirm who acts"], ["Duties/taxes", "Buyer", "Buyer", "Seller framework responsibility; confirm treatment"], ["Control", "High buyer control", "Shared with buyer-controlled main freight", "More seller-managed"], ["Common fit", "Experienced logistics buyer or pickup/consolidation", "Sea/inland waterway buyers wanting freight control", "Convenience where seller import capability is clear"]] } },
      { heading: "EXW explained", paragraphs: ["EXW can offer buyer control over pickup, consolidation, and the main freight decision, but the buyer may also carry more export-side logistics and documentation complexity. Ask who loads, who handles export clearance, and which local charges are excluded."] },
      { heading: "FOB explained", paragraphs: ["FOB is associated with a named port and sea or inland waterway transport context. Confirm the named port, export clearance, loading/on-board responsibility, origin charges, and which party controls the main freight. Avoid vague wording such as “FOB factory.”"] },
      { heading: "DDP explained", paragraphs: ["DDP can be convenient because the seller manages more of the delivery chain, but convenience does not remove questions. Ask who performs import clearance, who is importer of record, what duties and taxes are included, and which destination charges may remain. Confirm that the seller can legally and operationally handle the destination requirements."] },
      { heading: "Which should a beginner choose?", paragraphs: ["There is no universal best term. Consider freight experience, customs capability, shipment size, need for control, transparency, destination compliance, and your forwarder relationship. A lower unit price under EXW may not be cheaper after logistics; a DDP quote may hide assumptions that need to be documented."] },
      { heading: "Questions to ask a supplier", bullets: ["What named place or port applies?", "Is export clearance included?", "Is main freight included?", "Who performs import clearance?", "Are duties and taxes included?", "Who is importer of record?", "What destination charges may remain?", "Which documents will I receive?", "Which current Incoterm version is used in the contract?"] },
      { heading: "Commercial boundary", paragraphs: ["Incoterms allocate delivery responsibilities and risk or cost points; they do not replace the sales contract, product compliance requirements, payment terms, insurance decisions, or customs obligations. FactoryRoster is not a freight or legal adviser. Confirm the final term with the supplier and qualified professionals where appropriate."] },
      ...commonCta,
    ],
  },
];

const thirdBatchGuides: GuideRecord[] = [
  {
    slug: "how-to-negotiate-moq-with-chinese-suppliers",
    title: "How to Negotiate MOQ with Chinese Suppliers",
    topic: "MOQ, Pricing & Negotiation",
    clusterId: "commercial",
    summary: "A practical way to lower a trial-order MOQ by changing the material, packaging, setup, or order assumptions behind it.",
    readTime: 10,
    seoTitle: "How to Negotiate MOQ with Chinese Suppliers",
    seoDescription: "Learn what creates a Chinese supplier MOQ and how to negotiate a smaller trial order without hiding the cost trade-offs.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Do not ask suppliers to just lower the MOQ", "Eight ways to negotiate MOQ without changing the product", "Packaging may be the real reason your MOQ is high", "The best MOQ question is not what is your minimum"],
    sections: [
      { heading: "The short answer", paragraphs: ["You can often negotiate MOQ, but the most effective approach is not simply asking a supplier to lower the number. MOQ usually reflects raw materials, production setup, color or SKU minimums, packaging, printing, tooling, upstream supplier requirements, labor, and machine economics. The goal is to change the conditions that create the MOQ, then ask the supplier to show the effect on price, setup cost, and timing."] },
      { heading: "Start by asking what creates the MOQ", numbered: ["Is MOQ calculated per product, color, SKU, material, or production run?", "Is there a separate minimum for printing, tooling, labels, or packaging?", "Does the minimum come from your supplier or from an upstream material or packaging vendor?", "Would a stock material, standard color, or existing package remove a setup step?"], paragraphs: ["Different causes call for different solutions. A product MOQ caused by a machine run is a different negotiation from a printed-box MOQ. Ask for the basis in writing before comparing one supplier's number with another's."] },
      { heading: "Eight practical ways to negotiate MOQ", numbered: ["Use stock material instead of opening a special material batch.", "Reduce the number of colors or finishes in the first run.", "Reduce the number of SKUs while keeping the core product unchanged.", "Use standard packaging and delay custom printing until a repeat order.", "Accept a higher unit price for a smaller trial order.", "Pay a clearly stated setup or changeover fee.", "Use existing tooling rather than commissioning a new mold.", "Request a trial order with its own quantity, price, and quality assumptions."], paragraphs: ["You can also ask whether your order can be combined with an existing production run, but the supplier must confirm that timing, color, material, and quality controls remain suitable. None of these options is universal; they are questions that expose the trade-off instead of pretending the trade-off does not exist."] },
      { heading: "A good MOQ negotiation example", paragraphs: ["If the supplier's MOQ is 1,000 pieces and your first order is 300, do not send only “Can you do 300?” A more useful request is: “Could you quote a 300-piece trial order using stock material, one color, and standard packaging? Please show any setup fee or higher unit price separately, and confirm whether the 300 pieces can be made in the same production run as another order.” This gives the supplier several workable levers and gives you a quote you can evaluate."] },
      { heading: "What a quote should make visible", checklist: ["MOQ basis identified", "Per-color and per-SKU minimum checked", "Packaging and printing minimum checked", "Tooling, setup, and changeover cost shown", "Trial-order option requested", "Higher unit price understood", "Lead time and production assumptions recorded", "Repeat-order assumptions documented"] },
      { heading: "Bad negotiation patterns", bullets: ["“Your MOQ is too high” without explaining the trial requirement.", "“Another factory says 100” without comparing material, packaging, quality, or price basis.", "“Give me the lowest MOQ and lowest price” at the same time.", "Promising huge future volume without a credible forecast.", "Treating a sample quantity as if it were a normal production run."] },
      { heading: "When not to push MOQ lower", paragraphs: ["A smaller run can have worse economics, more manual setup, a higher unit price, a packaging compromise, or a longer wait for a suitable production slot. Those outcomes are possible, not automatic. If a supplier explains that a minimum protects material consistency or a required process, ask what alternative configuration would preserve the requirement before deciding whether the compromise is acceptable."] },
      { heading: "A copyable MOQ script", callout: "We are testing this product with an initial order of [quantity]. Could you quote two options: your standard MOQ and a smaller trial run using stock material and standard packaging? Please show any setup fee, higher unit price, MOQ per color or SKU, and the expected lead time for each option. We will compare the options against the same specification." },
      { heading: "Compare the trade-offs, not just the number", paragraphs: ["Put each option in a small comparison table with quantity, unit price, setup fee, packaging, lead time, sample status, inspection scope, and repeat-order assumptions. A 300-piece trial with a $200 setup fee may be more useful than a 500-piece offer that changes the material. A standard box may be acceptable for market testing, while a custom box may be essential for a retail launch. Make those decisions visible instead of hiding them inside a single quoted unit price.", "Ask the supplier to identify which assumptions are temporary. If the trial uses stock material, record whether the repeat order will use the same material or a new batch. If the first run combines with another customer's production, ask whether the color, finish, inspection, and delivery date remain under the same control. These questions help prevent a trial configuration from being mistaken for a repeat-order commitment."] },
      { heading: "Document the agreement before ordering", numbered: ["Write the selected MOQ option into the quotation or purchase document.", "Record the exact product, color, SKU, material, packaging, and quantity basis.", "Separate setup fees, tooling, artwork, and one-time charges from the recurring unit price.", "Confirm whether unused packaging or material remains the buyer's property.", "Agree what happens if the supplier cannot combine the run or misses the stated timing.", "Keep the approved sample and RFQ attached to the final option."], paragraphs: ["A lower MOQ is only useful if the supplier and buyer mean the same thing by the order. Put the decision in writing while the options are still fresh. Revisit the assumptions before a repeat order rather than copying the first quote automatically."] },
      { heading: "Use a trial order to learn", paragraphs: ["A trial order can answer more than whether the supplier accepts a smaller quantity. It can reveal how the supplier handles artwork, packaging, inspection, communication, delivery, and corrective action. Define what you want to learn before placing it. If the purpose is to test a product-market idea, standard packaging may be fine. If the purpose is to test production consistency, the trial should use the material, tooling, and process that a repeat order would actually use.", "Ask how the supplier will identify the trial lot and what happens to leftover materials or printed packaging. A clear answer makes the transition to a repeat order easier and reduces the chance that the buyer pays for a temporary configuration without understanding it."] },
      { heading: "The next step after MOQ", paragraphs: ["Once the supplier has explained the minimum, compare the trial order with your product brief, sample plan, packaging, inspection plan, and landed-cost assumptions. Read MOQ Explained for the terminology, then use How to Write an RFQ to ask multiple suppliers the same question. If the trial is approved, document the assumptions so a repeat order is not priced or produced on a different basis."], },
      ...commonCta,
    ],
  },
  {
    slug: "golden-sample-explained",
    title: "Golden Sample Explained",
    topic: "Samples, Quality & Inspection",
    clusterId: "quality",
    summary: "How to approve and record a versioned physical sample that can be used as a production and inspection benchmark.",
    readTime: 9,
    seoTitle: "Golden Sample Explained: How to Approve a Production Benchmark",
    seoDescription: "Learn what a golden sample is, what to record with it, and how buyers can use it during production and inspection.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Looks good is not sample approval", "Why every production order needs a versioned approved sample", "Golden sample versus pre-production sample", "A sample is useful only if you record what was approved"],
    sections: [
      { heading: "The short answer", paragraphs: ["A golden sample is the approved reference sample used as a benchmark for production and inspection. It is the agreed physical reference for a defined version of a product; it is not a guarantee of quality, delivery, or future batches. The value comes from recording exactly what was approved and keeping the reference available when questions arise."] },
      { heading: "Golden sample versus other sample types", comparisonTable: { headers: ["Type", "Purpose", "Typical decision"], rows: [["Off-the-shelf sample", "Initial evaluation", "Is this product family worth exploring?"], ["Prototype", "Design or engineering", "Does the concept work?"], ["Customized sample", "Logo, material, color, or packaging review", "Does the requested change look right?"], ["Pre-production sample", "Production setup approval", "Is this run configured correctly?"], ["Golden sample", "Approved benchmark", "What physical result should production and inspection compare with?"]] } },
      { heading: "What to record with a golden sample", checklist: ["Supplier and legal entity", "SKU, product name, and version number", "Date approved and approver", "Dimensions and relevant tolerances", "Materials and components", "Color, finish, logo, and artwork", "Packaging, labels, and inserts", "Photos from multiple angles", "Test results and test conditions", "Approved deviations and open limitations"] },
      { heading: "Physical versus digital reference", paragraphs: ["A photograph, PDF, or message can help people identify the version, but it cannot fully replace the physical sample for many appearance, texture, fit, finish, or assembly decisions. Keep digital records with the physical sample: photographs, measurements, test notes, packaging views, and the approval message. The record should make it difficult to confuse a later revision with the approved reference."] },
      { heading: "Who keeps the golden sample?", paragraphs: ["If the practical arrangements allow, the buyer keeps one reference and the supplier keeps one reference. An inspection company may receive the reference information or a sample when the inspection plan requires it. This is a useful operating pattern, not a universal legal rule. Record where each reference is stored and how it is identified."] },
      { heading: "Approval checklist", checklist: ["Version number matches the purchase specification", "Measurements recorded", "Material and finish checked", "Logo and artwork checked", "Packaging and labels included", "Function tested where relevant", "Approved deviations documented", "Supplier and buyer approval dated", "Reference storage location recorded"] },
      { heading: "If production differs", paragraphs: ["Do not settle a difference with “looks close enough.” Compare the production item with the specification, the approved sample, the agreed tolerance, and the inspection standard. Photograph the difference, identify how many units are affected, and ask whether it is a documented deviation, a rework issue, or a failure against the agreed requirement."] },
      { heading: "Common mistakes", bullets: ["Approving verbally without a version or date.", "Changing the sample after approval without recording a new revision.", "Leaving packaging outside the sample approval.", "Keeping only a supplier copy or only a buyer photograph.", "Recording no tolerance for a measurement that matters.", "Using a prototype as the final production benchmark."] },
      { heading: "A practical approval workflow", numbered: ["Ask the supplier to label the sample with the product, version, and date.", "Measure the dimensions that affect fit, function, or packaging.", "Compare material, color, finish, artwork, assembly, and included parts against the brief.", "Test the functions that a buyer or end user will actually rely on.", "Photograph the sample beside a ruler, color reference, or packaging reference where useful.", "List every approved deviation instead of relying on a general approval message.", "Sign or otherwise confirm the exact version that will be used for production."], paragraphs: ["The workflow can be lightweight for a simple stock product and more formal for a customized or regulated product. The important point is traceability: someone reviewing the order later should be able to tell which object was approved, what it contained, and what was intentionally different."] },
      { heading: "Use the sample during production and inspection", paragraphs: ["A golden sample is most useful when it is available at the moment a question is asked. Refer to it in the production specification, inspection instructions, and corrective-action notes. If the sample is too valuable to ship, use controlled photographs and measurements together with a clear description of the physical reference. Do not let a supplier or inspector compare against an unapproved photograph while the buyer assumes it represents the final version.", "When a defect is found, identify whether it is a difference from the golden sample, a difference from the written tolerance, or a new requirement that was never approved. Those are different conversations and may lead to different corrective actions."] },
      { heading: "When the design changes", paragraphs: ["A new logo, material, package, color, or tolerance can create a new sample version. Retire the old reference from active instructions, label it as superseded, and record who approved the new version and when. If only one part changes, say exactly which part changed and which parts remain unchanged. Version control prevents an apparently minor update from creating two competing production standards."] },
      { heading: "A golden sample does not replace a specification", paragraphs: ["Some properties are difficult to judge from a physical sample alone. A sample may look correct while the material grade, electrical rating, dimensions inside an assembly, labeling language, or test method remains unclear. Pair the sample with measurable requirements and the documents needed for the actual destination market. If a property cannot be verified visually, name the test, record the result, or mark it as still pending.", "Likewise, a sample can be excellent while the supplier's production process is not stable. Use the sample to agree the target, then use quality controls and inspection to see whether the production lot conforms to that target. This distinction helps buyers avoid treating sample approval as an all-purpose guarantee."] },
      ...commonCta,
    ],
  },
  {
    slug: "china-quality-control-guide",
    title: "China Quality Control Guide",
    topic: "Samples, Quality & Inspection",
    clusterId: "quality",
    summary: "A buyer-side quality-control workflow from written specification and sample approval through production, inspection, and shipment release.",
    readTime: 12,
    seoTitle: "China Quality Control Guide for Importers",
    seoDescription: "A practical China quality-control workflow for overseas buyers covering specifications, samples, production checks, inspection, and shipment release.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Quality control starts before production", "Why final inspection cannot fix a bad specification", "Supplier QC and buyer QC are not the same thing", "The six-stage China quality-control workflow"],
    sections: [
      { heading: "The short answer", paragraphs: ["Quality control is not a single final inspection. A buyer-side workflow should connect a written specification to sample approval, pre-production checks, production monitoring, inspection, and shipment release. Each stage reduces a different kind of uncertainty. A final inspection can find defects, but it cannot rewrite an unclear requirement or recover every lost production option."] },
      { heading: "Quality starts with the specification", paragraphs: ["If a requirement is not written, it is difficult to inspect consistently. Record dimensions, materials, tolerances, color, finish, function, assembly, packaging, labels, testing, and defect expectations. Identify what is critical to safety or function, what is a major commercial defect, and what is a minor appearance issue for this product. The definitions should match the buyer's actual use rather than a generic template."] },
      { heading: "Define defects in plain language", bullets: ["Critical: a condition that could create a serious safety, legal, or functional risk for the intended use.", "Major: a condition that materially affects use, saleability, fit, function, or the agreed specification.", "Minor: a smaller deviation that does not materially prevent the intended use but still matters to the agreed appearance or workmanship."], paragraphs: ["These are concepts, not a universal acceptance table. If an AQL or sampling plan is used, agree the applicable standard, lot definition, sample size, and acceptance criteria before production or inspection."] },
      { heading: "The six quality-control stages", numbered: ["Product specification: define the measurable requirement and acceptance basis.", "Sample approval: compare the product and packaging against the brief and approve a versioned reference.", "Incoming material or pre-production checks: confirm materials, components, artwork, tooling, and setup before volume production.", "During-production inspection: identify drift while correction is still possible.", "Pre-shipment inspection: check quantity, workmanship, function, packaging, labels, and defects before release.", "Container or loading checks where relevant: confirm carton identity, loading condition, seals, and documents for the shipment plan."] },
      { heading: "Supplier QC and buyer QC", paragraphs: ["Supplier quality control is useful because the supplier sees the process every day and can catch issues early. It is not the same as an independent buyer-side review. Ask what the supplier checks, when it checks, what records exist, and how nonconforming units are controlled. If an independent inspection is appropriate, define its scope and decision role rather than assuming it can inspect every risk."] },
      { heading: "Golden samples and inspection timing", paragraphs: ["Use Golden Sample Explained to create a reference that production and inspection can understand. An inspection that happens too early may miss late-stage defects; one that happens after everything is packed or shipped may leave few correction options. Pre-shipment inspection generally needs enough finished and packed product to sample meaningfully, but the right timing and coverage depend on the product, order, and inspection plan."] },
      { heading: "What an inspection report should include", checklist: ["Order, SKU, and lot identity", "Quantity produced and quantity checked", "Sampling basis and sample size", "Defects by type and quantity", "Measurements and test results", "Function and workmanship checks", "Packaging and labeling checks", "Photographs and test conditions", "Pass, fail, or conditional result", "Unresolved issues and recommended disposition"] },
      { heading: "Build a risk-based QC plan", paragraphs: ["Not every product needs the same depth of control. Start with the consequences of a failure: safety or regulatory exposure, expensive rework, customer returns, brand damage, or a missed launch date. Give more attention to the dimensions, materials, functions, and labels that create those consequences. For a simple stock item, a clear specification and sample check may be enough for an early order; for a customized electrical or safety-sensitive product, the plan may need documented tests, component controls, and specialist review.", "Ask the supplier which process steps are difficult to reverse. Material substitution, artwork approval, tooling, adhesive selection, firmware, and final assembly can all become expensive to change after the run has progressed. Put an early check at the point where it can still prevent a large batch from being produced on the wrong assumption."] },
      { heading: "Write the inspection instruction", checklist: ["Product and version identified", "Critical dimensions and tolerances listed", "Materials and approved components listed", "Functional test method and conditions defined", "Packaging and label artwork attached", "Sampling or lot basis explained", "Defect examples or reference photos included", "Decision owner identified", "Rework and re-inspection process stated"] },
      { heading: "Keep quality records connected", paragraphs: ["Store the RFQ, approved sample, production notes, test results, inspection report, photographs, corrective actions, and shipment decision together. A report without the specification it used is difficult to interpret. A sample without the version that was approved can create a new dispute. A corrective-action message without a re-inspection result leaves the final disposition unclear.", "Use a simple status such as open, awaiting supplier action, re-inspection required, accepted with documented deviation, or released. This gives the buyer and supplier a shared view of what still needs attention without turning the process into an elaborate software project."] },
      { heading: "Communicate findings without overclaiming", paragraphs: ["Describe what was observed, where it was observed, how many units were affected, and which requirement or reference was used. Avoid saying that a supplier is generally “bad” based on one finding or that a single inspection proves every unit is perfect. Precise findings are easier to correct and easier to use in a later supplier comparison.", "If the supplier disputes a measurement or test, agree the method and conditions before repeating it. If the buyer accepts a deviation, record the scope and whether it applies to one lot or future orders. An explicit decision is safer than leaving a difference to informal chat."] },
      { heading: "If inspection fails", numbered: ["Pause shipment release while the finding is understood.", "Quantify the affected units, defect pattern, and commercial impact.", "Agree a corrective action or rework plan with the supplier.", "Re-inspect an appropriate scope when rework is complete.", "Document the disposition and the buyer's shipment decision."] },
      { heading: "A repeatable buyer workflow", numbered: ["Create the requirement before requesting a final quote.", "Approve a sample and record the version.", "Ask the supplier to confirm the process and material assumptions.", "Check early inputs or pre-production setup where the risk justifies it.", "Monitor production or request evidence at agreed milestones.", "Run the pre-shipment inspection against the same reference.", "Release, hold, rework, or reject based on documented findings.", "Capture lessons for the next RFQ and supplier review."] },
      { heading: "Match controls to the product", paragraphs: ["A quality plan for a textile accessory may focus on dimensions, color, stitching, labels, and packaging. A molded part may need material, weight, fit, flash, and tooling checks. An electronic product may need component identity, firmware, charging, safety, and functional tests. A food-contact or child-related product may require destination-specific documentation and professional compliance review. The right plan comes from the product's failure modes, not from copying a checklist designed for another category.", "Ask the supplier to explain where variation is most likely. If the answer is vague, turn it into a measurable question: which dimension drifts, which component is substituted, which color batch changes, or which packaging step is manual? A useful control is one that makes the risk visible early enough to act."] },
      { heading: "Use milestones when the order is complex", numbered: ["Specification and artwork freeze", "Material or component approval", "Tooling or setup confirmation", "First article or pre-production sample", "Early production check", "Mid-production evidence or inspection", "Final quantity, packaging, and PSI", "Shipment release and lessons learned"], paragraphs: ["Not every order needs every milestone. For a straightforward repeat order, a sample, supplier QC record, and PSI may be sufficient. For a new customized product, milestones reduce the chance that a late discovery affects the entire batch. Agree which milestones are required, who supplies evidence, and what happens if a milestone is not met."] },
      { heading: "How to review supplier responses", paragraphs: ["A supplier's quality answer should describe an action, an owner, a timing, and a record. “We check quality carefully” is a claim; “we measure the first-off sample against the approved drawing, record the result, and hold production if it is outside tolerance” is a process description that can be discussed and tested. Do not demand documents that the supplier cannot reasonably maintain, but do ask for enough evidence to make the risk visible.", "When comparing suppliers, note whether each one can explain material traceability, nonconforming-unit control, rework, inspection access, and corrective action. A lower quote may still be suitable, but the buyer should understand which controls are included and which must be added."] },
      { heading: "What QC cannot guarantee", paragraphs: ["A quality-control plan does not guarantee future batches, product compliance in every destination, supplier financial stability, contract enforcement, or zero defects. It creates a clearer decision process and earlier opportunities to correct a problem. Keep current specifications, approvals, test records, inspection reports, and shipment decisions together."] },
      ...commonCta,
    ],
  },
  {
    slug: "pre-shipment-inspection-checklist",
    title: "Pre-Shipment Inspection Checklist",
    topic: "Samples, Quality & Inspection",
    clusterId: "quality",
    summary: "A practical checklist for checking quantity, product condition, function, packaging, and defects before releasing a China shipment.",
    readTime: 10,
    seoTitle: "Pre-Shipment Inspection Checklist for China Orders",
    seoDescription: "Use this pre-shipment inspection checklist to prepare specifications, check product and packaging, document defects, and handle a failed result.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Fifteen things to check before releasing a China shipment", "A PASS inspection is not a product guarantee", "What to do when a pre-shipment inspection fails", "Do not inspect without an approved specification"],
    sections: [
      { heading: "The short answer", paragraphs: ["A pre-shipment inspection (PSI) is a shipment-before-release check of quantity, condition, workmanship, packaging, labels, and agreed tests. It is a useful input to a buyer's shipment decision, not a universal guarantee or insurance policy. The inspection is only as meaningful as the specification, sample basis, timing, and scope agreed in advance."] },
      { heading: "Before inspection", checklist: ["Approved product specification available", "Purchase order or order summary available", "Approved or golden sample available", "Packaging and label requirements available", "Ordered quantity confirmed", "Inspection location and timing confirmed", "Supplier contact and site access confirmed", "Inspection scope and sampling basis agreed"] },
      { heading: "Product checks", checklist: ["Appearance and workmanship", "Dimensions and tolerances", "Materials and components", "Function and assembly", "Color and finish", "Accessories and included parts", "Logo, artwork, and markings", "Consistency across the sampled units"] },
      { heading: "Packaging checks", checklist: ["Unit packaging", "Carton quantity and configuration", "Carton dimensions and weight where relevant", "Shipping marks and labels", "Barcode and product labels", "Manuals, inserts, and accessories", "Damage, sealing, and protection", "Packaging version matches the approved requirement"] },
      { heading: "Quantity and functional checks", paragraphs: ["Reconcile the ordered, finished, packed, and carton quantities. Functional tests should follow the product's actual use and the agreed specification; there is no universal test list for every product. Record the equipment, conditions, sample, result, and any limitation so a reader can understand what was and was not tested."] },
      { heading: "Plan the PSI scope before the visit", paragraphs: ["Give the inspector the current purchase order, product specification, approved sample or reference photographs, packaging artwork, and any test instructions before the inspection. State the lot identity, expected finished quantity, sampling basis, and who decides whether the shipment can be released. If a test requires special equipment, a destructive sample, a power source, or a destination-market document, confirm that in advance.", "An inspector cannot recover a missing requirement by guessing. If the buyer wants a measurement or function checked, name the method and acceptance basis. If a point is not yet defined, mark it as pending rather than silently treating an informal expectation as a pass or fail rule."] },
      { heading: "Sample the right questions", paragraphs: ["A PSI normally reviews a sample rather than every unit. The sample should be identifiable and the report should state how it was selected. Pay special attention to repeated defects, mixed revisions, carton-level patterns, and any units that cannot be tested in the same way as the rest. If a small sample reveals a serious repeated issue, pause and discuss whether the inspection scope should change before release.", "Sampling is a decision tool, not a mathematical promise that uninspected units are perfect. Use the result together with supplier process evidence, order history, test documents, and the risk of the product."] },
      { heading: "Record defects clearly", checklist: ["Critical, major, or minor classification explained", "Defect location identified", "Affected quantity counted", "Repeat pattern noted", "Photograph attached", "Measurement or test result recorded", "Reference sample or requirement cited", "Corrective-action owner and due date recorded"] },
      { heading: "PASS or FAIL", paragraphs: ["An inspection company result is an input to the buyer's shipment decision. Confirm what the result covers, which samples were checked, and whether the decision is based on the agreed acceptance criteria. A PASS does not prove future batches, destination-market compliance, or the absence of every possible defect."] },
      { heading: "What to do after FAIL", numbered: ["Review the report and clarify any disputed finding.", "Agree corrective action, rework, replacement, credit, or other disposition in writing.", "Re-inspect an appropriate scope if rework changes the result.", "Update the shipment release decision and keep the evidence with the order record."] },
      { heading: "Review the report before releasing cargo", checklist: ["Report identifies the correct supplier, order, product, and lot", "Photos show the reported issue and the relevant reference", "Measurements include units and test conditions", "Quantity and carton counts reconcile", "Open findings have an owner and disposition", "Any accepted deviation is written and limited", "Release decision is made by the buyer or authorized owner", "Documents are saved with the order record"] },
      { heading: "PSI is one point in the quality plan", paragraphs: ["A successful PSI does not replace the written specification, sample approval, production controls, customs documents, or destination compliance review. A failed PSI is not automatically proof that the supplier is unsuitable; it is a signal to understand the problem and decide whether rework, a revised shipment, or a different supplier response is appropriate. Link the report back to the China Quality Control Guide and Golden Sample Explained so the same standard is used throughout the order."] },
      { heading: "Questions for the inspection company", checklist: ["What product and lot information is needed before booking?", "Which inspection standard or buyer instruction will be used?", "How will the sample be selected and identified?", "Which measurements and tests are included?", "What equipment or buyer-supplied reference is required?", "When will photographs and the report be delivered?", "Who can clarify a disputed finding?", "What happens if re-inspection is needed?"] },
      { heading: "Release decisions are commercial decisions", paragraphs: ["The inspector describes findings; the buyer decides what to do with them under the order, contract, and risk plan. A buyer may hold shipment, request rework, accept a documented deviation, split the shipment, or seek another remedy. The right response depends on the defect, quantity, timing, product, and available contractual options. Record the decision and the reason so the same issue is not debated from memory later.", "If the buyer accepts a deviation, keep it narrow: identify the lot, affected quantity, specific condition, and whether it changes future orders. A broad message such as “approved this time” can be misunderstood as a permanent specification change."] },
      { heading: "Printable release checklist", checklist: ["Specification and reference sample matched", "Quantity reconciled", "Product checks completed", "Functional tests completed where relevant", "Packaging and labels checked", "Defects classified and photographed", "Open issues resolved or accepted explicitly", "Shipment release decision recorded"] },
      ...commonCta,
    ],
  },
  {
    slug: "shipping-from-china",
    title: "Shipping from China",
    topic: "Shipping & Import",
    clusterId: "shipping",
    summary: "A practical overview of transport modes, Incoterms, freight forwarders, documents, hidden charges, and an import workflow.",
    readTime: 12,
    seoTitle: "Shipping from China: A Practical Guide for Importers",
    seoDescription: "Understand courier, air, rail, LCL, and FCL shipping from China, plus Incoterms, forwarder questions, documents, and hidden charges.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Factory price is not your final cost", "LCL versus FCL in plain English", "Ten charges to ask about before accepting a freight quote", "Shipping from China: the eight-step workflow"],
    sections: [
      { heading: "The short answer", paragraphs: ["Shipping from China requires decisions about transport mode, Incoterm, freight forwarder, consolidation, documentation, customs, insurance, destination charges, and the landed-cost view. Start with the product, shipment size, urgency, destination, and your ability to manage import steps. Avoid choosing a term or transport mode from the headline freight price alone."] },
      { heading: "Main shipping modes", comparisonTable: { headers: ["Mode", "Generally useful for", "Trade-off to ask about"], rows: [["Courier", "Samples and very small shipments", "Convenience versus price and customs treatment"], ["Air freight", "Higher-value or time-sensitive cargo", "Speed versus weight-based cost and destination charges"], ["Rail where available", "Some routes and cargo profiles", "Route availability, transfers, and service scope"], ["Sea LCL", "Smaller-than-container shipments", "Consolidation, handling, and destination complexity"], ["Sea FCL", "Larger shipments using a container", "Container planning, loading, and utilization"]] } },
      { heading: "Courier, air, and sea", paragraphs: ["Courier is often practical for samples and small parcels. Air freight can suit time-sensitive or higher-value cargo where the shipment economics work. Sea shipping is commonly considered for larger or less urgent cargo; LCL combines cargo with other shipments, while FCL uses a container for the shipment. Rail may be relevant on particular routes. Transit and price vary by route, season, dimensions, service level, and destination, so ask for a current quote rather than relying on a fixed promise."] },
      { heading: "Choose the mode from the shipment profile", numbered: ["Describe the product, packaging, cartons, dimensions, weight, value, and readiness date.", "Separate samples, urgent replenishment, and normal production shipments instead of using one default mode.", "Check whether the product has batteries, liquids, magnets, timber, chemicals, or other handling requirements.", "Compare the cost of speed with the cost of holding inventory, missing a launch, or splitting the order.", "Confirm that the quoted service actually covers the origin and destination addresses you need."] , paragraphs: ["The best mode depends on the shipment and the buyer's operating constraints. A small trial order may justify courier or air even when a future repeat order moves by sea. A time-sensitive launch may justify a partial air shipment while the balance moves by sea. Make the reason for the choice explicit so a later quote can be compared fairly."] },
      { heading: "Incoterms and responsibility", paragraphs: ["Read FOB vs EXW vs DDP before accepting a quote. The named place and transport mode matter. Ask who handles pickup, export clearance, main freight, import clearance, duties, taxes, insurance, destination handling, and final delivery. An Incoterm does not replace the sales contract, product compliance requirements, or customs obligations."] },
      { heading: "Compare freight quotes line by line", paragraphs: ["A useful comparison keeps the same origin, destination, carton information, service level, currency, validity period, and Incoterm assumptions. Put the quote into sections for pickup, origin handling, main freight, documentation, customs, destination handling, final delivery, and optional services. If a charge is estimated, say what could change it. A quote that looks cheaper because it omits destination handling is not comparable to a quote that includes it.", "Ask whether the quote is for the actual chargeable weight or volume, whether consolidation changes the schedule, and whether the rate includes a named port or an address. Record who will issue the bill of lading or air waybill and who will answer questions when cargo is delayed."] },
      { heading: "What a freight forwarder does", bullets: ["Book transport and coordinate pickup.", "Consolidate cargo where applicable.", "Prepare or coordinate shipping documents.", "Coordinate export and import customs steps within the agreed scope.", "Arrange destination handling, delivery, or storage where quoted.", "Explain which charges are included, excluded, estimated, or payable by another party."] },
      { heading: "Questions to ask a freight forwarder", checklist: ["Origin pickup and handling included?", "Main freight and route stated?", "Destination charges included or excluded?", "Customs brokerage included?", "Duties and taxes excluded or included?", "Insurance offered and on what basis?", "Transit estimate and service assumptions stated?", "Free time, storage, demurrage, or detention explained?", "Documentation fees listed?", "Final delivery scope and address confirmed?"] },
      { heading: "Shipping documents", paragraphs: ["Depending on the shipment, parties, mode, and destination, documents may include a commercial invoice, packing list, bill of lading or air waybill, customs documents, and certificates or compliance records where applicable. Not every cargo requires the same set. Ask the forwarder and customs professional which documents apply to the actual product and destination."] },
      { heading: "Prepare customs information early", checklist: ["Product description is specific and consistent", "Quantity, value, and currency are documented", "Packaging and net or gross weight are available", "HS classification is reviewed with the appropriate professional", "Country of origin information is supported", "Required permits or product documents are identified", "Importer and broker contacts are confirmed", "Invoice, packing list, and transport document use matching details"] },
      { heading: "Common hidden or separate charges", bullets: ["Origin handling and documentation.", "Terminal or consolidation charges.", "Customs brokerage.", "Destination handling and delivery.", "Storage, demurrage, or detention.", "Insurance and inspection.", "Duties and taxes."] },
      { heading: "The shipping workflow", numbered: ["Confirm supplier, product, quantity, packaging, and readiness date.", "Choose an Incoterm and named place that both parties understand.", "Request comparable forwarder quotes with origin and destination details.", "Confirm documents, customs scope, insurance, and charges.", "Arrange pickup or consolidation.", "Complete export steps and main freight.", "Complete import clearance and destination handling.", "Deliver, reconcile the shipment, and update the landed-cost record."] },
      { heading: "When a shipment is delayed", paragraphs: ["Ask for the current location, the next handoff, the reason for the delay, and any storage, demurrage, detention, or rebooking exposure. Keep the supplier, forwarder, broker, and receiving team aligned on the same shipment reference. Do not assume a revised arrival date removes the need to update inventory, customer promises, insurance, or destination appointments.", "For a first shipment, write down the lesson after delivery: which charge was unexpected, which document took longest, and which responsibility was unclear. That record improves the next RFQ and makes future quotes more comparable."] },
      { heading: "Consolidation and split shipments", paragraphs: ["Consolidation can make a small order more practical, but it adds handoffs and may change the schedule or destination charges. Ask which supplier cartons will be consolidated, who checks the carton count, when the cargo is received, and how damage or shortage is recorded. If part of the order is urgent, compare a split shipment with the cost of waiting for all products to be ready.", "Do not let a consolidated quote obscure the individual supplier, product, or carton information needed for customs and receiving. Keep the packing list and carton marks aligned with the actual load."] },
      { heading: "Plan the receiving side", checklist: ["Receiving address and hours confirmed", "Carton count and delivery appointment understood", "Required unloading equipment arranged", "Damage or shortage process assigned", "Documents available before arrival", "Storage capacity checked", "Inventory and customer commitments updated", "Final delivery charge and proof of delivery recorded"] },
      { heading: "The buyer's shipping brief", paragraphs: ["Before requesting a quote, create a short shipping brief: origin address, destination address, product description, carton count, dimensions, weight, value, readiness date, preferred mode, Incoterm, and required documents. Send the same brief to each forwarder. When a forwarder asks for missing information, update the brief rather than giving one-off details that never reach the other quotes.", "A clear brief also helps the supplier understand which information is still needed before the goods are ready. Shipping decisions work best when product, packaging, quality release, customs, and receiving teams use the same shipment identity."] },
      ...commonCta,
    ],
  },
  {
    slug: "landed-cost-explained",
    title: "Landed Cost Explained",
    topic: "Shipping & Import",
    clusterId: "shipping",
    summary: "How to estimate the real cost of getting sellable goods from a China supplier to the buyer's chosen destination.",
    readTime: 10,
    seoTitle: "Landed Cost Explained: Calculate the Real Cost of Importing from China",
    seoDescription: "Learn the components of landed cost for China imports, how to compare Incoterms, and how to calculate an illustrative cost per unit.",
    publishedAt: "2026-10-05T00:00:00Z",
    source: "built-in",
    socialHooks: ["Your factory price is not your real unit cost", "Why EXW can look cheap but cost more after shipping", "Ten costs buyers forget when importing from China", "How to calculate landed cost per unit"],
    sections: [
      { heading: "The short answer", paragraphs: ["Landed cost is the total cost to get goods to the buyer's chosen destination in a usable, sellable condition. The components depend on the Incoterm, country, product classification, tax treatment, freight route, brokerage, insurance, packaging, and destination charges. There is no single universal formula or duty rate that fits every import."] },
      { heading: "Basic landed-cost components", checklist: ["Product cost", "Tooling or setup allocation", "Product packaging and labels", "Inland transport in the origin country", "Export charges", "Main freight", "Insurance where purchased", "Customs duty", "Import tax or VAT where applicable", "Brokerage", "Destination handling", "Final delivery", "Allowance for damaged or non-sellable units"] },
      { heading: "A simple illustrative example", paragraphs: ["Assume an order has product cost of $10,000, freight of $1,500, insurance of $100, an illustrative duty amount of $800, and brokerage or destination charges of $500. The illustrative landed total is $12,900 before any other applicable taxes, financing, inspection, storage, or non-sellable-unit allowance. The $800 duty is only an example amount; it is not a current country rate or a claim about a product's classification."] },
      { heading: "Cost per sellable unit", paragraphs: ["If the illustrative $12,900 total produces 1,000 sellable units, the simple landed cost is $12.90 per unit ($12,900 ÷ 1,000). If damage, samples, or short shipment reduce the sellable quantity, use the actual sellable quantity and document the assumption. Separate one-time tooling or setup from recurring unit cost when comparing suppliers."] },
      { heading: "Build a quote sheet that can be checked", numbered: ["Start with the supplier's product and packaging quote.", "Add tooling, artwork, setup, and sample allocations separately.", "Add origin pickup, handling, export, freight, insurance, and destination charges.", "Add duty, import tax, VAT, brokerage, and delivery using destination-specific assumptions.", "Subtract or separately show credits, refunds, or costs that are not part of the sellable inventory.", "Divide by the documented sellable-unit quantity."], paragraphs: ["The point of a quote sheet is not to create false precision. It is to expose which number comes from a supplier, which comes from a forwarder, which depends on customs, and which is the buyer's assumption. Keep the date and validity period beside every time-sensitive quote."] },
      { heading: "EXW, FOB, and DDP comparisons", paragraphs: ["A lower EXW product quote does not necessarily mean a lower landed cost because the buyer may assume more pickup, export, freight, and documentation work. FOB may make the main freight easier to compare, while DDP may bundle more steps but needs careful confirmation of duty, tax, importer-of-record, destination, and documentation treatment. Compare the included and excluded components line by line."] },
      { heading: "Use sensitivity ranges", paragraphs: ["Some inputs can move after the order is placed: freight rates, exchange rates, chargeable volume, customs classification, duty treatment, storage, and delivery. Build a low, expected, and high case for the inputs that matter most. The range is not a promise; it is a way to see whether a supplier or Incoterm decision still makes sense if one assumption changes.", "For example, if destination handling is uncertain, show it as a separate range rather than burying it in the product cost. If a product has a large one-time mold, show the per-unit effect at the first order quantity and at a realistic repeat quantity. This prevents a low first-run unit cost from being confused with a scalable cost."] },
      { heading: "Questions to ask before accepting a DDP quote", checklist: ["Are duties included?", "Is import tax or VAT included?", "Who is importer of record?", "Are destination charges included?", "Which named destination is covered?", "What documents will be provided?", "What happens if customs requests more information?", "Are storage, demurrage, or delivery surcharges excluded?"] },
      { heading: "Common mistakes", bullets: ["Comparing product price only.", "Ignoring packaging, tooling, or setup.", "Using the wrong HS classification assumption.", "Treating a freight quote as the full landed cost.", "Forgetting brokerage, destination, storage, or delivery.", "Ignoring damaged or non-sellable units.", "Assuming a DDP label removes every customs or compliance question."] },
      { heading: "A second illustrative scenario", paragraphs: ["Imagine two suppliers quote the same $10 product. Supplier A quotes EXW and Supplier B quotes a delivered service. A buyer who compares only the product line may choose A, then discover separate pickup, export handling, freight, brokerage, and destination charges. Supplier B may include more of those items but require confirmation of importer-of-record, duty, tax, and documents. The correct comparison is not which label sounds simpler; it is the total cost and responsibility for the same destination and product assumptions.", "If the two totals are close, choose the option whose responsibilities, documents, and dispute path you can manage. A slightly higher transparent estimate may be more useful than a low quote with several unknowns."] },
      { heading: "Review the estimate before payment", checklist: ["Product and packaging assumptions match the approved specification", "Quantity and sellable-unit basis are clear", "Tooling and setup allocation is separate", "Incoterm and named place are written", "Freight quote is current and route-specific", "Duty and tax assumptions have an owner", "Brokerage and destination charges are included or listed as excluded", "Exchange-rate and validity assumptions are dated", "Open risks have a follow-up action", "Final estimate is approved by the person managing the order"] },
      { heading: "Use landed cost to choose the next question", paragraphs: ["If freight is the largest uncertainty, ask for a route-specific forwarder quote. If duty or tax is the largest uncertainty, confirm the product description and classification with the appropriate customs professional. If packaging or tooling changes the result, ask the supplier for standard and customized options. If the sellable-unit assumption is fragile, improve the inspection, packaging, or damage-control plan. The estimate should tell you what to verify next, not only produce a number.", "This is also useful when comparing supplier types. A manufacturer, exporter, trading company, or wholesaler may quote different inclusions or handle shipping differently. Compare the supply model, responsibility, documents, and total cost instead of assuming the lowest factory price is the lowest landed cost."] },
      { heading: "Keep one version of the estimate", numbered: ["Date the estimate and record the currency.", "Attach the product, packaging, and quantity assumptions.", "Name the supplier, forwarder, broker, or source of each input.", "Mark confirmed values, estimates, ranges, and unknowns.", "Update the estimate when an assumption changes.", "Keep the approved version with the purchase and receiving records."], paragraphs: ["Landed cost is a moving estimate until the goods arrive and the final charges are known. Versioning makes it possible to explain why an expected margin changed and which input should be improved for the next order."] },
      { heading: "Landed-cost checklist", checklist: ["Incoterm and named place recorded", "Product and packaging cost separated", "Origin charges quoted", "Freight route and service stated", "Insurance decision recorded", "Duty and tax assumptions verified for the destination", "Brokerage and destination charges listed", "Sellable-unit assumption documented", "Cost per unit calculated", "Open cost risks assigned for follow-up"] },
      { heading: "Keep the estimate honest", paragraphs: ["Use ranges or clearly labeled assumptions where the final amount depends on customs classification, destination rules, shipment timing, or a forwarder's current quote. Confirm time-sensitive costs with the relevant supplier, forwarder, broker, and customs professional. FactoryRoster provides sourcing information and does not guarantee pricing, delivery, or transaction outcomes."], },
      ...commonCta,
    ],
  },
];

export const builtInGuides = [...verificationGuides, ...secondBatchGuides, ...thirdBatchGuides];

export function calculateGuideReadTime(guide: Pick<GuideRecord, "sections" | "content">) {
  const text = guide.sections
    ? guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.numbered ?? []), ...(section.checklist ?? []), section.callout ?? ""]).join(" ")
    : guide.content ?? "";
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

const guideJourneyLinks: Record<string, string[]> = {
  "moq-explained": ["how-to-negotiate-moq-with-chinese-suppliers", "how-to-write-an-rfq", "how-to-order-samples-from-china"],
  "how-to-negotiate-moq-with-chinese-suppliers": ["moq-explained", "how-to-write-an-rfq", "how-to-order-samples-from-china"],
  "how-to-order-samples-from-china": ["golden-sample-explained", "china-quality-control-guide"],
  "golden-sample-explained": ["how-to-order-samples-from-china", "china-quality-control-guide", "pre-shipment-inspection-checklist"],
  "china-quality-control-guide": ["golden-sample-explained", "pre-shipment-inspection-checklist", "shipping-from-china"],
  "pre-shipment-inspection-checklist": ["china-quality-control-guide", "shipping-from-china"],
  "shipping-from-china": ["fob-vs-exw-vs-ddp", "landed-cost-explained"],
  "landed-cost-explained": ["shipping-from-china", "fob-vs-exw-vs-ddp", "moq-explained"],
};

export function getRelatedGuides(currentGuide: GuideRecord, allGuides: GuideRecord[]) {
  const published = allGuides.filter((guide) => guide.slug !== currentGuide.slug);
  const publishedBySlug = new Map(published.map((guide) => [guide.slug, guide]));
  const explicit = (guideJourneyLinks[currentGuide.slug] ?? []).map((slug) => publishedBySlug.get(slug)).filter((guide): guide is GuideRecord => Boolean(guide));
  const sameCluster = published.filter((guide) => guide.clusterId === currentGuide.clusterId);
  const journeyIndex = guideJourneyOrder.indexOf(currentGuide.clusterId);
  const nextClusterId = journeyIndex >= 0 ? guideJourneyOrder[journeyIndex + 1] : undefined;
  const nextCluster = nextClusterId ? published.filter((guide) => guide.clusterId === nextClusterId) : [];
  const adjacent = published.filter((guide) => guide.clusterId !== currentGuide.clusterId && guide.clusterId !== nextClusterId);
  const selected = [...explicit, ...sameCluster.slice(0, 2), ...nextCluster.slice(0, 2), ...sameCluster.slice(2), ...adjacent];
  return [...new Map(selected.map((guide) => [guide.slug, guide])).values()].slice(0, 4);
}

export const publishedBuiltInGuides = builtInGuides
  .filter((guide) => guideRoadmap.some((item) => item.slug === guide.slug && item.status !== "planned"))
  .map((guide) => ({ ...guide, readTime: calculateGuideReadTime(guide) }));

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
    content: "## The short answer\n\nFactoryRoster works best when you use it as a shortlist-building workflow: start with a product or category, filter for supplier type and fit, read the verification labels correctly, compare capabilities, and then contact three to five strong candidates with the same RFQ.\n\n## 1. Start with a precise product or category\n\nDefine the product, materials, dimensions, target quantity, destination market, customization, and timing before you search. A clear brief makes supplier cards comparable and prevents a large directory from becoming an unstructured list of names. Use the industry pages to narrow the product family, then keep the same requirements when you compare profiles.\n\n## 2. Search by supplier type\n\nA manufacturer may be the best fit for repeat production, tooling, or private label. A distributor, exporter, wholesaler, or trading company may be more suitable for low MOQ, mixed products, existing inventory, or faster export coordination. Do not treat a trading supplier as a manufacturer; read the supplier type and supply model together with the evidence labels.\n\n## 3. Read verification status correctly\n\nA public profile must pass Government Registration, Business Contact, and Supply Evidence checks. Those checks answer different questions: who the entity is, whether a business contact works, and whether the claimed supply role has supporting evidence. Verification supports research at a point in time; it does not guarantee quality, pricing, delivery, or transaction outcomes.\n\n## 4. Check manufacturing capability and product fit\n\nReview the product categories, capabilities, MOQ level, sample support, private-label support, location, and available export information. Ask the supplier to confirm current specifications, materials, packaging, production process, equipment, lead time, and certifications for your exact product and market.\n\n## 5. Compare export-market experience\n\nAsk which markets the supplier serves, which documents it can provide, and how it handles shipping, packaging, labeling, and destination requirements. Compare responses using the same RFQ instead of selecting the fastest or cheapest answer.\n\n## 6. Build a shortlist of three to five suppliers\n\nRecord the legal entity, supplier type, key product fit, MOQ, sample terms, open questions, and next action for each candidate. A shortlist makes it easier to notice inconsistent names, beneficiary changes, unrealistic promises, or evidence that does not match the claimed role.\n\n## 7. Unlock contact only after shortlisting\n\nContact credits are most useful after you know why a supplier fits. Prepare a concise outreach message with the product brief, quantity, market, compliance needs, target date, and sample request. Confirm the contact person and legal entity before sharing sensitive commercial information.\n\n## 8. Send an RFQ and verify before payment\n\nCompare the written quote, contract entity, invoice, payment beneficiary, sample result, inspection plan, and lead time. Treat urgent payment pressure or an unrelated beneficiary as a reason to pause and re-check. Use appropriate contracts, staged payments, inspections, and professional trade or legal advice for higher-value orders.\n\n## FactoryRoster verification limitations\n\nFactoryRoster is an informational directory and does not participate in transactions between buyers and suppliers. Verification confirms specific facts at a point in time; it does not guarantee product quality, delivery, pricing, exclusivity, compliance, or a successful transaction.",
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
  "risk control": "verification",
  "samples, quality & inspection": "quality",
  "shipping & import": "shipping",
  "contact & rfq": "communication",
  "moq, pricing & negotiation": "commercial",
  "find suppliers": "discovery",
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
