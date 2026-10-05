import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { builtInGuides, calculateGuideReadTime, getRelatedGuides, guideClusters, guideRoadmap, mergeGuides, publishedBuiltInGuides } from "../lib/guides";

const root = process.cwd();
const detailPage = readFileSync(resolve(root, "app/guides/[guideSlug]/page.tsx"), "utf8");
const breadcrumb = readFileSync(resolve(root, "components/seo-navigation.tsx"), "utf8");
const sitemap = readFileSync(resolve(root, "app/sitemap.ts"), "utf8");

describe("FactoryRoster Knowledge Hub", () => {
  it("defines eight long-term clusters and unique guide roadmap entries", () => {
    expect(guideClusters).toHaveLength(8);
    expect(new Set(guideRoadmap.map((guide) => guide.slug)).size).toBe(guideRoadmap.length);
    expect(guideRoadmap.map((guide) => guide.slug)).not.toEqual(expect.arrayContaining([
      "how-to-write-a-china-supplier-rfq",
      "how-to-contact-chinese-suppliers",
      "china-supplier-moq-guide",
      "china-supplier-sample-order-guide",
    ]));
  });

  it("publishes the six verification-focused guides without empty content", () => {
    expect(builtInGuides).toHaveLength(18);
    expect(builtInGuides.every((guide) => guide.sections && guide.sections.length >= 5)).toBe(true);
    expect(builtInGuides.map((guide) => guide.slug)).toEqual(expect.arrayContaining([
      "how-to-verify-a-chinese-supplier",
      "chinese-supplier-verification-checklist",
      "manufacturer-vs-trading-company-china",
      "how-to-verify-a-chinese-business-license",
      "china-supplier-scam-red-flags",
      "how-factory-verification-works",
      "how-to-find-manufacturers-in-china",
      "how-to-contact-chinese-manufacturers",
      "how-to-write-an-rfq",
      "moq-explained",
      "how-to-order-samples-from-china",
      "fob-vs-exw-vs-ddp",
      "how-to-negotiate-moq-with-chinese-suppliers",
      "golden-sample-explained",
      "china-quality-control-guide",
      "pre-shipment-inspection-checklist",
      "shipping-from-china",
      "landed-cost-explained",
    ]));
  });

  it("calculates structured guide read time from content instead of trusting a hand-written label", () => {
    expect(calculateGuideReadTime({ content: "one two three four five" })).toBe(1);
    expect(calculateGuideReadTime({ content: Array.from({ length: 441 }, () => "word").join(" ") })).toBe(3);
  });

  it("uses deterministic publication dates and calculated read time for built-in guides", () => {
    const latestAllowed = new Date("2026-10-05T23:59:59Z").getTime();
    expect(publishedBuiltInGuides.every((guide) => new Date(guide.publishedAt).getTime() <= latestAllowed)).toBe(true);
    expect(publishedBuiltInGuides.every((guide) => guide.readTime === calculateGuideReadTime(guide))).toBe(true);
  });

  it("keeps the second batch in the intended clusters", () => {
    expect(builtInGuides.find((guide) => guide.slug === "how-to-order-samples-from-china")?.clusterId).toBe("quality");
    expect(builtInGuides.find((guide) => guide.slug === "fob-vs-exw-vs-ddp")?.clusterId).toBe("shipping");
    expect(builtInGuides.find((guide) => guide.slug === "china-supplier-scam-red-flags")?.clusterId).toBe("verification");
    expect(builtInGuides.filter((guide) => guide.sections?.some((section) => section.heading === "The short answer")).every((guide) => (guide.socialHooks?.length ?? 0) >= 3)).toBe(true);
  });

  it("publishes the third batch in the intended clusters with unique slugs", () => {
    const thirdBatch = [
      ["how-to-negotiate-moq-with-chinese-suppliers", "commercial"],
      ["golden-sample-explained", "quality"],
      ["china-quality-control-guide", "quality"],
      ["pre-shipment-inspection-checklist", "quality"],
      ["shipping-from-china", "shipping"],
      ["landed-cost-explained", "shipping"],
    ] as const;
    for (const [slug, cluster] of thirdBatch) {
      const guide = builtInGuides.find((item) => item.slug === slug);
      expect(guide?.clusterId).toBe(cluster);
      expect(guide?.sections?.length).toBeGreaterThanOrEqual(8);
      expect(guide?.socialHooks?.length).toBeGreaterThanOrEqual(3);
      expect(guideRoadmap.find((item) => item.slug === slug)?.status).toBe("published");
    }
    expect(new Set(thirdBatch.map(([slug]) => slug)).size).toBe(thirdBatch.length);
    expect(guideRoadmap.some((item) => item.slug === "china-supplier-quality-control")).toBe(false);
  });

  it("keeps the pricing-to-shipping journey linked only to published guides", () => {
    const bySlug = new Map(publishedBuiltInGuides.map((guide) => [guide.slug, guide]));
    const expected: Record<string, string[]> = {
      "how-to-negotiate-moq-with-chinese-suppliers": ["moq-explained", "how-to-write-an-rfq", "how-to-order-samples-from-china"],
      "how-to-order-samples-from-china": ["golden-sample-explained", "china-quality-control-guide"],
      "china-quality-control-guide": ["golden-sample-explained", "pre-shipment-inspection-checklist", "shipping-from-china"],
      "pre-shipment-inspection-checklist": ["china-quality-control-guide", "shipping-from-china"],
      "shipping-from-china": ["fob-vs-exw-vs-ddp", "landed-cost-explained"],
      "landed-cost-explained": ["shipping-from-china", "fob-vs-exw-vs-ddp", "moq-explained"],
    };
    for (const [source, targets] of Object.entries(expected)) {
      const related = getRelatedGuides(bySlug.get(source)!, publishedBuiltInGuides).map((guide) => guide.slug);
      expect(related).toEqual(expect.arrayContaining(targets));
      expect(related).not.toContain("china-supplier-quality-control");
    }
  });

  it("guarantees a next-stage related guide without duplicates", () => {
    const current = builtInGuides.find((guide) => guide.slug === "how-to-verify-a-chinese-supplier");
    expect(current).toBeTruthy();
    const related = getRelatedGuides(current!, builtInGuides);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(new Set(related.map((guide) => guide.slug)).size).toBe(related.length);
    expect(related.some((guide) => guide.slug === "how-to-contact-chinese-manufacturers")).toBe(true);
  });

  it("keeps absolute Breadcrumb URLs, large social cards, and sitemap boundaries", () => {
    expect(breadcrumb).toContain("new URL(item.href, siteUrl).toString()");
    expect(detailPage).toContain("summary_large_image");
    expect(detailPage).toContain("opengraph-image");
    expect(sitemap).toContain("publishedBuiltInGuides");
    expect(sitemap).toContain("legacyGuideFallbacks");
    expect(sitemap).toContain("is_published");
  });

  it("merges Supabase rows by slug and never emits duplicate cards", () => {
    const merged = mergeGuides([
      { slug: "how-to-verify-a-chinese-supplier", title: "DB override", topic: "Verification", summary: "Override", content: "## Updated\n\nUpdated content", read_time: 4, seo_title: null, seo_description: null, published_at: "2026-10-06T00:00:00Z" },
      { slug: "custom-guide", title: "Custom guide", topic: "Factory Search", summary: "Custom", content: "Useful content", read_time: 5, seo_title: null, seo_description: null, published_at: "2026-10-06T00:00:00Z" },
    ]);
    expect(new Set(merged.map((guide) => guide.slug)).size).toBe(merged.length);
    expect(merged.find((guide) => guide.slug === "how-to-verify-a-chinese-supplier")?.title).toBe("DB override");
    expect(merged.some((guide) => guide.slug === "custom-guide")).toBe(true);
  });
});
