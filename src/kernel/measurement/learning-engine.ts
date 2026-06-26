import {
  createScopedId,
  formatEnum,
  orgId,
  type ExecutionResult,
  type Learning,
  type LearningType,
  type Measurement,
  type Metric
} from "@/lib/vgos-data";
import type { LearningInput, MeasurementContext } from "@/kernel/measurement/measurement-types";

export function createLearning(input: LearningInput, context: MeasurementContext): Learning {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("learning"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    summary: input.summary,
    learningType: input.learningType ?? "CUSTOM",
    confidenceScore: input.confidenceScore ?? 0.7,
    sourceType: input.sourceType ?? context.sourceType,
    sourceId: input.sourceId ?? context.sourceId,
    metricId: input.metricId,
    executionItemId: input.executionItemId ?? context.executionItemId,
    planId: input.planId ?? context.planId,
    objectiveId: input.objectiveId ?? context.objectiveId,
    recommendationImpact: input.recommendationImpact ?? "Use this learning to tune future recommendations.",
    shouldInformFuturePlans: input.shouldInformFuturePlans ?? true,
    createdAt: now,
    updatedAt: now
  };
}

export function generateLearningFromMeasurement(
  measurement: Measurement,
  metric: Metric,
  context: MeasurementContext
): Learning {
  const change = measurement.changeValue ?? measurement.value - (measurement.previousValue ?? 0);
  const direction = change >= 0 ? "improved" : "declined";
  const title = `${metric.name} ${direction}`;

  return createLearning(
    {
      title,
      summary: `${metric.name} ${direction} by ${Math.abs(change)} ${metric.unit}. ${measurement.notes ?? ""}`.trim(),
      learningType: inferLearningType(metric),
      confidenceScore: Math.min(0.95, 0.68 + Math.min(Math.abs(measurement.changePercent ?? 0) / 100, 0.22)),
      sourceType: "Measurement",
      sourceId: measurement.id,
      metricId: metric.id,
      executionItemId: measurement.executionItemId,
      planId: measurement.planId,
      objectiveId: measurement.objectiveId,
      recommendationImpact:
        change >= 0
          ? `Increase emphasis on actions that improve ${metric.name}.`
          : `Review plans tied to ${metric.name} before scaling.`,
      shouldInformFuturePlans: true
    },
    context
  );
}

export function generateLearningFromExecutionResult(
  result: ExecutionResult,
  metric: Metric | undefined,
  context: MeasurementContext
): Learning {
  const metricName = metric?.name ?? result.metricName ?? "execution impact";
  return createLearning(
    {
      title: `${metricName} learning from execution`,
      summary: result.learning || result.summary,
      learningType: metric ? inferLearningType(metric) : "EXPERIMENT_LEARNING",
      confidenceScore: Math.min(0.92, 0.6 + (result.impactScore ?? 50) / 250),
      sourceType: "ExecutionResult",
      sourceId: result.id,
      metricId: metric?.id,
      executionItemId: result.executionItemId,
      recommendationImpact: `Future recommendations should account for this ${formatEnum(result.resultType).toLowerCase()} result.`,
      shouldInformFuturePlans: true
    },
    context
  );
}

export function generateLearningFromExperiment(input: {
  title: string;
  result: string;
  successMetric: string;
  confidenceScore?: number;
}, context: MeasurementContext): Learning {
  return createLearning(
    {
      title: `${input.title} experiment learning`,
      summary: input.result || `Experiment measured ${input.successMetric}.`,
      learningType: "EXPERIMENT_LEARNING",
      confidenceScore: input.confidenceScore ?? 0.72,
      recommendationImpact: "Use the experiment result to adjust the next plan sequence.",
      shouldInformFuturePlans: true
    },
    context
  );
}

export function getHighConfidenceLearnings(learnings: Learning[], minimumConfidence = 0.8) {
  return learnings
    .filter((learning) => learning.confidenceScore >= minimumConfidence)
    .sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function getLearningsForObjective(learnings: Learning[], objectiveId: string) {
  return learnings.filter((learning) => learning.objectiveId === objectiveId);
}

function inferLearningType(metric: Metric): LearningType {
  if (["SEARCH_IMPRESSIONS", "SEARCH_CLICKS", "TRAFFIC"].includes(metric.metricType)) return "SEO_IMPACT";
  if (metric.metricType === "AI_MENTIONS") return "GEO_IMPACT";
  if (["BACKLINKS", "REFERRING_DOMAINS", "DIRECTORY_APPROVALS", "AUTHORITY_SCORE"].includes(metric.metricType)) return "AUTHORITY_IMPACT";
  if (["SOCIAL_IMPRESSIONS", "SOCIAL_ENGAGEMENT", "CONTENT_PUBLISHED"].includes(metric.metricType)) return "CONTENT_PERFORMANCE";
  if (metric.metricType === "COMMUNITY_REPLIES") return "COMMUNITY_SIGNAL";
  if (["SIGNUPS", "CONVERSIONS", "REVENUE"].includes(metric.metricType)) return "PRODUCT_SIGNAL";
  return "CUSTOM";
}
