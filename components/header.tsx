"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { navItems } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/sign-in" className="text-link">Sign in</Link>
          <Link href="/get-started" className="button button-dark button-small">Get started</Link>
        </div>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link href="/sign-in" onClick={() => setOpen(false)}>Sign in</Link>
          <Link href="/get-started" className="button button-dark" onClick={() => setOpen(false)}>Get started</Link>
        </nav>
      )}
    </header>
  );
}
