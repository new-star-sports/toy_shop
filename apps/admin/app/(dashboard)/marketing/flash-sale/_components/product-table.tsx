"use client"

import { useState } from "react"
import { Button } from "@nss/ui/components/button"
import { Input } from "@nss/ui/components/input"
import { toggleProductFlashSale } from "../_actions"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface FlashSaleProductTableProps {
  products: any[]
}

export function FlashSaleProductTable({ products: initialProducts }: FlashSaleProductTableProps) {
  const [products, setProducts] = useState(initialProducts)

  const handleRemove = async (productId: string) => {
    if (confirm("Remove this product from flash sale?")) {
      const result = await toggleProductFlashSale(productId, false)
      if (result.success) {
        setProducts(products.filter(p => p.id !== productId))
        toast.success("Product removed from flash sale")
      } else {
        toast.error("Failed to remove product")
      }
    }
  }

  const handleDiscountChange = async (productId: string, discount: number) => {
    const result = await toggleProductFlashSale(productId, true, discount)
    if (result.success) {
      setProducts(products.map(p => p.id === productId ? { ...p, flash_sale_discount_percent: discount } : p))
      toast.success("Discount updated")
    } else {
      toast.error("Failed to update discount")
    }
  }

  return (
    <div className="bg-nss-card border border-nss-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-nss-border flex items-center justify-between bg-nss-surface">
        <h3 className="font-semibold text-nss-text-primary">Participating Products</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
            <tr>
              <th className="px-6 py-3 font-semibold text-start">Product</th>
              <th className="px-6 py-3 font-semibold text-start">Original Price</th>
              <th className="px-6 py-3 font-semibold text-start">Discount (%)</th>
              <th className="px-6 py-3 font-semibold text-start">Sale Price</th>
              <th className="px-6 py-3 font-semibold text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nss-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-nss-text-secondary">
                  No products currently in flash sale.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const salePrice = product.price_kwd * (1 - (product.flash_sale_discount_percent || 0) / 100);
                return (
                  <tr key={product.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-nss-text-primary">{product.name_en}</span>
                        <span className="text-xs text-nss-text-secondary uppercase">{product.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {product.price_kwd.toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-20 h-8"
                          defaultValue={product.flash_sale_discount_percent}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val !== product.flash_sale_discount_percent) {
                              handleDiscountChange(product.id, val);
                            }
                          }}
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-nss-accent">
                      {salePrice.toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-nss-danger hover:bg-nss-danger/10"
                        onClick={() => handleRemove(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
