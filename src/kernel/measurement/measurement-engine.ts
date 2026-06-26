import {
  createScopedId,
  orgId,
  type ExecutionResult,
  type Measurement,
  type Metric,
  type PredictedOutcome
} from "@/lib/vgos-data";
import type { MeasurementContext, MeasurementInput, PredictionComparison } from "@/kernel/measurement/measurement-types";

export function calculateMetricChange(value: number, previousValue?: number) {
  const baseline = previousValue ?? 0;
  const changeValue = value - baseline;
  const changePercent = baseline === 0 ? undefined : Math.round((changeValue / baseline) * 10000) / 100;
  return { changeValue, changePercent };
}

export function createMeasurement(input: MeasurementInput, context: MeasurementContext): Measurement {
  const now = context.now ?? new Date().toISOString();
  const { changeValue, changePercent } = calculateMetricChange(input.value, input.previousValue);

  return {
    id: createScopedId("measurement"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    metricId: input.metricId,
    sourceType: input.sourceType ?? context.sourceType,
    sourceId: input.sourceId ?? context.sourceId,
    executionItemId: input.executionItemId ?? context.executionItemId,
    executionResultId: input.executionResultId ?? context.executionResultId,
    planId: input.planId ?? context.planId,
    objectiveId: input.objectiveId ?? context.objectiveId,
    campaignId: input.campaignId ?? context.campaignId,
    measuredAt: input.measuredAt ?? now,
    value: input.value,
    previousValue: input.previousValue,
    changeValue,
    changePercent,
    notes: input.notes,
    createdAt: now,
    updatedAt: now
  };
}

export function createMeasurementFromExecutionResult(
  result: ExecutionResult,
  metric: Metric,
  context: MeasurementContext
): Measurement {
  return createMeasurement(
    {
      metricId: metric.id,
      sourceType: "ExecutionResult",
      sourceId: result.id,
      executionItemId: result.executionItemId,
      executionResultId: result.id,
      value: result.metricAfter ?? metric.currentValue,
      previousValue: result.metricBefore ?? metric.previousValue,
      notes: result.summary
    },
    context
  );
}

export function compareMeasurementToPrediction(
  measurement: Measurement,
  prediction: PredictedOutcome
): PredictionComparison {
  const actualValue = measurement.changeValue ?? measurement.value - (measurement.previousValue ?? 0);
  const predicted = prediction.predictedValue;
  const accuracyScore = Math.max(
    0,
    Math.min(1, 1 - Math.abs(actualValue - predicted) / Math.max(Math.abs(predicted), 1))
  );

  return {
    prediction,
    measurement,
    actualValue,
    accuracyScore,
    rationale: `${prediction.metricName} predicted ${predicted}; measurement captured ${actualValue}.`
  };
}

export function getMeasurementsForExecution(measurements: Measurement[], executionItemId: string) {
  return measurements.filter((measurement) => measurement.executionItemId === executionItemId);
}

export function getMeasurementsForPlan(measurements: Measurement[], planId: string) {
  return measurements.filter((measurement) => measurement.planId === planId);
}

export function getMeasurementsForObjective(measurements: Measurement[], objectiveId: string) {
  return measurements.filter((measurement) => measurement.objectiveId === objectiveId);
}

export function detectSignificantChange(measurement: Measurement, thresholdPercent = 10) {
  return Math.abs(measurement.changePercent ?? 0) >= thresholdPercent || Math.abs(measurement.changeValue ?? 0) >= 10;
}
