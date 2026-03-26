import { Card } from "@nss/ui"

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/50 rounded-lg" />
          <div className="h-4 w-64 bg-muted/30 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-muted/50 rounded-full" />
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden p-4 flex gap-3">
        <div className="h-8 w-20 bg-muted/30 rounded-xl" />
        <div className="h-8 w-20 bg-muted/30 rounded-xl" />
        <div className="h-8 w-20 bg-muted/30 rounded-xl" />
        <div className="h-8 w-20 bg-muted/30 rounded-xl" />
      </Card>

      <Card className="hidden md:block rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="w-16 h-10 bg-muted/30 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted/30 rounded" />
                <div className="h-3 w-32 bg-muted/20 rounded" />
              </div>
              <div className="h-6 w-16 bg-muted/30 rounded-full" />
              <div className="h-8 w-8 bg-muted/20 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
