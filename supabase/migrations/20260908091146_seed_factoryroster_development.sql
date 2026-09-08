insert into public.industries (id, slug, name, code, description, product_examples, common_regions, is_featured, sort_order, seo_title, seo_description) values
  ('10000000-0000-0000-0000-000000000001', 'led-lighting', 'LED Lighting', 'LED', 'Manufacturers of commercial, residential, architectural, and industrial LED lighting products.', array['LED bulbs','strip lights','panel lights','street lights'], array['Shenzhen','Zhongshan','Dongguan'], true, 1, 'Verified LED Lighting Manufacturers in China', 'Search verified China LED lighting manufacturers and structured factory records.'),
  ('10000000-0000-0000-0000-000000000002', 'cosmetic-packaging', 'Cosmetic Packaging', 'PKG', 'Factories producing primary and secondary packaging for cosmetics and personal care products.', array['airless bottles','jars','droppers','tubes'], array['Guangzhou','Ningbo','Shaoxing'], true, 2, null, null),
  ('10000000-0000-0000-0000-000000000003', 'paper-boxes', 'Paper Boxes', 'PPR', 'Paper packaging factories serving retail, gift, cosmetic, and food applications.', array['folding cartons','rigid boxes','gift boxes'], array['Dongguan','Shanghai','Wenzhou'], true, 3, null, null),
  ('10000000-0000-0000-0000-000000000004', 'plastic-bottles', 'Plastic Bottles', 'PLS', 'Plastic container and bottle manufacturers for consumer and industrial applications.', array['PET bottles','HDPE bottles','dispensing bottles'], array['Ningbo','Taizhou','Guangzhou'], true, 4, null, null),
  ('10000000-0000-0000-0000-000000000005', 'furniture', 'Furniture', 'FRN', 'Furniture manufacturers covering residential, hospitality, office, and outdoor products.', array['chairs','tables','cabinets','sofas'], array['Foshan','Dongguan','Bazhou'], true, 5, null, null),
  ('10000000-0000-0000-0000-000000000006', 'kitchenware', 'Kitchenware', 'KIT', 'Factories manufacturing cookware, utensils, food storage, and kitchen accessories.', array['cookware','utensils','storage containers'], array['Yongkang','Yangjiang','Chaozhou'], true, 6, null, null),
  ('10000000-0000-0000-0000-000000000007', 'pet-products', 'Pet Products', 'PET', 'Manufacturers of pet accessories, feeding products, grooming tools, and toys.', array['pet toys','feeders','beds','grooming tools'], array['Yiwu','Ningbo','Dongguan'], true, 7, null, null),
  ('10000000-0000-0000-0000-000000000008', 'sports-goods', 'Sports Goods', 'SPT', 'Factories producing fitness, outdoor, team sport, and recreation products.', array['fitness accessories','protective gear','outdoor products'], array['Dongguan','Quanzhou','Nantong'], true, 8, null, null),
  ('10000000-0000-0000-0000-000000000009', 'electronics', 'Electronics', 'ELC', 'Electronics manufacturers covering consumer devices, accessories, and assemblies.', array['chargers','smart devices','electronic assemblies'], array['Shenzhen','Dongguan','Huizhou'], true, 9, null, null),
  ('10000000-0000-0000-0000-000000000010', 'home-textiles', 'Home Textiles', 'TEX', 'Factories producing bedding, towels, curtains, and other finished home textile products.', array['bedding','towels','curtains','cushions'], array['Nantong','Shaoxing','Hangzhou'], true, 10, null, null)
on conflict (slug) do update set name = excluded.name, description = excluded.description, updated_at = now();

