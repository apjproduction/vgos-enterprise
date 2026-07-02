import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderOpportunity } from "@/lib/founder-os";

export function OpportunityList({ opportunities }: { opportunities: FounderOpportunity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Opportunities</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {opportunities.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-background p-4">
            <h3 className="text-sm font-semibold">{item.opportunity}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.whyItMatters}</p>
            <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Expected impact</p>
            <p className="mt-1 text-sm leading-6">{item.expectedImpact}</p>
            <Link
              href={item.href}
              className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-card px-2.5 text-xs font-medium hover:bg-muted"
            >
              {item.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
