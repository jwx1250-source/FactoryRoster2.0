import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { getSiteUrl, getStripeEnv } from "@/lib/env";
import { apiError, noStoreJson } from "@/lib/http";
import { isPlanSlug } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  plan: z.string(),
  return_to: z.string().optional(),
});

function safeReturnPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  return value;
}

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const { plan } = input;
    if (!isPlanSlug(plan)) return noStoreJson({ error: "Unknown pricing plan" }, { status: 400 });

    const user = await requireAuthenticatedUser();
    const stripeEnv = getStripeEnv();
    const priceIds = {
      starter: stripeEnv.STRIPE_PRICE_STARTER_ID,
      buyer: stripeEnv.STRIPE_PRICE_BUYER_ID,
      pro: stripeEnv.STRIPE_PRICE_PRO_ID,
    } as const;
    const returnTo = safeReturnPath(input.return_to);
    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    const siteUrl = getSiteUrl();
    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
      customerId = customer.id;
      await createSupabaseAdminClient().from("profiles").update({ stripe_customer_id: customerId }).eq("user_id", user.id);
    }
    const metadata = { user_id: user.id, plan_slug: plan, return_to: returnTo };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      managed_payments: { enabled: false },
      line_items: [{ price: priceIds[plan], quantity: 1 }],
      client_reference_id: user.id,
      customer: customerId,
      metadata,
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&return_to=${encodeURIComponent(returnTo)}`,
      cancel_url: `${siteUrl}${returnTo}?checkout=cancelled`,
    });
    return noStoreJson({ url: session.url });
  } catch (error) {
    return apiError(error);
  }
}
