-- ============================================================================
-- Migration 009: Row-Level Security Policies
-- NewStarSports — Kuwait Toy Shop
-- RLS on EVERY table — no exceptions
-- ============================================================================

-- ── Enable RLS on ALL tables ─────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════════════════════
-- PUBLIC READ policies (anyone can read storefront data)
-- ══════════════════════════════════════════════════════════════════════════════

-- Categories — public read
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = TRUE);

-- Brands — public read
CREATE POLICY "brands_public_read" ON public.brands
  FOR SELECT USING (is_active = TRUE);

-- Products — public read published only
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'published');

-- Product variants — public read
CREATE POLICY "variants_public_read" ON public.product_variants
  FOR SELECT USING (is_active = TRUE);

-- Product images — public read
CREATE POLICY "images_public_read" ON public.product_images
  FOR SELECT USING (TRUE);

-- Tags — public read
CREATE POLICY "tags_public_read" ON public.tags
  FOR SELECT USING (TRUE);

CREATE POLICY "product_tags_public_read" ON public.product_tags
  FOR SELECT USING (TRUE);

-- Governorates — public read
CREATE POLICY "governorates_public_read" ON public.governorates
  FOR SELECT USING (is_active = TRUE);

-- Areas — public read
CREATE POLICY "areas_public_read" ON public.areas
  FOR SELECT USING (is_active = TRUE);

-- Banners — public read active only
CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (
    is_active = TRUE
    AND (schedule_start IS NULL OR schedule_start <= NOW())
    AND (schedule_end IS NULL OR schedule_end >= NOW())
  );

-- Settings — public read
CREATE POLICY "settings_public_read" ON public.settings
  FOR SELECT USING (TRUE);

-- Coupons — public read active only
CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (
    is_active = TRUE
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (expires_at IS NULL OR expires_at >= NOW())
  );

-- Reviews — public read approved only
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (is_approved = TRUE);

-- Review images — public read
CREATE POLICY "review_images_public_read" ON public.review_images
  FOR SELECT USING (TRUE);

-- Questions — public read approved only
CREATE POLICY "questions_public_read" ON public.questions
  FOR SELECT USING (is_approved = TRUE);

-- Answers — public read
CREATE POLICY "answers_public_read" ON public.answers
  FOR SELECT USING (TRUE);

-- ══════════════════════════════════════════════════════════════════════════════
-- CUSTOMER OWN-DATA policies (users can only access their own data)
-- ══════════════════════════════════════════════════════════════════════════════

-- Profiles — own row only
CREATE POLICY "profiles_own_read" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Addresses — own addresses only
CREATE POLICY "addresses_own_select" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_own_insert" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_own_update" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_own_delete" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Orders — own orders only
CREATE POLICY "orders_own_read" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Order items — own order items (via order FK)
CREATE POLICY "order_items_own_read" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Order timeline — own order timeline
CREATE POLICY "order_timeline_own_read" ON public.order_timeline
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_timeline.order_id AND orders.user_id = auth.uid())
  );

-- Payments — own payments
CREATE POLICY "payments_own_read" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
  );

-- Wishlist — own items only
CREATE POLICY "wishlist_own_select" ON public.wishlist_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_own_insert" ON public.wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_own_delete" ON public.wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

-- Loyalty — own points only
CREATE POLICY "loyalty_own_read" ON public.loyalty_points_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- Reviews — users can create and edit own reviews
CREATE POLICY "reviews_own_insert" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_update" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_own_delete" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Questions — users can create own questions
CREATE POLICY "questions_own_insert" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Returns — own returns only
CREATE POLICY "returns_own_select" ON public.returns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "returns_own_insert" ON public.returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Return items — accessible via return
CREATE POLICY "return_items_own_read" ON public.return_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid())
  );

-- Consent log — users can insert own consent
CREATE POLICY "consent_own_insert" ON public.consent_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consent_own_read" ON public.consent_log
  FOR SELECT USING (auth.uid() = user_id);

-- Coupon usage — users can read own usage
CREATE POLICY "coupon_usage_own_read" ON public.coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Abandoned carts — own carts only
CREATE POLICY "abandoned_carts_own_select" ON public.abandoned_carts
  FOR SELECT USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- SERVICE ROLE policies (Server Actions — bypass RLS via service role key)
-- ══════════════════════════════════════════════════════════════════════════════
-- Note: Service role key inherently bypasses RLS in Supabase.
-- The policies above protect the anon/authenticated users.
-- Server Actions use createServiceClient() which uses the service role key.

-- ══════════════════════════════════════════════════════════════════════════════
-- ADMIN STAFF policies (staff_members can manage data via authenticated role)
-- ══════════════════════════════════════════════════════════════════════════════

-- Staff members — own row read
CREATE POLICY "staff_own_read" ON public.staff_members
  FOR SELECT USING (auth.uid() = user_id);

-- Audit log — INSERT only, no UPDATE/DELETE
CREATE POLICY "audit_log_insert" ON public.audit_log
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "audit_log_read" ON public.audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.staff_members WHERE staff_members.user_id = auth.uid() AND staff_members.is_active = TRUE)
  );

-- Revoke UPDATE/DELETE on append-only tables
REVOKE UPDATE, DELETE ON public.audit_log FROM authenticated;
REVOKE UPDATE, DELETE ON public.consent_log FROM authenticated;

-- Newsletter — service role insert (via Server Action)
CREATE POLICY "newsletter_insert" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

-- Stock reservations — public insert for checkout
CREATE POLICY "reservations_insert" ON public.stock_reservations
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "reservations_read" ON public.stock_reservations
  FOR SELECT USING (TRUE);

-- Inventory logs — read for staff
CREATE POLICY "inventory_logs_staff_read" ON public.inventory_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.staff_members WHERE staff_members.user_id = auth.uid() AND staff_members.is_active = TRUE)
  );
