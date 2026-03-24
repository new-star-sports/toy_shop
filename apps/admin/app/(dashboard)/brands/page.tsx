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
  const brands = await getBrands()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage toy manufacturers and brands</p>
        </div>
        <BrandSheetForm mode="create" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.length === 0 ? (
          <div className="col-span-full p-20 text-center text-muted-foreground italic rounded-2xl border border-dashed border-border/60 bg-muted/5">
            No brands found. Add your first brand to get started.
          </div>
        ) : (
          brands.map((brand) => (
            <Card key={brand.id} className="group rounded-2xl border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-16 w-16 rounded-xl border border-border/40 bg-muted/30 flex items-center justify-center overflow-hidden">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name_en} className="w-full h-full object-contain p-2" />
                    ) : (
                      <IconBuildingStore size={28} className="text-muted-foreground/40" stroke={1.5} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <BrandSheetForm 
                      mode="edit" 
                      brand={brand} 
                      trigger={
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconPencil size={18} stroke={1.5} />
                        </Button>
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-foreground leading-tight">{brand.name_en}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">{brand.name_ar}</p>
                    <code className="text-[10px] font-mono font-bold bg-muted/60 px-2 py-0.5 rounded-md text-muted-foreground">
                      /{brand.slug}
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/30">
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
          ))
        )}
      </div>
    </div>
  )
}
