import Link from "next/link";
import { getAdminProducts } from "@nss/db/queries";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Badge } from "@nss/ui/components/badge";
import { DeleteProductButton } from "../_components/products/delete-button";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = params.status as any;
  const page = parseInt(params.page || "1");

  const { data: products, count } = await getAdminProducts({
    search: query,
    status,
    page,
    perPage: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Products</h1>
          <p className="text-sm text-nss-text-secondary">
            Manage your store's product catalogue ({count} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <span className="me-2">+</span> Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-nss-card p-4 rounded-xl border border-nss-border">
        <div className="flex-1">
          <Input
            placeholder="Search by name, SKU..."
            defaultValue={query}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft", "archived"].map((s) => (
            <Button
              key={s}
              variant={status === s || (!status && s === "all") ? "default" : "outline"}
              size="sm"
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-nss-card rounded-xl border border-nss-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-start">Product</th>
                <th className="px-6 py-3 font-semibold text-start">SKU</th>
                <th className="px-6 py-3 font-semibold text-start">Price</th>
                <th className="px-6 py-3 font-semibold text-start">Stock</th>
                <th className="px-6 py-3 font-semibold text-start">Status</th>
                <th className="px-6 py-3 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nss-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-nss-text-secondary">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-nss-surface flex items-center justify-center overflow-hidden border border-nss-border">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name_en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-nss-text-secondary italic">No img</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-nss-text-primary line-clamp-1">
                            {product.name_en}
                          </p>
                          <p className="text-xs text-nss-text-secondary line-clamp-1">
                            {product.category?.name_en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {product.price_kwd.toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock_quantity < (product.low_stock_threshold || 5) ? "text-nss-danger font-medium" : ""}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          product.status === "published"
                            ? "default"
                            : product.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/products/${product.id}`}>Edit</Link>
                      </Button>
                      <DeleteProductButton productId={product.id} />
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
