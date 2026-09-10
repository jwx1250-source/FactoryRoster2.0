import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
