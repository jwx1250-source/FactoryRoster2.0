import { getSiteUrl } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.GROWTH_CRON_SECRET || process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  const observedAt = new Date().toISOString();
  const siteUrl = getSiteUrl();
  const [{ data: factories, error: factoryError }, { data: guides, error: guideError }, { data: industries, error: industryError }] = await Promise.all([
    supabase.from("factories").select("slug,company_name,is_published,is_indexable,overview,main_products,province,city,seo_title").eq("is_published", true),
    supabase.from("guides").select("slug,title,is_published,content,seo_title").eq("is_published", true),
    supabase.from("industries").select("slug,name,description,seo_title"),
  ]);
  if (factoryError || guideError || industryError) return Response.json({ error: "Unable to inspect SEO pages" }, { status: 500 });

  const snapshots = [
    ...(factories ?? []).map((page) => ({ canonical_url: `${siteUrl}/factories/${page.slug}`, page_type: "factory", http_status: 200, is_indexable: page.is_indexable, canonical_target: `${siteUrl}/factories/${page.slug}`, in_sitemap: page.is_indexable, title: page.seo_title || page.company_name, h1: page.company_name, content_hash: `${page.overview}|${(page.main_products ?? []).join(",")}`, observed_at: observedAt, metadata: { province: page.province, city: page.city } })),
    ...(guides ?? []).map((page) => ({ canonical_url: `${siteUrl}/guides/${page.slug}`, page_type: "guide", http_status: 200, is_indexable: true, canonical_target: `${siteUrl}/guides/${page.slug}`, in_sitemap: true, title: page.seo_title || page.title, h1: page.title, content_hash: page.content.slice(0, 200), observed_at: observedAt, metadata: {} })),
    ...(industries ?? []).map((page) => ({ canonical_url: `${siteUrl}/industries/${page.slug}`, page_type: "industry", http_status: 200, is_indexable: true, canonical_target: `${siteUrl}/industries/${page.slug}`, in_sitemap: true, title: page.seo_title || `Verified ${page.name} Suppliers`, h1: page.name, content_hash: page.description, observed_at: observedAt, metadata: {} })),
  ];
  if (snapshots.length) {
    const { error } = await supabase.from("seo_page_snapshots").insert(snapshots);
    if (error) return Response.json({ error: "Unable to store SEO snapshots" }, { status: 500 });
  }

  const tasks = (factories ?? []).flatMap((page) => {
    const result = [];
    if (page.is_indexable && (!page.overview || page.overview.trim().length < 80 || !page.main_products?.length)) result.push({ task_type: "data_gap", dedupe_key: `data_gap:factory:${page.slug}`, title: `Complete supplier profile: ${page.company_name}`, description: "Add only verified public description and product data before further SEO promotion.", priority: 72, payload: { slug: page.slug } });
    if (page.is_indexable && (!page.province || !page.city)) result.push({ task_type: "data_gap", dedupe_key: `location_gap:factory:${page.slug}`, title: `Complete supplier location: ${page.company_name}`, description: "Confirm province and city in the admin workspace.", priority: 80, payload: { slug: page.slug } });
    return result;
  });
  if (tasks.length) await supabase.from("growth_tasks").upsert(tasks, { onConflict: "dedupe_key", ignoreDuplicates: true });
  return Response.json({ observed_at: observedAt, snapshots: snapshots.length, tasks_created: tasks.length });
}
