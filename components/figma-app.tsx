"use client";

/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supplierTypeLabel, supplyEvidenceLabel } from "@/lib/domain/rules";
import { formatCategoryLabel, PRIMARY_INDUSTRIES } from "@/lib/categories";

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </svg>
);
const ChevronRight = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronLeft = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = () => (
  <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LockIcon = () => (
  <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
  </svg>
);
const GovIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M3 21h18M3 9h18M3 13h18M3 17h18M5 9V6l7-3 7 3v3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PhoneIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.72 6.72l.98-.98a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FactoryIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M2 20h20M4 20V9l5 3V9l5 3V4l5 4v12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FilterIcon = () => (
  <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShieldIcon = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MailIcon = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" />
  </svg>
);
const UserIcon = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);
const MessageIcon = () => (
  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16,3 L30,13 L30,30 L2,30 L2,13 Z" fill="#1E40AF" />
      <line x1="6"  y1="17" x2="20" y2="17" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <line x1="6"  y1="21" x2="16" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="6"  y1="25" x2="12" y2="25" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
      <path d="M22,23 L25,26.5 L30,19.5" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoWordmark({ size = 28 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 9 }}>
      <LogoMark size={size} />
      <span style={{ fontSize: size * 0.67, fontWeight: 700, letterSpacing: "-0.5px", color: "#0D1117", lineHeight: 1, marginBottom: 5 }}>
        FactoryRoster
      </span>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  slug?: string;
  name: string;
  industry: string;
  industrySlug?: string;
  secondaryCategories?: string[];
  secondaryCategorySlug?: string;
  province: string;
  city: string;
  established: number;
  employees: string;
  exportRate: string;
  exportMarkets?: string[];
  mainProducts: string[];
  verifiedDate: string;
  hasVerifiedContact?: boolean;
  supplierType?: string;
  supplyEvidenceType?: string;
  moqLevel?: string;
  supportsSmallOrders?: boolean;
  supportsSampleOrders?: boolean;
  supportsPrivateLabel?: boolean;
  supplyModel?: string;
  profile?: Record<string, unknown>;
}

interface UnlockedContact {
  contact_person: string | null;
  contact_position: string | null;
  verified_phone: string | null;
  verified_email: string | null;
  whatsapp: string | null;
  wechat: string | null;
  contact_verification_method: string | null;
  last_contact_verified_at: string | null;
  credits_remaining: number;
  already_unlocked: boolean;
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function apiFactoryToResult(factory: Record<string, unknown>): SearchResult {
  const primaryCategory = factory.industries as { name?: string; slug?: string } | null | undefined;
  const secondaryCategory = factory.secondary_category as { name?: string; slug?: string } | null | undefined;
  return {
    id: String(factory.record_id ?? factory.id ?? ""),
    slug: String(factory.slug ?? ""),
    name: String(factory.company_name ?? "Unnamed supplier"),
    industry: String(factory.primary_industry_name ?? factory.industry_name ?? primaryCategory?.name ?? "Supplier"),
    industrySlug: String(factory.primary_industry_slug ?? factory.industry_slug ?? primaryCategory?.slug ?? ""),
    secondaryCategories: factory.secondary_category_name ? [String(factory.secondary_category_name)] : secondaryCategory?.name ? [secondaryCategory.name] : [],
    secondaryCategorySlug: String(factory.secondary_category_slug ?? secondaryCategory?.slug ?? ""),
    province: String(factory.province ?? ""),
    city: String(factory.city ?? ""),
    established: Number(factory.established_year ?? 0),
    employees: String(factory.employee_range ?? "Not disclosed"),
    exportRate: "",
    exportMarkets: Array.isArray(factory.export_markets) ? factory.export_markets.map(String) : [],
    mainProducts: Array.isArray(factory.main_products) ? factory.main_products.map(String) : [],
    verifiedDate: formatDate(factory.last_verified_at as string | null),
    hasVerifiedContact: Boolean(factory.has_verified_contact),
    supplierType: String(factory.supplier_type ?? "manufacturer"),
    supplyEvidenceType: String(factory.supply_evidence_type ?? "factory_evidence"),
    moqLevel: String(factory.moq_level ?? "unknown"),
    supportsSmallOrders: Boolean(factory.supports_small_orders),
    supportsSampleOrders: Boolean(factory.supports_sample_orders),
    supportsPrivateLabel: Boolean(factory.supports_private_label),
    supplyModel: String(factory.supply_model ?? "factory_direct"),
    profile: factory,
  };
}

type Page =
  | { kind: "home" }
  | { kind: "results"; query: string }
  | { kind: "detail"; factory: SearchResult; fromQuery: string }
  | { kind: "industries" }
  | { kind: "verification" }
  | { kind: "pricing" }
  | { kind: "guides" }
  | { kind: "signin" }
  | { kind: "signup" }
  | { kind: "contact" }
  | { kind: "request-verification" }
  | { kind: "about" }
  | { kind: "privacy" }
  | { kind: "terms" }
  | { kind: "not-found" };



// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES = PRIMARY_INDUSTRIES;

const RECENT_FACTORIES: SearchResult[] = [
  { id: "FR-GD-08241", name: "Shenzhen Luminos Technology Co., Ltd.", industry: "LED Lighting", province: "Guangdong", city: "Shenzhen", established: 2009, employees: "200–500", exportRate: "90%", mainProducts: ["LED Strip Lights", "LED Panel Lights", "LED Downlights", "Commercial Fixtures"], verifiedDate: "Sep 4, 2026" },
  { id: "FR-ZJ-08193", name: "Hangzhou Clearpack Solutions Ltd.", industry: "Cosmetic Packaging", province: "Zhejiang", city: "Hangzhou", established: 2012, employees: "100–200", exportRate: "75%", mainProducts: ["Glass Jars", "Plastic Bottles", "Pump Dispensers", "Luxury Packaging"], verifiedDate: "Sep 3, 2026" },
  { id: "FR-GD-08187", name: "Dongguan Huaxin Paper Industries", industry: "Paper Boxes", province: "Guangdong", city: "Dongguan", established: 2007, employees: "200–500", exportRate: "65%", mainProducts: ["Corrugated Boxes", "Folding Cartons", "Gift Boxes", "Kraft Paper Bags"], verifiedDate: "Sep 2, 2026" },
  { id: "FR-ZJ-08174", name: "Ningbo Greenfield Plastics Co., Ltd.", industry: "Plastic Bottles", province: "Zhejiang", city: "Ningbo", established: 2004, employees: "500–1000", exportRate: "82%", mainProducts: ["PET Bottles", "HDPE Bottles", "Spray Bottles", "Cosmetic Containers"], verifiedDate: "Sep 1, 2026" },
  { id: "FR-GD-08161", name: "Foshan Prestige Furniture Manufacturing", industry: "Furniture", province: "Guangdong", city: "Foshan", established: 2001, employees: "500–1000", exportRate: "88%", mainProducts: ["Office Furniture", "Dining Furniture", "Bedroom Sets", "Contract Furniture"], verifiedDate: "Aug 30, 2026" },
  { id: "FR-ZJ-08149", name: "Yiwu Petcare International Co., Ltd.", industry: "Pet Products", province: "Zhejiang", city: "Yiwu", established: 2015, employees: "50–100", exportRate: "95%", mainProducts: ["Pet Toys", "Pet Beds", "Grooming Accessories", "Pet Apparel"], verifiedDate: "Aug 29, 2026" },
];

const SEARCH_RESULTS: SearchResult[] = [
  { id: "FR-GD-08241", name: "Shenzhen Luminos Technology Co., Ltd.", industry: "LED Lighting", province: "Guangdong", city: "Shenzhen", established: 2009, employees: "200–500", exportRate: "", exportMarkets: ["North America", "Europe", "Australia"], mainProducts: ["LED Strip Lights", "LED Panel Lights", "LED Downlights", "Commercial Fixtures"], verifiedDate: "Sep 4, 2026" },
  { id: "FR-GD-07884", name: "Dongguan Brightstar LED Manufacturing Co., Ltd.", industry: "LED Lighting", province: "Guangdong", city: "Dongguan", established: 2006, employees: "500–1,000", exportRate: "", exportMarkets: ["Europe", "Middle East", "Southeast Asia"], mainProducts: ["LED Bulbs", "LED Tubes", "LED Streetlights", "Smart LED Modules"], verifiedDate: "Sep 1, 2026" },
  { id: "FR-GD-07712", name: "Zhongshan Sunway Lighting Ltd.", industry: "LED Lighting", province: "Guangdong", city: "Zhongshan", established: 2003, employees: "1,000–2,000", exportRate: "", exportMarkets: ["North America", "Europe", "Japan"], mainProducts: ["LED Downlights", "LED Track Lights", "LED Ceiling Lights", "LED Spotlights"], verifiedDate: "Aug 28, 2026" },
  { id: "FR-ZJ-07601", name: "Hangzhou Veralight Technology Co., Ltd.", industry: "LED Lighting", province: "Zhejiang", city: "Hangzhou", established: 2011, employees: "100–200", exportRate: "", exportMarkets: ["Europe", "Southeast Asia"], mainProducts: ["LED Flood Lights", "Solar LED Lights", "LED Garden Lights", "Outdoor LED"], verifiedDate: "Aug 25, 2026" },
  { id: "FR-GD-07489", name: "Foshan Huimei Commercial Lighting Co., Ltd.", industry: "Commercial LED", province: "Guangdong", city: "Foshan", established: 2008, employees: "200–500", exportRate: "", exportMarkets: ["Middle East", "Europe", "Africa"], mainProducts: ["Commercial Chandeliers", "Office Panel Lights", "Hotel Lighting", "Retail LED"], verifiedDate: "Aug 22, 2026" },
  { id: "FR-JS-07341", name: "Suzhou Nexlumen Electronics Ltd.", industry: "LED Components", province: "Jiangsu", city: "Suzhou", established: 2013, employees: "100–200", exportRate: "", exportMarkets: ["North America", "Europe", "Japan", "South Korea"], mainProducts: ["LED Drivers", "LED Modules", "LED PCB", "LED Controllers"], verifiedDate: "Aug 19, 2026" },
  { id: "FR-FJ-07208", name: "Xiamen Solaris Photonics Co., Ltd.", industry: "LED Lighting", province: "Fujian", city: "Xiamen", established: 2010, employees: "200–500", exportRate: "", exportMarkets: ["North America", "Europe", "Middle East"], mainProducts: ["High Bay LED", "LED Warehouse Lights", "Industrial LED", "LED Street Lights"], verifiedDate: "Aug 16, 2026" },
  { id: "FR-GD-07094", name: "Shenzhen Globalux Industry Ltd.", industry: "LED Lighting", province: "Guangdong", city: "Shenzhen", established: 2014, employees: "50–100", exportRate: "", exportMarkets: ["North America", "Europe", "Australia", "Japan"], mainProducts: ["Smart LED Strips", "Addressable LED", "RGB LED Modules", "LED Controller Systems"], verifiedDate: "Aug 13, 2026" },
];

const FACTORY_DETAIL = {
  id: "FR-GD-08241",
  name: "Shenzhen Luminos Technology Co., Ltd.",
  nameZh: "深圳市卢米诺斯科技有限公司",
  industry: "LED Lighting",
  subIndustry: "Commercial & Residential LED",
  province: "Guangdong",
  city: "Shenzhen",
  district: "Baoan District",
  established: 2009,
  employees: "200–500",
  factorySize: "18,000 sqm",
  exportRate: "90%",
  annualRevenue: "USD 10M–50M",
  productionLines: 10,
  tradeTerms: "FOB, CIF, EXW",
  minOrder: "500 units",
  oemOdm: "OEM & ODM",
  qualitySystem: "ISO 9001:2015",
  overview: "Shenzhen Luminos Technology specializes in the design, development, and manufacturing of LED lighting products for commercial, residential, and industrial applications. The company operates 10 production lines and exports to over 40 countries across North America, Europe, and Asia-Pacific.",
  mainProducts: ["LED Strip Lights", "LED Panel Lights", "LED Downlights", "Commercial LED Fixtures", "LED Tube Lights", "LED Flood Lights"],
  exportMarkets: ["United States", "Germany", "United Kingdom", "Australia", "Japan", "UAE", "Southeast Asia"],
  certifications: ["CE", "RoHS", "UL", "ETL", "SAA", "ISO 9001:2015"],
  verifiedDate: "Sep 4, 2026",
  verificationMethod: "Manual — on-file documentation",
};

// ─── Shared Components ────────────────────────────────────────────────────────

function VerifiedDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", color: "#10B981" }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7" }}>
        <CheckIcon size={8} />
      </span>
    </span>
  );
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: "#ECFDF5", border: "1px solid #A7F3D0", fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#065F46", letterSpacing: "0.02em" }}>
      <CheckIcon size={8} />
      {label}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>
      {children}
    </span>
  );
}

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, color: color ?? "#374151" }}>
      {children}
    </span>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round">
      {open
        ? <><path d="M18 6 6 18"/><path d="M6 6l12 12"/></>
        : <><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></>}
    </svg>
  );
}

function Nav({ onHome, page, onNav }: { onHome: () => void; page: Page; onNav: (k: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem =
    page.kind === "industries" ? "Industries"
    : page.kind === "verification" ? "Verification"
    : page.kind === "pricing" ? "Pricing"
    : page.kind === "guides" ? "Guides"
    : null;

  const nav = (k: string) => { onNav(k); setMobileOpen(false); };

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onHome(); setMobileOpen(false); }} style={{ textDecoration: "none" }}>
            <LogoWordmark size={30} />
          </a>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["Industries", "Verification", "Pricing", "Guides"].map((item) => {
              const active = item === activeItem;
              return (
                <a key={item} href="#" onClick={(e) => { e.preventDefault(); onNav(item); }}
                  style={{ fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? "#0D1117" : "#6B7280", textDecoration: "none", position: "relative" }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#0D1117")}
                  onMouseLeave={(e) => { if (!active) (e.target as HTMLAnchorElement).style.color = "#6B7280"; }}>
                  {item}
                  {active && <span style={{ position: "absolute", bottom: -22, left: 0, right: 0, height: 2, borderRadius: 1, background: "#1E40AF" }} />}
                </a>
              );
            })}
          </nav>

          {/* Desktop auth */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav("Sign In"); }} style={{ fontSize: 13.5, fontWeight: 500, color: "#6B7280", textDecoration: "none" }}>Sign In</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav("Get Started"); }} style={{ padding: "7px 16px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.1px" }}>Get Started</a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen((o) => !o)}
            style={{ display: "none", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 8, background: "transparent", border: "1px solid #E9ECF1", cursor: "pointer" }}
            className="r-show" aria-label="Menu">
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          {["Industries", "Verification", "Pricing", "Guides"].map((item) => (
            <button key={item} onClick={() => nav(item)} className="nav-mobile-item"
              style={{ fontWeight: item === activeItem ? 600 : 500, color: item === activeItem ? "#1E40AF" : "#374151" }}>
              {item}
            </button>
          ))}
          <div className="nav-mobile-divider" />
          <button onClick={() => nav("Sign In")} className="nav-mobile-item" style={{ color: "#6B7280" }}>Sign In</button>
          <div style={{ padding: "8px 16px" }}>
            <button onClick={() => nav("Get Started")}
              style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

const EXAMPLE_QUERIES = ["LED lights", "cosmetic jars", "kraft paper boxes", "pet toys", "office furniture"];

