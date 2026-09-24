import type { MetadataRoute } from "next";
import { industries, siteUrl } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Supplier records are maintained in Supabase after deploys. Do not freeze this
// database-backed sitemap at build time, or deleted/test URLs can remain listed.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/industries", "/verification", "/pricing", "/guides", "/request-verification", "/contact", "/about", "/privacy-policy", "/terms"];
  let dynamicRoutes = industries.map((item) => `/industries/${item.slug}`);

  try {
    const supabase = createSupabaseAdminClient();
    const [{ data: guides }, { data: factories }] = await Promise.all([
      supabase.from("guides").select("slug").eq("is_published", true),
      supabase.from("factories").select("slug").eq("is_published", true).eq("is_indexable", true),
    ]);
    dynamicRoutes = [
      ...(guides ?? []).map((item) => `/guides/${item.slug}`),
      ...(factories ?? []).map((item) => `/factories/${item.slug}`),
    ];
  } catch {
    // Never guess dynamic URLs: unpublished records must not leak through the sitemap.
  }

  return [...new Set([...staticRoutes, ...dynamicRoutes])].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
