"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Row = Record<string, unknown>;
type Verification = Row & { id?: string; verification_type: string; status: string; checked_items?: Record<string, boolean> };
const arrayFields = new Set(["main_products", "capabilities", "export_markets", "certifications", "trade_terms"]);
const labels: Record<string, string> = { government_registration: "Government Registration", business_contact: "Business Contact", factory_evidence: "Factory Evidence" };
const sections = [
  ["Identity", [["company_name", "Company name", "text"], ["chinese_name", "Chinese name", "text"], ["record_id", "Record ID", "text"], ["slug", "Public URL slug", "text"], ["factory_type", "Factory type", "text"]]],
  ["Location", [["province", "Province", "text"], ["city", "City", "text"], ["district", "District", "text"], ["address_public", "Public address", "text"]]],
  ["Business profile", [["established_year", "Established year", "number"], ["employee_range", "Employee range", "text"], ["factory_size", "Factory size", "text"], ["annual_revenue_range", "Annual revenue range", "text"], ["website_url", "Website", "url"], ["moq", "MOQ", "text"]]],
  ["Products and capabilities", [["main_products", "Main products (comma separated)", "text"], ["capabilities", "Capabilities (comma separated)", "text"], ["export_markets", "Export markets (comma separated)", "text"], ["certifications", "Certifications (comma separated)", "text"], ["trade_terms", "Trade terms (comma separated)", "text"], ["overview", "Public overview", "textarea"]]],
  ["SEO", [["seo_title", "SEO title", "text"], ["seo_description", "SEO description", "textarea"]]],
  ["Internal", [["source_notes", "Source notes", "textarea"], ["internal_notes", "Internal notes", "textarea"]]],
] as const;
function display(value: unknown) { return Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value); }

