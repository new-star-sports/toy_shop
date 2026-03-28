import { Card, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui"

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

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40">
              <TableHead className="px-6 py-4 h-12 w-1/5 bg-muted/20" />
              <TableHead className="px-6 py-4 h-12 w-1/5 bg-muted/20" />
              <TableHead className="px-6 py-4 h-12 w-1/5 bg-muted/20" />
              <TableHead className="px-6 py-4 h-12 w-1/5 bg-muted/20" />
              <TableHead className="px-6 py-4 h-12 w-1/5 bg-muted/20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-border/20">
                <TableCell className="px-6 py-6"><div className="h-5 w-full bg-muted/30 rounded" /></TableCell>
                <TableCell className="px-6 py-6"><div className="h-5 w-full bg-muted/30 rounded" /></TableCell>
                <TableCell className="px-6 py-6"><div className="h-5 w-full bg-muted/30 rounded" /></TableCell>
                <TableCell className="px-6 py-6"><div className="h-5 w-full bg-muted/30 rounded" /></TableCell>
                <TableCell className="px-6 py-6"><div className="h-5 w-full bg-muted/30 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
