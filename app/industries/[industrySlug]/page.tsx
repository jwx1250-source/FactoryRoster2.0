import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";
import { industries } from "@/lib/site";

export const metadata: Metadata = { title: "Verified Suppliers by Industry" };

export function generateStaticParams() {
  return industries.map((item) => ({ industrySlug: item.slug }));
}

export default async function IndustryPage({ params }: { params: Promise<{ industrySlug: string }> }) {
  const { industrySlug } = await params;
  return <FigmaApp initialPath={`/industries/${industrySlug}`} />;
}
