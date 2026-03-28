-- Service Role Bypass Fix for Storage
-- Run this in your Supabase SQL Editor

-- Step 1: Create missing buckets first
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('categories', 'categories', true),
  ('brands', 'brands', true),
  ('products', 'products', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop all existing storage policies
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Delete Own Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Update Own Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- Step 3: Create policies that specifically allow service role bypass
-- Allow service role to do everything
CREATE POLICY "Service role full access" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');

-- Allow anon key to upload (but with restrictions)
CREATE POLICY "Anon upload access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND
  auth.role() = 'anon'
);

-- Allow anon key to read files
CREATE POLICY "Anon read access" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND
  auth.role() = 'anon'
);

-- Step 4: Verify setup
SELECT id, name, public FROM storage.buckets ORDER BY id;

SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;
