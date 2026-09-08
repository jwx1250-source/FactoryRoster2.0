import Stripe from "stripe";

import { getStripeEnv } from "@/lib/env";

let stripeClient: Stripe | undefined;

export function getStripe() {
  const env = getStripeEnv();
  stripeClient ??= new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: { name: "FactoryRoster", version: "2.0.0", url: "https://factoryroster.com" },
    typescript: true,
  });
  return stripeClient;
}
