-- Clean up blob URLs from database to fix display errors
-- Run this in your Supabase SQL Editor

-- Clean categories table
UPDATE categories 
SET image_url = '' 
WHERE image_url LIKE 'blob:%';

-- Clean brands table  
UPDATE brands 
SET logo_url = '' 
WHERE logo_url LIKE 'blob:%';

-- Show results
SELECT 
  'categories' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN image_url = '' THEN 1 END) as empty_image_urls
FROM categories

UNION ALL

SELECT 
  'brands' as table_name,
  COUNT(*) as total_records, 
  COUNT(CASE WHEN logo_url = '' THEN 1 END) as empty_logo_urls
FROM brands;
