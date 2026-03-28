import { Card, CardContent } from "@/components/ui";
import { IconChartBar } from "@tabler/icons-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <IconChartBar size={28} className="text-primary" />
        <h1 className="text-2xl font-bold">Business Analytics</h1>
      </div>
      <Card className="rounded-2xl border-border/50 bg-muted/5">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <IconChartBar size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-sm">
            We are currently building the analytics and reporting dashboard. 
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
