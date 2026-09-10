begin;

alter table public.factories
  add column if not exists supplier_type text not null default 'manufacturer',
  add column if not exists supply_evidence_type text not null default 'factory_evidence',
  add column if not exists moq_level text not null default 'unknown',
  add column if not exists supports_small_orders boolean not null default false,
  add column if not exists supports_sample_orders boolean not null default false,
  add column if not exists supports_private_label boolean not null default false,
  add column if not exists supply_model text not null default 'factory_direct';

alter table public.factories
  drop constraint if exists factories_supplier_type_check,
  drop constraint if exists factories_supply_evidence_type_check,
  drop constraint if exists factories_moq_level_check,
  drop constraint if exists factories_supply_model_check,
  drop constraint if exists factories_supplier_evidence_compatibility_check;

alter table public.factories
  add constraint factories_supplier_type_check check (supplier_type in (
    'manufacturer', 'authorized_distributor', 'first_tier_agent', 'trading_company',
    'exporter', 'wholesaler', 'brand_owner', 'sourcing_service_provider'
  )),
  add constraint factories_supply_evidence_type_check check (supply_evidence_type in (
    'factory_evidence', 'authorization_evidence', 'supplier_relationship_evidence',
    'supply_chain_evidence', 'export_evidence', 'inventory_evidence',
    'fulfillment_evidence', 'showroom_evidence', 'service_capability_evidence'
  )),
  add constraint factories_moq_level_check check (moq_level in (
    'sample_supported', 'low_moq', 'standard_moq', 'bulk_only', 'unknown'
  )),
  add constraint factories_supply_model_check check (supply_model in (
    'factory_direct', 'authorized_distribution', 'first_tier_agent',
    'wholesale_inventory', 'export_trading', 'sourcing_service'
  )),
  add constraint factories_supplier_evidence_compatibility_check check (
    (supplier_type = 'manufacturer' and supply_evidence_type = 'factory_evidence') or
    (supplier_type = 'authorized_distributor' and supply_evidence_type = 'authorization_evidence') or
    (supplier_type = 'first_tier_agent' and supply_evidence_type in ('authorization_evidence', 'supplier_relationship_evidence')) or
    (supplier_type = 'trading_company' and supply_evidence_type = 'supply_chain_evidence') or
    (supplier_type = 'exporter' and supply_evidence_type = 'export_evidence') or
    (supplier_type = 'wholesaler' and supply_evidence_type in ('inventory_evidence', 'fulfillment_evidence', 'showroom_evidence')) or
    (supplier_type = 'brand_owner' and supply_evidence_type in ('authorization_evidence', 'supplier_relationship_evidence')) or
    (supplier_type = 'sourcing_service_provider' and supply_evidence_type = 'service_capability_evidence')
  );

alter table public.verification_records
  add column if not exists evidence_references text[] not null default '{}';

alter table public.verification_records
  drop constraint if exists verification_records_verification_type_check,
  drop constraint if exists verification_records_check;

drop trigger if exists verification_change_unpublishes_factory on public.verification_records;

update public.verification_records
set verification_type = 'supply_evidence'
where verification_type = 'factory_evidence';

-- Older checks without an evidence note cannot remain verified under the stronger model.
update public.verification_records
set status = 'pending'
where status = 'verified'
  and (
    nullif(trim(verification_method), '') is null or
    nullif(trim(evidence_note), '') is null or
    verified_at is null
  );

alter table public.verification_records
  add constraint verification_records_verification_type_check check (
    verification_type in ('government_registration', 'business_contact', 'supply_evidence')
  ),
  add constraint verification_records_verified_metadata_check check (
    status <> 'verified' or (
      verified_at is not null and
      nullif(trim(verification_method), '') is not null and
      nullif(trim(evidence_note), '') is not null
    )
  );

create index if not exists factories_supplier_type_idx
  on public.factories (supplier_type) where is_published;
create index if not exists factories_supply_model_idx
  on public.factories (supply_model) where is_published;
create index if not exists factories_moq_level_idx
  on public.factories (moq_level) where is_published;

create or replace function private.factory_missing_verifications(p_factory_id uuid)
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  with required(verification_type, label, sort_order) as (
    values
      ('government_registration', 'Government Registration', 1),
      ('business_contact', 'Business Contact', 2),
      ('supply_evidence', 'Supply Evidence', 3)
  )
  select coalesce(array_agg(required.label order by required.sort_order)
    filter (where verification_records.status is distinct from 'verified'), '{}'::text[])
  from required
  left join public.verification_records
    on verification_records.factory_id = p_factory_id
   and verification_records.verification_type = required.verification_type;
$$;

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
    and verification_type in ('government_registration', 'business_contact', 'supply_evidence');
$$;

create trigger verification_change_unpublishes_factory
after insert or update or delete on public.verification_records
for each row execute function private.unpublish_factory_after_verification_change();

update public.factories
set is_published = false, is_indexable = false
where (is_published or is_indexable)
  and not private.factory_has_all_verifications(id);

create or replace function private.enforce_factory_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  missing_checks text[];
begin
  if new.is_published then
    missing_checks := private.factory_missing_verifications(new.id);
    if cardinality(missing_checks) > 0 then
      raise exception 'Supplier cannot be published until Government Registration, Business Contact, and Supply Evidence are all verified.'
        using detail = 'Cannot publish. Missing checks: ' || array_to_string(missing_checks, ', ');
    end if;
  end if;
  if new.is_indexable and (not new.is_published or length(trim(new.overview)) < 80 or cardinality(new.main_products) = 0) then
    raise exception 'An indexable supplier must be published and contain sufficient public content';
  end if;
  return new;
