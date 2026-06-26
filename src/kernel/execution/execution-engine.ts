import type {
  ExecutionBlocker,
  ExecutionEvidence,
  ExecutionItem,
  ExecutionResult
} from "@/lib/vgos-data";
import { createExecutionItem as buildExecutionItem } from "@/kernel/execution/execution-builder";
import type { CreateExecutionInput, ExecutionContext, ExecutionHealth } from "@/kernel/execution/execution-types";

export function createExecutionItem(input: CreateExecutionInput, context: ExecutionContext): ExecutionItem {
  return buildExecutionItem(input, context);
}

export function updateExecutionStatus(
  item: ExecutionItem,
  status: ExecutionItem["status"],
  context?: Partial<ExecutionContext>
): ExecutionItem {
  const now = context?.now ?? new Date().toISOString();
  return {
    ...item,
    status,
    startedAt: status === "IN_PROGRESS" && !item.startedAt ? now : item.startedAt,
    completedAt: ["COMPLETED", "FAILED", "CANCELLED"].includes(status) ? now : item.completedAt,
    updatedAt: now
  };
}

export function startExecution(item: ExecutionItem, context?: Partial<ExecutionContext>): ExecutionItem {
  return updateExecutionStatus(item, "IN_PROGRESS", context);
}

export function completeExecution(
  item: ExecutionItem,
  actualImpact = "Execution completed.",
  context?: Partial<ExecutionContext>
): ExecutionItem {
  return {
    ...updateExecutionStatus(item, "COMPLETED", context),
    actualImpact
  };
}

export function failExecution(
  item: ExecutionItem,
  actualImpact = "Execution failed and needs review.",
  context?: Partial<ExecutionContext>
): ExecutionItem {
  return {
    ...updateExecutionStatus(item, "FAILED", context),
    actualImpact
  };
}

export function cancelExecution(item: ExecutionItem, context?: Partial<ExecutionContext>): ExecutionItem {
  return updateExecutionStatus(item, "CANCELLED", context);
}

export function getExecutionQueue(items: ExecutionItem[]) {
  return [...items].sort((a, b) => {
    const statusRank = { READY: 0, IN_PROGRESS: 1, NEEDS_APPROVAL: 2, BLOCKED: 3, QUEUED: 4 } as Record<string, number>;
    const priorityRank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as Record<string, number>;
    return (
      (statusRank[a.status] ?? 5) - (statusRank[b.status] ?? 5) ||
      (priorityRank[a.priority] ?? 4) - (priorityRank[b.priority] ?? 4) ||
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  });
}

export function getBlockedExecutions(items: ExecutionItem[]) {
  return getExecutionQueue(items).filter((item) => item.status === "BLOCKED");
}

export function getReadyExecutions(items: ExecutionItem[]) {
  return getExecutionQueue(items).filter((item) => item.status === "READY" || item.status === "APPROVED");
}

export function getExecutionHealth(
  items: ExecutionItem[],
  evidence: ExecutionEvidence[] = [],
  blockers: ExecutionBlocker[] = [],
  results: ExecutionResult[] = []
): ExecutionHealth {
  const activeItems = items.filter((item) => item.status !== "CANCELLED");
  const ready = activeItems.filter((item) => item.status === "READY" || item.status === "APPROVED").length;
  const inProgress = activeItems.filter((item) => item.status === "IN_PROGRESS").length;
  const blocked = activeItems.filter((item) => item.status === "BLOCKED").length;
  const needsApproval = activeItems.filter((item) => item.status === "NEEDS_APPROVAL").length;
  const completed = activeItems.filter((item) => item.status === "COMPLETED").length;
  const openBlockers = blockers.filter((blocker) => blocker.status === "OPEN" || blocker.status === "IN_REVIEW").length;
  const completionRatio = completed / Math.max(activeItems.length, 1);
  const evidenceCoverage = evidence.length / Math.max(completed, 1);
  const score = Math.round(
    Math.max(0, Math.min(100, completionRatio * 55 + Math.min(evidenceCoverage, 1) * 25 + ready * 2 - blocked * 10 - needsApproval * 4 - openBlockers * 5))
  );

  return {
    score,
    ready,
    inProgress,
    blocked,
    needsApproval,
    completed,
    evidenceCount: evidence.length,
    resultCount: results.length,
    rationale: `${completed} completed, ${blocked} blocked, ${needsApproval} waiting on approval, ${evidence.length} evidence records.`
  };
}
