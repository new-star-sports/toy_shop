# NSS — UI Redesign Plan
> Mac-inspired · shadcn/ui · Tabler Icons · Rounded design language · Next.js

---

## 1. Overview

This document is the complete implementation guide for redesigning the NewStarSports (NSS) application UI. It covers both the **Admin** (`apps/admin`) and **Storefront** (`apps/storefront`) apps, and the **shared UI package** (`packages/ui`).

### Goals
- Replace the existing custom component library with **shadcn/ui** as the new base
- Adopt a **Mac-inspired, rounded, clean aesthetic** — think macOS System Settings meets Linear/Vercel
- Use **Tabler Icons** (`@tabler/icons-react`) as the unified icon system
- All buttons → **pill/capsule shape** (`rounded-full`)
- All cards → **`rounded-2xl`** with soft borders, no harsh shadows
- Typography → **Geist** (Latin) / keep **IBM Plex Sans** for Arabic/RTL

### Design Principles
| Principle | Implementation |
|---|---|
| Rounded everywhere | `rounded-full` buttons, `rounded-2xl` cards, `rounded-xl` inputs |
| Soft depth | `border border-border/50` instead of heavy `box-shadow` |
| Mac-like spacing | Generous padding, clear visual hierarchy, subtle separators |
| Icon-led UI | Tabler Icons at 20px stroke in nav; 16px inline |
| Plum & Honey color | Deep Plum primary + Honey Gold accent on CTAs; Lavender surfaces for warmth |

---

## 2. Tech Stack

| Layer | Current | New |
|---|---|---|
| Component base | Custom `@nss/ui` | **shadcn/ui** (Radix primitives + Tailwind) |
| Icons | (mixed/custom) | **`@tabler/icons-react`** |
| Font | IBM Plex Sans | **Geist** (Latin) + IBM Plex Sans (Arabic) |
| Styling | Tailwind CSS | Tailwind CSS (updated config) |
| Animation | — | shadcn built-in + `tailwindcss-animate` |

---

## 3. Design Tokens

### 3.1 Color Palette (CSS Variables)

Define in `packages/ui/src/styles/globals.css`:

```css
:root {
  /* Brand — Plum & Honey */
  --color-primary: 262 55% 28%;        /* #3B1F6E — Deep Plum */
  --color-primary-foreground: 0 0% 100%;

  --color-accent: 38 92% 50%;           /* #F59E0B — Honey Gold */
  --color-accent-foreground: 0 0% 100%;

  --color-purple-mid: 271 75% 57%;      /* #7C3AED — Electric Purple (claymorphism CTAs) */

  /* Neutrals */
  --color-background: 265 100% 97%;     /* #F5F0FF — Soft Lavender */
  --color-foreground: 263 66% 14%;      /* #1E0A40 — Ink Plum */
  --color-muted: 263 20% 52%;           /* #7B6B96 — Muted Purple-grey */
  --color-muted-foreground: 263 20% 52%;

  /* Surface */
  --color-card: 0 0% 100%;
  --color-card-foreground: 263 66% 14%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 263 66% 14%;

  /* UI */
  --color-border: 265 30% 88%;          /* Lavender-tinted border */
  --color-input: 265 30% 88%;
  --color-ring: 262 55% 28%;

  /* States */
  --color-destructive: 0 84% 60%;
  --color-destructive-foreground: 0 0% 100%;
  --color-success: 142 76% 36%;
  --color-warning: 38 92% 50%;

  /* Radius — the key to the Mac look */
  --radius: 1rem;          /* base = 16px → rounded-2xl on cards */
}

.dark {
  --color-background: 263 40% 8%;       /* #0F0820 — Deep Ink */
  --color-foreground: 265 80% 96%;      /* #F0EEFF — Ghost Lavender */
  --color-card: 263 35% 12%;            /* #150C2A — Dark Plum Surface */
  --color-border: 263 25% 22%;
  --color-muted: 263 20% 60%;
  --color-input: 263 25% 18%;
}
```

