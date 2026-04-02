# Storefront Design System — Claymorphism

> **Design language:** Claymorphism  
> **Framework:** Next.js 15 (App Router) · Tailwind CSS v4 · shadcn/ui (new-york, zinc)  
> **Font:** Plus Jakarta Sans (sans + display) · Geist Mono  

---

## 1. Design Philosophy

The storefront uses a **claymorphism** aesthetic — soft pastel surfaces, generous border radii, layered colored drop shadows paired with an inner white highlight, and subtle hover-lift animations. The goal is a playful, tactile feel suited to a toy/sports retail store.

Key characteristics:
- **Pastel color palette** using OKLCH color space for perceptually uniform hues
- **Multi-layer box shadows** — a diffuse colored outer shadow + a crisp inset white highlight simulating a clay-like depth
- **Rounded-everything** — base radius `1.75rem`, hero/banner elements up to `2.5rem`
- **Hover lift** — cards translate up and scale slightly on hover
- **Fixed page background** — a soft diagonal gradient applied to `<body>` with `background-attachment: fixed`

---

## 2. Color System

All colors are defined in `apps/storefront/app/globals.css` as CSS custom properties using OKLCH.

### Core Theme (Sky Blue)

| Token | Value | Usage |
|---|---|---|
| `--primary` | `oklch(0.55 0.19 215)` | CTA buttons, links, active states |
| `--background` | `oklch(0.985 0.006 75)` | Page base (warm off-white) |
| `--foreground` | `oklch(0.14 0.018 255)` | Body text |
| `--card` | `oklch(1 0 0)` | Card surfaces |
| `--accent-warm` | `oklch(0.82 0.16 75)` | Warm accent (amber/gold) |

### Clay Pastel Surface Tokens

Seven named clay colors, each with a light surface variant and a deep variant (used for shadows and text on badges):

| Name | Surface | Deep |
|---|---|---|
| **sky** | `oklch(0.92 0.06 215)` | `oklch(0.72 0.15 215)` |
| **mint** | `oklch(0.91 0.07 162)` | `oklch(0.68 0.14 162)` |
| **lavender** | `oklch(0.91 0.07 290)` | `oklch(0.68 0.15 290)` |
| **peach** | `oklch(0.92 0.07 55)` | `oklch(0.72 0.13 55)` |
| **pink** | `oklch(0.91 0.07 350)` | `oklch(0.70 0.15 350)` |
| **lemon** | `oklch(0.93 0.08 96)` | `oklch(0.75 0.14 96)` |
| **coral** | `oklch(0.88 0.10 28)` | `oklch(0.62 0.18 28)` |

Accessed in Tailwind as `bg-clay-sky`, `bg-clay-mint-deep`, etc. (mapped via `@theme inline`).

### Dark Mode

Dark clay surfaces use lower lightness values (L ≈ 0.28–0.30) so the pastel personality is preserved without being too bright on dark backgrounds. Deep variants shift to mid-range lightness (L ≈ 0.52–0.58).

### Gradient Tokens

| Token | Usage |
|---|---|
| `--gradient-primary` | Primary CTA gradient buttons |
| `--gradient-header` | Fallback header gradient |
| `--gradient-soft` | Subtle background panels |
| `--gradient-page` | Fixed full-page body gradient (sky→warm off-white) |

---

## 3. Shadow System

Clay shadows are utility classes defined in `globals.css`. Each class applies:
1. A diffuse colored drop shadow using `color-mix` against the matching deep token
2. A tighter colored drop shadow for depth
3. An `inset` white highlight (`rgba(255,255,255,0.65)`) for the clay surface effect

```css
/* Example: clay-shadow-mint */
.clay-shadow-mint {
  box-shadow:
    0 8px 32px -4px color-mix(in oklch, var(--clay-mint-deep) 45%, transparent),
    0 2px 8px -2px color-mix(in oklch, var(--clay-mint-deep) 25%, transparent),
    inset 0 2px 4px 0 rgba(255, 255, 255, 0.65);
}
```

Available classes:

| Class | Color |
|---|---|
| `.clay-shadow-sky` | Sky blue |
| `.clay-shadow-mint` | Mint green |
| `.clay-shadow-lavender` | Lavender purple |
| `.clay-shadow-peach` | Peach orange |
| `.clay-shadow-pink` | Pink |
| `.clay-shadow-lemon` | Lemon yellow |
| `.clay-shadow-coral` | Coral red |
| `.clay-shadow-white` | Neutral white (no color tint) — used on white cards |

### Hover Lift

`.clay-hover` applied to any interactive card:

```css
.clay-hover:hover {
  transform: translateY(-3px) scale(1.01);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
```

### Banner Glow

`.banner-glow-sky` — a softer, diffuse sky-blue glow used on promotional banners. On hover it deepens and lifts the element by 4px.

---

## 4. Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius` | `1rem` | Base radius (shadcn components) |
| `--radius-clay` (`--radius-clay-val`) | `1.75rem` | Cards, product tiles, panels |
| Banners / hero | `2rem–2.5rem` (inline) | Flash sale header, hero slides, editorial banners |

---

## 5. Typography

