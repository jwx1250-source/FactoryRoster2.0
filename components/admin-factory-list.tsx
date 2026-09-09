"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FactoryRow = {
  id: string;
  slug: string;
  company_name: string;
  chinese_name: string | null;
  record_id: string;
  province: string;
  city: string;
  main_products: string[];
  industries: { name: string } | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/factories?limit=100")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load factories");
        setRows(body.data ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load factories"))
      .finally(() => setLoading(false));
  }, []);

  const provinces = useMemo(() => [...new Set(rows.map((row) => row.province).filter(Boolean))].sort(), [rows]);
  const industries = useMemo(() => [...new Set(rows.map((row) => row.industries?.name).filter((value): value is string => Boolean(value)))].sort(), [rows]);
  const [industry, setIndustry] = useState("all");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const haystack = [row.company_name, row.chinese_name, row.record_id, row.city, row.province, ...(row.main_products ?? [])].join(" ").toLowerCase();
      const statusMatches = status === "all" || (status === "published" ? row.is_published : !row.is_published);
      const verified = new Set((row.verification_records ?? []).filter((check) => check.status === "verified").map((check) => check.verification_type));
      const verificationMatches = verification === "all" || (verification === "complete" ? verified.size === 3 : verification === "incomplete" ? verified.size < 3 : !verified.has(verification));
      const indexingMatches = indexing === "all" || (indexing === "indexable" ? row.is_indexable : !row.is_indexable);
      return (!query || haystack.includes(query)) && statusMatches && verificationMatches && indexingMatches && (province === "all" || row.province === province) && (industry === "all" || row.industries?.name === industry);
    });
  }, [rows, search, status, province, verification, indexing, industry]);

  async function patchFactory(row: FactoryRow, patch: Partial<FactoryRow>) {
    const response = await fetch(`/api/admin/factories/${row.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const body = await response.json();
    if (!response.ok) return setError([body.error, body.detail].filter(Boolean).join(" "));
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, ...body.data } : item));
  }

  if (loading) return <p className="admin-notice">Loading factories…</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return <>
    <div className="admin-filterbar">
      <input aria-label="Search factories" placeholder="Search name, record ID, city or product…" value={search} onChange={(event) => setSearch(event.target.value)} />
      <select aria-label="Publication status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
      <select aria-label="Province" value={province} onChange={(event) => setProvince(event.target.value)}><option value="all">All provinces</option>{provinces.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Industry" value={industry} onChange={(event) => setIndustry(event.target.value)}><option value="all">All industries</option>{industries.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Verification" value={verification} onChange={(event) => setVerification(event.target.value)}><option value="all">All verification</option><option value="complete">Verification complete</option><option value="incomplete">Verification incomplete</option><option value="government_registration">Missing Government Registration</option><option value="business_contact">Missing Business Contact</option><option value="factory_evidence">Missing Factory Evidence</option></select>
      <select aria-label="Indexing" value={indexing} onChange={(event) => setIndexing(event.target.value)}><option value="all">All indexing</option><option value="indexable">Indexable</option><option value="noindex">Noindex</option></select>
      <div className="admin-notice">{filtered.length} shown / {rows.length} total</div>
    </div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Factory</th><th>Record ID</th><th>Industry</th><th>Location</th><th>Verification</th><th>Published</th><th>Indexing</th><th>Last verified</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
      {filtered.map((row) => <tr key={row.id}><td><strong>{row.company_name}</strong><br /><span>{row.chinese_name || "—"}</span></td><td>{row.record_id}</td><td>{row.industries?.name || "—"}</td><td>{row.city}, {row.province}</td><td><span className={`admin-badge ${(row.verification_records ?? []).filter((check) => check.status === "verified").length === 3 ? "ok" : "warn"}`}>{(row.verification_records ?? []).filter((check) => check.status === "verified").length}/3 verified</span></td><td>{row.is_published ? "Yes" : "No"}</td><td>{row.is_indexable ? "Indexable" : "Noindex"}</td><td>{row.last_verified_at ? new Date(row.last_verified_at).toLocaleDateString() : "—"}</td><td>{new Date(row.updated_at).toLocaleDateString()}</td><td><div className="admin-actions"><Link href={`/admin/factories/${row.id}`}>Edit</Link>{row.is_published && <Link href={`/factories/${row.slug}`} target="_blank">Preview</Link>}<button className="admin-secondary" onClick={() => patchFactory(row, { is_published: !row.is_published, is_indexable: row.is_published ? false : row.is_indexable })}>{row.is_published ? "Unpublish" : "Publish"}</button><button className="admin-secondary" onClick={() => patchFactory(row, { is_indexable: !row.is_indexable })}>{row.is_indexable ? "Noindex" : "Index"}</button></div></td></tr>)}
      {filtered.length === 0 && <tr><td colSpan={10}>No factories match these filters.</td></tr>}
    </tbody></table></div>
  </>;
}
