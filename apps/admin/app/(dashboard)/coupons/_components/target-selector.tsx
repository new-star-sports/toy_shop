"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Loader2, X, Check } from "lucide-react"
import { searchProducts, searchCategories } from "../_actions"

interface TargetSelectorProps {
  type: "product" | "category"
  selectedIds: string[]
  onSelect: (ids: string[]) => void
}

export function TargetSelector({ type, selectedIds, onSelect }: TargetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Local state for pending selection
  const [pendingIds, setPendingIds] = useState<string[]>(selectedIds)

  useEffect(() => {
    if (open) setPendingIds(selectedIds)
  }, [open, selectedIds])

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
    const result = type === "product" ? await searchProducts(query) : await searchCategories(query)
    if (result.success) {
      setResults(result.data || [])
    }
    setLoading(false)
  }

  const toggleSelect = (id: string) => {
    setPendingIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleApply = () => {
    onSelect(pendingIds)
    setOpen(false)
    setQuery("")
    setResults([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 rounded-lg border border-nss-border bg-nss-surface">
        {selectedIds.length === 0 ? (
          <span className="text-sm text-nss-text-secondary px-2 py-1">No items selected. Coupon will apply to all.</span>
        ) : (
          selectedIds.map(id => (
            <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
              <span className="max-w-[150px] truncate">{id}</span>
              <button 
                type="button"
                onClick={() => onSelect(selectedIds.filter(i => i !== id))}
                className="hover:text-nss-danger"
              >
                <X size={14} />
              </button>
            </Badge>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-dashed">
            <Plus size={16} className="mr-2" /> Add {type === "product" ? "Products" : "Categories"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select {type === "product" ? "Products" : "Categories"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nss-text-secondary" size={18} />
              <Input
                placeholder={`Search ${type}s...`}
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="max-h-80 overflow-y-auto border border-nss-border rounded-lg divide-y divide-nss-border">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-nss-primary" size={24} />
                </div>
              ) : results.length === 0 ? (
                <div className="py-10 text-center text-nss-text-secondary">
                  {query.length < 2 ? "Type at least 2 characters to search..." : "No results found."}
                </div>
              ) : (
                results.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-nss-surface transition-colors ${pendingIds.includes(item.id) ? 'bg-nss-primary/5' : ''}`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.name_en}</span>
                      <span className="text-[10px] text-nss-text-secondary uppercase">{item.sku || item.slug}</span>
                    </div>
                    {pendingIds.includes(item.id) && (
                      <div className="w-6 h-6 rounded-full bg-nss-primary flex items-center justify-center text-white">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">
                {pendingIds.length} items selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleApply}>
                  Apply Selection
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
