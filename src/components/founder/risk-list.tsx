import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderRisk } from "@/lib/founder-os";

function riskTone(severity: FounderRisk["severity"]) {
  if (severity === "CRITICAL") return "red";
  if (severity === "HIGH") return "amber";
  return "blue";
}

export function RiskList({ risks }: { risks: FounderRisk[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risks</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {risks.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <Badge tone={riskTone(item.severity)}>{item.severity}</Badge>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{item.risk}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.mitigation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
