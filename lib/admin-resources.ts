type ResourceConfig = {
  table: string;
  create: readonly string[];
  update: readonly string[];
  deletable?: boolean;
  orderBy?: string;
};

export const ADMIN_RESOURCES = {
  factories: {
    table: "factories",
    create: ["company_name", "chinese_name", "industry_id", "province", "city", "district", "address_public", "established_year", "employee_range", "factory_size", "annual_revenue_range", "main_products", "capabilities", "export_markets", "certifications", "trade_terms", "moq", "website_url", "factory_type", "supplier_type", "supply_evidence_type", "moq_level", "supports_small_orders", "supports_sample_orders", "supports_private_label", "supply_model", "overview", "is_published", "is_indexable", "seo_title", "seo_description", "internal_notes", "source_notes"],
    update: ["company_name", "chinese_name", "industry_id", "province", "city", "district", "address_public", "established_year", "employee_range", "factory_size", "annual_revenue_range", "main_products", "capabilities", "export_markets", "certifications", "trade_terms", "moq", "website_url", "factory_type", "supplier_type", "supply_evidence_type", "moq_level", "supports_small_orders", "supports_sample_orders", "supports_private_label", "supply_model", "overview", "is_published", "is_indexable", "seo_title", "seo_description", "internal_notes", "source_notes"],
    orderBy: "updated_at",
  },
  contacts: {
    table: "factory_contacts",
    create: ["factory_id", "contact_person", "position", "verified_phone", "verified_email", "whatsapp", "wechat", "contact_verification_method", "is_active", "internal_notes"],
    update: ["contact_person", "position", "verified_phone", "verified_email", "whatsapp", "wechat", "contact_verification_method", "is_active", "internal_notes"],
    orderBy: "updated_at",
    deletable: true,
  },
  "verification-records": {
    table: "verification_records",
    create: ["factory_id", "verification_type", "status", "checked_items", "verification_method", "evidence_note", "evidence_references", "internal_note"],
    update: ["verification_type", "status", "checked_items", "verification_method", "evidence_note", "evidence_references", "internal_note"],
    orderBy: "updated_at",
  },
  "verification-requests": {
    table: "verification_requests",
    create: [],
    update: ["status", "message", "internal_note", "factory_id"],
    orderBy: "created_at",
  },
  orders: {
    table: "credit_transactions",
    create: [],
    update: [],
    orderBy: "created_at",
  },
  unlocks: {
    table: "contact_unlocks",
    create: [],
    update: [],
    orderBy: "unlocked_at",
  },
  guides: {
    table: "guides",
    create: ["slug", "title", "topic", "summary", "content", "read_time", "seo_title", "seo_description", "is_published", "published_at"],
    update: ["slug", "title", "topic", "summary", "content", "read_time", "seo_title", "seo_description", "is_published", "published_at"],
    orderBy: "updated_at",
    deletable: true,
  },
  "contact-messages": {
    table: "contact_messages",
    create: [],
    update: ["status", "internal_note"],
    orderBy: "created_at",
  },
  industries: {
    table: "industries",
    create: ["slug", "name", "code", "description", "product_examples", "common_regions", "is_featured", "sort_order", "seo_title", "seo_description"],
    update: ["slug", "name", "code", "description", "product_examples", "common_regions", "is_featured", "sort_order", "seo_title", "seo_description"],
    orderBy: "sort_order",
  },
} as const satisfies Record<string, ResourceConfig>;

export type AdminResource = keyof typeof ADMIN_RESOURCES;

export function getAdminResource(value: string): ResourceConfig | null {
  return value in ADMIN_RESOURCES ? ADMIN_RESOURCES[value as AdminResource] : null;
}

export function sanitizeAdminPayload(payload: Record<string, unknown>, allowed: readonly string[]) {
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
}
