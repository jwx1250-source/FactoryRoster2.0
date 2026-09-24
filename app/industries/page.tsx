import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";
import { IndustryHubSeoLinks } from "@/components/seo-navigation";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Supplier Industries", description: "Browse verified China suppliers by product industry and sourcing category.", alternates: { canonical: `${siteUrl}/industries` } };

export default function IndustriesPage() {
  return <><IndustryHubSeoLinks /><FigmaApp initialPath="/industries" /></>;
}
