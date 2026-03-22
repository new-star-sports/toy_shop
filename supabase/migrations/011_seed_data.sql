-- ============================================================================
-- Migration 011: Seed Data (Development)
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── 6 Kuwait Governorates ────────────────────────────────────────────────────
INSERT INTO public.governorates (name_en, name_ar, slug) VALUES
  ('Capital', 'العاصمة', 'capital'),
  ('Hawalli', 'حولي', 'hawalli'),
  ('Farwaniya', 'الفروانية', 'farwaniya'),
  ('Ahmadi', 'الأحمدي', 'ahmadi'),
  ('Jahra', 'الجهراء', 'jahra'),
  ('Mubarak Al-Kabeer', 'مبارك الكبير', 'mubarak-al-kabeer');

-- ── Sample Areas ─────────────────────────────────────────────────────────────
-- Capital Governorate
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Kuwait City', 'مدينة الكويت', 'kuwait-city' FROM public.governorates WHERE slug = 'capital'
UNION ALL SELECT id, 'Sharq', 'شرق', 'sharq' FROM public.governorates WHERE slug = 'capital'
UNION ALL SELECT id, 'Salmiya', 'السالمية', 'salmiya' FROM public.governorates WHERE slug = 'capital'
UNION ALL SELECT id, 'Dasman', 'دسمان', 'dasman' FROM public.governorates WHERE slug = 'capital';

-- Hawalli
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Hawalli', 'حولي', 'hawalli-area' FROM public.governorates WHERE slug = 'hawalli'
UNION ALL SELECT id, 'Salmiya', 'السالمية', 'salmiya-hawalli' FROM public.governorates WHERE slug = 'hawalli'
UNION ALL SELECT id, 'Jabriya', 'الجابرية', 'jabriya' FROM public.governorates WHERE slug = 'hawalli'
UNION ALL SELECT id, 'Mishref', 'مشرف', 'mishref' FROM public.governorates WHERE slug = 'hawalli';

-- Farwaniya
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Farwaniya', 'الفروانية', 'farwaniya-area' FROM public.governorates WHERE slug = 'farwaniya'
UNION ALL SELECT id, 'Khaitan', 'خيطان', 'khaitan' FROM public.governorates WHERE slug = 'farwaniya'
UNION ALL SELECT id, 'Jleeb Al-Shuyoukh', 'جليب الشيوخ', 'jleeb' FROM public.governorates WHERE slug = 'farwaniya';

-- Ahmadi
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Ahmadi', 'الأحمدي', 'ahmadi-area' FROM public.governorates WHERE slug = 'ahmadi'
UNION ALL SELECT id, 'Fahaheel', 'الفحيحيل', 'fahaheel' FROM public.governorates WHERE slug = 'ahmadi'
UNION ALL SELECT id, 'Mangaf', 'المنقف', 'mangaf' FROM public.governorates WHERE slug = 'ahmadi';

-- Jahra
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Jahra', 'الجهراء', 'jahra-area' FROM public.governorates WHERE slug = 'jahra'
UNION ALL SELECT id, 'Saad Al Abdullah', 'سعد العبدالله', 'saad-al-abdullah' FROM public.governorates WHERE slug = 'jahra';

-- Mubarak Al-Kabeer
INSERT INTO public.areas (governorate_id, name_en, name_ar, slug)
SELECT id, 'Sabah Al-Salem', 'صباح السالم', 'sabah-al-salem' FROM public.governorates WHERE slug = 'mubarak-al-kabeer'
UNION ALL SELECT id, 'Mubarak Al-Kabeer', 'مبارك الكبير', 'mubarak-al-kabeer-area' FROM public.governorates WHERE slug = 'mubarak-al-kabeer';