| Role | Font | Weight |
|---|---|---|
| Body / UI | Plus Jakarta Sans | 400–700 |
| Display / Headings | Plus Jakarta Sans | 700–900 |
| Code / Monospace | Geist Mono | — |

---

## 6. Component Reference

### Header (`app/_components/header.tsx`)

- Fixed top bar with a sky-blue gradient background (`oklch(0.82 0.09 240) → oklch(0.65 0.17 215)`)
- Inner white highlight via `inset 0 1px 0 rgba(255,255,255,0.35)` on the `boxShadow`
- Nav links: `rounded-full` pill with `hover:bg-white/20`
- Language toggle: clay pill (`bg-white/20`, `inset` shadow highlight)
- Icon buttons (cart, wishlist, account): `rounded-full`, ghost variant

### Product Card (`app/_components/product-card.tsx`)

- Outer wrapper: `rounded-[1.75rem]` · `clay-shadow-white` · `clay-hover`
- Image area: `rounded-[1.5rem]` · `bg-clay-sky/30` · `m-2` inset
- Image scales to 105% on group hover
- **Badges** (top-left, stacked):
  - New Arrival → `bg-clay-mint` + `clay-shadow-mint`
  - Flash Sale → `bg-clay-coral` + `clay-shadow-coral` + `<Zap>` icon
  - Discount % → `bg-clay-pink` + `clay-shadow-pink`
- Out-of-stock overlay: `bg-white/60 backdrop-blur-sm` + lavender pill badge
- Wishlist button: `rounded-full` white button, top-right, `clay-shadow-white`
- Add-to-cart CTA: primary circle button (bottom-right of price row)

### Category Bar (`app/_components/category-bar-client.tsx`)

- Category icons rendered as clay bubble circles, cycling through `CLAY_COLORS[]` array
- Active category shown as a clay pill tab in compact/sticky mode

### Product Section (`app/_components/product-section.tsx`)

- Section header: left accent bar (`w-1 rounded-full bg-<accentColor>`) + pill "View All" button
- `bgVariant` prop: `mint` | `lavender` | `peach` | `sky` | `lemon` — sets the section background tint
- `accentColor` prop: drives the left bar and pill button color

### Flash Sale Section (`app/_components/flash-sale-section.tsx`)

- Outer wrapper: `rounded-[2rem]` · coral gradient header
- Countdown tiles: white background, coral text, clay shadow
- Product area uses coral clay background

### Hero Carousel (`app/_components/hero-carousel.tsx`)

- Slides: `rounded-[2rem]` (outer) / `rounded-[1.75rem]` (inner media)
- Arrow navigation: clay circle buttons with shadow
- CTA: clay pill button
- Dot indicators: clay-styled dots cycling colors

### Banner Section (`app/_components/banner-section.tsx`)

- `EditorialBanner`: `rounded-[2.5rem]` · `clay-shadow-lavender`
- `SplitPromoBanners`: `rounded-[2rem]` · alternating peach and mint shadows

### Footer (`app/_components/footer.tsx`)

- Sky gradient background with `rounded-t-[2.5rem]`
- Social icon buttons: clay circles
- Payment method icons: clay pills

### Mobile Bottom Nav (`app/_components/mobile-bottom-nav.tsx`)

- Floating pill bar: `rounded-[2rem]` white bar with deep drop shadow
- Active tab indicator: cycles through clay colors per tab

---

## 7. Page-Level Patterns

### Homepage (`app/[locale]/(public)/page.tsx`)

- Inline promo banners use clay rounded cards
- Category grid: cycling clay colors per card
- Brand grid: white cards with `clay-shadow-white`
- Blog cards: rounded with colored shadows
- All `<ProductSection>` instances use `accentColor` and `bgVariant` props for visual variety

### Category Page (`app/[locale]/category/[slug]/page.tsx`)

- Hero: `mx-4` inset clay rounded card
- Header card: `bg-clay-sky/30`
- Subcategory pills: clay pill style
- Sidebar: clay lavender wrapper

### Brand Page (`app/[locale]/brand/[slug]/page.tsx`)

- Hero: `mx-4` inset clay rounded card
- Header card: `bg-clay-peach/30`
- Sidebar: clay peach wrapper

---

## 8. Utility Classes Reference

| Class | Purpose |
|---|---|
| `.clay-shadow-{color}` | Colored clay drop shadow + inner white highlight |
| `.clay-shadow-white` | Neutral clay shadow (for white cards) |
| `.clay-hover` | Hover lift animation (`translateY(-3px) scale(1.01)`) |
| `.banner-glow-sky` | Diffuse blue glow on banners, deepens on hover |
| `.scrollbar-hide` | Hides scrollbar while keeping scroll functionality |

---

## 9. Technology Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 (no `tailwind.config.ts`) |
| Component Library | shadcn/ui — new-york style, zinc base color |
| CSS Format | `@theme inline` with OKLCH custom properties |
| Icons | Lucide React |
| Carousel | Embla Carousel |
| Theming | `next-themes` (dark mode via `.dark` class) |
| Color Format | OKLCH throughout (perceptually uniform, HDR-ready) |
