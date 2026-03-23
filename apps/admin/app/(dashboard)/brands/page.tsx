import { getBrands } from "@nss/db/queries"
import { Button } from "@nss/ui/components/button"
import { Card } from "@nss/ui/components/card"
import { Plus, Pencil, Star, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { Badge } from "@nss/ui/components/badge"

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Brands</h1>
          <p className="text-sm text-nss-text-secondary">Manage toy manufacturers and brands</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/brands/new">
            <Plus size={16} />
            Add Brand
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.length === 0 ? (
          <div className="col-span-full p-20 text-center text-nss-text-secondary card bg-nss-surface">
            No brands found. Add your first brand to get started.
          </div>
        ) : (
          brands.map((brand) => (
            <Card key={brand.id} className="p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded border border-nss-border bg-nss-surface flex items-center justify-center overflow-hidden">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name_en} className="w-full h-full object-contain p-2" />
                  ) : (
                    <LayoutGrid size={24} className="text-nss-border" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/brands/${brand.id}`}>
                      <Pencil size={14} />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-nss-text-primary">{brand.name_en}</h3>
                <p className="text-sm text-nss-text-secondary">{brand.name_ar}</p>
                <p className="text-xs text-nss-text-secondary mt-1 font-mono">/{brand.slug}</p>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-nss-border">
                <Badge variant={brand.is_active ? "default" : "outline"}>
                  {brand.is_active ? "Active" : "Inactive"}
                </Badge>
                {brand.is_featured && (
                  <Badge variant="outline" className="gap-1 bg-nss-gold/10 border-nss-gold/20 text-nss-gold hover:text-nss-gold">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </Badge>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
