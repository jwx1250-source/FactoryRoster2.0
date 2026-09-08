"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardActions() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Link href="/search" style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #D1D5DB", color: "#374151", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
        Search factories
      </Link>
      <button onClick={signOut} disabled={busy} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", color: "#6B7280", fontSize: 13, fontWeight: 600, cursor: busy ? "wait" : "pointer" }}>
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
