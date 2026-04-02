-- Sample blog data for testing
-- Run this after creating blog categories

-- First, ensure we have at least one blog category
INSERT INTO blog_categories (id, name_en, name_ar, slug, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Toy Reviews',
  'مراجعات الألعاب',
  'toy-reviews',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO blog_categories (id, name_en, name_ar, slug, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Parenting Tips',
  'نصائح الأبوة',
  'parenting-tips',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Sample blog posts
INSERT INTO blogs (
  id,
  slug,
  title_en,
  title_ar,
  excerpt_en,
  excerpt_ar,
  content_en,
  content_ar,
  image_url,
  category_id,
  is_published,
  published_at,
  display_order,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'top-10-educational-toys-2025',
  'Top 10 Educational Toys for Toddlers in 2025',
  'أفضل 10 ألعاب تعليمية للأطفال في 2025',
  'Discover the best educational toys that combine fun and learning for your little ones. From STEM toys to creative playsets.',
  'اكتشف أفضل الألعاب التعليمية التي تجمع بين المرح والتعلم لأطفالك. من ألعاب STEM إلى مجموعات اللعب الإبداعية.',
  '<h2>Why Educational Toys Matter</h2><p>Educational toys play a crucial role in early childhood development...</p><h2>1. Building Blocks Set</h2><p>Classic wooden blocks help develop spatial awareness...</p><h2>2. STEM Robot Kit</h2><p>Introduction to coding and robotics...</p>',
  '<h2>لماذا الألعاب التعليمية مهمة</h2><p>تلعب الألعاب التعليمية دورًا حاسمًا في تنمية الطفولة المبكرة...</p>',
  NULL,
  '00000000-0000-0000-0000-000000000001',
  true,
  NOW() - INTERVAL '2 days',
  1,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO blogs (
  id,
  slug,
  title_en,
  title_ar,
  excerpt_en,
  excerpt_ar,
  content_en,
  content_ar,
  image_url,
  category_id,
  is_published,
  published_at,
  display_order,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'screen-time-guide-parents',
  'The Ultimate Screen Time Guide for Parents',
  'الدليل النهائي لوقت الشاشة للأبوين',
  'Learn how to balance digital entertainment with healthy activities. Expert tips on managing screen time for different age groups.',
  'تعلم كيفية موازنة الترفيه الرقمي مع الأنشطة الصحية. نصائح الخبراء لإدارة وقت الشاشة لفئات عمرية مختلفة.',
  '<h2>Understanding Screen Time</h2><p>In today''s digital age, managing screen time has become one of the biggest challenges for parents...</p><h2>Recommended Guidelines</h2><ul><li>Ages 0-2: Minimal to no screen time</li><li>Ages 2-5: Maximum 1 hour per day</li><li>Ages 6+: Consistent limits needed</li></ul>',
  '<h2>فهم وقت الشاشة</h2><p>في عصرنا الرقمي الحالي، أصبحت إدارة وقت الشاشة واحدة من أكبر التحديات للآباء...</p>',
  NULL,
  '00000000-0000-0000-0000-000000000002',
  true,
  NOW() - INTERVAL '5 days',
  2,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO blogs (
  id,
  slug,
  title_en,
  title_ar,
  excerpt_en,
  excerpt_ar,
  content_en,
  content_ar,
  image_url,
  category_id,
  is_published,
  published_at,
  display_order,
  created_at,
  updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'creative-play-ideas-indoor',
  '20 Creative Indoor Play Ideas for Rainy Days',
  '20 فكرة للعب الإبداعي في الأيام الممطرة',
  'Keep your kids entertained and learning even when stuck indoors. Simple activities using household items.',
  'أبقِ أطفالك مستمتعين ويتعلمون حتى عندما يكونون عالقين في الداخل. أنشطة بسيطة باستخدام أدوات منزلية.',
  '<h2>Rainy Day Activities</h2><p>When the weather keeps you inside, it''s time to get creative...</p><h2>1. Indoor Obstacle Course</h2><p>Use pillows, chairs, and blankets to create a fun obstacle course...</p>',
  '<h2>أنشطة الأيام الممطرة</h2><p>عندما يبقيك الطقس في الداخل، حان وقت الإبداع...</p>',
  NULL,
  '00033300000-0000-0000-0000-000000000001',
  false,
  NULL,
  3,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
