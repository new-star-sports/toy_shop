"use client"

import { Button } from "@/components/ui/button"
import { deleteBanner } from "../../banners/_actions"
import { toast } from "sonner"

interface DeleteBannerButtonProps {
  id: string
}

export function DeleteBannerButton({ id }: DeleteBannerButtonProps) {
  return (
    <Button
      variant="ghost" 
      size="sm" 
      className="text-nss-danger hover:bg-nss-danger/10"
      onClick={async () => {
        if (confirm("Are you sure you want to delete this banner?")) {
          const result = await deleteBanner(id)
          if (result.success) {
            toast.success("Banner deleted")
          } else {
            toast.error("Error: " + result.error)
          }
        }
      }}
    >
      Delete
    </Button>
  )
}
