-- Cover foreign keys used by joins, deletes, and admin workflows.
create index if not exists contact_unlocks_factory_contact_id_idx
  on public.contact_unlocks (factory_contact_id);

create index if not exists credit_transactions_factory_id_idx
  on public.credit_transactions (factory_id)
  where factory_id is not null;

create index if not exists verification_records_verified_by_idx
  on public.verification_records (verified_by)
  where verified_by is not null;

create index if not exists verification_requests_factory_id_idx
  on public.verification_requests (factory_id)
  where factory_id is not null;
