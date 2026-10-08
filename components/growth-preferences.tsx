"use client";

import { useEffect, useState } from "react";

type Preferences = { marketing_email_enabled: boolean; supplier_alerts_enabled: boolean; frequency: "immediate" | "weekly" | "off" };

export default function GrowthPreferences() {
  const [value, setValue] = useState<Preferences>({ marketing_email_enabled: true, supplier_alerts_enabled: true, frequency: "weekly" });
  const [notice, setNotice] = useState("");
  useEffect(() => { void fetch("/api/notification-preferences", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((body) => body?.data && setValue(body.data)).catch(() => undefined); }, []);
  async function save(next: Preferences) {
    setValue(next);
    const response = await fetch("/api/notification-preferences", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(next) });
    setNotice(response.ok ? "Preferences saved." : "Unable to save preferences.");
    window.setTimeout(() => setNotice(""), 2500);
  }
  return <section style={{ marginTop: 16, padding: 24, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12 }}><h2>Notifications</h2><p style={{ color: "#6B7280", marginTop: 6 }}>Control supplier alerts and educational email. Transactional payment and security emails are always sent.</p><label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16 }}><input type="checkbox" checked={value.marketing_email_enabled} onChange={(e) => void save({ ...value, marketing_email_enabled: e.target.checked })} /> Product and sourcing education</label><label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}><input type="checkbox" checked={value.supplier_alerts_enabled} onChange={(e) => void save({ ...value, supplier_alerts_enabled: e.target.checked })} /> New supplier alerts for saved searches</label><label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>Alert frequency<select value={value.frequency} onChange={(e) => void save({ ...value, frequency: e.target.value as Preferences["frequency"] })} style={{ padding: "6px 8px", border: "1px solid #D1D5DB", borderRadius: 6 }}><option value="immediate">Immediate</option><option value="weekly">Weekly digest</option><option value="off">Off</option></select></label>{notice && <p style={{ color: "#047857", marginTop: 10 }}>{notice}</p>}</section>;
}
