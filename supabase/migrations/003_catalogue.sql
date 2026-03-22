-- ============================================================================
-- Migration 003: Catalogue Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE public.categories (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en             TEXT NOT NULL,
  name_ar             TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description_en      TEXT,
  description_ar      TEXT,
  parent_id           UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url           TEXT,
  is_homepage_pinned  BOOLEAN NOT NULL DEFAULT FALSE,
  homepage_order      INTEGER,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.categories IS 'Product categories — self-referencing tree via parent_id';
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_homepage ON public.categories(is_homepage_pinned) WHERE is_homepage_pinned = TRUE;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Brands ───────────────────────────────────────────────────────────────────
CREATE TABLE public.brands (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en         TEXT NOT NULL,
  name_ar         TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  logo_url        TEXT,
  description_en  TEXT,
  description_ar  TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  display_order   INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.brands IS 'Product brands with logo and featured flag';
CREATE INDEX idx_brands_slug ON public.brands(slug);
CREATE INDEX idx_brands_featured ON public.brands(is_featured) WHERE is_featured = TRUE;

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Products ─────────────────────────────────────────────────────────────────
CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.out_of_stock_behaviour AS ENUM ('hide', 'show_out_of_stock', 'continue_selling');
CREATE TYPE public.return_eligibility AS ENUM ('eligible', 'not_eligible');

CREATE TABLE public.products (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tab 1: Basic Information
  name_en                     TEXT NOT NULL,
  name_ar                     TEXT NOT NULL,
  slug                        TEXT NOT NULL UNIQUE,
  short_description_en        TEXT NOT NULL,
  short_description_ar        TEXT NOT NULL,
  description_en              TEXT NOT NULL,
  description_ar              TEXT NOT NULL,
  status                      public.product_status NOT NULL DEFAULT 'draft',

  -- Tab 3: Pricing
  price_kwd                   NUMERIC(10,3) NOT NULL CHECK (price_kwd > 0),
  compare_at_price_kwd        NUMERIC(10,3) CHECK (compare_at_price_kwd IS NULL OR compare_at_price_kwd > 0),
  cost_price_kwd              NUMERIC(10,3) CHECK (cost_price_kwd IS NULL OR cost_price_kwd > 0),
  tax_status                  TEXT NOT NULL DEFAULT 'taxable' CHECK (tax_status IN ('taxable', 'tax_exempt')),
  include_in_flash_sale       BOOLEAN NOT NULL DEFAULT FALSE,
  flash_sale_discount_percent INTEGER CHECK (flash_sale_discount_percent IS NULL OR (flash_sale_discount_percent >= 1 AND flash_sale_discount_percent <= 99)),

  -- Tab 4: Inventory (base product)
  sku                         TEXT NOT NULL UNIQUE,
  barcode                     TEXT,
  track_inventory             BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity              INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold         INTEGER DEFAULT 5 CHECK (low_stock_threshold IS NULL OR low_stock_threshold >= 1),
  out_of_stock_behaviour      public.out_of_stock_behaviour NOT NULL DEFAULT 'show_out_of_stock',
  allow_backorders            BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tab 6: Organisation
  category_id                 UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id                    UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  is_new_arrival              BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller_override     BOOLEAN NOT NULL DEFAULT FALSE,
  is_homepage_featured        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tab 7: Safety & Legal (Kuwait mandatory)
  min_age                     INTEGER NOT NULL DEFAULT 0 CHECK (min_age >= 0),
  max_age                     INTEGER CHECK (max_age IS NULL OR max_age >= 0),
  safety_warnings_en          TEXT NOT NULL DEFAULT '',
  safety_warnings_ar          TEXT NOT NULL DEFAULT '',
  kucas_certificate           TEXT NOT NULL DEFAULT '',
  kucas_expiry                DATE,
  country_of_origin           TEXT NOT NULL DEFAULT '',
  materials_en                TEXT NOT NULL DEFAULT '',
  materials_ar                TEXT NOT NULL DEFAULT '',
  battery_required            BOOLEAN NOT NULL DEFAULT FALSE,
  battery_type                TEXT,
  battery_included            BOOLEAN NOT NULL DEFAULT FALSE,
  manufacturer_name           TEXT NOT NULL DEFAULT '',
  manufacturer_address        TEXT,
  warranty_months             INTEGER DEFAULT 0,
  return_eligibility          public.return_eligibility NOT NULL DEFAULT 'eligible',
  return_exclusion_reason_en  TEXT,
  return_exclusion_reason_ar  TEXT,

  -- Tab 8: Shipping
  weight_grams                INTEGER NOT NULL DEFAULT 0 CHECK (weight_grams >= 0),
  length_cm                   NUMERIC(8,2) NOT NULL DEFAULT 0,
  width_cm                    NUMERIC(8,2) NOT NULL DEFAULT 0,
  height_cm                   NUMERIC(8,2) NOT NULL DEFAULT 0,
  requires_special_handling   BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tab 9: SEO
  seo_title_en                TEXT,
  seo_title_ar                TEXT,
  seo_description_en          TEXT,
  seo_description_ar          TEXT,
  canonical_url               TEXT,

  -- Tab 10: Customs / HS Codes
  hs_code_6                   CHAR(6) NOT NULL DEFAULT '000000',
  gcc_tariff_12               CHAR(12) NOT NULL DEFAULT '000000000000',
  customs_description_en      TEXT,
  import_licence_required     BOOLEAN NOT NULL DEFAULT FALSE,
  import_licence_number       TEXT,

  -- Metadata
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Main product record — all 10 tabs from admin UI';

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_price ON public.products(price_kwd);
CREATE INDEX idx_products_new_arrival ON public.products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX idx_products_homepage ON public.products(is_homepage_featured) WHERE is_homepage_featured = TRUE;
CREATE INDEX idx_products_flash_sale ON public.products(include_in_flash_sale) WHERE include_in_flash_sale = TRUE;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Product Variants ─────────────────────────────────────────────────────────
CREATE TYPE public.variant_type AS ENUM ('colour', 'size', 'pack_size', 'age_group', 'custom');

CREATE TABLE public.product_variants (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id            UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_type          public.variant_type NOT NULL,
  name_en               TEXT NOT NULL,
  name_ar               TEXT NOT NULL,
  sku                   TEXT NOT NULL UNIQUE,
  barcode               TEXT,
  price_override_kwd    NUMERIC(10,3),
  compare_at_price_kwd  NUMERIC(10,3),
  stock_quantity        INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  weight_grams          INTEGER,
  display_order         INTEGER NOT NULL DEFAULT 0,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.product_variants IS 'One row per variant (colour/size/pack)';
CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_variants_sku ON public.product_variants(sku);

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Product Images ───────────────────────────────────────────────────────────
CREATE TABLE public.product_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id    UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  url           TEXT NOT NULL,
  alt_text_en   TEXT NOT NULL DEFAULT '',
  alt_text_ar   TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.product_images IS 'Product images — ordered, optional variant mapping';
CREATE INDEX idx_product_images_product ON public.product_images(product_id);

-- ── Product Tags ─────────────────────────────────────────────────────────────
CREATE TABLE public.tags (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  slug    TEXT NOT NULL UNIQUE
);

CREATE TABLE public.product_tags (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX idx_product_tags_tag ON public.product_tags(tag_id);
