"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { EVIDENCE_BY_SUPPLIER_TYPE, MOQ_LEVELS, SUPPLIER_TYPES, SUPPLIER_TYPE_LABELS, SUPPLY_EVIDENCE_LABELS, SUPPLY_MODELS, type SupplierType } from "@/lib/domain/rules";

type Row = Record<string, unknown>;
type Verification = Row & { id?: string; verification_type: string; status: string; checked_items?: Record<string, boolean> };
const arrayFields = new Set(["main_products", "capabilities", "export_markets", "certifications", "trade_terms"]);
const labels: Record<string, string> = { government_registration: "Government Registration", business_contact: "Business Contact", supply_evidence: "Supply Evidence", factory_evidence: "Factory Evidence" };
const provinceSuggestions = ["Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"];
const citySuggestions: Record<string, string[]> = {
  Fujian: ["Fuzhou", "Quanzhou", "Xiamen", "Zhangzhou"],
  Guangdong: ["Dongguan", "Foshan", "Guangzhou", "Huizhou", "Jiangmen", "Shantou", "Shenzhen", "Zhongshan", "Zhuhai"],
  Hebei: ["Baoding", "Cangzhou", "Langfang", "Shijiazhuang", "Tangshan"],
  Henan: ["Luoyang", "Nanyang", "Xuchang", "Zhengzhou"],
  Hubei: ["Huangshi", "Shiyan", "Wuhan", "Xiangyang"],
  Hunan: ["Changsha", "Hengyang", "Zhuzhou"],
  Jiangsu: ["Changzhou", "Kunshan", "Nanjing", "Nantong", "Suzhou", "Wuxi", "Yangzhou"],
  Shandong: ["Jinan", "Linyi", "Qingdao", "Weifang", "Yantai"],
  Sichuan: ["Chengdu", "Deyang", "Mianyang"],
  Zhejiang: ["Hangzhou", "Jinhua", "Ningbo", "Shaoxing", "Taizhou", "Wenzhou", "Yiwu"],
};
const fieldSuggestions: Record<string, string[]> = {
  province: provinceSuggestions,
  factory_type: ["Manufacturer", "OEM Manufacturer", "ODM Manufacturer", "OEM & ODM Manufacturer", "Contract Manufacturer", "Assembly Factory", "Processor", "Trading & Manufacturing Company"],
  employee_range: ["1–49", "50–99", "100–199", "200–299", "300–499", "500–999", "1,000+"],
  factory_size: ["Under 1,000 m²", "1,000–4,999 m²", "5,000–9,999 m²", "10,000–24,999 m²", "25,000–49,999 m²", "50,000+ m²"],
  annual_revenue_range: ["Under US$1M", "US$1–5M", "US$5–10M", "US$10–25M", "US$25–50M", "US$50–100M", "US$100M+"],
};
const sections = [
  ["Identity", [["company_name", "Company name", "text", true], ["chinese_name", "Chinese name", "text", false], ["factory_type", "Manufacturing subtype (manufacturers only)", "text", false]]],
  ["Location", [["province", "Province", "text", true], ["city", "City", "text", true], ["district", "District", "text", false], ["address_public", "Public address", "text", false]]],
  ["Business profile", [["established_year", "Established year", "number", false], ["employee_range", "Employee range", "text", false], ["factory_size", "Factory size", "text", false], ["annual_revenue_range", "Annual revenue range", "text", false], ["website_url", "Website", "url", false], ["moq", "MOQ", "text", false]]],
  ["Products and capabilities", [["main_products", "Main products (comma separated)", "text", false], ["capabilities", "Capabilities (comma separated)", "text", false], ["export_markets", "Export markets (comma separated)", "text", false], ["certifications", "Certifications (comma separated)", "text", false], ["trade_terms", "Trade terms (comma separated)", "text", false], ["overview", "Public overview", "textarea", false]]],
  ["SEO", [["seo_title", "SEO title", "text", false], ["seo_description", "SEO description", "textarea", false]]],
  ["Internal notes", [["source_notes", "Source notes", "textarea", false], ["internal_notes", "Internal notes", "textarea", false]]],
] as const;
function display(value: unknown) { return Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value); }
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) { return <span className="admin-field-label"><span>{label}</span><span className={required ? "admin-required" : "admin-optional"}>{required ? "Required" : "Optional"}</span></span>; }
function suggestionsFor(key: string, factory: Row) {
  if (key === "city") return citySuggestions[display(factory.province)] ?? Array.from(new Set(Object.values(citySuggestions).flat())).sort();
  return fieldSuggestions[key] ?? [];
}

