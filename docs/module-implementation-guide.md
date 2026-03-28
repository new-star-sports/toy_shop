# Module Implementation Guide
> Reference document based on the **Product module** — use this pattern for all other modules (Categories, Brands, Coupons, Banners, Blog, Orders, etc.)

---

## 1. Architecture Overview

```
User fills form
  → Zod client-side validation (react-hook-form)
  → onSubmit()
  → Auto-translate Arabic fields (translateToArabic)
  → Server Action (createXxx / updateXxx)
  → Supabase DB insert/update
  → toast.success / toast.error
  → router.push() to list page
```

**File structure for a module:**
```
app/(dashboard)/
  products/
    page.tsx                  ← List page (server component)
    [id]/
      page.tsx                ← Edit page (fetches initialData, renders form)
    new/
      page.tsx                ← Create page (renders form with no initialData)
    _actions.ts               ← Server actions: create, update, delete
  _components/
    products/
      product-form.tsx        ← Multi-step form (client component)
      delete-button.tsx       ← Delete button with confirmation + toast
```

---

## 2. Server Actions Pattern (`_actions.ts`)

Every module has three server actions in `_actions.ts`:

```ts
"use server"
import { createServiceClient } from "@nss/db/client"
import { revalidatePath } from "next/cache"

// CREATE
export async function createProduct(data: Product, images?: string[]) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("products").insert({ ...sanitize(data) })
  if (error) return { success: false, error: error.message }
  revalidatePath("/products")
  return { success: true }
}

// UPDATE
export async function updateProduct(id: string, data: Product, images?: string[]) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("products").update({ ...sanitize(data) }).eq("id", id)
  if (error) return { success: false, error: error.message }
  // Sync related rows (e.g. images): delete old → insert new
  if (images !== undefined) {
    await supabase.from("product_images").delete().eq("product_id", id)
    if (images.length > 0) {
      await supabase.from("product_images").insert(images.map((url, i) => ({ product_id: id, url, display_order: i })))
    }
  }
  revalidatePath("/products")
  revalidatePath(`/products/${id}`)
  return { success: true }
}

// DELETE
export async function deleteProduct(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/products")
  return { success: true }
}
```

**Key rules:**
- Always use `createServiceClient()` (bypasses RLS, safe for admin).
- Always return `{ success: boolean, error?: string }` — never throw.
- Always call `revalidatePath()` after mutations.
- Sanitize numeric fields: replace `NaN` / `undefined` with `null` (for nullable DB columns) or `0` (for required numerics).

---

## 3. Zod Schema Extension Pattern

The base validator in `@nss/validators` is strict. The admin form needs relaxed validation (optional fields, Arabic auto-translated).

**Pattern:** Extend the base schema locally in `product-form.tsx`:

```ts
import { productSchema } from "@nss/validators/product"

const productFormSchema = productSchema.extend({
  // Fields auto-translated — not in the UI, relax to optional
  name_ar: z.string().optional(),
  description_ar: z.string().optional(),
  // SEO fields are optional in the form
  seo_title_en: z.string().optional(),
  seo_description_en: z.string().optional(),
  // Numeric fields may be empty → allow undefined
  compare_at_price_kwd: z.number().optional(),
  cost_price_kwd: z.number().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>
```

**Never modify the base `@nss/validators` schema** — it's shared with the storefront.

---

## 4. Multi-Step Form Pattern

Large forms are split into steps to avoid overwhelming the user. Each step validates only its own fields before advancing.

```ts
const steps = [
  { title: "Details",  fields: ["name_en", "slug", "status", "description_en"] },
  { title: "Pricing",  fields: ["price_kwd", "tax_status", "cost_price_kwd"] },
  { title: "Stock",    fields: ["sku", "stock_quantity", "track_inventory"] },
  { title: "Safety",   fields: ["min_age", "weight_grams", "country_of_origin"] },
  { title: "Advanced", fields: ["seo_title_en", "hs_code_6"] },
]

const nextStep = async () => {
  const isValid = await form.trigger(steps[currentStep].fields as any[])
  if (isValid) {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  // else: react-hook-form shows inline field errors automatically
}
```

**Submit buttons exist in two places:**
- **Sticky header** (top-right): always visible regardless of scroll position.
- **Footer navigation**: at the bottom of the form, only on the last step.

Both call `form.handleSubmit(onSubmit, handleValidationError)`.

---

## 5. Validation Error Navigation

When the user clicks submit from step 5 but a required field on step 1 is empty, this handler auto-navigates:

```ts
const handleValidationError = (errors: Record<string, any>) => {
  const errorFields = Object.keys(errors)
  for (let i = 0; i < steps.length; i++) {
    const firstError = errorFields.find(f => steps[i].fields.includes(f))
    if (firstError) {
      setCurrentStep(i)                          // navigate to the step
      setTimeout(() => {
        const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement
        el?.focus()
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 150)                                   // wait for step to render
      toast.error(`Required field missing: ${humanize(firstError)}`)
      return
    }
  }
}
```

Pass as the second argument to `handleSubmit`:
```tsx
onClick={form.handleSubmit(onSubmit, handleValidationError)}
```

---

## 6. Arabic Auto-Translation

Arabic fields are never shown in the form — they are automatically translated in `onSubmit` before calling the server action.