function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "80px 32px 72px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 24 }}>
          China Supplier Intelligence · Verified Before Listed
        </p>
        <h1 style={{ fontSize: "clamp(40px,6vw,62px)", fontWeight: 800, letterSpacing: "-2.5px", lineHeight: 1.06, color: "#0D1117", marginBottom: 20 }}>
          Find Verified China Suppliers
        </h1>
        <p style={{ fontSize: 16, fontWeight: 400, color: "#6B7280", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
          Search verified China manufacturers, distributors, exporters, and wholesalers before you reach out.
        </p>
        <div className="hero-search-box" style={{ display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #D1D5DB", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)", overflow: "hidden", transition: "border-color 0.15s" }}
          onFocusCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1E40AF"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(30,64,175,0.08)"; }}
          onBlurCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#D1D5DB"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)"; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "0 18px" }}>
            <span style={{ color: "#9CA3AF", display: "flex" }}><SearchIcon /></span>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) onSearch(query.trim()); }}
              placeholder={`Search products or supplier categories — e.g. "LED lights"`}
              style={{ flex: 1, padding: "15px 0", fontSize: 15, color: "#0D1117", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ padding: 6, paddingLeft: 0 }}>
            <button onClick={() => onSearch(query.trim() || "LED lights")}
              style={{ padding: "9px 22px", borderRadius: 7, background: "#1E40AF", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", letterSpacing: "-0.1px" }}>
              Search Suppliers
            </button>
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          {["Government Registration", "Business Contact", "Supply Evidence"].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151" }}>
              <VerifiedDot />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
      <div className="section-heading-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <div className="section-heading-copy" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117" }}>Popular Verified Industries</h2>
          <Mono color="#9CA3AF">Every listed supplier has passed our verification checks</Mono>
        </div>
        <Link href="/industries" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#1E40AF", textDecoration: "none" }}>View all <ChevronRight /></Link>
      </div>
      <div className="r2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        {CATEGORIES.map((cat) => (
          <a key={cat.name} href="#" onClick={(e) => { e.preventDefault(); onSearch(cat.name); }}
            style={{ display: "flex", flexDirection: "column", gap: 0, padding: "20px", border: "1px solid #E9ECF1", borderRadius: 10, textDecoration: "none", background: "#fff", transition: "border-color 0.15s,box-shadow 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E40AF"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 14px rgba(30,64,175,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, fontWeight: 500, letterSpacing: "0.07em", color: "#9CA3AF", background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 4, padding: "2px 6px" }}>{cat.code}</span>
              <span style={{ color: "#D1D5DB" }}><ChevronRight /></span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px", marginBottom: 6, lineHeight: 1.3 }}>{cat.name}</p>
            <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 12 }}>{cat.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>{cat.secondaryCategories.slice(0, 5).map((category) => <span key={category.slug} style={{ padding: "3px 8px", borderRadius: 5, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 11, color: "#6B7280" }}>{category.name}</span>)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 12, borderTop: "1px solid #F0F1F3", marginTop: "auto" }}><div><FieldLabel>Available supplier types</FieldLabel><p style={{ fontSize: 11.5, color: "#374151", marginTop: 4 }}>{cat.supplierTypes}</p></div><div><FieldLabel>MOQ fit</FieldLabel><p style={{ fontSize: 11.5, color: "#374151", marginTop: 4 }}>{cat.moqFit}</p></div></div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#1E40AF", fontSize: 12.5, fontWeight: 600, marginTop: 14 }}>View Suppliers <ArrowRight /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function VerificationSection() {
  const steps = [
    { key: "gov", icon: GovIcon, label: "Government Registration", desc: "Business registration confirmed against official Chinese government databases. Validates legal entity status." },
    { key: "contact", icon: PhoneIcon, label: "Business Contact", desc: "Business phone, email address, and named contact person manually verified before record publication." },
    { key: "supply", icon: FactoryIcon, label: "Supply Evidence", desc: "Evidence matched to the supplier type — such as factory, authorization, export, inventory, or service capability evidence." },
  ];
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
      <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#10B981", marginBottom: 8 }}>Verification Protocol</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", maxWidth: 520, lineHeight: 1.2, marginBottom: 8 }}>Verified Before Listed</h2>
          <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.6 }}>Every supplier profile must pass verification before it appears in FactoryRoster search results.</p>
        </div>
        <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E9ECF1" }}>
          {steps.map(({ key, icon: Icon, label, desc }, i) => (
            <div key={key} style={{ background: "#fff", padding: "32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <Mono color="#9CA3AF">Check 0{i + 1}</Mono>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", border: "1px solid #6EE7B7", fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#10B981", letterSpacing: "0.05em" }}>
                  <CheckIcon size={9} />REQUIRED
                </span>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#1E40AF" }}>
                <Icon size={18} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px", marginBottom: 8 }}>{label}</h3>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 20px", borderRadius: 8, background: "#F7F8FA", border: "1px solid #E9ECF1", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981", flexShrink: 0 }}><CheckIcon size={10} /></span>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>All three checks are required.</span>{" "}
            Suppliers that fail any step are not published and do not appear in search results.
          </p>
        </div>
      </div>
    </section>
  );
}

function RecentRecords({ onDetail }: { onDetail: (f: SearchResult) => void }) {
  const [records, setRecords] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/factories?limit=6", { signal: controller.signal })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to load suppliers"); setRecords((body.suppliers ?? body.factories ?? []).map(apiFactoryToResult)); })
      .catch((reason) => { if (reason?.name !== "AbortError") setRecords([]); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  return (
    <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
      <div className="section-heading-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <div className="section-heading-copy" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117" }}>Recently Verified</h2>
          <Mono color="#9CA3AF">Published records only</Mono>
        </div>
        <Link href="/search" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#1E40AF", textDecoration: "none" }}>
          Search all records <ArrowRight />
        </Link>
      </div>
      <div className="r-scroll" style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ minWidth: 600, display: "grid", gridTemplateColumns: "1fr 140px 140px 130px 110px", padding: "10px 20px", background: "#F7F8FA", borderBottom: "1px solid #E9ECF1" }}>
          {["Supplier Name", "Industry", "Location", "Record ID", "Verified"].map((col) => (<FieldLabel key={col}>{col}</FieldLabel>))}
        </div>
        {records.map((f, i) => (
          <a key={f.id} href="#" onClick={(e) => { e.preventDefault(); onDetail(f); }}
            style={{ minWidth: 600, display: "grid", gridTemplateColumns: "1fr 140px 140px 130px 110px", padding: "14px 20px", borderBottom: i < records.length - 1 ? "1px solid #F0F1F3" : undefined, textDecoration: "none", background: "#fff", alignItems: "center", transition: "background 0.1s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#FAFBFC")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#fff")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0D1117", letterSpacing: "-0.1px" }}>{f.name}</span>
              <div style={{ display: "flex", gap: 5 }}>
                {["Gov. Registration", "Business Contact", "Supply Evidence"].map((b) => (<VerifiedBadge key={b} label={b} />))}
              </div>
            </div>
            <Mono>{f.industry}</Mono>
            <Mono>{f.city}, {f.province}</Mono>
            <Mono color="#1E40AF">{f.id}</Mono>
            <Mono>{f.verifiedDate}</Mono>
          </a>
        ))}
        {loading && <p style={{ padding: 20, color: "#6B7280", fontSize: 13 }}>Loading verified suppliers…</p>}
        {!loading && records.length === 0 && <p style={{ padding: 20, color: "#6B7280", fontSize: 13 }}>No verified supplier records are currently available.</p>}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", icon: GovIcon, label: "Government Registration", desc: "Business registration verified against official Chinese government records." },
    { num: "02", icon: PhoneIcon, label: "Business Contact", desc: "Phone, email, and named contact person verified by our team." },
    { num: "03", icon: FactoryIcon, label: "Supply Evidence", desc: "Evidence appropriate to the supplier type is reviewed and recorded." },
    { num: "→", icon: () => <CheckIcon size={18} />, label: "Published", desc: "Record enters the live database. Visible to verified buyers on FactoryRoster.", published: true },
  ];
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
      <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ marginBottom: 40, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 6 }}>Verification Pipeline</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "#0D1117" }}>How a supplier record is verified</h2>
          </div>
          <Mono color="#9CA3AF">3 checks · manual review · sequential</Mono>
        </div>
        <div className="r4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#E9ECF1" }}>
          {steps.map(({ num, icon: Icon, label, desc, published }) => (
            <div key={label} style={{ background: published ? "#F0FDF4" : "#fff", padding: "28px 24px" }}>
              <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 22, fontWeight: 300, color: published ? "#10B981" : "#E5E7EB", marginBottom: 20, lineHeight: 1 }}>{num}</div>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: published ? "#ECFDF5" : "#F0F4FF", border: `1px solid ${published ? "#6EE7B7" : "#DBEAFE"}`, display: "flex", alignItems: "center", justifyContent: "center", color: published ? "#10B981" : "#1E40AF", marginBottom: 14 }}>
                <Icon size={18} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: published ? "#065F46" : "#0D1117", letterSpacing: "-0.2px", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onNav }: { onNav?: (k: string) => void }) {
  const go = (k: string) => (e: React.MouseEvent) => { e.preventDefault(); onNav?.(k); };
  const cols: { heading: string; items: { label: string; nav: string }[] }[] = [
    {
      heading: "Product",
      items: [
        { label: "Search Suppliers", nav: "Home" },
        { label: "Browse Industries", nav: "Industries" },
        { label: "Verification", nav: "Verification" },
        { label: "Pricing", nav: "Pricing" },
        { label: "Guides", nav: "Guides" },
      ],
    },
    {
      heading: "Services",
      items: [
        { label: "Contact Credits", nav: "Pricing" },
        { label: "Request Verification", nav: "Request Verification" },
        { label: "Supplier Reports", nav: "Request Verification" },
      ],
    },
    {
      heading: "Company",
      items: [
        { label: "About", nav: "About" },
        { label: "Contact", nav: "Contact" },
        { label: "Privacy Policy", nav: "Privacy" },
        { label: "Terms", nav: "Terms" },
      ],
    },
  ];
  return (
    <footer style={{ borderTop: "1px solid #E9ECF1", background: "#fff" }}>
      <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 32px" }}>
        <div className="rfooter" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ marginBottom: 12 }}><LogoWordmark size={24} /></div>
            <p style={{ fontSize: 12.5, color: "#9CA3AF", lineHeight: 1.7, maxWidth: 200 }}>China Supplier Intelligence · Verified Before Listed. Not a marketplace.</p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981" }}><CheckIcon size={8} /></span>
              <Mono color="#9CA3AF">Verified-only database</Mono>
            </div>
          </div>
          {cols.map(({ heading, items }) => (
            <div key={heading}>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 14 }}>{heading}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                {items.map(({ label, nav }) => (
                  <li key={label}><a href="#" onClick={go(nav)} style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#374151")}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#9CA3AF")}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 20, borderTop: "1px solid #E9ECF1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono color="#9CA3AF">© {new Date().getFullYear()} FactoryRoster · factoryroster.com</Mono>
          <Mono color="#9CA3AF">Verified supplier records · reviewed before listing</Mono>
        </div>
      </div>
    </footer>
  );
}

// ─── Search Results Page ───────────────────────────────────────────────────────

const FILTER_PROVINCES = ["Guangdong", "Zhejiang", "Jiangsu", "Fujian", "Shandong"];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 8 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</div>
    </div>
  );
}

