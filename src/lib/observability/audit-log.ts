import { createScopedId, workspaceId as defaultWorkspaceId } from "@/lib/vgos-data";

export type AuditLogEntry = {
  id: string;
  workspaceId: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type AuditLogInput = Omit<AuditLogEntry, "id" | "createdAt" | "workspaceId"> & {
  id?: string;
  workspaceId?: string;
  createdAt?: string;
};

export function createAuditLogEntry(input: AuditLogInput): AuditLogEntry {
  return {
    id: input.id ?? createScopedId("audit-log"),
    workspaceId: input.workspaceId ?? defaultWorkspaceId,
    actor: input.actor,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    before: input.before ?? null,
    after: input.after ?? null,
    metadata: input.metadata ?? null,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function createManualEditAuditLog(input: {
  workspaceId?: string;
  actor?: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}) {
  return createAuditLogEntry({
    workspaceId: input.workspaceId,
    actor: input.actor ?? "VGOS Operator",
    action: "MANUAL_EDIT",
    entityType: input.entityType,
    entityId: input.entityId,
    before: input.before,
    after: input.after,
    metadata: { surface: "Mission Control" }
  });
}

export function summarizeAuditLogs(logs: AuditLogEntry[]) {
  const byAction = logs.reduce<Record<string, number>>((totals, log) => {
    totals[log.action] = (totals[log.action] ?? 0) + 1;
    return totals;
  }, {});
  const latest = [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  return {
    total: logs.length,
    byAction,
    latest
  };
}
