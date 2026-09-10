"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FactoryRow = {
  id: string;
  slug: string;
  company_name: string;
  chinese_name: string | null;
  record_id: string;
  supplier_type: string;
  supply_model: string;
  moq_level: string;
  supports_sample_orders: boolean;
  supports_small_orders: boolean;
  supports_private_label: boolean;
  province: string;
  city: string;
  main_products: string[];
  industries: { name: string; slug: string } | null;
  secondary_category: { name: string; slug: string } | null;
  verification_records: { verification_type: string; status: string }[];
  is_published: boolean;
  is_indexable: boolean;
  last_verified_at: string | null;
  updated_at: string;
};

export default function AdminFactoryList() {
  const [rows, setRows] = useState<FactoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [province, setProvince] = useState("all");
  const [verification, setVerification] = useState("all");
  const [indexing, setIndexing] = useState("all");
  const [secondaryCategory, setSecondaryCategory] = useState("all");
  const [supplierType, setSupplierType] = useState("all");
  const [supplyModel, setSupplyModel] = useState("all");
  const [moqLevel, setMoqLevel] = useState("all");
  const [sampleOrders, setSampleOrders] = useState("all");
  const [smallOrders, setSmallOrders] = useState("all");
  const [privateLabel, setPrivateLabel] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/factories?limit=100")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load suppliers");
        setRows(body.data ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load suppliers"))
      .finally(() => setLoading(false));
  }, []);

  const provinces = useMemo(() => [...new Set(rows.map((row) => row.province).filter(Boolean))].sort(), [rows]);
  const industries = useMemo(() => [...new Set(rows.map((row) => row.industries?.name).filter((value): value is string => Boolean(value)))].sort(), [rows]);
  const secondaryCategories = useMemo(() => [...new Set(rows.filter((row) => industry === "all" || row.industries?.name === industry).map((row) => row.secondary_category?.name).filter((value): value is string => Boolean(value)))].sort(), [industry, rows]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const haystack = [row.company_name, row.chinese_name, row.record_id, row.city, row.province, ...(row.main_products ?? [])].join(" ").toLowerCase();
      const statusMatches = status === "all" || (status === "published" ? row.is_published : !row.is_published);
      const verified = new Set((row.verification_records ?? []).filter((check) => check.status === "verified").map((check) => check.verification_type));
      const verificationMatches = verification === "all" || (verification === "complete" ? verified.size === 3 : verification === "incomplete" ? verified.size < 3 : !verified.has(verification));
      const indexingMatches = indexing === "all" || (indexing === "indexable" ? row.is_indexable : !row.is_indexable);
      const booleanMatches = (filter: string, value: boolean) => filter === "all" || value === (filter === "yes");
      return (!query || haystack.includes(query)) && statusMatches && verificationMatches && indexingMatches
        && (province === "all" || row.province === province)
        && (industry === "all" || row.industries?.name === industry)
        && (secondaryCategory === "all" || row.secondary_category?.name === secondaryCategory)
        && (supplierType === "all" || row.supplier_type === supplierType)
        && (supplyModel === "all" || row.supply_model === supplyModel)
        && (moqLevel === "all" || row.moq_level === moqLevel)
        && booleanMatches(sampleOrders, row.supports_sample_orders)
        && booleanMatches(smallOrders, row.supports_small_orders)
        && booleanMatches(privateLabel, row.supports_private_label);
    });
  }, [rows, search, status, province, verification, indexing, industry, secondaryCategory, supplierType, supplyModel, moqLevel, sampleOrders, smallOrders, privateLabel]);

  const setPrimaryIndustry = (value: string) => { setIndustry(value); setSecondaryCategory("all"); };
  const yesNoOptions = <><option value="yes">Yes</option><option value="no">No</option></>;

  async function patchFactory(row: FactoryRow, patch: Partial<FactoryRow>) {
    const response = await fetch(`/api/admin/factories/${row.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const body = await response.json();
    if (!response.ok) return setError([body.error, body.detail].filter(Boolean).join(" "));
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, ...body.data } : item));
  }

  if (loading) return <p className="admin-notice">Loading suppliers…</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return <>
    <div className="admin-filterbar">
      <input aria-label="Search suppliers" placeholder="Search name, record ID, city or product…" value={search} onChange={(event) => setSearch(event.target.value)} />
      <select aria-label="Publication status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
      <select aria-label="Province" value={province} onChange={(event) => setProvince(event.target.value)}><option value="all">All provinces</option>{provinces.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Primary Industry" value={industry} onChange={(event) => setPrimaryIndustry(event.target.value)}><option value="all">All primary industries</option>{industries.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Secondary Category" value={secondaryCategory} onChange={(event) => setSecondaryCategory(event.target.value)}><option value="all">All secondary categories</option>{secondaryCategories.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Supplier Type" value={supplierType} onChange={(event) => setSupplierType(event.target.value)}><option value="all">All supplier types</option><option value="manufacturer">Manufacturer</option><option value="authorized_distributor">Authorized Distributor</option><option value="first_tier_agent">First-tier Agent</option><option value="trading_company">Trading Supplier</option><option value="exporter">Exporter</option><option value="wholesaler">Wholesaler</option><option value="brand_owner">Brand Owner</option><option value="sourcing_service_provider">Sourcing Service Provider</option></select>
      <select aria-label="Supply Model" value={supplyModel} onChange={(event) => setSupplyModel(event.target.value)}><option value="all">All supply models</option><option value="factory_direct">Factory Direct</option><option value="authorized_distribution">Authorized Distribution</option><option value="first_tier_agent">First-tier Agent</option><option value="wholesale_inventory">Wholesale Inventory</option><option value="export_trading">Export Trading</option><option value="sourcing_service">Sourcing Service</option></select>
      <select aria-label="MOQ Level" value={moqLevel} onChange={(event) => setMoqLevel(event.target.value)}><option value="all">All MOQ levels</option><option value="sample_supported">Sample Supported</option><option value="low_moq">Low MOQ</option><option value="standard_moq">Standard MOQ</option><option value="bulk_only">Bulk Only</option><option value="unknown">Unknown MOQ</option></select>
      <select aria-label="Supports Sample Orders" value={sampleOrders} onChange={(event) => setSampleOrders(event.target.value)}><option value="all">Sample orders: any</option>{yesNoOptions}</select>
      <select aria-label="Supports Small Orders" value={smallOrders} onChange={(event) => setSmallOrders(event.target.value)}><option value="all">Small orders: any</option>{yesNoOptions}</select>
      <select aria-label="Supports Private Label" value={privateLabel} onChange={(event) => setPrivateLabel(event.target.value)}><option value="all">Private label: any</option>{yesNoOptions}</select>
      <select aria-label="Verification" value={verification} onChange={(event) => setVerification(event.target.value)}><option value="all">All verification</option><option value="complete">Verification complete</option><option value="incomplete">Verification incomplete</option><option value="government_registration">Missing Government Registration</option><option value="business_contact">Missing Business Contact</option><option value="supply_evidence">Missing Supply Evidence</option></select>
      <select aria-label="Indexing" value={indexing} onChange={(event) => setIndexing(event.target.value)}><option value="all">All indexing</option><option value="indexable">Indexable</option><option value="noindex">Noindex</option></select>
      <div className="admin-notice">{filtered.length} shown / {rows.length} total</div>
    </div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Supplier</th><th>Fit</th><th>Record ID</th><th>Category</th><th>Location</th><th>Verification</th><th>Published</th><th>Indexing</th><th>Last verified</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((row) => { const fitBadges = [row.moq_level === "low_moq" && "Low MOQ", row.moq_level === "sample_supported" && "Sample Supported", row.supports_sample_orders && "Sample Supported", row.supports_small_orders && "Small Batch Friendly", row.moq_level === "bulk_only" && "Bulk Only", row.supply_model === "factory_direct" && "Factory Direct", row.supplier_type === "wholesaler" && "Wholesaler", row.supplier_type === "trading_company" && "Trading Supplier", row.supplier_type === "authorized_distributor" && "Authorized Distributor"].filter(Boolean) as string[]; return <tr key={row.id}><td><strong>{row.company_name}</strong><br /><span>{row.supplier_type?.replaceAll("_", " ")}</span></td><td><div className="admin-actions">{[...new Set(fitBadges)].map((badge) => <span className={`admin-badge ${badge === "Bulk Only" ? "warn" : "ok"}`} key={badge}>{badge}</span>)}</div></td><td>{row.record_id}</td><td><strong>{row.industries?.name || "—"}</strong><br /><span>{row.secondary_category?.name || "—"}</span></td><td>{row.city}, {row.province}</td><td><span className={`admin-badge ${(row.verification_records ?? []).filter((check) => check.status === "verified").length === 3 ? "ok" : "warn"}`}>{(row.verification_records ?? []).filter((check) => check.status === "verified").length}/3 verified</span></td><td>{row.is_published ? "Yes" : "No"}</td><td>{row.is_indexable ? "Indexable" : "Noindex"}</td><td>{row.last_verified_at ? new Date(row.last_verified_at).toLocaleDateString() : "—"}</td><td>{new Date(row.updated_at).toLocaleDateString()}</td><td><div className="admin-actions"><Link href={`/admin/factories/${row.id}`}>Edit</Link>{row.is_published && <Link href={`/factories/${row.slug}`} target="_blank">Preview</Link>}<button className="admin-secondary" onClick={() => patchFactory(row, { is_published: !row.is_published, is_indexable: row.is_published ? false : row.is_indexable })}>{row.is_published ? "Unpublish" : "Publish"}</button><button className="admin-secondary" onClick={() => patchFactory(row, { is_indexable: !row.is_indexable })}>{row.is_indexable ? "Noindex" : "Index"}</button></div></td></tr>; })}
      {filtered.length === 0 && <tr><td colSpan={11}>No suppliers match these filters.</td></tr>}
    </tbody></table></div>
  </>;
}
