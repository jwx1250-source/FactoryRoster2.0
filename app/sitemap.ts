import type { MetadataRoute } from "next";
import { industries, siteUrl } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/industries", "/verification", "/pricing", "/guides", "/request-verification", "/contact", "/about", "/privacy-policy", "/terms"];
  let dynamicRoutes = industries.map((item) => `/industries/${item.slug}`);

  try {
    const supabase = createSupabaseAdminClient();
    const [{ data: databaseIndustries }, { data: guides }, { data: factories }] = await Promise.all([
      supabase.from("industries").select("slug"),
      supabase.from("guides").select("slug").eq("is_published", true),
      supabase.from("factories").select("slug").eq("is_published", true).eq("is_indexable", true),
    ]);
    dynamicRoutes = [
      ...(databaseIndustries ?? []).map((item) => `/industries/${item.slug}`),
      ...(guides ?? []).map((item) => `/guides/${item.slug}`),
      ...(factories ?? []).map((item) => `/factories/${item.slug}`),
    ];
  } catch {
    // Never guess dynamic URLs: unpublished records must not leak through the sitemap.
  }

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
