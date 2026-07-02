import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderEvent } from "@/lib/founder-os";

const severityTone: Record<FounderEvent["severity"], "blue" | "green" | "amber" | "red"> = {
  INFO: "blue",
  POSITIVE: "green",
  WARNING: "amber",
  CRITICAL: "red"
};

const sourceLabel: Record<FounderEvent["source"], string> = {
  GITHUB: "Build",
  VERCEL: "Deployment",
  FOUNDER_OS: "Founder OS",
  MISSION_CONTROL: "Mission",
  DECISION_CENTER: "Decision",
  CONTENT: "Publishing",
  PRODUCT: "Product",
  CUSTOMER: "Customer"
};

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function EventTimeline({ events }: { events: FounderEvent[] }) {
  const visibleEvents = events.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Reality Timeline</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {visibleEvents.map((event) => (
          <div key={event.id} className="rounded-lg border border-border bg-background p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={severityTone[event.severity]}>{sourceLabel[event.source]}</Badge>
              <span className="text-xs font-medium text-muted-foreground">{formatEventDate(event.occurredAt)}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-5">{event.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{event.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
