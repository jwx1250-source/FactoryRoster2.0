begin;

alter table public.factories
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists internal_notes text,
  add column if not exists source_notes text;

alter table public.verification_records
  add column if not exists internal_note text;

alter table public.factory_contacts
  add column if not exists is_active boolean not null default true,
  add column if not exists internal_notes text;

alter table public.verification_requests
  add column if not exists internal_note text;

alter table public.contact_messages
  add column if not exists internal_note text,
  add column if not exists updated_at timestamptz not null default now();

update public.contact_messages
set status = case status
  when 'reviewed' then 'replied'
  when 'resolved' then 'replied'
  else status
end
where status in ('reviewed', 'resolved');

alter table public.contact_messages drop constraint if exists contact_messages_status_check;
alter table public.contact_messages
  add constraint contact_messages_status_check check (status in ('new', 'replied', 'archived'));

alter table public.credit_transactions drop constraint if exists credit_transactions_type_check;
alter table public.credit_transactions
  add constraint credit_transactions_type_check
  check (type in ('purchase', 'unlock', 'refund', 'adjustment', 'manual_adjustment'));

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function private.set_updated_at();

create index if not exists factories_chinese_name_trgm_idx
  on public.factories using gin (lower(chinese_name) gin_trgm_ops);
create index if not exists factories_record_id_trgm_idx
  on public.factories using gin (lower(record_id) gin_trgm_ops);
create index if not exists verification_requests_status_created_idx
  on public.verification_requests (status, created_at desc);
create index if not exists contact_messages_status_created_idx
  on public.contact_messages (status, created_at desc);

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
      ('factory_evidence', 'Factory Evidence', 3)
  )
  select coalesce(array_agg(required.label order by required.sort_order)
    filter (where verification_records.status is distinct from 'verified'), '{}'::text[])
  from required
  left join public.verification_records
    on verification_records.factory_id = p_factory_id
   and verification_records.verification_type = required.verification_type;
$$;

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
      raise exception 'Factory cannot be published until Government Registration, Business Contact, and Factory Evidence are all verified.'
        using detail = 'Cannot publish. Missing checks: ' || array_to_string(missing_checks, ', ');
    end if;
  end if;
  if new.is_indexable and (not new.is_published or length(trim(new.overview)) < 80 or cardinality(new.main_products) = 0) then
    raise exception 'An indexable factory must be published and contain sufficient public content';
  end if;
  return new;
end;
$$;

create or replace function private.create_factory_verification_placeholders()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.verification_records (factory_id, verification_type, status, verification_method, checked_items)
  values
    (new.id, 'government_registration', 'pending', 'Official public registry check',
      '{"registered_company_name":false,"unified_social_credit_code":false,"business_status":false,"registered_address":false}'::jsonb),
    (new.id, 'business_contact', 'pending', 'Manual phone/email check',
      '{"business_phone":false,"business_email":false,"contact_person":false,"contact_availability":false}'::jsonb),
    (new.id, 'factory_evidence', 'pending', 'Photo/video evidence review',
      '{"factory_exterior":false,"factory_signage":false,"workshop":false,"production_area":false,"warehouse_office_evidence":false}'::jsonb)
  on conflict (factory_id, verification_type) do nothing;
  return new;
end;
$$;

drop trigger if exists factory_create_verification_placeholders on public.factories;
create trigger factory_create_verification_placeholders
after insert on public.factories
for each row execute function private.create_factory_verification_placeholders();

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
    select 1 from public.factory_contacts c
    where c.factory_id = target_factory_id and c.is_active
  )
  where id = target_factory_id;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists factory_contact_availability_changed on public.factory_contacts;
create trigger factory_contact_availability_changed
after insert or update of factory_id, is_active or delete on public.factory_contacts
for each row execute function private.sync_factory_contact_availability();

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

  select c.* into contact_row
  from public.factory_contacts c
  join public.factories f on f.id = c.factory_id
  where c.factory_id = p_factory_id
    and c.is_active
    and f.is_published
  for update of c;

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

create or replace function public.admin_adjust_contact_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text default 'Admin manual credit adjustment'
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_balance integer;
  next_balance integer;
begin
  if p_amount = 0 then
    raise exception 'Credit adjustment must not be zero';
  end if;

  insert into public.credit_balances (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance into current_balance
  from public.credit_balances
  where user_id = p_user_id
  for update;

  next_balance := current_balance + p_amount;
  if next_balance < 0 then
    raise exception 'Credit balance cannot be negative';
  end if;

  update public.credit_balances
  set balance = next_balance
  where user_id = p_user_id;

  insert into public.credit_transactions (user_id, type, amount, description)
  values (p_user_id, 'manual_adjustment', p_amount, nullif(trim(p_description), ''));

  return next_balance;
end;
$$;

revoke execute on function private.factory_missing_verifications(uuid) from public, anon, authenticated;
revoke execute on function private.create_factory_verification_placeholders() from public, anon, authenticated;
revoke execute on function public.admin_adjust_contact_credits(uuid, integer, text) from public, anon, authenticated;
grant execute on function public.admin_adjust_contact_credits(uuid, integer, text) to service_role;

-- Row policies protect rows; column grants keep admin-only fields out of direct Data API reads.
revoke select on public.factories from anon, authenticated;
grant select (
  id, slug, company_name, chinese_name, record_id, industry_id, province, city, district,
  address_public, established_year, employee_range, factory_size, annual_revenue_range,
  main_products, capabilities, export_markets, certifications, trade_terms, moq, website_url,
  factory_type, overview, has_verified_contact, is_published, is_indexable, last_verified_at,
  seo_title, seo_description, created_at, updated_at
) on public.factories to anon, authenticated;

revoke select on public.verification_records from anon, authenticated;
grant select (
  id, factory_id, verification_type, status, checked_items, verification_method,
  verified_at, evidence_note, created_at, updated_at
) on public.verification_records to anon, authenticated;

revoke select on public.factory_contacts from authenticated;
grant select (
  id, factory_id, contact_person, position, verified_phone, verified_email, whatsapp, wechat,
  contact_verification_method, last_contact_verified_at, is_locked, is_active, created_at, updated_at
) on public.factory_contacts to authenticated;

revoke select on public.verification_requests from authenticated;
grant select (
  id, user_id, factory_id, factory_name, factory_profile_url, product_category, request_type,
  buyer_name, buyer_email, company_name, country, message, status, created_at, updated_at
) on public.verification_requests to authenticated;

commit;
