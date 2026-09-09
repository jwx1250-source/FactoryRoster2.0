import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FigmaApp from "@/components/figma-app";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

async function getPublishedFactory(slug: string) {
  const { data } = await createSupabaseAdminClient().from("factories").select("slug,company_name,overview,seo_title,seo_description,is_indexable").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ factorySlug: string }> }): Promise<Metadata> {
  const { factorySlug } = await params;
  const factory = await getPublishedFactory(factorySlug);
  if (!factory) return { title: "Factory not found", robots: { index: false, follow: false } };
  return { title: factory.seo_title || factory.company_name, description: factory.seo_description || factory.overview.slice(0, 160), alternates: { canonical: `${siteUrl}/factories/${factory.slug}` }, robots: { index: factory.is_indexable, follow: factory.is_indexable } };
}

export default async function FactoryPage({ params }: { params: Promise<{ factorySlug: string }> }) {
  const { factorySlug } = await params;
  const factory = await getPublishedFactory(factorySlug);
  if (!factory) notFound();
  return <FigmaApp initialPath={`/factories/${factorySlug}`} />;
}
