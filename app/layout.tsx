import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FactoryRoster — Verified China Manufacturers", template: "%s | FactoryRoster" },
  description: "Search verified China manufacturers and unlock verified factory contact records.",
  openGraph: {
    title: "FactoryRoster — Verified China Manufacturers",
    description: "China Factory Intelligence · Verified Before Listed",
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