end;
$$;

drop trigger if exists factories_enforce_publication on public.factories;
create trigger factories_enforce_publication
before insert or update of is_published, is_indexable, supplier_type, supply_evidence_type on public.factories
for each row execute function private.enforce_factory_publication();

create or replace function private.reset_supply_evidence_after_supplier_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.supplier_type is distinct from new.supplier_type
     or old.supply_evidence_type is distinct from new.supply_evidence_type then
    update public.verification_records
    set status = 'pending'
    where factory_id = new.id and verification_type = 'supply_evidence';
  end if;
  return new;
end;
$$;

drop trigger if exists factories_reset_supply_evidence on public.factories;
create trigger factories_reset_supply_evidence
after update of supplier_type, supply_evidence_type on public.factories
for each row execute function private.reset_supply_evidence_after_supplier_change();

create or replace function private.create_factory_verification_placeholders()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.verification_records (factory_id, verification_type, status, checked_items)
  values
    (new.id, 'government_registration', 'pending',
      '{"registered_company_name":false,"unified_social_credit_code":false,"business_status":false,"registered_address":false}'::jsonb),
    (new.id, 'business_contact', 'pending',
      '{"business_phone":false,"business_email":false,"contact_person":false,"contact_availability":false}'::jsonb),
    (new.id, 'supply_evidence', 'pending',
      '{"evidence_source":false,"relationship_or_capability":false,"evidence_current":false}'::jsonb)
  on conflict (factory_id, verification_type) do nothing;
  return new;
end;
$$;

create or replace function private.sync_factory_last_verified_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_factory_id uuid;
  completed_at timestamptz;
begin
  target_factory_id := case when tg_op = 'DELETE' then old.factory_id else new.factory_id end;
  select case
    when count(*) filter (where status = 'verified') = 3 then max(verified_at)
    else null
  end into completed_at
  from public.verification_records
  where factory_id = target_factory_id
    and verification_type in ('government_registration', 'business_contact', 'supply_evidence');
  update public.factories
  set last_verified_at = completed_at
  where id = target_factory_id and last_verified_at is distinct from completed_at;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

update public.factories factory
set last_verified_at = (
  select case when count(*) filter (where verification.status = 'verified') = 3
    then max(verification.verified_at) else null end
  from public.verification_records verification
  where verification.factory_id = factory.id
    and verification.verification_type in ('government_registration', 'business_contact', 'supply_evidence')
);

create or replace function public.search_verified_suppliers(
  p_query text default null,
  p_industry_slug text default null,
  p_province text default null,
  p_supplier_type text default null,
  p_moq_level text default null,
  p_supports_small_orders boolean default null,
  p_supports_sample_orders boolean default null,
  p_supports_private_label boolean default null,
  p_supply_model text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns table (
  id uuid, slug text, company_name text, record_id text,
  industry_name text, industry_slug text, province text, city text,
  established_year integer, employee_range text, main_products text[], export_markets text[],
  last_verified_at timestamptz, overview text, has_verified_contact boolean,
  supplier_type text, supply_evidence_type text, moq_level text,
  supports_small_orders boolean, supports_sample_orders boolean,
  supports_private_label boolean, supply_model text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    f.id, f.slug, f.company_name, f.record_id, i.name, i.slug, f.province, f.city,
    f.established_year, f.employee_range, f.main_products, f.export_markets,
    f.last_verified_at, f.overview, f.has_verified_contact,
    f.supplier_type, f.supply_evidence_type, f.moq_level,
    f.supports_small_orders, f.supports_sample_orders,
    f.supports_private_label, f.supply_model
  from public.factories f
  join public.industries i on i.id = f.industry_id
  where f.is_published
    and (p_industry_slug is null or i.slug = p_industry_slug)
    and (p_province is null or lower(f.province) = lower(p_province))
    and (p_supplier_type is null or f.supplier_type = p_supplier_type)
    and (p_moq_level is null or f.moq_level = p_moq_level)
    and (p_supports_small_orders is null or f.supports_small_orders = p_supports_small_orders)
    and (p_supports_sample_orders is null or f.supports_sample_orders = p_supports_sample_orders)
    and (p_supports_private_label is null or f.supports_private_label = p_supports_private_label)
    and (p_supply_model is null or f.supply_model = p_supply_model)
    and (
      p_query is null or trim(p_query) = '' or
      lower(f.company_name) like '%' || lower(trim(p_query)) || '%' or
      lower(i.name) like '%' || lower(trim(p_query)) || '%' or
      lower(f.province) like '%' || lower(trim(p_query)) || '%' or
      lower(f.city) like '%' || lower(trim(p_query)) || '%' or
      exists (select 1 from unnest(f.main_products) product where lower(product) like '%' || lower(trim(p_query)) || '%')
    )
  order by f.last_verified_at desc nulls last, f.company_name
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;

grant select (
  supplier_type, supply_evidence_type, moq_level, supports_small_orders,
  supports_sample_orders, supports_private_label, supply_model
) on public.factories to anon, authenticated;
grant execute on function public.search_verified_suppliers(text,text,text,text,text,boolean,boolean,boolean,text,integer,integer)
  to anon, authenticated;

revoke execute on function private.factory_missing_verifications(uuid) from public, anon, authenticated;
revoke execute on function private.factory_has_all_verifications(uuid) from public, anon, authenticated;
revoke execute on function private.create_factory_verification_placeholders() from public, anon, authenticated;
revoke execute on function private.sync_factory_last_verified_at() from public, anon, authenticated;
revoke execute on function private.reset_supply_evidence_after_supplier_change() from public, anon, authenticated;

commit;
