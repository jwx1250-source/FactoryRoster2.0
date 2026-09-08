import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/env";
import { apiError, noStoreJson } from "@/lib/http";
import { isPlanSlug, PLAN_CATALOG } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ plan: z.string() });

export async function POST(request: Request) {
  try {
    const { plan } = schema.parse(await request.json());
    if (!isPlanSlug(plan)) return noStoreJson({ error: "Unknown pricing plan" }, { status: 400 });

    const user = await requireAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    const { data: pricingPlan, error } = await supabase
      .from("pricing_plans")
      .select("stripe_price_id,is_active")
      .eq("slug", plan)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!pricingPlan?.stripe_price_id) {
      return noStoreJson({ error: "This pricing plan is not connected to Stripe yet", code: "PRICE_NOT_CONFIGURED" }, { status: 503 });
    }

    const catalogPlan = PLAN_CATALOG[plan];
    const siteUrl = getSiteUrl();
    const stripe = getStripe();
    const metadata = { user_id: user.id, plan_slug: plan, credits: String(catalogPlan.credits) };
    const session = await stripe.checkout.sessions.create({
      mode: catalogPlan.mode,
      line_items: [{ price: pricingPlan.stripe_price_id, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      metadata,
      ...(catalogPlan.mode === "subscription" ? { subscription_data: { metadata } } : {}),
      success_url: `${siteUrl}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
    });
    return noStoreJson({ url: session.url });
  } catch (error) {
    return apiError(error);
  }
}
