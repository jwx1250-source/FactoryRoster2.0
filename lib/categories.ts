export type SupplierCategory = {
  name: string;
  slug: string;
};

export type PrimaryIndustry = {
  name: string;
  slug: string;
  code: string;
  description: string;
  secondaryCategories: readonly SupplierCategory[];
  supplierTypes: string;
  moqFit: string;
};

const categories = (parentSlug: string, items: readonly string[]): SupplierCategory[] => items.map((name) => ({
  name,
  slug: `${parentSlug}-${name.toLowerCase().replaceAll("&", "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
}));

export const PRIMARY_INDUSTRIES: readonly PrimaryIndustry[] = [
  { name: "Consumer Electronics", slug: "consumer-electronics", code: "ELC", description: "Devices and accessories for connected, mobile, audio, security, and computing products.", secondaryCategories: categories("consumer-electronics", ["Phone Accessories", "Chargers & Cables", "Audio Devices", "Smart Home Devices", "Security Cameras", "Computer Accessories", "Wearables"]), supplierTypes: "Manufacturers · Distributors · Exporters", moqFit: "Samples to standard MOQ" },
  { name: "LED Lighting", slug: "led-lighting", code: "LED", description: "Residential, commercial, outdoor, solar, and smart lighting supply partners.", secondaryCategories: categories("led-lighting", ["LED Bulbs", "LED Strip Lights", "LED Panel Lights", "Outdoor Lighting", "Solar Lights", "Commercial Lighting", "Smart Lighting"]), supplierTypes: "Manufacturers · Agents · Exporters", moqFit: "Low to standard MOQ" },
  { name: "Packaging & Printing", slug: "packaging-and-printing", code: "PKG", description: "Primary, secondary, retail, food, flexible, and custom printed packaging.", secondaryCategories: categories("packaging-and-printing", ["Cosmetic Packaging", "Paper Boxes", "Rigid Boxes", "Mailer Boxes", "Plastic Bottles", "Labels & Stickers", "Flexible Packaging", "Food Packaging"]), supplierTypes: "Manufacturers · Trading suppliers · Wholesalers", moqFit: "Samples to bulk orders" },
  { name: "Plastic Products", slug: "plastic-products", code: "PLS", description: "Molded components, containers, household goods, storage, and custom plastic parts.", secondaryCategories: categories("plastic-products", ["Plastic Bottles", "Plastic Containers", "Injection Molded Parts", "Plastic Household Products", "Plastic Packaging", "Custom Plastic Parts", "Storage Products"]), supplierTypes: "Manufacturers · Wholesalers · Exporters", moqFit: "Standard MOQ to bulk" },
  { name: "Furniture & Home", slug: "furniture-and-home", code: "HOM", description: "Furniture, storage, decor, bathroom, garden, and workspace products.", secondaryCategories: categories("furniture-and-home", ["Home Furniture", "Outdoor Furniture", "Home Storage", "Home Decor", "Bathroom Accessories", "Garden Products", "Office Furniture"]), supplierTypes: "Manufacturers · Distributors · Exporters", moqFit: "Low MOQ to bulk" },
  { name: "Beauty & Personal Care", slug: "beauty-and-personal-care", code: "BEA", description: "Beauty tools, cosmetic accessories, hair tools, and personal care devices.", secondaryCategories: categories("beauty-and-personal-care", ["Beauty Tools", "Makeup Brushes", "Nail Products", "Skincare Containers", "Perfume Bottles", "Hair Tools", "Personal Care Devices"]), supplierTypes: "Manufacturers · Brand owners · Wholesalers", moqFit: "Samples and low MOQ available" },
  { name: "Kitchenware", slug: "kitchenware", code: "KIT", description: "Cookware, drinkware, tableware, storage, tools, and compact appliances.", secondaryCategories: categories("kitchenware", ["Drinkware", "Cookware", "Tableware", "Kitchen Storage", "Kitchen Tools", "Small Kitchen Appliances", "Coffee Accessories"]), supplierTypes: "Manufacturers · Wholesalers · Exporters", moqFit: "Low to standard MOQ" },
  { name: "Pet Products", slug: "pet-products", code: "PET", description: "Pet toys, bedding, feeding, walking, grooming, and cat or dog supplies.", secondaryCategories: categories("pet-products", ["Pet Toys", "Pet Beds", "Pet Collars & Leashes", "Pet Feeding Products", "Cat Products", "Dog Products", "Pet Grooming Products"]), supplierTypes: "Manufacturers · Trading suppliers · Wholesalers", moqFit: "Samples and small batches" },
  { name: "Apparel & Textiles", slug: "apparel-and-textiles", code: "TEX", description: "Finished apparel, bags, home textiles, and fabric supply partners.", secondaryCategories: categories("apparel-and-textiles", ["Activewear", "T-Shirts", "Children Clothing", "Socks", "Underwear", "Home Textiles", "Fabrics", "Bags"]), supplierTypes: "Manufacturers · Exporters · Trading suppliers", moqFit: "Low MOQ to bulk" },
  { name: "Sports & Outdoor", slug: "sports-and-outdoor", code: "SPT", description: "Fitness, yoga, camping, cycling, outdoor, and water sports products.", secondaryCategories: categories("sports-and-outdoor", ["Fitness Equipment", "Yoga Products", "Camping Gear", "Outdoor Products", "Bicycle Accessories", "Sports Goods", "Water Sports Products"]), supplierTypes: "Manufacturers · Exporters · Wholesalers", moqFit: "Samples to standard MOQ" },
] as const;

export const PRIMARY_INDUSTRY_BY_SLUG = new Map(PRIMARY_INDUSTRIES.map((industry) => [industry.slug, industry]));

export function formatCategoryLabel(value: unknown) {
  return String(value ?? "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