### 3.2 Tailwind Config

Update `packages/ui/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../apps/admin/app/**/*.{ts,tsx}",
    "../../apps/storefront/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",          /* Deep Plum #3B1F6E */
          foreground: "hsl(var(--color-primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",           /* Honey Gold #F59E0B */
          foreground: "hsl(var(--color-accent-foreground))",
        },
        purple: {
          mid: "hsl(var(--color-purple-mid))",           /* Electric Purple #7C3AED — claymorphism CTAs */
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",           /* 16px */
        md: "calc(var(--radius) - 4px)", /* 12px */
        sm: "calc(var(--radius) - 8px)", /* 8px */
        xl: "calc(var(--radius) + 4px)", /* 20px */
        "2xl": "calc(var(--radius) + 8px)", /* 24px */
        full: "9999px",                /* capsule */
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "IBM Plex Sans", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 16px 0 rgb(0 0 0 / 0.08)",
        "popover": "0 8px 32px 0 rgb(0 0 0 / 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

---

## 4. shadcn/ui Installation

### 4.1 Install in packages/ui

```bash
cd packages/ui
npx shadcn@latest init
```

When prompted, use these settings:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**
- Tailwind config path: `tailwind.config.ts`
- Components path: `src/components/ui`
- Utils path: `src/lib/utils`
- RSC: **Yes**

### 4.2 Install Tabler Icons

```bash
pnpm add @tabler/icons-react --filter @nss/ui
# or add to both apps if consuming directly
pnpm add @tabler/icons-react --filter admin --filter storefront
```

### 4.3 Install required shadcn components

Run these from `packages/ui`:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add textarea
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add breadcrumb
npx shadcn@latest add scroll-area
npx shadcn@latest add collapsible
npx shadcn@latest add navigation-menu
```

---

## 5. Component Spec — Rounded Mac Look

### 5.1 Button (capsule)

```tsx
// packages/ui/src/components/ui/button.tsx
// After shadcn init, update the variants:

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 active:scale-[0.98]",
        outline:
          "border border-border bg-transparent hover:bg-muted/30 hover:border-border/80",
        ghost:
          "hover:bg-muted/30 text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2 rounded-full",   /* capsule */
        sm: "h-7 px-4 text-xs rounded-full",
        lg: "h-11 px-8 text-base rounded-full",
        icon: "h-9 w-9 rounded-full",
        "icon-sm": "h-7 w-7 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 5.2 Card

```tsx
// Standard card usage across both apps
<Card className="rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
  <CardHeader className="pb-3">
    <CardTitle className="text-base font-medium">Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### 5.3 Input

```tsx
// Update input className in shadcn generated file
<Input className="h-10 rounded-xl border-border/60 bg-background focus:ring-2 focus:ring-primary/20" />
```

### 5.4 Badge / Chip (capsule)

```tsx
// Always use rounded-full for badges
<Badge variant="outline" className="rounded-full px-3 font-normal">
  Category name
</Badge>
```

### 5.5 Dialog / Modal

```tsx
<DialogContent className="rounded-2xl border border-border/50 shadow-popover">
  {/* content */}
</DialogContent>
```

---

## 6. Admin App — Layout Redesign

### 6.1 Layout Structure

```
apps/admin/app/(dashboard)/
├── layout.tsx          ← Root layout: Sidebar + Topbar
├── page.tsx            ← Dashboard/home
├── products/
├── categories/
├── brands/
├── banners/
├── blogs/
├── coupons/
├── customers/
├── orders/
├── reviews/
└── inventory/
```

### 6.2 Sidebar Component

File: `apps/admin/components/layout/sidebar.tsx`

Design spec:
- Fixed left, `w-60` expanded / `w-14` collapsed
- Background: `bg-card border-r border-border/50`
- Nav items: `rounded-xl` active state with `bg-primary/8 text-primary`
- Icons: Tabler Icons at `20px`
- Collapse toggle: icon button at bottom