export default function AdminFactoryForm({ initialFactory = {}, initialVerifications = [], initialContact = null, industries = [] }: { initialFactory?: Row; initialVerifications?: Verification[]; initialContact?: Row | null; industries?: { id: string; name: string }[] }) {
  const router = useRouter();
  const [factory, setFactory] = useState<Row>({ is_published: false, is_indexable: false, supplier_type: "manufacturer", supply_evidence_type: "factory_evidence", moq_level: "unknown", supply_model: "factory_direct", supports_small_orders: false, supports_sample_orders: false, supports_private_label: false, ...initialFactory });
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
      const result = await fetch(`/api/admin/verification-records/${record.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: record.status, checked_items: record.checked_items, verification_method: record.verification_method || null, evidence_note: record.evidence_note || null, evidence_references: String(record.evidence_references ?? "").split(",").map((item) => item.trim()).filter(Boolean), internal_note: record.internal_note || null }) });
      if (!result.ok) throw new Error((await result.json()).error || "Unable to save verification");
    }));
    const contactPayload = Object.fromEntries(Object.entries(contact).filter(([key, value]) => !["id", "created_at", "updated_at", "is_locked", "last_contact_verified_at"].includes(key) && value !== ""));
    if (Object.keys(contactPayload).length > 1) {
      const result = await fetch(contact.id ? `/api/admin/contacts/${contact.id}` : "/api/admin/contacts", { method: contact.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contact.id ? contactPayload : { ...contactPayload, factory_id: factoryId }) });
      if (!result.ok) throw new Error((await result.json()).error || "Unable to save contact");
    }
  }

  async function save(event: FormEvent, publish = false) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const wantsPublish = publish || factory.is_published === true;
    const classificationChanged = Boolean(id) && (factory.supplier_type !== initialFactory.supplier_type || factory.supply_evidence_type !== initialFactory.supply_evidence_type);
    const payloadSource: Row = { ...factory, is_published: wantsPublish };
    const payload = Object.fromEntries(Object.entries(payloadSource).filter(([key]) => !["id", "slug", "record_id", "created_at", "updated_at", "has_verified_contact", "last_verified_at"].includes(key)).map(([key, value]) => [key, arrayFields.has(key) ? String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean) : key === "established_year" ? (value ? Number(value) : null) : value === "" ? null : value]));
    try {
      if (wantsPublish && classificationChanged) throw new Error("Save the supplier classification first. Its Supply Evidence check will reset to Pending and must be verified again before publication.");
      if (id && wantsPublish) await saveRelated(id);
      const response = await fetch(id ? `/api/admin/factories/${id}` : "/api/admin/factories", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json(); if (!response.ok) throw new Error([body.error, body.detail].filter(Boolean).join(" "));
      const savedId = body.data.id as string;
      if (id && !wantsPublish) await saveRelated(savedId);
      setNotice(wantsPublish ? "Supplier published." : "Draft saved.");
      if (!id) router.replace(`/admin/factories/${savedId}`); else router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save supplier"); } finally { setSaving(false); }
  }

  return <form className="admin-form" onSubmit={(event) => save(event)}>
    <p className="admin-form-help"><span className="admin-required">Required</span> fields are needed to save a supplier. All other fields can be completed later.</p>
    {id && <section className="admin-form-section"><h2>System details</h2><p className="admin-section-help">Generated automatically and protected from manual changes.</p><div className="admin-fields"><label className="admin-field"><span className="admin-field-label"><span>Record ID</span><span className="admin-automatic">Automatic</span></span><input readOnly value={display(factory.record_id)} /></label><label className="admin-field"><span className="admin-field-label"><span>Public URL</span><span className="admin-automatic">Automatic</span></span><input readOnly value={factory.slug ? `/factories/${display(factory.slug)}` : ""} /></label></div></section>}
    <section className="admin-form-section"><h2>Supplier classification</h2><p className="admin-section-help">The evidence choice is restricted to evidence appropriate for the selected supplier type.</p><div className="admin-fields">
      <label className="admin-field"><FieldLabel label="Supplier type" required /><select required value={display(factory.supplier_type)} onChange={(event) => { const supplierType = event.target.value as SupplierType; setFactory((current) => ({ ...current, supplier_type: supplierType, supply_evidence_type: EVIDENCE_BY_SUPPLIER_TYPE[supplierType][0] })); }}><option value="">Select supplier type</option>{SUPPLIER_TYPES.map((value) => <option value={value} key={value}>{SUPPLIER_TYPE_LABELS[value].replace("Verified ", "")}</option>)}</select></label>
      <label className="admin-field"><FieldLabel label="Supply evidence type" required /><select required value={display(factory.supply_evidence_type)} onChange={(event) => setFactory((current) => ({ ...current, supply_evidence_type: event.target.value }))}>{EVIDENCE_BY_SUPPLIER_TYPE[display(factory.supplier_type) as SupplierType]?.map((value) => <option value={value} key={value}>{SUPPLY_EVIDENCE_LABELS[value]}</option>)}</select></label>
      <label className="admin-field"><FieldLabel label="MOQ fit" required /><select required value={display(factory.moq_level)} onChange={(event) => setFactory((current) => ({ ...current, moq_level: event.target.value }))}>{MOQ_LEVELS.map((value) => <option value={value} key={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
      <label className="admin-field"><FieldLabel label="Supply model" required /><select required value={display(factory.supply_model)} onChange={(event) => setFactory((current) => ({ ...current, supply_model: event.target.value }))}>{SUPPLY_MODELS.map((value) => <option value={value} key={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
      {[["supports_small_orders", "Small batch friendly"], ["supports_sample_orders", "Sample order supported"], ["supports_private_label", "Private label support"]].map(([key, label]) => <label className="admin-field" key={key}><FieldLabel label={label} required /><select value={factory[key] ? "yes" : "no"} onChange={(event) => setFactory((current) => ({ ...current, [key]: event.target.value === "yes" }))}><option value="no">No</option><option value="yes">Yes</option></select></label>)}
    </div></section>
    {sections.map(([title, fields]) => <section className="admin-form-section" key={title}><h2>{title}</h2><div className="admin-fields">{fields.map(([key, label, type, required]) => {
      const suggestions = suggestionsFor(key, factory);
      const listId = suggestions.length ? `${key}-suggestions` : undefined;
      return <label className={`admin-field ${type === "textarea" ? "full" : ""}`} key={key}><FieldLabel label={label} required={required} />{type === "textarea" ? <textarea required={required} value={display(factory[key])} onChange={(event) => setFactory((current) => ({ ...current, [key]: event.target.value }))} /> : <><input list={listId} type={type} required={required} value={display(factory[key])} onChange={(event) => setFactory((current) => ({ ...current, [key]: event.target.value }))} />{listId && <><datalist id={listId}>{suggestions.map((suggestion) => <option value={suggestion} key={suggestion} />)}</datalist><span className="admin-field-hint">Choose a suggestion or type a custom value.</span></>}</>}</label>;
    })}</div>{title === "Identity" && <label className="admin-field" style={{ marginTop: 14 }}><FieldLabel label="Industry" required /><select required value={display(factory.industry_id)} onChange={(event) => setFactory((current) => ({ ...current, industry_id: event.target.value || null }))}><option value="">Select an industry</option>{industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}</select></label>}</section>)}
    <section className="admin-form-section"><h2>Publication</h2><div className="admin-fields"><label className="admin-field"><FieldLabel label="Visibility" required /><select value={factory.is_published ? "published" : "draft"} onChange={(event) => setFactory((current) => ({ ...current, is_published: event.target.value === "published" }))}><option value="draft">Draft — private</option><option value="published">Published — requires all checks</option></select></label><label className="admin-field"><FieldLabel label="Search engine indexing" required /><select value={factory.is_indexable ? "yes" : "no"} onChange={(event) => setFactory((current) => ({ ...current, is_indexable: event.target.value === "yes" }))}><option value="no">No</option><option value="yes">Yes</option></select></label></div></section>
    {id && <section className="admin-form-section"><h2>Verification checks</h2><p className="admin-section-help">Verification timestamps, verifier identity, and the supplier last verified date are recorded automatically. Method and evidence notes are required before a check can be marked verified.</p>{checks.map((record, index) => { const checkLabel = record.verification_type === "supply_evidence" ? SUPPLY_EVIDENCE_LABELS[display(factory.supply_evidence_type) as keyof typeof SUPPLY_EVIDENCE_LABELS] ?? "Supply Evidence" : labels[record.verification_type] ?? record.verification_type; const verified = record.status === "verified"; return <div className="admin-panel" key={record.verification_type}><h2>{checkLabel}</h2><div className="admin-fields"><label className="admin-field"><FieldLabel label="Status" required /><select value={record.status} onChange={(event) => updateCheck(index, "status", event.target.value)}><option value="pending">Pending</option><option value="verified">Verified</option><option value="failed">Failed</option></select></label><label className="admin-field"><FieldLabel label="Verification method" required={verified} /><input required={verified} value={display(record.verification_method)} onChange={(event) => updateCheck(index, "verification_method", event.target.value)} /></label><label className="admin-field"><span className="admin-field-label"><span>Verified at</span><span className="admin-automatic">Automatic</span></span><input readOnly value={record.verified_at ? new Date(String(record.verified_at)).toLocaleString() : "Recorded when status becomes verified"} /></label><label className="admin-field full"><FieldLabel label="Checked items" /><div className="admin-actions">{Object.entries(record.checked_items ?? {}).map(([key, checked]) => <label key={key}><input type="checkbox" checked={checked} onChange={(event) => updateCheck(index, "checked_items", { ...record.checked_items, [key]: event.target.checked })} /> {key.replaceAll("_", " ")}</label>)}</div></label><label className="admin-field"><FieldLabel label="Evidence notes" required={verified} /><textarea required={verified} value={display(record.evidence_note)} onChange={(event) => updateCheck(index, "evidence_note", event.target.value)} /></label><label className="admin-field"><FieldLabel label="Evidence links (comma separated)" /><textarea value={display(record.evidence_references)} onChange={(event) => updateCheck(index, "evidence_references", event.target.value)} /></label><label className="admin-field"><FieldLabel label="Internal note" /><textarea value={display(record.internal_note)} onChange={(event) => updateCheck(index, "internal_note", event.target.value)} /></label></div></div>; })}</section>}
    {id && <section className="admin-form-section"><h2>Verified contact</h2><p className="admin-section-help">Contact records stay locked from public access. Verification time is recorded automatically when contact details change.</p><div className="admin-fields">{[["contact_person","Contact person"],["position","Position"],["verified_phone","Verified phone"],["verified_email","Verified email"],["whatsapp","WhatsApp"],["wechat","WeChat"],["contact_verification_method","Verification method"],["internal_notes","Internal notes"]].map(([key,label]) => <label className="admin-field" key={key}><FieldLabel label={label} /><input value={display(contact[key])} onChange={(event) => setContact((current) => ({ ...current, [key]: event.target.value }))} /></label>)}<label className="admin-field"><FieldLabel label="Active" required /><select value={contact.is_active === false ? "no" : "yes"} onChange={(event) => setContact((current) => ({ ...current, is_active: event.target.value === "yes" }))}><option value="yes">Yes</option><option value="no">No</option></select></label></div></section>}
    {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}
    <div className="admin-form-footer"><button className="admin-primary" disabled={saving} type="submit">{saving ? "Saving…" : "Save draft"}</button>{id && <button className="admin-secondary" disabled={saving} type="button" onClick={(event) => save(event as unknown as FormEvent, true)}>Publish now</button>}{id && typeof factory.slug === "string" && <Link className="admin-secondary" href={`/factories/${factory.slug}`} target="_blank">Preview public page</Link>}</div>
  </form>;
}
