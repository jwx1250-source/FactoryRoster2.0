import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { guideClusters, guideRoadmap, mergeGuides, type GuideDatabaseRow, type GuideRecord } from "@/lib/guides";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "China Supplier Sourcing Guides",
  description: "Practical China supplier sourcing, verification, MOQ, communication, quality, and shipping guides for international buyers.",
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: { title: "China Supplier Sourcing Guides | FactoryRoster", description: "China Supplier Intelligence · Verified Before Listed", url: `${siteUrl}/guides`, type: "website" },
};

async function getGuides() {
  try {
    const { data } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,content,read_time,seo_title,seo_description,published_at,updated_at").eq("is_published", true).order("published_at", { ascending: false });
    return mergeGuides((data ?? []) as GuideDatabaseRow[]);
  } catch {
    return mergeGuides();
  }
}

export default async function GuidesPage() {
  const guides = await getGuides();
  const startHere = ["how-to-find-manufacturers-in-china", "how-to-verify-a-chinese-supplier", "how-to-contact-chinese-manufacturers", "how-to-write-an-rfq"].map((slug) => guides.find((guide) => guide.slug === slug)).filter((guide): guide is GuideRecord => Boolean(guide));
  const popularSlugs = ["chinese-supplier-verification-checklist", "how-to-write-an-rfq", "moq-explained", "aql-inspection-explained", "pre-shipment-inspection-checklist", "shipping-from-china", "import-duties-from-china", "landed-cost-explained"];
  const popular = popularSlugs.map((slug) => guides.find((guide) => guide.slug === slug)).filter((guide): guide is GuideRecord => Boolean(guide));
  const grouped = new Map(guideClusters.map((cluster) => [cluster.id, guides.filter((guide) => guide.clusterId === cluster.id)]));

  return <><SiteHeader active="Guides" /><main className="guides-hub">
    <section className="guides-hero"><div className="guides-shell">
      <p className="admin-kicker">FACTORYROSTER KNOWLEDGE HUB</p>
      <h1>China Supplier Sourcing Guides</h1>
      <p className="guides-hero-copy">Practical guidance for finding, checking, and contacting China manufacturers, distributors, exporters, and wholesalers.</p>
      <div className="guides-hero-actions"><Link className="guide-cta guide-cta-primary" href="/search">Search verified suppliers <span aria-hidden="true">→</span></Link><Link className="guide-cta" href="/verification">Understand verification <span aria-hidden="true">→</span></Link></div>
      <div className="guides-trust"><span>✓ Verified before listed</span><span>✓ Supplier-type specific evidence</span><span>✓ Research guidance for buyers</span></div>
    </div></section>
    <div className="guides-shell guides-body">
      <section className="guides-start"><div className="guides-section-heading"><p className="admin-kicker">START HERE</p><h2>Build a safer supplier shortlist</h2><p>Use these guides when you are deciding who to contact and what to check before an order.</p></div><div className="guides-card-grid">{startHere.map((guide) => guide && <Link href={`/guides/${guide.slug}`} className="guide-card guide-card-featured" key={guide.slug}><span className="guide-card-topic">{guide.topic}</span><h3>{guide.title}</h3><p>{guide.summary}</p><em>{guide.readTime} min read →</em></Link>)}</div></section>
      <section className="guides-clusters"><div className="guides-section-heading"><p className="admin-kicker">BROWSE BY SOURCING STAGE</p><h2>Find the next question to answer</h2></div><div className="guide-cluster-grid">{guideClusters.map((cluster) => { const items = grouped.get(cluster.id) ?? []; const roadmap = guideRoadmap.filter((item) => item.clusterId === cluster.id); const visibleRoadmap = [...roadmap.filter((item) => item.status !== "planned"), ...roadmap.filter((item) => item.status === "planned")]; const displayLimit = ["quality", "shipping", "locations"].includes(cluster.id) ? 5 : 4; return <section className="guide-cluster" key={cluster.id}><div><span className="guide-cluster-index">{String(roadmap.length).padStart(2, "0")}</span><h3>{cluster.title}</h3><p>{cluster.description}</p></div><div className="guide-cluster-links">{visibleRoadmap.slice(0, displayLimit).map((item) => { const guide = items.find((candidate) => candidate.slug === item.slug); return guide ? <Link href={`/guides/${guide.slug}`} key={item.slug}>{guide.title}<span>→</span></Link> : <span className="guide-planned" key={item.slug}>{item.title}<small>Planned</small></span>; })}</div></section>; })}</div></section>
      {popular.length > 0 && <section className="guides-popular"><div className="guides-section-heading"><p className="admin-kicker">POPULAR PRACTICAL GUIDES</p><h2>Useful before your next supplier conversation</h2></div><div className="guides-card-grid">{popular.map((guide) => <Link href={`/guides/${guide.slug}`} className="guide-card" key={guide.slug}><span className="guide-card-topic">{guide.topic}</span><h3>{guide.title}</h3><p>{guide.summary}</p><em>{guide.readTime} min read →</em></Link>)}</div></section>}
    </div>
  </main></>;
}
