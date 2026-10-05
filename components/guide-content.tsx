import type { GuideRecord, GuideSection } from "@/lib/guides";
import { ChecklistTools } from "@/components/checklist-tools";
import { GuideCtaLink } from "@/components/guide-cta-link";
import { getGuideCtaHref, guideCtaConfig } from "@/lib/guide-funnel";

function PlainTextContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return <div className="guide-prose">{blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const heading = lines[0]?.match(/^#{2,3}\s+(.+)/);
    if (heading) return <section key={index}><h2>{heading[1]}</h2>{lines.slice(1).map((line) => <p key={line}>{line.replace(/^[-*]\s+/, "")}</p>)}</section>;
    if (lines.every((line) => /^[-*]\s+/.test(line))) return <ul key={index}>{lines.map((line) => <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>)}</ul>;
    return <p key={index}>{block}</p>;
  })}</div>;
}

function Section({ section }: { section: GuideSection }) {
  return <section className="guide-section">
    <h2>{section.heading}</h2>
    {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
    {section.numbered && <ol>{section.numbered.map((item) => <li key={item}>{item}</li>)}</ol>}
    {section.checklist && <><ChecklistTools items={section.checklist} /><ul className="guide-checklist">{section.checklist.map((item) => <li key={item}><span aria-hidden="true">☐</span>{item}</li>)}</ul></>}
    {section.comparisonTable && <div className="guide-table-wrap"><table className="guide-table"><thead><tr>{section.comparisonTable.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{section.comparisonTable.rows.map((row) => <tr key={row.join("|")}>{row.map((cell, index) => <td key={`${index}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div>}
    {section.callout && <aside className="guide-callout">{section.callout}</aside>}
  </section>;
}

export function GuideContent({ guide }: { guide: GuideRecord }) {
  if (guide.sections) return <div className="guide-prose">{guide.sections.map((section) => <Section key={section.heading} section={section} />)}</div>;
  return <PlainTextContent content={guide.content || ""} />;
}

export function GuideCtas({ guide, related }: { guide: GuideRecord; related: GuideRecord[] }) {
  const ctas = guideCtaConfig[guide.clusterId];
  return <>
    <section className="guide-cta-grid" aria-label="Continue sourcing">
      {[ctas.primary, ctas.secondary].map((cta, index) => <GuideCtaLink key={cta.label} className={`guide-cta${index === 0 ? " guide-cta-primary" : ""}`} href={getGuideCtaHref(cta.destination, guide.slug)} guideSlug={guide.slug} guideCluster={guide.clusterId} destination={cta.destination} position={index === 0 ? "primary" : "secondary"}>{cta.label} <span aria-hidden="true">→</span></GuideCtaLink>)}
      <GuideCtaLink className="guide-cta" href={getGuideCtaHref("industries", guide.slug)} guideSlug={guide.slug} guideCluster={guide.clusterId} destination="industries" position="tertiary">Browse supplier industries <span aria-hidden="true">→</span></GuideCtaLink>
    </section>
    {related.length > 0 && <section className="guide-related"><div className="guide-section-heading"><p className="admin-kicker">KEEP READING</p><h2>Related sourcing guides</h2></div><div className="guide-related-grid">{related.slice(0, 4).map((item) => <GuideCtaLink key={item.slug} href={`/guides/${item.slug}`} guideSlug={guide.slug} guideCluster={guide.clusterId} destination="guide" position="related"><span className="guide-related-card"><span>{item.topic}</span><strong>{item.title}</strong><em>{item.readTime} min read →</em></span></GuideCtaLink>)}</div></section>}
  </>;
}
