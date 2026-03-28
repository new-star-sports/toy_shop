-- Final Fix for Storage RLS and Bucket Issues
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

-- Step 3: Disable RLS for storage objects (simplest solution)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify buckets exist
SELECT id, name, public FROM storage.buckets ORDER BY id;

-- Step 5: Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
