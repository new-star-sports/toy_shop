import Link from "next/link";
import { getAdminProducts } from "@nss/db/queries";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Badge } from "@nss/ui/components/badge";
import { StockUpdateForm } from "../_components/inventory/stock-update-form";

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

  // Flatten products and variants for a unified inventory view
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
        type: "variant",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Inventory</h1>
          <p className="text-sm text-nss-text-secondary">
            Monitor and manage stock levels across all products and variants.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-nss-card p-4 rounded-xl border border-nss-border items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by name, SKU..."
            defaultValue={query}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={lowStockOnly ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/inventory${lowStockOnly ? "" : "?low_stock=true"}`}>
              {lowStockOnly ? "Showing Low Stock" : "Show Low Stock Only"}
            </Link>
          </Button>
          {lowStockOnly && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inventory">Clear Filter</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-nss-card rounded-xl border border-nss-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-start">Item</th>
                <th className="px-6 py-3 font-semibold text-start">SKU</th>
                <th className="px-6 py-3 font-semibold text-start">Category</th>
                <th className="px-6 py-3 font-semibold text-start">Status</th>
                <th className="px-6 py-3 font-semibold text-start">Current Stock</th>
                <th className="px-6 py-3 font-semibold text-end">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nss-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-nss-text-secondary">
                    No items found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-nss-surface flex items-center justify-center overflow-hidden border border-nss-border flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-nss-text-secondary">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-nss-text-primary truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[10px] uppercase text-nss-text-secondary font-mono">
                            {item.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase text-nss-text-secondary">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 text-nss-text-secondary">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      {item.stock <= 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : item.stock < item.threshold ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-nss-success border-nss-success/30 bg-nss-success/5">
                          Healthy
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-base font-mono font-semibold ${item.stock < item.threshold ? "text-nss-danger" : "text-nss-text-primary"}`}>
                        {item.stock}
                      </span>
                      <span className="text-xs text-nss-text-secondary ms-1">
                        / {item.threshold}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <StockUpdateForm 
                        id={item.id} 
                        type={item.type} 
                        currentStock={item.stock} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
