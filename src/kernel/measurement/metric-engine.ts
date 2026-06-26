import {
  createScopedId,
  orgId,
  type Learning,
  type Measurement,
  type Metric,
  type MetricStatus
} from "@/lib/vgos-data";
import type { DashboardMeasurementSummary, MeasurementContext, MetricInput, MetricTrend } from "@/kernel/measurement/measurement-types";

export function createMetric(input: MetricInput, context: MeasurementContext): Metric {
  const now = context.now ?? new Date().toISOString();
  const name = input.name.trim() || "Untitled metric";
  const previousValue = input.previousValue ?? input.currentValue ?? 0;
  const currentValue = input.currentValue ?? previousValue;

  return {
    id: createScopedId("metric"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    name,
    title: name,
    description: input.description,
    metricType: input.metricType,
    source: input.source ?? "Manual",
    unit: input.unit ?? "count",
    currentValue,
    previousValue,
    targetValue: input.targetValue,
    status: input.status ?? statusFromChange(currentValue - previousValue),
    owner: input.owner ?? "Growth",
    createdAt: now,
    updatedAt: now
  };
}

export function updateMetricValue(metric: Metric, value: number, context?: Partial<MeasurementContext>): Metric {
  const previousValue = metric.currentValue;
  return {
    ...metric,
    previousValue,
    currentValue: value,
    status: statusFromChange(value - previousValue),
    updatedAt: context?.now ?? new Date().toISOString()
  };
}

export function getMetricTrend(metric: Metric, measurements: Measurement[] = []): MetricTrend {
  const latest = [...measurements]
    .filter((item) => item.metricId === metric.id)
    .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime())[0];
  const currentValue = latest?.value ?? metric.currentValue;
  const previousValue = latest?.previousValue ?? metric.previousValue;
  const changeValue = latest?.changeValue ?? currentValue - previousValue;
  const changePercent =
    latest?.changePercent ?? (previousValue === 0 ? 0 : Math.round((changeValue / previousValue) * 10000) / 100);

  return {
    metricId: metric.id,
    currentValue,
    previousValue,
    changeValue,
    changePercent,
    direction: changeValue > 0 ? "UP" : changeValue < 0 ? "DOWN" : "FLAT",
    status: statusFromChange(changeValue, metric.status)
  };
}

export function getMetricsByType(metrics: Metric[], metricType: Metric["metricType"]) {
  return metrics.filter((metric) => metric.metricType === metricType);
}

export function getObjectiveMetrics(metrics: Metric[], measurements: Measurement[], objectiveId: string) {
  const metricIds = new Set(measurements.filter((item) => item.objectiveId === objectiveId).map((item) => item.metricId));
  return metrics.filter((metric) => metricIds.has(metric.id));
}

export function getDashboardMetrics(
  metrics: Metric[],
  measurements: Measurement[],
  learnings: Learning[],
  adjustments: { status: string }[],
  attributions: unknown[] = []
): DashboardMeasurementSummary {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    metricsTracked: metrics.length,
    measurementsThisWeek: measurements.filter((item) => new Date(item.measuredAt).getTime() >= oneWeekAgo).length,
    highConfidenceLearnings: learnings.filter((item) => item.confidenceScore >= 0.8).length,
    pendingStrategyAdjustments: adjustments.filter((item) => item.status === "PROPOSED").length,
    metricsNeedingAttention: metrics.filter((item) => ["WATCH", "DECLINING", "STALLED"].includes(item.status)).length,
    attributionCount: attributions.length,
    predictionAccuracy: 0
  };
}

function statusFromChange(changeValue: number, fallback: MetricStatus = "WATCH"): MetricStatus {
  if (changeValue > 0) return "IMPROVING";
  if (changeValue < 0) return "DECLINING";
  return fallback === "DECLINING" ? "STALLED" : fallback;
}
