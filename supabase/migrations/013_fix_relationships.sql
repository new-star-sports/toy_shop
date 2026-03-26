-- ============================================================================
-- Migration: Fix Table Relationships for PostgREST
-- Ensures that 'orders' and 'addresses' directly reference 'public.profiles'
-- ============================================================================

BEGIN;

-- 1. Fix Orders relationship
-- PostgREST needs a direct foreign key between public tables to auto-join.
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- 2. Fix Addresses relationship
ALTER TABLE public.addresses
DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;

ALTER TABLE public.addresses
ADD CONSTRAINT addresses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 3. Fix Returns relationship
ALTER TABLE public.returns
DROP CONSTRAINT IF EXISTS returns_user_id_fkey;

ALTER TABLE public.returns
ADD CONSTRAINT returns_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

COMMIT;