insert into public.factories (
  id, slug, company_name, chinese_name, record_id, industry_id, province, city, district,
  address_public, established_year, employee_range, factory_size, annual_revenue_range,
  main_products, capabilities, export_markets, certifications, trade_terms, moq, factory_type,
  overview, is_published, is_indexable, last_verified_at
) values
  ('20000000-0000-0000-0000-000000000001', 'shenzhen-luminos-technology', 'Shenzhen Luminos Technology Co., Ltd.', '深圳市明诺斯科技有限公司', 'FR-GD-08241', '10000000-0000-0000-0000-000000000001', 'Guangdong', 'Shenzhen', 'Baoan', 'Baoan District, Shenzhen, Guangdong', 2012, '100–199', '8,000–10,000 m²', 'US$10–25M', array['LED strip lights','linear lighting','smart controllers'], array['SMT assembly','aluminum extrusion','photometric testing','OEM packaging'], array['North America','Western Europe','Australia'], array['ISO 9001','CE','RoHS'], array['FOB','EXW'], '500 units', 'Manufacturer', 'A vertically integrated LED lighting manufacturer focused on commercial linear systems, strip lighting, and smart control assemblies for export markets.', false, false, '2026-09-04T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000002', 'zhongshan-aurora-optoelectronics', 'Zhongshan Aurora Optoelectronics Co., Ltd.', '中山市奥若拉光电有限公司', 'FR-GD-08218', '10000000-0000-0000-0000-000000000001', 'Guangdong', 'Zhongshan', 'Guzhen', 'Guzhen Town, Zhongshan, Guangdong', 2010, '200–299', '12,000–15,000 m²', 'US$25–50M', array['LED downlights','track lights','ceiling lights'], array['die casting','powder coating','aging testing'], array['European Union','Middle East','South America'], array['ISO 9001','CE'], array['FOB','CIF'], '300 units', 'Manufacturer', 'An export-oriented lighting factory producing architectural downlights, track fixtures, and ceiling products with in-house metal processing and testing.', false, false, '2026-09-03T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000003', 'dongguan-nova-led-systems', 'Dongguan Nova LED Systems Ltd.', '东莞市诺华照明系统有限公司', 'FR-GD-08197', '10000000-0000-0000-0000-000000000001', 'Guangdong', 'Dongguan', 'Changan', 'Changan Town, Dongguan, Guangdong', 2015, '50–99', '5,000–8,000 m²', 'US$5–10M', array['LED panel lights','troffers','emergency lights'], array['sheet metal fabrication','driver assembly','burn-in testing'], array['United States','Canada','Southeast Asia'], array['ETL','DLC','CE'], array['FOB'], '200 units', 'Manufacturer', 'A commercial lighting systems factory specializing in panel lights, troffers, and emergency products for North American and Southeast Asian projects.', false, false, '2026-09-02T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000004', 'foshan-everbright-lighting', 'Foshan Everbright Lighting Manufacturing Co., Ltd.', '佛山市恒耀照明制造有限公司', 'FR-GD-08176', '10000000-0000-0000-0000-000000000001', 'Guangdong', 'Foshan', 'Nanhai', 'Nanhai District, Foshan, Guangdong', 2008, '300–499', '20,000–25,000 m²', 'US$50–100M', array['LED street lights','high bay lights','flood lights'], array['die casting','CNC machining','IP testing','lighting design'], array['Africa','Middle East','Latin America'], array['ISO 9001','ENEC','CE'], array['FOB','CIF'], '100 units', 'Manufacturer', 'A large-scale outdoor and industrial lighting manufacturer with in-house die casting, machining, environmental testing, and project engineering capabilities.', false, false, '2026-09-01T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000005', 'huizhou-luma-components', 'Huizhou Luma Components Technology Co., Ltd.', '惠州市路玛元件科技有限公司', 'FR-GD-08155', '10000000-0000-0000-0000-000000000001', 'Guangdong', 'Huizhou', 'Huiyang', 'Huiyang District, Huizhou, Guangdong', 2017, '50–99', '4,000–6,000 m²', 'US$5–10M', array['LED drivers','dimming modules','lighting PCBs'], array['SMT assembly','firmware testing','custom driver design'], array['Western Europe','Japan','South Korea'], array['ISO 9001','RoHS'], array['EXW','FOB'], '1,000 units', 'Manufacturer', 'An electronics-focused lighting component factory producing constant-current drivers, dimming modules, and assembled lighting control boards.', false, false, '2026-08-30T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000006', 'ningbo-sealight-electrical', 'Ningbo Sealight Electrical Co., Ltd.', '宁波海光电器有限公司', 'FR-ZJ-08138', '10000000-0000-0000-0000-000000000001', 'Zhejiang', 'Ningbo', 'Cixi', 'Cixi, Ningbo, Zhejiang', 2011, '100–199', '10,000–12,000 m²', 'US$10–25M', array['LED work lights','portable lights','inspection lamps'], array['plastic injection','cable assembly','waterproof testing'], array['Germany','United Kingdom','North America'], array['BSCI','CE','GS'], array['FOB'], '500 units', 'Manufacturer', 'A portable and professional work-light factory with injection molding, cable assembly, waterproof testing, and private-label packaging under one roof.', false, false, '2026-08-29T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000007', 'xiamen-terra-illumination', 'Xiamen Terra Illumination Co., Ltd.', '厦门市泰瑞照明有限公司', 'FR-FJ-08122', '10000000-0000-0000-0000-000000000001', 'Fujian', 'Xiamen', 'TongAn', 'Tongan District, Xiamen, Fujian', 2014, '100–199', '7,000–9,000 m²', 'US$10–25M', array['horticulture lights','grow light bars','greenhouse controllers'], array['spectrum design','thermal testing','controller assembly'], array['North America','Netherlands','Australia'], array['UL','CE','RoHS'], array['FOB','DDP'], '100 units', 'Manufacturer', 'A specialist horticulture lighting factory developing grow-light bars and greenhouse control products with spectrum, thermal, and lifetime testing.', false, false, '2026-08-28T08:00:00Z'),
  ('20000000-0000-0000-0000-000000000008', 'suzhou-precision-lighting', 'Suzhou Precision Lighting Devices Co., Ltd.', '苏州市精锐照明器件有限公司', 'FR-JS-08109', '10000000-0000-0000-0000-000000000001', 'Jiangsu', 'Suzhou', 'Wujiang', 'Wujiang District, Suzhou, Jiangsu', 2009, '200–299', '14,000–18,000 m²', 'US$25–50M', array['cleanroom luminaires','industrial linear lights','custom fixtures'], array['sheet metal fabrication','cleanroom assembly','IES testing'], array['European Union','Singapore','United States'], array['ISO 9001','ISO 14001','CE'], array['FOB','CIF'], '100 units', 'Manufacturer', 'A precision commercial and industrial lighting factory producing cleanroom luminaires, linear fixtures, and engineered products for project-based buyers.', false, false, '2026-08-27T08:00:00Z')
