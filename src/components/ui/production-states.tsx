import type { ComponentProps, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

function formatLabel(value: string | number) {
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function statusTone(status: string): BadgeTone {
  if (["COMPLETED", "APPROVED", "CONNECTED", "HEALTHY", "ACTIVE", "LIVE", "PROCESSED"].includes(status)) {
    return "green";
  }
  if (["IN_PROGRESS", "READY", "MOCK", "IMPLEMENTED", "IMPROVING"].includes(status)) {
    return "blue";
  }
  if (["REQUESTED", "CHANGES_REQUESTED", "PENDING", "WATCH", "AT_RISK", "PAUSED"].includes(status)) {
    return "amber";
  }
  if (["BLOCKED", "FAILED", "ERROR", "REJECTED", "DECLINING", "CRITICAL"].includes(status)) {
    return "red";
  }
  return "slate";
}

export function priorityTone(priority: string): BadgeTone {
  if (priority === "CRITICAL") return "red";
  if (priority === "HIGH") return "amber";
  if (priority === "MEDIUM") return "blue";
  return "slate";
}

export function healthTone(score: number): BadgeTone {
  if (score >= 80) return "green";
  if (score >= 65) return "blue";
  if (score >= 45) return "amber";
  return "red";
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{formatLabel(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <Badge tone={priorityTone(priority)}>{formatLabel(priority)}</Badge>;
}

export function HealthBadge({ score, label = "Health" }: { score: number; label?: string }) {
  return <Badge tone={healthTone(score)}>{label} {Math.round(score)}%</Badge>;
}

export function LoadingState({
  title = "Loading",
  description = "Preparing the latest workspace view."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-40 items-center gap-3 p-5">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryText,
  className
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryText?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border border-dashed border-border bg-background p-6 text-center", className)}>
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <CircleHelp className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
      {secondaryText ? (
        <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-muted-foreground">{secondaryText}</p>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "Needs attention",
  description,
  actionLabel,
  onAction
}: {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6">{description}</p>
          {actionLabel && onAction ? (
            <Button className="mt-3" size="sm" variant="danger" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PageIntro({
  title,
  description,
  whyItMatters,
  nextActionLabel,
  nextAction,
  children
}: {
  title: string;
  description: string;
  whyItMatters: string;
  nextActionLabel?: string;
  nextAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Workspace scoped
            </Badge>
            <Badge tone="slate">Operator view</Badge>
          </div>
          <h2 className="mt-3 text-lg font-semibold">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
            <span className="font-semibold text-foreground">How VGOS uses this: </span>
            {whyItMatters}
          </p>
        </div>
        {nextActionLabel && nextAction ? (
          <Button className="w-full sm:w-auto" onClick={nextAction}>
            <CheckCircle2 className="h-4 w-4" />
            {nextActionLabel}
          </Button>
        ) : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-4 shadow-panel">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
