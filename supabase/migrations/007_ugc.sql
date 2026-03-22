-- ============================================================================
-- Migration 007: User-Generated Content Tables
-- NewStarSports — Kuwait Toy Shop
-- ============================================================================

-- ── Reviews ──────────────────────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  order_item_id   UUID REFERENCES public.order_items(id),
  rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title           TEXT,
  body            TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved     BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned_home  BOOLEAN NOT NULL DEFAULT FALSE,
  admin_reply     TEXT,
  admin_reply_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.reviews IS 'Product reviews with admin moderation';
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_pinned ON public.reviews(is_pinned_home) WHERE is_pinned_home = TRUE;
CREATE UNIQUE INDEX idx_reviews_user_product ON public.reviews(user_id, product_id);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── Review Images ────────────────────────────────────────────────────────────
CREATE TABLE public.review_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_review_images_review ON public.review_images(review_id);

-- ── Questions ────────────────────────────────────────────────────────────────
CREATE TABLE public.questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  body        TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_product ON public.questions(product_id);

-- ── Answers ──────────────────────────────────────────────────────────────────
CREATE TABLE public.answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id),
  body        TEXT NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_question ON public.answers(question_id);
