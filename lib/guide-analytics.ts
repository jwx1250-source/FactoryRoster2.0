export type GuideCtaEvent = { guide_slug: string; guide_cluster: string; destination: string; position: string };

export function trackGuideCtaClick(event: GuideCtaEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("factoryroster:guide-cta-click", { detail: event }));
  void fetch("/api/growth/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event_name: "guide_cta_click",
      path: window.location.pathname,
      source_guide_slug: event.guide_slug,
      entity_type: "guide",
      entity_id: event.guide_slug,
      properties: { guide_cluster: event.guide_cluster, destination: event.destination, position: event.position },
      idempotency_key: `guide_cta_click:${event.guide_slug}:${event.destination}:${event.position}:${Date.now()}`,
    }),
    keepalive: true,
  }).catch(() => undefined);
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "guide_cta_click", event);
}
