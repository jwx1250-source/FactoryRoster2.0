"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const fieldStyle = {
  width: "100%",
  marginTop: 6,
  padding: "11px 13px",
  borderRadius: 8,
  border: "1.5px solid #E9ECF1",
  fontSize: 14,
  color: "#0D1117",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 430 }}>
        <Link href="/" style={{ display: "block", color: "#0D1117", fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", textAlign: "center", textDecoration: "none", marginBottom: 28 }}>
          FactoryRoster
        </Link>
        <section style={{ background: "#fff", border: "1px solid #E9ECF1", borderRadius: 14, padding: "36px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#0D1117", textAlign: "center", margin: "0 0 8px" }}>{title}</h1>
          <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, textAlign: "center", margin: "0 0 26px" }}>{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}

export function RequestPasswordResetForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to send password reset email");
      setMessage(body.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send password reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Reset your password" description="Enter your account email and we’ll send a secure password reset link.">
      <form onSubmit={submit}>
        <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600 }}>
          Email
          <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={fieldStyle} />
        </label>
        {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 13, lineHeight: 1.5, margin: "14px 0 0" }}>{error}</p>}
        {message && <p role="status" style={{ color: "#166534", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, fontSize: 13, lineHeight: 1.5, padding: 12, margin: "14px 0 0" }}>{message}</p>}
        <button type="submit" disabled={busy || !email} style={{ width: "100%", padding: "11px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || !email ? 0.6 : 1, marginTop: 18 }}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", margin: "20px 0 0" }}><Link href="/sign-in" style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>Back to sign in</Link></p>
    </AuthShell>
  );
}

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    async function checkRecoverySession() {
      const result = await supabase.auth.getUser();
      if (!active) return;
      setHasSession(Boolean(result.data.user));
      setChecking(false);
    }
    void checkRecoverySession();
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must contain at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setComplete(true);
      setPassword("");
      setConfirmPassword("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Choose a new password" description="Use at least 8 characters. Your password is submitted directly to Supabase Auth.">
      {checking ? <p style={{ color: "#6B7280", fontSize: 14, textAlign: "center" }}>Checking your recovery link…</p> : !hasSession ? (
        <div>
          <p role="alert" style={{ color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 13, lineHeight: 1.5, padding: 12 }}>This recovery link is invalid or has expired. Request a new link to continue.</p>
          <Link href="/forgot-password" style={{ display: "block", textAlign: "center", color: "#1E40AF", fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 18 }}>Request another link</Link>
        </div>
      ) : complete ? (
        <div>
          <p role="status" style={{ color: "#166534", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, fontSize: 13, lineHeight: 1.5, padding: 12 }}>Your password has been updated successfully.</p>
          <Link href="/dashboard" style={{ display: "block", textAlign: "center", color: "#1E40AF", fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 18 }}>Continue to dashboard</Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600 }}>
            New password
            <input autoComplete="new-password" type="password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} />
          </label>
          <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600, marginTop: 14 }}>
            Confirm new password
            <input autoComplete="new-password" type="password" minLength={8} maxLength={128} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={fieldStyle} />
          </label>
          {error && <p role="alert" style={{ color: "#B91C1C", fontSize: 13, lineHeight: 1.5, margin: "14px 0 0" }}>{error}</p>}
          <button type="submit" disabled={busy || password.length < 8 || confirmPassword.length < 8} style={{ width: "100%", padding: "11px 0", borderRadius: 8, background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: busy ? "wait" : "pointer", opacity: busy || password.length < 8 || confirmPassword.length < 8 ? 0.6 : 1, marginTop: 18 }}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
