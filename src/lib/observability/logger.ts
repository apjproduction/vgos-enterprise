export type LogLevel = "info" | "warn" | "error";

export type StructuredLogEntry = {
  timestamp: string;
  level: LogLevel;
  workspaceId?: string;
  actor?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export function createStructuredLog(input: Omit<StructuredLogEntry, "timestamp"> & { timestamp?: string }): StructuredLogEntry {
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    level: input.level,
    workspaceId: input.workspaceId,
    actor: input.actor,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    message: input.message,
    metadata: input.metadata
  };
}

export function logInfo(input: Omit<StructuredLogEntry, "level" | "timestamp"> & { timestamp?: string }) {
  return createStructuredLog({ ...input, level: "info" });
}

export function logWarn(input: Omit<StructuredLogEntry, "level" | "timestamp"> & { timestamp?: string }) {
  return createStructuredLog({ ...input, level: "warn" });
}

export function logError(input: Omit<StructuredLogEntry, "level" | "timestamp"> & { timestamp?: string }) {
  return createStructuredLog({ ...input, level: "error" });
}

export const observabilityActions = {
  connectorSync: "connector.sync",
  normalization: "signal.normalized",
  routing: "signal.routed",
  intelligenceProcessing: "intelligence.processed",
  recommendationCreation: "recommendation.created",
  planGeneration: "plan.generated",
  executionCompletion: "execution.completed",
  measurementCreation: "measurement.created",
  missionHealthCalculation: "mission.health.calculated"
} as const;
function logOperation(
  action: string,
  message: string,
  metadata?: Record<string, unknown>,
  level: LogLevel = "info"
) {
  return createStructuredLog({
    level,
    action,
    message,
    workspaceId: typeof metadata?.workspaceId === "string" ? metadata.workspaceId : undefined,
    entityType: typeof metadata?.entityType === "string" ? metadata.entityType : undefined,
    entityId: typeof metadata?.entityId === "string" ? metadata.entityId : undefined,
    metadata
  });
}

export function logConnectorSync(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.connectorSync, "Connector sync processed.", metadata);
}

export function logSignalNormalization(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.normalization, "Signal normalization processed.", metadata);
}

export function logSignalRouting(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.routing, "Signal routing processed.", metadata);
}

export function logIntelligenceProcessing(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.intelligenceProcessing, "Intelligence pipeline processed.", metadata);
}

export function logRecommendationCreation(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.recommendationCreation, "Recommendation created with quality metadata.", metadata);
}

export function logPlanGeneration(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.planGeneration, "Plan generation processed.", metadata);
}

export function logExecutionCompletion(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.executionCompletion, "Execution completion processed.", metadata);
}

export function logMeasurementCreation(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.measurementCreation, "Measurement creation processed.", metadata);
}

export function logMissionHealthCalculation(metadata: Record<string, unknown>) {
  return logOperation(observabilityActions.missionHealthCalculation, "Mission health calculated.", metadata);
}

