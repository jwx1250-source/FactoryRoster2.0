"use client";

import { useEffect, useState } from "react";

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

  const columns = rows.length ? Object.keys(rows[0]).slice(0, 7) : [];

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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {columns.map((column) => <th key={column} style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", textTransform: "uppercase", letterSpacing: ".04em" }}>{column.replaceAll("_", " ")}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? row.event_id ?? index)}>
                  {columns.map((column) => <td key={column} title={displayValue(row[column])} style={{ padding: "10px 12px", borderBottom: "1px solid #F3F4F6", color: "#374151", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayValue(row[column])}</td>)}
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
