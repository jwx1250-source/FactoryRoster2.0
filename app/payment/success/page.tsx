"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function safeReturnPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/credits";
}

function BrandMark() {
  return <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#0D1117", fontWeight: 800, fontSize: 18, letterSpacing: "-0.7px" }}><span style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 15 }}>✓</span>FactoryRoster</div>;
}

function CheckCircle() {
  return <div style={{ width: 68, height: 68, display: "grid", placeItems: "center", borderRadius: "50%", background: "#ECFDF5", border: "8px solid #F0FDF4", color: "#059669", fontSize: 30, fontWeight: 700 }}>✓</div>;
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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#F7F9FC 0%,#EFF4FF 100%)", padding: "28px 20px 56px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 52 }}><BrandMark /><span style={{ fontSize: 12, color: "#64748B" }}>Secure credit purchase</span></div>
        <section style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, boxShadow: "0 20px 60px rgba(30,64,175,.10)", overflow: "hidden" }}>
          <div style={{ height: 6, background: "linear-gradient(90deg,#1E40AF,#60A5FA)" }} />
          <div style={{ padding: "44px 44px 40px", textAlign: "center" }}>
            {displayState === "processing" && <><div style={{ width: 68, height: 68, margin: "0 auto 24px", display: "grid", placeItems: "center", borderRadius: "50%", background: "#EFF6FF", color: "#1E40AF", fontSize: 26 }}>↻</div><p style={{ margin: "0 0 8px", color: "#64748B", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Payment confirmation</p><h1 style={{ margin: "0 0 14px", color: "#0F172A", fontSize: 30, letterSpacing: "-1px" }}>Confirming your payment</h1><p style={{ margin: 0, color: "#64748B", lineHeight: 1.7 }}>We are waiting for Stripe to confirm your payment. Credits will be added as soon as the verified webhook arrives.</p></>}
            {displayState === "success" && <><div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><CheckCircle /></div><p style={{ margin: "0 0 8px", color: "#059669", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Payment confirmed</p><h1 style={{ margin: "0 0 28px", color: "#0F172A", fontSize: 32, letterSpacing: "-1px" }}>Your credits are ready</h1><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, textAlign: "left", marginBottom: 30 }}><div style={{ padding: "18px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}><p style={{ margin: "0 0 7px", color: "#64748B", fontSize: 12 }}>Added to your account</p><strong style={{ color: "#0F172A", fontSize: 21 }}>{added} <span style={{ fontSize: 13, fontWeight: 600 }}>credits</span></strong></div><div style={{ padding: "18px 16px", borderRadius: 12, background: "#EFF6FF", border: "1px solid #BFDBFE" }}><p style={{ margin: "0 0 7px", color: "#1D4ED8", fontSize: 12 }}>Available balance</p><strong style={{ color: "#1E40AF", fontSize: 21 }}>{credits} <span style={{ fontSize: 13, fontWeight: 600 }}>credits</span></strong></div></div><p style={{ margin: "0 0 24px", color: "#64748B", fontSize: 13.5, lineHeight: 1.6 }}>Use one Contact Credit to unlock a verified supplier contact. Your access remains available in your account.</p><div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}><Link href={returnTo} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 190, padding: "12px 18px", borderRadius: 9, background: "#1E40AF", color: "#fff", textDecoration: "none", fontWeight: 700 }}>Return to supplier</Link><Link href="/credits" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 18px", borderRadius: 9, border: "1px solid #CBD5E1", color: "#334155", textDecoration: "none", fontWeight: 600 }}>View credit history</Link></div></>}
            {displayState === "error" && <><div style={{ width: 68, height: 68, margin: "0 auto 24px", display: "grid", placeItems: "center", borderRadius: "50%", background: "#FFF7ED", color: "#C2410C", fontSize: 28 }}>!</div><p style={{ margin: "0 0 8px", color: "#C2410C", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Payment confirmation pending</p><h1 style={{ margin: "0 0 14px", color: "#0F172A", fontSize: 28, letterSpacing: "-0.8px" }}>Payment is still processing</h1><p style={{ margin: "0 auto 24px", maxWidth: 430, color: "#64748B", lineHeight: 1.7 }}>We could not confirm the webhook yet. Check Credits again shortly; do not purchase again unless Stripe shows the payment failed.</p><Link href="/credits" style={{ display: "inline-flex", padding: "12px 22px", borderRadius: 9, background: "#1E40AF", color: "#fff", textDecoration: "none", fontWeight: 700 }}>Open credit history</Link></>}
          </div>
          {displayState === "success" && <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", textAlign: "center", color: "#94A3B8", fontSize: 12 }}>FactoryRoster · Verified supplier intelligence for global buyers</div>}
        </section>
      </div>
    </main>
  );
}
