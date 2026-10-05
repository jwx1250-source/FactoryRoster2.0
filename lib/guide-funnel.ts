import type { GuideClusterId } from "./guides";

export type GuideCtaDestination = "search" | "verification" | "industries" | "pricing" | "guide";

export type GuideCta = { label: string; destination: GuideCtaDestination; href?: string };

export const guideCtaConfig: Record<GuideClusterId, { primary: GuideCta; secondary: GuideCta }> = {
  discovery: { primary: { label: "Search verified suppliers", destination: "search" }, secondary: { label: "Browse industries", destination: "industries" } },
  verification: { primary: { label: "Search verified suppliers", destination: "search" }, secondary: { label: "See how verification works", destination: "verification" } },
  "supplier-types": { primary: { label: "Compare supplier types", destination: "search" }, secondary: { label: "Browse industries", destination: "industries" } },
  communication: { primary: { label: "Find suppliers to contact", destination: "search" }, secondary: { label: "Review verification", destination: "verification" } },
  commercial: { primary: { label: "Compare supplier options", destination: "search" }, secondary: { label: "View contact pricing", destination: "pricing" } },
  quality: { primary: { label: "Find verified suppliers", destination: "search" }, secondary: { label: "See verification checks", destination: "verification" } },
  shipping: { primary: { label: "Search export-ready suppliers", destination: "search" }, secondary: { label: "Browse industries", destination: "industries" } },
  locations: { primary: { label: "Browse suppliers by industry", destination: "industries" }, secondary: { label: "Search verified suppliers", destination: "search" } },
};

export function getGuidePrimaryCta(clusterId: GuideClusterId) {
  return guideCtaConfig[clusterId].primary;
}

export function getGuideCtaHref(destination: GuideCtaDestination, slug: string) {
  if (destination === "search") return `/search?source=guide&guide=${encodeURIComponent(slug)}`;
  if (destination === "guide") return `/guides/${slug}`;
  return `/${destination}`;
}
