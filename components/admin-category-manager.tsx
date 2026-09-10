"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  primary_industry: string;
  secondary_category: string | null;
  description: string;
  product_examples: string[];
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

const emptyForm = { id: "", name: "", slug: "", parent_id: "", description: "", product_examples: "", is_featured: false, sort_order: 0, seo_title: "", seo_description: "" };

function slugify(value: string) {
  return value.toLowerCase().replaceAll("&", "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminCategoryManager() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/industries?limit=100")
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to load categories"); setRows(body.data ?? []); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load categories"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/industries?limit=100", { signal: controller.signal })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to load categories"); setRows(body.data ?? []); })
      .catch((reason) => { if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load categories"); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const primaryIndustries = useMemo(() => rows.filter((row) => !row.parent_id).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)), [rows]);
  const childrenByParent = useMemo(() => new Map(primaryIndustries.map((primary) => [primary.id, rows.filter((row) => row.parent_id === primary.id).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))])), [primaryIndustries, rows]);

  const edit = (row: CategoryRow) => setForm({ id: row.id, name: row.name, slug: row.slug, parent_id: row.parent_id ?? "", description: row.description, product_examples: row.product_examples.join(", "), is_featured: row.is_featured, sort_order: row.sort_order, seo_title: row.seo_title ?? "", seo_description: row.seo_description ?? "" });

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const payload = { name: form.name.trim(), slug: form.slug.trim() || slugify(form.name), parent_id: form.parent_id || null, description: form.description.trim(), product_examples: form.product_examples.split(",").map((item) => item.trim()).filter(Boolean), is_featured: form.parent_id ? false : form.is_featured, sort_order: Number(form.sort_order), seo_title: form.seo_title.trim() || null, seo_description: form.seo_description.trim() || null };
    try {
      const response = await fetch(form.id ? `/api/admin/industries/${form.id}` : "/api/admin/industries", { method: form.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to save category");
      setForm(emptyForm); setNotice(form.id ? "Category updated." : "Category created."); load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save category"); } finally { setSaving(false); }
  }

  return <div style={{ marginTop: 24 }}>
    <form className="admin-form" onSubmit={save}>
      <section className="admin-form-section"><div className="admin-heading"><div><h2>{form.id ? "Edit category" : "Add category"}</h2><p className="admin-section-help">Choose no parent for a Primary Industry, or select one parent for a Secondary Category. A third level is not allowed.</p></div>{form.id && <button type="button" className="admin-secondary" onClick={() => setForm(emptyForm)}>Cancel edit</button>}</div><div className="admin-fields">
        <label className="admin-field"><span className="admin-field-label"><span>Name</span><span className="admin-required">Required</span></span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: current.id ? current.slug : slugify(event.target.value) }))} /></label>
        <label className="admin-field"><span className="admin-field-label"><span>Slug</span><span className="admin-required">Required</span></span><input required value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} /></label>
        <label className="admin-field"><span className="admin-field-label"><span>Parent</span><span className="admin-optional">Optional</span></span><select value={form.parent_id} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value, is_featured: event.target.value ? false : current.is_featured }))}><option value="">None — Primary Industry</option>{primaryIndustries.filter((industry) => industry.id !== form.id).map((industry) => <option key={industry.id} value={industry.id}>{industry.name}</option>)}</select></label>
        <label className="admin-field"><span className="admin-field-label"><span>Sort order</span><span className="admin-required">Required</span></span><input required type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))} /></label>
        <label className="admin-field full"><span className="admin-field-label"><span>Description</span><span className="admin-required">Required</span></span><textarea required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></label>
        <label className="admin-field full"><span className="admin-field-label"><span>Product examples</span><span className="admin-optional">Optional</span></span><input value={form.product_examples} onChange={(event) => setForm((current) => ({ ...current, product_examples: event.target.value }))} placeholder="Comma separated" /></label>
        <label className="admin-field"><span className="admin-field-label"><span>SEO title</span><span className="admin-optional">Optional</span></span><input value={form.seo_title} onChange={(event) => setForm((current) => ({ ...current, seo_title: event.target.value }))} /></label>
        <label className="admin-field"><span className="admin-field-label"><span>SEO description</span><span className="admin-optional">Optional</span></span><input value={form.seo_description} onChange={(event) => setForm((current) => ({ ...current, seo_description: event.target.value }))} /></label>
        {!form.parent_id && <label className="admin-field"><span className="admin-field-label"><span>Featured on public pages</span><span className="admin-required">Required</span></span><select value={form.is_featured ? "yes" : "no"} onChange={(event) => setForm((current) => ({ ...current, is_featured: event.target.value === "yes" }))}><option value="no">No</option><option value="yes">Yes</option></select></label>}
      </div></section>
      {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}
      <button className="admin-primary" disabled={saving}>{saving ? "Saving…" : form.id ? "Update category" : "Create category"}</button>
    </form>
    {loading ? <p className="admin-notice">Loading categories…</p> : <div className="admin-category-groups">{primaryIndustries.map((primary) => <section className="admin-panel" key={primary.id}><div className="admin-heading"><div><h2>{primary.name}</h2><p>{primary.description}</p></div><button className="admin-secondary" onClick={() => edit(primary)}>Edit</button></div><div className="admin-actions">{(childrenByParent.get(primary.id) ?? []).map((category) => <button className="admin-badge" key={category.id} onClick={() => edit(category)}>{category.name}</button>)}</div></section>)}</div>}
  </div>;
}
