drop index if exists public.credit_transactions_payment_intent_unique;

create unique index credit_transactions_payment_intent_unique
  on public.credit_transactions (payment_intent_id)
  where payment_intent_id is not null and type = 'purchase';
