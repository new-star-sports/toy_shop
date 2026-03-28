-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('categories', 'categories', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('brands', 'brands', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('banners', 'banners', true, 20971520, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage
-- Allow public read access to all buckets
CREATE POLICY "Public Read Access" ON storage.objects 
FOR SELECT USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners')
);

-- Allow authenticated users to upload to buckets
CREATE POLICY "Authenticated Upload Access" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND 
  auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Update Own Uploads" ON storage.objects 
FOR UPDATE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND 
  auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Delete Own Uploads" ON storage.objects 
FOR DELETE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners') AND 
  auth.role() = 'authenticated'
);
