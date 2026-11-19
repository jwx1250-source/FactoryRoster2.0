import { PRIMARY_INDUSTRIES, PRIMARY_INDUSTRY_BY_SLUG } from "@/lib/categories";

// Restore legacy URLs that have supplier coverage and distinct buying criteria.
const categoryGuidance = new Map([
  ["led-lighting-outdoor-lighting", "Specify where the fixture will be installed. Compare ingress and impact protection, operating temperature, light distribution, mounting options and replacement driver availability. Request a photometric file for the exact fixture configuration."],
  ["led-lighting-solar-lights", "Ask for the solar panel wattage, battery chemistry and capacity, and runtime under a stated lighting schedule. Confirm how runtime was measured, what happens after consecutive cloudy days, and whether the battery can be replaced."],
  ["led-lighting-smart-lighting", "Confirm the control protocol, app or gateway requirements, dimming behavior, and offline operation. Test the exact firmware and regional radio configuration before approving a production run."],
  ["furniture-and-home-home-furniture", "Ask for drawings, materials, finish samples, load and stability test documentation, and assembled and packed dimensions. Check assembly hardware, spare parts, and packaging for your shipping and delivery method."],
  ["apparel-and-textiles-children-clothing", "Compare size grading, fabric composition, shrinkage, and colorfastness. Confirm the destination market’s requirements for labels, drawstrings, small parts and flammability, and ask for evidence covering the actual materials and design."],
  ["beauty-and-personal-care-nail-products", "Separate nail tools and accessories from formulations. For gels and liquids, request ingredient and safety documentation and confirm destination-market and shipping requirements. For lamps, check curing compatibility with the specific products you plan to sell."],
  ["plastic-products-plastic-household-products", "Define the intended use, load, cleaning method and temperature range. Ask which resin is specified, whether molds are shared or exclusive, and what testing covers the finished product if it will contact food."],
  ["pet-products-pet-toys", "Match the toy to species, size and play behavior. Compare materials, seam or joint strength, and detachable parts. Agree on test conditions and packaging warnings before approving a sample."],
]);

export const INDUSTRY_PAGE_SIZE = 48;

export function isRestoredCategory(slug: string) {
  return categoryGuidance.has(slug);
}

export function getIndustryDirectory(slug: string) {
  const industry = PRIMARY_INDUSTRY_BY_SLUG.get(slug);
  if (industry) return { industry, name: industry.name, slug, description: industry.description, guidance: undefined };

  const guidance = categoryGuidance.get(slug);
  if (!guidance) return undefined;
  for (const parent of PRIMARY_INDUSTRIES) {
    const category = parent.secondaryCategories.find((item) => item.slug === slug);
    if (category) return { industry: parent, ...category, description: undefined, guidance };
  }
}

export function industryPagePath(slug: string, page = 1) {
  return `/industries/${slug}${page > 1 ? `?page=${page}` : ""}`;
}

export function parseIndustryPage(value: string | string[] | undefined) {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return null;
  return Number(value);
}
