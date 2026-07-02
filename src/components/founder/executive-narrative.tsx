import { CalendarDays, Sparkles, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { FounderNarrative } from "@/lib/founder-os";

const narrativeItems = [
  ["Yesterday", "yesterday", CalendarDays],
  ["Today", "today", Target],
  ["Recommendation", "recommendation", Sparkles],
  ["Expected Outcome", "expectedOutcome", TrendingUp]
] as const;

export function ExecutiveNarrative({ narrative }: { narrative: FounderNarrative }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
      <Card className="border-primary/20">
        <CardContent className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary">Founder OS</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">{narrative.greeting}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{narrative.summary}</p>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {narrativeItems.map(([label, key, Icon]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
            </div>
            <p className="mt-3 text-sm leading-6">{narrative[key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
