import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";

export const metadata: Metadata = { title: "Manufacturing Industries" };

export default function IndustriesPage() {
  return <FigmaApp initialPath="/industries" />;
}
