import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderDailyWin } from "@/lib/founder-os";

export function DailyWin({ win }: { win: FounderDailyWin }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-800">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Daily Win</p>
            <CardTitle className="text-lg">{win.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge tone="blue">{win.mission}</Badge>
        <p className="text-sm leading-6 text-muted-foreground">{win.outcome}</p>
      </CardContent>
    </Card>
  );
}
