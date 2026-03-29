-- Add video columns to banners table
ALTER TABLE banners
  ADD COLUMN IF NOT EXISTS video_desktop_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS video_mobile_url  TEXT NULL;
