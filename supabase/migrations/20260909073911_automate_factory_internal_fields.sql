begin;

create sequence if not exists private.factory_record_number_seq;

grant usage on schema private to service_role;
grant usage, select on sequence private.factory_record_number_seq to service_role;

create or replace function private.populate_factory_system_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  sequence_number bigint;
  slug_base text;
begin
  if tg_op = 'UPDATE' then
    new.record_id := old.record_id;
    new.slug := old.slug;
    return new;
  end if;

  if nullif(trim(new.record_id), '') is null or nullif(trim(new.slug), '') is null then
    sequence_number := nextval('private.factory_record_number_seq');
  end if;

  if nullif(trim(new.record_id), '') is null then
    new.record_id := 'FR-' || to_char(current_date, 'YYYY') || '-' || lpad(sequence_number::text, 6, '0');
  end if;

  if nullif(trim(new.slug), '') is null then
    slug_base := trim(both '-' from regexp_replace(lower(new.company_name), '[^a-z0-9]+', '-', 'g'));
    if slug_base = '' then slug_base := 'factory'; end if;
    new.slug := slug_base || '-' || lpad(sequence_number::text, 6, '0');
  end if;

  return new;
end;
$$;

drop trigger if exists factories_populate_system_fields on public.factories;
create trigger factories_populate_system_fields
before insert or update of record_id, slug on public.factories
for each row execute function private.populate_factory_system_fields();

create or replace function private.populate_verification_system_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'verified' then
    if tg_op = 'INSERT' or old.status is distinct from 'verified' then
      new.verified_at := now();
      new.verified_by := coalesce((select auth.uid()), new.verified_by);
    else
      new.verified_at := old.verified_at;
      new.verified_by := old.verified_by;
    end if;
  else
    new.verified_at := null;
    new.verified_by := null;
  end if;
  return new;
end;
$$;

drop trigger if exists verification_records_populate_system_fields on public.verification_records;
create trigger verification_records_populate_system_fields
before insert or update of status, verified_at, verified_by on public.verification_records
for each row execute function private.populate_verification_system_fields();

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
  end
  into completed_at
  from public.verification_records
  where factory_id = target_factory_id
    and verification_type in ('government_registration', 'business_contact', 'factory_evidence');

  update public.factories
  set last_verified_at = completed_at
  where id = target_factory_id
    and last_verified_at is distinct from completed_at;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists verification_records_sync_factory_last_verified on public.verification_records;
create trigger verification_records_sync_factory_last_verified
after insert or update of status, verified_at or delete on public.verification_records
for each row execute function private.sync_factory_last_verified_at();

update public.factories factory
set last_verified_at = (
  select case
    when count(*) filter (where verification.status = 'verified') = 3 then max(verification.verified_at)
    else null
  end
  from public.verification_records verification
  where verification.factory_id = factory.id
    and verification.verification_type in ('government_registration', 'business_contact', 'factory_evidence')
);

revoke execute on function private.populate_factory_system_fields() from public, anon, authenticated;
revoke execute on function private.populate_verification_system_fields() from public, anon, authenticated;
revoke execute on function private.sync_factory_last_verified_at() from public, anon, authenticated;

commit;
