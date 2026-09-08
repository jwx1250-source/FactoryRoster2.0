create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create schema if not exists private;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  country text,
  role text not null default 'buyer' check (role in ('buyer', 'admin')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  code text not null unique,
  description text not null default '',
  product_examples text[] not null default '{}',
  common_regions text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.factories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  company_name text not null,
  chinese_name text,
  record_id text not null unique,
  industry_id uuid not null references public.industries(id) on delete restrict,
  province text not null,
  city text not null,
  district text,
  address_public text,
  established_year integer check (established_year between 1900 and extract(year from now())::integer),
  employee_range text,
  factory_size text,
  annual_revenue_range text,
  main_products text[] not null default '{}',
  capabilities text[] not null default '{}',
  export_markets text[] not null default '{}',
  certifications text[] not null default '{}',
  trade_terms text[] not null default '{}',
  moq text,
  website_url text,
  factory_type text,
  overview text not null default '',
  has_verified_contact boolean not null default false,
  is_published boolean not null default false,
  is_indexable boolean not null default false,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not is_indexable or is_published)
);

create table public.verification_records (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references public.factories(id) on delete cascade,
  verification_type text not null check (verification_type in ('government_registration', 'business_contact', 'factory_evidence')),
  status text not null default 'pending' check (status in ('verified', 'pending', 'failed')),
  checked_items jsonb not null default '{}'::jsonb,
  verification_method text,
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  evidence_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (factory_id, verification_type),
  check ((status = 'verified' and verified_at is not null) or status <> 'verified')
);

create table public.factory_contacts (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null unique references public.factories(id) on delete cascade,
  contact_person text,
  position text,
  verified_phone text,
  verified_email text,
  whatsapp text,
  wechat text,
  contact_verification_method text,
  last_contact_verified_at timestamptz,
  is_locked boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  factory_id uuid not null references public.factories(id) on delete cascade,
  factory_contact_id uuid not null references public.factory_contacts(id) on delete cascade,
  credits_spent integer not null default 1 check (credits_spent = 1),
  unlocked_at timestamptz not null default now(),
  unique (user_id, factory_contact_id)
);

