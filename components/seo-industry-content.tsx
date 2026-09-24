import { PRIMARY_INDUSTRY_BY_SLUG } from "@/lib/categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Breadcrumbs } from "@/components/seo-navigation";

export default async function SeoIndustryContent({ slug }: { slug: string }) {
  const industry = PRIMARY_INDUSTRY_BY_SLUG.get(slug);
  if (!industry) return null;
  const supabase = createSupabaseAdminClient();
  const { data: industryRow } = await supabase.from("industries").select("id").eq("slug", slug).maybeSingle();
  const { data: suppliers, count } = industryRow
    ? await supabase.from("factories").select("slug,company_name,city,province,overview,main_products,capabilities,supplier_type,certifications,moq", { count: "exact" }).eq("industry_id", industryRow.id).eq("is_published", true).eq("is_indexable", true).order("last_verified_at", { ascending: false }).limit(100)
    : { data: [], count: 0 };
  const rows = suppliers ?? [];
  const productTerms = [...new Set(rows.flatMap((row) => String(row.main_products ?? "").split(",").map((item) => item.trim()).filter(Boolean)))].slice(0, 8);
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: industry.name, href: `/industries/${industry.slug}` }]} />
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280", margin: "0 0 8px" }}>Verified China supplier intelligence</p>
        <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: "0 0 10px", color: "#0D1117" }}>China {industry.name} Manufacturers</h1>
        <p style={{ maxWidth: 760, color: "#4B5563", lineHeight: 1.65, margin: "0 0 10px" }}>{industry.description} FactoryRoster lists suppliers in this category only after verification.</p>
        <p style={{ color: "#6B7280", margin: "0 0 22px" }}>{count ?? rows.length} published suppliers in this industry.</p>
        {productTerms.length > 0 && <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 20px" }}><strong>Products represented:</strong> {productTerms.join(", ")}</p>}
        <h2 style={{ fontSize: 20, margin: "0 0 12px", color: "#0D1117" }}>Manufacturers in {industry.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
          {rows.map((supplier) => <a key={supplier.slug} href={`/factories/${supplier.slug}`} style={{ display: "block", padding: "12px 14px", border: "1px solid #E9ECF1", borderRadius: 8, color: "#1E40AF", textDecoration: "none" }}><strong>{supplier.company_name}</strong><span style={{ display: "block", marginTop: 4, color: "#6B7280", fontSize: 12 }}>{[supplier.city, supplier.province].filter(Boolean).join(", ") || "China"}</span></a>)}
        </div>
      </section>
    </div>
  );
}
