import { PRIMARY_INDUSTRIES } from "@/lib/categories";

const linkStyle = { color: "#1E40AF", textDecoration: "none" } as const;

export function IndustryHubSeoLinks() {
  return (
    <section aria-labelledby="supported-industries" style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px" }}>
        <h2 id="supported-industries" style={{ fontSize: 18, margin: "0 0 12px", color: "#0D1117" }}>Supported China supplier industries</h2>
        <nav aria-label="Primary industries" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
          {PRIMARY_INDUSTRIES.map((industry) => (
            <a key={industry.slug} href={`/industries/${industry.slug}`} style={linkStyle}>
              {industry.name} suppliers
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

export function HomepageIndustryLinks() {
  return (
    <section aria-labelledby="browse-by-industry" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
      <h2 id="browse-by-industry" style={{ fontSize: 18, margin: "0 0 12px", color: "#0D1117" }}>Browse manufacturers by industry</h2>
      <nav aria-label="Browse manufacturers by industry" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
        {PRIMARY_INDUSTRIES.map((industry) => (
          <a key={industry.slug} href={`/industries/${industry.slug}`} style={linkStyle}>{industry.name} manufacturers</a>
        ))}
      </nav>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.href })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb" style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 32px 0", fontSize: 12.5, color: "#6B7280" }}>
        {items.map((item, index) => <span key={item.href}>{index > 0 && <span aria-hidden="true"> / </span>}{index === items.length - 1 ? <span>{item.name}</span> : <a href={item.href} style={linkStyle}>{item.name}</a>}</span>)}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
