import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";

export const metadata: Metadata = { title: "Verified Factory Profile" };

export default async function FactoryPage({ params }: { params: Promise<{ factorySlug: string }> }) {
  const { factorySlug } = await params;
  return <FigmaApp initialPath={`/factories/${factorySlug}`} />;
}
