import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Search Verified Suppliers", robots: { index: false, follow: true }, alternates: { canonical: `${siteUrl}/search` } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const filters = new URLSearchParams();
  for (const key of ["q", "primary_industry", "secondary_category"]) {
    const value = query[key];
    if (typeof value === "string" && value) filters.set(key, value);
  }
  return <FigmaApp initialPath={`/search?${filters}`} />;
}
