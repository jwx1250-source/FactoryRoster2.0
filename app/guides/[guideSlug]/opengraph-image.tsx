import { ImageResponse } from "next/og";
import { getGuideBySlug } from "@/lib/guides";

export const alt = "FactoryRoster sourcing guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function GuideOpenGraphImage({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params;
  const guide = getGuideBySlug(guideSlug);
  const title = guide?.title ?? "China Supplier Sourcing Guide";
  const topic = guide?.topic ?? "FactoryRoster Knowledge Hub";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#eef4ff", color: "#0d1117", fontFamily: "Arial" }}>
      <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#1e40af" }}>FactoryRoster</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#64748b" }}>{topic}</div>
        <div style={{ display: "flex", maxWidth: 980, fontSize: 64, lineHeight: 1.08, fontWeight: 800 }}>{title}</div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#475569" }}>China Supplier Intelligence · Verified Before Listed</div>
    </div>,
    { ...size },
  );
}
