import type { MetadataRoute } from "next";
import { industries, siteUrl } from "@/lib/site";
import { PRIMARY_INDUSTRIES } from "@/lib/categories";
import { isRestoredCategory } from "@/lib/industry-directory";
import { isRedirectedGuide } from "@/lib/guide-redirects";
import { legacyGuideFallbacks, publishedBuiltInGuides } from "@/lib/guides";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = ["", "/industries", "/verification", "/pricing", "/guides", "/request-verification", "/contact", "/about", "/privacy-policy", "/terms"]
    .map((path) => ({ url: `${siteUrl}${path}` }));
  const guides = new Map([...publishedBuiltInGuides, ...legacyGuideFallbacks]
    .filter((guide) => !isRedirectedGuide(guide.slug))
    .map((guide) => [guide.slug, guide.updatedAt || guide.publishedAt]));
  const db = createSupabaseAdminClient();
  const batchSize = 500;
  const listedCategoryIds = new Set<string>();
  let cursor: string | undefined;

  while (true) {
    let query = db.from("factories")
      .select("slug,updated_at,secondary_category_id")
      .eq("is_published", true).eq("is_indexable", true)
      .order("slug").limit(batchSize);
    if (cursor) query = query.gt("slug", cursor);
    const { data, error } = await query;
    if (error) throw new Error("Unable to build supplier sitemap", { cause: error });
    for (const row of data) {
      routes.push({ url: `${siteUrl}/factories/${row.slug}`, lastModified: row.updated_at });
      if (row.secondary_category_id) listedCategoryIds.add(row.secondary_category_id);
    }
    if (data.length < batchSize) break;
    cursor = data[data.length - 1].slug;
  }

  const categorySlugs = PRIMARY_INDUSTRIES.flatMap((industry) => industry.secondaryCategories)
    .filter((category) => isRestoredCategory(category.slug)).map((category) => category.slug);
  const [guideResult, categoryResult] = await Promise.all([
    db.from("guides").select("slug,updated_at,published_at").eq("is_published", true).neq("title", "").neq("content", ""),
    db.from("industries").select("id,slug").in("slug", categorySlugs),
  ]);
  if (guideResult.error || categoryResult.error) {
    throw new Error("Unable to build guide and industry sitemap", { cause: guideResult.error ?? categoryResult.error });
  }
  for (const row of guideResult.data) {
    if (!isRedirectedGuide(row.slug)) guides.set(row.slug, row.updated_at || row.published_at || guides.get(row.slug));
  }
  return [
    ...routes,
    ...industries.map(({ slug }) => ({ url: `${siteUrl}/industries/${slug}` })),
    ...categoryResult.data.filter(({ id }) => listedCategoryIds.has(id)).map(({ slug }) => ({ url: `${siteUrl}/industries/${slug}` })),
    ...Array.from(guides, ([slug, lastModified]) => ({ url: `${siteUrl}/guides/${slug}`, lastModified })),
  ];
}
