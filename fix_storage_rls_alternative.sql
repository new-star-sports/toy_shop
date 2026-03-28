-- Alternative Fix for Storage RLS (No Owner Permissions Required)
-- Run this in your Supabase SQL Editor

-- Step 1: Create missing buckets first
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('categories', 'categories', true),
  ('brands', 'brands', true),
  ('products', 'products', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop all existing storage policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Delete Own Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Update Own Uploads" ON storage.objects;

-- Step 3: Create permissive policies that allow anon key uploads
-- Policy for INSERT operations (uploads)
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Policy for SELECT operations (reading files)
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Policy for UPDATE operations
CREATE POLICY "Allow updates" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Policy for DELETE operations
CREATE POLICY "Allow deletes" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Step 4: Verify buckets exist
SELECT id, name, public FROM storage.buckets ORDER BY id;

-- Step 5: Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;
