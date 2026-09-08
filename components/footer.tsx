import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const groups = [
  { title: "Explore", links: [["Industries", "/industries"], ["Verification", "/verification"], ["Pricing", "/pricing"], ["Guides", "/guides"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Request Verification", "/request-verification"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"]] },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand-link"><BrandMark /></Link>
          <p>Verified factory information and contact intelligence for global sourcing teams.</p>
          <span>China Factory Intelligence · Verified Before Listed</span>
        </div>
        {groups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} FactoryRoster</span>
        <span>Factory intelligence, not a marketplace.</span>
      </div>
    </footer>
  );
}
