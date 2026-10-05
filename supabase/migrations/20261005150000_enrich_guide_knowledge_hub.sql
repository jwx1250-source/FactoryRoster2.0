-- Knowledge Hub content update. Apply through the normal migration pipeline;
-- this file is intentionally not applied to the live Supabase project here.
update public.guides
set
  summary = 'Understand the three checks required before a factory profile is publicly listed and what each check can—and cannot—tell you.',
  content = $$## The short answer

FactoryRoster requires Government Registration, Business Contact, and Factory Evidence checks before a manufacturer profile is publicly listed. The checks establish a documented basis for a factory record; they are not a guarantee of product quality, pricing, delivery, or commercial performance.

## The three checks

- Government Registration: the legal entity and registration details are reviewed against available records.
- Business Contact: a working business contact channel is checked and recorded.
- Factory Evidence: evidence appropriate to the manufacturer's production relationship is reviewed.

## Why the checks are separate

A registered company may not be the company selling your product. A working contact does not prove production capability. A factory photograph does not prove legal ownership. Separating the checks makes it easier to understand what has actually been verified and what still needs buyer diligence.

## What verification does not prove

Verification confirms specific facts at a point in time. It does not guarantee product quality, delivery, price, exclusivity, regulatory approval in your market, or a successful transaction. FactoryRoster does not participate in buyer-supplier transactions.$$,
  read_time = 8,
  seo_title = 'How Factory Verification Works | FactoryRoster',
  seo_description = 'Learn how FactoryRoster reviews government registration, business contact, and factory evidence before listing a manufacturer.',
  updated_at = now()
where slug = 'how-factory-verification-works';

update public.guides
set
  summary = 'A practical workflow for building a supplier shortlist from verified factory records while keeping product, contract, inspection, and payment diligence in view.',
  content = $$## The short answer

Start with a precise product or industry query, compare supplier type and evidence, and then validate the commercial details that matter to your order. FactoryRoster helps with research; it does not replace samples, contracts, inspections, or payment controls.

## A practical shortlist workflow

1. Define product specifications, destination market, target quantity, MOQ, and timing.
2. Compare legal identity, industry, location, supplier type, supply model, and verification labels.
3. Contact the strongest-fit suppliers with the same RFQ so responses are comparable.
4. Confirm sample terms, certifications, lead time, export experience, and payment beneficiary.
5. Use a sample or inspection plan before making a larger commitment.

## What verification does not prove

Verification confirms specific facts at a point in time. It is not a guarantee of quality, pricing, delivery, or transaction outcomes.$$,
  read_time = 9,
  seo_title = 'How to Find Verified China Manufacturers',
  seo_description = 'Build a China manufacturer shortlist using verified supplier intelligence and a practical buyer workflow.',
  updated_at = now()
where slug = 'find-verified-china-manufacturers';

update public.guides
set
  summary = 'Prepare focused outreach after unlocking a verified contact record, while keeping current commercial and payment checks in place.',
  content = $$## The short answer

Use a verified contact channel for a concise, specific introduction. Include product requirements, target quantity, destination market, compliance needs, and timing. Confirm the contact identity again before sharing sensitive commercial information or arranging payments.

## What to include in the first message

- Product specifications, materials, packaging, and customization requirements.
- Target quantity, sample request, destination market, and required date.
- Questions about MOQ, lead time, certifications, and export experience.
- The legal entity and contracting details you need before payment.

## Keep the check going

A contact check is one point in time, not a permanent endorsement. Compare new payment instructions with the agreed entity, document changes, and use samples, inspections, and appropriate contract controls.

## What verification does not prove

FactoryRoster does not guarantee quality, delivery, pricing, or transaction outcomes and does not participate in buyer-supplier transactions.$$,
  read_time = 8,
  seo_title = 'How to Use Verified Factory Contacts',
  seo_description = 'Use verified contact intelligence for focused factory outreach while keeping buyer due diligence in place.',
  updated_at = now()
where slug = 'use-verified-factory-contacts';

update public.guides
set
  content = $$## The short answer

FactoryRoster works best when you use it as a shortlist-building workflow: start with a product or category, filter for supplier type and fit, read the verification labels correctly, compare capabilities, and then contact three to five strong candidates with the same RFQ.

## 1. Start with a precise product or category

Define the product, materials, dimensions, target quantity, destination market, customization, and timing before you search. A clear brief makes supplier cards comparable and prevents a large directory from becoming an unstructured list of names.

## 2. Search by supplier type

A manufacturer may be the best fit for repeat production, tooling, or private label. A distributor, exporter, wholesaler, or trading company may be more suitable for low MOQ, mixed products, existing inventory, or faster export coordination. Do not treat a trading supplier as a manufacturer; read supplier type and supply model together with the evidence labels.

## 3. Read verification status correctly

A public profile must pass Government Registration, Business Contact, and Supply Evidence checks. Those checks answer different questions: who the entity is, whether a business contact works, and whether the claimed supply role has supporting evidence. Verification supports research at a point in time; it does not guarantee quality, pricing, delivery, or transaction outcomes.

## 4. Check capability and compare export fit

Review product categories, capabilities, MOQ, sample support, private-label support, location, and export information. Ask for current specifications, materials, packaging, production process, lead time, certifications, destination-market experience, and shipping documentation for your exact product.

## 5. Build a shortlist, then contact and verify before payment

Record the legal entity, supplier type, key product fit, MOQ, sample terms, open questions, and next action for three to five candidates. Prepare a concise RFQ, confirm the contact person and contracting entity, compare the quote and beneficiary, and use appropriate samples, inspections, staged payments, contracts, and professional trade or legal advice for higher-value orders.

## FactoryRoster verification limitations

FactoryRoster is an informational directory and does not participate in transactions between buyers and suppliers. Verification confirms specific facts at a point in time; it does not guarantee product quality, delivery, pricing, exclusivity, compliance, or a successful transaction.$$,
  summary = 'Build a focused China manufacturer shortlist using verified supplier intelligence and buyer-side due diligence.',
  read_time = 8,
  updated_at = now()
where slug = 'find-verified-china-manufacturers';
