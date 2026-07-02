import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderRadarItem } from "@/lib/founder-os";

export function EnterpriseRadar({ radar }: { radar: FounderRadarItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enterprise Radar</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {radar.map((item) => (
          <div key={item.area} className="grid gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-[150px_150px_minmax(0,1fr)] sm:items-center">
            <p className="text-sm font-semibold">{item.area}</p>
            <p className="text-xs font-semibold uppercase text-primary">{item.status}</p>
            <p className="text-xs leading-5 text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
