import { Suspense } from "react"
import { getBrands } from "@nss/db/queries"
import {
  Button,
  Card,
  Badge,
} from "@nss/ui"
import {
  IconPencil,
  IconBuildingStore,
  IconStar,
} from "@tabler/icons-react"
import { BrandSheetForm } from "../_components/brands/brand-sheet-form"
import { cn } from "@nss/ui/lib/utils"

export default async function BrandsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage toy manufacturers and brands</p>
        </div>
        <div className="w-full sm:w-auto">
          <BrandSheetForm mode="create" />
        </div>
      </div>

      <Suspense fallback={<BrandsSkeleton />}>
        <BrandList />
      </Suspense>
    </div>
  )
}

async function BrandList() {
  const brands = await getBrands()

  if (brands.length === 0) {
    return (
      <div className="p-16 sm:p-20 text-center text-muted-foreground italic rounded-2xl border border-dashed border-border/60 bg-muted/5 text-sm">
        No brands found. Add your first brand to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {brands.map((brand) => (
        <Card key={brand.id} className="group rounded-2xl border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-border/40 bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name_en} className="w-full h-full object-contain p-2" />
                ) : (
                  <IconBuildingStore size={26} className="text-muted-foreground/40" stroke={1.5} />
                )}
              </div>
              <BrandSheetForm
                mode="edit"
                brand={brand}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconPencil size={18} stroke={1.5} />
                  </Button>
                }
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-base sm:text-lg text-foreground leading-tight">{brand.name_en}</h3>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{brand.name_ar}</p>
                <code className="text-[10px] font-mono font-bold bg-muted/60 px-2 py-0.5 rounded-md text-muted-foreground">
                  /{brand.slug}
                </code>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className={cn("h-1.5 w-1.5 rounded-full", brand.is_active ? "bg-success" : "bg-muted-foreground/40")} />
                <span className={cn("text-xs font-medium", brand.is_active ? "text-foreground" : "text-muted-foreground")}>
                  {brand.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {brand.is_featured && (
                <Badge variant="secondary" className="rounded-full text-[9px] px-2 py-0 h-4 bg-accent/10 border-accent/20 text-accent font-semibold ml-auto flex items-center gap-1">
                  <IconStar size={10} fill="currentColor" stroke={1.5} />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function BrandsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-48 rounded-2xl border-border/50 bg-muted/20" />
      ))}
    </div>
  )
}
