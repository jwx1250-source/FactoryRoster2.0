-- Automated outreach controls. Sending is machine-gated by eligibility,
-- suppression, cadence, and provider configuration; no per-message review is required.

alter table public.prospect_accounts
  add column if not exists auto_outreach_enabled boolean not null default false,
  add column if not exists outreach_cadence_days smallint not null default 14
    check (outreach_cadence_days between 7 and 30);

alter table public.prospect_contacts
  add column if not exists next_contact_at timestamptz;

alter table public.email_deliveries
  add column if not exists sequence_no smallint not null default 1
    check (sequence_no between 1 and 3);

create index if not exists prospect_contacts_next_contact_idx
  on public.prospect_contacts (next_contact_at)
  where unsubscribed_at is null and suppressed_at is null;

create index if not exists email_deliveries_campaign_email_idx
  on public.email_deliveries (campaign, email, sequence_no desc);

grant update on public.prospect_contacts to service_role;
