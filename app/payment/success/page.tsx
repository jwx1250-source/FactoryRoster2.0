"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function safeReturnPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/credits";
}

export default function PaymentSuccessPage() {
  const [queryReady, setQueryReady] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [returnTo, setReturnTo] = useState("/credits");
  const [state, setState] = useState<"processing" | "success" | "error">("processing");
  const [credits, setCredits] = useState(0);
  const [added, setAdded] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setSessionId(params.get("session_id"));
      setReturnTo(safeReturnPath(params.get("return_to")));
      setQueryReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!queryReady || !sessionId) return;
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      try {
        const response = await fetch(`/api/payment/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to confirm payment");
        if (body.fulfilled) {
          if (!cancelled) { setCredits(body.balance ?? 0); setAdded(body.purchase?.amount ?? 0); setState("success"); }
          return;
        }
        if (attempts++ < 20 && !cancelled) window.setTimeout(poll, 1500);
        else if (!cancelled) setState("error");
      } catch { if (!cancelled) setState("error"); }
    };
    poll();
    return () => { cancelled = true; };
  }, [queryReady, sessionId]);

  const displayState = !queryReady ? "processing" : (sessionId ? state : "error");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F7F8FA", padding: 24 }}>
      <section style={{ maxWidth: 520, width: "100%", padding: 36, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, textAlign: "center" }}>
        {displayState === "processing" && <><h1 style={{ marginBottom: 12 }}>Confirming your payment</h1><p style={{ color: "#6B7280" }}>We are waiting for Stripe to confirm the payment. Credits will not be added until the server receives the verified webhook.</p></>}
        {displayState === "success" && <><h1 style={{ marginBottom: 12 }}>Payment successful</h1><p style={{ color: "#6B7280", marginBottom: 8 }}>{added} Contact Credits added</p><p style={{ color: "#6B7280", marginBottom: 24 }}>Current balance: {credits} Contact Credits</p><Link href={returnTo} style={{ display: "inline-block", padding: "10px 18px", borderRadius: 8, background: "#1E40AF", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Return to manufacturer</Link></>}
        {displayState === "error" && <><h1 style={{ marginBottom: 12 }}>Payment is still processing</h1><p style={{ color: "#6B7280", marginBottom: 24 }}>We could not confirm the webhook yet. Please check Credits again shortly; do not purchase again unless the payment failed in Stripe.</p><Link href="/credits" style={{ color: "#1E40AF" }}>Open Credits</Link></>}
      </section>
    </main>
  );
}
