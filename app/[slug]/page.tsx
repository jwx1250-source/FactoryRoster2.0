import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FigmaApp from "@/components/figma-app";

const pages = ["verification", "pricing", "guides", "sign-in", "get-started", "contact", "request-verification", "about", "privacy-policy", "terms"];
const titles: Record<string, string> = {
  verification: "Verification Process",
  pricing: "Pricing",
  guides: "Factory Sourcing Guides",
  "sign-in": "Sign In",
  "get-started": "Get Started",
  contact: "Contact",
  "request-verification": "Request Verification",
  about: "About FactoryRoster",
  "privacy-policy": "Privacy Policy",
  terms: "Terms of Service",
};

export function generateStaticParams() {
  return pages.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: titles[slug] || "FactoryRoster" };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages.includes(slug)) notFound();
  return <FigmaApp initialPath={`/${slug}`} />;
}
