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
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
});

export class MissingConfigurationError extends Error {
  constructor(service: string) {
    super(`${service} is not configured. Add the required environment variables.`);
    this.name = "MissingConfigurationError";
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
  const result = stripeSchema.safeParse(process.env);
  if (!result.success) throw new MissingConfigurationError("Stripe");
  return result.data;
}

export function getSiteUrl() {
  return z.url().catch("https://factoryroster.com").parse(process.env.NEXT_PUBLIC_SITE_URL);
}
