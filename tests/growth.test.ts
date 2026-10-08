import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");

describe("growth automation foundation", () => {
  it("keeps the growth event allowlist server-side", () => {
    const route = readFileSync(resolve(root, "app/api/growth/events/route.ts"), "utf8");
    expect(route).toContain("z.enum(GROWTH_EVENTS)");
    expect(route).not.toContain("user_id: input.user_id");
  });

  it("protects user-owned growth APIs with authentication", () => {
    for (const file of ["saved-suppliers/route.ts", "saved-searches/route.ts", "notification-preferences/route.ts"]) {
      const source = readFileSync(resolve(root, "app/api", file), "utf8");
      expect(source).toContain("requireAuthenticatedUser");
    }
  });

  it("does not enable outbound email or cold outreach by default", () => {
    const env = readFileSync(resolve(root, ".env.example"), "utf8");
    const lifecycle = readFileSync(resolve(root, "app/api/cron/lifecycle/route.ts"), "utf8");
    expect(env).toContain("EMAIL_PROVIDER_ENABLED=false");
    expect(lifecycle).toContain("provider_enabled");
  });

  it("creates human-review tasks instead of auto-publishing SEO content", () => {
    const route = readFileSync(resolve(root, "app/api/cron/seo-health/route.ts"), "utf8");
    expect(route).toContain("growth_tasks");
    expect(route).not.toContain("is_published: true");
  });
});