```ts
const translatedData = {
  ...data,
  name_ar: await translateToArabic(data.name_en),
  description_ar: await translateToArabic(data.description_en),
  // For optional fields: fallback to the English value or empty string
  short_description_ar: data.short_description_en
    ? await translateToArabic(data.short_description_en)
    : "",
}
```

`translateToArabic` (in `app/(dashboard)/_lib/translate.ts`) uses the MyMemory API and **never throws** — it returns the original English text on failure, so the form always succeeds.

---

## 7. Image Upload Pattern

Images are uploaded to Supabase Storage immediately when the user selects files (not on form submit).

```ts
const [images, setImages] = useState<string[]>(
  initialData?.images?.map(img => img.url) ?? []
)

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files?.length) return
  setIsUploadingImages(true)
  const results = await Promise.allSettled(Array.from(files).map(file => uploadFile(file, "products")))
  results.forEach(r => {
    if (r.status === "fulfilled") setImages(prev => [...prev, r.value.url])
    else toast.error(`Upload failed: ${r.reason?.message}`)
  })
  setIsUploadingImages(false)
}
```

The `images` string array (URLs) is passed directly to `createProduct` / `updateProduct` as a separate argument. The action syncs the `product_images` table.

**Important:** The upload `+` slot is disabled (`pointer-events-none opacity-40`) while `isUploadingImages` is true.

---

## 8. Form Default Values (Edit Mode)

Pre-populate all fields from `initialData` so the edit form shows existing values:

```ts
const form = useForm<ProductFormValues>({
  resolver: zodResolver(productFormSchema),
  defaultValues: {
    // Required fields
    name_en: initialData?.name_en || "",
    slug: initialData?.slug || "",
    status: initialData?.status ?? "draft",
    price_kwd: initialData?.price_kwd ?? undefined,
    // Optional / nullable fields
    compare_at_price_kwd: initialData?.compare_at_price_kwd ?? undefined,
    description_en: initialData?.description_en || "",
    // ... all other fields
  },
})
```

The edit page fetches `initialData` in a server component and passes it to the form:
```tsx
// app/(dashboard)/products/[id]/page.tsx
const product = await getAdminProductById(id)  // server fetch
return <ProductForm initialData={product} categories={cats} brands={brands} />
```

---

## 9. Delete Button Pattern

```tsx
"use client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DeleteXxxButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      loading={isPending}
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        if (confirm("Are you sure?")) {
          startTransition(async () => {
            const result = await deleteXxx(id)
            if (result.success) {
              toast.success("Deleted successfully!")
              router.refresh()
            } else {
              toast.error("Error: " + result.error)
            }
          })
        }
      }}
    >
      Delete
    </Button>
  )
}
```

---

## 10. Toast Notifications

The `<Toaster>` is registered once in `app/layout.tsx`:
```tsx
<Toaster position="top-center" richColors expand closeButton />
```

Use consistently throughout all modules:
```ts
toast.success("Product created successfully!")
toast.success("Product updated successfully!")
toast.success("Product deleted successfully!")
toast.error("Error creating product: " + result.error)
```

---

## 11. Button Visibility Rule

**Never use `bg-primary` (CSS-variable-based) for prominent action buttons** — it fails to render in certain contexts (sticky headers, card bodies) and shows as white-on-white invisible text.

**Use instead:**
- Primary actions: `bg-emerald-500 hover:bg-emerald-600` (green — create/update/launch)
- Navigation: `bg-foreground text-background` (dark — Continue / Next Step)
- Danger: `bg-destructive text-white` (red — delete)
- Ghost: `variant="ghost"` (transparent — secondary actions like Discard & Exit)

---

## 12. HTTP 431 Fix (Server Actions)

**Problem:** Next.js server actions send router state in request headers (`Next-Router-State-Tree`). After navigating many pages, this header grows and hits Node.js's default 8KB limit → HTTP 431.

**Fix applied to `apps/admin`:**

1. `package.json` dev script:
```json
"dev": "node --max-http-header-size=65536 ./node_modules/next/dist/bin/next dev --turbo -p 3002"
```

2. `next.config.ts`:
```ts
experimental: {
  serverActions: {
    bodySizeLimit: "10mb",
  },
}
```

Apply the same fix to any other admin-like app in the monorepo that uses server actions with large payloads.

---

## 13. Checklist for a New Module

- [ ] Create `_actions.ts` with `createXxx`, `updateXxx`, `deleteXxx` — all return `{ success, error }`
- [ ] Create list `page.tsx` (server component, fetch + render table)
- [ ] Create `[id]/page.tsx` (server component, fetch `initialData`, render form)
- [ ] Create `new/page.tsx` (render form with no `initialData`)
- [ ] Create `xxx-form.tsx` (client component, multi-step or single-step)
  - [ ] Local Zod schema extension (relax optional/Arabic fields)
  - [ ] `defaultValues` covers all fields
  - [ ] `onSubmit` → translate Arabic → call server action → toast + navigate
  - [ ] `handleValidationError` → navigate to failing step
  - [ ] Both header and footer submit buttons wired to `handleSubmit(onSubmit, handleValidationError)`
- [ ] Create `delete-button.tsx` with `useTransition` + `toast.success` + `router.refresh()`
- [ ] `<Toaster>` already in root layout — no changes needed
