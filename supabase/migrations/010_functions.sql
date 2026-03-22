-- ============================================================================
-- Migration 010: Functions & Triggers
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Auto-create profile on user signup ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, locale_preference)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'locale_preference', 'ar')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Order Number Sequence ────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  seq_val BIGINT;
  year_part TEXT;
BEGIN
  seq_val := nextval('public.order_number_seq');
  year_part := to_char(NOW(), 'YYYY');
  RETURN 'NSS-' || year_part || '-' || lpad(seq_val::TEXT, 5, '0');
END;
$$;

-- ── Invoice Number Sequence ──────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  seq_val BIGINT;
  year_part TEXT;
BEGIN
  seq_val := nextval('public.invoice_number_seq');
  year_part := to_char(NOW(), 'YYYY');
  RETURN 'INV-' || year_part || '-' || lpad(seq_val::TEXT, 5, '0');
END;
$$;

-- ── Atomic stock decrement (prevents overselling) ────────────────────────────
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE public.product_variants
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_variant_id
    AND stock_quantity >= p_quantity;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$;

-- ── Calculate product average rating ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_product_rating(p_product_id UUID)
RETURNS TABLE (avg_rating NUMERIC, review_count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    ROUND(AVG(rating)::NUMERIC, 1),
    COUNT(*)
  FROM public.reviews
  WHERE product_id = p_product_id
    AND is_approved = TRUE;
$$;

-- ── Address count enforcement (max 10) ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_address_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.addresses WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 addresses allowed per user';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_address_limit
  BEFORE INSERT ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.check_address_limit();

-- ── Ensure only one default address per user ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_default = TRUE;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER single_default_address
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_default_address();
