-- ============================================================================
-- Migration 002: Identity Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Profiles ─────────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific fields
CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT,
  phone               TEXT,
  avatar_url          TEXT,
  locale_preference   TEXT NOT NULL DEFAULT 'ar' CHECK (locale_preference IN ('en', 'ar')),
  marketing_consent   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Customer profiles extending auth.users';

-- Auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Staff Members ────────────────────────────────────────────────────────────
CREATE TYPE public.staff_role AS ENUM (
  'super_admin', 'manager', 'editor', 'fulfillment', 'support'
);

CREATE TABLE public.staff_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.staff_role NOT NULL DEFAULT 'support',
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.staff_members IS 'Admin/staff users with role assignment';

CREATE TRIGGER staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Consent Log (PDPL Compliance) ────────────────────────────────────────────
-- Append-only: no UPDATE or DELETE allowed
CREATE TABLE public.consent_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consent_type  TEXT NOT NULL, -- 'marketing_email', 'marketing_whatsapp', 'privacy_policy', 'terms'
  granted       BOOLEAN NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.consent_log IS 'PDPL consent records — append-only, no UPDATE/DELETE';
