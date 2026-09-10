import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";

export const metadata: Metadata = { title: "Supplier Industries" };

export default function IndustriesPage() {
  return <FigmaApp initialPath="/industries" />;
}
