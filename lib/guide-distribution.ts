const siteUrl = "https://factoryroster.com";

type SocialPack = { slug: string; xPost: string; linkedinPost: string; reddit: { title: string; angle: string }; carousel: string[] };

const packs: Array<[string, string, string, string, string]> = [
  ["chinese-supplier-verification-checklist", "A practical checklist for verifying a Chinese supplier before outreach.", "Supplier verification is easier when identity, contact, supply evidence, and commercial fit are recorded separately.", "What checks do you complete before shortlisting a China supplier?", "Use this checklist to separate verified facts from open questions."],
  ["china-supplier-scam-red-flags", "Five China supplier red flags that deserve a second check before payment.", "A red flag is not proof, but identity changes, beneficiary mismatches, urgency, and generic evidence should slow the process.", "Which supplier signal made you pause and verify?", "Share practical risk-control lessons without naming companies."],
  ["how-to-write-an-rfq", "A clearer RFQ makes supplier quotes easier to compare.", "A strong RFQ defines product, quantity, quality, packaging, destination, timing, and response format.", "What belongs in a useful supplier RFQ?", "Compare vague inquiries with specification-led RFQs."],
  ["moq-explained", "MOQ is a commercial constraint, not a quality signal.", "MOQ affects price, tooling, inventory, and negotiation. Buyers should ask what drives it and whether samples or small batches are possible.", "How do you handle MOQ on a first order?", "Discuss MOQ trade-offs for small overseas buyers."],
  ["how-to-negotiate-moq-with-chinese-suppliers", "Negotiating MOQ starts with understanding the supplier's cost drivers.", "Use a staged order, shared forecast, packaging choices, and a clear target instead of asking only for a lower number.", "What MOQ negotiation approach worked for you?", "Focus on practical, respectful negotiation tactics."],
  ["golden-sample-explained", "A golden sample turns a product conversation into a shared reference.", "Record the approved sample's materials, dimensions, finish, packaging, and tolerances before production.", "How do you control sample-to-production drift?", "Explain why an approved reference matters."],
  ["pre-shipment-inspection-checklist", "A pre-shipment inspection is a decision tool, not a guarantee.", "Define the inspection scope, sampling method, defects, packaging, quantity, and release criteria before goods ship.", "What is on your pre-shipment inspection checklist?", "Share inspection planning practices."],
  ["fob-vs-exw-vs-ddp", "FOB, EXW, and DDP move responsibility to different parties.", "Compare who controls export, freight, customs, duties, insurance, and delivery risk before accepting a quote.", "Which Incoterm fits your buying workflow?", "Clarify Incoterm responsibilities with examples."],
  ["import-duties-from-china", "Landed cost starts before the supplier quote is accepted.", "Check classification, origin, duties, taxes, brokerage, and destination rules with qualified professionals.", "What landed-cost line item surprised you?", "Explain why duty estimates need destination context."],
  ["canton-fair-beginner-guide", "A first Canton Fair visit is easier with a sourcing plan.", "Prepare target categories, questions, evidence requests, follow-up rules, and a way to compare suppliers after the event.", "What would you tell a first-time Canton Fair buyer?", "Share a practical fair-preparation checklist."],
];

export const guideDistributionPacks: SocialPack[] = packs.map(([slug, xPost, linkedinPost, redditTitle, angle]) => ({
  slug, xPost: `${xPost} ${siteUrl}/guides/${slug}`, linkedinPost: `${linkedinPost}\n\nRead the guide: ${siteUrl}/guides/${slug}`, reddit: { title: redditTitle, angle }, carousel: ["The buyer question", "What to verify", "Common mistake", "A practical checklist", "Next step", `Read more: ${siteUrl}/guides/${slug}`],
}));

export function guideDistributionUrl(slug: string, source: "x" | "linkedin" | "reddit") {
  return `${siteUrl}/guides/${slug}?utm_source=${source}&utm_medium=social&utm_campaign=guide_distribution`;
}
