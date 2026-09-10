begin;

alter table public.industries
  add column if not exists parent_id uuid references public.industries(id) on delete restrict,
  add column if not exists primary_industry text,
  add column if not exists secondary_category text;

alter table public.industries drop constraint if exists industries_name_key;
create unique index if not exists industries_parent_name_key
  on public.industries (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), name);
create index if not exists industries_parent_sort_idx on public.industries (parent_id, sort_order, name);

-- Preserve legacy category records while promoting the requested first-batch taxonomy.
update public.industries set slug = 'consumer-electronics', name = 'Consumer Electronics', code = 'ELC' where slug = 'electronics';
update public.industries set slug = 'furniture-and-home', name = 'Furniture & Home', code = 'HOM' where slug = 'furniture';
update public.industries set slug = 'sports-and-outdoor', name = 'Sports & Outdoor', code = 'SPT' where slug = 'sports-goods';
update public.industries set slug = 'packaging-and-printing-cosmetic-packaging', code = 'COS' where slug = 'cosmetic-packaging';
update public.industries set slug = 'packaging-and-printing-paper-boxes', code = 'PPR' where slug = 'paper-boxes';
update public.industries set slug = 'packaging-and-printing-plastic-bottles', code = 'PBT' where slug = 'plastic-bottles';
update public.industries set slug = 'apparel-and-textiles-home-textiles', code = 'HTX' where slug = 'home-textiles';

insert into public.industries (id, slug, name, code, description, is_featured, sort_order, seo_title, seo_description) values
  ('11000000-0000-0000-0000-000000000001', 'consumer-electronics', 'Consumer Electronics', 'ELC', 'Devices and accessories for connected, mobile, audio, security, and computing products.', true, 1, 'Verified Consumer Electronics Suppliers in China', 'Find verified China consumer electronics manufacturers, distributors, exporters, and wholesalers.'),
  ('11000000-0000-0000-0000-000000000002', 'led-lighting', 'LED Lighting', 'LED', 'Residential, commercial, outdoor, solar, and smart lighting supply partners.', true, 2, 'Verified LED Lighting Suppliers in China', 'Find verified China LED lighting manufacturers, agents, exporters, and distributors.'),
  ('11000000-0000-0000-0000-000000000003', 'packaging-and-printing', 'Packaging & Printing', 'PKG', 'Primary, secondary, retail, food, flexible, and custom printed packaging.', true, 3, 'Verified Packaging and Printing Suppliers in China', 'Find verified China packaging and printing manufacturers, trading suppliers, and wholesalers.'),
  ('11000000-0000-0000-0000-000000000004', 'plastic-products', 'Plastic Products', 'PLS', 'Molded components, containers, household goods, storage, and custom plastic parts.', true, 4, 'Verified Plastic Product Suppliers in China', 'Find verified China plastic product manufacturers, exporters, and wholesalers.'),
  ('11000000-0000-0000-0000-000000000005', 'furniture-and-home', 'Furniture & Home', 'HOM', 'Furniture, storage, decor, bathroom, garden, and workspace products.', true, 5, 'Verified Furniture and Home Suppliers in China', 'Find verified China furniture and home product suppliers.'),
  ('11000000-0000-0000-0000-000000000006', 'beauty-and-personal-care', 'Beauty & Personal Care', 'BEA', 'Beauty tools, cosmetic accessories, hair tools, and personal care devices.', true, 6, 'Verified Beauty and Personal Care Suppliers in China', 'Find verified China beauty and personal care suppliers.'),
  ('11000000-0000-0000-0000-000000000007', 'kitchenware', 'Kitchenware', 'KIT', 'Cookware, drinkware, tableware, storage, tools, and compact appliances.', true, 7, 'Verified Kitchenware Suppliers in China', 'Find verified China kitchenware manufacturers, exporters, and wholesalers.'),
  ('11000000-0000-0000-0000-000000000008', 'pet-products', 'Pet Products', 'PET', 'Pet toys, bedding, feeding, walking, grooming, and cat or dog supplies.', true, 8, 'Verified Pet Product Suppliers in China', 'Find verified China pet product suppliers for samples, small batches, and standard orders.'),
  ('11000000-0000-0000-0000-000000000009', 'apparel-and-textiles', 'Apparel & Textiles', 'TEX', 'Finished apparel, bags, home textiles, and fabric supply partners.', true, 9, 'Verified Apparel and Textile Suppliers in China', 'Find verified China apparel and textile manufacturers, exporters, and trading suppliers.'),
  ('11000000-0000-0000-0000-000000000010', 'sports-and-outdoor', 'Sports & Outdoor', 'SPT', 'Fitness, yoga, camping, cycling, outdoor, and water sports products.', true, 10, 'Verified Sports and Outdoor Suppliers in China', 'Find verified China sports and outdoor product suppliers.')
