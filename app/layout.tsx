import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import GrowthTracker from "@/components/growth-tracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FactoryRoster — Verified China Suppliers", template: "%s | FactoryRoster" },
  description: "Search verified China manufacturers, distributors, exporters, and wholesalers before you reach out.",
  openGraph: {
    title: "FactoryRoster — Verified China Suppliers",
    description: "China Supplier Intelligence · Verified Before Listed",
    url: siteUrl,
    siteName: "FactoryRoster",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FactoryRoster — Verified China Suppliers",
    description: "China Supplier Intelligence · Verified Before Listed",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GrowthTracker />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "FactoryRoster", url: siteUrl },
            { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "FactoryRoster", url: siteUrl, publisher: { "@id": `${siteUrl}/#organization` }, potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } },
          ],
        }) }} />
        {children}
      </body>
    </html>
  );
}
