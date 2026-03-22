-- ============================================================================
-- Migration 005: Commerce Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Addresses ────────────────────────────────────────────────────────────────
CREATE TYPE public.address_type AS ENUM ('home', 'work', 'other');

CREATE TABLE public.addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  governorate_id  UUID NOT NULL REFERENCES public.governorates(id),
  area_id         UUID NOT NULL REFERENCES public.areas(id),
  block           TEXT NOT NULL,
  street          TEXT NOT NULL,
  building        TEXT NOT NULL,
  floor           TEXT,
  apartment       TEXT,
  landmark        TEXT,
  recipient_name  TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  address_type    public.address_type NOT NULL DEFAULT 'home',
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.addresses IS 'Customer addresses — Kuwait format (no postcode)';
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Orders ───────────────────────────────────────────────────────────────────
CREATE TYPE public.order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);
CREATE TYPE public.payment_status AS ENUM (
  'pending', 'confirmed', 'failed', 'refunded'
);

CREATE TABLE public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT NOT NULL UNIQUE,
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  status              public.order_status NOT NULL DEFAULT 'pending',
  payment_status      public.payment_status NOT NULL DEFAULT 'pending',
  payment_method      TEXT NOT NULL,

  -- Snapshotted totals (KWD 3dp)
  subtotal_kwd        NUMERIC(10,3) NOT NULL CHECK (subtotal_kwd >= 0),
  shipping_kwd        NUMERIC(10,3) NOT NULL DEFAULT 0 CHECK (shipping_kwd >= 0),
  discount_kwd        NUMERIC(10,3) NOT NULL DEFAULT 0 CHECK (discount_kwd >= 0),
  total_kwd           NUMERIC(10,3) NOT NULL CHECK (total_kwd >= 0),

  -- Coupon
  coupon_code         TEXT,
  coupon_discount_kwd NUMERIC(10,3),

  -- Snapshotted customer info
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  shipping_address    JSONB NOT NULL,

  -- Gift
  gift_wrap           BOOLEAN NOT NULL DEFAULT FALSE,
  gift_message        TEXT,

  -- Shipping
  shipping_method     TEXT NOT NULL DEFAULT 'standard',
  tracking_number     TEXT,
  courier_name        TEXT,
  estimated_delivery  DATE,

  -- Idempotency
  idempotency_key     UUID UNIQUE,

  -- Internal
  internal_notes      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.orders IS 'Order headers — all customer/address fields snapshotted';
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE public.order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id      UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,

  -- Snapshotted at purchase time
  name_en         TEXT NOT NULL,
  name_ar         TEXT NOT NULL,
  sku             TEXT NOT NULL,
  hs_code         TEXT,
  image_url       TEXT,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_kwd  NUMERIC(10,3) NOT NULL CHECK (unit_price_kwd > 0),
  line_total_kwd  NUMERIC(10,3) NOT NULL CHECK (line_total_kwd > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.order_items IS 'Line items — snapshotted product data at purchase time';
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- ── Order Timeline ───────────────────────────────────────────────────────────
CREATE TABLE public.order_timeline (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status      public.order_status NOT NULL,
  note        TEXT,
  changed_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.order_timeline IS 'Status change log per order';
CREATE INDEX idx_order_timeline_order ON public.order_timeline(order_id);

-- ── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE public.payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway           TEXT NOT NULL, -- 'myfatoorah', 'tap'
  transaction_id    TEXT UNIQUE,
  amount_kwd        NUMERIC(10,3) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'KWD',
  status            public.payment_status NOT NULL DEFAULT 'pending',
  gateway_response  JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Payment records with gateway transaction IDs';
CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_transaction ON public.payments(transaction_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Stock Reservations ───────────────────────────────────────────────────────
CREATE TABLE public.stock_reservations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id  UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  session_id  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.stock_reservations IS 'Soft-hold stock during checkout — 15-min TTL, expired by pg_cron';
CREATE INDEX idx_reservations_expires ON public.stock_reservations(expires_at);
CREATE INDEX idx_reservations_variant ON public.stock_reservations(variant_id);

-- ── Returns ──────────────────────────────────────────────────────────────────
CREATE TYPE public.return_status AS ENUM (
  'requested', 'approved', 'rejected', 'received', 'refunded'
);

CREATE TABLE public.returns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  status          public.return_status NOT NULL DEFAULT 'requested',
  reason          TEXT NOT NULL,
  admin_notes     TEXT,
  refund_amount   NUMERIC(10,3),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.return_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id   UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  reason      TEXT
);

COMMENT ON TABLE public.returns IS 'Return request headers';
CREATE INDEX idx_returns_order ON public.returns(order_id);
CREATE INDEX idx_returns_user ON public.returns(user_id);

CREATE TRIGGER returns_updated_at
  BEFORE UPDATE ON public.returns
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
