import { createScopedId, orgId, type ExecutionBlocker, type ExecutionItem } from "@/lib/vgos-data";
import type { AddBlockerInput, ExecutionContext } from "@/kernel/execution/execution-types";

function nowFrom(context?: Partial<ExecutionContext>) {
  return context?.now ?? new Date().toISOString();
}

export function calculateBlockerSeverity(input: Pick<ExecutionItem, "priority" | "dueDate">) {
  const dueSoon = new Date(input.dueDate).getTime() <= Date.now() + 3 * 24 * 60 * 60 * 1000;
  if (input.priority === "CRITICAL" || (input.priority === "HIGH" && dueSoon)) return "CRITICAL";
  if (input.priority === "HIGH") return "HIGH";
  if (dueSoon) return "MEDIUM";
  return "LOW";
}

export function addBlocker(input: AddBlockerInput, context: ExecutionContext): ExecutionBlocker {
  const now = nowFrom(context);
  return {
    id: createScopedId("execution-blocker"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    executionItemId: input.executionItemId,
    title: input.title,
    description: input.description ?? input.title,
    blockerType: input.blockerType ?? "OTHER",
    severity: input.severity ?? "MEDIUM",
    status: "OPEN",
    owner: input.owner ?? "Growth",
    resolvedAt: undefined,
    createdAt: now,
    updatedAt: now
  };
}

export function resolveBlocker(blocker: ExecutionBlocker): ExecutionBlocker {
  const now = new Date().toISOString();
  return {
    ...blocker,
    status: "RESOLVED",
    resolvedAt: now,
    updatedAt: now
  };
}

export function getOpenBlockers(blockers: ExecutionBlocker[]) {
  return blockers
    .filter((blocker) => blocker.status === "OPEN" || blocker.status === "IN_REVIEW")
    .sort((a, b) => {
      const severityRank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as Record<string, number>;
      return (severityRank[a.severity] ?? 4) - (severityRank[b.severity] ?? 4);
    });
}

export function detectExecutionBlockers(items: ExecutionItem[]): ExecutionBlocker[] {
  return items
    .filter((item) => item.status === "BLOCKED")
    .map((item) =>
      addBlocker(
        {
          executionItemId: item.id,
          title: `${item.title} is blocked`,
          description: item.notes || "Execution is blocked and needs owner review.",
          blockerType: "OTHER",
          severity: calculateBlockerSeverity(item),
          owner: item.owner
        },
        { workspaceId: item.workspaceId, organizationId: item.organizationId, now: item.updatedAt }
      )
    );
}
