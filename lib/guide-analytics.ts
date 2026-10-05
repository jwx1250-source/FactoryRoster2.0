export type GuideCtaEvent = { guide_slug: string; guide_cluster: string; destination: string; position: string };

export function trackGuideCtaClick(event: GuideCtaEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("factoryroster:guide-cta-click", { detail: event }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "guide_cta_click", event);
}