on conflict (slug) do update set
  name = excluded.name, code = excluded.code, description = excluded.description,
  is_featured = excluded.is_featured, sort_order = excluded.sort_order,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description,
  parent_id = null, secondary_category = null, updated_at = now();

with category_seed(parent_slug, slug, name, sort_order) as (values
  ('consumer-electronics','consumer-electronics-phone-accessories','Phone Accessories',1),
  ('consumer-electronics','consumer-electronics-chargers-and-cables','Chargers & Cables',2),
  ('consumer-electronics','consumer-electronics-audio-devices','Audio Devices',3),
  ('consumer-electronics','consumer-electronics-smart-home-devices','Smart Home Devices',4),
  ('consumer-electronics','consumer-electronics-security-cameras','Security Cameras',5),
  ('consumer-electronics','consumer-electronics-computer-accessories','Computer Accessories',6),
  ('consumer-electronics','consumer-electronics-wearables','Wearables',7),
  ('led-lighting','led-lighting-led-bulbs','LED Bulbs',1),
  ('led-lighting','led-lighting-led-strip-lights','LED Strip Lights',2),
  ('led-lighting','led-lighting-led-panel-lights','LED Panel Lights',3),
  ('led-lighting','led-lighting-outdoor-lighting','Outdoor Lighting',4),
  ('led-lighting','led-lighting-solar-lights','Solar Lights',5),
  ('led-lighting','led-lighting-commercial-lighting','Commercial Lighting',6),
  ('led-lighting','led-lighting-smart-lighting','Smart Lighting',7),
  ('packaging-and-printing','packaging-and-printing-cosmetic-packaging','Cosmetic Packaging',1),
  ('packaging-and-printing','packaging-and-printing-paper-boxes','Paper Boxes',2),
  ('packaging-and-printing','packaging-and-printing-rigid-boxes','Rigid Boxes',3),
  ('packaging-and-printing','packaging-and-printing-mailer-boxes','Mailer Boxes',4),
  ('packaging-and-printing','packaging-and-printing-plastic-bottles','Plastic Bottles',5),
  ('packaging-and-printing','packaging-and-printing-labels-and-stickers','Labels & Stickers',6),
  ('packaging-and-printing','packaging-and-printing-flexible-packaging','Flexible Packaging',7),
  ('packaging-and-printing','packaging-and-printing-food-packaging','Food Packaging',8),
  ('plastic-products','plastic-products-plastic-bottles','Plastic Bottles',1),
  ('plastic-products','plastic-products-plastic-containers','Plastic Containers',2),
  ('plastic-products','plastic-products-injection-molded-parts','Injection Molded Parts',3),
  ('plastic-products','plastic-products-plastic-household-products','Plastic Household Products',4),
  ('plastic-products','plastic-products-plastic-packaging','Plastic Packaging',5),
  ('plastic-products','plastic-products-custom-plastic-parts','Custom Plastic Parts',6),
  ('plastic-products','plastic-products-storage-products','Storage Products',7),
  ('furniture-and-home','furniture-and-home-home-furniture','Home Furniture',1),
  ('furniture-and-home','furniture-and-home-outdoor-furniture','Outdoor Furniture',2),
  ('furniture-and-home','furniture-and-home-home-storage','Home Storage',3),
  ('furniture-and-home','furniture-and-home-home-decor','Home Decor',4),
  ('furniture-and-home','furniture-and-home-bathroom-accessories','Bathroom Accessories',5),
  ('furniture-and-home','furniture-and-home-garden-products','Garden Products',6),
  ('furniture-and-home','furniture-and-home-office-furniture','Office Furniture',7),
  ('beauty-and-personal-care','beauty-and-personal-care-beauty-tools','Beauty Tools',1),
  ('beauty-and-personal-care','beauty-and-personal-care-makeup-brushes','Makeup Brushes',2),
  ('beauty-and-personal-care','beauty-and-personal-care-nail-products','Nail Products',3),
  ('beauty-and-personal-care','beauty-and-personal-care-skincare-containers','Skincare Containers',4),
  ('beauty-and-personal-care','beauty-and-personal-care-perfume-bottles','Perfume Bottles',5),
  ('beauty-and-personal-care','beauty-and-personal-care-hair-tools','Hair Tools',6),
  ('beauty-and-personal-care','beauty-and-personal-care-personal-care-devices','Personal Care Devices',7),
  ('kitchenware','kitchenware-drinkware','Drinkware',1),
  ('kitchenware','kitchenware-cookware','Cookware',2),
  ('kitchenware','kitchenware-tableware','Tableware',3),
  ('kitchenware','kitchenware-kitchen-storage','Kitchen Storage',4),
  ('kitchenware','kitchenware-kitchen-tools','Kitchen Tools',5),
  ('kitchenware','kitchenware-small-kitchen-appliances','Small Kitchen Appliances',6),
  ('kitchenware','kitchenware-coffee-accessories','Coffee Accessories',7),
  ('pet-products','pet-products-pet-toys','Pet Toys',1),
  ('pet-products','pet-products-pet-beds','Pet Beds',2),
  ('pet-products','pet-products-pet-collars-and-leashes','Pet Collars & Leashes',3),
  ('pet-products','pet-products-pet-feeding-products','Pet Feeding Products',4),
  ('pet-products','pet-products-cat-products','Cat Products',5),
  ('pet-products','pet-products-dog-products','Dog Products',6),
  ('pet-products','pet-products-pet-grooming-products','Pet Grooming Products',7),
  ('apparel-and-textiles','apparel-and-textiles-activewear','Activewear',1),
  ('apparel-and-textiles','apparel-and-textiles-t-shirts','T-Shirts',2),
  ('apparel-and-textiles','apparel-and-textiles-children-clothing','Children Clothing',3),
  ('apparel-and-textiles','apparel-and-textiles-socks','Socks',4),
  ('apparel-and-textiles','apparel-and-textiles-underwear','Underwear',5),
  ('apparel-and-textiles','apparel-and-textiles-home-textiles','Home Textiles',6),
  ('apparel-and-textiles','apparel-and-textiles-fabrics','Fabrics',7),
  ('apparel-and-textiles','apparel-and-textiles-bags','Bags',8),
  ('sports-and-outdoor','sports-and-outdoor-fitness-equipment','Fitness Equipment',1),
  ('sports-and-outdoor','sports-and-outdoor-yoga-products','Yoga Products',2),
  ('sports-and-outdoor','sports-and-outdoor-camping-gear','Camping Gear',3),
  ('sports-and-outdoor','sports-and-outdoor-outdoor-products','Outdoor Products',4),
  ('sports-and-outdoor','sports-and-outdoor-bicycle-accessories','Bicycle Accessories',5),
  ('sports-and-outdoor','sports-and-outdoor-sports-goods','Sports Goods',6),
  ('sports-and-outdoor','sports-and-outdoor-water-sports-products','Water Sports Products',7)
)
insert into public.industries (slug, name, code, description, product_examples, is_featured, sort_order, parent_id, primary_industry, secondary_category)
select seed.slug, seed.name, 'SC-' || upper(substr(md5(seed.slug), 1, 7)),
  seed.name || ' suppliers within ' || parent.name || '.', array[seed.name], false, seed.sort_order,
  parent.id, parent.name, seed.name
