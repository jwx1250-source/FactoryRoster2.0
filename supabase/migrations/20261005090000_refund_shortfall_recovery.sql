alter table public.credit_balances
  add column if not exists refund_credit_shortfall integer not null default 0;

alter table public.stripe_payments
  add column if not exists credits_shortfall integer not null default 0;

alter table public.stripe_payments
  drop constraint if exists stripe_payments_credits_shortfall_check;

alter table public.stripe_payments
  add constraint stripe_payments_credits_shortfall_check check (credits_shortfall >= 0);

alter table public.credit_balances
  drop constraint if exists credit_balances_refund_shortfall_check;

alter table public.credit_balances
  add constraint credit_balances_refund_shortfall_check check (refund_credit_shortfall >= 0);

alter table public.credit_transactions
  drop constraint if exists credit_transactions_type_check;

alter table public.credit_transactions
  add constraint credit_transactions_type_check
  check (type in ('purchase', 'unlock', 'refund', 'refund_shortfall_recovery', 'adjustment', 'manual_adjustment'));

create or replace function public.grant_stripe_credits(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_credits integer,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_amount_cents integer,
  p_package_slug text,
  p_description text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_rows integer;
  recovery_credits integer;
  balance_row public.credit_balances%rowtype;
  active_dispute boolean;
begin
  if p_credits <= 0 or p_amount_cents <= 0 then raise exception 'Invalid Stripe credit fulfillment amount'; end if;
  if nullif(trim(p_event_id), '') is null or nullif(trim(p_checkout_session_id), '') is null or nullif(trim(p_payment_intent_id), '') is null then raise exception 'Stripe fulfillment identifiers are required'; end if;

  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, p_event_type)
  on conflict (event_id) do nothing;
  if not found then return false; end if;

  insert into public.credit_transactions (
    user_id, type, amount, checkout_session_id, payment_intent_id,
    stripe_event_id, stripe_amount_cents, package_slug, description
  ) values (
    p_user_id, 'purchase', p_credits, p_checkout_session_id, p_payment_intent_id,
    p_event_id, p_amount_cents, p_package_slug, p_description
  ) on conflict do nothing;
  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then return false; end if;

  insert into public.credit_balances (user_id, balance, refund_credit_shortfall)
  values (p_user_id, 0, 0)
  on conflict (user_id) do nothing;
  select * into balance_row from public.credit_balances where user_id = p_user_id for update;

  recovery_credits := least(p_credits, balance_row.refund_credit_shortfall);
  if recovery_credits > 0 then
    insert into public.credit_transactions (
      user_id, type, amount, payment_intent_id, stripe_amount_cents, package_slug, description
    ) values (
      p_user_id, 'refund_shortfall_recovery', -recovery_credits, p_payment_intent_id,
      p_amount_cents, p_package_slug, 'Refund credit shortfall recovery from new purchase'
    );
  end if;

  select exists (
    select 1 from public.stripe_disputes
    where user_id = p_user_id and status = 'open'
  ) into active_dispute;

  update public.credit_balances
  set balance = balance + p_credits - recovery_credits,
      refund_credit_shortfall = refund_credit_shortfall - recovery_credits,
      consumption_blocked = (refund_credit_shortfall - recovery_credits > 0) or active_dispute,
      restriction_reason = case
        when active_dispute then 'Stripe dispute under review'
        when refund_credit_shortfall - recovery_credits > 0 then 'Refund credit shortfall'
        else null
      end,
      restricted_at = case
        when (refund_credit_shortfall - recovery_credits > 0) or active_dispute then coalesce(restricted_at, now())
        else null
      end,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.stripe_payments (payment_intent_id, checkout_session_id, user_id, amount_cents, credits_granted)
  values (p_payment_intent_id, p_checkout_session_id, p_user_id, p_amount_cents, p_credits);
  return true;
