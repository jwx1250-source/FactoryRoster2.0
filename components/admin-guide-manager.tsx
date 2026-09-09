"use client";

import { FormEvent, useState } from "react";
import AdminResourceTable from "@/components/admin-resource-table";

export type GuideInput = { slug: string; title: string; topic: string; summary: string; content: string; read_time: number; seo_title: string; seo_description: string; is_published: boolean; published_at: string | null };
const emptyGuide: GuideInput = { slug: "", title: "", topic: "", summary: "", content: "", read_time: 5, seo_title: "", seo_description: "", is_published: false, published_at: null };

export default function AdminGuideManager({ initialGuide, guideId }: { initialGuide?: GuideInput; guideId?: string }) {
  const [guide, setGuide] = useState(initialGuide ?? emptyGuide);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    const payload = { ...guide, published_at: guide.is_published ? guide.published_at || new Date().toISOString() : null };
    const response = await fetch(guideId ? `/api/admin/guides/${guideId}` : "/api/admin/guides", { method: guideId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) return setError(body.error || "Unable to save guide");
    if (!guideId) setGuide(emptyGuide);
    setNotice(guideId ? "Guide updated." : "Guide created. Refresh the list to see it.");
  }
  return <><form className="admin-form" onSubmit={submit}><section className="admin-form-section"><h2>{guideId ? "Edit guide" : "Create guide"}</h2><div className="admin-fields">
    {(["title", "slug", "topic", "seo_title"] as const).map((key) => <label className="admin-field" key={key}>{key.replaceAll("_", " ")}<input required={key !== "seo_title"} value={guide[key]} onChange={(event) => setGuide((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
    <label className="admin-field full">Summary<textarea required value={guide.summary} onChange={(event) => setGuide((current) => ({ ...current, summary: event.target.value }))} /></label>
    <label className="admin-field full">Content<textarea required value={guide.content} onChange={(event) => setGuide((current) => ({ ...current, content: event.target.value }))} /></label>
    <label className="admin-field full">SEO description<textarea value={guide.seo_description} onChange={(event) => setGuide((current) => ({ ...current, seo_description: event.target.value }))} /></label>
    <label className="admin-field">Read time (minutes)<input min="1" type="number" value={guide.read_time} onChange={(event) => setGuide((current) => ({ ...current, read_time: Number(event.target.value) }))} /></label>
    <label className="admin-field">Publication<select value={guide.is_published ? "yes" : "no"} onChange={(event) => setGuide((current) => ({ ...current, is_published: event.target.value === "yes" }))}><option value="no">Draft</option><option value="yes">Published</option></select></label>
  </div></section>{error && <p className="admin-error">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}<div className="admin-actions"><button className="admin-primary">{guideId ? "Save guide" : "Create guide"}</button>{guideId && guide.is_published && <a className="admin-secondary" href={`/guides/${guide.slug}`} target="_blank">Preview guide</a>}</div></form>{guideId ? null : <AdminResourceTable resource="guides" />}</>;
}
