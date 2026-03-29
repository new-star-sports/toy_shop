-- Update banners bucket to support video MIME types and 50MB limit
UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm'
  ],
  file_size_limit = 52428800  -- 50MB
WHERE id = 'banners';
