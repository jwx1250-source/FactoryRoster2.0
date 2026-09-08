import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";

export const metadata: Metadata = { title: "Factory Sourcing Guide" };

export default function GuidePage() {
  return <FigmaApp initialPath="/guides" />;
}
