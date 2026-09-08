import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";

export const metadata: Metadata = { title: "Search Verified Factories", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <FigmaApp initialPath={`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`} />;
}
