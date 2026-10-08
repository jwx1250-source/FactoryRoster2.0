import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { getSiteUrl, getStripeEnv } from "@/lib/env";
import { apiError, noStoreJson } from "@/lib/http";
import { isPlanSlug } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeRecordServerGrowthEvent } from "@/lib/growth";

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
    // Payment return URLs must use the branded production domain. Preview and
    // Vercel deployment hosts are implementation details and should not leak
    // into customer-facing Checkout redirects.
    const requestUrl = new URL(request.url);
    const siteUrl = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1"
      ? requestUrl.origin
      : getSiteUrl();
    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id ?? undefined;
    if (customerId) {
      try {
        const existingCustomer = await stripe.customers.retrieve(customerId);
        if ("deleted" in existingCustomer && existingCustomer.deleted) customerId = undefined;
      } catch (error) {
        // Customer IDs are mode-specific. A Test-mode customer stored before
        // Live launch appears as resource_missing when queried with a Live key.
        const stripeCode = error && typeof error === "object" && "code" in error
          ? (error as { code?: unknown }).code
          : undefined;
        if (stripeCode === "resource_missing") customerId = undefined;
        else throw error;
      }
    }
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
    await safeRecordServerGrowthEvent("checkout_started", { userId: user.id, entityType: "plan", entityId: plan, properties: { return_to: returnTo }, idempotencyKey: `checkout_started:${session.id}` });
    return noStoreJson({ url: session.url });
  } catch (error) {
    if (error && typeof error === "object" && "type" in error && "message" in error) {
      const stripeError = error as { type?: unknown; code?: unknown; statusCode?: unknown; message?: unknown };
      console.error("[checkout] Stripe API error", {
        type: stripeError.type,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        message: stripeError.message,
      });
    }
    return apiError(error);
  }
}
