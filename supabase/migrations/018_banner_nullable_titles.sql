-- Make title_en and title_ar nullable on banners (title is now optional)
ALTER TABLE banners
  ALTER COLUMN title_en DROP NOT NULL,
  ALTER COLUMN title_ar DROP NOT NULL;
