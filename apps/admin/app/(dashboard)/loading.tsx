import { Card, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@nss/ui"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-[200] overflow-hidden">
        <div className="h-full bg-primary w-1/3 animate-[progress_2s_ease-in-out_infinite]" style={{
          boxShadow: "0 0 10px var(--color-primary)",
          width: "30%",
          animation: "loading-bar 2s infinite linear"
        }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 10%; }
          50% { transform: translateX(100%); width: 30%; }
          100% { transform: translateX(400%); width: 10%; }
        }
      `}} />

      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted/50 rounded-lg" />
            <div className="h-4 w-64 bg-muted/30 rounded-md" />
          </div>
          <div className="h-10 w-32 bg-muted/50 rounded-full" />
        </div>

        <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden p-4 flex gap-4">
          <div className="h-10 flex-1 bg-muted/30 rounded-xl" />
          <div className="h-10 w-64 bg-muted/30 rounded-xl" />
        </Card>

        <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/40">
                <TableHead className="px-6 py-4 h-12 w-1/4 bg-muted/20" />
                <TableHead className="px-6 py-4 h-12 w-1/4 bg-muted/20" />
                <TableHead className="px-6 py-4 h-12 w-1/4 bg-muted/20" />
                <TableHead className="px-6 py-4 h-12 w-1/4 bg-muted/20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-border/20">
                  <TableCell className="px-6 py-8"><div className="h-6 w-full bg-muted/30 rounded" /></TableCell>
                  <TableCell className="px-6 py-8"><div className="h-6 w-full bg-muted/30 rounded" /></TableCell>
                  <TableCell className="px-6 py-8"><div className="h-6 w-full bg-muted/30 rounded" /></TableCell>
                  <TableCell className="px-6 py-8"><div className="h-6 w-full bg-muted/30 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
