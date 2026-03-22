-- ============================================================================
-- Migration 004: Geography Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Governorates ─────────────────────────────────────────────────────────────
CREATE TABLE public.governorates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en     TEXT NOT NULL UNIQUE,
  name_ar     TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.governorates IS '6 Kuwait governorates';

-- ── Areas (Neighbourhoods) ───────────────────────────────────────────────────
CREATE TABLE public.areas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  governorate_id  UUID NOT NULL REFERENCES public.governorates(id) ON DELETE CASCADE,
  name_en         TEXT NOT NULL,
  name_ar         TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.areas IS 'Neighbourhoods within Kuwait governorates';
CREATE INDEX idx_areas_governorate ON public.areas(governorate_id);