from category_seed seed
join public.industries parent on parent.slug = seed.parent_slug
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, product_examples = excluded.product_examples,
  sort_order = excluded.sort_order, parent_id = excluded.parent_id,
  primary_industry = excluded.primary_industry, secondary_category = excluded.secondary_category,
  updated_at = now();

update public.industries set primary_industry = name, secondary_category = null where parent_id is null;
update public.industries child set primary_industry = parent.name, secondary_category = child.name
from public.industries parent where child.parent_id = parent.id;

alter table public.industries alter column primary_industry set not null;
alter table public.industries alter column code set default ('CAT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));
alter table public.industries drop constraint if exists industries_two_level_check;
alter table public.industries add constraint industries_two_level_check check (
  (parent_id is null and secondary_category is null and primary_industry = name) or
  (parent_id is not null and secondary_category = name)
);

create or replace function private.sync_industry_hierarchy_labels()
returns trigger language plpgsql set search_path = '' as $$
declare parent_record public.industries%rowtype;
begin
  if new.parent_id is null then
    new.primary_industry := new.name;
    new.secondary_category := null;
  else
    select * into parent_record from public.industries where id = new.parent_id;
    if parent_record.id is null or parent_record.parent_id is not null then
      raise exception 'Categories support exactly two levels';
    end if;
    new.primary_industry := parent_record.name;
    new.secondary_category := new.name;
  end if;
  return new;
end;
$$;

drop trigger if exists industries_sync_hierarchy_labels on public.industries;
create trigger industries_sync_hierarchy_labels
before insert or update of name, parent_id on public.industries
for each row execute function private.sync_industry_hierarchy_labels();

create or replace function private.sync_child_primary_industry_label()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.name is distinct from new.name and new.parent_id is null then
    update public.industries set primary_industry = new.name where parent_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists industries_sync_child_primary_label on public.industries;
create trigger industries_sync_child_primary_label
after update of name on public.industries
for each row execute function private.sync_child_primary_industry_label();

alter table public.factories
  add column if not exists secondary_category_id uuid references public.industries(id) on delete restrict;

update public.factories factory
set secondary_category_id = category.id, industry_id = category.parent_id
from public.industries category
where factory.industry_id = category.id and category.parent_id is not null;

create index if not exists factories_secondary_category_idx on public.factories (secondary_category_id) where is_published;

create or replace function private.validate_supplier_category_pair()
returns trigger language plpgsql set search_path = '' as $$
declare secondary_parent uuid;
begin
  if new.secondary_category_id is null then return new; end if;
  select parent_id into secondary_parent from public.industries where id = new.secondary_category_id;
  if secondary_parent is null or secondary_parent <> new.industry_id then
    raise exception 'Secondary category must belong to the selected primary industry';
  end if;
  return new;
end;
$$;

drop trigger if exists factories_validate_category_pair on public.factories;
create trigger factories_validate_category_pair
before insert or update of industry_id, secondary_category_id on public.factories
for each row execute function private.validate_supplier_category_pair();

alter table public.factories drop constraint if exists factories_supply_evidence_type_check;
alter table public.factories drop constraint if exists factories_supply_evidence_matches_supplier_type_check;
update public.factories set supply_evidence_type = 'brand_ownership_evidence' where supplier_type = 'brand_owner';
alter table public.factories add constraint factories_supply_evidence_type_check check (supply_evidence_type in (
  'factory_evidence','authorization_evidence','supplier_relationship_evidence','supply_chain_evidence',
  'export_evidence','inventory_evidence','fulfillment_evidence','showroom_evidence',
  'brand_ownership_evidence','service_capability_evidence'
));
alter table public.factories add constraint factories_supply_evidence_matches_supplier_type_check check (
  (supplier_type = 'manufacturer' and supply_evidence_type = 'factory_evidence') or
  (supplier_type = 'authorized_distributor' and supply_evidence_type = 'authorization_evidence') or
  (supplier_type = 'first_tier_agent' and supply_evidence_type in ('authorization_evidence','supplier_relationship_evidence')) or
  (supplier_type = 'trading_company' and supply_evidence_type = 'supply_chain_evidence') or
  (supplier_type = 'exporter' and supply_evidence_type = 'export_evidence') or
  (supplier_type = 'wholesaler' and supply_evidence_type in ('inventory_evidence','fulfillment_evidence','showroom_evidence')) or
  (supplier_type = 'brand_owner' and supply_evidence_type = 'brand_ownership_evidence') or
  (supplier_type = 'sourcing_service_provider' and supply_evidence_type = 'service_capability_evidence')
);

drop function if exists public.search_verified_suppliers(text,text,text,text,text,boolean,boolean,boolean,text,integer,integer);
create function public.search_verified_suppliers(
  p_query text default null,
  p_primary_industry_slug text default null,
  p_secondary_category_slug text default null,
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
  primary_industry_name text, primary_industry_slug text,
  secondary_category_name text, secondary_category_slug text,
  province text, city text, established_year integer, employee_range text,
  main_products text[], export_markets text[], last_verified_at timestamptz,
  overview text, has_verified_contact boolean, supplier_type text,
  supply_evidence_type text, moq_level text, supports_small_orders boolean,
  supports_sample_orders boolean, supports_private_label boolean, supply_model text
)
language sql stable security invoker set search_path = '' as $$
  select f.id, f.slug, f.company_name, f.record_id,
    primary_category.name, primary_category.slug,
    secondary_category.name, secondary_category.slug,
    f.province, f.city, f.established_year, f.employee_range,
    f.main_products, f.export_markets, f.last_verified_at, f.overview,
    f.has_verified_contact, f.supplier_type, f.supply_evidence_type, f.moq_level,
    f.supports_small_orders, f.supports_sample_orders, f.supports_private_label, f.supply_model
  from public.factories f
  join public.industries primary_category on primary_category.id = f.industry_id and primary_category.parent_id is null
  left join public.industries secondary_category on secondary_category.id = f.secondary_category_id
  where f.is_published
    and (p_primary_industry_slug is null or primary_category.slug = p_primary_industry_slug)
    and (p_secondary_category_slug is null or secondary_category.slug = p_secondary_category_slug)
    and (p_province is null or lower(f.province) = lower(p_province))
    and (p_supplier_type is null or f.supplier_type = p_supplier_type)
    and (p_moq_level is null or f.moq_level = p_moq_level)
    and (p_supports_small_orders is null or f.supports_small_orders = p_supports_small_orders)
    and (p_supports_sample_orders is null or f.supports_sample_orders = p_supports_sample_orders)
    and (p_supports_private_label is null or f.supports_private_label = p_supports_private_label)
    and (p_supply_model is null or f.supply_model = p_supply_model)
    and (select count(*) from public.verification_records verification
      where verification.factory_id = f.id
        and verification.status = 'verified'
        and verification.verification_type in ('government_registration','business_contact','supply_evidence')) = 3
    and (
      p_query is null or trim(p_query) = '' or
      lower(f.company_name) like '%' || lower(trim(p_query)) || '%' or
      lower(primary_category.name) like '%' || lower(trim(p_query)) || '%' or
      lower(coalesce(secondary_category.name, '')) like '%' || lower(trim(p_query)) || '%' or
      lower(f.province) like '%' || lower(trim(p_query)) || '%' or
      lower(f.city) like '%' || lower(trim(p_query)) || '%' or
      exists (select 1 from unnest(f.main_products) product where lower(product) like '%' || lower(trim(p_query)) || '%')
    )
  order by f.last_verified_at desc nulls last, f.company_name
  limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
$$;

grant select (secondary_category_id) on public.factories to anon, authenticated;
grant execute on function public.search_verified_suppliers(text,text,text,text,text,text,boolean,boolean,boolean,text,integer,integer) to anon, authenticated;
revoke execute on function private.validate_supplier_category_pair() from public, anon, authenticated;
revoke execute on function private.sync_industry_hierarchy_labels() from public, anon, authenticated;
revoke execute on function private.sync_child_primary_industry_label() from public, anon, authenticated;

commit;
