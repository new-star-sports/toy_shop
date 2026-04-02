-- Create blogs storage bucket for featured images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('blogs', 'blogs', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Add blogs to existing RLS policies (drop and recreate to include blogs)
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects 
FOR SELECT USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners', 'blogs')
);

DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
CREATE POLICY "Authenticated Upload Access" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id IN ('categories', 'brands', 'products', 'banners', 'blogs') AND 
  auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Update Own Uploads" ON storage.objects;
CREATE POLICY "Update Own Uploads" ON storage.objects 
FOR UPDATE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners', 'blogs') AND 
  auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Delete Own Uploads" ON storage.objects;
CREATE POLICY "Delete Own Uploads" ON storage.objects 
FOR DELETE USING (
  bucket_id IN ('categories', 'brands', 'products', 'banners', 'blogs') AND 
  auth.role() = 'authenticated'
);