-- ── Default Settings ─────────────────────────────────────────────────────────
INSERT INTO public.settings (key, value) VALUES
  -- Store info
  ('store_info', '{"store_name_en": "NewStarSports", "store_name_ar": "نيو ستار سبورتس", "tagline_en": "Kuwait''s home for toys", "tagline_ar": "وجهتك للألعاب في الكويت", "contact_email": "info@newstarsports.com", "contact_phone": "+96512345678", "whatsapp_number": "+96512345678", "cr_number": "000000"}'::JSONB),

  -- Trust bar
  ('trust_bar', '{"enabled": true, "free_delivery_threshold_kwd": 10.000, "return_policy_days": 14, "items": [{"icon": "truck", "text_en": "Free delivery above 10 KD", "text_ar": "توصيل مجاني للطلبات أعلى من 10 د.ك", "enabled": true}, {"icon": "shield", "text_en": "Genuine Licensed Products", "text_ar": "منتجات أصلية ومرخصة", "enabled": true}, {"icon": "refresh", "text_en": "14-Day Easy Returns", "text_ar": "إرجاع سهل خلال 14 يوم", "enabled": true}, {"icon": "map", "text_en": "Delivery Across All Kuwait", "text_ar": "توصيل لجميع مناطق الكويت", "enabled": true}]}'::JSONB),

  -- Announcement bar
  ('announcement_bar', '{"enabled": true, "bg_color": "#1B3A6B", "text_color": "#FFFFFF", "rotation_speed": 5, "dismissible": true, "messages": [{"text_en": "Free delivery on orders above 10 KD 🚚", "text_ar": "توصيل مجاني للطلبات أعلى من 10 د.ك 🚚", "enabled": true}]}'::JSONB),

  -- Shipping rates
  ('shipping', '{"standard_rate_kwd": 1.500, "express_rate_kwd": 3.000, "sameday_rate_kwd": 5.000, "standard_days": 3, "express_days": 1, "sameday_cutoff": "14:00", "free_delivery_threshold_kwd": 10.000}'::JSONB),

  -- Loyalty programme
  ('loyalty', '{"enabled": false, "points_per_kwd": 10, "kwd_per_100_points": 1.000, "min_points_to_redeem": 100, "points_expiry_months": 12, "birthday_reward_enabled": false, "birthday_reward_kwd": 3.000}'::JSONB),

  -- Payment methods
  ('payment_methods', '{"knet": true, "visa_mc": true, "apple_pay": false, "cod": true, "cod_extra_kwd": 0.500}'::JSONB);

-- ── Sample Categories ────────────────────────────────────────────────────────
INSERT INTO public.categories (name_en, name_ar, slug, is_homepage_pinned, homepage_order) VALUES
  ('Action Figures', 'شخصيات أكشن', 'action-figures', TRUE, 1),
  ('Building & Construction', 'البناء والتركيب', 'building-construction', TRUE, 2),
  ('Dolls & Accessories', 'دمى وإكسسوارات', 'dolls-accessories', TRUE, 3),
  ('Educational Toys', 'ألعاب تعليمية', 'educational-toys', TRUE, 4),
  ('Outdoor & Sports', 'ألعاب خارجية ورياضية', 'outdoor-sports', TRUE, 5),
  ('Board Games & Puzzles', 'ألعاب لوحية وألغاز', 'board-games-puzzles', TRUE, 6),
  ('Remote Control', 'ألعاب تحكم عن بعد', 'remote-control', TRUE, 7),
  ('Baby & Toddler', 'أطفال ورضع', 'baby-toddler', TRUE, 8),
  ('Arts & Crafts', 'فنون وحرف', 'arts-crafts', FALSE, NULL),
  ('Vehicles & Trains', 'مركبات وقطارات', 'vehicles-trains', FALSE, NULL),
  ('Musical Toys', 'ألعاب موسيقية', 'musical-toys', FALSE, NULL),
  ('Plush & Stuffed Animals', 'ألعاب قطيفة', 'plush-stuffed', FALSE, NULL);

-- ── Sample Brands ────────────────────────────────────────────────────────────
INSERT INTO public.brands (name_en, name_ar, slug, is_featured, display_order) VALUES
  ('LEGO', 'ليغو', 'lego', TRUE, 1),
  ('Barbie', 'باربي', 'barbie', TRUE, 2),
  ('Hot Wheels', 'هوت ويلز', 'hot-wheels', TRUE, 3),
  ('Nerf', 'نيرف', 'nerf', TRUE, 4),
  ('Play-Doh', 'بلاي-دو', 'play-doh', TRUE, 5),
  ('Fisher-Price', 'فيشر-برايس', 'fisher-price', TRUE, 6),
  ('Hasbro', 'هاسبرو', 'hasbro', TRUE, 7),
  ('Ravensburger', 'رافنزبرغر', 'ravensburger', TRUE, 8),
  ('Vtech', 'في تك', 'vtech', FALSE, NULL),
  ('Playmobil', 'بلايموبيل', 'playmobil', FALSE, NULL);