```tsx
import {
  IconLayoutDashboard,
  IconPackage,
  IconCategory,
  IconBuildingStore,
  IconPhoto,
  IconArticle,
  IconTicket,
  IconUsers,
  IconShoppingCart,
  IconStar,
  IconBox,
  IconSettings,
  IconChevronLeft,
} from "@tabler/icons-react"

const navItems = [
  { label: "Dashboard",  href: "/",           icon: IconLayoutDashboard },
  { label: "Products",   href: "/products",   icon: IconPackage },
  { label: "Categories", href: "/categories", icon: IconCategory },
  { label: "Brands",     href: "/brands",     icon: IconBuildingStore },
  { label: "Banners",    href: "/banners",    icon: IconPhoto },
  { label: "Blogs",      href: "/blogs",      icon: IconArticle },
  { label: "Coupons",    href: "/coupons",    icon: IconTicket },
  { label: "Customers",  href: "/customers",  icon: IconUsers },
  { label: "Orders",     href: "/orders",     icon: IconShoppingCart },
  { label: "Reviews",    href: "/reviews",    icon: IconStar },
  { label: "Inventory",  href: "/inventory",  icon: IconBox },
  { label: "Settings",   href: "/settings",   icon: IconSettings },
]

// Each nav item:
<Link
  href={item.href}
  className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
  )}
>
  <item.icon size={20} stroke={1.5} />
  {!collapsed && <span>{item.label}</span>}
</Link>
```

### 6.3 Topbar Component

File: `apps/admin/components/layout/topbar.tsx`

```tsx
// Topbar: breadcrumb left, search + notifications + avatar right
<header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-6 gap-4">
  <Breadcrumb /> {/* shadcn Breadcrumb */}
  <div className="ml-auto flex items-center gap-2">
    <Button variant="ghost" size="icon-sm">
      <IconSearch size={18} stroke={1.5} />
    </Button>
    <Button variant="ghost" size="icon-sm" className="relative">
      <IconBell size={18} stroke={1.5} />
      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
    </Button>
    <Separator orientation="vertical" className="h-6" />
    <Avatar className="h-8 w-8">
      <AvatarImage src="/admin-avatar.png" />
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  </div>
</header>
```

### 6.4 DataTable Component

File: `apps/admin/components/data-table.tsx`

Use **TanStack Table** + shadcn Table. Spec:
- Outer wrapper: `rounded-2xl border border-border/50 overflow-hidden`
- Header row: `bg-muted/30` with subtle text
- Row actions: shadcn `DropdownMenu` with Tabler Icons
- Filters: capsule `Input` with `IconSearch` prefix
- Pagination: pill buttons

```tsx
// Table wrapper
<div className="rounded-2xl border border-border/50 overflow-hidden shadow-card">
  <Table>
    <TableHeader className="bg-muted/30">
      <TableRow className="border-b border-border/50 hover:bg-transparent">
        <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Name
        </TableHead>
        {/* ... */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
          {/* cells */}
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <IconDotsVertical size={16} stroke={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl" align="end">
                <DropdownMenuItem className="rounded-lg gap-2">
                  <IconEdit size={15} stroke={1.5} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg gap-2 text-destructive">
                  <IconTrash size={15} stroke={1.5} /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### 6.5 Admin Page Pattern (CRUD)

Every admin module follows this layout:

```tsx
// Page header
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-xl font-semibold">Products</h1>
    <p className="text-sm text-muted-foreground mt-0.5">Manage your product catalog</p>
  </div>
  <Button variant="default" size="default" className="gap-2">
    <IconPlus size={16} stroke={2} />
    Add product
  </Button>
</div>

// Filter bar
<div className="flex items-center gap-3 mb-4">
  <div className="relative flex-1 max-w-xs">
    <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
    <Input className="pl-9 rounded-full h-9" placeholder="Search products..." />
  </div>
  <Select>
    <SelectTrigger className="w-36 rounded-full h-9">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    {/* ... */}
  </Select>
</div>

