-- Function to safely increment coupon usage
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(p_coupon_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.coupons
  SET used_count = used_count + 1,
      updated_at = NOW()
  WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.increment_coupon_usage IS 'Increments the used_count for a coupon — bypasses RLS via SECURITY DEFINER';
