import type Stripe from "stripe";

import { getStripeEnv } from "@/lib/env";
import { isPlanSlug, PLAN_CATALOG } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function describeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    try { return JSON.stringify(error); } catch { return "Unserializable webhook error"; }
  }
  return String(error);
}

async function grantCredits(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const planSlug = session.metadata?.plan_slug;
  if (!userId || !planSlug || !isPlanSlug(planSlug)) throw new Error("Checkout session is missing valid fulfillment metadata");

  const plan = PLAN_CATALOG[planSlug];
  const env = getStripeEnv();
  const expectedPriceId = ({
    starter: env.STRIPE_PRICE_STARTER_ID,
    buyer: env.STRIPE_PRICE_BUYER_ID,
    pro: env.STRIPE_PRICE_PRO_ID,
  } as const)[planSlug];
  const stripe = getStripe();
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
  const lineItem = lineItems.data[0];
  const actualPriceId = typeof lineItem?.price === "string" ? lineItem.price : lineItem?.price?.id;
  if (actualPriceId !== expectedPriceId || lineItem?.quantity !== 1 || session.amount_total !== Math.round(plan.amountUsd * 100)) {
    throw new Error("Stripe Checkout session does not match the server-side package catalog");
  }
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
  if (!paymentIntentId) throw new Error("Paid Checkout session is missing a PaymentIntent");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("grant_stripe_credits", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_user_id: userId,
    p_credits: plan.credits,
    p_checkout_session_id: session.id,
    p_payment_intent_id: paymentIntentId,
    p_amount_cents: session.amount_total,
    p_package_slug: planSlug,
    p_description: `${plan.name} credit purchase`,
  });
  if (error) throw error;
}

async function recordRefund(event: Stripe.Event, object: Stripe.Charge | Stripe.Refund) {
  const paymentIntentId = typeof object.payment_intent === "string" ? object.payment_intent : null;
  if (!paymentIntentId) throw new Error("Refunded charge is missing a PaymentIntent");
  const refunds = await getStripe().refunds.list({ payment_intent: paymentIntentId, limit: 100 });
  const supabase = createSupabaseAdminClient();
  for (const refund of refunds.data) {
    if (refund.status === "failed" || refund.amount <= 0) continue;
    const { error } = await supabase.rpc("record_stripe_refund", {
      p_event_id: event.id,
      p_refund_id: refund.id,
      p_payment_intent_id: paymentIntentId,
      p_amount_cents: refund.amount,
    });
    if (error) throw error;
  }
}

async function recordDisputeOpened(event: Stripe.Event, dispute: Stripe.Dispute) {
  const paymentIntentId = typeof dispute.payment_intent === "string" ? dispute.payment_intent : null;
  if (!paymentIntentId) throw new Error("Dispute is missing a PaymentIntent");
  const { error } = await createSupabaseAdminClient().rpc("record_stripe_dispute_opened", {
    p_event_id: event.id,
    p_dispute_id: dispute.id,
    p_payment_intent_id: paymentIntentId,
    p_amount_cents: dispute.amount,
  });
  if (error) throw error;
}

async function recordDisputeClosed(event: Stripe.Event, dispute: Stripe.Dispute) {
  if (dispute.status !== "won" && dispute.status !== "lost") return;
  const { error } = await createSupabaseAdminClient().rpc("record_stripe_dispute_closed", {
    p_event_id: event.id,
    p_dispute_id: dispute.id,
    p_status: dispute.status,
  });
  if (error) throw error;
}

export async function POST(request: Request) {
  let eventType = "unknown";
  let eventId = "unknown";
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) return Response.json({ error: "Missing Stripe signature" }, { status: 400 });

    const rawBody = await request.text();
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeEnv().STRIPE_WEBHOOK_SECRET);
    eventType = event.type;
    eventId = event.id;

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.mode !== "payment") throw new Error("Only one-time Checkout Sessions are supported");
      if (session.payment_status === "paid") await grantCredits(event, session);
    } else if (event.type === "charge.refunded" || event.type === "refund.created") {
      await recordRefund(event, event.data.object);
    } else if (event.type === "charge.dispute.created") {
      await recordDisputeOpened(event, event.data.object);
    } else if (event.type === "charge.dispute.closed") {
      await recordDisputeClosed(event, event.data.object);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[stripe webhook] processing failed", {
      eventType,
      eventId,
      message: describeError(error),
    });
    try {
      await createSupabaseAdminClient().from("stripe_webhook_failures").insert({
        event_id: eventId,
        event_type: eventType,
        error_message: describeError(error),
      });
    } catch (diagnosticError) {
      console.error("[stripe webhook] failure diagnostic write failed", diagnosticError);
    }
    return Response.json({
      error: "Webhook processing failed",
      code: "PROCESSING_ERROR",
    }, { status: 500 });
  }
}
