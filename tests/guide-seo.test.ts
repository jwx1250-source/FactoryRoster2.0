import { describe, expect, it } from "vitest";
import { guideClusters, guideRoadmap, publishedBuiltInGuides } from "../lib/guides";
import { guideCtaConfig, getGuideCtaHref } from "../lib/guide-funnel";
import { guideDistributionPacks, guideDistributionUrl } from "../lib/guide-distribution";
import { industryGuideLinks } from "../lib/guide-links";

const publishedSlugs = new Set(publishedBuiltInGuides.map((guide) => guide.slug));

describe("guide SEO and indexing contract", () => {
  it("keeps published guide metadata unique and dates valid", () => {
    expect(new Set(publishedBuiltInGuides.map((guide) => guide.slug)).size).toBe(publishedBuiltInGuides.length);
    expect(new Set(publishedBuiltInGuides.map((guide) => guide.seoTitle)).size).toBe(publishedBuiltInGuides.length);
    for (const guide of publishedBuiltInGuides) {
      expect(guide.seoTitle.length).toBeGreaterThan(10);
      expect(guide.seoDescription.length).toBeGreaterThan(40);
      expect(Date.parse(guide.publishedAt)).toBeLessThanOrEqual(Date.now());
    }
  });

  it("keeps planned guides out of the published index contract", () => {
    expect(publishedBuiltInGuides.every((guide) => guideRoadmap.find((item) => item.slug === guide.slug)?.status !== "planned")).toBe(true);
  });

  it("defines absolute canonical, article image, and breadcrumb sources", async () => {
    const fs = await import("node:fs/promises");
    const page = await fs.readFile("app/guides/[guideSlug]/page.tsx", "utf8");
    const sitemap = await fs.readFile("app/sitemap.ts", "utf8");
    const breadcrumbs = await fs.readFile("components/seo-navigation.tsx", "utf8");
    expect(page).toContain("alternates: { canonical: `${siteUrl}/guides/${guide.slug}` }");
    expect(page).toContain("summary_large_image");
    expect(page).toContain("opengraph-image");
    expect(page).toContain("application/ld+json");
    expect(breadcrumbs).toContain('item: { "@id": new URL(item.href, siteUrl).toString() }');
    expect(sitemap).toContain("publishedBuiltInGuides");
  });

  it("covers every cluster with an attributable CTA", () => {
    for (const cluster of guideClusters) {
      const cta = guideCtaConfig[cluster.id].primary;
      expect(cta.label.length).toBeGreaterThan(3);
      expect(getGuideCtaHref(cta.destination, "example-guide")).toContain(cta.destination === "search" ? "source=guide" : `/${cta.destination}`);
    }
  });

  it("keeps social packs published, usable, and attributed", () => {
    expect(guideDistributionPacks).toHaveLength(10);
    for (const pack of guideDistributionPacks) {
      expect(publishedSlugs.has(pack.slug)).toBe(true);
      expect(pack.carousel.length).toBeGreaterThanOrEqual(5);
      expect(pack.carousel.length).toBeLessThanOrEqual(8);
      expect(guideDistributionUrl(pack.slug, "linkedin")).toContain("utm_campaign=guide_distribution");
    }
  });

  it("maps industry resources only to published guides", () => {
    for (const slugs of Object.values(industryGuideLinks)) for (const slug of slugs) expect(publishedSlugs.has(slug)).toBe(true);
  });
});
