import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderPriority } from "@/lib/founder-os";

export function ExecutiveAttention({ priorities }: { priorities: [FounderPriority, FounderPriority, FounderPriority] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Executive Attention</CardTitle>
        <p className="text-sm text-muted-foreground">The three moves worth founder attention today.</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {priorities.map((priority, index) => (
          <div key={priority.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={index === 0 ? "green" : "blue"}>Priority {index + 1}</Badge>
                  <Badge tone="slate">{priority.relatedMission}</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{priority.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{priority.expectedImpact}</p>
              </div>
              <Link
                href={priority.href}
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Start
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <MiniStat label="Effort" value={priority.estimatedEffort} />
              <MiniStat label="Confidence" value={`${priority.confidence}%`} />
              <MiniStat label="Impact" value="High" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <p className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
