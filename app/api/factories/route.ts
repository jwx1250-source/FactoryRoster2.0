import { z } from "zod";
import { unstable_cache } from "next/cache";

import { apiError } from "@/lib/http";
import { contactPreview } from "@/lib/domain/rules";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const searchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  industry: z.string().trim().max(100).optional(),
  primary_industry: z.string().trim().max(100).optional(),
  secondary_category: z.string().trim().max(140).optional(),
  province: z.string().trim().max(80).optional(),
  supplier_type: z.enum(["manufacturer", "authorized_distributor", "first_tier_agent", "trading_company", "exporter", "wholesaler", "brand_owner", "sourcing_service_provider"]).optional(),
  moq_level: z.enum(["sample_supported", "low_moq", "standard_moq", "bulk_only", "unknown"]).optional(),
  small_orders: z.enum(["true"]).optional(),
  sample_orders: z.enum(["true"]).optional(),
  private_label: z.enum(["true"]).optional(),
  supply_model: z.enum(["factory_direct", "authorized_distribution", "first_tier_agent", "wholesale_inventory", "export_trading", "sourcing_service"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const input = searchSchema.parse(Object.fromEntries(url.searchParams));
    // Search results contain only published, non-sensitive fields. A short
    // server cache avoids repeating the same RPC while keeping publication
    // changes visible quickly.
    const getResults = unstable_cache(
      async () => {
        const supabase = createSupabaseAdminClient();
        const { data, error } = await supabase.rpc("search_verified_suppliers", {
          p_query: input.q || null,
          p_primary_industry_slug: input.primary_industry || input.industry || null,
          p_secondary_category_slug: input.secondary_category || null,
          p_province: input.province || null,
          p_supplier_type: input.supplier_type || null,
          p_moq_level: input.moq_level || null,
          p_supports_small_orders: input.small_orders ? true : null,
          p_supports_sample_orders: input.sample_orders ? true : null,
          p_supports_private_label: input.private_label ? true : null,
          p_supply_model: input.supply_model || null,
          p_limit: input.limit,
          p_offset: (input.page - 1) * input.limit,
        });
        if (error) throw error;
        return data ?? [];
      },
      [
        "public-supplier-search",
        input.q ?? "",
        input.primary_industry ?? input.industry ?? "",
        input.secondary_category ?? "",
        input.province ?? "",
        input.supplier_type ?? "",
        input.moq_level ?? "",
        input.small_orders ?? "",
        input.sample_orders ?? "",
        input.private_label ?? "",
        input.supply_model ?? "",
        String(input.page),
        String(input.limit),
      ],
      { revalidate: 30, tags: ["public-suppliers"] },
    );
    const data = await getResults();

    const suppliers = (data ?? []).map((supplier: Record<string, unknown>) => ({
      ...supplier,
      contact: contactPreview(Boolean(supplier.has_verified_contact)),
    }));
    return Response.json(
      { suppliers, factories: suppliers, page: input.page, limit: input.limit, hasMore: suppliers.length === input.limit },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
