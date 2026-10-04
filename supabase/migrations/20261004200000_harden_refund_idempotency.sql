create or replace function public.record_stripe_refund(
  p_event_id text,
  p_refund_id text,
  p_payment_intent_id text,
  p_amount_cents integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_row public.stripe_payments%rowtype;
  balance_row public.credit_balances%rowtype;
  inserted_refund_id text;
  cumulative_amount integer;
  eligible_credits integer;
  available_credits integer;
  adjusted_credits integer;
begin
  if nullif(trim(p_event_id), '') is null or nullif(trim(p_refund_id), '') is null
     or nullif(trim(p_payment_intent_id), '') is null or p_amount_cents <= 0 then
    raise exception 'Invalid Stripe refund data';
  end if;

  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, 'charge.refunded')
  on conflict (event_id) do nothing;

  select * into payment_row from public.stripe_payments
  where payment_intent_id = p_payment_intent_id for update;
  if payment_row.payment_intent_id is null then
    raise exception 'Stripe payment not found';
  end if;

  insert into public.credit_balances (user_id, balance)
  values (payment_row.user_id, 0)
  on conflict (user_id) do nothing;
  select * into balance_row from public.credit_balances
  where user_id = payment_row.user_id for update;

  cumulative_amount := least(payment_row.amount_cents, payment_row.amount_refunded_cents + p_amount_cents);
  eligible_credits := greatest(0, floor((cumulative_amount::numeric * payment_row.credits_granted) / payment_row.amount_cents)::integer - payment_row.credits_refunded);
  available_credits := greatest(0, balance_row.balance);
  adjusted_credits := least(eligible_credits, available_credits);

  insert into public.stripe_refunds (refund_id, payment_intent_id, event_id, amount_cents, credits_adjusted)
  values (p_refund_id, p_payment_intent_id, p_event_id, p_amount_cents, adjusted_credits)
  on conflict (refund_id) do nothing
  returning refund_id into inserted_refund_id;
  if inserted_refund_id is null then
    return false;
  end if;

  if adjusted_credits > 0 then
    insert into public.credit_transactions (
      user_id, type, amount, payment_intent_id, stripe_event_id, stripe_refund_id,
      stripe_amount_cents, description
    ) values (
      payment_row.user_id, 'refund', -adjusted_credits, p_payment_intent_id, p_event_id,
      p_refund_id, p_amount_cents, 'Stripe refund credit adjustment'
    );
    update public.credit_balances
    set balance = balance - adjusted_credits, updated_at = now()
    where user_id = payment_row.user_id;
  end if;

  update public.stripe_payments
  set amount_refunded_cents = cumulative_amount,
      credits_refunded = credits_refunded + adjusted_credits,
      status = case when cumulative_amount >= amount_cents then 'refunded' else 'partially_refunded' end,
      updated_at = now()
  where payment_intent_id = p_payment_intent_id;
  return true;
end;
$$;

revoke execute on function public.record_stripe_refund(text,text,text,integer) from public, anon, authenticated;
grant execute on function public.record_stripe_refund(text,text,text,integer) to service_role;
