-- Add category and brand FK columns to banners table
ALTER TABLE banners
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS brand_id    UUID REFERENCES brands(id)    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_banners_category_id ON banners (category_id);
CREATE INDEX IF NOT EXISTS idx_banners_brand_id    ON banners (brand_id);
