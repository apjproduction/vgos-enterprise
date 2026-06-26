import {
  createScopedId,
  orgId,
  type Attribution,
  type AttributionType,
  type Measurement,
  type Metric
} from "@/lib/vgos-data";
import type { AttributionInput, MeasurementContext } from "@/kernel/measurement/measurement-types";

export function createAttribution(input: AttributionInput, context: MeasurementContext): Attribution {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("attribution"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: input.targetType,
    targetId: input.targetId,
    attributionType: input.attributionType ?? "INFLUENCED",
    confidenceScore: input.confidenceScore ?? 0.7,
    evidence: input.evidence,
    createdAt: now,
    updatedAt: now
  };
}

export function inferAttribution(
  measurement: Measurement,
  metric: Metric,
  context: MeasurementContext
): Attribution {
  const change = measurement.changeValue ?? measurement.value - (measurement.previousValue ?? 0);
  const sourceType = measurement.executionItemId ? "ExecutionItem" : measurement.sourceType ?? "Measurement";
  const sourceId = measurement.executionItemId ?? measurement.sourceId ?? measurement.id;
  const attributionType = inferAttributionType(change);

  return createAttribution(
    {
      sourceType,
      sourceId,
      targetType: "Metric",
      targetId: metric.id,
      attributionType,
      confidenceScore: calculateAttributionConfidence(measurement, metric),
      evidence: measurement.notes ?? `${sourceType} ${sourceId} is linked to ${metric.name} movement.`
    },
    context
  );
}

export function getAttributionsForSource(attributions: Attribution[], sourceType: string, sourceId: string) {
  return attributions.filter((item) => item.sourceType === sourceType && item.sourceId === sourceId);
}

export function getAttributionsForTarget(attributions: Attribution[], targetType: string, targetId: string) {
  return attributions.filter((item) => item.targetType === targetType && item.targetId === targetId);
}

export function calculateAttributionConfidence(measurement: Measurement, metric: Metric) {
  const absoluteChange = Math.abs(measurement.changePercent ?? 0);
  const base = measurement.executionItemId ? 0.7 : 0.58;
  const sourceBoost = measurement.sourceType === "ExecutionResult" || measurement.executionResultId ? 0.08 : 0;
  const metricBoost = ["SIGNUPS", "COMMUNITY_REPLIES", "BACKLINKS"].includes(metric.metricType) ? 0.04 : 0;
  return Math.min(0.94, base + sourceBoost + metricBoost + Math.min(absoluteChange / 200, 0.12));
}

function inferAttributionType(change: number, confidenceScore?: number): AttributionType {
  if (change < 0) return "CONTRADICTED";
  if ((confidenceScore ?? 0) >= 0.85 && change > 0) return "CAUSED";
  if (change > 0) return "INFLUENCED";
  return "CORRELATED";
}
