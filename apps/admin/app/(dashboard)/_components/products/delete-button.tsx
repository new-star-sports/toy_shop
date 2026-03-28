"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "../../products/_actions"
import { Trash2 } from "lucide-react"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost" 
      size="sm" 
      loading={isPending}
      className="text-destructive hover:bg-destructive/10 w-full justify-start rounded-lg px-2 gap-2.5"
      onClick={() => {
        if (confirm("Are you sure you want to delete this product?")) {
          startTransition(async () => {
            const result = await deleteProduct(productId)
            if (!result.success) alert("Error: " + result.error)
          })
        }
      }}
    >
      {!isPending && <Trash2 size={16} strokeWidth={2} />}
      <span className="font-semibold">Delete Product</span>
    </Button>
  )
}
