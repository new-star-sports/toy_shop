-- ============================================================================
-- Migration 008: System Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Settings (Key-Value Store) ───────────────────────────────────────────────
CREATE TABLE public.settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE public.settings IS 'Key-value store for all configurable settings';

-- ── Audit Log ────────────────────────────────────────────────────────────────
-- Append-only: REVOKE UPDATE and DELETE after table creation
CREATE TABLE public.audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_log IS 'Append-only audit trail — no UPDATE/DELETE allowed';
CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_table ON public.audit_log(table_name);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

-- ── Inventory Logs ───────────────────────────────────────────────────────────
CREATE TABLE public.inventory_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id      UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  change_qty      INTEGER NOT NULL, -- positive = stock-in, negative = stock-out
  reason          TEXT NOT NULL, -- 'purchase', 'return', 'manual_adjustment', 'stock_count'
  reference_id    UUID, -- order_id, return_id, etc.
  changed_by      UUID REFERENCES auth.users(id),
  previous_qty    INTEGER NOT NULL,
  new_qty         INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.inventory_logs IS 'Every stock change: who, what, when, why';
CREATE INDEX idx_inventory_logs_product ON public.inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_variant ON public.inventory_logs(variant_id);

-- ── Materialized Views (Best Sellers) ────────────────────────────────────────

-- Weekly best sellers — refreshed by pg_cron every hour
CREATE MATERIALIZED VIEW public.best_sellers_weekly AS
SELECT
  p.id AS product_id,
  p.name_en,
  p.name_ar,
  p.slug,
  p.price_kwd,
  p.compare_at_price_kwd,
  COALESCE(SUM(oi.quantity), 0) AS units_sold,
  COUNT(DISTINCT oi.order_id) AS order_count
FROM public.products p
LEFT JOIN public.order_items oi ON oi.product_id = p.id
LEFT JOIN public.orders o ON o.id = oi.order_id
  AND o.status NOT IN ('cancelled', 'refunded')
  AND o.created_at >= NOW() - INTERVAL '7 days'
WHERE p.status = 'published'
GROUP BY p.id, p.name_en, p.name_ar, p.slug, p.price_kwd, p.compare_at_price_kwd
ORDER BY units_sold DESC
LIMIT 50;

CREATE UNIQUE INDEX idx_best_sellers_weekly_product ON public.best_sellers_weekly(product_id);

-- Monthly best sellers — refreshed by pg_cron daily at 2am
CREATE MATERIALIZED VIEW public.best_sellers_monthly AS
SELECT
  p.id AS product_id,
  p.name_en,
  p.name_ar,
  p.slug,
  p.price_kwd,
  p.compare_at_price_kwd,
  COALESCE(SUM(oi.quantity), 0) AS units_sold,
  COUNT(DISTINCT oi.order_id) AS order_count
FROM public.products p
LEFT JOIN public.order_items oi ON oi.product_id = p.id
LEFT JOIN public.orders o ON o.id = oi.order_id
  AND o.status NOT IN ('cancelled', 'refunded')
  AND o.created_at >= NOW() - INTERVAL '30 days'
WHERE p.status = 'published'
GROUP BY p.id, p.name_en, p.name_ar, p.slug, p.price_kwd, p.compare_at_price_kwd
ORDER BY units_sold DESC
LIMIT 50;

CREATE UNIQUE INDEX idx_best_sellers_monthly_product ON public.best_sellers_monthly(product_id);
