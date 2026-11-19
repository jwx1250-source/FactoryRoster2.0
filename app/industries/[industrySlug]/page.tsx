import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Footer } from "@/components/footer";
import SiteHeader from "@/components/site-header";
import SeoIndustryContent from "@/components/seo-industry-content";
import { getIndustryDirectory, industryPagePath, INDUSTRY_PAGE_SIZE, parseIndustryPage } from "@/lib/industry-directory";
import { siteUrl } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ industrySlug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const loadDirectory = cache(async (slug: string, page: number) => {
  const directory = getIndustryDirectory(slug);
  if (!directory) notFound();
  const db = createSupabaseAdminClient();
  const { data: category, error: categoryError } = await db.from("industries").select("id").eq("slug", slug).maybeSingle();
  if (categoryError) throw new Error("Unable to load the supplier category", { cause: categoryError });
  if (!category) notFound();

  const isPrimary = directory.slug === directory.industry.slug;
  const start = (page - 1) * INDUSTRY_PAGE_SIZE;
  const { data: suppliers, count, error } = await db.from("factories")
    .select("slug,company_name,city,province,supplier_type,main_products,moq", { count: "exact" })
    .eq(isPrimary ? "industry_id" : "secondary_category_id", category.id)
    .eq("is_published", true).eq("is_indexable", true)
    .order("last_verified_at", { ascending: false, nullsFirst: false }).order("slug")
    .range(start, start + INDUSTRY_PAGE_SIZE - 1);
  // PostgREST may return 416 for an offset beyond the available rows.
  if (error?.code === "PGRST103" && page > 1) notFound();
  if (error || count === null) throw new Error("Unable to load the supplier directory", { cause: error });
  if ((!isPrimary && count === 0) || (page > 1 && suppliers.length === 0)) notFound();
  return { directory, suppliers, total: count };
});

async function getPageData({ params, searchParams }: Props) {
  const [{ industrySlug }, { page: rawPage }] = await Promise.all([params, searchParams]);
  const page = parseIndustryPage(rawPage);
  if (page === null) notFound();
  return { ...await loadDirectory(industrySlug, page), page };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { directory, page } = await getPageData(props);
  return {
    title: `Verified ${directory.name} Suppliers${page > 1 ? ` – Page ${page}` : ""}`,
    description: directory.guidance ?? `Browse verified China suppliers in ${directory.name} and compare their products and location.`,
    alternates: { canonical: `${siteUrl}${industryPagePath(directory.slug, page)}` },
  };
}

export default async function IndustryPage(props: Props) {
  const data = await getPageData(props);
  return <><SiteHeader active="Industries" /><SeoIndustryContent {...data} /><Footer /></>;
}
