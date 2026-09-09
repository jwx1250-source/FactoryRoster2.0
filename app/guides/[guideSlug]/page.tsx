import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

async function getGuide(slug: string) {
  const { data } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,content,read_time,seo_title,seo_description,published_at").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ guideSlug: string }> }): Promise<Metadata> {
  const { guideSlug } = await params; const guide = await getGuide(guideSlug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  return { title: guide.seo_title || guide.title, description: guide.seo_description || guide.summary, alternates: { canonical: `${siteUrl}/guides/${guide.slug}` } };
}

export default async function GuidePage({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params; const guide = await getGuide(guideSlug); if (!guide) notFound();
  return <main style={{ minHeight: "100vh", background: "#fff" }}><article style={{ maxWidth: 760, margin: "0 auto", padding: "64px 20px 96px" }}><Link href="/guides" style={{ color: "#1e40af", textDecoration: "none", fontSize: 13 }}>← All guides</Link><p className="admin-kicker" style={{ marginTop: 42 }}>{guide.topic}</p><h1 style={{ fontSize: "clamp(34px,6vw,58px)", lineHeight: 1.08, margin: "0 0 20px" }}>{guide.title}</h1><p style={{ fontSize: 20, color: "#6b7280", lineHeight: 1.6 }}>{guide.summary}</p><p style={{ fontSize: 12, color: "#6b7280", margin: "24px 0 42px" }}>{guide.read_time} min read</p><div style={{ whiteSpace: "pre-wrap", fontSize: 17, lineHeight: 1.85, color: "#273142" }}>{guide.content}</div></article></main>;
}
