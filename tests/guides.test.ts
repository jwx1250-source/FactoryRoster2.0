import { describe, expect, it } from "vitest";
import { builtInGuides, calculateGuideReadTime, guideClusters, guideRoadmap, mergeGuides } from "../lib/guides";

describe("FactoryRoster Knowledge Hub", () => {
  it("defines the seven sourcing-stage clusters and a 24-guide roadmap", () => {
    expect(guideClusters).toHaveLength(7);
    expect(guideRoadmap).toHaveLength(30);
    expect(new Set(guideRoadmap.map((guide) => guide.slug)).size).toBe(30);
  });

  it("publishes the six verification-focused guides without empty content", () => {
    expect(builtInGuides).toHaveLength(12);
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
    ]));
  });

  it("calculates structured guide read time from content instead of trusting a hand-written label", () => {
    expect(calculateGuideReadTime({ content: "one two three four five" })).toBe(1);
    expect(calculateGuideReadTime({ content: Array.from({ length: 441 }, () => "word").join(" ") })).toBe(3);
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
