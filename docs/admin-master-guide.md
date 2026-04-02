# Admin Panel — Master Feature Guide

> Plain-language, section-by-section reference covering every module, what it does, and how the workflow runs.

---

## Table of Contents

1. [Dashboard (Home)](#1-dashboard-home)
2. [Products](#2-products)
3. [Inventory](#3-inventory)
4. [Orders](#4-orders)
5. [Customers](#5-customers)
6. [Categories](#6-categories)
7. [Brands](#7-brands)
8. [Coupons](#8-coupons)
9. [Banners](#9-banners)
10. [Marketing — Flash Sale](#10-marketing--flash-sale)
11. [Blog](#11-blog)
12. [Reviews](#12-reviews)
13. [Settings](#13-settings)
14. [Modules Coming Soon](#14-modules-coming-soon)

---

## 1. Dashboard (Home)

The first page you see after logging in. It gives a quick pulse of the store's daily performance.

### What you see

| Card | What it shows |
|------|--------------|
| **Revenue Today** | Total money collected from orders placed today (in KWD) |
| **Orders Today** | Number of orders placed today |
| **Low Stock Items** | Count of products that have fallen below their restock threshold — shows "Action Required" in red when there are any |
| **New Customers** | Number of new accounts registered |

### Recent Orders

Below the KPI cards is a table of the 5 most recent orders showing order number, customer name, status badge, and total amount. A "View All" link takes you directly to the full Orders section.

### Quick Links panel

A sidebar panel on the right gives one-click access to:
- Manage Inventory
- View Customers
- Marketing Banners

Also shows a **System Status** indicator confirming all services are running.

### Workflow

1. Open the admin panel — the dashboard loads automatically.
2. Scan the 4 KPI cards for today's snapshot.
3. If "Low Stock Items" is red, go to Inventory immediately.
4. Check Recent Orders for anything needing attention.
5. Use the Quick Links to jump to common tasks.

---

## 2. Products

The core catalogue management section. Every item sold in the store is created and managed here.

### Product List

The main list shows all products with:
- Product image thumbnail + name + category label
- SKU code
- Price (KWD)
- Stock quantity with a red pulsing dot if low
- Status badge (Published / Draft / Archived)
- Actions menu (Edit, Delete)

### Filtering the List

- **Search bar** — find by product name or SKU
- **Status tabs** — All / Published / Draft / Archived
- **More Filters** dropdown — filter by stock: All Stock / Low Stock (≤5 units) / Out of Stock

### Deleting a Product

- **Draft products** are permanently removed.
- **Published or Archived products** are moved to "Archived" status instead of being fully deleted (data is preserved).

---

### Adding / Editing a Product

Click "Add Product" (or the edit icon on any row) to open the full product form. The form is divided into sections:

#### Basic Information

| Field | Description |
|-------|-------------|
| Name (English) | Product name shown to English-speaking shoppers |
| Name (Arabic) | Product name shown to Arabic-speaking shoppers |
| URL Slug | The web address for this product page (auto-generated) |
| Short Description (EN + AR) | Brief sentence shown in product cards and search results |
| Full Description (EN + AR) | Detailed description shown on the product detail page |
| Status | **Published** = live on storefront; **Draft** = saved but hidden; **Archived** = delisted |

#### Pricing

| Field | Description |
|-------|-------------|
| Selling Price (KWD) | The price customers pay |
| Compare-at Price (KWD) | Original/crossed-out price shown when there's a discount |
| Cost Price (KWD) | Your purchase cost — used internally for profit tracking |
| Tax Status | Whether tax applies to this product |

#### Flash Sale

| Field | Description |
|-------|-------------|
| Include in Flash Sale | Toggle to add this product to the active flash sale |
| Flash Sale Discount % | Percentage discount to apply during the flash sale |

#### Inventory & Stock

| Field | Description |
|-------|-------------|
| SKU | Unique stock code for this product |
| Barcode | Barcode number (for scanning/logistics) |
| Track Inventory | Toggle whether stock is counted and decremented on purchase |
| Stock Quantity | Current number of units in stock |
| Low Stock Threshold | When stock falls to or below this number, the "Low Stock" alert triggers |
| Out-of-Stock Behaviour | What happens when stock hits 0 — either show as unavailable or allow backorders |

#### Category & Brand

| Field | Description |
|-------|-------------|
| Category | Which category this product belongs to (picked from the Categories list) |
| Brand | Which brand/manufacturer made this product (picked from Brands list) |

#### Homepage & Feature Flags

| Toggle | What it does |
|--------|-------------|
| New Arrival | Marks the product as a New Arrival and shows it in the New Arrivals section on the homepage |
| Homepage Featured | Pins the product to the featured/hero section on the homepage |
| Best Seller Override | Manually forces this product into the Best Sellers section regardless of actual sales |

#### Product Variants

Used when one product comes in multiple options (e.g. sizes, colours, pack sizes). For each variant you set:
- Variant name (English + Arabic)
- Variant SKU
- Price override (leave blank to use the main product price)
- Stock quantity for that variant

#### Product Images

Upload one or more images. The first image becomes the main thumbnail. Images are reordered by drag and the full set replaces any previously uploaded images on save.

#### Age & Safety (Toy Compliance)

| Field | Description |
|-------|-------------|
| Minimum Age | Youngest recommended age (years) |
| Maximum Age | Oldest recommended age (years) |
| Safety Warnings (EN + AR) | Any safety notices required on the listing |
| KUCAS Certificate Number | Kuwait safety certification number |
| KUCAS Expiry Date | When that certification expires |

#### Origin & Materials

| Field | Description |
|-------|-------------|
| Country of Origin | Where the toy was manufactured |
| Materials (EN + AR) | What it's made of |
| Manufacturer Name | The factory or manufacturer |

#### Dimensions & Weight

- Weight (grams)
- Length, Width, Height (cm)

Used for shipping cost calculations and logistics.

#### Returns

Toggle whether this product is eligible for returns.

#### SEO

| Field | Description |
|-------|-------------|
| SEO Title (EN + AR) | The page title shown in Google search results |
| SEO Description (EN + AR) | The short blurb shown under the title in search results |

#### Trade Codes (Kuwait Customs)

| Field | Description |
|-------|-------------|
| HS Code (6-digit) | International Harmonised System trade classification code |
| GCC Tariff Code (12-digit) | Gulf Customs Union tariff code required for import declarations |

### Workflow — Adding a New Product

1. Click **Add Product**.
2. Fill in name, descriptions, and status (set to "Draft" while building).
3. Set the price. Add a compare-at price if it's discounted.
4. Enter the SKU and stock quantity.
5. Assign a category and brand.
6. Upload at least one image.
7. Fill in age range and safety warnings (required for toy compliance).
8. Add country of origin and materials.
9. Write SEO title and description.
10. Set status to **Published** when ready.
11. Save — the product appears on the storefront immediately.

---

## 3. Inventory

A dedicated stock management view that lets you update quantities quickly without going into each product's edit form.

### What you see

Every product and every product variant appears as a separate row showing:
- Product image + name (variants show as "Product Name — Variant Name")
- SKU
- Category
- Stock status badge: **Healthy** (green) / **Low Stock** (amber) / **Out of Stock** (red)
- Current stock number / low-stock threshold
- Quick update button

### Filtering

- **Search** by product name or SKU
- **Low Stock Only** toggle — hides all healthy items so you can focus only on what needs restocking

### Updating Stock

Click the update button on any row. A small inline form lets you type the new quantity and save it without leaving the page.

### Workflow

1. Open Inventory.
2. Click "Low Stock Only" to filter to items needing attention.
3. For each item, enter the new stock quantity after restocking.
4. Save — the count updates immediately and the badge changes to Healthy.

---

## 4. Orders

All customer orders, from placement through to delivery.

### Order List

Displays all orders with:
- Order number
- Date and time placed
- Customer name and email
- Order total (KWD)
- Payment status badge (Pending / Confirmed / Failed / Refunded)
- Payment method (e.g. Cash on Delivery)
- Order status badge (Pending → Confirmed → Processing → Shipped → Delivered / Cancelled)
- View button to open the full order detail

### Filtering Orders

- **Search** by order number, customer name, or email
- **Status tabs** — All / Pending / Confirmed / Processing / Shipped / Delivered / Cancelled
- **More Filters** dropdown — filter by payment status: All / Pending / Confirmed / Failed / Refunded

---

### Order Detail Page

Click any order's view button to see the full picture.

#### Left side — Order contents

**Order Items** — each product with image, name, SKU, unit price × quantity, and line total. Below the items:
- Subtotal
- Shipping cost
- Discount (if a coupon was used — shown in red)
- **Total** (highlighted in the brand colour)

**Order History** — a visual timeline showing every status change with the date, time, and a short note about what happened (e.g. "Order confirmed", "Shipped via courier").

#### Right side — Supporting details

**Customer** — name, email address, phone number.

**Shipping Address** — full Kuwait address including governorate, area, block, street, building, and recipient phone.

**Fulfillment** — shows the shipping method chosen and the tracking number. You can type/update the tracking number directly here.

**Payment** — payment status and payment method.

### Fulfillment Workflow

1. New order arrives → status is **Pending**.
2. Admin reviews and clicks **Confirm** → status moves to **Confirmed**.
3. Team packs the order → click **Mark as Processing**.
4. Hand over to courier → enter the tracking number, click **Mark as Shipped**.
5. Courier delivers → click **Mark as Delivered**.
6. If the customer cancels or there's an issue → click **Cancel Order**.

Every status change is logged automatically in the Order History timeline with a timestamp.

---

## 5. Customers

A read-only view of every registered customer.

### Customer List

Shows:
- Name and truncated customer ID
- Email and phone
- Date they joined
- Number of orders placed
- Total amount spent (KWD)
- View button for individual profile

### Search

Search by name, phone number, or email address.

### Workflow

1. Go to Customers to look up a specific shopper.
2. Use the search to find them by name, email, or phone.
3. Click View to see their full profile and order history.

> Customer accounts are created on the storefront when shoppers register. There is no "add customer" function from the admin side.

---

## 6. Categories

How products are organised into browsable groups on the storefront. Categories can be nested (a category can have sub-categories).

### Category List

Displayed as a hierarchical tree:
- **Top-level categories** are shown as main rows.
- **Sub-categories** are indented under their parent with an arrow indicator.

Each row shows:
- Category image (or a folder icon if none uploaded)
- Name in English and Arabic
- URL slug
- Active/Inactive status
- "Pinned" badge for categories that appear on the homepage navigation
- Edit button (appears on hover)

### Adding / Editing a Category

Opens in a side panel (no page navigation needed). Fields:

| Field | Description |
|-------|-------------|
| Name (English + Arabic) | Display names for both languages |
| Slug | The URL path for this category page |
| Parent Category | Leave blank for a top-level category; select a parent to make it a sub-category |
| Category Image | Upload an image used on the category landing page and any homepage sections |
| Active | Whether this category is visible on the storefront |
| Pin to Homepage | Whether this category appears in the homepage category section |

### Workflow

1. Open Categories.
2. Click "Add Category" (or edit an existing one).
3. Fill in the name, slug, and choose a parent if it's a sub-category.
4. Upload an image.
5. Toggle Active on.
6. Save — the category is immediately available to assign to products.

---

## 7. Brands

Manufacturers and toy brands associated with products.

### Brand Grid

Brands are displayed as cards showing:
- Brand logo (or a store icon placeholder)
- Name in English and Arabic
- URL slug
- Active/Inactive status
- "Featured" badge if the brand is highlighted

### Adding / Editing a Brand

Opens in a side panel. Fields:

| Field | Description |
|-------|-------------|
| Name (English + Arabic) | Brand display names |
| Slug | URL path for the brand page |
| Logo | Brand logo image |
| Active | Whether the brand is visible on the storefront |
| Featured | Whether the brand is promoted in a featured brands section |

### Workflow

1. Open Brands.
2. Click "Add Brand".
3. Enter name, upload logo, toggle Active.
4. Save.
5. When creating or editing a product, this brand will now appear in the brand dropdown.

---

## 8. Coupons

Discount codes that customers enter at checkout.

### Coupon List

Shows all coupons with:
- Coupon code
- Discount type and value
- Active/Inactive toggle (you can flip it on or off without deleting)
- Usage count vs. usage limit
- Expiry date
- Edit and Delete actions

### Creating / Editing a Coupon

Click "Create Coupon". Fields:

#### Basic Details

| Field | Description |
|-------|-------------|
| Coupon Code | The exact code customers type at checkout (e.g. SUMMER20) |
| Discount Type | **Percentage** (e.g. 20% off) or **Fixed Amount** (e.g. 2.000 KD off) |
| Discount Value | The number that goes with the type chosen |
| Minimum Order Value | Optional — coupon only works if the cart total is at or above this amount |

#### Usage Limits

| Field | Description |
|-------|-------------|
| Maximum Uses | How many times this code can be used across all customers before it stops working |
| Per-Customer Limit | How many times one customer can use the same code |

#### Validity Period

| Field | Description |
|-------|-------------|
| Start Date | When the coupon becomes active |
| Expiry Date | When it stops working |
| Is Active | Manual on/off switch — overrides dates if you want to pause it early |

#### Targeting (Optional)

You can restrict a coupon to specific products or categories:
- **Specific Products** — search and pick individual products; the coupon only applies to those items in the cart.
- **Specific Categories** — search and pick categories; only items from those categories qualify.

Leave both blank for a store-wide coupon.

### Workflow

1. Go to Coupons → click "Create Coupon".
2. Enter a code, choose percentage or fixed, and set the value.
3. Set an expiry date.
4. Optionally add a minimum order value or usage limit.
5. Optionally restrict to specific products or categories.
6. Toggle Active on.
7. Save — the code is live and customers can use it at checkout immediately.
8. To pause a promotion early, toggle the coupon off from the list without deleting it.

---

## 9. Banners

Visual promotional blocks displayed on the storefront. There are four banner types:

| Type | Where it appears |
|------|-----------------|
| **Hero** | Full-width main banner at the top of the homepage |
| **Announcement** | Inline announcement strip |
| **Editorial** | Large editorial / lifestyle image block |
| **Split Promo** | Side-by-side promotional panels |

### Banner List

Shows each banner with:
- Thumbnail preview
- Banner type badge (colour-coded)
- Media type (Image or Video)
- Schedule (dates it's set to run, or "Always on")
- Active/Inactive toggle
- Edit and Delete actions

### Adding / Editing a Banner

Click "Add Banner". Fields:

| Field | Description |
|-------|-------------|
| Title (English + Arabic) | Headline text shown on the banner |
| Subtitle / Body (English + Arabic) | Supporting text |
| Banner Type | Hero / Announcement / Editorial / Split Promo |
| Desktop Image | Image shown on desktop screens |
| Mobile Image | Image shown on mobile screens (can be different crop) |
| Video (Desktop + Mobile) | Optional — replace the image with a looping video |
| CTA Button Label (EN + AR) | Text on the call-to-action button (e.g. "Shop Now") |
| CTA Button Link | Where the button takes the shopper |
| Display Order | Number controlling the stacking order when multiple banners of the same type exist |
| Schedule Start | Date/time when the banner starts showing |
| Schedule End | Date/time when the banner stops showing (leave blank for "always on") |
| Active | Manual toggle — even if within the schedule dates, it won't show if this is off |

### Workflow

1. Click "Add Banner".
2. Choose the banner type.
3. Upload desktop (and optionally mobile) image or video.
4. Enter the title and CTA button text and link.
5. Set a schedule if it's for a limited promotion (e.g. Eid sale runs April 1–10).
6. Toggle Active on.
7. Save — the banner appears on the storefront immediately.
8. After the promotion ends, either let the schedule expire or manually toggle it off.

---

## 10. Marketing — Flash Sale

A dedicated tool for running time-limited flash sales with a countdown timer shown on the storefront.

### Flash Sale Configuration (Left panel)

| Field | Description |
|-------|-------------|
| Flash Sale Title (English) | Headline displayed on the flash sale banner (e.g. "Weekend Flash Sale") |
| Flash Sale Title (Arabic) | Arabic version of the title |
| Start Date & Time | When the flash sale begins |
| End Date & Time | When the countdown hits zero and the sale ends |
| Active | Whether the flash sale section is currently visible on the storefront |

### Flash Sale Products (Right panel)

A table of all products currently participating in the flash sale. Each row shows:
- Product name and SKU
- Original price
- Discount percentage
- Discounted price (calculated automatically)
- Remove button

### Adding Products to the Flash Sale

Click "Add Products" to open a search dialog:
1. Type a product name or SKU.
2. Results appear — tick the ones you want.
3. Enter the discount percentage to apply to all selected products.
4. Confirm — products are added to the table immediately.

You can also set or change the discount on individual products already in the table.

### Workflow

1. Go to Marketing → Flash Sale.
2. Set the title, start date, and end date.
3. Toggle Active on.
4. Click "Add Products" and search for the items going on sale.
5. Set the discount percentage.
6. Save the configuration.
7. The storefront shows the flash sale banner with the countdown timer and the discounted products automatically.
8. When the end time passes, the banner and discounts disappear automatically.
9. To remove a product from the sale early, click the remove button in the product table.

> Individual products can also be flagged for flash sale inclusion directly from their product edit form.

---

## 11. Blog

Create and manage articles, toy guides, store news, and product reviews published on the storefront's blog section.

### Article List

Shows all articles with:
- Thumbnail image
- Title (English) and URL slug
- Category badge
- Status badge (Published / Draft)
- Published date
- Display order number
- Edit button

### Creating / Editing an Article

Click "New Article" or the edit icon. Fields:

| Field | Description |
|-------|-------------|
| Title (English + Arabic) | Article headline |
| Slug | URL path for the article (e.g. /blog/best-toys-for-toddlers) |
| Category | The blog category this article belongs to (e.g. "Toy Guides", "News") |
| Cover Image | Main image displayed at the top of the article and in the blog listing |
| Body Content (English + Arabic) | The full article text — supports rich text formatting |
| Is Published | Toggle to make the article live or keep it as a draft |
| Published Date | The date shown on the article (can be set in the past or future) |
| Display Order | Controls the order articles appear in the blog listing |

### Workflow

1. Click "New Article".
2. Write the title and body in English (and Arabic if needed).
3. Upload a cover image.
4. Assign a category.
5. Keep "Is Published" off while drafting.
6. When ready, toggle "Is Published" on and set the published date.
7. Save — the article appears on the storefront blog.

---

## 12. Reviews

Moderate customer product reviews before they appear publicly on the storefront.

### Review List

Shows all submitted reviews with:
- Star rating (1–5)
- Review text
- Reviewer name and the product they reviewed
- Date submitted
- Current status (Pending / Approved / Rejected)

### Actions on Each Review

| Action | What it does |
|--------|-------------|
| **Approve** | Makes the review visible on the storefront product page |
| **Reject** | Hides the review — the customer is not notified |
| **Reply** | Adds a store response visible below the review on the storefront |

### Workflow

1. Open Reviews — new submissions appear with "Pending" status.
2. Read the review.
3. If it's genuine and appropriate → click Approve.
4. If it violates policies or is spam → click Reject.
5. Optionally type a reply (e.g. thanking the customer or addressing a complaint) → save reply.
6. Approved reviews with replies show the store response on the product page.

---

## 13. Settings

Global configuration for the store. Split into three tabs.

---

### Tab 1 — General (Store Identity)

Controls the brand information used throughout the site, emails, and invoices.

| Field | Description |
|-------|-------------|
| Store Name (English) | The store's display name in English |
| Store Name (Arabic) | Auto-translated from English on save, but editable |
| Tagline (English) | Short brand slogan shown under the logo and in metadata |
| Tagline (Arabic) | Auto-translated from English on save |
| Contact Email | Public support email address |
| Contact Phone | Customer-facing phone number |
| WhatsApp Business Number | Number used for the WhatsApp chat button on the storefront |
| Commercial Registration (CR) Number | **Required for Kuwait** — displayed in the footer for legal compliance |
| Instagram URL | Full link to the store's Instagram profile |
| TikTok URL | Full link to the store's TikTok profile |

> When you save, the Arabic store name and tagline are automatically translated. You can edit them manually if needed.

### Workflow

1. Go to Settings → General tab.
2. Enter the store name, tagline, contact details, and CR number.
3. Add social media links.
4. Click Save — changes take effect site-wide immediately.

---

### Tab 2 — Commerce

Controls delivery pricing and the optional loyalty points programme.

#### Delivery Rates & Rules

| Field | Description |
|-------|-------------|
| Standard Rate (KWD) | Cost of standard delivery |
| Express Rate (KWD) | Cost of express (next-day) delivery |
| Same-Day Rate (KWD) | Cost of same-day delivery |
| Free Delivery Above (KWD) | Order value at which shipping becomes free (e.g. orders above 10.000 KWD) |

#### Loyalty Points Programme

Toggle the programme on or off. When enabled:

| Field | Description |
|-------|-------------|
| Points Earned per 1 KWD Spent | How many points a customer earns for every 1.000 KWD they spend (e.g. 10 points) |
| Redemption Value (KWD per 100 points) | How much 100 points is worth at checkout (e.g. 1.000 KWD) |
| Minimum Points to Redeem | The lowest number of points a customer can use in a single redemption |
| Points Expiry (months) | How long before unused points expire |

### Workflow

1. Go to Settings → Commerce tab.
2. Set your delivery rates.
3. Set the free delivery threshold.
4. Click Save Rates.
5. To enable loyalty, toggle it on, configure the earn and redeem rates, and click Save Loyalty Settings.

---

### Tab 3 — Marketing

Controls two visible bars on the storefront.

#### Announcement Bar

The scrolling message strip that appears at the very top of every storefront page.

| Field | Description |
|-------|-------------|
| Enabled (toggle) | Show or hide the bar across the whole storefront |
| Background Colour | Colour of the bar background (hex picker) |
| Text Colour | Colour of the message text (hex picker) |
| Rotation Speed (seconds) | How many seconds each message stays visible before rotating to the next |
| Messages | A list of messages that rotate in the bar — each has: |
| — Message (English) | The English text (e.g. "Free delivery on orders above 10 KD") |
| — Message (Arabic) | The Arabic translation |
| — Enabled toggle | Show or hide this specific message without deleting it |

You can add as many messages as needed and remove them individually.

#### Trust Bar

A row of short value-proposition badges shown on the homepage (e.g. "Fast Delivery", "Secure Payment", "14 Days Return").

| Field | Description |
|-------|-------------|
| Enabled (toggle) | Show or hide the trust bar on the storefront |
| Items | A list of trust points — each has: |
| — Icon | Choose from: Delivery, Security, Returns, Local, Support |
| — Label (English) | Short text label (e.g. "Fast Delivery") |
| — Label (Arabic) | Arabic version |
| — Enabled toggle | Show or hide this specific item without deleting it |

### Workflow — Announcement Bar

1. Go to Settings → Marketing tab.
2. Toggle the Announcement Bar on.
3. Set your preferred background and text colours.
4. Add messages for current promotions.
5. Each message can be toggled individually — so you can prepare future messages and enable them later without retyping.
6. Click Save Bar.

### Workflow — Trust Bar

1. Toggle the Trust Bar on.
2. Add or edit the trust items with the appropriate icon and labels.
3. Toggle off any items you don't want visible.
4. Click Save Trust Bar.

---

## 14. Modules Coming Soon

These sections exist in the admin menu but are still being built:

| Module | Description when complete |
|--------|--------------------------|
| **Returns & Refunds** | Will allow managing customer return requests, approving refunds, and tracking returned stock |
| **Shipping & Logistics** | Will manage courier integrations, delivery zones, and real-time shipment tracking |
| **Business Analytics** | Will provide revenue charts, best-selling products, customer acquisition trends, and export reports |

---

## Quick Reference — Who Does What

| Task | Go to |
|------|-------|
| Add a new product | Products → Add Product |
| Change a product's price | Products → Edit that product |
| Restock an item | Inventory → find the item → Update |
| Process an order | Orders → click the order → update status |
| Add a tracking number | Orders → click the order → Fulfillment card |
| Create a discount code | Coupons → Create Coupon |
| Run a flash sale | Marketing → Flash Sale → configure + add products |
| Update the top banner | Banners → edit the Hero banner |
| Add a scrolling top message | Settings → Marketing → Announcement Bar |
| Change delivery prices | Settings → Commerce → Delivery Rates |
| Approve a customer review | Reviews → Approve |
| Publish a blog article | Blog → New Article → toggle Published |
| Add a new category | Categories → Add Category |
| Add a new brand | Brands → Add Brand |
| Update store phone/email | Settings → General |
| Update the CR number | Settings → General → CR Number field |
