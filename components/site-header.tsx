import Link from "next/link";

const links = [
  ["Industries", "/industries"],
  ["Verification", "/verification"],
  ["Pricing", "/pricing"],
  ["Guides", "/guides"],
] as const;

export default function SiteHeader({ active }: { active?: string }) {
  return <header className="site-header"><div className="site-header-inner"><Link href="/" className="site-brand"><svg className="site-brand-icon" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3 30 13v17H2V13L16 3Z" fill="#1E40AF"/><path d="M6 17h14M6 21h10M6 25h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity=".9"/><path d="m22 23 3 3.5 5-7" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg><span>FactoryRoster</span></Link><nav aria-label="Primary navigation" className="site-nav">{links.map(([label, href]) => <Link key={href} href={href} className={active === label ? "active" : undefined}>{label}</Link>)}</nav><div className="site-header-actions"><Link href="/sign-in" className="site-sign-in">Sign In</Link><Link href="/get-started" className="site-start">Get Started</Link></div></div></header>;
}
