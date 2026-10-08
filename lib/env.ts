import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("https://factoryroster.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

const stripeSchema = z.object({
  // Stripe supports both standard secret keys (sk_) and restricted keys (rk_).
  STRIPE_SECRET_KEY: z.string().regex(/^(sk|rk)_/),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_PRICE_STARTER_ID: z.string().startsWith("price_"),
  STRIPE_PRICE_BUYER_ID: z.string().startsWith("price_"),
  STRIPE_PRICE_PRO_ID: z.string().startsWith("price_"),
});

export class MissingConfigurationError extends Error {
  readonly missingKeys?: string[];

  constructor(service: string, missingKeys?: string[]) {
    super(`${service} is not configured. Add the required environment variables.`);
    this.name = "MissingConfigurationError";
    this.missingKeys = missingKeys;
  }
}

export function getPublicEnv() {
  const result = publicSchema.safeParse(process.env);
  if (!result.success) throw new MissingConfigurationError("Supabase");
  return result.data;
}

export function getServerEnv() {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) throw new MissingConfigurationError("Supabase server access");
  return result.data;
}

export function getStripeEnv() {
  const stripeEnv = Object.fromEntries(
    [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "STRIPE_PRICE_STARTER_ID",
      "STRIPE_PRICE_BUYER_ID",
      "STRIPE_PRICE_PRO_ID",
    ].map((key) => [key, process.env[key]?.trim()]),
  );
  const result = stripeSchema.safeParse(stripeEnv);
  if (!result.success) {
    // Keep diagnostics server-side and value-free so misconfigured deployments
    // can be fixed without ever exposing Stripe secrets to the client.
    console.error("[stripe-config] invalid environment variables", result.error.issues.map((issue) => issue.path.join(".")));
    throw new MissingConfigurationError(
      "Stripe",
      result.error.issues.map((issue) => issue.path.join(".")),
    );
  }
  return result.data;
}

export function getSiteUrl() {
  return z.url().catch("https://factoryroster.com").parse(process.env.NEXT_PUBLIC_SITE_URL);
}
