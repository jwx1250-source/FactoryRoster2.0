import Link from "next/link";
import type { GuideRecord, GuideSection } from "@/lib/guides";
import { ChecklistTools } from "@/components/checklist-tools";

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
    {section.callout && <aside className="guide-callout">{section.callout}</aside>}
  </section>;
}

export function GuideContent({ guide }: { guide: GuideRecord }) {
  if (guide.sections) return <div className="guide-prose">{guide.sections.map((section) => <Section key={section.heading} section={section} />)}</div>;
  return <PlainTextContent content={guide.content || ""} />;
}

export function GuideCtas({ related }: { related: GuideRecord[] }) {
  return <>
    <section className="guide-cta-grid" aria-label="Continue sourcing">
      <Link className="guide-cta guide-cta-primary" href="/search">Search verified suppliers <span aria-hidden="true">→</span></Link>
      <Link className="guide-cta" href="/verification">See how verification works <span aria-hidden="true">→</span></Link>
      <Link className="guide-cta" href="/industries">Browse supplier industries <span aria-hidden="true">→</span></Link>
    </section>
    {related.length > 0 && <section className="guide-related"><div className="guide-section-heading"><p className="admin-kicker">KEEP READING</p><h2>Related sourcing guides</h2></div><div className="guide-related-grid">{related.slice(0, 4).map((item) => <Link key={item.slug} href={`/guides/${item.slug}`} className="guide-related-card"><span>{item.topic}</span><strong>{item.title}</strong><em>{item.readTime} min read →</em></Link>)}</div></section>}
  </>;
}
