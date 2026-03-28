-- Fix Storage RLS Policies for Upload
-- Run this in your Supabase SQL Editor

-- First, check current policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files." ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files." ON storage.objects;

-- Create new policies that allow uploads with proper authentication

-- Policy 1: Allow authenticated users to upload to specific buckets
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND
  auth.role() = 'authenticated'
);

-- Policy 2: Allow service role to bypass all restrictions
CREATE POLICY "Allow service role full access" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');

-- Policy 3: Allow public read access to uploaded files
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Policy 4: Allow users to update their own files
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND
  auth.role() = 'authenticated'
);

-- Policy 5: Allow users to delete their own files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND
  auth.role() = 'authenticated'
);

-- Verify the new policies
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