// DataTable
<DataTable columns={columns} data={data} />
```

### 6.6 Forms — Use Sheet (Slide-over)

For create/edit forms, use shadcn `Sheet` instead of separate pages where possible:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Add product</Button>
  </SheetTrigger>
  <SheetContent className="w-[480px] sm:max-w-[480px] rounded-l-2xl">
    <SheetHeader>
      <SheetTitle>New product</SheetTitle>
      <SheetDescription>Fill in the product details below.</SheetDescription>
    </SheetHeader>
    <ScrollArea className="h-[calc(100vh-140px)] pr-4 mt-6">
      {/* Form fields */}
    </ScrollArea>
    <SheetFooter className="mt-4">
      <Button variant="outline" className="flex-1">Cancel</Button>
      <Button className="flex-1">Save product</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 6.7 Dashboard KPI Cards

```tsx
// Stats card pattern
<Card className="rounded-2xl border border-border/50 shadow-card">
  <CardContent className="p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-muted-foreground font-medium">Total orders</span>
      <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <IconShoppingCart size={16} className="text-primary" stroke={1.5} />
      </div>
    </div>
    <p className="text-2xl font-semibold">1,284</p>
    <p className="text-xs text-muted-foreground mt-1">
      <span className="text-success font-medium">+12%</span> from last month
    </p>
  </CardContent>
</Card>
```

---

## 7. Storefront App — Layout Redesign

### 7.1 Layout Structure

```
apps/storefront/app/[locale]/
├── layout.tsx         ← Header + Footer + MobileNav
├── page.tsx           ← Homepage
├── product/
│   └── [slug]/        ← Product detail
├── category/
│   └── [slug]/        ← Category listing
├── brand/
│   └── [slug]/        ← Brand listing
├── search/            ← Search results
├── checkout/          ← Multi-step checkout
├── account/           ← Profile, orders, addresses
└── blog/              ← Blog listing + detail
```

### 7.2 Header Component

```tsx
// Sticky header with capsule search bar
<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
    {/* Logo */}
    <Link href="/" className="flex-shrink-0">
      <img src="/logo.svg" alt="NSS" className="h-8" />
    </Link>

    {/* Navigation */}
    <nav className="hidden md:flex items-center gap-1 ml-4">
      {["Products", "Brands", "Blog"].map((item) => (
        <Link
          key={item}
          href={`/${item.toLowerCase()}`}
          className="px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          {item}
        </Link>
      ))}
    </nav>

    {/* Capsule search */}
    <div className="flex-1 max-w-md mx-auto hidden md:block">
      <div className="relative">
        <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
        <Input
          className="rounded-full h-9 pl-10 pr-4 bg-muted/40 border-border/40 focus:bg-background"
          placeholder="Search toys, brands..."
        />
      </div>
    </div>

    {/* Actions */}
    <div className="ml-auto flex items-center gap-1">
      <Button variant="ghost" size="icon">
        <IconSearch size={20} stroke={1.5} />
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <IconHeart size={20} stroke={1.5} />
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <IconShoppingCart size={20} stroke={1.5} />
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] text-white flex items-center justify-center font-medium">3</span>
      </Button>
      <Button variant="ghost" size="icon">
        <IconUser size={20} stroke={1.5} />
      </Button>
    </div>
  </div>
</header>
```

### 7.3 Authentication — Dialog-based
Storefront authentication does **not** use separate pages. It uses a centered `Dialog` with a rich blurred background.

```tsx
<Dialog>
  <DialogContent className="sm:max-w-md rounded-2xl border-border/40 backdrop-blur-xl bg-background/95">
    <DialogHeader>
      <DialogTitle className="text-2xl font-semibold text-center">Welcome back</DialogTitle>
      <DialogDescription className="text-center">Log in to your NSS account</DialogDescription>
    </DialogHeader>
    {/* Auth Form */}
  </DialogContent>
</Dialog>
```
```

### 7.3 Product Card

