"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function AdminResourceTable({ resource }: { resource: string }) {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/${encodeURIComponent(resource)}?page=${page}&limit=25`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load records");
        setRows(body.data ?? []);
        setTotal(body.total ?? 0);
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load records");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, resource]);

  const changePage = (nextPage: number) => {
    setLoading(true);
    setError("");
    setPage(nextPage);
  };

  const preferredColumns: Record<string, string[]> = {
    contacts: ["contact_person", "position", "verified_phone", "verified_email", "is_active", "last_contact_verified_at"],
    "verification-records": ["verification_type", "status", "verification_method", "verified_at", "factory_id", "updated_at"],
    "verification-requests": ["created_at", "buyer_name", "buyer_email", "company_name", "country", "factory_name", "product_category", "request_type", "status"],
    "contact-messages": ["created_at", "name", "work_email", "company", "inquiry_type", "status"],
    guides: ["title", "slug", "topic", "read_time", "is_published", "published_at", "updated_at"],
  };
  const columns = rows.length ? (preferredColumns[resource] ?? Object.keys(rows[0]).slice(0, 7)).filter((column) => column in rows[0]) : [];
  const workflow = resource === "verification-requests" || resource === "contact-messages";

  async function updateRow(row: Record<string, unknown>, patch: Record<string, unknown>) {
    const id = String(row.id); setSavingId(id); setError("");
    const response = await fetch(`/api/admin/${resource}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const body = await response.json();
    if (!response.ok) setError(body.error || "Unable to update record");
    else setRows((current) => current.map((item) => item.id === row.id ? { ...item, ...body.data } : item));
    setSavingId("");
  }

  async function deleteRow(row: Record<string, unknown>) {
    if (!window.confirm("Delete this record permanently?")) return;
    const response = await fetch(`/api/admin/${resource}/${row.id}`, { method: "DELETE" });
    if (response.ok) { setRows((current) => current.filter((item) => item.id !== row.id)); setTotal((current) => current - 1); }
    else setError((await response.json()).error || "Unable to delete record");
  }

  if (loading) return <p style={{ marginTop: 24, color: "#6B7280" }}>Loading records…</p>;
  if (error) return <p role="alert" style={{ marginTop: 24, padding: 14, borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C" }}>{error}</p>;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "#6B7280", fontSize: 13 }}>
        <span>{total} record(s)</span>
        <span>Page {page}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: 24, border: "1px solid #E5E7EB", borderRadius: 10, background: "#fff", color: "#6B7280" }}>No records yet.</div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #E5E7EB", borderRadius: 10, background: "#fff" }}>
          <table className="admin-table">
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}<th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? row.event_id ?? index)}>
                  {columns.map((column) => <td key={column} title={displayValue(row[column])}>{column === "status" && workflow ? <select value={String(row.status)} disabled={savingId === row.id} onChange={(event) => updateRow(row, { status: event.target.value })}>{(resource === "contact-messages" ? ["new", "replied", "archived"] : ["new", "reviewed", "in_progress", "completed", "archived"]).map((value) => <option key={value}>{value}</option>)}</select> : displayValue(row[column])}</td>)}
                  <td><div className="admin-actions">{typeof row.factory_id === "string" && <Link href={`/admin/factories/${row.factory_id}`}>Supplier</Link>}{workflow && <button className="admin-secondary" type="button" onClick={() => window.alert(JSON.stringify(row, null, 2))}>View</button>}{workflow && <button className="admin-secondary" type="button" onClick={() => updateRow(row, { internal_note: window.prompt("Internal note", String(row.internal_note ?? "")) ?? row.internal_note })}>Note</button>}{resource === "guides" && <Link href={`/admin/guides/${row.id}`}>Edit</Link>}{(resource === "contacts" || resource === "guides") && <button className="admin-danger" type="button" onClick={() => deleteRow(row)}>Delete</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button disabled={page === 1} onClick={() => changePage(page - 1)} style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid #D1D5DB", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer" }}>Previous</button>
        <button disabled={page * 25 >= total} onClick={() => changePage(page + 1)} style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid #D1D5DB", background: "#fff", cursor: page * 25 >= total ? "not-allowed" : "pointer" }}>Next</button>
      </div>
    </div>
  );
}
