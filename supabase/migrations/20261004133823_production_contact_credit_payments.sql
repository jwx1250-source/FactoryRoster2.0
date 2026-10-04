begin;

-- contact_unlocks is the single canonical manufacturer-unlock model.  It already
-- records the user, manufacturer, contact record, and permanent unlock time.
-- Do not introduce a parallel manufacturer_unlocks table.
create unique index if not exists contact_unlocks_user_factory_unique
  on public.contact_unlocks (user_id, factory_id);

alter table public.profiles
  add column if not exists stripe_customer_id text;

create unique index if not exists profiles_stripe_customer_id_unique
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

alter table public.credit_transactions
  add column if not exists checkout_session_id text,
  add column if not exists payment_intent_id text,
  add column if not exists stripe_event_id text,
  add column if not exists stripe_amount_cents integer,
  add column if not exists package_slug text;

update public.credit_transactions
set checkout_session_id = stripe_session_id
where checkout_session_id is null and stripe_session_id is not null;

drop index if exists public.credit_transactions_stripe_session_unique;
alter table public.credit_transactions drop column if exists stripe_session_id;

alter table public.credit_transactions
  drop constraint if exists credit_transactions_type_check;

alter table public.credit_transactions
  add constraint credit_transactions_type_check
  check (type in ('purchase', 'unlock', 'refund', 'adjustment', 'manual_adjustment'));

create unique index if not exists credit_transactions_checkout_session_unique
  on public.credit_transactions (checkout_session_id)
  where checkout_session_id is not null;

create unique index if not exists credit_transactions_payment_intent_unique
  on public.credit_transactions (payment_intent_id)
  where payment_intent_id is not null;

create unique index if not exists credit_transactions_stripe_event_unique
  on public.credit_transactions (stripe_event_id)
  where stripe_event_id is not null;

create or replace function private.prevent_credit_transaction_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Credit ledger transactions are immutable';
end;
$$;

drop trigger if exists credit_transactions_immutable on public.credit_transactions;
create trigger credit_transactions_immutable
before update or delete on public.credit_transactions
for each row execute function private.prevent_credit_transaction_mutation();

revoke insert, update, delete on public.credit_balances from anon, authenticated;
revoke insert, update, delete on public.credit_transactions from anon, authenticated;
revoke insert, update, delete on public.contact_unlocks from anon, authenticated;

drop function if exists public.grant_stripe_credits(text, text, uuid, integer, text, text);

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
  if p_credits <= 0 or p_amount_cents <= 0 then
    raise exception 'Invalid Stripe credit fulfillment amount';
  end if;
  if nullif(trim(p_event_id), '') is null
     or nullif(trim(p_checkout_session_id), '') is null
     or nullif(trim(p_payment_intent_id), '') is null then
    raise exception 'Stripe fulfillment identifiers are required';
  end if;

  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, p_event_type)
  on conflict (event_id) do nothing;
  if not found then
    return false;
  end if;

  insert into public.credit_transactions (
    user_id, type, amount, checkout_session_id, payment_intent_id,
    stripe_event_id, stripe_amount_cents, package_slug, description
  ) values (
    p_user_id, 'purchase', p_credits, p_checkout_session_id, p_payment_intent_id,
    p_event_id, p_amount_cents, p_package_slug, p_description
  ) on conflict do nothing;
  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    return false;
  end if;

  insert into public.credit_balances (user_id, balance)
  values (p_user_id, p_credits)
  on conflict (user_id) do update
    set balance = public.credit_balances.balance + excluded.balance,
        updated_at = now();

  return true;
end;
$$;

revoke execute on function public.grant_stripe_credits(text, text, uuid, integer, text, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.grant_stripe_credits(text, text, uuid, integer, text, text, integer, text, text) to service_role;

-- The three production credit packages are the only one-time plans.
update public.pricing_plans
set slug = 'buyer', name = 'Buyer', type = 'credit_pack', updated_at = now()
where slug = 'business';

update public.pricing_plans
set is_active = false, updated_at = now()
where slug = 'sourcing-membership';

insert into public.pricing_plans (slug, name, price_usd, credits, type, is_active)
values
  ('starter', 'Starter', 9.90, 3, 'credit_pack', true),
  ('buyer', 'Buyer', 29.90, 15, 'credit_pack', true),
  ('pro', 'Pro', 99.00, 60, 'credit_pack', true)
on conflict (slug) do update set
  name = excluded.name,
  price_usd = excluded.price_usd,
  credits = excluded.credits,
  type = excluded.type,
  is_active = excluded.is_active,
  updated_at = now();

commit;