export default function AdminFactoryForm({ initialFactory = {}, initialVerifications = [], initialContact = null, industries = [] }: { initialFactory?: Row; initialVerifications?: Verification[]; initialContact?: Row | null; industries?: { id: string; name: string }[] }) {
  const router = useRouter();
  const [factory, setFactory] = useState<Row>({ is_published: false, is_indexable: false, ...initialFactory });
  const [checks, setChecks] = useState<Verification[]>(initialVerifications);
  const [contact, setContact] = useState<Row>(initialContact ?? { is_locked: true, is_active: true });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const id = typeof factory.id === "string" ? factory.id : null;
  const updateCheck = (index: number, key: string, value: unknown) => setChecks((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item));

  async function saveRelated(factoryId: string) {
    await Promise.all(checks.map(async (record) => {
      if (!record.id) return;
      const result = await fetch(`/api/admin/verification-records/${record.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: record.status, checked_items: record.checked_items, verification_method: record.verification_method || null, evidence_note: record.evidence_note || null, internal_note: record.internal_note || null, verified_at: record.status === "verified" ? record.verified_at || new Date().toISOString() : null }) });
      if (!result.ok) throw new Error((await result.json()).error || "Unable to save verification");
      if (record.verified_by) {
        const attribution = await fetch(`/api/admin/verification-records/${record.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verified_by: record.verified_by }) });
        if (!attribution.ok) throw new Error((await attribution.json()).error || "Unable to save verifier");
      }
    }));
    const contactPayload = Object.fromEntries(Object.entries(contact).filter(([key, value]) => !["id", "created_at", "updated_at"].includes(key) && value !== ""));
    if (Object.keys(contactPayload).length > 2) {
      const result = await fetch(contact.id ? `/api/admin/contacts/${contact.id}` : "/api/admin/contacts", { method: contact.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contact.id ? contactPayload : { ...contactPayload, factory_id: factoryId }) });
      if (!result.ok) throw new Error((await result.json()).error || "Unable to save contact");
    }
  }

  async function save(event: FormEvent, publish = false) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const payload = Object.fromEntries(Object.entries({ ...factory, is_published: publish || factory.is_published }).filter(([key]) => !["id", "created_at", "updated_at", "has_verified_contact"].includes(key)).map(([key, value]) => [key, arrayFields.has(key) ? String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean) : key === "established_year" && value ? Number(value) : value === "" ? null : value]));
    try {
      if (id && publish) await saveRelated(id);
      const response = await fetch(id ? `/api/admin/factories/${id}` : "/api/admin/factories", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json(); if (!response.ok) throw new Error([body.error, body.detail].filter(Boolean).join(" "));
      const savedId = body.data.id as string;
      if (id && !publish) await saveRelated(savedId);
      setNotice(publish ? "Factory published." : "Draft saved.");
      if (!id) router.replace(`/admin/factories/${savedId}`); else router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save factory"); } finally { setSaving(false); }
  }

  return <form className="admin-form" onSubmit={(event) => save(event)}>
    {sections.map(([title, fields]) => <section className="admin-form-section" key={title}><h2>{title}</h2><div className="admin-fields">{fields.map(([key, label, type]) => <label className={`admin-field ${type === "textarea" ? "full" : ""}`} key={key}>{label}{type === "textarea" ? <textarea value={display(factory[key])} onChange={(event) => setFactory((current) => ({ ...current, [key]: event.target.value }))} /> : <input type={type} required={["company_name", "record_id", "slug", "province", "city"].includes(key)} value={display(factory[key])} onChange={(event) => setFactory((current) => ({ ...current, [key]: event.target.value }))} />}</label>)}</div>{title === "Identity" && <label className="admin-field" style={{ marginTop: 14 }}>Industry<select value={display(factory.industry_id)} onChange={(event) => setFactory((current) => ({ ...current, industry_id: event.target.value || null }))}><option value="">No industry</option>{industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}</select></label>}</section>)}
    <section className="admin-form-section"><h2>Publication</h2><div className="admin-fields"><label className="admin-field">Visibility<select value={factory.is_published ? "published" : "draft"} onChange={(event) => setFactory((current) => ({ ...current, is_published: event.target.value === "published" }))}><option value="draft">Draft — private</option><option value="published">Published — requires all checks</option></select></label><label className="admin-field">Search engine indexing<select value={factory.is_indexable ? "yes" : "no"} onChange={(event) => setFactory((current) => ({ ...current, is_indexable: event.target.value === "yes" }))}><option value="no">No</option><option value="yes">Yes</option></select></label><label className="admin-field">Last verified at<input type="datetime-local" value={typeof factory.last_verified_at === "string" ? factory.last_verified_at.slice(0, 16) : ""} onChange={(event) => setFactory((current) => ({ ...current, last_verified_at: event.target.value ? new Date(event.target.value).toISOString() : null }))} /></label></div></section>
    {id && <section className="admin-form-section"><h2>Verification checks</h2>{checks.map((record, index) => <div className="admin-panel" key={record.verification_type}><h2>{labels[record.verification_type] ?? record.verification_type}</h2><div className="admin-fields"><label className="admin-field">Status<select value={record.status} onChange={(event) => updateCheck(index, "status", event.target.value)}><option value="pending">Pending</option><option value="verified">Verified</option><option value="failed">Failed</option></select></label><label className="admin-field">Verification method<input value={display(record.verification_method)} onChange={(event) => updateCheck(index, "verification_method", event.target.value)} /></label><label className="admin-field full">Checked items<div className="admin-actions">{Object.entries(record.checked_items ?? {}).map(([key, checked]) => <label key={key}><input type="checkbox" checked={checked} onChange={(event) => updateCheck(index, "checked_items", { ...record.checked_items, [key]: event.target.checked })} /> {key.replaceAll("_", " ")}</label>)}</div></label><label className="admin-field">Evidence note<textarea value={display(record.evidence_note)} onChange={(event) => updateCheck(index, "evidence_note", event.target.value)} /></label><label className="admin-field">Internal note<textarea value={display(record.internal_note)} onChange={(event) => updateCheck(index, "internal_note", event.target.value)} /></label></div></div>)}</section>}
    {id && <section className="admin-form-section"><h2>Verified contact (always locked publicly)</h2><div className="admin-fields">{[["contact_person","Contact person"],["position","Position"],["verified_phone","Verified phone"],["verified_email","Verified email"],["whatsapp","WhatsApp"],["wechat","WeChat"],["contact_verification_method","Verification method"],["internal_notes","Internal notes"]].map(([key,label]) => <label className="admin-field" key={key}>{label}<input value={display(contact[key])} onChange={(event) => setContact((current) => ({ ...current, [key]: event.target.value }))} /></label>)}<label className="admin-field">Active<select value={contact.is_active === false ? "no" : "yes"} onChange={(event) => setContact((current) => ({ ...current, is_active: event.target.value === "yes" }))}><option value="yes">Yes</option><option value="no">No</option></select></label></div></section>}
    {id && <section className="admin-form-section"><h2>Verification audit metadata</h2><div className="admin-fields">{checks.map((record, index) => <div className="admin-panel" key={record.verification_type}><h2>{labels[record.verification_type]}</h2><label className="admin-field">Verified at<input type="datetime-local" value={typeof record.verified_at === "string" ? record.verified_at.slice(0, 16) : ""} onChange={(event) => updateCheck(index, "verified_at", event.target.value ? new Date(event.target.value).toISOString() : null)} /></label><label className="admin-field">Verified by (user ID)<input value={display(record.verified_by)} onChange={(event) => updateCheck(index, "verified_by", event.target.value || null)} /></label></div>)}</div></section>}
    {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}
    <div className="admin-form-footer"><button className="admin-primary" disabled={saving} type="submit">{saving ? "Saving…" : "Save draft"}</button>{id && <button className="admin-secondary" disabled={saving} type="button" onClick={(event) => save(event as unknown as FormEvent, true)}>Publish now</button>}{id && typeof factory.slug === "string" && <Link className="admin-secondary" href={`/factories/${factory.slug}`} target="_blank">Preview public page</Link>}</div>
  </form>;
}
