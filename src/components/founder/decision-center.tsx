import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, MessageSquare, PauseCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FounderDecision } from "@/lib/founder-os";

export function DecisionCenter({ decisions }: { decisions: FounderDecision[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Decision Center</CardTitle>
        <p className="text-sm text-muted-foreground">Open calls that need judgment before capacity moves.</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {decisions.map((decision) => (
          <div key={decision.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="amber">Decision</Badge>
              <Badge tone="blue">Confidence {decision.confidence}%</Badge>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{decision.situation}</h3>
            <p className="mt-2 text-sm leading-6">{decision.recommendation}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{decision.reason}</p>
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Alternatives</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(decision.alternatives.length ? decision.alternatives : ["Postpone until stronger evidence"]).map((alternative) => (
                  <Badge key={alternative} tone="slate">
                    {alternative}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <DecisionLink href={decision.href} icon={<CheckCircle2 className="h-4 w-4" />} label="Accept" primary />
              <DecisionLink href={decision.href} icon={<MessageSquare className="h-4 w-4" />} label="Challenge" />
              <DecisionLink href={decision.href} icon={<PauseCircle className="h-4 w-4" />} label="Postpone" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DecisionLink({ href, icon, label, primary }: { href: string; icon: ReactNode; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          : "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-card px-2.5 text-xs font-medium hover:bg-muted"
      }
    >
      {icon}
      {label}
    </Link>
  );
}
