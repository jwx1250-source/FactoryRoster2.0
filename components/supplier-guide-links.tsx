import { publishedBuiltInGuides } from "@/lib/guides";
import { supplierBeforeContactGuideSlugs } from "@/lib/guide-links";

export function SupplierGuideLinks({ supplierType }: { supplierType?: string | null }) {
  const slugs = supplierType === "trading_company" ? ["manufacturer-vs-trading-company-china", "how-to-write-an-rfq", "chinese-supplier-verification-checklist"] : supplierBeforeContactGuideSlugs;
  const map = new Map(publishedBuiltInGuides.map((guide) => [guide.slug, guide]));
  return <section aria-label="Before contacting this supplier" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 52px" }}><div style={{ border: "1px solid #E9ECF1", borderRadius: 10, padding: "18px 20px", background: "#fff" }}><h2 style={{ margin: "0 0 6px", fontSize: 19, color: "#0D1117" }}>Before contacting this supplier</h2><p style={{ margin: "0 0 12px", color: "#6B7280", fontSize: 13 }}>Use these guides to prepare questions and verify supplier fit.</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{slugs.map((slug) => { const guide = map.get(slug); return guide ? <a key={slug} href={`/guides/${slug}`} style={{ color: "#1E40AF", textDecoration: "none", fontSize: 13, padding: "7px 10px", borderRadius: 6, background: "#F7F8FA", border: "1px solid #E9ECF1" }}>{guide.title} →</a> : null; })}</div></div></section>;
}