```tsx
<Card className="group rounded-2xl border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
  {/* Image */}
  <div className="relative aspect-square bg-muted/30 overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    {/* Wishlist button */}
    <Button
      variant="ghost"
      size="icon-sm"
      className="absolute top-2.5 right-2.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <IconHeart size={15} stroke={1.5} />
    </Button>
    {/* Badge */}
    {product.isNew && (
      <Badge className="absolute top-2.5 left-2.5 rounded-full bg-accent text-white text-xs">
        New
      </Badge>
    )}
  </div>
  {/* Info */}
  <CardContent className="p-4">
    <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
    <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2">{product.name}</h3>
    <div className="flex items-center justify-between">
      <span className="font-semibold">${product.price}</span>
      <Button size="icon-sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
        <IconPlus size={15} stroke={2} />
      </Button>
    </div>
  </CardContent>
</Card>
```

### 7.4 Filter Sidebar (Desktop) / Sheet (Mobile)

```tsx
// Desktop sidebar
<aside className="w-64 flex-shrink-0">
  <div className="rounded-2xl border border-border/50 p-4 space-y-5">
    {/* Price range */}
    <div>
      <h4 className="text-sm font-medium mb-3">Price range</h4>
      {/* Slider */}
    </div>
    <Separator />
    {/* Categories as capsule checkboxes */}
    <div>
      <h4 className="text-sm font-medium mb-3">Category</h4>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <label key={cat.id} className="cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs border border-border/60 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
              {cat.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
</aside>

// Mobile — Sheet trigger
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="sm" className="rounded-full gap-2 md:hidden">
      <IconAdjustments size={15} stroke={1.5} />
      Filters
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="rounded-r-2xl w-72">
    {/* Same filter content */}
  </SheetContent>
</Sheet>
```

### 7.5 Checkout — Multi-step

```tsx
// Stepper tabs
<Tabs value={step} className="w-full">
  <TabsList className="rounded-full bg-muted/40 p-1 w-full grid grid-cols-3">
    <TabsTrigger value="shipping" className="rounded-full text-sm">
      1. Shipping
    </TabsTrigger>
    <TabsTrigger value="payment" className="rounded-full text-sm">
      2. Payment
    </TabsTrigger>
    <TabsTrigger value="review" className="rounded-full text-sm">
      3. Review
    </TabsTrigger>
  </TabsList>
  <TabsContent value="shipping" className="mt-6">
    {/* Shipping form in a Card */}
  </TabsContent>
  {/* ... */}
</Tabs>
```

### 7.6 Mobile Bottom Navigation

```tsx
// Bottom nav — mobile only
<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-md border-t border-border/40">
  <div className="flex items-center justify-around h-16 px-4">
    {[
      { icon: IconHome, label: "Home", href: "/" },
      { icon: IconCategory, label: "Shop", href: "/products" },
      { icon: IconSearch, label: "Search", href: "/search" },
      { icon: IconShoppingCart, label: "Cart", href: "/cart" },
      { icon: IconUser, label: "Account", href: "/account" },
    ].map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <item.icon size={22} stroke={1.5} />
        <span className="text-[10px] font-medium">{item.label}</span>
      </Link>
    ))}
  </div>
</nav>
```

---

## 8. Shared Package — Final Exports

After migration, `packages/ui/src/index.ts` should export:

```ts
// Components (all shadcn-based, rounded overrides applied)
export * from "./components/ui/button"
export * from "./components/ui/card"
export * from "./components/ui/input"
export * from "./components/ui/label"
export * from "./components/ui/select"
export * from "./components/ui/checkbox"
export * from "./components/ui/switch"
export * from "./components/ui/textarea"
export * from "./components/ui/dialog"
export * from "./components/ui/sheet"
export * from "./components/ui/alert"
export * from "./components/ui/badge"
export * from "./components/ui/tabs"
export * from "./components/ui/table"
export * from "./components/ui/dropdown-menu"
export * from "./components/ui/avatar"
export * from "./components/ui/separator"
export * from "./components/ui/tooltip"
export * from "./components/ui/skeleton"
export * from "./components/ui/toast"
export * from "./components/ui/form"
export * from "./components/ui/breadcrumb"
export * from "./components/ui/scroll-area"
export * from "./components/ui/command"
export * from "./components/ui/popover"

// Utils
export { cn } from "./lib/utils"

// Icons re-export (commonly used ones, or just document to import from @tabler/icons-react)
// Recommended: import directly from @tabler/icons-react in each app
```

