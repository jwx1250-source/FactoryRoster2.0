"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isSearchReferrer(value: string) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return /(google\.|bing\.com|duckduckgo\.com|yahoo\.)/.test(host);
  } catch {
    return false;
  }
}

export default function GrowthTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const sessionKey = "fr_growth_session";
    const sessionId = sessionStorage.getItem(sessionKey) || crypto.randomUUID();
    sessionStorage.setItem(sessionKey, sessionId);
    const referrer = document.referrer || undefined;
    const params = new URLSearchParams(window.location.search);
    const base = {
      path: `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      referrer,
      session_id: sessionId,
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    };
    const events: Array<{ event_name: "organic_landing" | "supplier_search" | "supplier_profile_view"; properties?: Record<string, unknown>; entity_type?: string; entity_id?: string }> = [];
    if (isSearchReferrer(referrer || "")) events.push({ event_name: "organic_landing" });
    if (pathname === "/search") events.push({ event_name: "supplier_search", properties: { query: params.get("q") || "" } });
    if (pathname.startsWith("/factories/")) events.push({ event_name: "supplier_profile_view", entity_type: "supplier", entity_id: pathname.split("/")[2] });
    for (const event of events) {
      void fetch("/api/growth/events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...base, ...event, idempotency_key: `${event.event_name}:${sessionId}:${base.path}` }), keepalive: true }).catch(() => undefined);
    }
  }, [pathname]);
  return null;
}
