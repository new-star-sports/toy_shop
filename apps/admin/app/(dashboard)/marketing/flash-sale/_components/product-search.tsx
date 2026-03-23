"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@nss/ui/components/dialog"
import { Button } from "@nss/ui/components/button"
import { Input } from "@nss/ui/components/input"
import { searchProducts, addProductsToFlashSale } from "../_actions"
import { toast } from "sonner"
import { Plus, Search, Loader2 } from "lucide-react"

export function ProductSearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [discount, setDiscount] = useState(10)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSearch = async () => {
    setLoading(true)
    const result = await searchProducts(query)
    if (result.success) {
      setResults(result.data || [])
    }
    setLoading(false)
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    
    setLoading(true)
    const result = await addProductsToFlashSale(selectedIds, discount)
    if (result.success) {
      toast.success(`${selectedIds.length} products added to flash sale`)
      setOpen(false)
      setSelectedIds([])
      window.location.reload() // Simple way to refresh the parent table
    } else {
      toast.error("Failed to add products")
    }
    setLoading(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Products
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Products to Flash Sale</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nss-text-secondary" size={18} />
              <Input
                placeholder="Search by name or SKU..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Default Discount:</span>
              <Input
                type="number"
                className="w-20"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value))}
              />
              <span className="text-sm">%</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-nss-border rounded-lg divide-y divide-nss-border">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-nss-primary" size={24} />
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center text-nss-text-secondary">
                {query.length < 2 ? "Type at least 2 characters to search..." : "No products found."}
              </div>
            ) : (
              results.map((product) => (
                <div 
                  key={product.id} 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-nss-surface transition-colors ${selectedIds.includes(product.id) ? 'bg-nss-primary/5' : ''}`}
                  onClick={() => toggleSelect(product.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name_en}</span>
                    <span className="text-xs text-nss-text-secondary uppercase">{product.sku}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm">{product.price_kwd.toFixed(3)} KD</span>
                    <div className={`w-5 h-5 rounded border ${selectedIds.includes(product.id) ? 'bg-nss-primary border-nss-primary' : 'border-nss-border'}`}>
                      {selectedIds.includes(product.id) && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-nss-text-secondary">
              {selectedIds.length} products selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={selectedIds.length === 0 || loading}>
                Add to Flash Sale
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