---

## 9. Migration Checklist

### Phase 1 — Design Tokens & Core (Day 1–2)
- [x] Update `tailwind.config.ts` in `packages/ui`
- [x] Rewrite `globals.css` with new CSS variables
- [ ] **Clean up App Overrides**: Remove `@theme` blocks in `apps/admin/app/globals.css` and `apps/storefront/app/globals.css` that redefine old brand colors.
- [ ] **Font Setup**: Install `geist` font and configure in `layout.tsx` for both apps.
- [ ] **Tailwind 4 Compatibility**: Ensure `@import "@nss/ui/globals.css"` is correctly placed and variables are accessible.

### Phase 2 — shadcn/ui & Icons (Day 2–3)
- [x] Run `npx shadcn@latest init` in `packages/ui`
- [/] Install remaining components: `sheet`, `dropdown-menu`, `avatar`, `separator`, `tooltip`, `popover`, `command`, `skeleton`, `toast`, `breadcrumb`, `scroll-area`, `collapsible`, `navigation-menu`.
- [ ] Install `@tabler/icons-react` in `packages/ui` and apps.
- [ ] Apply rounded overrides to `button.tsx` (capsule variant) and `input.tsx` (rounded-xl).
- [ ] Update `packages/ui/src/index.ts` to export all new components.

### Phase 3 — Admin Rebuild (Day 3–10)
- [ ] **Layout v2**: Implement the new `Sidebar` and `Topbar` components using Tabler Icons.
- [ ] **Dashboard v2**: Create the KPI cards and charts with the new Lavender/Plum palette.
- [ ] **CRUD Modules**: Systematically migrate each module (Products, Categories, etc.) to use `DataTable` and `Sheet` forms.
- [ ] **Form Validation**: Ensure all forms use the new `Form` component (shadcn + react-hook-form + zod).

### Phase 4 — Storefront Rebuild (Day 10–20)
- [ ] **Navigation v2**: Rebuild `Header` with the capsule search and new `MobileBottomNav`.
- [ ] **Auth Dialog**: Implement `AuthDialog` with `backdrop-blur-md` and migrate login/signup logic.
- [ ] **Product Catalog**: Implement the new `ProductCard` and filter `Sheet`.
- [ ] **Checkout v2**: Multi-step checkout using `Tabs` and the new design language.
- [ ] **RTL Optimization**: Verify all components mirror correctly for Arabic.

### Phase 5 — Polish & QA (Day 20–25)
- [ ] **Dark Mode**: Pass through all pages to ensure contrast and aesthetics.
- [ ] **Animations**: Add subtle `framer-motion` or `tailwindcss-animate` transitions.
- [ ] **Performance**: Audit bundle size after adding many new components.

---

## 10. Tailwind 4 Migration Notes (Added March 2026)

The project uses **Tailwind 4** in the apps. To ensure the redesign tokens take effect:

1.  **Remove manual overrides**: In `apps/*/app/globals.css`, delete the old `--color-nss-*` variables inside the `@theme` block.
2.  **Enable CSS Variables**: Tailwind 4 automatically picks up CSS variables from `:root`. Ensure `@import "@nss/ui/globals.css"` is the first import.
3.  **Modern Font API**: Use `next/font/google` for Geist and IBM Plex Sans.

```css
/* Example apps/admin/app/globals.css */
@import "tailwindcss";
@import "@nss/ui/globals.css";

/* No @theme block needed for brand colors anymore */
```

---

## 11. Key Decisions & Rationale
... (keep existing)

---

## 12. Do Not
... (keep existing)

---

*Updated March 2026 — NSS UI Redesign Continuation*
