import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FigmaApp from "@/components/figma-app";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

async function getPublishedFactory(slug: string) {
  const { data } = await createSupabaseAdminClient().from("factories").select("id,slug,company_name,chinese_name,record_id,province,city,district,address_public,established_year,employee_range,factory_size,annual_revenue_range,main_products,capabilities,export_markets,certifications,trade_terms,moq,website_url,factory_type,supplier_type,supply_evidence_type,moq_level,supports_small_orders,supports_sample_orders,supports_private_label,supply_model,overview,last_verified_at,has_verified_contact,is_indexable,seo_title,seo_description,industries!factories_industry_id_fkey(name,slug,code),secondary_category:industries!factories_secondary_category_id_fkey(name,slug)").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ factorySlug: string }> }): Promise<Metadata> {
  const { factorySlug } = await params;
  const factory = await getPublishedFactory(factorySlug);
  if (!factory) return { title: "Supplier not found", robots: { index: false, follow: false } };
  return { title: factory.seo_title || factory.company_name, description: factory.seo_description || factory.overview.slice(0, 160), alternates: { canonical: `${siteUrl}/factories/${factory.slug}` }, robots: { index: factory.is_indexable, follow: factory.is_indexable } };
}

export default async function FactoryPage({ params }: { params: Promise<{ factorySlug: string }> }) {
  const { factorySlug } = await params;
  const factory = await getPublishedFactory(factorySlug);
  if (!factory) notFound();
  return <FigmaApp initialPath={`/factories/${factorySlug}`} initialSupplier={factory} />;
}
