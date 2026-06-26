import {
  createScopedId,
  orgId,
  type Event,
  type EventSeverity,
  type EventType
} from "@/lib/vgos-data";

export function createKernelEvent(input: {
  workspaceId: string;
  organizationId?: string;
  eventType: EventType;
  sourceType: string;
  sourceId: string;
  title: string;
  description?: string;
  severity?: EventSeverity;
  metadata?: Record<string, unknown>;
}): Event {
  return {
    id: createScopedId("kernel-event"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    eventType: input.eventType,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    title: input.title,
    description: input.description ?? input.title,
    metadata: input.metadata ?? { generatedBy: "kernel" },
    severity: input.severity ?? "HIGH",
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
}

export function createMemoryEvent(workspaceId: string, sourceId: string, updated = false) {
  return createKernelEvent({
    workspaceId,
    eventType: updated ? "MEMORY_UPDATED" : "MEMORY_CREATED",
    sourceType: "Memory",
    sourceId,
    title: updated ? "Memory updated" : "Memory created",
    severity: updated ? "HIGH" : "MEDIUM"
  });
}

export function createPatternEvent(workspaceId: string, sourceId: string) {
  return createKernelEvent({
    workspaceId,
    eventType: "PATTERN_DETECTED",
    sourceType: "Pattern",
    sourceId,
    title: "Pattern detected",
    severity: "HIGH"
  });
}

export function createReasoningEvent(workspaceId: string, sourceId: string) {
  return createKernelEvent({
    workspaceId,
    eventType: "REASONING_TRACE_CREATED",
    sourceType: "ReasoningTrace",
    sourceId,
    title: "Reasoning trace created",
    severity: "MEDIUM"
  });
}