on conflict (slug) do update set overview = excluded.overview, main_products = excluded.main_products, updated_at = now();

insert into public.verification_records (factory_id, verification_type, status, checked_items, verification_method, verified_at, evidence_note)
select f.id, v.verification_type, 'verified', v.checked_items, v.method, f.last_verified_at, v.note
from public.factories f
cross join (values
  ('government_registration', '{"legal_entity":true,"registration_status":"active"}'::jsonb, 'Official business registry review', 'Legal entity and active registration status confirmed.'),
  ('business_contact', '{"phone":true,"email":true,"named_contact":true}'::jsonb, 'Manual phone and email check', 'Business contact channels were manually checked.'),
  ('factory_evidence', '{"facility_photos":true,"production_video":true}'::jsonb, 'Facility evidence review', 'Facility media and production evidence reviewed.')
) as v(verification_type, checked_items, method, note)
where f.industry_id = '10000000-0000-0000-0000-000000000001'
on conflict (factory_id, verification_type) do update set status = 'verified', checked_items = excluded.checked_items, verified_at = excluded.verified_at;

update public.factories
set is_published = true, is_indexable = true
where industry_id = '10000000-0000-0000-0000-000000000001';

insert into public.factory_contacts (
  factory_id, contact_person, position, verified_phone, verified_email, whatsapp, wechat,
  contact_verification_method, last_contact_verified_at
)
select f.id,
  'Sample Contact ' || right(f.record_id, 2),
  'Export Department',
  '+86 000 0000 ' || right(replace(f.record_id, '-', ''), 4),
  replace(f.slug, '-', '.') || '@example.com',
  '+86 000 0000 ' || right(replace(f.record_id, '-', ''), 4),
  'sample_' || replace(f.slug, '-', '_'),
  'Development seed — manually checked sample record',
  f.last_verified_at
from public.factories f
where f.industry_id = '10000000-0000-0000-0000-000000000001'
on conflict (factory_id) do update set last_contact_verified_at = excluded.last_contact_verified_at;

insert into public.pricing_plans (slug, name, price_usd, credits, type) values
  ('starter', 'Starter', 9.90, 3, 'credit_pack'),
  ('business', 'Business', 29.90, 15, 'credit_pack'),
  ('pro', 'Pro', 99.00, 60, 'credit_pack'),
  ('sourcing-membership', 'Sourcing Membership', 199.00, 100, 'membership')
on conflict (slug) do update set price_usd = excluded.price_usd, credits = excluded.credits, type = excluded.type, updated_at = now();

insert into public.guides (slug, title, topic, summary, content, read_time, seo_title, seo_description, is_published, published_at) values
  ('find-verified-china-manufacturers', 'How to Find Verified China Manufacturers', 'Factory Search', 'A practical workflow for building a supplier shortlist from verified factory records.', 'Start with a precise product or industry query. Review each factory record, its verification status, manufacturing capabilities, and export-market experience before unlocking contact details. Verification supports research, but buyers must still perform product, contract, inspection, and payment due diligence.', 8, 'How to Find Verified China Manufacturers', 'Build a China manufacturer shortlist using verified factory intelligence.', true, '2026-09-01T08:00:00Z'),
  ('how-factory-verification-works', 'How Factory Verification Works', 'Verification', 'Understand the three checks required before a factory is publicly listed.', 'FactoryRoster requires Government Registration, Business Contact, and Factory Evidence checks. A record is not published unless all three are verified. Verification confirms specific facts at a point in time and is not a guarantee of product quality, pricing, delivery, or commercial performance.', 6, 'How Factory Verification Works', 'Learn how FactoryRoster verifies factory records before publication.', true, '2026-09-01T08:00:00Z'),
  ('use-verified-factory-contacts', 'How to Use Verified Factory Contacts', 'Contact Intelligence', 'Prepare effective outreach after unlocking a verified contact record.', 'Use the verified contact channel for a concise, specific introduction. Include product requirements, target quantity, destination market, compliance needs, and timing. Confirm the contact identity again before sharing sensitive commercial information or arranging payments.', 7, 'How to Use Verified Factory Contacts', 'Use verified contact intelligence for focused factory outreach.', true, '2026-09-01T08:00:00Z')
on conflict (slug) do update set content = excluded.content, summary = excluded.summary, updated_at = now();
