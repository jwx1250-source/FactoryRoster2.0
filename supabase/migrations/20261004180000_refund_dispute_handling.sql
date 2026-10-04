begin;

-- Stripe payment state is separate from the immutable credit ledger.  The
-- ledger remains the financial source of truth; this table is the current
-- state needed to process refunds and disputes safely.
create table if not exists public.stripe_payments (
  payment_intent_id text primary key,
  checkout_session_id text unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  credits_granted integer not null check (credits_granted > 0),
  amount_refunded_cents integer not null default 0 check (amount_refunded_cents >= 0 and amount_refunded_cents <= amount_cents),
  credits_refunded integer not null default 0 check (credits_refunded >= 0 and credits_refunded <= credits_granted),
  status text not null default 'paid' check (status in ('paid', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')),
  dispute_status text not null default 'none' check (dispute_status in ('none', 'open', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe_payments_user_id_idx on public.stripe_payments (user_id, created_at desc);

create table if not exists public.stripe_refunds (
  refund_id text primary key,
  payment_intent_id text not null references public.stripe_payments(payment_intent_id) on delete restrict,
  event_id text not null,
  amount_cents integer not null check (amount_cents > 0),
  credits_adjusted integer not null default 0 check (credits_adjusted >= 0),
  created_at timestamptz not null default now()
);

create index if not exists stripe_refunds_payment_intent_idx on public.stripe_refunds (payment_intent_id);

create table if not exists public.stripe_disputes (
  dispute_id text primary key,
  payment_intent_id text not null references public.stripe_payments(payment_intent_id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  status text not null check (status in ('open', 'won', 'lost')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists stripe_disputes_user_status_idx on public.stripe_disputes (user_id, status);

alter table public.credit_balances
  add column if not exists consumption_blocked boolean not null default false,
  add column if not exists restriction_reason text,
  add column if not exists restricted_at timestamptz;

alter table public.credit_transactions
  add column if not exists stripe_refund_id text,
  add column if not exists stripe_dispute_id text;

create unique index if not exists credit_transactions_stripe_refund_unique
  on public.credit_transactions (stripe_refund_id)
  where stripe_refund_id is not null;

create unique index if not exists credit_transactions_stripe_dispute_unique
  on public.credit_transactions (stripe_dispute_id)
  where stripe_dispute_id is not null;

alter table public.stripe_payments enable row level security;
alter table public.stripe_refunds enable row level security;
alter table public.stripe_disputes enable row level security;

revoke all on public.stripe_payments, public.stripe_refunds, public.stripe_disputes from anon, authenticated;
revoke insert, update, delete on public.credit_balances from anon, authenticated;

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
begin
  if p_credits <= 0 or p_amount_cents <= 0 then raise exception 'Invalid Stripe credit fulfillment amount'; end if;
  if nullif(trim(p_event_id), '') is null or nullif(trim(p_checkout_session_id), '') is null or nullif(trim(p_payment_intent_id), '') is null then raise exception 'Stripe fulfillment identifiers are required'; end if;
  insert into public.stripe_webhook_events (event_id, event_type) values (p_event_id, p_event_type) on conflict (event_id) do nothing;
  if not found then return false; end if;
  insert into public.credit_transactions (user_id, type, amount, checkout_session_id, payment_intent_id, stripe_event_id, stripe_amount_cents, package_slug, description)
  values (p_user_id, 'purchase', p_credits, p_checkout_session_id, p_payment_intent_id, p_event_id, p_amount_cents, p_package_slug, p_description)
  on conflict do nothing;
  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then return false; end if;
  insert into public.credit_balances (user_id, balance) values (p_user_id, p_credits)
  on conflict (user_id) do update set balance = public.credit_balances.balance + excluded.balance, updated_at = now();
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
  on conflict (refund_id) do nothing;
  if not found then
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

create or replace function public.record_stripe_dispute_opened(
  p_event_id text,
  p_dispute_id text,
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
begin
  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, 'charge.dispute.created')
  on conflict (event_id) do nothing;
  select * into payment_row from public.stripe_payments
  where payment_intent_id = p_payment_intent_id for update;
  if payment_row.payment_intent_id is null then raise exception 'Stripe payment not found'; end if;
  insert into public.stripe_disputes (dispute_id, payment_intent_id, user_id, amount_cents, status)
  values (p_dispute_id, p_payment_intent_id, payment_row.user_id, p_amount_cents, 'open')
  on conflict (dispute_id) do nothing;
  if not found then return false; end if;
  insert into public.credit_balances (user_id, balance, consumption_blocked, restriction_reason, restricted_at)
  values (payment_row.user_id, 0, true, 'Stripe dispute under review', now())
  on conflict (user_id) do update set consumption_blocked = true, restriction_reason = 'Stripe dispute under review', restricted_at = now(), updated_at = now();
  update public.stripe_payments set dispute_status = 'open', status = 'disputed', updated_at = now()
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
begin
  if p_status not in ('won', 'lost') then raise exception 'Invalid closed dispute status'; end if;
  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, 'charge.dispute.closed')
  on conflict (event_id) do nothing;
  select * into dispute_row from public.stripe_disputes where dispute_id = p_dispute_id for update;
  if dispute_row.dispute_id is null then raise exception 'Stripe dispute not found'; end if;
  if dispute_row.status = p_status then return false; end if;
  update public.stripe_disputes set status = p_status, closed_at = now() where dispute_id = p_dispute_id;
  update public.stripe_payments
  set dispute_status = p_status, status = case when p_status = 'won' then 'dispute_won' else 'dispute_lost' end, updated_at = now()
  where payment_intent_id = dispute_row.payment_intent_id;
  select exists (select 1 from public.stripe_disputes where user_id = dispute_row.user_id and status = 'open') into open_disputes;
  if p_status = 'won' and not open_disputes then
    update public.credit_balances set consumption_blocked = false, restriction_reason = null, restricted_at = null, updated_at = now()
    where user_id = dispute_row.user_id;
  else
    update public.credit_balances set consumption_blocked = true, restriction_reason = case when p_status = 'lost' then 'Stripe dispute lost; account review required' else 'Another Stripe dispute remains open' end, restricted_at = coalesce(restricted_at, now()), updated_at = now()
    where user_id = dispute_row.user_id;
  end if;
  return true;
end;
$$;

create or replace function public.unlock_factory_contact(p_factory_id uuid)
returns table (contact_person text, contact_position text, verified_phone text, verified_email text, whatsapp text, wechat text, contact_verification_method text, last_contact_verified_at timestamptz, credits_remaining integer, already_unlocked boolean)
language plpgsql security definer set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  contact_row public.factory_contacts%rowtype;
  current_balance integer;
  existing_unlock boolean;
  blocked boolean;
begin
  if caller_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  select c.* into contact_row from public.factory_contacts c join public.factories f on f.id = c.factory_id where c.factory_id = p_factory_id and c.is_active and f.is_published for update of c;
  if contact_row.id is null then raise exception 'Verified contact record not found' using errcode = 'P0002'; end if;
  select exists (select 1 from public.contact_unlocks where user_id = caller_id and factory_contact_id = contact_row.id) into existing_unlock;
  if not existing_unlock then
    select coalesce(b.consumption_blocked, false) into blocked from public.credit_balances b where b.user_id = caller_id for update;
    if blocked then raise exception 'Account credit consumption is restricted while a Stripe dispute is under review' using errcode = 'P0003'; end if;
    insert into public.credit_balances (user_id, balance) values (caller_id, 0) on conflict (user_id) do nothing;
    select balance into current_balance from public.credit_balances where user_id = caller_id for update;
    if current_balance < 1 then raise exception 'Insufficient contact credits' using errcode = 'P0001'; end if;
    update public.credit_balances set balance = balance - 1, updated_at = now() where user_id = caller_id;
    insert into public.contact_unlocks (user_id, factory_id, factory_contact_id, credits_spent) values (caller_id, p_factory_id, contact_row.id, 1);
    insert into public.credit_transactions (user_id, type, amount, factory_id, description) values (caller_id, 'unlock', -1, p_factory_id, 'Verified Contact Record unlock');
  end if;
  select balance into current_balance from public.credit_balances where user_id = caller_id;
  return query select contact_row.contact_person, contact_row.position, contact_row.verified_phone, contact_row.verified_email, contact_row.whatsapp, contact_row.wechat, contact_row.contact_verification_method, contact_row.last_contact_verified_at, coalesce(current_balance, 0), existing_unlock;
end;
$$;

revoke execute on function public.record_stripe_refund(text,text,text,integer) from public, anon, authenticated;
revoke execute on function public.record_stripe_dispute_opened(text,text,text,integer) from public, anon, authenticated;
revoke execute on function public.record_stripe_dispute_closed(text,text,text) from public, anon, authenticated;
grant execute on function public.record_stripe_refund(text,text,text,integer) to service_role;
grant execute on function public.record_stripe_dispute_opened(text,text,text,integer) to service_role;
grant execute on function public.record_stripe_dispute_closed(text,text,text) to service_role;

commit;
