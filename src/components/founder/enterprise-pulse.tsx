import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderPulseIndicator } from "@/lib/founder-os";

const toneStyles: Record<FounderPulseIndicator["tone"], string> = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-900",
  steady: "border-blue-200 bg-blue-50 text-blue-900",
  watch: "border-amber-200 bg-amber-50 text-amber-950",
  risk: "border-red-200 bg-red-50 text-red-900"
};

export function EnterprisePulse({ pulse }: { pulse: FounderPulseIndicator[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enterprise Pulse</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {pulse.map((item) => (
          <div key={item.label} className={`rounded-lg border p-3 ${toneStyles[item.tone]}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase">{item.label}</p>
              <Activity className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-semibold">{item.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
