begin;
create extension if not exists pgtap with schema extensions;

select plan(29);

select has_table('public', 'factories', 'factories table exists');
select has_table('public', 'factory_contacts', 'locked contacts table exists');
select has_table('public', 'contact_unlocks', 'contact unlock ledger exists');
select has_table('public', 'credit_transactions', 'credit transaction ledger exists');
select has_function('public', 'unlock_factory_contact', array['uuid'], 'atomic unlock function exists');
select has_function('public', 'grant_stripe_credits', array['text','text','uuid','integer','text','text'], 'idempotent Stripe credit function exists');
select has_function('public', 'admin_adjust_contact_credits', array['uuid','integer','text'], 'manual credit adjustment function exists');
select has_column('public', 'factories', 'internal_notes', 'factories have internal notes');
select has_column('public', 'factory_contacts', 'is_active', 'contacts can be deactivated');
select has_column('public', 'factories', 'supplier_type', 'supplier type is recorded');
select has_column('public', 'factories', 'supply_evidence_type', 'supply evidence type is recorded');
select has_column('public', 'factories', 'moq_level', 'MOQ fit is recorded');
select has_column('public', 'factories', 'supports_small_orders', 'small order support is recorded');
select has_column('public', 'factories', 'supports_sample_orders', 'sample order support is recorded');
select has_column('public', 'factories', 'supports_private_label', 'private label support is recorded');
select has_column('public', 'factories', 'supply_model', 'supply model is recorded');
select has_column('public', 'factories', 'secondary_category_id', 'suppliers have a secondary category');
select has_column('public', 'industries', 'parent_id', 'categories have a parent relationship');
select has_column('public', 'industries', 'primary_industry', 'primary industry label is recorded');
select has_column('public', 'industries', 'secondary_category', 'secondary category label is recorded');
select has_function('public', 'search_verified_suppliers', array['text','text','text','text','text','text','boolean','boolean','boolean','text','integer','integer'], 'supplier search supports two-level categories');

select ok((select relrowsecurity from pg_class where oid = 'public.factories'::regclass), 'factories has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.factory_contacts'::regclass), 'factory_contacts has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.credit_balances'::regclass), 'credit_balances has RLS enabled');

select ok(not has_table_privilege('anon', 'public.factory_contacts', 'SELECT'), 'anonymous users cannot select contacts');
select ok(not has_function_privilege('anon', 'public.unlock_factory_contact(uuid)', 'EXECUTE'), 'anonymous users cannot call unlock');
select ok(has_function_privilege('authenticated', 'public.unlock_factory_contact(uuid)', 'EXECUTE'), 'authenticated users can call unlock');
select ok(not has_function_privilege('authenticated', 'public.admin_adjust_contact_credits(uuid,integer,text)', 'EXECUTE'), 'members cannot adjust credits');
select ok(has_function_privilege('service_role', 'public.admin_adjust_contact_credits(uuid,integer,text)', 'EXECUTE'), 'service role can adjust credits');

select * from finish();
rollback;
