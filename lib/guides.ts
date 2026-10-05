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
  { slug: "how-to-negotiate-moq-with-chinese-suppliers", title: "How to Negotiate MOQ with Chinese Suppliers", clusterId: "commercial", status: "planned" },
  { slug: "china-supplier-lead-times", title: "China Supplier Lead Times", clusterId: "commercial", status: "planned" },
  { slug: "china-sourcing-payment-risk", title: "China Sourcing Payment Risk", clusterId: "verification", status: "planned" },
  { slug: "china-supplier-quality-control", title: "China Supplier Quality Control", clusterId: "quality", status: "planned" },
  { slug: "china-supplier-due-diligence", title: "China Supplier Due Diligence", clusterId: "verification", status: "planned" },
  { slug: "how-to-work-with-a-china-supplier", title: "How to Work with a China Supplier", clusterId: "communication", status: "planned" },
  { slug: "china-supplier-order-process", title: "China Supplier Order Process", clusterId: "quality", status: "planned" },
  { slug: "use-verified-factory-contacts", title: "How to Use Verified Factory Contacts", clusterId: "communication", status: "existing" },
  { slug: "how-to-find-manufacturers-in-china", title: "How to Find Manufacturers in China", clusterId: "discovery", status: "published" },
  { slug: "how-to-contact-chinese-manufacturers", title: "How to Contact Chinese Manufacturers", clusterId: "communication", status: "published" },
  { slug: "how-to-write-an-rfq", title: "How to Write an RFQ", clusterId: "communication", status: "published" },
  { slug: "moq-explained", title: "MOQ Explained", clusterId: "commercial", status: "published" },
  { slug: "how-to-order-samples-from-china", title: "How to Order Samples from China", clusterId: "quality", status: "published" },
  { slug: "fob-vs-exw-vs-ddp", title: "FOB vs EXW vs DDP", clusterId: "commercial", status: "published" },
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

export const builtInGuides = [...verificationGuides, ...secondBatchGuides];

export function calculateGuideReadTime(guide: Pick<GuideRecord, "sections" | "content">) {
  const text = guide.sections
    ? guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.numbered ?? []), ...(section.checklist ?? []), section.callout ?? ""]).join(" ")
    : guide.content ?? "";
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function getRelatedGuides(currentGuide: GuideRecord, allGuides: GuideRecord[]) {
  const published = allGuides.filter((guide) => guide.slug !== currentGuide.slug);
  const sameCluster = published.filter((guide) => guide.clusterId === currentGuide.clusterId);
  const journeyIndex = guideJourneyOrder.indexOf(currentGuide.clusterId);
  const nextClusterId = journeyIndex >= 0 ? guideJourneyOrder[journeyIndex + 1] : undefined;
  const nextCluster = nextClusterId ? published.filter((guide) => guide.clusterId === nextClusterId) : [];
  const adjacent = published.filter((guide) => guide.clusterId !== currentGuide.clusterId && guide.clusterId !== nextClusterId);
  const selected = [...sameCluster.slice(0, 2), ...nextCluster.slice(0, 2), ...sameCluster.slice(2), ...adjacent];
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
