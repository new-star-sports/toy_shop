-- ============================================================================
-- Migration 001: Enable Required Extensions
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Cryptographic functions (used for encrypted cookies, hashing)
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- Auto-update updated_at timestamps
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;

-- Scheduled jobs (pg_cron is enabled via Supabase Dashboard → Database → Extensions)
-- NOTE: pg_cron must be enabled in the Supabase Dashboard before running cron.schedule()