create table public.credit_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'unlock', 'refund', 'adjustment')),
  amount integer not null check (amount <> 0),
  stripe_session_id text,
  factory_id uuid references public.factories(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create unique index credit_transactions_stripe_session_unique
  on public.credit_transactions (stripe_session_id)
  where stripe_session_id is not null;

create table public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_usd numeric(10,2) not null check (price_usd >= 0),
  credits integer not null check (credits > 0),
  type text not null check (type in ('credit_pack', 'membership')),
  stripe_price_id text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'inactive' check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  factory_id uuid references public.factories(id) on delete set null,
  factory_name text,
  factory_profile_url text,
  product_category text not null,
  request_type text not null,
  buyer_name text not null,
  buyer_email text not null,
  company_name text,
  country text,
  message text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'in_progress', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  topic text not null,
  summary text not null,
  content text not null,
  read_time integer not null default 5 check (read_time > 0),
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  work_email text not null,
  company text,
  country text,
  inquiry_type text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

create index factories_industry_id_idx on public.factories (industry_id);
create index factories_public_idx on public.factories (last_verified_at desc) where is_published;
create index factories_company_name_trgm_idx on public.factories using gin (lower(company_name) gin_trgm_ops);
create index factories_province_trgm_idx on public.factories using gin (lower(province) gin_trgm_ops);
create index factories_city_trgm_idx on public.factories using gin (lower(city) gin_trgm_ops);
create index verification_records_factory_id_idx on public.verification_records (factory_id);
create index contact_unlocks_user_id_idx on public.contact_unlocks (user_id);
create index contact_unlocks_factory_id_idx on public.contact_unlocks (factory_id);
create index credit_transactions_user_id_idx on public.credit_transactions (user_id, created_at desc);
create index verification_requests_user_id_idx on public.verification_requests (user_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger industries_set_updated_at before update on public.industries for each row execute function private.set_updated_at();
create trigger factories_set_updated_at before update on public.factories for each row execute function private.set_updated_at();
create trigger verification_records_set_updated_at before update on public.verification_records for each row execute function private.set_updated_at();
create trigger factory_contacts_set_updated_at before update on public.factory_contacts for each row execute function private.set_updated_at();
create trigger credit_balances_set_updated_at before update on public.credit_balances for each row execute function private.set_updated_at();
create trigger pricing_plans_set_updated_at before update on public.pricing_plans for each row execute function private.set_updated_at();
create trigger memberships_set_updated_at before update on public.memberships for each row execute function private.set_updated_at();
create trigger verification_requests_set_updated_at before update on public.verification_requests for each row execute function private.set_updated_at();
create trigger guides_set_updated_at before update on public.guides for each row execute function private.set_updated_at();

create or replace function private.factory_has_all_verifications(p_factory_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select count(*) = 3
  from public.verification_records
  where factory_id = p_factory_id
    and status = 'verified'
    and verification_type in ('government_registration', 'business_contact', 'factory_evidence');
$$;

create or replace function private.enforce_factory_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_published and not private.factory_has_all_verifications(new.id) then
    raise exception 'A factory requires all three verified checks before publication';
  end if;
  if new.is_indexable and (not new.is_published or length(trim(new.overview)) < 80 or cardinality(new.main_products) = 0) then
    raise exception 'An indexable factory must be published and contain sufficient public content';
  end if;
  return new;
end;
$$;

create trigger factories_enforce_publication
before insert or update of is_published, is_indexable on public.factories
for each row execute function private.enforce_factory_publication();

create or replace function private.unpublish_factory_after_verification_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_factory_id uuid;
begin
  target_factory_id := case when tg_op = 'DELETE' then old.factory_id else new.factory_id end;
  if not private.factory_has_all_verifications(target_factory_id) then
    update public.factories
    set is_published = false, is_indexable = false
    where id = target_factory_id and (is_published or is_indexable);
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger verification_change_unpublishes_factory
after insert or update or delete on public.verification_records
for each row execute function private.unpublish_factory_after_verification_change();

create or replace function private.sync_factory_contact_availability()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_factory_id uuid;
begin
  target_factory_id := case when tg_op = 'DELETE' then old.factory_id else new.factory_id end;
  update public.factories
  set has_verified_contact = exists (
    select 1 from public.factory_contacts c where c.factory_id = target_factory_id
  )
  where id = target_factory_id;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger factory_contact_availability_changed
after insert or update of factory_id or delete on public.factory_contacts
for each row execute function private.sync_factory_contact_availability();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.unlock_factory_contact(p_factory_id uuid)
returns table (
  contact_person text,
  contact_position text,
  verified_phone text,
  verified_email text,
  whatsapp text,
  wechat text,
  contact_verification_method text,
  last_contact_verified_at timestamptz,
  credits_remaining integer,
  already_unlocked boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  contact_row public.factory_contacts%rowtype;
  current_balance integer;
  existing_unlock boolean;
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into contact_row
  from public.factory_contacts
  where factory_id = p_factory_id
  for update;

  if contact_row.id is null then
    raise exception 'Verified contact record not found' using errcode = 'P0002';
  end if;

  select exists (
    select 1 from public.contact_unlocks
    where user_id = caller_id and factory_contact_id = contact_row.id
  ) into existing_unlock;

  if not existing_unlock then
    insert into public.credit_balances (user_id, balance)
    values (caller_id, 0)
    on conflict (user_id) do nothing;

    select balance into current_balance
    from public.credit_balances
    where user_id = caller_id
    for update;

    if current_balance < 1 then
      raise exception 'Insufficient contact credits' using errcode = 'P0001';
    end if;

    update public.credit_balances
    set balance = balance - 1
    where user_id = caller_id;

    insert into public.contact_unlocks (user_id, factory_id, factory_contact_id, credits_spent)
    values (caller_id, p_factory_id, contact_row.id, 1);

    insert into public.credit_transactions (user_id, type, amount, factory_id, description)
    values (caller_id, 'unlock', -1, p_factory_id, 'Verified Contact Record unlock');
  end if;

  select balance into current_balance from public.credit_balances where user_id = caller_id;

  return query select
    contact_row.contact_person,
    contact_row.position,
    contact_row.verified_phone,
    contact_row.verified_email,
    contact_row.whatsapp,
    contact_row.wechat,
    contact_row.contact_verification_method,
    contact_row.last_contact_verified_at,
    coalesce(current_balance, 0),
    existing_unlock;
end;
$$;

create or replace function public.search_verified_factories(
  p_query text default null,
  p_industry_slug text default null,
  p_province text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns table (
  id uuid,
  slug text,
  company_name text,
  record_id text,
  industry_name text,
  industry_slug text,
  province text,
  city text,
  established_year integer,
  employee_range text,
  main_products text[],
  export_markets text[],
  last_verified_at timestamptz,
  overview text,
  has_verified_contact boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    f.id, f.slug, f.company_name, f.record_id,
    i.name, i.slug, f.province, f.city, f.established_year, f.employee_range,
    f.main_products, f.export_markets, f.last_verified_at, f.overview,
    f.has_verified_contact
  from public.factories f
  join public.industries i on i.id = f.industry_id
  where f.is_published
    and (p_industry_slug is null or i.slug = p_industry_slug)
    and (p_province is null or lower(f.province) = lower(p_province))
    and (
      p_query is null or trim(p_query) = '' or
      lower(f.company_name) like '%' || lower(trim(p_query)) || '%' or
      lower(i.name) like '%' || lower(trim(p_query)) || '%' or
      lower(f.province) like '%' || lower(trim(p_query)) || '%' or
      lower(f.city) like '%' || lower(trim(p_query)) || '%' or
      exists (
        select 1 from unnest(f.main_products) product
        where lower(product) like '%' || lower(trim(p_query)) || '%'
      )
    )
  order by f.last_verified_at desc nulls last, f.company_name
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;

create or replace function public.grant_stripe_credits(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_credits integer,
  p_stripe_session_id text,
  p_description text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_credits <= 0 then
    raise exception 'Credits must be positive';
  end if;

  insert into public.stripe_webhook_events (event_id, event_type)
  values (p_event_id, p_event_type)
  on conflict (event_id) do nothing;

  if not found then
    return false;
  end if;

  insert into public.credit_balances (user_id, balance)
  values (p_user_id, p_credits)
  on conflict (user_id) do update
    set balance = public.credit_balances.balance + excluded.balance;

  insert into public.credit_transactions (user_id, type, amount, stripe_session_id, description)
  values (p_user_id, 'purchase', p_credits, p_stripe_session_id, p_description);

  return true;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, company_name, country)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'company_name', ''),
    nullif(new.raw_user_meta_data ->> 'country', '')
  );
  insert into public.credit_balances (user_id, balance) values (new.id, 0);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.industries enable row level security;
alter table public.factories enable row level security;
alter table public.verification_records enable row level security;
alter table public.factory_contacts enable row level security;
alter table public.contact_unlocks enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.verification_requests enable row level security;
alter table public.guides enable row level security;
alter table public.contact_messages enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.industries, public.factories, public.verification_records, public.pricing_plans, public.guides to anon, authenticated;
grant select, insert on public.profiles to authenticated;
grant update (full_name, company_name, country) on public.profiles to authenticated;
grant select on public.factory_contacts, public.contact_unlocks, public.credit_balances, public.credit_transactions, public.memberships to authenticated;
grant insert on public.verification_requests, public.contact_messages to anon, authenticated;
grant select on public.verification_requests to authenticated;

create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy profiles_insert_own on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy industries_public_read on public.industries for select to anon, authenticated using (true);
create policy factories_public_read on public.factories for select to anon, authenticated using (is_published);
create policy verification_records_public_read on public.verification_records for select to anon, authenticated using (status = 'verified' and exists (select 1 from public.factories f where f.id = factory_id and f.is_published));
create policy pricing_plans_public_read on public.pricing_plans for select to anon, authenticated using (is_active);
create policy guides_public_read on public.guides for select to anon, authenticated using (is_published);

create policy contacts_unlocked_read on public.factory_contacts for select to authenticated using (private.is_admin() or exists (select 1 from public.contact_unlocks u where u.factory_contact_id = id and u.user_id = (select auth.uid())));
create policy unlocks_select_own on public.contact_unlocks for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy balances_select_own on public.credit_balances for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy transactions_select_own on public.credit_transactions for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy memberships_select_own on public.memberships for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy verification_requests_insert on public.verification_requests for insert to anon, authenticated with check (user_id is null or user_id = (select auth.uid()));
create policy verification_requests_select_own on public.verification_requests for select to authenticated using (user_id = (select auth.uid()) or private.is_admin());
create policy contact_messages_insert on public.contact_messages for insert to anon, authenticated with check (true);

create policy admin_profiles_all on public.profiles for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_industries_all on public.industries for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_factories_all on public.factories for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_verification_records_all on public.verification_records for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_factory_contacts_all on public.factory_contacts for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_pricing_plans_all on public.pricing_plans for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_guides_all on public.guides for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy admin_contact_messages_all on public.contact_messages for all to authenticated using (private.is_admin()) with check (private.is_admin());

revoke execute on all functions in schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
revoke execute on function public.unlock_factory_contact(uuid) from public, anon;
grant execute on function public.unlock_factory_contact(uuid) to authenticated;
revoke execute on function public.search_verified_factories(text, text, text, integer, integer) from public;
grant execute on function public.search_verified_factories(text, text, text, integer, integer) to anon, authenticated;
revoke execute on function public.grant_stripe_credits(text, text, uuid, integer, text, text) from public, anon, authenticated;
grant execute on function public.grant_stripe_credits(text, text, uuid, integer, text, text) to service_role;