function FilterOption({ label, count, active, onClick }: { label: string; count?: number | string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 6, background: active ? "#EFF3FF" : "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Checkbox */}
        <span style={{
          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
          border: active ? "none" : "1.5px solid #D1D5DB",
          background: active ? "#1E40AF" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {active && <CheckIcon size={9} />}
        </span>
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#1E40AF" : "#374151" }}>{label}</span>
      </div>
      {count !== undefined && <Mono color={active ? "#1E40AF" : "#9CA3AF"}>{count}</Mono>}
    </button>
  );
}

function SearchResultsPage({ query, onDetail, onSearch }: { query: string; onDetail: (f: SearchResult) => void; onSearch: (q: string) => void }) {
  const [localQuery, setLocalQuery] = useState(query);
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [primaryIndustry, setPrimaryIndustry] = useState<string | null>(null);
  const [secondaryCategory, setSecondaryCategory] = useState<string | null>(null);
  const [supplierType, setSupplierType] = useState<string | null>(null);
  const [moqLevel, setMoqLevel] = useState<string | null>(null);
  const [supplyModel, setSupplyModel] = useState<string | null>(null);
  const [smallOrders, setSmallOrders] = useState(false);
  const [sampleOrders, setSampleOrders] = useState(false);
  const [privateLabel, setPrivateLabel] = useState(false);
  const [sort, setSort] = useState("Relevance");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "50" });
    if (query.trim()) params.set("q", query.trim());
    if (activeProvince) params.set("province", activeProvince);
    if (primaryIndustry) params.set("primary_industry", primaryIndustry);
    if (secondaryCategory) params.set("secondary_category", secondaryCategory);
    if (supplierType) params.set("supplier_type", supplierType);
    if (moqLevel) params.set("moq_level", moqLevel);
    if (supplyModel) params.set("supply_model", supplyModel);
    if (smallOrders) params.set("small_orders", "true");
    if (sampleOrders) params.set("sample_orders", "true");
    if (privateLabel) params.set("private_label", "true");
    fetch(`/api/factories?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load suppliers");
        setResults((body.suppliers ?? body.factories ?? []).map(apiFactoryToResult));
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load suppliers");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query, activeProvince, primaryIndustry, secondaryCategory, supplierType, moqLevel, supplyModel, smallOrders, sampleOrders, privateLabel]);

  const selectProvince = (province: string | null) => {
    setLoading(true);
    setError("");
    setActiveProvince(province);
  };

  const filtered = [...results].sort((a, b) => {
    if (sort === "Recently Verified") return Date.parse(b.verifiedDate) - Date.parse(a.verifiedDate);
    if (sort === "Est. Year") return b.established - a.established;
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Search bar strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E9ECF1", padding: "14px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #D1D5DB", borderRadius: 9, overflow: "hidden", flex: 1, maxWidth: 580 }}
            onFocusCapture={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "#1E40AF"}
            onBlurCapture={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = "#D1D5DB"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, padding: "0 14px" }}>
              <span style={{ color: "#9CA3AF" }}><SearchIcon /></span>
              <input value={localQuery} onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && localQuery.trim()) onSearch(localQuery.trim()); }}
                style={{ flex: 1, padding: "9px 0", fontSize: 14, color: "#0D1117", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ padding: "4px 5px 4px 0" }}>
              <button onClick={() => onSearch(localQuery.trim())} style={{ padding: "6px 16px", borderRadius: 6, background: "#1E40AF", color: "#fff", fontSize: 12.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rsidebar inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 28 }}>

        {/* Sidebar */}
        <aside>
          {/* Verified-only notice */}
          <div style={{ marginBottom: 24, padding: "10px 12px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "flex-start", gap: 7 }}>
            <span style={{ marginTop: 1, color: "#10B981", flexShrink: 0 }}><CheckIcon size={12} /></span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#065F46", marginBottom: 2 }}>Verified suppliers only</p>
              <p style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.5 }}>All results passed FactoryRoster's three-step verification</p>
            </div>
          </div>

          <FilterSection title="Primary Industry">
            {PRIMARY_INDUSTRIES.map((industry) => <FilterOption key={industry.slug} label={industry.name} active={primaryIndustry === industry.slug} onClick={() => { const next = primaryIndustry === industry.slug ? null : industry.slug; setPrimaryIndustry(next); setSecondaryCategory(null); }} />)}
          </FilterSection>

          {primaryIndustry && <FilterSection title="Secondary Category">
            {(PRIMARY_INDUSTRIES.find((industry) => industry.slug === primaryIndustry)?.secondaryCategories ?? []).map((category) => <FilterOption key={category.slug} label={category.name} active={secondaryCategory === category.slug} onClick={() => setSecondaryCategory(secondaryCategory === category.slug ? null : category.slug)} />)}
          </FilterSection>}

          <FilterSection title="Supplier Type">
            {[["Manufacturer", "manufacturer"], ["Authorized Distributor", "authorized_distributor"], ["First-tier Agent", "first_tier_agent"], ["Trading Company", "trading_company"], ["Exporter", "exporter"], ["Wholesaler", "wholesaler"], ["Brand Owner", "brand_owner"], ["Sourcing Service Provider", "sourcing_service_provider"]].map(([label, value]) => <FilterOption key={value} label={label} active={supplierType === value} onClick={() => setSupplierType(supplierType === value ? null : value)} />)}
          </FilterSection>

          <FilterSection title="MOQ Fit">
            {[["Sample supported", "sample_supported"], ["Low MOQ", "low_moq"], ["Standard MOQ", "standard_moq"], ["Bulk only", "bulk_only"]].map(([label, value]) => <FilterOption key={value} label={label} active={moqLevel === value} onClick={() => setMoqLevel(moqLevel === value ? null : value)} />)}
          </FilterSection>

          <FilterSection title="Order Support">
            <FilterOption label="Small batch friendly" active={smallOrders} onClick={() => setSmallOrders(!smallOrders)} />
            <FilterOption label="Sample order supported" active={sampleOrders} onClick={() => setSampleOrders(!sampleOrders)} />
            <FilterOption label="Private label support" active={privateLabel} onClick={() => setPrivateLabel(!privateLabel)} />
          </FilterSection>

          <FilterSection title="Supply Model">
            {[["Factory direct", "factory_direct"], ["Authorized distribution", "authorized_distribution"], ["First-tier agent", "first_tier_agent"], ["Wholesale inventory", "wholesale_inventory"], ["Export trading", "export_trading"], ["Sourcing service", "sourcing_service"]].map(([label, value]) => <FilterOption key={value} label={label} active={supplyModel === value} onClick={() => setSupplyModel(supplyModel === value ? null : value)} />)}
          </FilterSection>

          {/* Province */}
          <FilterSection title="Province">
            <FilterOption label="All provinces" active={activeProvince === null} onClick={() => selectProvince(null)} />
            {FILTER_PROVINCES.map((province) => (
              <FilterOption key={province} label={province} active={activeProvince === province} onClick={() => selectProvince(province === activeProvince ? null : province)} />
            ))}
          </FilterSection>
        </aside>

        {/* Results */}
        <main>
          {/* Result summary */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 4 }}>
              {loading ? "Loading verified suppliers…" : `${filtered.length} Verified ${query || "China"} Suppliers`}
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280" }}>
              All results passed FactoryRoster's three-step verification process.
            </p>
          </div>

          {/* Sort row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Mono color="#9CA3AF">Sort:</Mono>
              {["Relevance", "Recently Verified", "Est. Year"].map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  style={{ padding: "4px 10px", borderRadius: 5, fontSize: 12.5, fontWeight: sort === s ? 600 : 400, color: sort === s ? "#1E40AF" : "#6B7280", background: sort === s ? "#EFF3FF" : "transparent", border: sort === s ? "1px solid #DBEAFE" : "1px solid transparent", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
            <Mono color="#9CA3AF">{filtered.length} results</Mono>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {error && <div role="alert" style={{ padding: 16, borderRadius: 8, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>{error}</div>}
            {!loading && !error && filtered.length === 0 && <div style={{ padding: 28, borderRadius: 10, background: "#fff", border: "1px solid #E9ECF1", color: "#6B7280" }}>No verified suppliers matched this search.</div>}
            {filtered.map((r) => (
              <ResultCard key={r.id} result={r} onDetail={onDetail} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function ResultCard({ result: r, onDetail }: { result: SearchResult; onDetail: (f: SearchResult) => void }) {
  const [hovered, setHovered] = useState(false);
  const fitBadges = [
    r.moqLevel && formatCategoryLabel(r.moqLevel),
    r.supportsSampleOrders && "Sample Supported",
    r.supportsSmallOrders && "Small Batch Friendly",
    r.supportsPrivateLabel && "Private Label",
  ].filter(Boolean) as string[];

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", border: `1px solid ${hovered ? "#DBEAFE" : "#E9ECF1"}`, borderRadius: 10, padding: "20px 22px", transition: "border-color 0.15s, box-shadow 0.15s", boxShadow: hovered ? "0 2px 10px rgba(30,64,175,0.05)" : "none" }}>

      {/* Row 1: name + actions */}
      <div className="result-card-heading" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px", lineHeight: 1.3 }}>{r.name}</span>
        </div>
        <div className="result-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onDetail(r)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, border: "1px solid #DBEAFE", background: "#EFF3FF", fontSize: 12.5, fontWeight: 600, color: "#1E40AF", cursor: "pointer" }}>
            View Supplier <ArrowRight />
          </button>
          <button onClick={() => onDetail(r)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 6, border: "1px solid #1E40AF", background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#1E40AF", cursor: "pointer" }}>
            <LockIcon /> Unlock Contact
          </button>
        </div>
      </div>

      {/* Row 2: meta */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10, flexWrap: "wrap" as const }}>
        <span style={{ padding: "3px 8px", borderRadius: 5, background: "#ECFDF5", border: "1px solid #A7F3D0", fontSize: 11, fontWeight: 600, color: "#047857" }}>{supplierTypeLabel(r.supplierType)}</span>
        <Mono color="#6B7280">{r.industry}</Mono>
        {r.secondaryCategories?.map((category) => <span key={category} style={{ padding: "2px 7px", borderRadius: 4, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 11, color: "#6B7280" }}>{category}</span>)}
        <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
        <Mono color="#6B7280">{r.city}, {r.province}, China</Mono>
        <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
        <Mono color="#9CA3AF">Est. {r.established}</Mono>
        <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
        <Mono color="#9CA3AF">{r.employees} employees</Mono>
        {r.exportMarkets && r.exportMarkets.length > 0 && (
          <>
            <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
            <Mono color="#9CA3AF">Export markets: {r.exportMarkets.slice(0, 2).join(", ")}{r.exportMarkets.length > 2 ? ` +${r.exportMarkets.length - 2}` : ""}</Mono>
          </>
        )}
      </div>

      {/* Row 3: products */}
      <div className="result-products" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <FieldLabel>Products</FieldLabel>
        <span style={{ width: 1, height: 10, background: "#E5E7EB" }} />
        <span style={{ fontSize: 12.5, color: "#6B7280" }}>{r.mainProducts.join("  ·  ")}</span>
      </div>

      {fitBadges.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>{[...new Set(fitBadges)].map((badge) => <span key={badge} style={{ padding: "3px 8px", borderRadius: 5, background: badge === "Bulk Only" ? "#FFF7ED" : "#EFF3FF", border: `1px solid ${badge === "Bulk Only" ? "#FED7AA" : "#DBEAFE"}`, fontSize: 11, fontWeight: 600, color: badge === "Bulk Only" ? "#C2410C" : "#1E40AF" }}>{badge}</span>)}</div>}

      {/* Row 4: verification + contact preview */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 10 }}>
        <div className="verification-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <VerifiedBadge label="Gov. Registration" />
            <VerifiedBadge label="Business Contact" />
            <VerifiedBadge label={supplyEvidenceLabel(r.supplyEvidenceType)} />
          </div>
          <span style={{ width: 1, height: 14, background: "#E5E7EB" }} />
          <Mono color="#9CA3AF">Last verified {r.verifiedDate}</Mono>
          <span style={{ width: 1, height: 14, background: "#E5E7EB" }} />
          <Mono color="#9CA3AF">{r.id}</Mono>
        </div>

        {/* Locked contact preview */}
        <div className="locked-contact-preview" style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "#F7F8FA", border: "1px solid #E9ECF1" }}>
          <span style={{ color: "#9CA3AF" }}><LockIcon /></span>
          <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Locked contact intelligence:</span>
          <Mono color="#9CA3AF">Phone · Email · Contact person</Mono>
        </div>
      </div>
    </div>
  );
}

// ─── Factory Detail Page ───────────────────────────────────────────────────────

function RedactedField({ type }: { type: "phone" | "email" | "name" | "position" | "handle" | "date" | "method" }) {
  const patterns: Record<string, string> = {
    phone: "+86 ████ ████ ████",
    email: "████████@████████.com",
    name: "████ ███",
    position: "███████ Manager",
    handle: "+86 ████ ████ ████",
    date: "███ ██, 2026",
    method: "Manual verification",
  };
  return (
    <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 12.5, color: "#CBD5E1", letterSpacing: "0.03em", userSelect: "none" as const }}>
      {patterns[type]}
    </span>
  );
}

function LockedRow({ icon: Icon, label, type }: { icon: React.FC; label: string; type: "phone" | "email" | "name" | "position" | "handle" | "date" | "method" }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #F5F6F8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <span style={{ color: "#C4C9D4", flexShrink: 0 }}><Icon /></span>
        <div>
          <FieldLabel>{label}</FieldLabel>
          <div style={{ marginTop: 2 }}><RedactedField type={type} /></div>
        </div>
      </div>
      <span style={{ color: "#D1D5DB", flexShrink: 0 }}><LockIcon /></span>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: React.FC; label: string; value: string | null | undefined }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #F5F6F8", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: "#10B981", flexShrink: 0 }}><Icon /></span>
      <div style={{ minWidth: 0 }}>
        <FieldLabel>{label}</FieldLabel>
        <p style={{ marginTop: 2, fontSize: 12.5, color: "#0D1117", overflowWrap: "anywhere" }}>{value || "Not available"}</p>
      </div>
    </div>
  );
}

function FactoryDetailPage({ factory, fromQuery, onBack }: { factory: SearchResult; fromQuery: string; onBack: () => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(factory.profile ?? null);
  const [profileError, setProfileError] = useState("");
  const [contact, setContact] = useState<UnlockedContact | null>(null);
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  useEffect(() => {
    if (!factory.slug) return;
    const controller = new AbortController();
    fetch(`/api/factories/${encodeURIComponent(factory.slug)}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load supplier profile");
        setProfile(body.supplier ?? body.factory);
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setProfileError(reason instanceof Error ? reason.message : "Unable to load supplier profile");
      });
    return () => controller.abort();
  }, [factory.slug]);

  const unlock = async () => {
    if (!factory.slug) return;
    if (!window.confirm("Unlock this Verified Contact Record for 1 Contact Credit?")) return;
    setUnlockBusy(true);
    setUnlockError("");
    try {
      const response = await fetch(`/api/factories/${encodeURIComponent(factory.slug)}/unlock`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) {
        if (body.code === "AUTH_REQUIRED") {
          router.push(`/sign-in?next=${encodeURIComponent(`/factories/${factory.slug}`)}`);
          return;
        }
        if (body.code === "INSUFFICIENT_CREDITS") throw new Error("You need contact credits to unlock this record. Contact credit purchase is coming soon.");
        throw new Error(body.error || "Unable to unlock contact");
      }
      setContact(body.contact);
    } catch (reason) {
      setUnlockError(reason instanceof Error ? reason.message : "Unable to unlock contact");
    } finally {
      setUnlockBusy(false);
    }
  };

  const companyName = String(profile?.company_name ?? factory.name);
  const chineseName = String(profile?.chinese_name ?? "");
  const overview = String(profile?.overview ?? "Supplier profile details are loading.");
  const products = Array.isArray(profile?.main_products) ? profile.main_products.map(String) : factory.mainProducts;
  const markets = Array.isArray(profile?.export_markets) ? profile.export_markets.map(String) : (factory.exportMarkets ?? []);
  const certifications = Array.isArray(profile?.certifications) ? profile.certifications.map(String) : [];
  const supplierType = String(profile?.supplier_type ?? factory.supplierType ?? "manufacturer");
  const evidenceType = String(profile?.supply_evidence_type ?? factory.supplyEvidenceType ?? "factory_evidence");
  const primaryIndustry = String((profile?.industries as { name?: string } | undefined)?.name ?? factory.industry);
  const secondaryCategories = (profile?.secondary_category as { name?: string } | undefined)?.name ? [String((profile?.secondary_category as { name?: string }).name)] : (factory.secondaryCategories ?? []);
  const moqLevel = String(profile?.moq_level ?? factory.moqLevel ?? "unknown");
  const supplyModel = String(profile?.supply_model ?? factory.supplyModel ?? "factory_direct");
  const supportsSampleOrders = Boolean(profile?.supports_sample_orders ?? factory.supportsSampleOrders);
  const supportsSmallOrders = Boolean(profile?.supports_small_orders ?? factory.supportsSmallOrders);
  const supportsPrivateLabel = Boolean(profile?.supports_private_label ?? factory.supportsPrivateLabel);
  const manufacturer = supplierType === "manufacturer";

  const overviewStats = [
    { label: "Supplier Type", value: supplierTypeLabel(supplierType), verified: true },
    { label: "Supply Model", value: formatCategoryLabel(supplyModel), verified: true },
    { label: "Primary Industry", value: primaryIndustry, verified: true },
    { label: "Secondary Categories", value: secondaryCategories.join(", ") || "Not classified", verified: true },
    { label: "MOQ Level", value: formatCategoryLabel(moqLevel), verified: true },
    { label: "Sample Orders", value: supportsSampleOrders ? "Supported" : "Not confirmed", verified: true },
    { label: "Small Orders", value: supportsSmallOrders ? "Supported" : "Not confirmed", verified: true },
    { label: "Private Label", value: supportsPrivateLabel ? "Supported" : "Not confirmed", verified: true },
    { label: "Established", value: String(profile?.established_year ?? (factory.established || "Not disclosed")), verified: true },
    { label: "Employees", value: String(profile?.employee_range ?? factory.employees), verified: true },
    { label: manufacturer ? "Factory Size" : "Operation Size", value: String(profile?.factory_size ?? "Not disclosed"), verified: false },
    { label: "MOQ Detail", value: String(profile?.moq ?? "Not disclosed"), verified: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E9ECF1", padding: "12px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 500, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ChevronLeft />Back to results
          </button>
          <span style={{ color: "#D1D5DB", fontSize: 12 }}>/</span>
          <Mono color="#9CA3AF">{factory.industry}</Mono>
          <span style={{ color: "#D1D5DB", fontSize: 12 }}>/</span>
          <Mono color="#6B7280">{factory.name}</Mono>
        </div>
      </div>

      {/* Supplier header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", flexShrink: 0 }}>
                  <FactoryIcon size={20} />
                </div>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#0D1117", lineHeight: 1.2 }}>{companyName}</h1>
                  {chineseName && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{chineseName}</p>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" as const, marginBottom: 10 }}>
                <Mono color="#6B7280">{primaryIndustry}</Mono>
                {secondaryCategories.map((category) => <span key={category} style={{ padding: "2px 7px", borderRadius: 4, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 11, color: "#6B7280" }}>{category}</span>)}
                <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
                <Mono color="#6B7280">{[profile?.district, factory.city, factory.province, "China"].filter(Boolean).map(String).join(", ")}</Mono>
                <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
                <Mono color="#9CA3AF">Est. {String(profile?.established_year ?? factory.established)}</Mono>
                <span style={{ width: 1, height: 12, background: "#E5E7EB" }} />
                <Mono color="#9CA3AF">{factory.id}</Mono>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", border: "1px solid #6EE7B7", fontSize: 10, fontWeight: 600, color: "#047857" }}>{supplierTypeLabel(supplierType)}</span>
                <VerifiedBadge label="Government Registration" />
                <VerifiedBadge label="Business Contact" />
                <VerifiedBadge label={supplyEvidenceLabel(evidenceType)} />
                <span style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 4 }}>
                  <Mono color="#9CA3AF">Last verified {factory.verifiedDate}</Mono>
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
              <button onClick={unlock} disabled={unlockBusy} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: unlockBusy ? "wait" : "pointer", letterSpacing: "-0.1px", opacity: unlockBusy ? 0.7 : 1 }}>
                {unlockBusy ? "Unlocking…" : contact ? "Contact Unlocked" : "Unlock Contact"}
              </button>
              <Mono color="#9CA3AF">Uses 1 contact credit</Mono>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="rdetail inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "flex-start" }}>

        {/* Left: public intelligence */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Overview */}
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #E9ECF1" }}>
              <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Supplier Overview</h2>
            </div>
            <div style={{ padding: "16px 22px" }}>
              {profileError && <p role="alert" style={{ color: "#B91C1C", fontSize: 12.5, marginBottom: 12 }}>{profileError}</p>}
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>{overview}</p>
              <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid #E9ECF1", borderRadius: 8, overflow: "hidden" }}>
                {overviewStats.map(({ label, value, verified }, i) => (
                  <div key={label} style={{ padding: "12px 16px", borderRight: i % 3 < 2 ? "1px solid #E9ECF1" : undefined, borderBottom: i < overviewStats.length - 3 ? "1px solid #E9ECF1" : undefined }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <FieldLabel>{label}</FieldLabel>
                      {!verified && (
                        <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, color: "#D1D5DB", letterSpacing: "0.04em" }}>REVIEWED</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: verified ? "#0D1117" : "#6B7280" }}>{value}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "#C4C9D4", marginTop: 10, lineHeight: 1.5 }}>
                Fields marked REVIEWED are based on information provided by the supplier and reviewed but not independently verified.
              </p>
            </div>
          </div>

          {/* Main Products */}
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #E9ECF1" }}>
              <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Main Products</h2>
            </div>
            <div style={{ padding: "16px 22px", display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {products.map((p) => (
                <span key={p} style={{ padding: "5px 12px", borderRadius: 6, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 13, color: "#374151", fontWeight: 500 }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Two columns: Export Markets + Certifications */}
          <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 22px", borderBottom: "1px solid #E9ECF1" }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Export Markets</h2>
              </div>
              <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 7 }}>
                {markets.map((m) => (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#374151" }}>{m}</span>
                  </div>
                ))}
                <p style={{ fontSize: 11.5, color: "#C4C9D4", marginTop: 6, lineHeight: 1.5 }}>
                  Export market information is mentioned by the supplier and not independently verified.
                </p>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 22px", borderBottom: "1px solid #E9ECF1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Certifications</h2>
              </div>
              <div style={{ padding: "16px 22px" }}>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7, marginBottom: 12 }}>
                  {certifications.map((c) => (
                    <span key={c} style={{ padding: "4px 10px", borderRadius: 5, background: "#F0F4FF", border: "1px solid #DBEAFE", fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, fontWeight: 500, color: "#1E40AF" }}>{c}</span>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: "#C4C9D4", lineHeight: 1.5, marginBottom: 14 }}>
                  Certifications are shown when verified or supported by reviewed evidence. Unverified items are labeled as mentioned only.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[["Trade Terms", Array.isArray(profile?.trade_terms) && profile.trade_terms.length ? profile.trade_terms.map(String).join(", ") : "Not disclosed"], ["Min. Order", String(profile?.moq ?? "Not disclosed")]].map(([k, v]) => (
                    <div key={k as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <FieldLabel>{k}</FieldLabel>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #E9ECF1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Verification Status</h2>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#10B981", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                <CheckIcon size={10} />All three checks passed
              </span>
            </div>
            <div>
              {[
                { icon: GovIcon, label: "Government Registration", note: "Official registry check · SAMR database" },
                { icon: PhoneIcon, label: "Business Contact", note: "Manual phone/email verification" },
                { icon: FactoryIcon, label: supplyEvidenceLabel(evidenceType), note: manufacturer ? "Factory photo/video evidence reviewed" : "Supplier-type evidence reviewed" },
              ].map(({ icon: Icon, label, note }, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderBottom: i < 2 ? "1px solid #F5F6F8" : undefined }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
                    <Icon size={15} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0D1117" }}>{label}</p>
                    <p style={{ fontSize: 12, color: "#9CA3AF" }}>{note}</p>
                  </div>
                  <VerifiedBadge label="Verified" />
                </div>
              ))}
              <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <div>
                  <FieldLabel>Last Verified</FieldLabel>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginTop: 2 }}>{factory.verifiedDate}</p>
                </div>
                <span style={{ width: 1, height: 30, background: "#E9ECF1" }} />
                <div>
                  <FieldLabel>Method</FieldLabel>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginTop: 2 }}>Recorded in the verification record</p>
                </div>
                <span style={{ width: 1, height: 30, background: "#E9ECF1" }} />
                <div>
                  <FieldLabel>Record ID</FieldLabel>
                  <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 12, fontWeight: 500, color: "#1E40AF", marginTop: 2 }}>{factory.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: "14px 18px", borderRadius: 8, background: "#F7F8FA", border: "1px solid #E9ECF1" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.65 }}>
              FactoryRoster provides verified supplier information for sourcing research only. Verification does not guarantee product quality, delivery, pricing, or transaction outcomes.
            </p>
          </div>
        </div>

        {/* Right sidebar — sticky */}
        <aside style={{ position: "sticky", top: 66 }}>

          {/* Contact unlock card */}
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E9ECF1", background: "#FAFBFC" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 6, background: "#F0F4FF", border: "1px solid #DBEAFE", color: "#1E40AF" }}>
                  <ShieldIcon />
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Verified Contact Record</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
                Get verified phone, email, contact person, position, WhatsApp/WeChat if available, verification method, and last verification date.
              </p>
            </div>

            <div style={{ padding: "4px 20px 6px" }}>
              {contact ? <>
                <ContactRow icon={UserIcon} label="Contact Person" value={contact.contact_person} />
                <ContactRow icon={UserIcon} label="Position" value={contact.contact_position} />
                <ContactRow icon={PhoneIcon} label="Verified Phone" value={contact.verified_phone} />
                <ContactRow icon={MailIcon} label="Verified Email" value={contact.verified_email} />
                <ContactRow icon={MessageIcon} label="WhatsApp / WeChat" value={[contact.whatsapp, contact.wechat].filter(Boolean).join(" / ")} />
                <ContactRow icon={CheckIcon as unknown as React.FC} label="Last Contact Verified" value={formatDate(contact.last_contact_verified_at)} />
                <ContactRow icon={ShieldIcon as unknown as React.FC} label="Verification Method" value={contact.contact_verification_method} />
              </> : <>
                <LockedRow icon={UserIcon} label="Contact Person" type="name" />
                <LockedRow icon={UserIcon} label="Position" type="position" />
                <LockedRow icon={PhoneIcon} label="Verified Phone" type="phone" />
                <LockedRow icon={MailIcon} label="Verified Email" type="email" />
                <LockedRow icon={MessageIcon} label="WhatsApp / WeChat" type="handle" />
                <LockedRow icon={CheckIcon as unknown as React.FC} label="Last Contact Verified" type="date" />
                <LockedRow icon={ShieldIcon as unknown as React.FC} label="Verification Method" type="method" />
              </>}
            </div>

            <div style={{ padding: "14px 20px 16px", borderTop: "1px solid #E9ECF1" }}>
              {unlockError && <p role="alert" style={{ color: "#B91C1C", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{unlockError}</p>}
              <button onClick={unlock} disabled={unlockBusy || Boolean(contact)} style={{ width: "100%", padding: "11px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: unlockBusy ? "wait" : "pointer", opacity: contact ? 0.7 : 1, letterSpacing: "-0.1px", marginBottom: 8 }}>
                {unlockBusy ? "Unlocking…" : contact ? `Unlocked · ${contact.credits_remaining} credits left` : "Unlock Contact"}
              </button>
              <p style={{ fontSize: 11.5, color: "#9CA3AF", textAlign: "center" as const }}>
                Uses 1 contact credit
              </p>
            </div>
          </div>

          {/* Request verification card */}
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "16px 20px", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D1117", marginBottom: 6 }}>Need deeper verification?</p>
            <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>
              Request additional supplier evidence, contact checks, or live verification support.
            </p>
            <button onClick={() => router.push("/request-verification")} style={{ width: "100%", padding: "8px 0", borderRadius: 7, background: "transparent", border: "1px solid #D1D5DB", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              Request Verification
            </button>
          </div>

          {/* Record info */}
          <div style={{ padding: "14px 18px", background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10 }}>
            <FieldLabel>About this record</FieldLabel>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                ["Record ID", factory.id],
                ["Primary Industry", primaryIndustry],
                ["Secondary Category", secondaryCategories.join(", ") || "—"],
                ["Province", factory.province],
                ["Last Verified", factory.verifiedDate],
              ].map(([k, v]) => (
                <div key={k as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <FieldLabel>{k}</FieldLabel>
                  <Mono color={k === "Record ID" ? "#1E40AF" : "#374151"}>{v}</Mono>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Industries Page ──────────────────────────────────────────────────────────

const INDUSTRY_CARDS_RICH = PRIMARY_INDUSTRIES.map((industry) => ({ code: industry.code, name: industry.name, slug: industry.slug, desc: industry.description, chips: industry.secondaryCategories.slice(0, 5).map((category) => category.name), supplierTypes: industry.supplierTypes, moqFit: industry.moqFit }));

const INDUSTRY_GROUPS = PRIMARY_INDUSTRIES.map((industry) => ({ group: industry.name, items: industry.secondaryCategories.map((category) => category.name) }));

function IndustriesPage({ onSearch, onNav }: { onSearch: (q: string) => void; onNav?: (k: string) => void }) {
  const [searchVal, setSearchVal] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const groups = ["All", ...INDUSTRY_GROUPS.map((g) => g.group)];

  const filteredCards = activeGroup === "All"
    ? INDUSTRY_CARDS_RICH
    : INDUSTRY_CARDS_RICH.filter((category) => category.name === activeGroup);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>

      {/* Compact page header */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 36px" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>
            China Supplier Industries
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const }}>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0D1117", marginBottom: 8 }}>
                Browse Verified Industries
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 520 }}>
                Explore the most searched China supply categories. Every listed supplier has passed FactoryRoster's verification process.
              </p>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <VerifiedDot />All listed suppliers pass Government Registration, Business Contact, and Supply Evidence checks.
            </p>
          </div>
        </div>

        {/* Search + filter toolbar */}
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search input */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 8, padding: "0 14px", height: 38 }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1E40AF"; (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
            onBlurCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLDivElement).style.background = "#F7F8FA"; }}>
            <span style={{ color: "#9CA3AF", display: "flex", flexShrink: 0 }}><SearchIcon size={14} /></span>
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSearch(searchVal); }}
              placeholder="Search industries or products"
              style={{ flex: 1, fontSize: 13.5, color: "#0D1117", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }}
            />
          </div>
          {/* Group dropdown */}
          <div style={{ position: "relative" as const }}>
            <select
              value={activeGroup}
              onChange={(e) => setActiveGroup(e.target.value)}
              style={{ appearance: "none" as const, WebkitAppearance: "none" as const, height: 38, padding: "0 32px 0 12px", fontSize: 13, fontWeight: 500, color: "#374151", background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
              {groups.map((g) => <option key={g} value={g}>{g === "All" ? "All groups" : g}</option>)}
            </select>
            <span style={{ position: "absolute" as const, right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" as const, color: "#9CA3AF" }}>
              <ChevronRight size={10} />
            </span>
          </div>
          {/* Search button */}
          <button
            onClick={() => onSearch(searchVal)}
            style={{ height: 38, padding: "0 18px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0 }}>
            Search
          </button>
        </div>
      </section>

      {/* Popular Verified Industries */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117", marginBottom: 3 }}>Popular Verified Industries</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>Start with the most searched China supplier categories.</p>
          </div>
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, color: "#9CA3AF" }}>
            {filteredCards.length} {filteredCards.length === 1 ? "industry" : "industries"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(268px,1fr))", gap: 10 }}>
          {filteredCards.map((cat) => (
            <a key={cat.name} href="#" onClick={(e) => { e.preventDefault(); onSearch(cat.name); }}
              style={{ display: "flex", flexDirection: "column", padding: "18px 20px", background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#BFCDEE"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(30,64,175,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>

              {/* Top row: code + arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, fontWeight: 500, letterSpacing: "0.07em", color: "#9CA3AF", background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 4, padding: "2px 7px" }}>{cat.code}</span>
                <span style={{ color: "#D1D5DB" }}><ChevronRight size={12} /></span>
              </div>

              {/* Name + description */}
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px", marginBottom: 5, lineHeight: 1.25 }}>{cat.name}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{cat.desc}</p>

              {/* Product chips */}
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 12 }}>
                {cat.chips.map((c) => (
                  <span key={c} style={{ padding: "2px 8px", borderRadius: 4, background: "#F7F8FA", border: "1px solid #EDEEF0", fontSize: 11, color: "#6B7280" }}>{c}</span>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 10, borderTop: "1px solid #F5F6F8" }}><div><FieldLabel>Supplier types</FieldLabel><p style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{cat.supplierTypes}</p></div><div><FieldLabel>MOQ fit</FieldLabel><p style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{cat.moqFit}</p></div></div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#1E40AF", fontWeight: 600, marginTop: 12 }}>View Suppliers <ChevronRight size={10} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* All Industry Groups */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117", marginBottom: 28 }}>Secondary Categories by Primary Industry</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 28 }}>
            {INDUSTRY_GROUPS.map(({ group, items }) => (
              <div key={group}>
                <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1E40AF", marginBottom: 14 }}>{group}</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {items.map((item, ii) => (
                    <a key={item} href="#" onClick={(e) => { e.preventDefault(); onSearch(item); }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", fontSize: 13.5, fontWeight: 400, color: "#374151", textDecoration: "none", borderBottom: ii < items.length - 1 ? "1px solid #F7F8FA" : "none" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#1E40AF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#374151"; }}>
                      {item}
                      <span style={{ color: "#E5E7EB", flexShrink: 0 }}><ChevronRight size={11} /></span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
        <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" as const }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 6 }}>Can't find your product category?</h2>
            <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.6 }}>Search by product name or request supplier research.<br />FactoryRoster only lists suppliers after verification.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button onClick={() => onSearch("")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
            <button onClick={() => onNav?.("Request Verification")} style={{ padding: "9px 20px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Request Supplier Research</button>
          </div>
        </div>
      </section>

      {/* SEO section */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 52px" }}>
        <div style={{ borderTop: "1px solid #E9ECF1", paddingTop: 28 }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#C4C9D4", marginBottom: 8 }}>Verified China Supplier Categories</p>
          <p style={{ fontSize: 12.5, color: "#C4C9D4", lineHeight: 1.75, maxWidth: 720 }}>
            FactoryRoster organizes China supplier records by industry, product category, province, supplier type, MOQ fit, and supply model. Published supplier profiles pass Government Registration, Business Contact, and supplier-type Supply Evidence checks before being listed. FactoryRoster is not a marketplace and does not participate in buyer-supplier transactions.
          </p>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── Verification Page ─────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: "Are all suppliers on FactoryRoster verified?", a: "Yes. Only supplier profiles that have passed FactoryRoster's required verification checks are published in search results." },
  { q: "Does FactoryRoster participate in transactions?", a: "No. FactoryRoster provides verified supplier information and contact intelligence only. Buyers and suppliers manage their own transactions independently." },
  { q: "What does Business Contact Verified mean?", a: "It means FactoryRoster manually checked the business contact information before the supplier profile was listed." },
  { q: "What does Supply Evidence mean?", a: "It means evidence appropriate to the supplier type was reviewed before publication. Manufacturers require factory evidence; other suppliers require authorization, relationship, supply-chain, export, inventory, fulfillment, or service evidence." },
  { q: "Does FactoryRoster guarantee supplier quality?", a: "No. Verification confirms specific identity, contact, and supply evidence only. Buyers must still conduct product, compliance, sample, contract, payment, and delivery due diligence." },
  { q: "Can I request updated verification?", a: "Yes. Buyers can request updated contact checks or additional supplier evidence through FactoryRoster's verification service." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E9ECF1" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const, gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0D1117" }}>{q}</span>
        <span style={{ color: "#9CA3AF", flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
          <ChevronRight size={14} />
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 22px 16px" }}>
          <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

function VerificationPage({ onSearch, onIndustries, onPricing, onNav }: { onSearch: (q: string) => void; onIndustries: () => void; onPricing: () => void; onNav?: (k: string) => void }) {
  const checks = [
    {
      icon: GovIcon, label: "Government Registration",
      desc: "We check the company's legal registration against official Chinese government records.",
      items: ["Registered company name", "Unified Social Credit Code", "Registered address", "Business status", "Legal entity information"],
      method: "Official registry review",
      output: "Government Registration Verified",
      buyerBenefit: "Helps confirm the company exists as a legal business entity.",
    },
    {
      icon: PhoneIcon, label: "Business Contact",
      desc: "We manually verify that the supplier can be contacted through real business channels.",
      items: ["Business phone", "Business email", "Contact person", "Position where available", "Contact availability"],
      method: "Manual phone or email verification",
      output: "Business Contact Verified",
      buyerBenefit: "Reduces wasted outreach to invalid or unreachable contacts.",
    },
    {
      icon: FactoryIcon, label: "Supply Evidence",
      desc: "We review evidence appropriate to the supplier's declared type before publication.",
      items: ["Factory evidence for manufacturers", "Authorization or supplier relationship", "Supply chain or export evidence", "Inventory or fulfillment evidence", "Service capability evidence"],
      method: "Supplier-type evidence review",
      output: "Supply Evidence Verified",
      buyerBenefit: "Helps distinguish the supplier's actual role and supply capability.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>

      {/* Hero — reduced height */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 32px 44px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>
            Verification Process
          </p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#0D1117", marginBottom: 14 }}>
            Verified Before Listed
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            Every supplier profile must pass verification before it appears in FactoryRoster search results.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <button onClick={() => onSearch("")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Verified Suppliers</button>
            <button onClick={onPricing} style={{ padding: "9px 20px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>See Contact Pricing</button>
          </div>
        </div>

        {/* Process timeline */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px 44px" }}>
          <div style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[
              { icon: GovIcon, label: "Government\nRegistration" },
              { icon: PhoneIcon, label: "Business\nContact" },
              { icon: FactoryIcon, label: "Supply\nEvidence" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, width: 116 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF" }}>
                    <Icon size={19} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#6B7280", textAlign: "center" as const, whiteSpace: "pre" as const, letterSpacing: "0.02em", lineHeight: 1.5 }}>{label}</span>
                </div>
                <div style={{ margin: "0 4px", paddingBottom: 22 }}>
                  <div style={{ width: 28, height: 1, background: "#D1D5DB" }} />
                </div>
              </div>
            ))}
            {/* Listed node */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, width: 116 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#ECFDF5", border: "1px solid #6EE7B7", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                <CheckIcon size={19} />
              </div>
              <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 600, color: "#10B981", textAlign: "center" as const, letterSpacing: "0.02em", lineHeight: 1.5 }}>{"LISTED ON\nFACTORYROSTER"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three checks */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px 48px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 28 }}>The Three Checks Every Supplier Must Pass</h2>
        <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E9ECF1", borderRadius: 12, overflow: "hidden" }}>
          {checks.map(({ icon: Icon, label, desc, items, method, output, buyerBenefit }, i) => (
            <div key={label} style={{ background: "#fff", padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <Mono color="#9CA3AF">Check 0{i + 1} of 03</Mono>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", border: "1px solid #6EE7B7", fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#10B981" }}>
                  <CheckIcon size={9} />REQUIRED
                </span>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 14 }}>
                <Icon size={18} />
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "#0D1117", letterSpacing: "-0.3px", marginBottom: 7 }}>{label}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                {items.map((it) => (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#374151" }}>{it}</span>
                  </div>
                ))}
              </div>
              {/* Buyer benefit callout */}
              <div style={{ padding: "10px 12px", background: "#F0F4FF", borderRadius: 7, marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: "#1E40AF", flexShrink: 0, marginTop: 1 }}><CheckIcon size={11} /></span>
                <span style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.55, fontWeight: 500 }}>{buyerBenefit}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 14, borderTop: "1px solid #F0F1F3" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <FieldLabel>Method</FieldLabel>
                  <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{method}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <FieldLabel>Output</FieldLabel>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: "#ECFDF5", border: "1px solid #A7F3D0", fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, color: "#065F46" }}>
                    <CheckIcon size={8} />{output}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What "Verified" Means table */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 24 }}>What "Verified" Means on FactoryRoster</h2>
          <div className="r-scroll" style={{ border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ minWidth: 560, display: "grid", gridTemplateColumns: "1.1fr 1.4fr 1.5fr 1.4fr", background: "#F7F8FA", borderBottom: "1px solid #E9ECF1", padding: "10px 20px", gap: 16 }}>
              {["Check", "What we verify", "What it helps prove", "Buyer benefit"].map((h) => (
                <FieldLabel key={h}>{h}</FieldLabel>
              ))}
            </div>
            {[
              {
                area: "Government Registration", /* verification table rows */
                check: "Official public business registration records",
                proves: "The company exists as a legal business entity",
                benefit: "Reduces risk of fake or unverifiable listings",
              },
              {
                area: "Business Contact",
                check: "Business phone, email, and contact person",
                proves: "The supplier can be contacted through real business channels",
                benefit: "Reduces wasted outreach",
              },
              {
                area: "Supply Evidence",
                check: "Evidence matched to the supplier type",
                proves: "The declared supply role has supporting evidence",
                benefit: "Helps buyers compare manufacturers and non-manufacturing suppliers accurately",
              },
            ].map((row, i) => (
              <div key={row.area} style={{ minWidth: 560, display: "grid", gridTemplateColumns: "1.1fr 1.4fr 1.5fr 1.4fr", padding: "15px 20px", borderBottom: i < 2 ? "1px solid #F0F1F3" : undefined, gap: 16, alignItems: "flex-start" }}>
                <VerifiedBadge label={row.area} />
                <span style={{ fontSize: 13, color: "#374151" }}>{row.check}</span>
                <span style={{ fontSize: 13, color: "#374151" }}>{row.proves}</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{row.benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Verification Does Not Mean */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
        <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32, alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 10 }}>What Verification Does Not Mean</h2>
            <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>
              FactoryRoster verifies identity, contactability, and supplier-type supply evidence before listing a profile. We do not guarantee product quality, delivery, pricing, compliance, or transaction outcomes. Buyers should still conduct product samples, contracts, inspections, and payment due diligence.
            </p>
            <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7, marginTop: 12 }}>
              FactoryRoster is not a marketplace and does not participate in buyer-supplier transactions.
            </p>
          </div>
          <div>
            <div style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "22px 26px", marginBottom: 12 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>FactoryRoster verification does not cover:</p>
              <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                {[
                  "Product quality", "Delivery or logistics",
                  "Pricing or MOQ accuracy", "Export compliance",
                  "Ongoing supplier performance", "Transaction outcomes",
                  "Buyer-supplier agreements",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Government disclaimer */}
            <div style={{ padding: "10px 14px", background: "#FAFBFC", border: "1px solid #E9ECF1", borderRadius: 7, display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: "#9CA3AF", flexShrink: 0, marginTop: 1 }}><GovIcon size={13} /></span>
              <p style={{ fontSize: 11.5, color: "#9CA3AF", lineHeight: 1.6 }}>
                Government registration checks use official public records where available. FactoryRoster is not affiliated with any government agency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample factory + locked contact */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
          <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "flex-start" }}>

            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 8 }}>Verification Status on Supplier Profiles</h2>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7, marginBottom: 22 }}>Every public supplier profile shows its supplier type, completed verification checks, last verification date, and contact unlock status.</p>
              <div style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF" }}>
                    <FactoryIcon size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Shenzhen Luminos Technology Co., Ltd.</p>
                    <p style={{ fontSize: 11.5, color: "#9CA3AF" }}>LED Lighting · Shenzhen, Guangdong, China</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 12 }}>
                  <VerifiedBadge label="Government Registration" />
                  <VerifiedBadge label="Business Contact" />
                  <VerifiedBadge label="Factory Evidence" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 10, borderTop: "1px solid #E9ECF1" }}>
                  <div><FieldLabel>Last verified</FieldLabel><p style={{ fontSize: 12.5, fontWeight: 500, color: "#374151", marginTop: 2 }}>Sep 4, 2026</p></div>
                  <span style={{ width: 1, height: 24, background: "#E9ECF1" }} />
                  <div><FieldLabel>Record ID</FieldLabel><p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 12, fontWeight: 500, color: "#1E40AF", marginTop: 2 }}>FR-GD-08241</p></div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 8 }}>Contact Intelligence</h2>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7, marginBottom: 22 }}>FactoryRoster supplier contact records may include verified phone, verified email, contact person, position, WhatsApp or WeChat when available, verification method, and last verified date.</p>
              <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "13px 20px", borderBottom: "1px solid #E9ECF1", background: "#FAFBFC", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 6, background: "#F0F4FF", border: "1px solid #DBEAFE", color: "#1E40AF" }}><ShieldIcon /></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Verified Contact Record</span>
                </div>
                <div style={{ padding: "4px 20px 8px" }}>
                  {([["Contact Person", "name"], ["Position", "position"], ["Verified Phone", "phone"], ["Verified Email", "email"], ["WhatsApp / WeChat", "handle"]] as const).map(([label, type]) => (
                    <LockedRow key={label} icon={UserIcon} label={label} type={type} />
                  ))}
                  <div style={{ padding: "9px 0 4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <FieldLabel>Last Contact Verified</FieldLabel>
                      <Mono color="#9CA3AF">Sep 2026</Mono>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #E9ECF1" }}>
                  <button onClick={() => onSearch("")} style={{ width: "100%", padding: "9px 0", borderRadius: 7, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Find a supplier to unlock</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Deeper Factory Verification */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" as const }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 6 }}>Need Deeper Supplier Verification?</h2>
            <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.65, maxWidth: 520 }}>For buyers who need additional confidence, FactoryRoster can support updated contact checks and supplier-type evidence review.</p>
          </div>
        </div>
        <div className="r4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 22 }}>
          {[
            { icon: CheckIcon, label: "Updated Contact Check", desc: "Re-verify business contact details for a specific supplier." },
            { icon: FactoryIcon, label: "Factory Photos", desc: "Request updated exterior and interior factory photos." },
            { icon: PhoneIcon, label: "Video Walkthrough", desc: "Request a factory video walkthrough for deeper review." },
            { icon: GovIcon, label: "Live Verification Support", desc: "Request live verification support for key supplier candidates." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 20px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 13 }}>
                <Icon size={16} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNav?.("Request Verification")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Request Verification</button>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Available for membership or verification service users.</span>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 32px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
            {FAQ_ITEMS.map((item) => <FAQItem key={item.q} {...item} />)}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", marginBottom: 10 }}>Start with verified supplier records</h2>
        <p style={{ fontSize: 14.5, color: "#6B7280", marginBottom: 26 }}>Search manufacturers, distributors, exporters, wholesalers, and other verified China suppliers.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <button onClick={() => onSearch("")} style={{ padding: "10px 22px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Verified Suppliers</button>
          <button onClick={onIndustries} style={{ padding: "10px 22px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Browse Industries</button>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────

const PRICING_FAQ = [
  { q: "What is a contact credit?", a: "A contact credit unlocks one verified supplier contact record, including available phone, email, contact person, and verification details." },
  { q: "What does \"verified contact\" mean?", a: "It means FactoryRoster manually checked the business contact information before the supplier record was listed." },
  { q: "Does FactoryRoster guarantee supplier quality?", a: "No. FactoryRoster verifies specific identity, contactability, and supply evidence only. Buyers must still conduct their own due diligence." },
  { q: "Can I request updated verification?", a: "Yes. Buyers can request updated contact checks, photos, video walkthroughs, or live verification support." },
  { q: "Is FactoryRoster a marketplace?", a: "No. FactoryRoster provides verified supplier intelligence and contact information only. We do not participate in transactions." },
];

const COMPARISON_ROWS = [
  { label: "Search verified supplier records",  free: true,  credits: true,  member: true,  verify: true  },
  { label: "View supplier overview",            free: true,  credits: true,  member: true,  verify: true  },
  { label: "View verification status",          free: true,  credits: true,  member: true,  verify: true  },
  { label: "Unlock verified contacts",          free: false, credits: true,  member: true,  verify: false },
  { label: "Save supplier shortlist",           free: false, credits: false, member: true,  verify: false },
  { label: "Request updated contact check",     free: false, credits: false, member: true,  verify: true  },
  { label: "Request factory photos / video",    free: false, credits: false, member: false, verify: true  },
  { label: "Priority support",                  free: false, credits: false, member: true,  verify: true  },
];

function CheckCell({ yes }: { yes: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {yes
        ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981" }}><CheckIcon size={10} /></span>
        : <span style={{ display: "inline-block", width: 14, height: 2, borderRadius: 1, background: "#E5E7EB" }} />}
    </div>
  );
}

function PricingPage({ onSearch, onIndustries, onNav }: { onSearch: (q: string) => void; onIndustries: () => void; onNav?: (k: string) => void }) {
  const plans = [
    {
      name: "Starter", price: "$9.90", desc: "For testing a few supplier contacts.", note: "Best for first-time buyers",
      credits: 3, popular: false,
      features: ["3 verified supplier contacts", "Verified phone", "Verified email", "Contact person where available", "Last verification date", "Verification method"],
    },
    {
      name: "Business", price: "$29.90", desc: "For building a small supplier shortlist.", note: "",
      credits: 15, popular: true,
      features: ["15 verified supplier contacts", "Verified phone", "Verified email", "Contact person where available", "WhatsApp / WeChat if verified", "Last verification date", "Verification method"],
    },
    {
      name: "Pro", price: "$99", desc: "For sourcing teams comparing multiple suppliers.", note: "",
      credits: 60, popular: false,
      features: ["60 verified supplier contacts", "Verified phone", "Verified email", "Contact person where available", "WhatsApp / WeChat if verified", "Last verification date", "Verification method", "Shortlist workflow ready"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>

      {/* Compact hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 32px 48px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>Pricing</p>
          <h1 style={{ fontSize: "clamp(30px,4vw,44px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#0D1117", marginBottom: 14 }}>Unlock Verified Supplier Contacts</h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
            Search verified supplier records for free. Unlock verified phone, email, contact person, and verification details when you are ready to reach out.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <button onClick={() => onSearch("")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
            <a href="#compare" style={{ padding: "9px 20px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", textDecoration: "none" }}>Compare Plans</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            {["Verified before listed", "Contact details manually checked", "FactoryRoster does not participate in transactions"].map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#6B7280" }}>
                <VerifiedDot />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Credits */}
      <section id="credits" className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 6 }}>Contact Credits</h2>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>Use credits to unlock verified contact records one supplier at a time.</p>
          <p role="status" style={{ marginTop: 10, display: "inline-flex", padding: "7px 10px", borderRadius: 7, background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", fontSize: 12 }}>Purchases are temporarily unavailable while payment setup is being completed.</p>
        </div>
        <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ background: "#fff", border: plan.popular ? "2px solid #1E40AF" : "1px solid #E9ECF1", borderRadius: 12, padding: "28px 26px", position: "relative" as const, display: "flex", flexDirection: "column" }}>
              {plan.popular && (
                <span style={{ position: "absolute" as const, top: -11, left: "50%", transform: "translateX(-50%)", background: "#1E40AF", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" as const }}>Most popular</span>
              )}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: plan.popular ? "#1E40AF" : "#374151", marginBottom: 8 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1.5px", color: "#0D1117" }}>{plan.price}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "#6B7280" }}>{plan.desc}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 24, flex: 1 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }}><CheckIcon size={11} /></span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <button disabled aria-disabled="true" title="Payment setup in progress" style={{ width: "100%", padding: "9px 0", borderRadius: 8, background: "#F3F4F6", color: "#9CA3AF", fontSize: 13.5, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "not-allowed", marginBottom: plan.note ? 8 : 0 }}>
                  Coming soon
                </button>
                {plan.note && <p style={{ fontSize: 11.5, color: "#9CA3AF", textAlign: "center" as const }}>{plan.note}</p>}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>Contact fields vary by supplier record. Each unlocked record clearly shows what has been verified.</p>
      </section>

      {/* What's Included */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 28 }}>What's Included in a Verified Contact Record</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["Contact person", "Name of the verified contact"],
                ["Position", "Job title if available"],
                ["Verified phone", "Business phone, manually checked"],
                ["Verified email", "Business email, manually checked"],
                ["WhatsApp / WeChat", "If available and verified"],
                ["Verification method", "How the contact was verified"],
                ["Last contact verification date", "When contact was last checked"],
                ["FactoryRoster record ID", "Unique supplier record reference"],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #F5F6F8", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ color: "#10B981", flexShrink: 0 }}><CheckIcon size={11} /></span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0D1117" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: "#9CA3AF", textAlign: "right" as const }}>{desc}</span>
                </div>
              ))}
            </div>
            {/* Locked contact preview */}
            <div>
              <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "13px 20px", borderBottom: "1px solid #E9ECF1", background: "#FAFBFC", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 6, background: "#F0F4FF", border: "1px solid #DBEAFE", color: "#1E40AF" }}><ShieldIcon /></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117" }}>Verified Contact Record</span>
                </div>
                <div style={{ padding: "4px 20px 8px" }}>
                  {([["Contact Person", "name"], ["Position", "position"], ["Verified Phone", "phone"], ["Verified Email", "email"], ["WhatsApp / WeChat", "handle"]] as const).map(([label, type]) => (
                    <LockedRow key={label} icon={UserIcon} label={label} type={type} />
                  ))}
                  <div style={{ padding: "9px 0 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <FieldLabel>Last Verified</FieldLabel>
                    <Mono color="#9CA3AF">Sep 2026</Mono>
                  </div>
                </div>
                <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #E9ECF1" }}>
                  <button style={{ width: "100%", padding: "9px 0", borderRadius: 7, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Unlock with 1 credit</button>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10, textAlign: "center" as const }}>Example locked contact record. Fields unlock when you use a credit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 6 }}>Sourcing Membership</h2>
          <p style={{ fontSize: 13.5, color: "#6B7280" }}>For buyers who need ongoing verified contacts and deeper supplier verification support.</p>
        </div>
        <div className="r-member" style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" as const }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 6 }}>Sourcing Membership</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.5px", color: "#0D1117" }}>$199</span>
              <span style={{ fontSize: 14, color: "#9CA3AF" }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280" }}>For frequent buyers who need ongoing verified contact access and verification support.</p>
          </div>
          <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 32px", flex: 2, minWidth: 280 }}>
            {["100 contact credits per month", "Priority contact verification", "Factory verification request access", "Factory photos / video request access", "Saved factory shortlist", "Verification report discounts"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: "#10B981", flexShrink: 0 }}><CheckIcon size={11} /></span>
                <span style={{ fontSize: 13, color: "#374151" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ flexShrink: 0 }}>
            <button disabled aria-disabled="true" title="Payment setup in progress" style={{ padding: "10px 22px", borderRadius: 8, background: "#F3F4F6", color: "#9CA3AF", fontSize: 13.5, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "not-allowed", display: "block", marginBottom: 8 }}>Coming soon</button>
            <p style={{ fontSize: 11.5, color: "#9CA3AF", textAlign: "center" as const }}>Best for sourcing teams, agencies,<br />and frequent buyers.</p>
          </div>
        </div>
      </section>

      {/* Verification Service */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 6 }}>Need Deeper Verification?</h2>
            <p style={{ fontSize: 13.5, color: "#6B7280" }}>Request additional verification before outreach or supplier shortlisting.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 22 }}>
            {[
              { icon: CheckIcon, label: "Updated Contact Check", desc: "Re-check phone, email, and contact person before outreach." },
              { icon: FactoryIcon, label: "Factory Photos", desc: "Request updated photos or facility evidence where available." },
              { icon: PhoneIcon, label: "Video Walkthrough", desc: "Request video evidence or walkthrough support for higher-confidence sourcing." },
              { icon: GovIcon, label: "Live Verification Support", desc: "For buyers who need additional verification assistance." },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 20px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 13 }}>
                  <Icon size={16} />
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 5 }}>{label}</p>
                <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => onNav?.("Request Verification")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Request Verification</button>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Available for membership or verification service users.</span>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section id="compare" className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 24 }}>Choose the Right Option</h2>
        <div className="r-scroll" style={{ border: "1px solid #E9ECF1", borderRadius: 12, overflow: "hidden" }}>
          {/* Header */}
          <div className="r-compare-row" style={{ minWidth: 520, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", background: "#F7F8FA", borderBottom: "1px solid #E9ECF1", padding: "12px 20px", gap: 8 }}>
            <span />
            {["Free", "Contact Credits", "Membership", "Verification Service"].map((h) => (
              <div key={h} style={{ textAlign: "center" as const }}>
                <FieldLabel>{h}</FieldLabel>
              </div>
            ))}
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <div key={row.label} className="r-compare-row" style={{ minWidth: 520, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "13px 20px", gap: 8, borderBottom: i < COMPARISON_ROWS.length - 1 ? "1px solid #F5F6F8" : undefined, alignItems: "center" }}>
              <span style={{ fontSize: 13.5, color: "#374151" }}>{row.label}</span>
              <CheckCell yes={row.free} />
              <CheckCell yes={row.credits} />
              <CheckCell yes={row.member} />
              <CheckCell yes={row.verify} />
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px" }}>
          <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 32, alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117", marginBottom: 8 }}>What FactoryRoster Does Not Do</h2>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>FactoryRoster provides verified supplier information for sourcing research only. We do not participate in transactions, payments, logistics, contracts, product quality control, or buyer-supplier agreements.</p>
            </div>
            <div className="r2" style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
              {["We do not guarantee product quality", "We do not guarantee pricing", "We do not guarantee delivery", "We do not process buyer-supplier payments", "We are not a marketplace", "Buyers should conduct product, contract, inspection, and payment due diligence"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#9CA3AF", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "52px 32px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ border: "1px solid #E9ECF1", borderRadius: 10, overflow: "hidden" }}>
          {PRICING_FAQ.map((item) => <FAQItem key={item.q} {...item} />)}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", color: "#0D1117", marginBottom: 10 }}>Start with verified supplier records</h2>
          <p style={{ fontSize: 14.5, color: "#6B7280", marginBottom: 26 }}>Search by product or industry, then unlock verified contacts when you are ready to reach out.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <button onClick={() => onSearch("")} style={{ padding: "10px 22px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
            <button onClick={onIndustries} style={{ padding: "10px 22px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Browse Industries</button>
          </div>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── Guides Page ───────────────────────────────────────────────────────────────

const GUIDES = [
  { topic: "Getting Started",            title: "How to Find Verified China Manufacturers",                        summary: "Search for China factories, check verification status, and build a supplier shortlist.",                             read: "6 min", outcome: "Build a supplier shortlist" },
  { topic: "Factory Verification",       title: "How to Verify a China Factory Before Contacting Them",            summary: "Understand what to check before reaching out and how FactoryRoster's verification process works.",                read: "5 min", outcome: "Check verification status" },
  { topic: "Contact Intelligence",       title: "What Does Business Contact Verified Mean?",                       summary: "What FactoryRoster checks before marking a business contact as verified.",                                       read: "4 min", outcome: "Understand contact verification" },
  { topic: "RFQ & Outreach",             title: "How to Contact Chinese Manufacturers",                            summary: "What to prepare before outreach and how to use verified contact records effectively.",                           read: "7 min", outcome: "Prepare outreach" },
  { topic: "Contact Intelligence",       title: "What to Ask Before Unlocking a Factory Contact",                  summary: "Key questions to answer before spending a contact credit.",                                                       read: "4 min", outcome: "Avoid wasted contacts" },
  { topic: "RFQ & Outreach",             title: "How to Write a Clear RFQ for Chinese Factories",                  summary: "Structure an effective Request for Quotation that gets real responses from verified factories.",                  read: "6 min", outcome: "Prepare outreach" },
  { topic: "Factory Verification",       title: "Government Registration Checks in China: What Buyers Should Know", summary: "What official registration checks can confirm and what they cannot.",                                           read: "5 min", outcome: "Check verification status" },
  { topic: "Factory Verification",       title: "Factory Photos and Video Evidence: What They Can and Cannot Prove", summary: "How to evaluate factory evidence and understand its limits.",                                                 read: "4 min", outcome: "Understand factory evidence" },
  { topic: "China Manufacturing Basics", title: "Manufacturer vs Trading Company in China",                        summary: "How to distinguish real manufacturers from trading companies in China factory research.",                        read: "5 min", outcome: "Understand factory types" },
  { topic: "Due Diligence",              title: "How to Build a Supplier Shortlist",                               summary: "A structured approach to narrowing down verified China factories to a workable shortlist.",                      read: "6 min", outcome: "Build a supplier shortlist" },
  { topic: "Due Diligence",              title: "How to Evaluate Export Markets and Product Capabilities",         summary: "What export market data can suggest and what buyers should verify independently.",                               read: "5 min", outcome: "Evaluate factory capabilities" },
  { topic: "Contact Intelligence",       title: "How to Avoid Wasted Supplier Outreach",                          summary: "Use verified contact data to focus outreach on factories you can actually reach.",                               read: "4 min", outcome: "Avoid wasted contacts" },
];

const GUIDE_TOPICS = ["All Guides", "Getting Started", "Factory Verification", "Contact Intelligence", "RFQ & Outreach", "Due Diligence", "China Manufacturing Basics", "Industry Guides"];

const TOPIC_COLORS: Record<string, { bg: string; color: string }> = {
  "Getting Started":           { bg: "#F0F4FF", color: "#1E40AF" },
  "Factory Verification":      { bg: "#ECFDF5", color: "#065F46" },
  "Contact Intelligence":      { bg: "#FFF7ED", color: "#92400E" },
  "RFQ & Outreach":            { bg: "#F5F3FF", color: "#4C1D95" },
  "Due Diligence":             { bg: "#FEF2F2", color: "#991B1B" },
  "China Manufacturing Basics":{ bg: "#F0FFFE", color: "#134E4A" },
  "Industry Guides":           { bg: "#F7F8FA", color: "#374151" },
};

function TopicTag({ label }: { label: string }) {
  const style = TOPIC_COLORS[label] ?? { bg: "#F7F8FA", color: "#6B7280" };
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 4, background: style.bg, fontSize: 11, fontWeight: 600, color: style.color }}>{label}</span>
  );
}

const FEATURED_GUIDES = [
  {
    topic: "Getting Started",       title: "How to Find Verified China Manufacturers",
    summary: "Search for China factories, check verification status, and build a supplier shortlist.",
    learn: "Search, verify, and shortlist factories before outreach.",   read: "6 min",
  },
  {
    topic: "Factory Verification",  title: "How Factory Verification Works",
    summary: "Understand Government Registration, Business Contact, and Supply Evidence checks before contacting suppliers.",
    learn: "Understand Government Registration, Business Contact, and supplier-type Supply Evidence checks.",  read: "5 min",
  },
  {
    topic: "Contact Intelligence",  title: "How to Use Verified Factory Contacts",
    summary: "What to prepare before outreach and how to use verified contact records to reduce wasted supplier communication.",
    learn: "Prepare outreach and reduce wasted supplier communication.",  read: "7 min",
  },
];

const INDUSTRY_GUIDES_LIST = [
  { name: "LED Lighting",       desc: "China LED lighting manufacturers: buyer guide." },
  { name: "Cosmetic Packaging", desc: "China cosmetic packaging manufacturers: buyer guide." },
  { name: "Paper Boxes",        desc: "China paper box manufacturers: buyer guide." },
  { name: "Plastic Bottles",    desc: "China plastic bottle manufacturers: buyer guide." },
  { name: "Furniture",          desc: "China furniture manufacturers: buyer guide." },
  { name: "Kitchenware",        desc: "China kitchenware manufacturers: buyer guide." },
  { name: "Pet Products",       desc: "China pet product manufacturers: buyer guide." },
  { name: "Sports Goods",       desc: "China sports goods manufacturers: buyer guide." },
  { name: "Electronics",        desc: "China electronics manufacturers: buyer guide." },
  { name: "Home Textiles",      desc: "China home textile manufacturers: buyer guide." },
];

function GuidesPage({ onSearch, onVerification, onIndustries, onNav }: { onSearch: (q: string) => void; onVerification: () => void; onIndustries: () => void; onNav?: (k: string) => void }) {
  const [activeTopic, setActiveTopic] = useState("All Guides");
  const [searchVal, setSearchVal] = useState("");

  const showIndustryGuides = activeTopic === "Industry Guides" && searchVal === "";

  const filtered = GUIDES.filter((g) =>
    (activeTopic === "All Guides" || activeTopic === "Industry Guides" || g.topic === activeTopic) &&
    (searchVal === "" || g.title.toLowerCase().includes(searchVal.toLowerCase()) || g.topic.toLowerCase().includes(searchVal.toLowerCase()))
  );

  const showFeatured = activeTopic === "All Guides" && searchVal === "";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>

      {/* Compact hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" as const, marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>Sourcing Guides</p>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, color: "#0D1117", marginBottom: 8 }}>China Supplier Sourcing Guides</h1>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 520 }}>
                Practical guides for overseas buyers researching verified China suppliers, contact intelligence, verification steps, and supplier due diligence.
              </p>
            </div>
            {/* Trust chips */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              {["Factory verification", "Contact intelligence", "Buyer due diligence"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                  <VerifiedDot />{t}
                </span>
              ))}
            </div>
          </div>
          {/* Search toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 640 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 8, padding: "0 14px", height: 38 }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1E40AF"; (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
              onBlurCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLDivElement).style.background = "#F7F8FA"; }}>
              <span style={{ color: "#9CA3AF", flexShrink: 0 }}><SearchIcon size={14} /></span>
              <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search guides, sourcing topics, or supplier categories"
                style={{ flex: 1, fontSize: 13.5, color: "#0D1117", background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }} />
            </div>
            <button style={{ height: 38, padding: "0 18px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0 }}>Search Guides</button>
          </div>
        </div>
      </section>

      {/* Main content: sidebar + guides */}
      <div className="rsidebar inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "192px 1fr", gap: 40, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <aside style={{ position: "sticky" as const, top: 80 }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>Guide Topics</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {GUIDE_TOPICS.map((topic) => {
              const active = topic === activeTopic;
              return (
                <button key={topic} onClick={() => setActiveTopic(topic)}
                  style={{ textAlign: "left" as const, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#1E40AF" : "#374151", background: active ? "#EEF2FF" : "transparent", border: "none", cursor: "pointer" }}>
                  {topic}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main area */}
        <div>

          {/* Featured guides */}
          {showFeatured && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.2px", color: "#0D1117", marginBottom: 14 }}>Featured Guides</h2>
              <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {FEATURED_GUIDES.map((g) => (
                  <a key={g.title} href="#" onClick={(e) => e.preventDefault()}
                    style={{ display: "flex", flexDirection: "column", padding: "18px 20px", background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#BFCDEE"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 10px rgba(30,64,175,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                    <TopicTag label={g.topic} />
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", lineHeight: 1.35, margin: "11px 0 6px", letterSpacing: "-0.2px" }}>{g.title}</p>
                    <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.65, flex: 1, marginBottom: 12 }}>{g.summary}</p>
                    {/* What you'll learn */}
                    <div style={{ padding: "9px 11px", background: "#F7F8FA", borderRadius: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: "#9CA3AF", display: "block", marginBottom: 3 }}>What you'll learn</span>
                      <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{g.learn}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Mono color="#C4C9D4">{g.read}</Mono>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1E40AF", display: "flex", alignItems: "center", gap: 4 }}>Read guide <ArrowRight /></span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Industry Guides panel */}
          {showIndustryGuides && (
            <div>
              <div style={{ marginBottom: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.2px", color: "#0D1117" }}>Industry Guides</h2>
                <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, color: "#9CA3AF" }}>{INDUSTRY_GUIDES_LIST.length} guides</span>
              </div>
              <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {INDUSTRY_GUIDES_LIST.map((g) => (
                  <a key={g.name} href="#" onClick={(e) => e.preventDefault()}
                    style={{ display: "flex", flexDirection: "column", padding: "16px 18px", background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#BFCDEE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                      <TopicTag label="Industry Guides" />
                      <Mono color="#C4C9D4">5 min</Mono>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0D1117", lineHeight: 1.35, marginBottom: 5, letterSpacing: "-0.2px" }}>China {g.name} Manufacturers: Buyer Guide</p>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, flex: 1, marginBottom: 11 }}>{g.desc}</p>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#1E40AF", display: "flex", alignItems: "center", gap: 3 }}>Read guide <ArrowRight /></span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* All guides grid */}
          {!showIndustryGuides && (
          <div>
          <div style={{ marginBottom: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.2px", color: "#0D1117" }}>
              {activeTopic === "All Guides" ? "All Guides" : activeTopic}
            </h2>
            <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, color: "#9CA3AF" }}>{filtered.length} guides</span>
          </div>
          {filtered.length === 0
            ? <p style={{ fontSize: 14, color: "#9CA3AF", padding: "32px 0" }}>No guides found for this topic.</p>
            : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {filtered.map((g) => (
                  <a key={g.title} href="#" onClick={(e) => e.preventDefault()}
                    style={{ display: "flex", flexDirection: "column", padding: "16px 18px", background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#BFCDEE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                      <TopicTag label={g.topic} />
                      <Mono color="#C4C9D4">{g.read}</Mono>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0D1117", lineHeight: 1.35, marginBottom: 5, letterSpacing: "-0.2px" }}>{g.title}</p>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, flex: 1, marginBottom: 11 }}>{g.summary}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Outcome label */}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, color: "#9CA3AF" }}>
                        Outcome: {g.outcome}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1E40AF", display: "flex", alignItems: "center", gap: 3 }}>Read <ArrowRight /></span>
                    </div>
                  </a>
                ))}
              </div>
            )
          }
          </div>
          )}
        </div>
      </div>

      {/* Popular Industry Guides */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117", marginBottom: 20 }}>Popular Industry Guides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(196px,1fr))", gap: 9 }}>
            {INDUSTRY_GUIDES_LIST.map((g) => (
              <a key={g.name} href="#" onClick={(e) => e.preventDefault()}
                style={{ display: "flex", flexDirection: "column", gap: 5, padding: "14px 16px", background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 8, textDecoration: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#BFCDEE"; (e.currentTarget as HTMLAnchorElement).style.background = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E9ECF1"; (e.currentTarget as HTMLAnchorElement).style.background = "#F7F8FA"; }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0D1117" }}>{g.name}</p>
                <p style={{ fontSize: 11.5, color: "#9CA3AF", lineHeight: 1.5 }}>{g.desc}</p>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1E40AF", display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>View guide <ArrowRight /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Knowledge Base */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117" }}>Learn How Verification Works</h2>
          <button onClick={onVerification} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "#1E40AF", background: "none", border: "none", cursor: "pointer" }}>
            View Verification Process <ArrowRight />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            { icon: GovIcon, label: "Government Registration", desc: "What business registration checks can confirm and what they cannot." },
            { icon: PhoneIcon, label: "Business Contact", desc: "How verified phone, email, and contact person data reduces wasted outreach." },
            { icon: FactoryIcon, label: "Factory Evidence", desc: "What photos and video evidence can show before deeper verification." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 12 }}>
                <Icon size={16} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Due Diligence notice */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ color: "#D1D5DB", flexShrink: 0, marginTop: 1 }}><ShieldIcon /></span>
          <p style={{ fontSize: 12.5, color: "#9CA3AF", lineHeight: 1.7 }}>
            <strong style={{ color: "#6B7280", fontWeight: 600 }}>Buyer due diligence notice: </strong>
            FactoryRoster verifies identity, contactability, and supplier-type supply evidence before listing a profile. Buyers should still conduct product samples, contract checks, compliance review, and payment due diligence before placing orders.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", color: "#0D1117", marginBottom: 10 }}>Ready to search verified supplier records?</h2>
        <p style={{ fontSize: 14.5, color: "#6B7280", marginBottom: 24 }}>Search by product, industry, or category to find verified China manufacturers.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <button onClick={() => onSearch("")} style={{ padding: "10px 22px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
          <button onClick={onIndustries} style={{ padding: "10px 22px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Browse Industries</button>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── Sign In Page ─────────────────────────────────────────────────────────────

function SignInPage({ onSignUp, onHome, onNav }: { onSignUp: () => void; onHome: () => void; onNav: (k: string) => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to sign in");
      router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} style={{ textDecoration: "none" }}><LogoWordmark size={30} /></a>
        </div>
        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 14, padding: "36px 36px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#0D1117", marginBottom: 6, textAlign: "center" }}>Sign in to FactoryRoster</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>Access your saved suppliers, unlocked contacts, and verification requests.</p>

          {/* OAuth */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {["Google sign-in coming soon", "LinkedIn sign-in coming soon"].map((label) => (
              <button key={label} disabled aria-disabled="true" style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 13.5, fontWeight: 500, color: "#9CA3AF", cursor: "not-allowed" }}>{label}</button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ flex: 1, height: 1, background: "#E9ECF1" }} />
            <Mono color="#C4C9D4">or</Mono>
            <span style={{ flex: 1, height: 1, background: "#E9ECF1" }} />
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <div>
              <FieldLabel>Work email</FieldLabel>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                style={{ width: "100%", marginTop: 5, padding: "9px 13px", borderRadius: 8, border: "1.5px solid #E9ECF1", fontSize: 14, color: "#0D1117", background: "#fff", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
                onFocus={(e) => (e.target.style.borderColor = "#1E40AF")} onBlur={(e) => (e.target.style.borderColor = "#E9ECF1")} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <FieldLabel>Password</FieldLabel>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>Password reset coming soon</span>
              </div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••"
                style={{ width: "100%", marginTop: 5, padding: "9px 13px", borderRadius: 8, border: "1.5px solid #E9ECF1", fontSize: 14, color: "#0D1117", background: "#fff", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
                onFocus={(e) => (e.target.style.borderColor = "#1E40AF")} onBlur={(e) => (e.target.style.borderColor = "#E9ECF1")} />
            </div>
          </div>

          {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
          <button onClick={submit} disabled={busy || !email || password.length < 8} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || !email || password.length < 8 ? 0.6 : 1, marginBottom: 18 }}>{busy ? "Signing in…" : "Sign In"}</button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
            New to FactoryRoster?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSignUp(); }} style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>Get started</a>
          </p>
        </div>

        {/* Trust note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#C4C9D4", marginTop: 20, lineHeight: 1.6 }}>
          Only verified supplier records are listed on FactoryRoster.
        </p>

        {/* Footer links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16 }}>
          {[["Privacy", "Privacy"], ["Terms", "Terms"], ["Contact", "Contact"]].map(([label, nav]) => (
            <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNav(nav); }} style={{ fontSize: 12, color: "#C4C9D4", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#9CA3AF")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#C4C9D4")}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sign Up Page ──────────────────────────────────────────────────────────────

function SignUpPage({ onSignIn, onHome, onNav }: { onSignIn: () => void; onHome: () => void; onNav: (k: string) => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "", company: "", country: "" });
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputStyle: React.CSSProperties = { width: "100%", marginTop: 5, padding: "9px 13px", borderRadius: 8, border: "1.5px solid #E9ECF1", fontSize: 14, color: "#0D1117", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = "#1E40AF");
  const blurGray  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = "#E9ECF1");

  const submit = async () => {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, full_name: form.name, company_name: form.company || undefined, country: form.country || undefined }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to create account");
      if (body.requiresEmailConfirmation) setStatus("Account created. Check your email to confirm your address, then sign in.");
      else router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create account");
    } finally {
      setBusy(false);
    }
  };

  const resendConfirmation = async () => {
    setResending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/resend-confirmation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.email }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to resend confirmation email");
      setStatus(body.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to resend confirmation email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "stretch" }}>
      {/* Left column */}
      <div style={{ display: "none", flex: 1, background: "#fff", borderRight: "1px solid #E9ECF1", padding: "64px 56px", flexDirection: "column", justifyContent: "center", minWidth: 380, maxWidth: 480 }}
        className="signup-left">
        <div style={{ marginBottom: 32 }}><LogoWordmark size={28} /></div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", lineHeight: 1.2, marginBottom: 12 }}>Get started with verified China supplier records</h1>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 32 }}>Search suppliers for free. Create an account to save supplier profiles, unlock verified contacts, and manage verification requests.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Save supplier profiles", "Unlock verified contact records", "Track contact credits", "Request updated verification", "Build supplier shortlists"].map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981", flexShrink: 0 }}><CheckIcon size={9} /></span>
              <span style={{ fontSize: 13.5, color: "#374151" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Right column / centered on small screens */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} style={{ textDecoration: "none" }}><LogoWordmark size={28} /></a>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 14, padding: "32px 32px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 4, textAlign: "center" }}>Create your account</h2>
            <p style={{ fontSize: 12.5, color: "#9CA3AF", textAlign: "center", marginBottom: 24 }}>Free to start. Search verified suppliers immediately.</p>

            <button disabled aria-disabled="true" style={{ width: "100%", padding: "9px 0", borderRadius: 8, background: "#F7F8FA", border: "1px solid #E9ECF1", fontSize: 13.5, fontWeight: 500, color: "#9CA3AF", cursor: "not-allowed", marginBottom: 16 }}>Google sign-up coming soon</button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ flex: 1, height: 1, background: "#E9ECF1" }} />
              <Mono color="#C4C9D4">or</Mono>
              <span style={{ flex: 1, height: 1, background: "#E9ECF1" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 20 }}>
              {([
                { key: "email",    label: "Work email",            type: "email",    placeholder: "you@company.com", required: true },
                { key: "password", label: "Password",              type: "password", placeholder: "••••••••",        required: true },
                { key: "name",     label: "Your name",             type: "text",     placeholder: "Jane Smith",      required: true },
                { key: "company",  label: "Company (optional)",    type: "text",     placeholder: "Your company",    required: false },
              ] as const).map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <input value={form[key]} onChange={set(key)} type={type} placeholder={placeholder}
                    style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                </div>
              ))}
              <div>
                <FieldLabel>Country / Region</FieldLabel>
                <select value={form.country} onChange={set("country")} style={{ ...inputStyle, appearance: "none" as const }}
                  onFocus={focusBlue} onBlur={blurGray}>
                  <option value="">Select country</option>
                  {["United States", "United Kingdom", "Australia", "Canada", "Germany", "Japan", "South Korea", "Singapore", "India", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
            {status && <div role="status" style={{ color: "#065F46", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 7, padding: 10, fontSize: 12.5, marginBottom: 12 }}><p>{status}</p><button type="button" disabled={resending} onClick={resendConfirmation} style={{ border: 0, background: "none", color: "#1E40AF", fontWeight: 700, padding: "8px 0 0", cursor: "pointer" }}>{resending ? "Sending…" : "Resend confirmation email"}</button></div>}
            <button onClick={submit} disabled={busy || !form.email || form.password.length < 8 || form.name.trim().length < 2} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || !form.email || form.password.length < 8 || form.name.trim().length < 2 ? 0.6 : 1, marginBottom: 16 }}>{busy ? "Creating account…" : "Create Account"}</button>

            <p style={{ textAlign: "center", fontSize: 12.5, color: "#9CA3AF" }}>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); onSignIn(); }} style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
            </p>
          </div>
          <p style={{ textAlign: "center", fontSize: 11.5, color: "#C4C9D4", marginTop: 16, lineHeight: 1.6 }}>
            FactoryRoster provides verified supplier information only and does not participate in transactions.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
            {[["Privacy", "Privacy"], ["Terms", "Terms"], ["Contact", "Contact"]].map(([label, nav]) => (
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNav(nav); }} style={{ fontSize: 12, color: "#C4C9D4", textDecoration: "none" }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#9CA3AF")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#C4C9D4")}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ──────────────────────────────────────────────────────────────

function ContactPage({ onNav }: { onNav: (k: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", country: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputStyle: React.CSSProperties = { width: "100%", marginTop: 5, padding: "9px 13px", borderRadius: 8, border: "1.5px solid #E9ECF1", fontSize: 13.5, color: "#0D1117", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#1E40AF");
  const blurGray  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#E9ECF1");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: form.name, work_email: form.email, company: form.company || undefined, country: form.country || undefined, inquiry_type: form.type, message: form.message }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to send message");
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send message");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 40px" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>Contact</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "#0D1117", marginBottom: 8 }}>Contact FactoryRoster</h1>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 520 }}>Questions about verified supplier records, contact credits, supplier corrections, or verification requests? Send us a message.</p>
        </div>
      </section>

      {/* Option cards */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 32px" }}>
        <div className="r3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 40 }}>
          {[
            { title: "For Buyers", desc: "Questions about supplier records, contact credits, or verification requests.", cta: "Buyer Inquiry", type: "Buyer question" },
            { title: "For Suppliers", desc: "Request a correction, claim a profile, or update company information.", cta: "Claim or Update Profile", type: "Supplier correction" },
            { title: "Verification Requests", desc: "Request updated contact checks, factory photos, or video verification support.", cta: "Request Verification", type: "Verification request" },
          ].map(({ title, desc, cta, type }) => (
            <div key={title} onClick={() => setForm((f) => ({ ...f, type }))}
              style={{ background: "#fff", border: `1.5px solid ${form.type === type ? "#1E40AF" : "#E9ECF1"}`, borderRadius: 10, padding: "20px 22px", cursor: "pointer" }}
              onMouseEnter={(e) => { if (form.type !== type) (e.currentTarget as HTMLDivElement).style.borderColor = "#BFCDEE"; }}
              onMouseLeave={(e) => { if (form.type !== type) (e.currentTarget as HTMLDivElement).style.borderColor = "#E9ECF1"; }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0D1117", marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>{desc}</p>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1E40AF", display: "flex", alignItems: "center", gap: 4 }}>{cta} <ArrowRight /></span>
            </div>
          ))}
        </div>

        {/* Form + sidebar */}
        <div className="rsidebar" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "flex-start" }}>
          {sent ? (
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "48px 40px", textAlign: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981", marginBottom: 20 }}><CheckIcon size={20} /></span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0D1117", marginBottom: 8 }}>Message sent</h2>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>Thank you. We'll review your message and respond if follow-up is needed.</p>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#0D1117", marginBottom: 22 }}>Send a message</h2>
              <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {([
                  { key: "name",    label: "Name",         type: "text",  placeholder: "Your name" },
                  { key: "email",   label: "Work email",   type: "email", placeholder: "you@company.com" },
                  { key: "company", label: "Company",      type: "text",  placeholder: "Your company" },
                  { key: "country", label: "Country",      type: "text",  placeholder: "Country or region" },
                ] as const).map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <FieldLabel>{label}</FieldLabel>
                    <input value={form[key]} onChange={set(key)} type={type} placeholder={placeholder}
                      style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <FieldLabel>Inquiry type</FieldLabel>
                <select value={form.type} onChange={set("type")} style={{ ...inputStyle, appearance: "none" as const }} onFocus={focusBlue} onBlur={blurGray}>
                  <option value="">Select inquiry type</option>
                  {["Buyer question", "Supplier correction", "Verification request", "Pricing question", "Partnership", "Other"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <FieldLabel>Message</FieldLabel>
                <textarea value={form.message} onChange={set("message")} placeholder="Describe your question or request..."
                  rows={5} style={{ ...inputStyle, resize: "vertical" as const }} onFocus={focusBlue} onBlur={blurGray} />
              </div>
              {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
              <button onClick={submit} disabled={busy || form.name.trim().length < 2 || !form.email || !form.type || form.message.trim().length < 10}
                style={{ padding: "10px 24px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || form.name.trim().length < 2 || !form.email || !form.type || form.message.trim().length < 10 ? 0.6 : 1 }}>{busy ? "Sending…" : "Send Message"}</button>
            </div>
          )}

          {/* Sidebar */}
          <aside>
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 22px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 12 }}>What FactoryRoster does</p>
              {["Verified supplier records", "Verified contact intelligence", "Supplier verification support"].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "#10B981", flexShrink: 0 }}><CheckIcon size={11} /></span>
                  <span style={{ fontSize: 13, color: "#374151" }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>What we do not do</p>
              {["We do not participate in transactions", "We do not process payments between buyers and suppliers", "We do not guarantee product quality or delivery"].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 7 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <Footer onNav={onNav} />
      </div>
    </div>
  );
}

// ─── Request Verification Page ─────────────────────────────────────────────────

function RequestVerificationPage({ onPricing, onNav }: { onPricing: () => void; onNav: (k: string) => void }) {
  const [form, setForm] = useState({ factoryName: "", factoryUrl: "", category: "", verifyTypes: [] as string[], name: "", email: "", company: "", country: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleVerifyType = (t: string) => setForm((f) => ({
    ...f,
    verifyTypes: f.verifyTypes.includes(t) ? f.verifyTypes.filter((x) => x !== t) : [...f.verifyTypes, t],
  }));
  const inputStyle: React.CSSProperties = { width: "100%", marginTop: 5, padding: "9px 13px", borderRadius: 8, border: "1.5px solid #E9ECF1", fontSize: 13.5, color: "#0D1117", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#1E40AF");
  const blurGray  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = "#E9ECF1");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const profileUrl = form.factoryUrl.trim();
      const response = await fetch("/api/verification-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          factory_name: form.factoryName || undefined,
          factory_profile_url: profileUrl ? (/^https?:\/\//i.test(profileUrl) ? profileUrl : `https://${profileUrl}`) : undefined,
          product_category: form.category,
          request_type: form.verifyTypes.join(", ") || "General verification",
          buyer_name: form.name,
          buyer_email: form.email,
          company_name: form.company || undefined,
          country: form.country || undefined,
          message: form.message || undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to submit request");
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to submit request");
    } finally {
      setBusy(false);
    }
  };

  const options = [
    { label: "Updated Contact Check", desc: "Re-check business phone, email, contact person, and contact availability.", best: "Before outreach", icon: PhoneIcon },
    { label: "Factory Photos", desc: "Request updated photos or facility evidence where available.", best: "Initial supplier screening", icon: FactoryIcon },
    { label: "Video Walkthrough", desc: "Request video evidence or walkthrough support for higher-confidence sourcing.", best: "Before serious negotiation", icon: GovIcon },
    { label: "Live Verification Support", desc: "Request additional verification assistance for specific factory questions.", best: "Frequent buyers and sourcing teams", icon: ShieldIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 40px" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>Verification Request</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "#0D1117", marginBottom: 8 }}>Request Deeper Supplier Verification</h1>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 560, marginBottom: 22 }}>Need more confidence before contacting or shortlisting a supplier? Request updated contact checks or evidence appropriate to the supplier type.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="#request-form" style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>Submit Verification Request</a>
            <button onClick={onPricing} style={{ padding: "9px 20px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>See Pricing</button>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 32px 36px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "#0D1117", marginBottom: 20 }}>Verification Options</h2>
        <div className="r4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {options.map(({ label, desc, best, icon: Icon }) => (
            <div key={label} onClick={() => toggleVerifyType(label)}
              style={{ background: "#fff", border: `1.5px solid ${form.verifyTypes.includes(label) ? "#1E40AF" : "#E9ECF1"}`, borderRadius: 10, padding: "20px 20px", cursor: "pointer" }}
              onMouseEnter={(e) => { if (!form.verifyTypes.includes(label)) (e.currentTarget as HTMLDivElement).style.borderColor = "#BFCDEE"; }}
              onMouseLeave={(e) => { if (!form.verifyTypes.includes(label)) (e.currentTarget as HTMLDivElement).style.borderColor = "#E9ECF1"; }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: form.verifyTypes.includes(label) ? "#EFF3FF" : "#F0F4FF", border: `1px solid ${form.verifyTypes.includes(label) ? "#BFCDEE" : "#DBEAFE"}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 12 }}>
                <Icon size={16} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 10 }}>{desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FieldLabel>Best for</FieldLabel>
                <span style={{ fontSize: 11.5, color: "#9CA3AF" }}>{best}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + sidebar */}
      <section id="request-form" className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "flex-start" }}>
          {sent ? (
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "56px 40px", textAlign: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #6EE7B7", color: "#10B981", marginBottom: 20 }}><CheckIcon size={20} /></span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0D1117", marginBottom: 8 }}>Request submitted</h2>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>We'll review the details and confirm the verification scope available for this supplier.</p>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#0D1117", marginBottom: 22 }}>Submit a Verification Request</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <FieldLabel>Supplier name</FieldLabel>
                    <input value={form.factoryName} onChange={set("factoryName")} placeholder="e.g. Shenzhen Luminos Technology" style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                  </div>
                  <div>
                    <FieldLabel>Supplier profile URL (optional)</FieldLabel>
                    <input value={form.factoryUrl} onChange={set("factoryUrl")} placeholder="factoryroster.com/..." style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Product category</FieldLabel>
                  <input value={form.category} onChange={set("category")} placeholder="e.g. LED Lighting, Cosmetic Packaging" style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                </div>
                <div>
                  <FieldLabel>What do you want to verify?</FieldLabel>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                    {["Contact details", "Supply evidence", "Authorization evidence", "Factory photos", "Export evidence", "Business registration", "Other"].map((t) => {
                      const active = form.verifyTypes.includes(t);
                      return (
                        <button key={t} onClick={() => toggleVerifyType(t)}
                          style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: active ? 600 : 400, color: active ? "#1E40AF" : "#6B7280", background: active ? "#EFF3FF" : "#F7F8FA", border: `1px solid ${active ? "#BFCDEE" : "#E9ECF1"}`, cursor: "pointer" }}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F0F1F3", paddingTop: 14 }}>
                  <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>Your details</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {([
                      { key: "name",    label: "Your name",   placeholder: "Your name" },
                      { key: "email",   label: "Work email",  placeholder: "you@company.com" },
                      { key: "company", label: "Company",     placeholder: "Your company" },
                      { key: "country", label: "Country",     placeholder: "Country or region" },
                    ] as const).map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <FieldLabel>{label}</FieldLabel>
                        <input value={form[key]} onChange={set(key)} placeholder={placeholder} style={inputStyle} onFocus={focusBlue} onBlur={blurGray} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Additional details (optional)</FieldLabel>
                  <textarea value={form.message} onChange={set("message")} placeholder="Describe what you need to verify or any additional context..." rows={4}
                    style={{ ...inputStyle, resize: "vertical" as const }} onFocus={focusBlue} onBlur={blurGray} />
                </div>
              </div>
              <div style={{ marginTop: 22 }}>
                {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
                <button onClick={submit} disabled={busy || form.category.trim().length < 2 || form.name.trim().length < 2 || !form.email}
                  style={{ padding: "10px 24px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || form.category.trim().length < 2 || form.name.trim().length < 2 || !form.email ? 0.6 : 1 }}>{busy ? "Submitting…" : "Submit Request"}</button>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 22px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>How it works</p>
              {[
                "Submit your request",
                "FactoryRoster reviews available information",
                "Verification scope is confirmed",
                "Updated evidence or contact status is added where available",
              ].map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 3 ? 12 : 0 }}>
                  <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 12, fontWeight: 500, color: "#D1D5DB", flexShrink: 0, marginTop: 1 }}>0{i + 1}</span>
                  <span style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 8 }}>
              <p style={{ fontSize: 11.5, color: "#9CA3AF", lineHeight: 1.65 }}>
                FactoryRoster provides verification support for sourcing research only. We do not guarantee product quality, pricing, delivery, or transaction outcomes.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── About Page ────────────────────────────────────────────────────────────────

function AboutPage({ onSearch, onIndustries, onNav }: { onSearch: (q: string) => void; onIndustries: () => void; onNav: (k: string) => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E9ECF1" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px 56px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 14 }}>About FactoryRoster</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#0D1117", marginBottom: 16 }}>Verified China Supplier Intelligence</h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>FactoryRoster helps global buyers search verified China supplier records and contact intelligence — without acting as a marketplace.</p>
        </div>
      </section>

      {/* Why exists */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
        <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 12 }}>Why FactoryRoster exists</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "#0D1117", marginBottom: 14, lineHeight: 1.3 }}>Built for structured, transparent supplier research</h2>
          </div>
          <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.8, paddingTop: 36 }}>
            Many buyers waste time with outdated listings, unreachable contacts, and unclear supplier roles. FactoryRoster makes supplier research more structured and transparent by verifying each published record before it appears in search results.
          </p>
        </div>
      </section>

      {/* Principle */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#10B981", marginBottom: 8 }}>Our Principle</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", marginBottom: 8 }}>Verified Before Listed</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 520 }}>Every published supplier profile must pass our verification process before appearing in search results.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E9ECF1", borderRadius: 12, overflow: "hidden" }}>
            {[
              { icon: GovIcon, label: "Government Registration", desc: "Company legal registration confirmed against official Chinese government records.", num: "01" },
              { icon: PhoneIcon, label: "Business Contact", desc: "Business phone, email, and contact person manually verified before publication.", num: "02" },
              { icon: FactoryIcon, label: "Supply Evidence", desc: "Evidence matched to the supplier type is reviewed and recorded.", num: "03" },
            ].map(({ icon: Icon, label, desc, num }) => (
              <div key={label} style={{ background: "#fff", padding: "28px 26px" }}>
                <Mono color="#E5E7EB">{num}</Mono>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", margin: "14px 0 12px" }}>
                  <Icon size={17} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0D1117", marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we provide */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 24 }}>What FactoryRoster Provides</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { icon: GovIcon, label: "Verified supplier records", desc: "Supplier profiles verified before being published in search results." },
            { icon: PhoneIcon, label: "Verified contact intelligence", desc: "Unlockable verified phone, email, and contact person records." },
            { icon: FactoryIcon, label: "Supplier verification support", desc: "Updated contact checks and supplier-type evidence review." },
            { icon: SearchIcon, label: "Sourcing research tools", desc: "Search, filter, and shortlist verified China suppliers by type, supply model, MOQ fit, industry, and province." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 10, padding: "20px 20px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0F4FF", border: "1px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#1E40AF", marginBottom: 12 }}>
                <Icon size={16} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0D1117", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we don't do */}
      <section style={{ background: "#fff", borderTop: "1px solid #E9ECF1", borderBottom: "1px solid #E9ECF1" }}>
        <div className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px" }}>
          <div className="r2" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 40, alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 10 }}>Boundaries</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "#0D1117", marginBottom: 10 }}>What FactoryRoster Does Not Do</h2>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>FactoryRoster is not a marketplace and does not participate in buyer-supplier transactions.</p>
            </div>
            <div className="r2" style={{ background: "#F7F8FA", border: "1px solid #E9ECF1", borderRadius: 10, padding: "22px 26px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {["We do not process payments", "We do not handle logistics", "We do not guarantee product quality", "We do not represent suppliers or buyers in transactions"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#9CA3AF", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", marginBottom: 10 }}>Start with verified supplier records</h2>
        <p style={{ fontSize: 14.5, color: "#6B7280", marginBottom: 26 }}>Search by product, industry, or category.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={() => onSearch("")} style={{ padding: "10px 22px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
          <button onClick={onIndustries} style={{ padding: "10px 22px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Browse Industries</button>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}

// ─── Legal Page (Privacy + Terms) ─────────────────────────────────────────────

const PRIVACY_SECTIONS = [
  { title: "Information we collect", body: "We collect information you provide when creating an account, purchasing contact credits, submitting verification requests, or contacting us. This includes email address, name, company information, and country." },
  { title: "Account information", body: "Account registration requires a work email and password. Your account stores saved supplier profiles, unlocked contact records, contact credit balance, and verification request history." },
  { title: "Contact and verification request information", body: "When you submit a contact unlock or verification request, we store the supplier reference, request details, and your contact information to process and respond to your request." },
  { title: "Payment-related information", body: "Contact credit purchases are processed through a third-party payment provider. FactoryRoster does not store payment card details. We retain purchase records for accounting and support purposes." },
  { title: "Analytics and cookies", body: "We use analytics to understand how the platform is used. Standard web cookies may be used for session management and platform functionality." },
  { title: "How we use information", body: "We use your information to operate the platform, fulfill contact credit purchases, process verification requests, respond to support inquiries, and improve the service. We do not sell your data to third parties." },
  { title: "How we protect information", body: "We use standard technical and organizational measures to protect user data. No method of transmission or storage is 100% secure." },
  { title: "Data retention", body: "We retain account and purchase records while your account is active and for a reasonable period after. You may request account deletion by contacting us." },
  { title: "Contact us", body: "Questions about this policy? Contact FactoryRoster through the Contact page on this site." },
];

const TERMS_SECTIONS = [
  { title: "FactoryRoster service scope", body: "FactoryRoster provides verified supplier information, contact intelligence, and supplier verification support for sourcing research. Use of this service is subject to these terms." },
  { title: "Information service only", body: "FactoryRoster is an information service. Published supplier records represent information verified at the time of listing and may not reflect all current conditions." },
  { title: "No marketplace or transaction role", body: "FactoryRoster does not participate in transactions, payments, logistics, contracts, inspections, or buyer-supplier agreements. Buyers and suppliers manage their own commercial relationships independently." },
  { title: "Contact credits", body: "Contact credits unlock individual verified contact records. Credits are for personal sourcing research use. FactoryRoster does not guarantee that contact information will result in a successful supplier relationship." },
  { title: "Supplier verification requests", body: "Verification request services are available to eligible users. Scope and availability vary by supplier and request type. FactoryRoster will confirm available scope before proceeding." },
  { title: "Buyer responsibility", body: "Buyers are responsible for their own due diligence, including product quality, contract terms, compliance, payment arrangements, and order fulfillment. FactoryRoster does not represent buyers or suppliers in transactions." },
  { title: "Supplier information and updates", body: "Supplier records are based on information reviewed at verification time. Suppliers may request corrections through the Contact page. FactoryRoster reviews correction requests but does not guarantee immediate updates." },
  { title: "No guarantee of product quality, pricing, delivery, or compliance", body: "FactoryRoster verifies identity, contactability, and supplier-type supply evidence only. We make no guarantee regarding product quality, pricing accuracy, delivery performance, regulatory compliance, or transaction outcomes." },
  { title: "Account use", body: "You are responsible for maintaining account security. Accounts may not be shared or used in violation of these terms. FactoryRoster may suspend accounts that violate usage terms." },
  { title: "Contact", body: "Questions about these terms? Contact FactoryRoster through the Contact page." },
];

function LegalPage({ kind, onNav }: { kind: "privacy" | "terms"; onNav: (k: string) => void }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const intro = isPrivacy
    ? "This Privacy Policy explains how FactoryRoster collects and uses information related to accounts, contact credit purchases, verification requests, and website usage."
    : "These terms explain the use of FactoryRoster as a verified supplier information and contact intelligence service. FactoryRoster provides verified supplier information for sourcing research only and does not participate in transactions, payments, logistics, contracts, inspections, or buyer-supplier agreements unless explicitly agreed in a separate service.";
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "52px 32px 80px" }}>
        <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", marginBottom: 6 }}>{title}</h1>
        <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, color: "#C4C9D4", marginBottom: 32 }}>Last updated: September 2026</p>

        <div style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 12, padding: "36px 40px" }}>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #F0F1F3" }}>{intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {sections.map((s, i) => (
              <div key={s.title}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0D1117", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  <Mono color="#D1D5DB">{String(i + 1).padStart(2, "0")}.</Mono>
                  {s.title.charAt(0).toUpperCase() + s.title.slice(1)}
                </h2>
                <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.75 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono color="#C4C9D4">factoryroster.com</Mono>
          <div style={{ display: "flex", gap: 20 }}>
            {(isPrivacy ? [["Terms", "Terms"], ["Contact", "Contact"]] : [["Privacy", "Privacy"], ["Contact", "Contact"]]).map(([label, nav]) => (
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNav(nav); }} style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 404 Page ──────────────────────────────────────────────────────────────────

function NotFoundPage({ onSearch, onIndustries, onNav }: { onSearch: (q: string) => void; onIndustries: () => void; onNav: (k: string) => void }) {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        {/* Minimal icon illustration */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ position: "relative" as const, width: 72, height: 72 }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: "#F0F4FF", border: "1.5px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#C4CDE4" }}>
              <LogoMark size={38} />
            </div>
            <span style={{ position: "absolute" as const, top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#F7F8FA", border: "1.5px solid #E9ECF1", display: "flex", alignItems: "center", justifyContent: "center", color: "#D1D5DB" }}>
              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#C4C9D4", marginBottom: 12 }}>404</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "#0D1117", marginBottom: 10 }}>Page not found</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 28 }}>This page may have moved, be unavailable, or not yet listed on FactoryRoster.</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <button onClick={() => onSearch("")} style={{ padding: "9px 20px", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>Search Suppliers</button>
          <button onClick={onIndustries} style={{ padding: "9px 20px", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13.5, fontWeight: 600, border: "1px solid #D1D5DB", cursor: "pointer" }}>Browse Industries</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[["Verification", "Verification"], ["Pricing", "Pricing"], ["Contact", "Contact"]].map(([label, nav]) => (
            <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNav(nav); }} style={{ fontSize: 12.5, color: "#9CA3AF", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#374151")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#9CA3AF")}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function pageFromPath(path: string): Page {
  const url = new URL(path || "/", "http://factoryroster.local");
  const pathname = url.pathname;
  if (pathname === "/") return { kind: "home" };
  if (pathname === "/search") return { kind: "results", query: url.searchParams.get("q") || "" };
  if (pathname.startsWith("/factories/")) {
    const slug = pathname.split("/").filter(Boolean)[1] || "";
    return { kind: "detail", factory: { ...SEARCH_RESULTS[0], slug }, fromQuery: url.searchParams.get("from") || "" };
  }
  if (pathname.startsWith("/industries/")) return { kind: "results", query: pathname.split("/").filter(Boolean)[1]?.replaceAll("-", " ") || "" };
  if (pathname === "/industries") return { kind: "industries" };
  if (pathname === "/verification") return { kind: "verification" };
  if (pathname === "/pricing") return { kind: "pricing" };
  if (pathname.startsWith("/guides")) return { kind: "guides" };
  if (pathname === "/sign-in") return { kind: "signin" };
  if (pathname === "/get-started") return { kind: "signup" };
  if (pathname === "/contact") return { kind: "contact" };
  if (pathname === "/request-verification") return { kind: "request-verification" };
  if (pathname === "/about") return { kind: "about" };
  if (pathname === "/privacy-policy") return { kind: "privacy" };
  if (pathname === "/terms") return { kind: "terms" };
  return { kind: "not-found" };
}

export default function App({ initialPath = "/", initialSupplier }: { initialPath?: string; initialSupplier?: Record<string, unknown> }) {
  const router = useRouter();
  const [page, setPage] = useState<Page>(() => {
    const initialPage = pageFromPath(initialPath);
    return initialPage.kind === "detail" && initialSupplier ? { ...initialPage, factory: apiFactoryToResult(initialSupplier) } : initialPage;
  });

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(`${window.location.pathname}${window.location.search}`));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPage: Page, href: string) => {
    setPage(nextPage);
    router.push(href);
  };
  const goHome         = () => navigate({ kind: "home" }, "/");
  const goResults      = (q: string) => navigate({ kind: "results", query: q }, `/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const goDetail       = (f: SearchResult, fromQuery = "") => navigate({ kind: "detail", factory: f, fromQuery }, `/factories/${f.slug || "shenzhen-luminos-technology"}${fromQuery ? `?from=${encodeURIComponent(fromQuery)}` : ""}`);
  const goIndustries   = () => navigate({ kind: "industries" }, "/industries");
  const goVerification = () => navigate({ kind: "verification" }, "/verification");
  const goPricing      = () => navigate({ kind: "pricing" }, "/pricing");
  const goGuides       = () => navigate({ kind: "guides" }, "/guides");
  const goSignIn       = () => navigate({ kind: "signin" }, "/sign-in");
  const goSignUp       = () => navigate({ kind: "signup" }, "/get-started");
  const goContact      = () => navigate({ kind: "contact" }, "/contact");
  const goRequestVerification = () => navigate({ kind: "request-verification" }, "/request-verification");
  const goAbout        = () => navigate({ kind: "about" }, "/about");
  const goPrivacy      = () => navigate({ kind: "privacy" }, "/privacy-policy");
  const goTerms        = () => navigate({ kind: "terms" }, "/terms");
  const goNotFound     = () => navigate({ kind: "not-found" }, "/404");

  const handleNav = (k: string) => {
    const map: Record<string, () => void> = {
      "Industries": goIndustries,
      "Verification": goVerification,
      "Pricing": goPricing,
      "Guides": goGuides,
      "Sign In": goSignIn,
      "Get Started": goSignUp,
      "Contact": goContact,
      "Request Verification": goRequestVerification,
      "About": goAbout,
      "Privacy": goPrivacy,
      "Terms": goTerms,
      "Home": goHome,
    };
    (map[k] ?? goHome)();
  };

  const noNav = page.kind === "signin" || page.kind === "signup";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {!noNav && <Nav onHome={goHome} page={page} onNav={handleNav} />}

      {page.kind === "home" && (
        <main>
          <Hero onSearch={goResults} />
          <Industries onSearch={goResults} />
          <VerificationSection />
          <RecentRecords onDetail={(f) => goDetail(f, "")} />
          <HowItWorks />
          <Footer onNav={handleNav} />
        </main>
      )}

      {page.kind === "results" && (
        <SearchResultsPage
          key={page.query}
          query={page.query}
          onDetail={(f) => goDetail(f, page.query)}
          onSearch={goResults}
        />
      )}

      {page.kind === "detail" && (
        <FactoryDetailPage
          factory={page.factory}
          fromQuery={page.fromQuery}
          onBack={() => page.fromQuery ? goResults(page.fromQuery) : goHome()}
        />
      )}

      {page.kind === "industries" && (
        <IndustriesPage onSearch={goResults} onNav={handleNav} />
      )}

      {page.kind === "verification" && (
        <VerificationPage onSearch={goResults} onIndustries={goIndustries} onPricing={goPricing} onNav={handleNav} />
      )}

      {page.kind === "pricing" && (
        <PricingPage onSearch={goResults} onIndustries={goIndustries} onNav={handleNav} />
      )}

      {page.kind === "guides" && (
        <GuidesPage onSearch={goResults} onVerification={goVerification} onIndustries={goIndustries} onNav={handleNav} />
      )}

      {page.kind === "signin" && (
        <SignInPage onSignUp={goSignUp} onHome={goHome} onNav={handleNav} />
      )}

      {page.kind === "signup" && (
        <SignUpPage onSignIn={goSignIn} onHome={goHome} onNav={handleNav} />
      )}

      {page.kind === "contact" && (
        <ContactPage onNav={handleNav} />
      )}

      {page.kind === "request-verification" && (
        <RequestVerificationPage onPricing={goPricing} onNav={handleNav} />
      )}

      {page.kind === "about" && (
        <AboutPage onSearch={goResults} onIndustries={goIndustries} onNav={handleNav} />
      )}

      {page.kind === "privacy" && (
        <LegalPage kind="privacy" onNav={handleNav} />
      )}

      {page.kind === "terms" && (
        <LegalPage kind="terms" onNav={handleNav} />
      )}

      {page.kind === "not-found" && (
        <NotFoundPage onSearch={goResults} onIndustries={goIndustries} onNav={handleNav} />
      )}
    </div>
  );
}