end;
$$;

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
  total_eligible_credits integer;
  newly_due_credits integer;
  available_credits integer;
  adjusted_credits integer;
  shortfall_delta integer;
  active_dispute boolean;
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
  if payment_row.payment_intent_id is null then raise exception 'Stripe payment not found'; end if;

  insert into public.credit_balances (user_id, balance, refund_credit_shortfall)
  values (payment_row.user_id, 0, 0)
  on conflict (user_id) do nothing;
  select * into balance_row from public.credit_balances where user_id = payment_row.user_id for update;

  cumulative_amount := least(payment_row.amount_cents, payment_row.amount_refunded_cents + p_amount_cents);
  total_eligible_credits := floor((cumulative_amount::numeric * payment_row.credits_granted) / payment_row.amount_cents)::integer;
  newly_due_credits := greatest(0, total_eligible_credits - payment_row.credits_refunded - payment_row.credits_shortfall);
  available_credits := greatest(0, balance_row.balance);
  adjusted_credits := least(newly_due_credits, available_credits);
  shortfall_delta := newly_due_credits - adjusted_credits;

  insert into public.stripe_refunds (refund_id, payment_intent_id, event_id, amount_cents, credits_adjusted)
  values (p_refund_id, p_payment_intent_id, p_event_id, p_amount_cents, adjusted_credits)
  on conflict (refund_id) do nothing
  returning refund_id into inserted_refund_id;
  if inserted_refund_id is null then return false; end if;

  if adjusted_credits > 0 then
    insert into public.credit_transactions (
      user_id, type, amount, payment_intent_id, stripe_event_id, stripe_refund_id,
      stripe_amount_cents, description
    ) values (
      payment_row.user_id, 'refund', -adjusted_credits, p_payment_intent_id, p_event_id,
      p_refund_id, p_amount_cents, 'Stripe refund credit adjustment'
    );
  end if;

  select exists (select 1 from public.stripe_disputes where user_id = payment_row.user_id and status = 'open') into active_dispute;
  update public.credit_balances
  set balance = balance - adjusted_credits,
      refund_credit_shortfall = refund_credit_shortfall + shortfall_delta,
      consumption_blocked = (refund_credit_shortfall + shortfall_delta > 0) or active_dispute,
      restriction_reason = case
        when active_dispute then 'Stripe dispute under review'
        when refund_credit_shortfall + shortfall_delta > 0 then 'Refund credit shortfall'
        else null
      end,
      restricted_at = case when (refund_credit_shortfall + shortfall_delta > 0) or active_dispute then coalesce(restricted_at, now()) else null end,
      updated_at = now()
  where user_id = payment_row.user_id;

  update public.stripe_payments
  set amount_refunded_cents = cumulative_amount,
      credits_refunded = credits_refunded + adjusted_credits,
      credits_shortfall = credits_shortfall + shortfall_delta,
      status = case when cumulative_amount >= amount_cents then 'refunded' else 'partially_refunded' end,
      updated_at = now()
  where payment_intent_id = p_payment_intent_id;
  return true;
end;
$$;

create or replace function public.record_stripe_dispute_closed(
  p_event_id text,
  p_dispute_id text,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  dispute_row public.stripe_disputes%rowtype;
  open_disputes boolean;
  shortfall integer;
begin
  if p_status not in ('won', 'lost') then raise exception 'Invalid closed dispute status'; end if;
  insert into public.stripe_webhook_events (event_id, event_type) values (p_event_id, 'charge.dispute.closed') on conflict (event_id) do nothing;
  select * into dispute_row from public.stripe_disputes where dispute_id = p_dispute_id for update;
  if dispute_row.dispute_id is null then raise exception 'Stripe dispute not found'; end if;
  if dispute_row.status = p_status then return false; end if;
  update public.stripe_disputes set status = p_status, closed_at = now() where dispute_id = p_dispute_id;
  update public.stripe_payments set dispute_status = p_status, status = case when p_status = 'won' then 'dispute_won' else 'dispute_lost' end, updated_at = now() where payment_intent_id = dispute_row.payment_intent_id;
  select exists (select 1 from public.stripe_disputes where user_id = dispute_row.user_id and status = 'open') into open_disputes;
  select refund_credit_shortfall into shortfall from public.credit_balances where user_id = dispute_row.user_id for update;
  if p_status = 'won' and not open_disputes and coalesce(shortfall, 0) = 0 then
    update public.credit_balances set consumption_blocked = false, restriction_reason = null, restricted_at = null, updated_at = now() where user_id = dispute_row.user_id;
  else
    update public.credit_balances set consumption_blocked = true, restriction_reason = case when p_status = 'lost' then 'Stripe dispute lost; account review required' when coalesce(shortfall, 0) > 0 then 'Refund credit shortfall' else 'Another Stripe dispute remains open' end, restricted_at = coalesce(restricted_at, now()), updated_at = now() where user_id = dispute_row.user_id;
  end if;
  return true;
end;
$$;

revoke execute on function public.grant_stripe_credits(text,text,uuid,integer,text,text,integer,text,text) from public, anon, authenticated;
grant execute on function public.grant_stripe_credits(text,text,uuid,integer,text,text,integer,text,text) to service_role;
revoke execute on function public.record_stripe_refund(text,text,text,integer) from public, anon, authenticated;
grant execute on function public.record_stripe_refund(text,text,text,integer) to service_role;
revoke execute on function public.record_stripe_dispute_closed(text,text,text) from public, anon, authenticated;
grant execute on function public.record_stripe_dispute_closed(text,text,text) to service_role;
