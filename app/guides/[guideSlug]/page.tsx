import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo-navigation";
import { GuideContent, GuideCtas } from "@/components/guide-content";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getGuideBySlug, getRelatedGuides, mergeGuides, type GuideDatabaseRow, type GuideRecord } from "@/lib/guides";
import { siteUrl } from "@/lib/site";

async function getGuide(slug: string): Promise<GuideRecord | undefined> {
  try {
    const { data } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,content,read_time,seo_title,seo_description,published_at,updated_at").eq("slug", slug).eq("is_published", true).maybeSingle();
    return getGuideBySlug(slug, data ? [data as GuideDatabaseRow] : []);
  } catch {
    return getGuideBySlug(slug);
  }
}

async function getAllGuides() {
  try {
    const { data } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,content,read_time,seo_title,seo_description,published_at,updated_at").eq("is_published", true).order("published_at", { ascending: false });
    return mergeGuides((data ?? []) as GuideDatabaseRow[]);
  } catch {
    return mergeGuides();
  }
}

export async function generateMetadata({ params }: { params: Promise<{ guideSlug: string }> }): Promise<Metadata> {
  const { guideSlug } = await params;
  const guide = await getGuide(guideSlug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  const imageUrl = `${siteUrl}/guides/${guide.slug}/opengraph-image`;
  return { title: guide.seoTitle, description: guide.seoDescription, alternates: { canonical: `${siteUrl}/guides/${guide.slug}` }, openGraph: { title: guide.seoTitle, description: guide.seoDescription, url: `${siteUrl}/guides/${guide.slug}`, type: "article", publishedTime: guide.publishedAt, modifiedTime: guide.updatedAt || guide.publishedAt, images: [{ url: imageUrl, width: 1200, height: 630, alt: guide.title }] }, twitter: { card: "summary_large_image", title: guide.seoTitle, description: guide.seoDescription, images: [imageUrl] } };
}

export default async function GuidePage({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params;
  const guide = await getGuide(guideSlug);
  if (!guide) notFound();
  const allGuides = await getAllGuides();
  const related = getRelatedGuides(guide, allGuides);
  const breadcrumbItems = [{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: guide.title, href: `/guides/${guide.slug}` }];
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", "@id": `${siteUrl}/guides/${guide.slug}#article`, headline: guide.title, description: guide.summary, datePublished: guide.publishedAt, dateModified: guide.updatedAt || guide.publishedAt, mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`, author: { "@type": "Organization", name: "FactoryRoster", url: siteUrl }, publisher: { "@type": "Organization", name: "FactoryRoster", url: siteUrl } };
  const publishedLabel = guide.updatedAt ? "Updated" : "Published";
  return <main className="guide-detail"><Breadcrumbs items={breadcrumbItems} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} /><article className="guide-article"><Link className="guide-back" href="/guides">← All sourcing guides</Link><header className="guide-article-header"><p className="admin-kicker">{guide.topic}</p><h1>{guide.title}</h1><p className="guide-summary">{guide.summary}</p><div className="guide-meta"><span>{guide.readTime} min read</span><span>{publishedLabel} {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(guide.updatedAt || guide.publishedAt))}</span><span>FactoryRoster Knowledge Hub</span></div></header><GuideContent guide={guide} /><GuideCtas related={related} /></article></main>;
}
