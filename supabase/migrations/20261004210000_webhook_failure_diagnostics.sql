create table if not exists public.stripe_webhook_failures (
  id bigint generated always as identity primary key,
  event_id text not null,
  event_type text not null,
  error_message text not null,
  created_at timestamptz not null default now()
);

create index if not exists stripe_webhook_failures_created_at_idx
  on public.stripe_webhook_failures (created_at desc);

alter table public.stripe_webhook_failures enable row level security;
revoke all on public.stripe_webhook_failures from anon, authenticated;
revoke all on sequence public.stripe_webhook_failures_id_seq from anon, authenticated;
grant insert, select on public.stripe_webhook_failures to service_role;
grant usage, select on sequence public.stripe_webhook_failures_id_seq to service_role;
