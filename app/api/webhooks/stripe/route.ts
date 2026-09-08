import type Stripe from "stripe";

import { getStripeEnv } from "@/lib/env";
import { apiError } from "@/lib/http";
import { isPlanSlug, PLAN_CATALOG } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function grantCredits(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const planSlug = session.metadata?.plan_slug;
  if (!userId || !planSlug || !isPlanSlug(planSlug)) throw new Error("Checkout session is missing valid fulfillment metadata");

  const plan = PLAN_CATALOG[planSlug];
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("grant_stripe_credits", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_user_id: userId,
    p_credits: plan.credits,
    p_stripe_session_id: session.id,
    p_description: `${plan.name} credit purchase`,
  });
  if (error) throw error;

  if (session.mode === "subscription" && typeof session.subscription === "string") {
    await supabase.from("memberships").upsert({
      user_id: userId,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: session.subscription,
      status: "active",
    }, { onConflict: "user_id" });
  }
}

async function grantRenewalCredits(event: Stripe.Event, invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== "subscription_cycle") return;
  const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === "string"
    ? invoice.parent.subscription_details.subscription
    : null;
  if (!subscriptionId) return;

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.user_id;
  const planSlug = subscription.metadata.plan_slug;
  if (!userId || !planSlug || !isPlanSlug(planSlug)) throw new Error("Subscription is missing valid fulfillment metadata");

  const plan = PLAN_CATALOG[planSlug];
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("grant_stripe_credits", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_user_id: userId,
    p_credits: plan.credits,
    p_stripe_session_id: invoice.id,
    p_description: `${plan.name} monthly credits`,
  });
  if (error) throw error;
}

async function deactivateMembership(subscription: Stripe.Subscription) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("memberships")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);
  if (error) throw error;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) return Response.json({ error: "Missing Stripe signature" }, { status: 400 });

    const rawBody = await request.text();
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeEnv().STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status === "paid" || session.mode === "subscription") await grantCredits(event, session);
    } else if (event.type === "invoice.payment_succeeded") {
      await grantRenewalCredits(event, event.data.object);
    } else if (event.type === "customer.subscription.deleted") {
      await deactivateMembership(event.data.object);
    }

    return Response.json({ received: true });
  } catch (error) {
    return apiError(error);
  }
}
