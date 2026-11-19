import { Breadcrumbs } from "@/components/seo-navigation";
import { supplierTypeLabel } from "@/lib/domain/rules";
import { publishedBuiltInGuides } from "@/lib/guides";
import { industryGuideLinks } from "@/lib/guide-links";
import { getIndustryDirectory, industryPagePath, INDUSTRY_PAGE_SIZE, isRestoredCategory } from "@/lib/industry-directory";

type Supplier = {
  slug: string;
  company_name: string;
  city: string | null;
  province: string | null;
  supplier_type: string;
  main_products: string[];
  moq: string | null;
};

export default function SeoIndustryContent({ directory, suppliers, total, page }: {
  directory: NonNullable<ReturnType<typeof getIndustryDirectory>>;
  suppliers: Supplier[];
  total: number;
  page: number;
}) {
  const { industry, name, slug, description, guidance } = directory;
  const isPrimary = industry.slug === slug;
  const path = industryPagePath(slug);
  const lastPage = Math.ceil(total / INDUSTRY_PAGE_SIZE);
  const start = (page - 1) * INDUSTRY_PAGE_SIZE + 1;
  const filterParams = new URLSearchParams({ primary_industry: industry.slug });
  if (!isPrimary) filterParams.set("secondary_category", slug);
  const breadcrumb = [{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: industry.name, href: industryPagePath(industry.slug) }];
  if (!isPrimary) breadcrumb.push({ name, href: path });
  if (page > 1) breadcrumb.push({ name: `Page ${page}`, href: industryPagePath(slug, page) });

  const resources = (industryGuideLinks[industry.slug] ?? []).flatMap((guideSlug) => {
    const guide = publishedBuiltInGuides.find((item) => item.slug === guideSlug);
    return guide ? [guide] : [];
  });

  return (
    <main className="industry-directory">
      <Breadcrumbs items={breadcrumb} />
      <div className="industry-directory-body">
        <h1>Verified China {name} Suppliers</h1>
        {description && <p>{description}</p>}
        {page === 1 && guidance && <section className="industry-directory-guidance">
          <h2>What to check before requesting a quote</h2>
          <p>{guidance}</p>
        </section>}
        {page === 1 && isPrimary && <nav aria-label="Product categories" className="industry-directory-categories">
          {industry.secondaryCategories.map((category) => <a key={category.slug} href={isRestoredCategory(category.slug) ? industryPagePath(category.slug) : `/search?${new URLSearchParams({ primary_industry: slug, secondary_category: category.slug })}`}>{category.name}</a>)}
        </nav>}
        <div className="industry-directory-list-heading">
          <h2>Supplier listings</h2>
          <a href={`/search?${filterParams}`}>Filter suppliers</a>
        </div>
        <p>{total > 0 ? `Showing ${start}–${start + suppliers.length - 1} of ${total} verified suppliers` : "No suppliers are currently listed in this industry."}</p>
        <ul className="industry-directory-grid">
          {suppliers.map((supplier) => (
            <li key={supplier.slug}>
              <a href={`/factories/${supplier.slug}`}>{supplier.company_name}</a>
              <p>{[supplier.city, supplier.province].filter(Boolean).join(", ") || "China"} · {supplierTypeLabel(supplier.supplier_type)}</p>
              {supplier.main_products.length > 0 && <p>{supplier.main_products.slice(0, 3).join(" · ")}</p>}
              {supplier.moq && <p>MOQ: {supplier.moq}</p>}
            </li>
          ))}
        </ul>
        {lastPage > 1 && <nav aria-label="Supplier list pages" className="industry-directory-pagination">
          {page > 1 && <a href={industryPagePath(slug, page - 1)} rel="prev">Previous</a>}
          <span aria-current="page">Page {page} of {lastPage}</span>
          {page < lastPage && <a href={industryPagePath(slug, page + 1)} rel="next">Next</a>}
        </nav>}
        {page === 1 && resources.length > 0 && <section className="industry-directory-guidance">
          <h2>Buyer resources</h2>
          <ul>{resources.map((guide) => <li key={guide.slug}><a href={`/guides/${guide.slug}`}>{guide.title}</a></li>)}</ul>
        </section>}
      </div>
    </main>
  );
}
