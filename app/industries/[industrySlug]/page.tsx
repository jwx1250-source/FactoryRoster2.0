import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FigmaApp from "@/components/figma-app";
import { industries, siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ industrySlug: string }> }): Promise<Metadata> {
  const { industrySlug } = await params;
  const industry = industries.find((item) => item.slug === industrySlug);
  if (!industry) return { title: "Industry not found", robots: { index: false, follow: false } };
  return { title: `Verified ${industry.name} Suppliers`, description: `Find verified China suppliers in ${industry.name}.`, alternates: { canonical: `${siteUrl}/industries/${industry.slug}` } };
}

export function generateStaticParams() {
  return industries.map((item) => ({ industrySlug: item.slug }));
}

export default async function IndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  if (!industries.some((item) => item.slug === industrySlug)) notFound();
  return <FigmaApp initialPath={`/industries/${industrySlug}`} />;
}
