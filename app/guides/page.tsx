import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Factory Sourcing Guides", description: "Practical factory sourcing and verification guidance for global buyers.", alternates: { canonical: `${siteUrl}/guides` } };

export default async function GuidesPage() {
  const { data: guides } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,read_time,published_at").eq("is_published", true).order("published_at", { ascending: false });
  return <main style={{ minHeight: "100vh", background: "#f7f8fa" }}><div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 20px 96px" }}><p className="admin-kicker">FACTORY INTELLIGENCE</p><h1 style={{ fontSize: "clamp(36px,6vw,62px)", margin: "0 0 14px" }}>Factory sourcing guides</h1><p style={{ color: "#6b7280", fontSize: 18, marginBottom: 42 }}>Practical guidance for finding, checking and contacting China manufacturers.</p><div className="admin-card-grid">{(guides ?? []).map((guide) => <article className="admin-panel" key={guide.slug}><p className="admin-kicker">{guide.topic}</p><h2 style={{ fontSize: 21 }}>{guide.title}</h2><p style={{ color: "#6b7280", lineHeight: 1.6 }}>{guide.summary}</p><p style={{ fontSize: 12, color: "#6b7280" }}>{guide.read_time} min read</p><Link href={`/guides/${guide.slug}`} style={{ color: "#1e40af", fontWeight: 700 }}>Read guide →</Link></article>)}{!guides?.length && <div className="admin-panel"><h2>Guides are being prepared</h2><p>Published sourcing guides will appear here.</p></div>}</div></div></main>;
}
