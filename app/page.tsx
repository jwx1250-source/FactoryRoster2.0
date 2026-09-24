import FigmaApp from "@/components/figma-app";
import { HomepageIndustryLinks } from "@/components/seo-navigation";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Find Verified China Suppliers",
  description: "Search verified China manufacturers, distributors, exporters, and wholesalers before you reach out.",
  alternates: { canonical: siteUrl },
};

export default function HomePage() {
  return <><FigmaApp initialPath="/" /><HomepageIndustryLinks /></>;
}
