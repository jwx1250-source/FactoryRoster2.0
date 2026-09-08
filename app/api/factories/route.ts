import { z } from "zod";

import { apiError } from "@/lib/http";
import { contactPreview } from "@/lib/domain/rules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const searchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  industry: z.string().trim().max(80).optional(),
  province: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const input = searchSchema.parse(Object.fromEntries(url.searchParams));
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("search_verified_factories", {
      p_query: input.q || null,
      p_industry_slug: input.industry || null,
      p_province: input.province || null,
      p_limit: input.limit,
      p_offset: (input.page - 1) * input.limit,
    });
    if (error) throw error;

    const factories = (data ?? []).map((factory: Record<string, unknown>) => ({
      ...factory,
      contact: contactPreview(Boolean(factory.has_verified_contact)),
    }));
    return Response.json({ factories, page: input.page, limit: input.limit, hasMore: factories.length === input.limit });
  } catch (error) {
    return apiError(error);
  }
}