-- ── Sample Products (for dev/testing) ────────────────────────────────────────
INSERT INTO public.products (
  name_en, name_ar, slug, short_description_en, short_description_ar,
  description_en, description_ar, status, price_kwd, compare_at_price_kwd,
  sku, category_id, brand_id, min_age, safety_warnings_en, safety_warnings_ar,
  kucas_certificate, country_of_origin, materials_en, materials_ar,
  manufacturer_name, weight_grams, length_cm, width_cm, height_cm,
  hs_code_6, gcc_tariff_12, is_new_arrival, is_homepage_featured
) VALUES
  (
    'LEGO City Police Station', 'ليغو سيتي مركز الشرطة',
    'lego-city-police-station',
    'Build an exciting police station with jail, helicopter, and 6 minifigures',
    'ابنِ مركز شرطة مثير مع سجن وطائرة هليكوبتر و6 شخصيات مصغرة',
    'The LEGO City Police Station (60316) is packed with detailed features that will delight young police officers. Includes a 3-level police station, helicopter, dog, and 6 minifigures.',
    'مركز شرطة ليغو سيتي (60316) مليء بالتفاصيل الرائعة. يتضمن مركز شرطة من 3 مستويات وطائرة هليكوبتر وكلب و6 شخصيات مصغرة.',
    'published', 15.900, 19.900,
    'LEGO-60316',
    (SELECT id FROM public.categories WHERE slug = 'building-construction'),
    (SELECT id FROM public.brands WHERE slug = 'lego'),
    6,
    'Warning: Not suitable for children under 3 years — small parts choking hazard',
    'تحذير: غير مناسب للأطفال دون سن 3 سنوات — خطر الاختناق بالأجزاء الصغيرة',
    'KUCAS-2025-001', 'Denmark', 'ABS Plastic', 'بلاستيك ABS',
    'LEGO System A/S', 850, 38.0, 26.0, 7.0,
    '950300', '950300000000', TRUE, TRUE
  ),
  (
    'Barbie Dreamhouse', 'باربي بيت الأحلام',
    'barbie-dreamhouse',
    'Three-story dollhouse with 10 play areas and 75+ accessories',
    'بيت دمى من 3 طوابق مع 10 مناطق لعب وأكثر من 75 إكسسوار',
    'The Barbie Dreamhouse is the ultimate play experience! This 3-story dollhouse features 10 indoor and outdoor play areas, a working elevator, pool, slide, and over 75 accessories.',
    'بيت أحلام باربي هو تجربة اللعب المثالية! يتميز بيت الدمى هذا من 3 طوابق بـ10 مناطق لعب داخلية وخارجية، ومصعد يعمل، ومسبح، وزحلقة، وأكثر من 75 إكسسوار.',
    'published', 49.900, 59.900,
    'BARB-DH-2025',
    (SELECT id FROM public.categories WHERE slug = 'dolls-accessories'),
    (SELECT id FROM public.brands WHERE slug = 'barbie'),
    3,
    'Warning: Not suitable for children under 3 years — small parts',
    'تحذير: غير مناسب للأطفال دون سن 3 سنوات — أجزاء صغيرة',
    'KUCAS-2025-002', 'China', 'Plastic, Fabric', 'بلاستيك، قماش',
    'Mattel Inc.', 2500, 60.0, 45.0, 30.0,
    '950300', '950300000000', TRUE, TRUE
  ),
  (
    'Hot Wheels Ultimate Garage', 'هوت ويلز المرآب النهائي',
    'hot-wheels-ultimate-garage',
    'Mega garage with space for 100+ cars, motorized elevator and jet plane',
    'مرآب ضخم يتسع لأكثر من 100 سيارة مع مصعد آلي وطائرة نفاثة',
    'The Hot Wheels Ultimate Garage is the tallest Hot Wheels playset ever! Standing over 3 feet tall, this mega garage holds 100+ 1:64 scale vehicles with a motorized corkscrew elevator.',
    'المرآب النهائي من هوت ويلز هو أطول مجموعة لعب على الإطلاق! يقف على ارتفاع أكثر من 3 أقدام، ويتسع لأكثر من 100 مركبة بمقياس 1:64 مع مصعد حلزوني آلي.',
    'published', 29.900, NULL,
    'HW-UG-2025',
    (SELECT id FROM public.categories WHERE slug = 'vehicles-trains'),
    (SELECT id FROM public.brands WHERE slug = 'hot-wheels'),
    5,
    'Warning: Not suitable for children under 3 years',
    'تحذير: غير مناسب للأطفال دون سن 3 سنوات',
    'KUCAS-2025-003', 'Malaysia', 'Plastic, Metal', 'بلاستيك، معدن',
    'Mattel Inc.', 3200, 50.0, 35.0, 90.0,
    '950300', '950300000000', FALSE, TRUE
  ),
  (
    'Fisher-Price Laugh & Learn Smart Stages Chair', 'فيشر-برايس كرسي التعلم الذكي',
    'fisher-price-smart-stages-chair',
    'Interactive learning chair with songs, phrases and activities for babies',
    'كرسي تعلم تفاعلي مع أغاني وعبارات وأنشطة للأطفال',
    'The Fisher-Price Laugh & Learn Smart Stages Chair grows with your baby! With 50+ songs, tunes, and phrases that teach ABCs, shapes, numbers, and more.',
    'كرسي التعلم الذكي من فيشر-برايس ينمو مع طفلك! مع أكثر من 50 أغنية ولحناً وعبارة تعلم الحروف والأشكال والأرقام والمزيد.',
    'published', 8.500, 12.000,
    'FP-CHAIR-2025',
    (SELECT id FROM public.categories WHERE slug = 'baby-toddler'),
    (SELECT id FROM public.brands WHERE slug = 'fisher-price'),
    1,
    'Suitable for ages 1 and up',
    'مناسب للأعمار من سنة فما فوق',
    'KUCAS-2025-004', 'China', 'Plastic, Fabric, Electronic components', 'بلاستيك، قماش، مكونات إلكترونية',
    'Mattel Inc.', 1800, 40.0, 35.0, 50.0,
    '950300', '950300000000', TRUE, FALSE
  ),
  (
    'Nerf Elite 2.0 Eaglepoint', 'نيرف إيليت 2.0 إيغل بوينت',
    'nerf-elite-eaglepoint',
    'Dart blaster with detachable scope, barrel, and 16 darts',
    'مسدس رمي سهام مع منظار قابل للفصل وفوهة و16 سهم',
    'Take aim with this motorized Nerf Elite 2.0 Eaglepoint blaster! Features a detachable scope and barrel extension for customized battling. Comes with 16 official Nerf Elite darts.',
    'صوّب مع مسدس نيرف إيليت 2.0 إيغل بوينت! يتميز بمنظار قابل للفصل وتمديد فوهة للقتال المخصص. يأتي مع 16 سهماً رسمياً من نيرف إيليت.',
    'published', 12.750, NULL,
    'NERF-EP-2025',
    (SELECT id FROM public.categories WHERE slug = 'action-figures'),
    (SELECT id FROM public.brands WHERE slug = 'nerf'),
    8,
    'Warning: Do not aim at eyes or face. Not suitable for children under 8 years',
    'تحذير: لا تصوب نحو العينين أو الوجه. غير مناسب للأطفال دون سن 8 سنوات',
    'KUCAS-2025-005', 'China', 'Plastic, Foam', 'بلاستيك، فوم',
    'Hasbro Inc.', 950, 45.0, 8.0, 25.0,
    '950300', '950300000000', FALSE, FALSE
  ),
  (
    'Play-Doh Kitchen Creations Ultimate Ice Cream Truck', 'بلاي-دو شاحنة الآيس كريم النهائية',
    'play-doh-ice-cream-truck',
    'Over 25 tools to create Play-Doh ice cream treats with music and sounds',
    'أكثر من 25 أداة لصنع حلوى آيس كريم بلاي-دو مع موسيقى وأصوات',
    'Serve up yummy Play-Doh ice cream treats with this awesome truck playset! Features over 25 tools and 12 cans of Play-Doh compound. Press the lever to make soft-serve swirls!',
    'قدم حلوى آيس كريم بلاي-دو اللذيذة مع مجموعة الشاحنة الرائعة! تتميز بأكثر من 25 أداة و12 علبة من معجون بلاي-دو. اضغط الرافعة لصنع لفائف الآيس كريم!',
    'published', 14.500, 18.000,
    'PD-ICT-2025',
    (SELECT id FROM public.categories WHERE slug = 'arts-crafts'),
    (SELECT id FROM public.brands WHERE slug = 'play-doh'),
    3,
    'Contains wheat. Not suitable for children under 3 years',
    'يحتوي على قمح. غير مناسب للأطفال دون سن 3 سنوات',
    'KUCAS-2025-006', 'China', 'Plastic, Play-Doh compound (wheat flour)', 'بلاستيك، معجون بلاي-دو (دقيق القمح)',
    'Hasbro Inc.', 1200, 35.0, 20.0, 30.0,
    '950300', '950300000000', TRUE, TRUE
  );

-- Add stock quantities via product_variants for the sample products
INSERT INTO public.product_variants (product_id, variant_type, name_en, name_ar, sku, stock_quantity, display_order)
SELECT id, 'size', 'Standard', 'قياسي', sku || '-STD', 25, 1
FROM public.products WHERE status = 'published';

-- ── Sample Banner ────────────────────────────────────────────────────────────
INSERT INTO public.banners (banner_type, title_en, title_ar, subtitle_en, subtitle_ar, cta_text_en, cta_text_ar, cta_link, display_order) VALUES
  ('hero', 'Welcome to NewStarSports', 'مرحباً بكم في نيو ستار سبورتس', 'Kuwait''s home for toys — shop the latest arrivals', 'وجهتك للألعاب في الكويت — تسوق أحدث المنتجات', 'Shop Now', 'تسوق الآن', '/products', 1),
  ('hero', 'Free Delivery Above 10 KD', 'توصيل مجاني للطلبات أعلى من 10 د.ك', 'Shop our best sellers today', 'تسوق أفضل المبيعات اليوم', 'View Best Sellers', 'عرض الأكثر مبيعاً', '/products?sort=best-sellers', 2);
