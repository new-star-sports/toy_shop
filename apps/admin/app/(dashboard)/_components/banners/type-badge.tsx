import { Badge } from "@/components/ui/badge"

const typeConfig = {
  hero: { label: "Hero Slider", variant: "default" as const },
  announcement: { label: "Announcement", variant: "secondary" as const },
  editorial: { label: "Editorial", variant: "outline" as const },
  split_promo: { label: "Split Promo", variant: "outline" as const },
}

export function BannerTypeBadge({ type }: { type: keyof typeof typeConfig }) {
  const config = typeConfig[type] || { label: type, variant: "outline" as const }
  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}
