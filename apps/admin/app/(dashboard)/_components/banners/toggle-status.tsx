"use client"

import { useState } from "react"
import { Switch } from "@nss/ui/components/switch"
import { toggleBannerActive } from "../../banners/_actions"
import { toast } from "sonner"

interface ToggleBannerStatusProps {
  id: string
  isActive: boolean
}

export function ToggleBannerStatus({ id, isActive }: ToggleBannerStatusProps) {
  const [active, setActive] = useState(isActive)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setLoading(true)
    const result = await toggleBannerActive(id, checked)
    if (result.success) {
      setActive(checked)
      toast.success(checked ? "Banner activated" : "Banner deactivated")
    } else {
      toast.error("Failed to update banner status")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={active} 
        onCheckedChange={handleToggle} 
        disabled={loading}
      />
      <span className="text-xs text-nss-text-secondary w-12">
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  )
}
