# NewStarSports — Master Project Document
> **نيو ستار سبورتس** | Kuwait Toy Shop E-Commerce Platform
> Version 3.0 — Development Master Reference
> Status: Active — Use this document throughout the entire project lifecycle

---

## How to Use This Document

This is the **single source of truth** for the NewStarSports project. Every developer, designer, and stakeholder should refer to this document before making any decision. It covers:

- Full feature list with checklists you tick off as you build
- Every product field with type, requirement, and purpose
- Complete page inventory for both customer and admin apps
- Bidirectional admin ↔ customer data flow (the most critical part)
- Legal compliance requirements for Kuwait
- Payment gateway decision and reasoning
- RTL / bilingual implementation rules
- Security and performance requirements
- Phase-by-phase build plan with task checklists
- Project management rules to prevent errors
- Client information placeholder (fill when client responds)

**Checklist convention used throughout:**
- `[ ]` = Not started
- `[x]` = Complete
- `[~]` = In progress
- `[!]` = Blocked — needs input or decision

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Brand & Design System](#2-brand--design-system)
3. [Technology Stack & Architecture](#3-technology-stack--architecture)
4. [Monorepo Folder Structure](#4-monorepo-folder-structure)
5. [Database Schema](#5-database-schema)
6. [Product Management — All Fields](#6-product-management--all-fields)
7. [Customer Side — All Pages](#7-customer-side--all-pages)
8. [Home Page — All 16 Sections (Detailed)](#8-home-page--all-16-sections-detailed)
9. [Admin Side — All Pages](#9-admin-side--all-pages)
10. [Admin ↔ Customer Bidirectional Data Flow](#10-admin--customer-bidirectional-data-flow)
11. [Address Management — Kuwait Format](#11-address-management--kuwait-format)
12. [Checkout Flow](#12-checkout-flow)
13. [Payment Gateways](#13-payment-gateways)
14. [Settings Control Panel — Full Spec](#14-settings-control-panel--full-spec)
15. [RTL & Bilingual Implementation](#15-rtl--bilingual-implementation)
16. [Mobile-First & PWA](#16-mobile-first--pwa)
17. [Security Architecture](#17-security-architecture)
18. [Performance Strategy](#18-performance-strategy)
19. [Legal Compliance — Kuwait](#19-legal-compliance--kuwait)
20. [Kuwait-Specific Product Fields (HS Code & KUCAS)](#20-kuwait-specific-product-fields-hs-code--kucas)
21. [Invoice & Order Legal Requirements](#21-invoice--order-legal-requirements)
22. [Email & Notification System](#22-email--notification-system)
23. [Phase-by-Phase Build Plan with Checklists](#23-phase-by-phase-build-plan-with-checklists)
24. [Project Management Framework](#24-project-management-framework)
25. [Admin ↔ Customer Gap Prevention Checklist](#25-admin--customer-gap-prevention-checklist)
26. [Pre-Launch QA Master Checklist](#26-pre-launch-qa-master-checklist)
27. [Client Information — To Be Filled](#27-client-information--to-be-filled)
28. [Open Decisions Log](#28-open-decisions-log)

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Project name** | NewStarSports — نيو ستار سبورتس |
| **Type** | Full-stack B2C e-commerce platform |
| **Market** | State of Kuwait |
| **Languages** | Arabic (ar-KW, RTL) + English (LTR) — fully bilingual |
| **Currency** | Kuwaiti Dinar (KWD) — always 3 decimal places (e.g. 5.500 KD) |
| **Applications** | `apps/storefront` + `apps/admin` + `apps/api` |
| **Architecture** | Turborepo monorepo |
| **Primary devices** | Mobile-first (70%+ Kuwait traffic is mobile), PWA |
| **Primary payment** | MyFatoorah (KNET + cards) |
| **Timeline** | 26 weeks, 7 phases |
| **Document version** | 3.0 — master development reference |

### Core objectives

1. Increase the client's toy sales by providing a professional, fast online storefront
2. Replace manual order handling with a full admin order management system
3. Enable the client to manage all content, promotions, and settings without a developer
4. Build to Kuwait legal standards (Consumer Protection Law, PDPL, KUCAS)
5. Deliver a PWA that feels like a native app on mobile

### The fundamental rule of this project

> **Every feature that exists in admin must reflect on the customer side. Every action a customer takes must be visible in the admin. If either side is incomplete, the feature is not done.**

This rule appears as a checklist on every ticket. See Section 25 for the full gap-prevention checklist.

---

## 2. Brand & Design System

### Shop identity

| Element | Value |
|---|---|
| Name (English) | NewStarSports |
| Name (Arabic) | نيو ستار سبورتس |
| Tagline (EN) | Kuwait's home for toys |
| Tagline (AR) | وجهتك للألعاب في الكويت |

### Colour palette

| CSS token | Hex | Usage |
|---|---|---|
| `--nss-primary` | `#1B3A6B` | Deep navy — nav, headings, primary buttons, footer |
| `--nss-accent` | `#FF6B2B` | Vibrant orange — CTAs, sale badges, flash sale, hover states |
| `--nss-gold` | `#FFD700` | Gold — star ratings, loyalty points, premium badges |
| `--nss-surface` | `#F8F7F4` | Warm off-white — page background |
| `--nss-card` | `#FFFFFF` | Pure white — cards, modals, forms, product images |
| `--nss-text-primary` | `#1A1A2E` | Near-black — all body text |
| `--nss-text-secondary` | `#6B6B80` | Muted grey — metadata, labels, helper text |
| `--nss-success` | `#16A34A` | Green — in stock, order confirmed, approved |
| `--nss-danger` | `#DC2626` | Red — out of stock, errors, warnings |
| `--nss-border` | `#E5E2DA` | Warm light grey — all borders |
| `--nss-overlay` | `rgba(27,58,107,0.6)` | Navy overlay — image overlays, hero text backgrounds |

### Typography

| Use | Font | Weight | Notes |
|---|---|---|---|
| Latin headings | IBM Plex Sans | 600 | Loaded via `next/font`, self-hosted |
| Latin body | IBM Plex Sans | 400 | Same file, no extra request |
| Arabic headings + body | IBM Plex Arabic | 400 / 600 | Browser selects by character range |
| Prices, order numbers | IBM Plex Mono | 500 | Numbers always LTR regardless of page direction |

### Logo variants needed from client

- [ ] Full logo — SVG, full colour (navy + orange)
- [ ] Full logo — SVG, white version (for dark backgrounds)
- [ ] Icon mark only — SVG (star icon) — used for PWA icon, favicon, app splash
- [ ] Arabic wordmark — SVG

### Design principles (non-negotiable)

1. **Mobile-first** — design at 375px first, desktop is enhancement
2. **Touch targets** — minimum 44×44px on ALL interactive elements, no exceptions
3. **RTL-safe CSS** — use `margin-inline-start`, `padding-inline-end` — never `margin-left`
4. **Numbers stay LTR** — prices, countdowns, phone numbers, order numbers — always `dir="ltr"`
5. **No layout shift** — all images have explicit aspect ratios, fonts loaded with `next/font`
6. **WCAG 2.1 AA** — minimum colour contrast 4.5:1 for body text, 3:1 for large text

---

## 3. Technology Stack & Architecture

### Core stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | RSC, ISR, Edge, streaming |
| Monorepo | Turborepo + pnpm | Latest | Shared code, parallel builds, caching |
| Database | Supabase (PostgreSQL) | Latest | RLS, Auth, Storage, Realtime, Edge Functions |
| UI primitives | Radix UI via shadcn/ui | Latest | Accessible, unstyled, full control |
| Styling | Tailwind CSS | v4 | Utility-first, RTL variants (`rtl:`) |
| Language | TypeScript | 5.x strict | Type safety across all packages |
| State (server) | React Server Components | — | Default for all data fetching |
| State (client) | Zustand | Latest | Cart, UI state only |
| Forms | React Hook Form + Zod | Latest | Validation on client and server |

### Supporting services

| Service | Purpose | Apply when |
|---|---|---|
| Vercel | Hosting, CDN, Edge Network, image optimisation | Day 1 |
| MyFatoorah | Primary payment: KNET, Visa, MC, Apple Pay, KWD | Day 1 — 7-14 day approval |
| Tap Payments | Secondary payment: international cards, backup | Week 1 |
| Supabase pg_cron | Scheduled tasks: stock expiry, flash sales, best sellers, alerts | Day 1 |
| Algolia | Instant search — Arabic stemming support | Week 1 |
| Resend | Transactional emails — order confirm, shipping, welcome | Week 1 |
| Sentry | Error tracking, both apps | Week 1 |
| PostHog | Product analytics, funnels, A/B testing | Week 1 |
| next-pwa (Serwist) | Service worker, offline caching | Phase 5 |

### Rendering strategy per route type

| Route type | Strategy | Revalidation |
|---|---|---|
| Home page | ISR | 60 seconds |
| Product listing (PLP) | SSR (filters are dynamic) | — |
| Product detail (PDP) | ISR | 300 seconds |
| Category pages | ISR | 300 seconds |
| Brand pages | ISR | 300 seconds |
| Blog posts | ISR | On publish |
| Static pages (about, FAQ, legal) | SSG | On deploy |
| Cart | CSR | — |
| Checkout | SSR (no cache) | — |
| Account pages | SSR (no cache) | — |
| Admin (all) | SSR (no cache) | — |

---

## 4. Monorepo Folder Structure

```
newstarsports/
├── apps/
│   ├── storefront/                    # Customer-facing Next.js app
│   │   ├── app/
│   │   │   ├── [locale]/              # /en/... and /ar/...
│   │   │   │   ├── (public)/          # No auth required
│   │   │   │   │   ├── page.tsx       # Home page
│   │   │   │   │   ├── products/      # PLP
│   │   │   │   │   ├── products/[slug]/  # PDP
│   │   │   │   │   ├── category/[slug]/
│   │   │   │   │   ├── brand/[slug]/
│   │   │   │   │   ├── search/
│   │   │   │   │   ├── cart/
│   │   │   │   │   ├── blog/
│   │   │   │   │   ├── blog/[slug]/
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── contact/
│   │   │   │   │   ├── faq/
│   │   │   │   │   ├── privacy/
│   │   │   │   │   ├── terms/
│   │   │   │   │   ├── returns-policy/
│   │   │   │   │   └── delivery-info/
│   │   │   │   ├── (auth)/            # Auth pages
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── reset-password/
│   │   │   │   └── (protected)/       # Requires login
│   │   │   │       ├── checkout/
│   │   │   │       ├── order/[id]/success/
│   │   │   │       ├── account/
│   │   │   │       ├── account/orders/
│   │   │   │       ├── account/orders/[id]/
│   │   │   │       ├── account/addresses/
│   │   │   │       ├── account/wishlist/
│   │   │   │       ├── account/returns/
│   │   │   │       └── account/loyalty/
│   │   │   └── layout.tsx             # Root layout — locale + dir on <html>
│   │   ├── components/                # Storefront-specific components
│   │   ├── middleware.ts              # Locale detect + auth guard
│   │   └── public/
│   │       ├── manifest.json          # PWA manifest
│   │       ├── sw.js                  # Service worker
│   │       └── icons/                 # PWA icons (all sizes)
│   │
│   ├── admin/                         # Admin dashboard Next.js app
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   └── (dashboard)/
│   │   │       ├── page.tsx           # Dashboard home
│   │   │       ├── products/
│   │   │       ├── products/new/
│   │   │       ├── products/[id]/
│   │   │       ├── orders/
│   │   │       ├── orders/[id]/
│   │   │       ├── customers/
│   │   │       ├── customers/[id]/
│   │   │       ├── categories/
│   │   │       ├── inventory/
│   │   │       ├── banners/
│   │   │       ├── coupons/
│   │   │       ├── reviews/
│   │   │       ├── analytics/
│   │   │       ├── shipping/
│   │   │       ├── returns/
│   │   │       ├── blog/
│   │   │       ├── staff/
│   │   │       ├── audit-log/
│   │   │       └── settings/
│   │   └── middleware.ts              # RBAC route protection
│   │
│   └── api/                           # Edge API — webhooks only
│       └── app/api/
│           ├── webhooks/myfatoorah/
│           ├── webhooks/tap/
│           └── webhooks/supabase/
│       # NOTE: All cron jobs run via Supabase pg_cron (see Section 5)
│
├── packages/
│   ├── ui/                            # All shared shadcn components
│   │   ├── components/                # NSS design-token components
│   │   └── tailwind.config.ts         # Shared Tailwind config with NSS tokens
│   ├── db/                            # Supabase client + typed queries
│   │   ├── client.ts                  # createBrowserClient / createServerClient
│   │   ├── types.ts                   # Auto-generated from Supabase
│   │   └── queries/                   # Reusable typed query functions
│   ├── auth/                          # Auth helpers
│   │   ├── middleware.ts              # Middleware factory
│   │   ├── session.ts                 # Session helpers
│   │   └── rbac.ts                    # Role checking utilities
│   ├── validators/                    # Zod schemas (shared)
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── address.ts
│   │   ├── checkout.ts
│   │   └── settings.ts
│   └── config/
│       ├── tsconfig/                  # Base tsconfig
│       ├── eslint/                    # Shared ESLint config
│       └── env/                       # t3-env — runtime env validation
│
├── turbo.json
├── pnpm-workspace.yaml
└── .github/
    └── workflows/
        ├── ci.yml                     # Lint + typecheck + test on every PR
        └── lighthouse.yml             # Lighthouse CI gate on every PR
```

---

## 5. Database Schema

### Key tables

```sql
-- ── IDENTITY ─────────────────────────────────────────────────────
profiles              -- extends auth.users (id FK to auth.users.id)
staff_members         -- admin users with role assignment
roles                 -- super_admin | manager | editor | fulfillment | support
consent_log           -- PDPL consent records (append-only, no UPDATE/DELETE)

-- ── CATALOGUE ────────────────────────────────────────────────────
categories            -- tree: self-referencing parent_id
brands
products              -- main product record
product_variants      -- one row per variant (colour/size/pack)
product_images        -- ordered, FK to product + optional variant_id
product_tags          -- many-to-many products ↔ tags

-- ── GEOGRAPHY ────────────────────────────────────────────────────
governorates          -- 6 Kuwait governorates
areas                 -- neighbourhoods, FK to governorate

-- ── COMMERCE ─────────────────────────────────────────────────────
addresses             -- customer address book (Kuwait format)
orders                -- order header (snapshots: name, email, phone, address)
order_items           -- line items (snapshots: name, SKU, price at purchase time)
order_timeline        -- status change log per order
payments              -- payment records with gateway transaction IDs
stock_reservations    -- soft-hold stock during checkout (15-min TTL)
returns               -- return request header
return_items          -- items in each return

-- ── MARKETING ────────────────────────────────────────────────────
banners               -- all banner types: hero, announcement, editorial, split
coupons               -- discount codes
coupon_usage          -- tracks which customer used which coupon
newsletter_subscribers
wishlist_items
loyalty_points_ledger -- append-only ledger (no UPDATE/DELETE on past rows)
abandoned_carts       -- carts idle > 24h for recovery emails

-- ── UGC ──────────────────────────────────────────────────────────
reviews               -- product reviews
review_images         -- photos attached to reviews
questions             -- product Q&A questions
answers               -- Q&A answers

-- ── SYSTEM ───────────────────────────────────────────────────────
settings              -- key-value store for all configurable settings
audit_log             -- append-only, NO UPDATE, NO DELETE ever
inventory_logs        -- every stock change: who, what, when, why
best_sellers_weekly   -- materialized view, refreshed by pg_cron hourly
best_sellers_monthly  -- materialized view, refreshed by pg_cron daily
```

### Supabase pg_cron — scheduled jobs

All scheduled tasks run via Supabase's built-in `pg_cron` extension. No Vercel cron routes or external scheduler needed. Jobs are defined in database migrations so they are version-controlled and reviewed in PRs.

| Job | Schedule | Type | Description |
|---|---|---|---|
| Refresh `best_sellers_weekly` | Every hour | Direct SQL | `REFRESH MATERIALIZED VIEW CONCURRENTLY best_sellers_weekly` |
| Refresh `best_sellers_monthly` | Daily at 02:00 UTC | Direct SQL | `REFRESH MATERIALIZED VIEW CONCURRENTLY best_sellers_monthly` |
| Expire stock reservations | Every 5 minutes | Direct SQL | `DELETE FROM stock_reservations WHERE expires_at < NOW()` |
| Flash sale auto-start/end | Every minute | Edge Function | Check `flash_sales` table, activate/deactivate, call revalidate |
| KUCAS certificate expiry | Daily at 00:00 UTC | Direct SQL | Auto-unpublish products with expired KUCAS certificates |
| Abandoned cart recovery | Every hour | Edge Function → Resend | Email users with carts idle > 24h |
| Low-stock alerts | Every hour | Edge Function → Resend | Email admin when stock falls below threshold |

> **Limits:** Max 8 concurrent jobs, each under 10 minutes. Our 7 jobs fit comfortably.
> **Observability:** Every job run is logged in `cron.job_run_details` — visible in Supabase dashboard.

### Critical: RLS policy on every table

```sql
-- Example — customers only see their own orders
CREATE POLICY "customers_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role inserts orders (via Server Action — never from client)
CREATE POLICY "service_role_insert_orders" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Audit log: INSERT only — no one can UPDATE or DELETE
REVOKE UPDATE, DELETE ON audit_log FROM authenticated;
REVOKE UPDATE, DELETE ON audit_log FROM service_role;
```

### Stock reservation to prevent overselling

```sql
CREATE TABLE stock_reservations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id      UUID NOT NULL REFERENCES product_variants(id),
  quantity        INTEGER NOT NULL,
  session_id      TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- pg_cron job runs every 5 minutes: DELETE FROM stock_reservations WHERE expires_at < NOW()
```

---

## 6. Product Management — All Fields

This is the complete field specification for every product created in the admin. Fields are grouped into tabs matching the admin UI. All Mandatory fields block publishing if empty.

### Tab 1 — Basic information

| Field | Required | Input type | Validation | Notes |
|---|---|---|---|---|
| Product name (EN) | **Mandatory** | Text | Max 200 chars | Shown on all pages, search, invoices |
| Product name (AR) | **Mandatory** | Text | Max 200 chars | Shown when locale = Arabic |
| URL slug | **Mandatory** | Text, auto-generated | Lowercase, hyphens only, unique | Generated from EN name — editable. Used in `/products/[slug]` |
| Short description (EN) | **Mandatory** | Text | Max 160 chars | Product card and SEO meta description |
| Short description (AR) | **Mandatory** | Text | Max 160 chars | Arabic card description |
| Full description (EN) | **Mandatory** | Rich text (Tiptap) | — | Full details, features, what's in the box |
| Full description (AR) | **Mandatory** | Rich text (Tiptap) | — | Arabic full description |
| Product status | **Mandatory** | Dropdown | — | `draft` / `published` / `archived` |

### Tab 2 — Media

| Field | Required | Input type | Validation | Notes |
|---|---|---|---|---|
| Product images | **Mandatory** | Multi-file drag-drop | Min 1, max 10 images, JPG/PNG/WebP | First image = primary listing image. Drag to reorder. |
| Image alt text (EN) | **Mandatory** | Text per image | Max 125 chars | SEO and accessibility — describe the image |
| Image alt text (AR) | **Mandatory** | Text per image | Max 125 chars | Arabic alt text |
| Variant image mapping | Optional | Image selector per variant | — | Map uploaded images to specific variants (e.g. red image → Red variant) |
| Product video URL | Optional | URL | YouTube or Vimeo only | Embedded player on PDP |

### Tab 3 — Pricing

| Field | Required | Input type | Validation | Notes |
|---|---|---|---|---|
| Price (KWD) | **Mandatory** | Decimal | 3dp, > 0 | Selling price. E.g. `5.500` |
| Compare-at price (KWD) | Optional | Decimal | 3dp, > price | Original / RRP. Shown struck-through. Triggers sale badge automatically. |
| Cost price (KWD) | Optional | Decimal | 3dp | Admin-only. Used for profit margin in analytics. Never shown to customer. |
| Tax status | **Mandatory** | Toggle | — | `taxable` / `tax-exempt`. VAT-ready — currently 0% Kuwait. |
| Include in flash sale | Optional | Toggle | — | Toggle on to include in an active flash sale |
| Flash sale discount % | Optional | Integer | 1–99 | Applied during flash sale. E.g. `20` = 20% off. |

### Tab 4 — Inventory

| Field | Required | Input type | Validation | Notes |
|---|---|---|---|---|
| SKU | **Mandatory** | Text | Unique across all products | Internal reference. Appears on invoices, orders, returns. |
| Barcode / EAN | Optional | Text | — | International barcode for stock scanning |
| Track inventory | **Mandatory** | Toggle | — | If off, product always shows as available |
| Stock quantity | **Mandatory** if tracked | Integer | ≥ 0 | Updated automatically on each order |
| Low-stock threshold | **Mandatory** if tracked | Integer | ≥ 1 | Admin email alert fires when stock falls below this |
| Out-of-stock behaviour | **Mandatory** | Dropdown | — | `hide` / `show_out_of_stock` / `continue_selling` |
| Allow backorders | Optional | Toggle | — | Allow orders when stock = 0 |

### Tab 5 — Variants

| Field | Required | Input type | Notes |
|---|---|---|---|
| Variant type(s) | **Mandatory** if variants exist | Multi-select | `colour` / `size` / `pack_size` / `age_group` / `custom` |
| Variant option name (EN) | **Mandatory** | Text | E.g. Red, Large, 2-Pack |
| Variant option name (AR) | **Mandatory** | Text | Arabic name for the option |
| Variant price override (KWD) | Optional | Decimal 3dp | Leave blank to inherit base price |
| Variant compare-at price | Optional | Decimal 3dp | Variant-specific RRP |
| Variant SKU | **Mandatory** | Text, unique | Separate SKU per variant |
| Variant barcode | Optional | Text | Per-variant barcode |
| Variant stock quantity | **Mandatory** | Integer | Independent stock per variant |
| Variant images | Optional | Image selector | Select from uploaded images |
| Variant weight (grams) | Optional | Integer | Override if different from base |

### Tab 6 — Organisation

| Field | Required | Input type | Notes |
|---|---|---|---|
| Category | **Mandatory** | Tree dropdown | One or more. Supports nested categories. |
| Brand | **Mandatory** | Dropdown / free text | E.g. LEGO, Barbie. Used for brand filtering and brand pages. |
| Tags | Optional | Multi-select + free text | E.g. `outdoor`, `educational`, `battery-free`, `wooden` |
| Feature: new arrival | Optional | Toggle | Pins to New Arrivals section on home page |
| Feature: best seller override | Optional | Toggle | Manually pins to Best Sellers (overrides algorithm) |
| Feature: homepage | Optional | Toggle | Pins to featured collection on home page |
| Related products | Optional | Product search | 4–8 manually selected related products shown on PDP |

### Tab 7 — Safety & Legal *(Kuwait mandatory)*

> All fields in this tab are **legally required** under Kuwait Consumer Protection Law No. 39/2014 and KUCAS toy safety regulations. Products cannot be published without completing this tab.

| Field | Required | Input type | Notes |
|---|---|---|---|
| Minimum age (years) | **Mandatory** | Integer | E.g. `3`. Displayed prominently on PDP and invoice. |
| Maximum age (years) | Optional | Integer | Upper bound, e.g. `12` |
| Safety warnings (EN) | **Mandatory** | Text area | E.g. *Warning: Not suitable for children under 3 years — small parts choking hazard* |
| Safety warnings (AR) | **Mandatory** | Text area | E.g. *تحذير: غير مناسب للأطفال دون سن 3 سنوات — خطر الاختناق بالأجزاء الصغيرة* |
| KUCAS certificate number | **Mandatory** | Text | Certificate of Conformity (CoC) from Kuwait Conformity Assurance Scheme |
| KUCAS certificate expiry | **Mandatory** | Date | System warns 30 days before expiry. Auto-unpublishes on expiry. |
| Country of origin | **Mandatory** | Dropdown | Required by Consumer Protection Law. On PDP and invoice. E.g. China, Germany, USA |
| Materials / composition (EN) | **Mandatory** | Text area | E.g. *ABS plastic, polyester fabric* |
| Materials / composition (AR) | **Mandatory** | Text area | Arabic materials |
| Battery required | Optional | Toggle | Does this product need a battery? |
| Battery type | Optional | Text | E.g. `3 × AA`, `1 × 9V` — required if battery toggle is on |
| Battery included | Optional | Toggle | Are batteries in the box? |
| Battery disposal instructions (EN) | Optional | Text | E.g. *Dispose at authorised recycling point* |
| Battery disposal instructions (AR) | Optional | Text | Arabic disposal instructions |
| CE / other certifications | Optional | Text | European CE or other international safety marks |
| Manufacturer / supplier name | **Mandatory** | Text | Required on invoice |
| Manufacturer address | Optional | Text | For warranty and regulatory enquiries |
| Warranty duration (months) | Optional | Integer | E.g. `12`. Displayed on PDP. |
| Warranty description (EN) | Optional | Text area | What is covered / excluded |
| Warranty description (AR) | Optional | Text area | Arabic warranty terms |
| Return eligibility | **Mandatory** | Dropdown | `eligible` / `not_eligible` |
| Return exclusion reason (EN) | Optional | Text | Required if not eligible. E.g. *Cannot be returned once opened.* |
| Return exclusion reason (AR) | Optional | Text | Arabic exclusion reason |

### Tab 8 — Shipping

| Field | Required | Input type | Notes |
|---|---|---|---|
| Weight (grams) | **Mandatory** | Integer | Used for shipping rate calculation and display |
| Length (cm) | **Mandatory** | Decimal | Package dimension |
| Width (cm) | **Mandatory** | Decimal | Package dimension |
| Height (cm) | **Mandatory** | Decimal | Package dimension |
| Requires special handling | Optional | Toggle | Fragile or oversized — adds note to packing slip |
| Delivery restriction by zone | Optional | Multi-select | Restrict to specific Kuwait governorates |

### Tab 9 — SEO

| Field | Required | Input type | Notes |
|---|---|---|---|
| SEO title (EN) | **Mandatory** | Text, max 70 chars | Shown in Google results. Include brand name. |
| SEO title (AR) | **Mandatory** | Text, max 70 chars | Arabic Google results in Kuwait |
| SEO meta description (EN) | **Mandatory** | Text, max 160 chars | Shown below title in Google |
| SEO meta description (AR) | **Mandatory** | Text, max 160 chars | Arabic meta description |
| Canonical URL | Optional | URL | Set if duplicate content exists elsewhere |
| Open Graph image | Optional | Image 1200×630px | Shown when shared on WhatsApp, Instagram, Twitter |
| JSON-LD structured data | Auto-generated | Read-only preview | System generates `Product` schema — shows price, rating, availability in Google Rich Results |

### Tab 10 — Customs & HS Codes *(Kuwait import requirement)*

> Kuwait uses the GCC Integrated Customs Tariff (12-digit HS codes as of January 2025). These codes are required on commercial invoices for every import shipment. Storing them here means they auto-populate on all invoices and packing slips — no manual lookup needed per shipment.

| Field | Required | Input type | Notes |
|---|---|---|---|
| HS code — 6-digit international | **Mandatory** | Text, 6 digits | Universal code. E.g. `950300` (general toys). Same worldwide. |
| GCC tariff code — 12-digit | **Mandatory** | Text, 12 digits | Kuwait customs as of Jan 2025. E.g. `950300000000` |
| Customs description (EN) | Optional | Text | Short description matching supplier invoice. E.g. *Plastic construction toy set* |
| Import licence required | Optional | Toggle + text | Toggle on + enter licence number if Ministry of Commerce licence applies |
| Customs duty rate | Auto-display | Read-only | System shows applicable rate (5% standard / 0% GCC-origin). Not editable. |

**Common HS codes for toys (Chapter 95):**

| HS heading | Covers |
|---|---|
| `9503` | Dolls, toy vehicles, construction sets, puzzles, toy musical instruments, tricycles, scooters |
| `9504` | Video game consoles, playing cards, board games, chess sets |
| `9505` | Festive/seasonal articles, party toys |
| `9506` | Outdoor/sports equipment — balls, rackets, skates, trampolines, bicycles |
| `9508` | Roundabouts, swings, amusement park rides |

### Publish rule

A product **cannot be set to Published** unless:
- [ ] All **Mandatory** fields in all tabs are complete
- [ ] At least 1 product image is uploaded
- [ ] KUCAS certificate number is entered and not expired
- [ ] Minimum age is set
- [ ] Safety warnings exist in both EN and AR
- [ ] HS code (6-digit) is entered

The admin UI shows a missing-fields checklist before the publish button becomes active.

---

## 7. Customer Side — All Pages

| Route | Page name | Rendering | Auth required |
|---|---|---|---|
| `/[locale]` | Home | ISR 60s | No |
| `/[locale]/products` | Product listing | SSR | No |
| `/[locale]/products/[slug]` | Product detail | ISR 300s | No |
| `/[locale]/category/[slug]` | Category page | ISR 300s | No |
| `/[locale]/brand/[slug]` | Brand page | ISR 300s | No |
| `/[locale]/search` | Search results | SSR | No |
| `/[locale]/cart` | Cart | CSR | No |
| `/[locale]/checkout` | Checkout | SSR | **Yes** |
| `/[locale]/order/[id]/success` | Order success | SSR | **Yes** |
| `/[locale]/account` | Account profile | SSR | **Yes** |
| `/[locale]/account/orders` | Order history | SSR | **Yes** |
| `/[locale]/account/orders/[id]` | Order detail | SSR | **Yes** |
| `/[locale]/account/addresses` | Address book | SSR | **Yes** |
| `/[locale]/account/wishlist` | Wishlist | SSR | **Yes** |
| `/[locale]/account/returns` | Return requests | SSR | **Yes** |
| `/[locale]/account/loyalty` | Loyalty points | SSR | **Yes** |
| `/[locale]/login` | Login | Static | No |
| `/[locale]/register` | Register | Static | No |
| `/[locale]/forgot-password` | Forgot password | Static | No |
| `/[locale]/reset-password` | Reset password | Static | No |
| `/[locale]/about` | About us | Static | No |
| `/[locale]/contact` | Contact us | Static | No |
| `/[locale]/faq` | FAQ | Static | No |
| `/[locale]/blog` | Blog list | ISR | No |
| `/[locale]/blog/[slug]` | Blog post | ISR | No |
| `/[locale]/privacy` | Privacy policy | Static | No |
| `/[locale]/terms` | Terms of service | Static | No |
| `/[locale]/returns-policy` | Returns policy | Static | No |
| `/[locale]/delivery-info` | Delivery info | Static | No |
| `not-found` | 404 page | Static | No |
| `error` | 500 page | Static | No |
| `/offline` | PWA offline page | Static | No |

---

## 8. Home Page — All 16 Sections (Detailed)

### Section 01 — Announcement bar + mega nav

**Admin control:** `/admin/settings` → Announcement bar settings
**RTL impact:** Text flips, icons swap sides, language toggle flips position

**Announcement bar:**
- Master enable/disable toggle (admin settings)
- Up to 3 rotating messages, each: text EN + AR, optional link, enable/disable per message
- Rotation speed configurable (default 4s)
- Background colour configurable
- Schedule: optional date range
- User can dismiss for session (close button — admin can disable close button)

**Top nav bar:**
- Logo (SVG) — links to home
- Search bar (desktop centre, Algolia instant, debounced 300ms, Arabic stemming)
- Cart icon + animated badge count (Supabase Realtime sync)
- Wishlist icon + count
- Account: avatar if logged in / "Login" if guest
- Language toggle: EN ⇌ عربي (sets `NEXT_LOCALE` cookie + redirects)
- WhatsApp support icon (opens `wa.me/{number}`)

**Mega menu (desktop hover / mobile full-screen drawer):**
- Column 1: Age groups + product counts
- Column 2: Toy categories + icons
- Column 3: Top 5 brand logos
- Column 4: Promotional tile (admin-managed image + text + CTA)
- Mobile: slide-in from left, back navigation per level, close button at bottom

---

### Section 02 — Hero banner slider

**Admin control:** `/admin/banners` → Hero slider
**RTL impact:** Text alignment flips, CTA buttons reorder RTL

Per slide fields (all admin-managed):
- Desktop image (recommended 1920×700px)
- Mobile image (recommended 800×600px — separate crop)
- Headline EN + AR
- Sub-headline EN + AR
- Primary CTA: text EN + AR + link URL
- Secondary CTA: text EN + AR + link URL
- Countdown timer: optional end datetime (shows DD:HH:MM:SS overlay)
- Enable/disable per slide
- Display order (drag to reorder)
- Schedule: start date + end date

Behaviour:
- Auto-play 5s, pause on hover/touch
- Up to 5 slides
- Dot navigation + arrow navigation (arrows hidden on mobile)
- Swipe gesture on mobile
- Slide 1 image: `priority={true}` for LCP optimisation
- Slides 2–5: lazy loaded

---

### Section 03 — Trust bar

**Admin control:** `/admin/settings` → Trust bar settings
**RTL impact:** Item order reverses

- Master enable/disable toggle
- Up to 6 items, each: icon (preset list), text EN, text AR, link URL, enable/disable
- **Free delivery threshold** field → feeds cart progress bar + trust text automatically
- **Return policy days** field → feeds trust text + returns policy page

Default items:
1. Free delivery above [threshold] KD
2. Genuine licensed products
3. [X]-day easy returns
4. Delivery across all Kuwait governorates

---

### Section 04 — Flash sale countdown

**Admin control:** `/admin/coupons` → Flash sale type
**RTL impact:** Countdown digits always `dir="ltr"`. Carousel scrolls RTL.

- Section **only appears** when an active flash sale exists
- Headline EN + AR (admin-set)
- Background colour (admin-set, default `--nss-accent`)
- Countdown timer: Days : Hours : Minutes : Seconds
- Product carousel: 6–10 products, horizontal scroll
- Per product card: image, name, original price struck through, sale price, % saved badge, add-to-cart, sold-out overlay, "Only X left" badge when qty < 5
- "View all sale" link at carousel end

---

### Section 05 — Shop by category

**Admin control:** `/admin/categories` → toggle homepage pin + set order
**RTL impact:** Grid reads RTL, text overlay right-aligned

- Section headline (admin-editable in settings)
- Grid: 2 cols mobile / 3 tablet / 4 desktop
- Up to 8 categories pinned (admin-selected, drag to reorder)
- Per tile: category image, name EN/AR, product count
- Hover: scale + overlay darken

---

### Section 06 — New arrivals carousel

**Admin control:** `/admin/products` → feature as new arrival toggle per product
**RTL impact:** Carousel scrolls RTL. "New" badge flips to left side.

- "New arrivals" / "وصل حديثاً" header + "View all →" link
- Horizontal scroll, snap, 5 visible desktop / 2.2 mobile
- "New" badge: products added in last 30 days OR manually flagged
- Per card: image, name EN/AR, price KWD, brand, age group, star rating, wishlist toggle, add-to-cart

---

### Section 07 — Shop by brand

**Admin control:** `/admin/settings` → Featured brands
**RTL impact:** Strip scrolls RTL. Logos not flipped (brand identity).

- 8–12 brand logo pills, horizontal scroll
- Each: white card, greyscale → colour on hover
- Links to `/brand/[slug]` filtered PLP
- Admin: upload logo, set link, set display order

---

### Section 08 — Featured collection / editorial banner

**Admin control:** `/admin/banners` → Mid-page editorial
**RTL impact:** Layout B — image side flips. Text alignment flips.

Three layout options (admin picks):
- **Layout A:** Full-width image + text overlay + CTA
- **Layout B:** 50/50 split — image one side, 3 product cards other side
- **Layout C:** 3-column promo card grid

Admin controls: layout choice, image, headline EN+AR, body EN+AR, CTA text+link, schedule, optional countdown

---

### Section 09 — Shop by age group

**Admin control:** `/admin/settings` → Age groups
**RTL impact:** Card row reads RTL. Arabic age labels (e.g. من 3 إلى 5 سنوات)

- Row of illustrated cards: 0–2, 3–5, 6–8, 9–12, 13+
- Per card: illustration (admin-uploaded), age label EN+AR, product count
- Click: opens PLP pre-filtered by age group
- Below cards: 4-product mini grid that updates on card click (CSR island)

---

### Section 10 — Double promo banner (split)

**Admin control:** `/admin/banners` → Split promo pair (two independent slots)
**RTL impact:** Left banner becomes right in RTL

- 2 side-by-side banners (50/50 desktop, stacked mobile)
- Each independently managed: image, headline EN+AR, CTA text+link, enable/disable, schedule

---

### Section 11 — Best sellers

**Admin control:** `/admin/products` → manual pin override per product
**RTL impact:** Tab bar flips. Grid reads RTL.

- Section headline + "View all" link
- Tab filter: This week | This month | All time
- 8-product grid (2×4 desktop, scrollable mobile)
- Sales rank badge: "#1 Best seller"
- Social proof: "X sold this week"
- Data source: `best_sellers_weekly` materialized view, refreshed hourly by cron
- Admin can override: manually pin product to best sellers list

---

### Section 12 — Customer reviews / social proof

**Admin control:** `/admin/reviews` → pin to homepage
**RTL impact:** Cards right-aligned in Arabic. Star icons never flip.

- Overall store rating: X.X / 5 from Y reviews
- 4 review cards, horizontal scroll
- Per card: stars, first name + governorate, review text (max 200 chars shown), product thumbnail, verified badge, date
- Store reply shown if admin replied
- Admin selects which reviews appear here

---

### Section 13 — Gift guides & articles

**Admin control:** `/admin/blog` → "show on homepage" toggle per post
**RTL impact:** Cards RTL, reading time flips

- 3 article cards: thumbnail, title EN/AR, 1-line excerpt, read time, category tag
- Links to `/blog/[slug]`
- Content: age-specific gift guides, educational toy advice, seasonal guides (Eid, National Day)

---

### Section 14 — Loyalty programme teaser

**Admin control:** `/admin/settings` → Loyalty programme
**RTL impact:** Columns read RTL, progress bar fills RTL

- 3 benefit columns: Earn → Redeem → Birthday reward
- Guests: "Create free account" CTA
- Logged-in users: current points balance + progress bar to next reward tier
- Points rate displayed (e.g. "Earn 1 point per 0.100 KD spent")
- Admin can enable/disable loyalty programme entirely

---

### Section 15 — Newsletter & WhatsApp signup

**Admin control:** `/admin/settings` → Newsletter
**RTL impact:** Input and button order flip. Placeholder in Arabic.

- Headline + incentive text (admin-editable)
- Email input + subscribe button
- WhatsApp opt-in checkbox ("Also send me WhatsApp updates")
- **PDPL consent checkbox** — required, links to privacy policy, not pre-ticked
- Success state: thank-you + discount code display
- Duplicate: "You're already subscribed!"
- Server Action: Zod validate → insert to `newsletter_subscribers` → send welcome email via Resend

---

### Section 16 — Footer

**Admin control:** `/admin/settings` → Footer
**RTL impact:** 4-column grid reverses. Logo moves to right. Social icons right-aligned.

4 columns:
1. **Brand:** Logo, tagline EN+AR, social icons (Instagram, TikTok, Snapchat, WhatsApp)
2. **Shop links:** All products, New arrivals, Sale, Brands, Categories
3. **Help links:** FAQ, Contact, Delivery info, Returns policy
4. **Legal + trust:** Payment logos (KNET, Visa, MC, Apple Pay), SSL badge, CR number, Ministry of Commerce, copyright, language switcher

**Legal footer (mandatory):**
```
© 2025 NewStarSports. All rights reserved.
Commercial Registration No: [CR NUMBER]
Ministry of Commerce and Industry — State of Kuwait
```

---

## 9. Admin Side — All Pages

| Route | Name | Min role |
|---|---|---|
| `/admin` | Dashboard | All |
| `/admin/products` | Product list | All |
| `/admin/products/new` | Create product | Admin, Manager, Editor |
| `/admin/products/[id]` | Edit product | Admin, Manager, Editor |
| `/admin/orders` | Order list | All |
| `/admin/orders/[id]` | Order detail | All |
| `/admin/customers` | Customer list | Admin, Manager, Support |
| `/admin/customers/[id]` | Customer profile | Admin, Manager, Support |
| `/admin/categories` | Category tree | Admin, Manager, Editor |
| `/admin/inventory` | Stock levels | Admin, Manager, Fulfillment |
| `/admin/banners` | All banners | Admin, Manager, Editor |
| `/admin/coupons` | Coupons + flash sales | Admin, Manager |
| `/admin/reviews` | Review moderation | Admin, Manager, Support |
| `/admin/analytics` | Analytics | Admin, Manager |
| `/admin/shipping` | Shipping settings | Admin, Manager |
| `/admin/returns` | Return requests | All |
| `/admin/blog` | Blog posts | Admin, Manager, Editor |
| `/admin/staff` | Staff accounts | Super Admin only |
| `/admin/audit-log` | Audit log | Admin only |
| `/admin/settings` | All settings | Admin only |

### RBAC roles

| Role | Access level |
|---|---|
| `super_admin` | Full access including staff management and all settings |
| `manager` | All except staff management and danger zone settings |
| `editor` | Products, categories, banners, blog only |
| `fulfillment` | Orders and inventory only |
| `support` | Orders (read), customers (read), reviews |

---

## 10. Admin ↔ Customer Bidirectional Data Flow

> This is the most critical section. Every admin action must reflect on the storefront. Every customer action must be visible in admin. **If either side is incomplete, the feature is not done.**

### Admin → Customer

| Admin action | Customer effect | Technical mechanism |
|---|---|---|
| Publish product | Product appears in listings + search | `revalidateTag('products')` |
| Unpublish product | Product disappears from all listings | `revalidateTag('products')` |
| Change price | New price shown within 5 minutes | ISR 300s revalidation |
| Stock → 0 | "Out of stock" shown, add-to-cart disabled | ISR + Supabase Realtime |
| Activate flash sale | Flash sale section appears on home with countdown | `revalidateTag('home')` + Realtime |
| End / expire flash sale | Section disappears, prices revert | pg_cron Edge Function + revalidate |
| Enable announcement bar | Bar appears sitewide immediately | Settings cache invalidate |
| Edit announcement bar text | New text visible on next page load | Settings cache invalidate |
| Disable trust bar | Trust bar hidden immediately | Settings cache invalidate |
| Change free delivery threshold | Cart progress bar + trust bar text update | Settings cache invalidate |
| Change return policy days | Trust bar + returns policy page update | Settings cache invalidate |
| Enable/disable payment method | Option shown/hidden at checkout | Settings cache invalidate |
| Change shipping rates | Checkout shows updated rates | Settings cache invalidate |
| Update hero banner | New banner within 60 seconds | ISR 60s on home |
| Reorder hero slides | New slide order within 60 seconds | ISR 60s |
| Pin category to homepage | Category tile appears on home | `revalidateTag('home')` |
| Upload new category image | New image visible within 5 minutes | ISR |
| Approve review | Review appears on product page | `revalidateTag('reviews-[productId]')` |
| Pin review to homepage | Review card shown in Section 12 | `revalidateTag('home')` |
| Mark order as shipped + tracking | Customer sees "Shipped" status + tracking link | Supabase Realtime → customer account |
| Issue refund | Order shows refunded status | Supabase Realtime |
| Add loyalty points | Customer balance updates in account | Supabase Realtime |
| Enable maintenance mode | Storefront shows maintenance page | Middleware check on settings |
| Disable maintenance mode | Storefront restores immediately | Middleware check on settings |
| KUCAS certificate expires | Product auto-unpublished | Cron job daily check |

### Customer → Admin

| Customer action | Admin effect | Where visible |
|---|---|---|
| Places order | New order in list, dashboard count +1 | `/admin/orders` + dashboard widget |
| Pays (payment webhook received) | Order status → confirmed | `/admin/orders/[id]` |
| Checkout payment fails | Order status → payment_failed | `/admin/orders/[id]` |
| Registers account | New customer in list | `/admin/customers` |
| Submits review | Appears in moderation queue | `/admin/reviews` |
| Submits return request | New item in returns queue | `/admin/returns` |
| Subscribes to newsletter | New row in subscriber list | `/admin/settings` → Newsletter |
| Uses coupon code | Coupon usage count increments | `/admin/coupons` |
| Saves item to wishlist | Aggregated wishlist popularity in analytics | `/admin/analytics` |
| Abandons cart | Cart abandonment metric | `/admin/analytics` |
| Product stock reaches low threshold | Alert email sent to admin | Email notification |
| Stock reaches 0 | Out-of-stock alert + product auto-behaviour | `/admin/inventory` + alert |
| Customer requests account deletion | Deletion request in PDPL queue | `/admin/settings` → PDPL |
| Reports a review | Flagged review in moderation queue | `/admin/reviews` |

---

## 11. Address Management — Kuwait Format

Kuwait has no postcode system. Addresses use a structured format: Governorate → Area → Block → Street → Building → Floor/Apartment.

### Kuwait address fields

| Field | Required | Input type | Notes |
|---|---|---|---|
| Governorate | **Mandatory** | Dropdown | 6 options: Capital (العاصمة), Hawalli (حولي), Farwaniya (الفروانية), Ahmadi (الأحمدي), Jahra (الجهراء), Mubarak Al-Kabeer (مبارك الكبير) |
| Area / city | **Mandatory** | Dependent dropdown | Populated based on selected governorate from `areas` table |
| Block number | **Mandatory** | Text, numeric | E.g. `12` |
| Street name/number | **Mandatory** | Text | E.g. `Ahmed Al-Jaber Street` |
| Building / house number | **Mandatory** | Text | E.g. `Building 5` or `Villa 12` |
| Floor | Optional | Text | |
| Apartment number | Optional | Text | |
| Landmark | Optional | Text | **Very important in Kuwait** — delivery drivers rely on landmarks. E.g. *Near Sultan Center* / *بالقرب من سلطان سنتر* |
| Recipient name | **Mandatory** | Text | Pre-filled with account name, editable |
| Recipient phone | **Mandatory** | Text | Kuwait format +965 XXXX XXXX — validated |
| Address type | **Mandatory** | Radio | Home / Work / Other |
| Set as default | Optional | Toggle | Only one default address allowed |

### Address book page features

- Add new address button (prominent, top of list)
- Address cards: recipient name, abbreviated address, phone, type badge, default badge
- Per card: Edit | Delete | Set as default
- Maximum 10 addresses per account
- Add/edit form: full-screen modal on mobile, side drawer on desktop

### Address at checkout

- List of saved addresses with radio selection
- Selected address highlighted with `--nss-primary` border
- "Add new address" option (opens same form in checkout context)
- "Edit" link on each address (edits inline, stays on checkout flow)
- Guest checkout: address form shown directly (no selection step)

---

## 12. Checkout Flow

Multi-step. No step can be skipped. Each step validates before advancing.

**Guest cart:** Stored in a signed encrypted cookie (set by Server Action). When a guest logs in or creates an account, the cart contents are automatically migrated to their Supabase profile. No Redis or external session store needed.

```
Step 1: Address
  → Select saved address OR enter new address
  → Guest checkout: enter address directly
  → Validate all required Kuwait address fields

Step 2: Shipping method
  → Options shown based on delivery address governorate
  → Standard / Express / Same-day (if available in that zone)
  → Rates from settings
  → Estimated delivery date shown
  → Free delivery progress: "Add X more KD for free delivery"

Step 3: Payment
  → KNET (MyFatoorah redirect to bank page)
  → Visa / Mastercard (MyFatoorah hosted form)
  → Apple Pay (MyFatoorah)
  → Cash on Delivery (if enabled in settings)
  → Gift wrapping option: toggle + message text field

Step 4: Review & place order
  → Full order summary: items, address, shipping method, totals
  → Apply coupon code (if not already applied in cart)
  → "Place order" button
  → Idempotency key generated before submit to prevent duplicate orders

Order placed:
  → Server Action creates order record (service role)
  → Stock soft-reservation converted to confirmed deduction
  → For COD: order confirmed immediately
  → For card/KNET: order status = pending until webhook received
  → Redirect to /order/[id]/success
  → Confirmation email sent via Resend (EN or AR based on locale)
```

---

## 13. Payment Gateways

### Decision summary

| Gateway | Decision | Reason |
|---|---|---|
| **MyFatoorah** | ✅ **Primary — mandatory** | Kuwait-founded, all GCC licensed, only gateway with native KNET. KNET = ~80% of Kuwait online transactions. |
| **Tap Payments** | ✅ Secondary / backup | GCC-native, international Visa/MC for expats, Apple Pay. Backup when MyFatoorah is down. |
| **Cash on Delivery** | ✅ Optional | Widely used in Kuwait, especially new customers and outer governorates. |
| **Razorpay** | ❌ Cannot use | India-only. No Kuwait support. No workaround. |
| **Stripe** | ❌ Cannot use | Kuwait not a supported merchant country. Workarounds create US tax obligations. |

### MyFatoorah details

| Detail | Value |
|---|---|
| Headquarters | Kuwait City |
| GCC licence | All 6 countries |
| Supported methods | KNET, Visa, Mastercard, Apple Pay, Google Pay, STC Pay |
| Currency | KWD (3dp) |
| Settlement | Next business day → Kuwaiti bank account |
| Onboarding time | **7–14 business days — apply Day 1** |
| Transaction fee | ~2% KNET / ~2.5–3.5% cards |

### Webhook flow

```
Customer pays
  ↓
MyFatoorah / Tap POSTs webhook to /api/webhooks/myfatoorah
  ↓
Verify webhook signature (HMAC — reject if invalid)
  ↓
Check idempotency: has this transaction ID been processed? → skip if yes
  ↓
Update order payment_status → confirmed
  ↓
Update order_status → confirmed
  ↓
Release stock reservation → deduct from product_variants.stock_quantity
  ↓
Send confirmation email via Resend
  ↓
Trigger revalidateTag to update admin dashboard count
  ↓
Log to audit_log
```

---

## 14. Settings Control Panel — Full Spec

All settings live in the `settings` table as key-value pairs. Every change is logged in `audit_log`.

### 14.1 Store information

| Setting | Type | Notes |
|---|---|---|
| `store_name_en` | Text | Used in emails, page titles |
| `store_name_ar` | Text | Used in Arabic locale |
| `store_tagline_en` | Text | Footer tagline |
| `store_tagline_ar` | Text | |
| `contact_email` | Email | |
| `contact_phone` | Text | |
| `whatsapp_number` | Text | `+965XXXXXXXX` format |
| `physical_address_en` | Text | Footer + contact page |
| `physical_address_ar` | Text | |
| `working_hours_en` | Text | E.g. Sun–Thu 9am–6pm |
| `working_hours_ar` | Text | |
| `cr_number` | Text | Commercial Registration number — on all invoices |
| `logo_url` | URL | Full colour logo |
| `logo_white_url` | URL | White version for dark backgrounds |
| `favicon_url` | URL | |

### 14.2 Announcement bar settings

| Setting | Type | Notes |
|---|---|---|
| `announcement_bar_enabled` | Boolean | **Master toggle — instant sitewide effect** |
| `announcement_bar_bg_color` | Hex | Background colour |
| `announcement_bar_text_color` | Hex | Text colour |
| `announcement_bar_rotation_speed` | Integer | Seconds per message |
| `announcement_bar_dismissible` | Boolean | Allow user to close |
| `announcement_messages` | JSON array | Up to 3: `{text_en, text_ar, link, enabled, schedule_start, schedule_end}` |

### 14.3 Trust bar settings

| Setting | Type | Notes |
|---|---|---|
| `trust_bar_enabled` | Boolean | **Master toggle** |
| `free_delivery_threshold_kwd` | Decimal 3dp | **Controls trust bar text AND cart progress bar** |
| `return_policy_days` | Integer | **Controls trust bar text AND returns policy page** |
| `trust_items` | JSON array | Up to 6: `{icon, text_en, text_ar, link, enabled}` |

### 14.4 Shipping & delivery

| Setting | Type | Notes |
|---|---|---|
| `zones` | JSON array | Per zone: `{governorate_id, enabled, standard_rate_kwd, express_rate_kwd, sameday_rate_kwd, standard_days, express_days, sameday_cutoff_time}` |
| `cod_enabled` | Boolean | Cash on delivery global toggle |
| `cod_max_order_kwd` | Decimal 3dp | Maximum order value for COD |
| `cod_fee_kwd` | Decimal 3dp | COD handling fee (0 = no fee) |

### 14.5 Payment methods

| Setting | Type |
|---|---|
| `payment_knet_enabled` | Boolean |
| `payment_visa_mc_enabled` | Boolean |
| `payment_apple_pay_enabled` | Boolean |
| `payment_mode` | `live` / `test` |
| `myfatoorah_api_key_live` | Secret (encrypted) |
| `myfatoorah_api_key_test` | Secret (encrypted) |
| `tap_secret_key_live` | Secret (encrypted) |
| `tap_secret_key_test` | Secret (encrypted) |

### 14.6 Email templates

7 templates, each with: `subject_en`, `subject_ar`, `body_en`, `body_ar`

| Template key | Trigger |
|---|---|
| `email_order_confirmed` | Order payment confirmed |
| `email_order_shipped` | Admin marks order as shipped |
| `email_order_delivered` | Admin marks order as delivered |
| `email_registration_welcome` | New customer registers |
| `email_password_reset` | Password reset requested |
| `email_newsletter_welcome` | Newsletter subscription |
| `email_return_approved` | Return request approved |

Available variables: `{{customer_name}}` `{{order_number}}` `{{tracking_number}}` `{{tracking_link}}` `{{courier_name}}` `{{items_list}}` `{{total_kwd}}` `{{discount_code}}`

### 14.7 WhatsApp integration

| Setting | Type | Notes |
|---|---|---|
| `whatsapp_button_enabled` | Boolean | Floating button sitewide |
| `whatsapp_button_text_en` | Text | Button tooltip text |
| `whatsapp_button_text_ar` | Text | |
| `whatsapp_show_mobile_only` | Boolean | Hide on desktop if preferred |
| `whatsapp_marketing_optin_text_en` | Text | Newsletter signup checkbox label |
| `whatsapp_marketing_optin_text_ar` | Text | |

### 14.8 Loyalty programme

| Setting | Type | Notes |
|---|---|---|
| `loyalty_enabled` | Boolean | Master toggle |
| `loyalty_points_per_100_fils` | Integer | E.g. `1` = 1 point per 0.100 KD spent |
| `loyalty_kwd_per_redemption_point` | Decimal | E.g. `0.010` = 10 fils per point redeemed |
| `loyalty_min_points_to_redeem` | Integer | Minimum balance before redemption allowed |
| `loyalty_points_expiry_months` | Integer | `0` = never expire |
| `loyalty_birthday_reward_enabled` | Boolean | |
| `loyalty_birthday_reward_kwd` | Decimal 3dp | Value of birthday voucher |

### 14.9 PWA install prompt

| Setting | Type | Notes |
|---|---|---|
| `pwa_install_prompt_enabled` | Boolean | Show install to home screen prompt |
| `pwa_install_prompt_visits_before_show` | Integer | Show after N visits (default 2) |

### 14.10 Danger zone

| Action | Effect |
|---|---|
| Clear all cache | Force revalidate all ISR pages immediately |
| Enable maintenance mode | Storefront shows maintenance page. Admin still accessible. |
| Maintenance mode message EN | Custom message shown to visitors |
| Maintenance mode message AR | Arabic custom message |
| Export all customer data | PDPL compliance — CSV download of all personal data |

---

## 15. RTL & Bilingual Implementation

### Locale routing

| Locale | URL prefix | Direction |
|---|---|---|
| English | `/en/...` | LTR |
| Arabic | `/ar/...` | RTL |

**Middleware** detects `Accept-Language` header → redirects `/` to `/ar` or `/en`.
**Cookie** `NEXT_LOCALE` overrides the header (user's manual toggle choice).

### Root layout

```tsx
// app/[locale]/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### CSS — RTL-safe rules (mandatory)

```css
/* ❌ NEVER use these */
margin-left:    /* breaks RTL */
margin-right:   /* breaks RTL */
padding-left:   /* breaks RTL */
padding-right:  /* breaks RTL */
border-left:    /* breaks RTL */
float: left     /* breaks RTL */
text-align: left /* breaks RTL */

/* ✅ ALWAYS use these */
margin-inline-start:   /* logical — flips automatically */
margin-inline-end:     /* logical — flips automatically */
padding-inline-start:  /* logical */
padding-inline-end:    /* logical */
border-inline-start:   /* logical */
text-align: start      /* logical */
```

### Tailwind RTL utilities

```
ms-4         → margin-inline-start: 1rem
pe-2         → padding-inline-end: 0.5rem
text-start   → text-align: start
border-s-2   → border-inline-start-width: 2px
start-0      → inset-inline-start: 0
rtl:flex-row-reverse
rtl:space-x-reverse
```

### Elements that must ALWAYS stay LTR (even on Arabic pages)

- Countdown timer digits
- Prices and amounts (numbers only — currency symbol flips)
- Phone numbers
- Order numbers, invoice numbers
- Tracking numbers
- Credit card input fields

```tsx
// Correct pattern for price in Arabic
<span dir="ltr" className="font-mono">5.500</span>
<span> {t('currency.kwd')}</span>
// Arabic renders: 5.500 د.ك — number reads LTR, currency symbol reads RTL
```

### Arabic currency format

```ts
// Always use Intl
new Intl.NumberFormat('ar-KW', {
  style: 'currency',
  currency: 'KWD',
  minimumFractionDigits: 3
}).format(5.5) // → "5.500 د.ك"

// English
new Intl.NumberFormat('en-KW', {
  style: 'currency',
  currency: 'KWD',
  minimumFractionDigits: 3
}).format(5.5) // → "KD 5.500"
```

### Translation file structure

```
packages/config/i18n/
├── en.json
└── ar.json
```

```json
// en.json structure
{
  "nav": { "home": "Home", "cart": "Cart", "search": "Search", ... },
  "home": {
    "hero": { "cta_primary": "Shop now", "cta_secondary": "View all sale" },
    "flash_sale": { "title": "Flash Sale", "ends_in": "Sale ends in" },
    ...
  },
  "product": {
    "add_to_cart": "Add to cart",
    "out_of_stock": "Out of stock",
    "only_x_left": "Only {{count}} left",
    "age_range": "Ages {{min}}–{{max}}",
    ...
  },
  "checkout": { ... },
  "account": {
    "addresses": {
      "add": "Add address",
      "governorate": "Governorate",
      "area": "Area",
      "block": "Block",
      "landmark": "Landmark",
      "landmark_hint": "e.g. Near Sultan Center",
      ...
    }
  },
  "legal": { ... }
}
```

---

## 16. Mobile-First & PWA

### Breakpoints

```
xs:  375px  ← Design here first. Every component starts here.
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-specific UI components

| Component | Description |
|---|---|
| Bottom tab bar | Sticky at bottom: Home \| Categories \| Search \| Wishlist \| Account |
| Slide-in cart drawer | Full height, from right (from left in RTL) |
| Mega menu drawer | Full screen, from left (from right in RTL) |
| Sticky add-to-cart | Fixed to bottom of PDP, above tab bar |
| Pull-to-refresh | PLP and category pages |
| Image gallery | Swipe, pinch-to-zoom, bullet dots |
| Quantity stepper | 44px min tap target per button |
| WhatsApp FAB | Bottom-right floating button, above tab bar |

### PWA manifest (`/public/manifest.json`)

```json
{
  "name": "NewStarSports",
  "short_name": "NewStarSports",
  "description": "Kuwait's home for toys — نيو ستار سبورتس",
  "start_url": "/en",
  "display": "standalone",
  "background_color": "#F8F7F4",
  "theme_color": "#1B3A6B",
  "orientation": "portrait",
  "lang": "en",
  "icons": [
    { "src": "/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Service worker caching strategy

| Route pattern | Strategy | Duration |
|---|---|---|
| Home page | Stale-while-revalidate | 1 hour |
| PLP | Stale-while-revalidate | 30 min |
| PDP | Cache-first | 30 min |
| Static pages | Cache-first | 7 days |
| Product images | Cache-first | 30 days |
| Fonts | Cache-first | 1 year |
| API routes | Network-first | — |
| Checkout | Network-only | — |
| Admin | Network-only | — |

### Offline behaviour

- Cached pages: readable offline
- Cart: synced to IndexedDB — survives offline
- Header: "You're offline" banner shown
- Checkout: blocked with "Connect to place your order" message
- `/offline` page: branded with logo + message

---

## 17. Security Architecture

### Layer 1 — Edge / CDN

- [ ] DDoS protection (Vercel / Cloudflare)
- [ ] TLS 1.3 minimum enforced
- [ ] HSTS header: `max-age=31536000; includeSubDomains`
- [ ] Geo-restriction option: Kuwait + GCC only (configurable)

### Layer 2 — Next.js middleware (every request)

- [ ] JWT validation via Supabase session
- [ ] RBAC route protection: all `/admin/*` routes check staff role
- [ ] Rate limiting via Vercel Pro edge rate limiting (middleware.ts): 100 req/min per IP for API routes, 10 req/min for auth routes — no Redis needed
- [ ] Security headers set:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Layer 3 — Server Actions & Route Handlers

- [ ] Every input validated with Zod before any processing
- [ ] Webhook endpoints verify HMAC signature before processing
- [ ] Idempotency keys on order creation (gateway transaction ID as unique key)
- [ ] Service role key used only in Server Actions — never in client bundle
- [ ] CSRF: Supabase handles via same-site cookies

### Layer 4 — Supabase Row-Level Security

- [ ] RLS enabled on **every table** — no exceptions
- [ ] `profiles`: users read/write own row only
- [ ] `orders`: users read own orders; inserts via service role only
- [ ] `addresses`: users CRUD own addresses only
- [ ] `reviews`: users edit/delete own reviews only
- [ ] `wishlists`: users access own wishlists only
- [ ] `audit_log`: INSERT only — UPDATE and DELETE revoked
- [ ] `loyalty_points_ledger`: INSERT only — no backdating

### Layer 5 — Secrets & storage

- [ ] No API keys in client bundle (verified by bundle analysis in CI)
- [ ] All secrets in Vercel environment variables — never committed to git
- [ ] Supabase storage: product images public-read, user uploads private with signed URLs
- [ ] Payment API keys stored encrypted in Vercel secrets vault
- [ ] `.env.local` in `.gitignore`

### Layer 6 — Audit & monitoring

- [ ] `audit_log` table: every admin action logged (user_id, action, table, record_id, old_values, new_values, ip_address, timestamp)
- [ ] Sentry: error tracking on both apps with source maps
- [ ] PostHog: anomaly detection on checkout funnel
- [ ] Uptime monitoring: alert if either app returns 5xx for > 2 minutes
- [ ] Snyk: dependency vulnerability scanning in CI

---

## 18. Performance Strategy

### Core Web Vitals targets

| Metric | Target | Measured on |
|---|---|---|
| LCP (Largest Contentful Paint) | < 1.5s | Mobile 3G |
| CLS (Cumulative Layout Shift) | < 0.05 | All pages |
| INP (Interaction to Next Paint) | < 100ms | All interactive elements |
| TTFB (Time to First Byte) | < 200ms | Cached pages |
| FCP (First Contentful Paint) | < 1.0s | Home page |

### Image optimisation rules

- All images: `next/image` with `WebP`/`AVIF` auto-format
- Hero images: separate desktop (1920px) + mobile (800px) uploads — different crops
- Product card thumbnails: 400×400px
- Category tiles: 600×400px
- LCP image (hero slide 1): `priority={true}` — no lazy load
- All below-fold images: default lazy load
- All images: explicit `width` + `height` props — prevents CLS
- Blur placeholder: base64 LQIP generated at upload time via Supabase Edge Function

### Bundle rules

- [ ] Dynamic import for heavy components: rich text editor, image lightbox, charts, map
- [ ] Import only used shadcn components — no barrel exports
- [ ] `next/font` for all fonts — zero layout shift, self-hosted
- [ ] Admin bundle never bundled into storefront (separate Next.js apps)
- [ ] Bundle size CI gate: PR fails if JS bundle increases > 20%

### Database performance rules

- [ ] Index on: `products.slug`, `products.category_id`, `products.brand_id`, `products.created_at`, `products.published`, `orders.user_id`, `orders.created_at`, `order_items.product_id`, `addresses.user_id`
- [ ] Partial index: `CREATE INDEX ON products (created_at) WHERE published = true`
- [ ] `pg_trgm` extension for full-text search on product names
- [ ] Cursor-based pagination everywhere — no `OFFSET` (slow on large tables)
- [ ] Supabase connection pooling via pgBouncer (transaction mode)
- [ ] `best_sellers_weekly` and `best_sellers_monthly` are materialized views refreshed by cron — never real-time queries

---

## 19. Legal Compliance — Kuwait

> ⚠️ This is not legal advice. The client must engage a Kuwait-licensed commercial lawyer for formal review before launch.

### Applicable laws

| Law | What it covers |
|---|---|
| Consumer Protection Law No. 39/2014 | Product accuracy, price display, return rights, refund obligations |
| Electronic Transactions Law No. 20/2014 | Digital contracts and electronic invoices are legally binding |
| Personal Data Protection Law No. 16/2024 | Consent, data access, erasure, breach notification |
| Kuwait Commercial Law | Record retention: minimum 10 years for all commercial records |
| KUCAS Toy Safety Scheme | Certificate of Conformity mandatory for all toys imported to Kuwait |
| GCC VAT Framework | Kuwait currently 0% VAT. System built VAT-ready with settings toggle. |

### PDPL compliance implementation

| Requirement | Implementation |
|---|---|
| Explicit consent | Consent checkbox at registration (not pre-ticked). Separate checkbox for marketing. Timestamp stored in `consent_log`. |
| Privacy policy | Footer link every page. Arabic + English. States: data collected, purpose, retention, third parties, rights. |
| Right to access | `/account` → "Download my data" button. Generates JSON/CSV export. |
| Right to erasure | `/account` → "Delete my account". Admin receives task. Completed within 30 days. |
| Data minimisation | Only collect necessary data. Full card numbers never stored (gateway tokenisation). |
| Breach notification | Sentry monitors for anomalous access. Notification procedure documented. |
| Data residency | Supabase project on EU or Middle East region — not US. |
| Third-party DPAs | Required with: Supabase, Vercel, Resend, Algolia, PostHog, Sentry |

### Mandatory legal pages (all in Arabic + English)

| Page | Key content |
|---|---|
| Privacy policy | PDPL-compliant: data types, purposes, retention, rights, contact |
| Terms of service | Contract of sale, payment, delivery, IP ownership, governing law: Kuwait |
| Returns policy | Window, conditions, process, refund timeline, exclusions |
| Delivery information | Zones, timings, failed delivery, holiday policy |
| Cookie policy | Types used, purpose, how to disable |
| Toy safety | Age guidance, KUCAS statement, care + disposal instructions |

---

## 20. Kuwait-Specific Product Fields (HS Code & KUCAS)

### KUCAS (Kuwait Conformity Assurance Scheme)

- Administered by the Public Authority for Industry
- All toys imported to Kuwait **must** hold a Certificate of Conformity (CoC)
- Cannot legally be sold without it
- Platform enforcement:
  - CoC number field blocks publish if empty
  - System warns admin 30 days before expiry
  - System auto-unpublishes when CoC expires
  - Storefront shows "Kuwait safety certified" badge if valid CoC exists

### HS codes — Kuwait vs India

| System | Used in | Purpose |
|---|---|---|
| HSN code | India only | India GST classification |
| HS code (6-digit) | All countries | International customs — same worldwide |
| GCC tariff code (12-digit) | Kuwait + GCC | Kuwait customs as of January 2025 |

**Important:** Kuwait moved from 8-digit to 12-digit HS codes on **January 1, 2025** under the new GCC Integrated Customs Tariff (tariff lines: 7,800 → 13,400+).

**Kuwait import duty on toys: 5% of CIF value. GCC-origin goods: duty-exempt.**

### Chapter 95 — Toys (HS codes)

| HS heading | Products |
|---|---|
| `9503` | Dolls, toy vehicles, LEGO-type construction sets, puzzles, toy musical instruments, tricycles, scooters |
| `9504` | Video game consoles, playing cards, board games, chess sets |
| `9505` | Festive / seasonal articles, party toys |
| `9506` | Balls, rackets, skates, trampolines, outdoor sports equipment |
| `9508` | Swings, roundabouts, amusement park rides |

### 12-digit code structure

```
9503 00 00 00 00
│    │  │  └──── digits 9-12: Kuwait national extension
│    │  └─────── digits 7-8: GCC subheading
│    └────────── digits 5-6: HS subheading (international)
└─────────────── digits 1-4: HS heading (international)
```

---

## 21. Invoice & Order Legal Requirements

### Invoice — mandatory elements

Every order generates a legal electronic invoice. Required fields:

| Element | Rule |
|---|---|
| **Invoice title** | "Invoice" + "فاتورة" — both languages |
| **Invoice number** | Format: `INV-2025-00001`. Sequential, unique, never reused. Generated by DB sequence. |
| **Invoice date** | Date order was placed. Immutable after creation. |
| **Seller name** | NewStarSports — نيو ستار سبورتس |
| **Seller CR number** | Commercial Registration number — mandatory by Kuwait law |
| **Seller address** | Full Kuwait address |
| **Seller phone + email** | |
| **Buyer name** | Snapshot at time of order — never updates |
| **Buyer address** | Full address snapshot — never updates |
| **Buyer phone** | Snapshot |
| **Order reference** | Cross-reference: `NSS-2025-00001` |
| **Line items** | Per product: name EN+AR, SKU, HS code, qty, unit price KWD, line total KWD |
| **Subtotal** | Before discounts |
| **Discount line** | Coupon code + amount (if used) |
| **Shipping fee** | |
| **VAT line** | "VAT: Not applicable (Kuwait — 0%)" — always present, future-ready |
| **Total** | Final KWD amount to 3 decimal places |
| **Payment method** | KNET / Visa / Mastercard / Apple Pay / COD |
| **Transaction ID** | Gateway reference — used for dispute resolution |
| **Payment status** | Paid / Pending collection (COD) |

### Order number formats

| Type | Format | Example | Sequence |
|---|---|---|---|
| Order | `NSS-YYYY-NNNNN` | `NSS-2025-00001` | PostgreSQL sequence |
| Invoice | `INV-YYYY-NNNNN` | `INV-2025-00001` | Separate PostgreSQL sequence |
| Return | `RTN-YYYY-NNNNN` | `RTN-2025-00001` | Separate PostgreSQL sequence |

**All sequences are DB-generated, never application-generated.** This prevents race conditions and gaps.

### Critical: price snapshot rule

> Product names and prices in `order_items` are **copied (snapshotted)** at the time of purchase. They are **never** pulled from the current `products` table. Prices change. The order must always reflect what the customer was actually charged.

### Record retention

All orders, invoices, payments, and customer records must be retained for **minimum 10 years** under Kuwait Commercial Law.

---

## 22. Email & Notification System

### Transactional emails (Resend)

| Trigger | Template | Sent to |
|---|---|---|
| Order confirmed (payment received) | `email_order_confirmed` | Customer |
| Order shipped (admin action) | `email_order_shipped` | Customer |
| Order delivered (admin action) | `email_order_delivered` | Customer |
| Account registered | `email_registration_welcome` | Customer |
| Password reset requested | `email_password_reset` | Customer |
| Newsletter subscribe | `email_newsletter_welcome` | Customer |
| Return approved | `email_return_approved` | Customer |
| New order placed | Admin alert | Admin email (settings) |
| Low stock alert | Admin alert | Admin email (settings) |
| New return request | Admin alert | Admin email (settings) |

All emails: sent in customer's locale (AR or EN based on `profiles.locale_preference`).

### Push notifications (PWA)

| Trigger | Message |
|---|---|
| Order confirmed | "Your order NSS-2025-XXXXX is confirmed!" |
| Order shipped | "Your order is on its way! Tracking: [number]" |
| Order delivered | "Your order has been delivered. Enjoy!" |
| Flash sale started | "Flash sale is live — up to X% off!" |
| Back in stock | "[Product name] is back in stock" |

Push notifications require opt-in permission — requested after first successful order.

---

## 23. Phase-by-Phase Build Plan with Checklists

### Phase 0 — Foundation (Weeks 1–2)

> **Goal:** Working monorepo, database, auth, CI/CD. No feature code yet.

**Setup**
- [ ] GitHub repository created + team access configured
- [ ] Turborepo + pnpm workspace initialised
- [ ] All `packages/` created: `ui`, `db`, `auth`, `validators`, `config`
- [ ] tsconfig, eslint, prettier shared configs set up

**Infrastructure**
- [ ] Supabase project created (EU/Middle East region — confirm for PDPL)
- [ ] All database tables created with correct column types
- [ ] All RLS policies written and tested
- [ ] Supabase types generated → `packages/db/types.ts`
- [ ] t3-env set up for runtime environment validation
- [ ] All env variables documented in team password vault

**Auth**
- [ ] Supabase Auth configured: email + Google OAuth
- [ ] `packages/auth` middleware factory written
- [ ] Locale detection middleware written
- [ ] Admin RBAC middleware written
- [ ] Session helpers written

**CI/CD**
- [ ] Vercel project connected to GitHub
- [ ] Auto-deploy on push to `develop` branch → staging
- [ ] Auto-deploy on push to `main` → production
- [ ] GitHub Actions: lint + typecheck + build on every PR
- [ ] Lighthouse CI gate: PR fails if LCP > 3s on home page

**Monitoring**
- [ ] Sentry connected to storefront app
- [ ] Sentry connected to admin app
- [ ] Source maps uploaded on deploy
- [ ] Uptime monitoring configured

**Deliverable:** Both apps deployed to Vercel preview URLs. Auth works. No feature pages yet.

---

### Phase 1 — Customer Storefront Core (Weeks 3–7)

> **Goal:** Fully browseable store. All home sections. Account + address management. Cart. No checkout yet.

**Subphase 1A — Products & navigation (Week 3–4)**
- [ ] Product card component (shared, all variants)
- [ ] Home page: Section 01 — Announcement bar + mega nav
- [ ] Home page: Section 02 — Hero slider
- [ ] Home page: Section 03 — Trust bar
- [ ] Home page: Section 04 — Flash sale
- [ ] Home page: Section 05 — Categories grid
- [ ] Product listing page (PLP) — grid, filters (category, brand, age, price range), sort
- [ ] Product detail page (PDP) — gallery, variants selector, add-to-cart, reviews display
- [ ] Category pages
- [ ] Brand pages
- [ ] ISR + revalidation tags configured

**Subphase 1B — Home completion (Week 4–5)**
- [ ] Home page: Section 06 — New arrivals carousel
- [ ] Home page: Section 07 — Brands strip
- [ ] Home page: Section 08 — Editorial banner
- [ ] Home page: Section 09 — Age group section
- [ ] Home page: Section 10 — Double promo banner
- [ ] Home page: Section 11 — Best sellers
- [ ] Home page: Section 12 — Reviews
- [ ] Home page: Section 13 — Blog / gift guides
- [ ] Home page: Section 14 — Loyalty teaser
- [ ] Home page: Section 15 — Newsletter signup
- [ ] Home page: Section 16 — Footer
- [ ] All sections connected to real Supabase data
- [ ] RTL layout tested for every home section

**Subphase 1C — Auth + account (Week 5–6)**
- [ ] Register page — email + password
- [ ] Register — Google OAuth
- [ ] Email verification flow
- [ ] Login page — email + password
- [ ] Login — Google OAuth
- [ ] Magic link / OTP login
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Account profile page (name, phone, email, avatar, locale preference)
- [ ] Change password
- [ ] Delete account (PDPL — triggers deletion request)

**Subphase 1D — Address book (Week 6)**
- [ ] Address book page (`/account/addresses`)
- [ ] Address card list with edit/delete/set-default actions
- [ ] Add address form (full Kuwait format — all fields)
- [ ] Edit address form
- [ ] Governorate dropdown (6 options, EN + AR)
- [ ] Area dropdown dependent on governorate
- [ ] Landmark field with hint text EN + AR
- [ ] Phone validation: +965 format
- [ ] Maximum 10 addresses enforced

**Subphase 1E — Search + cart (Week 7)**
- [ ] Algolia integration — index configured with Arabic stemming
- [ ] Instant search component (debounced 300ms)
- [ ] Search results page with faceted filters
- [ ] Cart: persistent for logged-in users (Supabase)
- [ ] Cart: guest cart (signed encrypted cookie, migrates to Supabase on login)
- [ ] Cart slide-over drawer
- [ ] Cart page (full view)
- [ ] Quantity update in cart
- [ ] Remove item from cart
- [ ] Free delivery progress bar
- [ ] Coupon code input (validates against `coupons` table)

**Phase 1 sign-off checklist:**
- [ ] All 16 home sections rendering with real data
- [ ] PLP filters working
- [ ] PDP add-to-cart working
- [ ] All auth flows working (email + Google)
- [ ] Address book full CRUD working (Kuwait format)
- [ ] Cart persists across sessions
- [ ] All sections tested in Arabic RTL
- [ ] All sections tested on mobile (375px iPhone Safari)
- [ ] Lighthouse score > 85 on home page (mobile)

---

### Phase 2 — Checkout & Orders (Weeks 8–10)

> **Goal:** End-to-end purchase. Real payments working.

**Checkout flow**
- [ ] Multi-step checkout: Address → Shipping → Payment → Review
- [ ] Address selection from saved addresses
- [ ] New address entry within checkout (same Kuwait form)
- [ ] Shipping method selection (rates from settings)
- [ ] Estimated delivery date calculation
- [ ] Free delivery logic: apply when total > threshold

**Payments**
- [ ] MyFatoorah SDK integrated
- [ ] KNET payment flow (redirect to bank page)
- [ ] Visa / Mastercard via MyFatoorah hosted form
- [ ] Apple Pay via MyFatoorah
- [ ] Cash on Delivery option (when enabled in settings)
- [ ] Gift wrapping toggle + message field
- [ ] Coupon code application at checkout

**Order creation**
- [ ] Server Action creates order (service role — never client Supabase)
- [ ] Idempotency key: transaction ID as unique key prevents duplicate orders
- [ ] All order fields snapshotted (name, email, phone, address, product names, prices, SKU)
- [ ] Stock soft-reservation (15 min) created when checkout starts
- [ ] Reservation released if checkout abandoned after 15 min (pg_cron every 5 min)
- [ ] Order number generated by DB sequence: `NSS-YYYY-NNNNN`
- [ ] Invoice number generated by DB sequence: `INV-YYYY-NNNNN`

**Webhooks**
- [ ] `/api/webhooks/myfatoorah` — verify signature, process payment confirmation
- [ ] `/api/webhooks/tap` — verify signature, process payment confirmation
- [ ] Webhook retry logic (3 retries with exponential backoff)
- [ ] Idempotent processing (same webhook = same result, not duplicate)

**Post-order**
- [ ] Order success page (`/order/[id]/success`)
- [ ] Confetti animation on success
- [ ] Order summary card
- [ ] Loyalty points earned shown
- [ ] Order confirmation email (EN/AR based on locale) via Resend
- [ ] Admin order count updates via Supabase Realtime

**Phase 2 sign-off checklist:**
- [ ] Full checkout flow with real KNET test transaction
- [ ] Full checkout flow with Visa test card
- [ ] COD order placed and visible in admin
- [ ] Order confirmation email received (EN + AR)
- [ ] Order visible in admin orders list immediately
- [ ] Stock decremented after purchase
- [ ] Duplicate order prevention tested (submit twice rapidly)
- [ ] Checkout tested on mobile (375px)

---

### Phase 3 — Admin Core (Weeks 11–14)

> **Goal:** Admin team can manage products and process orders end-to-end.

**Admin auth + structure**
- [ ] Admin login page (separate from customer login)
- [ ] RBAC middleware on all `/admin/*` routes
- [ ] Admin layout: sidebar nav + top bar
- [ ] All 5 role types enforced on every page

**Dashboard**
- [ ] Revenue KPI cards: today / week / month / all-time
- [ ] Orders today: new / processing / shipped / delivered counts
- [ ] Low-stock alert list (products below threshold)
- [ ] Recent orders live feed (Supabase Realtime)
- [ ] New customer registrations count
- [ ] Sales trend chart (7-day / 30-day)
- [ ] Top products this week

**Product management — all 10 tabs**
- [ ] Product list: search, filter by status/category/brand, sort
- [ ] Product create — Tab 1: Basic info (all fields, EN + AR)
- [ ] Product create — Tab 2: Media (multi-image upload, drag reorder, alt text)
- [ ] Product create — Tab 3: Pricing (KWD, compare-at, cost, flash sale %)
- [ ] Product create — Tab 4: Inventory (SKU, stock, threshold, out-of-stock behaviour)
- [ ] Product create — Tab 5: Variants (types, names EN+AR, prices, stock per variant)
- [ ] Product create — Tab 6: Organisation (category tree, brand, tags, feature flags)
- [ ] Product create — Tab 7: Safety & Legal (all KUCAS + age + warning fields)
- [ ] Product create — Tab 8: Shipping (weight, dimensions, zone restrictions)
- [ ] Product create — Tab 9: SEO (title, description EN+AR, OG image)
- [ ] Product create — Tab 10: Customs / HS codes (6-digit + 12-digit GCC)
- [ ] Publish rule enforcement (checklist of missing fields blocks publish)
- [ ] Product edit (same tabs)
- [ ] Product duplicate
- [ ] Bulk actions: publish, unpublish, delete
- [ ] CSV product import + export

**Order management**
- [ ] Order list with filters: status, date range, payment method, customer
- [ ] Order detail view with full timeline
- [ ] Update order status (confirmed → processing → shipped → delivered → cancelled)
- [ ] Add tracking number + select courier name
- [ ] Status update triggers Supabase Realtime event to customer
- [ ] Print invoice PDF (all legal elements — Section 21)
- [ ] Print packing slip PDF (order items + address + instructions)
- [ ] Process full refund
- [ ] Process partial refund
- [ ] Add internal note (not visible to customer)
- [ ] Cancel order with reason
- [ ] Bulk: mark as shipped

**Category management**
- [ ] Category tree (nested, unlimited depth)
- [ ] Drag-and-drop reorder
- [ ] Category name EN + AR
- [ ] Category banner image upload
- [ ] Homepage pin toggle (appears in Section 05)
- [ ] Homepage display order (1–8)
- [ ] SEO meta per category

**Inventory**
- [ ] Stock levels table: all products/variants
- [ ] Set low-stock threshold per item
- [ ] Bulk stock update (CSV upload or inline edit)
- [ ] Stock movement log (who changed what, when, why)
- [ ] Low-stock email alert fires when threshold crossed

**Customer management**
- [ ] Customer list with search + filter
- [ ] Customer profile: orders, addresses, wishlist, points, consent log
- [ ] Customer lifetime value
- [ ] Suspend / unsuspend account
- [ ] Manual points adjustment (with mandatory reason)
- [ ] PDPL data export per customer

**Phase 3 sign-off checklist:**
- [ ] Product with all 10 tabs created, published, appears on storefront
- [ ] Product edit → price change → storefront updates within 5 minutes
- [ ] Product unpublished → disappears from storefront immediately
- [ ] New order visible in admin in real time
- [ ] Order shipped with tracking → customer sees update in account
- [ ] Invoice PDF generated with all legal fields
- [ ] KUCAS expiry warning tested
- [ ] All 5 RBAC roles tested

---

### Phase 4 — Marketing & Promotions (Weeks 15–17)

> **Goal:** Client can run promotions, update content, control home page — no developer needed.

**Banner management**
- [ ] Announcement bar: full settings (enable/disable, messages, schedule, colour)
- [ ] Hero slider: create/edit slides, upload desktop + mobile images, schedule, reorder
- [ ] Mid-page editorial banner: all 3 layout options
- [ ] Split promo pair: two independent banner slots

**Flash sale**
- [ ] Flash sale creator: set start/end, select products, set discount %
- [ ] Scheduled activation (auto-starts at scheduled time via pg_cron Edge Function)
- [ ] Flash sale appears on home page when active
- [ ] Flash sale countdown live on home page
- [ ] Flash sale ends → prices revert → section disappears (via pg_cron Edge Function + revalidate)

**Coupons**
- [ ] Create coupon: code, type (% or flat KWD), value
- [ ] Usage limit (total + per customer)
- [ ] Minimum order value rule
- [ ] Product or category restriction
- [ ] Expiry date
- [ ] Bulk coupon code generator
- [ ] Coupon usage report

**Review moderation**
- [ ] Pending reviews queue
- [ ] Approve / reject with reason
- [ ] Reply to review (store reply shown on PDP)
- [ ] Pin review to homepage (Section 12)
- [ ] Report/flag management

**Trust bar + settings**
- [ ] Settings panel: trust bar section (all fields, master toggle, per-item toggle)
- [ ] Free delivery threshold change → cart progress bar updates
- [ ] Return policy days change → trust bar text updates
- [ ] Announcement bar toggle tested (on → customer sees bar; off → bar hidden)

**Other settings**
- [ ] Blog post editor (create, publish, show on homepage toggle)
- [ ] Loyalty programme settings (enable/disable, points rate, redemption rate)
- [ ] Email template editor (all 7 templates, preview, test send)
- [ ] Newsletter subscriber export (CSV)

**Phase 4 sign-off checklist:**
- [ ] Announcement bar toggle off → bar disappears on storefront instantly
- [ ] Announcement bar text changed → new text visible on next page load
- [ ] Trust bar item disabled → item disappears on storefront
- [ ] Free delivery threshold changed → cart progress bar reflects new value
- [ ] Flash sale created + activated → countdown appears on home
- [ ] Flash sale ended → section disappears, prices revert
- [ ] Coupon code created → works at checkout
- [ ] Review approved → appears on product page
- [ ] Client given walkthrough: they can change all settings independently

---

### Phase 5 — PWA & Mobile Polish (Weeks 18–19)

> **Goal:** Installable, offline-capable, app-quality mobile experience.

- [ ] PWA manifest created (`manifest.json`) with all required icon sizes
- [ ] All icon sizes generated (72, 96, 128, 144, 192, 512, 512 maskable)
- [ ] Splash screen configured for iOS
- [ ] Service worker configured with correct caching strategies per route type
- [ ] Offline page (`/offline`) built and branded
- [ ] Offline cart implemented (IndexedDB via Zustand persist)
- [ ] "You're offline" header banner implemented
- [ ] Checkout blocked gracefully when offline
- [ ] Custom install prompt (not browser default) — shows after 2nd visit
- [ ] iOS install instructions (iOS doesn't support native install API — show modal with "Add to Home Screen" instructions)
- [ ] Android Chrome install prompt working
- [ ] Push notification permission request (after first order)
- [ ] Push notification: order confirmed
- [ ] Push notification: order shipped
- [ ] Push notification: order delivered
- [ ] Bottom tab bar on mobile (Home, Categories, Search, Wishlist, Account)
- [ ] Sticky add-to-cart on PDP mobile
- [ ] Pull-to-refresh on PLP + category pages
- [ ] WhatsApp floating action button above tab bar

**QA pass**
- [ ] Full app tested on iPhone SE (375px) Safari
- [ ] Full app tested on iPhone 14 Pro (393px) Safari
- [ ] Full app tested on Android Chrome (Samsung Galaxy)
- [ ] Install to home screen tested iOS
- [ ] Install to home screen tested Android
- [ ] Offline mode tested — browse pages, add to cart, reconnect and checkout
- [ ] Lighthouse score ≥ 90 on all categories (Performance, Accessibility, Best Practices, SEO)
- [ ] All Core Web Vitals targets met (LCP < 1.5s, CLS < 0.05, INP < 100ms)

---

### Phase 6 — Advanced Features (Weeks 20–23)

- [ ] Wishlist page + share wishlist via link
- [ ] Move wishlist item to cart
- [ ] Return request form (customer-side: reason, photos, type)
- [ ] Return management (admin-side: approve/reject/refund/restock)
- [ ] Loyalty points dashboard (customer: balance, history, earn/spend log)
- [ ] Back-in-stock notification (customer subscribes → email when stock returns)
- [ ] Product Q&A section on PDP
- [ ] Abandoned cart recovery email (24h cron job)
- [ ] Analytics dashboard in admin (revenue charts, top products, funnel)
- [ ] Audit log viewer in admin (filterable, exportable)
- [ ] PDPL tools: customer data export, deletion request workflow
- [ ] Sitemap generation — dynamic for all products/categories (AR + EN)
- [ ] Structured data / JSON-LD for products, breadcrumbs, organisation
- [ ] Open Graph image auto-generation for products
- [ ] Social share buttons on PDP (WhatsApp, Instagram, copy link)
- [ ] Recently viewed products (localStorage, shown on home + PDP)
- [ ] Browser notifications for admin (new order alert while on dashboard)

---

### Phase 7 — Hardening & Launch (Weeks 24–26)

See Section 26 — Pre-Launch QA Master Checklist for the full list.

**Key activities:**
- [ ] Full security penetration test checklist
- [ ] RLS policy audit: attempt to bypass each policy
- [ ] Load test: simulate 500 concurrent users
- [ ] PDPL compliance legal review (with Kuwaiti lawyer)
- [ ] Arabic content QA by native speaker
- [ ] Cross-browser: Safari iOS, Chrome Android, Chrome desktop, Firefox
- [ ] WCAG 2.1 AA accessibility audit
- [ ] All email templates tested EN + AR
- [ ] Payment gateway: test all methods in production mode
- [ ] Webhook scenarios: test success, failure, duplicate, retry
- [ ] Admin full walkthrough + client training (record session)
- [ ] Admin user accounts created for client team
- [ ] DNS cutover plan documented and tested
- [ ] SSL certificate active
- [ ] Monitoring alerts active
- [ ] Soft launch to 10 beta customers
- [ ] Resolve all issues from soft launch
- [ ] Full public launch

---

## 24. Project Management Framework

### Branching strategy

```
main          ← production — never commit directly
develop       ← integration — all features merge here
feature/NSS-XXX  ← one branch per Linear ticket
hotfix/NSS-XXX   ← emergency fixes directly to main
release/vX.X     ← release prep — QA here before merge to main
```

### Every ticket must have

```
Title:          [Verb]-first. E.g. "Build Kuwait address form"
Description:    What to build. What NOT to build. Known edge cases.
Acceptance:     Numbered list, each point independently testable
Admin ↔ Customer: Explicitly state the counterpart on the other app
Definition of Done:
  [ ] Built
  [ ] Code reviewed by 1+ developer
  [ ] Unit tested (if logic-heavy)
  [ ] Tested on staging
  [ ] Tested in Arabic RTL
  [ ] Tested on mobile 375px iPhone Safari
  [ ] Admin ↔ customer flow verified end-to-end
  [ ] No new Sentry errors from this feature
  [ ] LCP not degraded from this change
```

### Meetings

| Meeting | Frequency | Who | Duration |
|---|---|---|---|
| Sprint planning | Every 2 weeks | Full dev team | 2 hours |
| Daily standup | Daily | Dev team | 15 min |
| Design review | Weekly | Lead + Designer | 1 hour |
| Client update | Every 2 weeks | Lead + client | 1 hour |
| Phase sign-off | End of each phase | Full team + client | 2 hours |

### Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MyFatoorah approval delayed | High | High | Apply Day 1. Use Tap sandbox for payment testing meanwhile. |
| Arabic translations missing/late | Medium | High | Prepare all string keys upfront. Use placeholder text during dev. |
| Scope creep from client | High | Medium | Phase sign-off gate. Written change request for anything new. |
| Admin ↔ customer logic gap | High | High | Gap checklist on every ticket (Section 25). |
| RTL bugs found in Phase 7 | Medium | High | RTL testing from Phase 1 onwards — not just at launch. |
| KUCAS certificates not ready | Medium | High | Confirm with client before Phase 3. Products can't publish without CoC. |
| PDPL compliance not reviewed | Low | High | Flag to client in Week 1. Lawyer review is client's responsibility. |
| Performance regression from new feature | Medium | Medium | Lighthouse CI gate on every PR. |

---

## 25. Admin ↔ Customer Gap Prevention Checklist

> Run this checklist for **every feature ticket** before marking it as done. This is the single most common source of incomplete features.

```
For every feature, answer all questions:

[ ] Does the customer see data that the admin creates?
    → If yes: test admin creates it → customer sees it → confirm timing

[ ] Does the admin see data the customer creates?
    → If yes: test customer creates it → admin sees it → confirm real-time or near-real-time

[ ] Does the admin change affect the customer immediately?
    → If yes: which mechanism? revalidateTag / ISR / Supabase Realtime / settings cache?
    → Test: make admin change → measure time until customer sees it

[ ] Is there a settings toggle that controls this feature?
    → If yes: test enable → customer sees it; test disable → customer doesn't see it

[ ] Does this feature have an Arabic version?
    → Test in Arabic locale: all text renders correctly, layout is RTL

[ ] Does this feature work on mobile (375px)?
    → Test on real iPhone Safari, not just browser DevTools

[ ] Is the feature covered by an audit log entry?
    → Admin action: logged in audit_log with user_id + action + timestamp

[ ] Does this feature have an email notification?
    → Customer action: does admin receive an alert?
    → Admin action: does customer receive an email?
    → Test both EN and AR email versions
```

### Common gaps to watch

| Feature | Admin side | Customer side | Common miss |
|---|---|---|---|
| Flash sale | Create + activate | Section appears + countdown + prices | Prices don't revert when sale ends |
| Announcement bar | Toggle off | Bar disappears | Toggle takes too long to propagate |
| Trust bar threshold | Edit KWD amount | Cart progress bar updates | Cart progress bar doesn't read from settings |
| Product publish | Click publish | Product appears in listings + search | Algolia index not updated |
| Stock = 0 | Inventory goes to 0 | Add-to-cart disabled | Storefront still shows as available until ISR expires |
| Order shipped | Add tracking | Customer sees tracking link in account | Email not sent / Realtime event not fired |
| Review approved | Approve in moderation | Review appears on PDP | revalidateTag not called for that product |
| Coupon created | Create in admin | Works at checkout | Discount calculation not applying correctly |
| Banner scheduled | Set future start date | Appears on schedule | Cron doesn't check or revalidate at start time |
| KUCAS expires | Certificate expires | Product auto-unpublishes | Cron job not set up or not running |

---

## 26. Pre-Launch QA Master Checklist

### Security

- [ ] All RLS policies tested — attempt to view other users' orders, addresses, wishlist (must fail)
- [ ] Admin routes tested with customer JWT — must redirect to login
- [ ] Customer routes tested with expired JWT — must redirect to login
- [ ] Service role key not present in any client-side bundle (run `grep -r "service_role"` on build output)
- [ ] All `.env` files in `.gitignore` and not committed
- [ ] Rate limiting tested: 100+ rapid requests to API routes triggers 429
- [ ] All security headers present (CSP, HSTS, X-Frame-Options) — verify with securityheaders.com
- [ ] Webhook endpoints reject requests with invalid signatures
- [ ] SQL injection: test product search with SQL injection strings
- [ ] XSS: test all text inputs with `<script>alert(1)</script>`

### Functionality

- [ ] Full customer journey: register → browse → add to cart → checkout → pay → confirm
- [ ] Full customer journey in Arabic
- [ ] Guest checkout flow end-to-end
- [ ] All 6 Kuwait governorates selectable at checkout
- [ ] Address add/edit/delete working correctly
- [ ] KNET payment test with real test transaction
- [ ] Visa/Mastercard payment test
- [ ] Apple Pay test (on iPhone)
- [ ] COD order placed and visible in admin
- [ ] Order confirmation email received within 2 minutes
- [ ] Order confirmation email in Arabic (for AR locale session)
- [ ] Admin: product create with all 10 tabs → publish → appears on storefront
- [ ] Admin: price change → storefront updates within 5 minutes
- [ ] Admin: announcement bar toggle off → bar disappears on storefront
- [ ] Admin: flash sale activate → home page section appears with countdown
- [ ] Admin: flash sale end → section disappears, prices revert
- [ ] Admin: mark order shipped + tracking → customer sees it in account
- [ ] Return request: customer submits → appears in admin returns queue
- [ ] Newsletter subscribe → welcome email received
- [ ] Coupon code applied at checkout — correct discount calculated

### Performance

- [ ] Home page Lighthouse mobile score ≥ 90
- [ ] PDP Lighthouse mobile score ≥ 85
- [ ] Home page LCP < 1.5s on 3G mobile
- [ ] CLS < 0.05 on all pages
- [ ] No layout shift from font loading (next/font working)
- [ ] All product images have explicit aspect ratios
- [ ] Hero image above fold loads with priority (no lazy load on LCP)

### Mobile & PWA

- [ ] All pages functional on iPhone SE (375px) Safari
- [ ] All pages functional on Android Chrome (Samsung Galaxy)
- [ ] Bottom tab bar visible and functional on mobile
- [ ] Add to cart sticky button visible on PDP mobile
- [ ] Checkout is single-column on mobile (no sidebar)
- [ ] PWA installs successfully on iPhone (via Add to Home Screen)
- [ ] PWA installs successfully on Android Chrome
- [ ] Offline mode: previously visited pages readable offline
- [ ] Cart persists when going offline and reconnecting
- [ ] Push notification received after test order (iOS + Android)

### RTL / Bilingual

- [ ] Full Arabic site test by native Arabic speaker
- [ ] All prices display correctly in Arabic format (5.500 د.ك)
- [ ] Countdown timer digits remain LTR on Arabic pages
- [ ] All safety warnings present in Arabic
- [ ] Footer CR number shows on Arabic page
- [ ] All emails tested in Arabic
- [ ] Language toggle works: EN ↔ AR, URL updates, direction flips

### Legal

- [ ] Privacy policy page exists in Arabic + English
- [ ] Terms of service page exists in Arabic + English
- [ ] Returns policy page exists in Arabic + English
- [ ] Delivery information page exists in Arabic + English
- [ ] Cookie policy page exists
- [ ] Cookie consent banner appears on first visit
- [ ] Marketing cookies not fired before consent
- [ ] CR number visible in footer (both locales)
- [ ] All invoices contain CR number, buyer details, VAT line, transaction ID
- [ ] Invoice PDFs tested for all legal fields
- [ ] KUCAS badge shows on products with valid CoC number
- [ ] Age warning visible on all toy PDPs
- [ ] "Download my data" button works in account
- [ ] "Delete my account" request flow works

### Accessibility

- [ ] All interactive elements have visible focus indicators
- [ ] Colour contrast ≥ 4.5:1 for body text
- [ ] All images have alt text (EN + AR)
- [ ] All form inputs have labels (not just placeholders)
- [ ] Keyboard navigation works through entire checkout flow
- [ ] Screen reader test: VoiceOver (iOS) + TalkBack (Android)
- [ ] ARIA labels on icon-only buttons (cart, wishlist, search)

### Admin

- [ ] All 5 RBAC roles tested with correct permission boundaries
- [ ] Super admin can manage staff — other roles cannot
- [ ] Audit log shows all admin actions with correct user and timestamp
- [ ] Client trained on admin — session recorded
- [ ] All admin accounts created for client team
- [ ] Admin login tested from client device

### Launch

- [ ] DNS records updated (A record + CNAME) — cutover plan tested in staging
- [ ] SSL certificate active and auto-renew configured
- [ ] All monitoring alerts active (Sentry, uptime, low stock)
- [ ] Production environment variables set in Vercel (not test/sandbox)
- [ ] MyFatoorah: switched from test mode to live mode in settings
- [ ] Tap Payments: switched to live mode
- [ ] Soft launch: 10 beta customers complete purchases — no critical issues
- [ ] Client signs launch sign-off

---

## 27. Client Information — To Be Filled

> This section will be completed when the client responds to the questions document. Keep this as a placeholder in the meantime — the system is built to accommodate all values below as configurable settings.

| # | Information item | Client response | Status |
|---|---|---|---|
| 1 | Commercial Registration (CR) number | — | `[!] Required` |
| 2 | MyFatoorah merchant account status | — | `[!] Required` |
| 3 | Free delivery threshold (KWD) | — | `[!] Required` |
| 4 | Return policy window (days) | — | `[!] Required` |
| 5 | Cash on Delivery offered? (yes/no) | — | `[!] Required` |
| 6 | COD handling fee (KWD, or 0) | — | `[!] Required` |
| 7 | Delivery rate — standard per governorate | — | `[!] Required` |
| 8 | Delivery rate — express per governorate | — | `[!] Required` |
| 9 | Same-day delivery available? Which governorates? Cut-off time? | — | `[!] Required` |
| 10 | KUCAS certificates: all products covered? (yes/no) | — | `[!] Required` |
| 11 | Loyalty programme earn rate (e.g. 1 pt per 0.100 KD) | — | `[!] Required` |
| 12 | WhatsApp business number (+965XXXXXXXX) | — | `[!] Required` |
| 13 | Legal review of privacy policy completed? (yes/no) | — | `[!] Required` |
| 14 | Domain name(s) | — | `[!] Required` |
| 15 | Logo files provided? (yes/no) | — | `[!] Required` |
| 16 | Courier partner name(s) | — | `[!] Required` |
| 17 | Admin user names + email addresses | — | `[!] Required` |
| 18 | HS / GCC tariff codes for product catalogue | — | `[!] Required` |
| 19 | Physical store address (for footer + contact page) | — | `[!] Required` |
| 20 | Newsletter incentive: 10% off voucher? Code format? | — | `[!] Required` |
| 21 | Launch date target | — | `[!] Required` |
| 22 | Preferred Supabase region (EU / Middle East) | — | `[!] Required` |

---

## 28. Open Decisions Log

> Log every technical or product decision that has not yet been finalised. Close each entry when the decision is made.

| # | Decision | Options | Owner | Status |
|---|---|---|---|---|
| 1 | Supabase project region | EU West (London) vs Middle East (Dubai) | Lead dev + client | `[!] Open` |
| 2 | Algolia plan tier | Starter vs Growth (based on product catalogue size) | Lead dev | `[!] Open` |
| 3 | Same-day delivery implementation | Phase 1 or Phase 6? | Client | `[!] Open` |
| 4 | Tap Payments as secondary or remove entirely? | Keep as secondary backup vs rely solely on MyFatoorah | Lead dev + client | `[!] Open` |
| 5 | Blog — build custom CMS or use Sanity/Contentful? | Custom admin editor vs headless CMS integration | Lead dev | `[!] Open` |
| 6 | Analytics — PostHog self-hosted or cloud? | Cloud (simpler) vs self-hosted (PDPL data residency) | Lead dev | `[!] Open` |
| 7 | Product Q&A — Phase 1 or Phase 6? | Include early for SEO value vs defer to reduce Phase 1 scope | Lead dev | `[!] Open` |
| 8 | Delivery slot time selection | Phase 1 or Phase 6? | Client | `[!] Open` |

---

*Document: NewStarSports Master Reference*
*Version: 3.0*
*Last updated: 2025*
*Status: Active — update this document as decisions are made and tasks completed*
*Usage: Google Docs (Antigravity compatible markdown)*
