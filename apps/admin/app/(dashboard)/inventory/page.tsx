import Link from "next/link";
import { getAdminProducts } from "@nss/db/queries";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Badge } from "@nss/ui/components/badge";
import { Card, CardContent } from "@nss/ui";
import { StockUpdateForm } from "../_components/inventory/stock-update-form";
import { IconSearch, IconAlertTriangle } from "@tabler/icons-react";
import { cn } from "@nss/ui/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
  type: "product" | "variant";
  category: string;
  image?: string;
  parentId?: string;
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; low_stock?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const lowStockOnly = params.low_stock === "true";

  const { data: products } = await getAdminProducts({
    search: query,
    perPage: 100,
  });

  const inventoryItems: InventoryItem[] = products.flatMap((p) => {
    const baseItem: InventoryItem = {
      id: p.id,
      name: p.name_en,
      sku: p.sku,
      stock: p.stock_quantity,
      threshold: p.low_stock_threshold || 5,
      type: "product",
      category: p.category?.name_en || "Uncategorized",
      image: p.images?.[0]?.url,
    };
    if (p.variants && p.variants.length > 0) {
      return p.variants.map((v) => ({
        id: v.id,
        name: `${p.name_en} — ${v.name_en}`,
        sku: v.sku,
        stock: v.stock_quantity,
        threshold: p.low_stock_threshold || 5,
        type: "variant" as const,
        parentId: p.id,
        category: p.category?.name_en || "Uncategorized",
        image: p.images?.[0]?.url,
      }));
    }
    return [baseItem];
  });

  const filteredItems = inventoryItems.filter((item) => {
    if (lowStockOnly && item.stock >= item.threshold) return false;
    return true;
  });

  const lowCount = inventoryItems.filter(i => i.stock < i.threshold).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and manage stock levels ({inventoryItems.length} items · {lowCount} low stock)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Search by name, SKU..."
              defaultValue={query}
              className="pl-10 rounded-xl h-10 w-full"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant={lowStockOnly ? "default" : "outline"} size="sm" asChild className="rounded-xl h-9 text-xs font-bold">
              <Link href={`/inventory${lowStockOnly ? "" : "?low_stock=true"}`}>
                <IconAlertTriangle size={14} className="mr-1.5" stroke={2} />
                {lowStockOnly ? "Showing Low Stock" : "Low Stock Only"}
              </Link>
            </Button>
            {lowStockOnly && (
              <Button variant="ghost" size="sm" asChild className="rounded-xl h-9 text-xs">
                <Link href="/inventory">Clear</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block rounded-2xl border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Item</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">SKU</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Category</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Status</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Stock</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-end">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground italic text-sm">
                    No items found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-border/30 flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate" title={item.name}>{item.name}</p>
                          <p className="text-[10px] uppercase text-muted-foreground font-mono">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase text-muted-foreground">{item.sku}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{item.category}</td>
                    <td className="px-6 py-4">
                      {item.stock <= 0 ? (
                        <Badge variant="destructive" className="text-[10px] font-bold">Out of Stock</Badge>
                      ) : item.stock < item.threshold ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">Low Stock</Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px] font-bold">Healthy</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-base font-mono font-bold", item.stock < item.threshold ? "text-destructive" : "text-foreground")}>
                        {item.stock}
                      </span>
                      <span className="text-xs text-muted-foreground ms-1">/ {item.threshold}</span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <StockUpdateForm id={item.id} type={item.type} currentStock={item.stock} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground italic text-sm rounded-2xl border border-dashed border-border/60">
            No items found.
          </div>
        ) : filteredItems.map((item) => (
          <Card key={item.id} className="rounded-2xl border-border/40 overflow-hidden bg-card">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-border/30 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">N/A</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight truncate">{item.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{item.sku}</p>
                </div>
                {item.stock <= 0 ? (
                  <Badge variant="destructive" className="text-[10px] font-bold shrink-0">Out</Badge>
                ) : item.stock < item.threshold ? (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">Low</Badge>
                ) : (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px] font-bold shrink-0">OK</Badge>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div>
                  <span className={cn("text-lg font-mono font-bold", item.stock < item.threshold ? "text-destructive" : "text-foreground")}>
                    {item.stock}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ {item.threshold} threshold</span>
                </div>
                <StockUpdateForm id={item.id} type={item.type} currentStock={item.stock} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
