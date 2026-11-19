import type { Metadata } from "next";
import FigmaApp from "@/components/figma-app";
import { siteUrl } from "@/lib/site";
import { PRIMARY_INDUSTRIES } from "@/lib/categories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { supplierHighlights } from "@/lib/supplier-highlights";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Supplier Industries", description: "Browse verified China suppliers by product industry and sourcing category.", alternates: { canonical: `${siteUrl}/industries` } };

export default async function IndustriesPage() {
  const { data, error } = await createSupabaseAdminClient().from("factories")
    .select("slug,company_name,main_products,industries!factories_industry_id_fkey(slug)")
    .in("slug", Object.values(supplierHighlights).flat())
    .eq("is_published", true).eq("is_indexable", true);
  if (error) console.error("[industries] Unable to load supplier highlights", error.code);
  const bySlug = new Map((data ?? []).map((supplier) => [supplier.slug, supplier]));
  const groups = PRIMARY_INDUSTRIES.flatMap((industry) => {
    const suppliers = (supplierHighlights[industry.slug] ?? []).flatMap((slug) => {
      const supplier = bySlug.get(slug);
      const category = Array.isArray(supplier?.industries) ? supplier.industries[0] : supplier?.industries;
      return supplier && category?.slug === industry.slug ? [supplier] : [];
    });
    return suppliers.length ? [{ industry, suppliers }] : [];
  });

  return <FigmaApp initialPath="/industries" industryHighlights={groups.length > 0 ? (
    <section className="industry-directory-body industry-directory-highlights" aria-label="Supplier profiles to explore">
      <h2>Supplier profiles to explore</h2>
      <ul className="industry-directory-grid">
        {groups.map(({ industry, suppliers }) => <li key={industry.slug}>
          <h3><a href={`/industries/${industry.slug}`}>{industry.name}</a></h3>
          <ul>{suppliers.map((supplier) => <li key={supplier.slug}>
            <a href={`/factories/${supplier.slug}`}>{supplier.company_name}</a>
            <p>{supplier.main_products.slice(0, 2).join(" · ")}</p>
          </li>)}</ul>
        </li>)}
      </ul>
    </section>
  ) : undefined} />;
}
