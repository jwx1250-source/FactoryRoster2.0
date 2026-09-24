const linkStyle = { color: "#1E40AF", textDecoration: "none" } as const;

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
