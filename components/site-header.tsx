import Link from "next/link";

const links = [
  ["Industries", "/industries"],
  ["Verification", "/verification"],
  ["Pricing", "/pricing"],
  ["Guides", "/guides"],
] as const;

export default function SiteHeader({ active }: { active?: string }) {
  return <header className="site-header"><div className="site-header-inner"><Link href="/" className="site-brand"><span className="site-brand-mark">✓</span><span>FactoryRoster</span></Link><nav aria-label="Primary navigation" className="site-nav">{links.map(([label, href]) => <Link key={href} href={href} className={active === label ? "active" : undefined}>{label}</Link>)}</nav><div className="site-header-actions"><Link href="/sign-in" className="site-sign-in">Sign In</Link><Link href="/get-started" className="site-start">Get Started</Link></div></div></header>;
}
