-- ============================================================================
-- Migration 006: Marketing Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Banners ──────────────────────────────────────────────────────────────────
CREATE TYPE public.banner_type AS ENUM ('hero', 'announcement', 'editorial', 'split_promo');

CREATE TABLE public.banners (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_type       public.banner_type NOT NULL,
  title_en          TEXT NOT NULL DEFAULT '',
  title_ar          TEXT NOT NULL DEFAULT '',
  subtitle_en       TEXT,
  subtitle_ar       TEXT,
  image_desktop_url TEXT,
  image_mobile_url  TEXT,
  cta_text_en       TEXT,
  cta_text_ar       TEXT,
  cta_link          TEXT,
  cta2_text_en      TEXT,
  cta2_text_ar      TEXT,
  cta2_link         TEXT,
  bg_color          TEXT DEFAULT '#FF6B2B',
  text_color        TEXT DEFAULT '#FFFFFF',
  countdown_end     TIMESTAMPTZ,
  display_order     INTEGER NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  schedule_start    TIMESTAMPTZ,
  schedule_end      TIMESTAMPTZ,
  slot              TEXT, -- 'left' or 'right' for split_promo
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.banners IS 'All banner types: hero slider, announcement, editorial, split promo';
CREATE INDEX idx_banners_type ON public.banners(banner_type);
CREATE INDEX idx_banners_active ON public.banners(is_active) WHERE is_active = TRUE;

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Coupons ──────────────────────────────────────────────────────────────────
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed_kwd');

CREATE TABLE public.coupons (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT NOT NULL UNIQUE,
  coupon_type         public.coupon_type NOT NULL,
  value               NUMERIC(10,3) NOT NULL CHECK (value > 0),
  min_order_value_kwd NUMERIC(10,3),
  max_uses_total      INTEGER,
  max_uses_per_user   INTEGER DEFAULT 1,
  used_count          INTEGER NOT NULL DEFAULT 0,
  applies_to          TEXT DEFAULT 'all', -- 'all', 'category', 'product'
  applies_to_ids      UUID[],
  starts_at           TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.coupons IS 'Discount codes — percentage or fixed KWD';
CREATE INDEX idx_coupons_code ON public.coupons(code);

CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Coupon Usage ─────────────────────────────────────────────────────────────
CREATE TABLE public.coupon_usage (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id   UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  order_id    UUID REFERENCES public.orders(id),
  used_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_coupon ON public.coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON public.coupon_usage(user_id);
CREATE UNIQUE INDEX idx_coupon_usage_unique ON public.coupon_usage(coupon_id, user_id, order_id);

-- ── Newsletter Subscribers ───────────────────────────────────────────────────
CREATE TABLE public.newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  whatsapp_optin  BOOLEAN NOT NULL DEFAULT FALSE,
  consent_given   BOOLEAN NOT NULL DEFAULT FALSE,
  source          TEXT DEFAULT 'website',
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter email signups with PDPL consent';

-- ── Wishlist Items ───────────────────────────────────────────────────────────
CREATE TABLE public.wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlist_user ON public.wishlist_items(user_id);

-- ── Loyalty Points Ledger ────────────────────────────────────────────────────
-- Append-only — no UPDATE or DELETE on past rows
CREATE TYPE public.loyalty_action AS ENUM (
  'earned_purchase', 'earned_review', 'earned_birthday',
  'redeemed', 'expired', 'adjusted'
);

CREATE TABLE public.loyalty_points_ledger (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  action      public.loyalty_action NOT NULL,
  points      INTEGER NOT NULL, -- positive = earned, negative = spent
  order_id    UUID REFERENCES public.orders(id),
  description TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.loyalty_points_ledger IS 'Loyalty points ledger — append-only';
CREATE INDEX idx_loyalty_user ON public.loyalty_points_ledger(user_id);

-- ── Abandoned Carts ──────────────────────────────────────────────────────────
CREATE TABLE public.abandoned_carts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  cart_items    JSONB NOT NULL,
  total_kwd     NUMERIC(10,3),
  recovery_sent BOOLEAN NOT NULL DEFAULT FALSE,
  last_active   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_abandoned_carts_user ON public.abandoned_carts(user_id);
CREATE INDEX idx_abandoned_carts_recovery ON public.abandoned_carts(recovery_sent) WHERE recovery_sent = FALSE;
