-- FactoryRoster growth automation foundation.
-- Growth data is append-only and all user-owned records are protected by RLS.

create table if not exists public.growth_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in (
    'organic_landing','supplier_search','filter_applied','supplier_profile_view',
    'guide_cta_click','signup_started','signup_completed','checkout_started',
    'checkout_completed','contact_unlocked','supplier_saved','search_saved'
  )),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  session_id text,
  path text,
  referrer text,
  first_landing_path text,
  source_guide_slug text,
  source_industry_slug text,
  source_supplier_slug text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  entity_type text,
  entity_id text,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  idempotency_key text unique,
  created_at timestamptz not null default now()
);

create index if not exists growth_events_name_time_idx on public.growth_events (event_name, occurred_at desc);
create index if not exists growth_events_user_time_idx on public.growth_events (user_id, occurred_at desc);
create index if not exists growth_events_anon_time_idx on public.growth_events (anonymous_id, occurred_at desc);

create table if not exists public.visitor_attribution (
  visitor_id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  first_landing_path text,
  first_referrer text,
  first_utm_source text,
  first_utm_medium text,
  first_utm_campaign text,
  last_path text,
  last_referrer text,
  last_utm_source text,
  last_utm_medium text,
  last_utm_campaign text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.saved_suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  factory_id uuid not null references public.factories(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, factory_id)
);

create index if not exists saved_suppliers_user_created_idx on public.saved_suppliers (user_id, created_at desc);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Saved supplier search',
  filters jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_searches_user_active_idx on public.saved_searches (user_id, is_active, updated_at desc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  marketing_email_enabled boolean not null default true,
  supplier_alerts_enabled boolean not null default true,
  frequency text not null default 'weekly' check (frequency in ('immediate','weekly','off')),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_suppressions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  reason text not null check (reason in ('unsubscribe','bounce','complaint','manual')),
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  campaign text not null,
  dedupe_key text not null unique,
  status text not null default 'queued' check (status in ('queued','sent','failed','suppressed')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_page_snapshots (
  id uuid primary key default gen_random_uuid(),
  canonical_url text not null,
  page_type text not null check (page_type in ('industry','factory','guide','utility')),
  http_status integer,
  is_indexable boolean not null default false,
  canonical_target text,
  in_sitemap boolean not null default false,
  inbound_link_count integer not null default 0,
  click_depth integer,
  title text,
  h1 text,
  content_hash text,
  observed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (canonical_url, observed_at)
);

create index if not exists seo_page_snapshots_url_time_idx on public.seo_page_snapshots (canonical_url, observed_at desc);

create table if not exists public.growth_tasks (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type in ('seo_health','seo_opportunity','internal_link','data_gap','lifecycle_email','outreach_review')),
  dedupe_key text not null unique,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','approved','in_progress','completed','dismissed')),
  priority integer not null default 50 check (priority between 0 and 100),
  payload jsonb not null default '{}'::jsonb,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_tasks_status_priority_idx on public.growth_tasks (status, priority desc, created_at desc);

create table if not exists public.prospect_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  country_code text not null,
  industry text,
  website_url text,
  source text not null,
  source_collected_at timestamptz not null default now(),
  legal_basis text,
  outreach_status text not null default 'unreviewed' check (outreach_status in ('unreviewed','approved','paused','suppressed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.prospect_accounts(id) on delete cascade,
  email text not null,
  full_name text,
  role_title text,
  region text not null,
  source text not null,
  source_collected_at timestamptz not null default now(),
  legal_basis text,
  last_contacted_at timestamptz,
  unsubscribed_at timestamptz,
  suppressed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (account_id, email)
);

drop trigger if exists saved_searches_set_updated_at on public.saved_searches;
create trigger saved_searches_set_updated_at before update on public.saved_searches for each row execute function private.set_updated_at();
drop trigger if exists notification_preferences_set_updated_at on public.notification_preferences;
create trigger notification_preferences_set_updated_at before update on public.notification_preferences for each row execute function private.set_updated_at();
drop trigger if exists growth_tasks_set_updated_at on public.growth_tasks;
create trigger growth_tasks_set_updated_at before update on public.growth_tasks for each row execute function private.set_updated_at();
drop trigger if exists prospect_accounts_set_updated_at on public.prospect_accounts;
create trigger prospect_accounts_set_updated_at before update on public.prospect_accounts for each row execute function private.set_updated_at();

alter table public.growth_events enable row level security;
alter table public.visitor_attribution enable row level security;
alter table public.saved_suppliers enable row level security;
alter table public.saved_searches enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.email_suppressions enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.seo_page_snapshots enable row level security;
alter table public.growth_tasks enable row level security;
alter table public.prospect_accounts enable row level security;
alter table public.prospect_contacts enable row level security;

create policy saved_suppliers_owner_select on public.saved_suppliers for select to authenticated using ((select auth.uid()) = user_id);
create policy saved_suppliers_owner_insert on public.saved_suppliers for insert to authenticated with check ((select auth.uid()) = user_id);
create policy saved_suppliers_owner_delete on public.saved_suppliers for delete to authenticated using ((select auth.uid()) = user_id);
create policy saved_searches_owner_all on public.saved_searches for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy notification_preferences_owner_all on public.notification_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Growth events are written by trusted server code so browser clients cannot forge user IDs or payment facts.
revoke all on public.growth_events, public.visitor_attribution, public.email_suppressions, public.email_deliveries, public.seo_page_snapshots, public.growth_tasks, public.prospect_accounts, public.prospect_contacts from anon, authenticated;
grant select, insert, update on public.visitor_attribution to service_role;
grant select, insert on public.growth_events to service_role;
grant select, insert, update on public.email_deliveries to service_role;
grant select, insert on public.email_suppressions to service_role;
grant select, insert, update on public.seo_page_snapshots, public.growth_tasks to service_role;
grant select, insert, update on public.prospect_accounts, public.prospect_contacts to service_role;
grant select, insert, update, delete on public.saved_suppliers, public.saved_searches, public.notification_preferences to authenticated;
grant select, insert, update, delete on public.saved_suppliers, public.saved_searches, public.notification_preferences to service_role;

create or replace function public.record_growth_event(
  p_event_name text,
  p_user_id uuid default null,
  p_anonymous_id text default null,
  p_session_id text default null,
  p_path text default null,
  p_referrer text default null,
  p_first_landing_path text default null,
  p_source_guide_slug text default null,
  p_source_industry_slug text default null,
  p_source_supplier_slug text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_entity_type text default null,
  p_entity_id text default null,
  p_properties jsonb default '{}'::jsonb,
  p_idempotency_key text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare event_id uuid;
begin
  insert into public.growth_events (event_name,user_id,anonymous_id,session_id,path,referrer,first_landing_path,source_guide_slug,source_industry_slug,source_supplier_slug,utm_source,utm_medium,utm_campaign,entity_type,entity_id,properties,idempotency_key)
  values (p_event_name,p_user_id,p_anonymous_id,p_session_id,p_path,p_referrer,p_first_landing_path,p_source_guide_slug,p_source_industry_slug,p_source_supplier_slug,p_utm_source,p_utm_medium,p_utm_campaign,p_entity_type,p_entity_id,coalesce(p_properties,'{}'::jsonb),p_idempotency_key)
  on conflict (idempotency_key) do update set id = public.growth_events.id
  returning id into event_id;
  return event_id;
end;
$$;
revoke all on function public.record_growth_event(text,uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.record_growth_event(text,uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,jsonb,text) to service_role;
