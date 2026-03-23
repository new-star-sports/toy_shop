"use client"

import { Button } from "@nss/ui/components/button"
import { deleteProduct } from "../../products/_actions"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  return (
    <Button
      variant="ghost" 
      size="sm" 
      className="text-nss-danger hover:bg-nss-danger/10"
      onClick={async () => {
        if (confirm("Are you sure you want to delete this product?")) {
          const result = await deleteProduct(productId)
          if (!result.success) alert("Error: " + result.error)
        }
      }}
    >
      Delete
    </Button>
  )
}
