begin;
create extension if not exists pgtap with schema extensions;

select plan(12);

select has_table('public', 'factories', 'factories table exists');
select has_table('public', 'factory_contacts', 'locked contacts table exists');
select has_table('public', 'contact_unlocks', 'contact unlock ledger exists');
select has_table('public', 'credit_transactions', 'credit transaction ledger exists');
select has_function('public', 'unlock_factory_contact', array['uuid'], 'atomic unlock function exists');
select has_function('public', 'grant_stripe_credits', array['text','text','uuid','integer','text','text'], 'idempotent Stripe credit function exists');

select ok((select relrowsecurity from pg_class where oid = 'public.factories'::regclass), 'factories has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.factory_contacts'::regclass), 'factory_contacts has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.credit_balances'::regclass), 'credit_balances has RLS enabled');

select ok(not has_table_privilege('anon', 'public.factory_contacts', 'SELECT'), 'anonymous users cannot select contacts');
select ok(not has_function_privilege('anon', 'public.unlock_factory_contact(uuid)', 'EXECUTE'), 'anonymous users cannot call unlock');
select ok(has_function_privilege('authenticated', 'public.unlock_factory_contact(uuid)', 'EXECUTE'), 'authenticated users can call unlock');

select * from finish();
rollback;
