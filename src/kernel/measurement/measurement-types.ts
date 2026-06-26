import type {
  Attribution,
  AttributionType,
  ExecutionResult,
  Learning,
  LearningType,
  Measurement,
  Metric,
  MetricStatus,
  MetricType,
  Plan,
  PredictedOutcome,
  Priority,
  StrategyAdjustment,
  StrategyAdjustmentStatus,
  StrategyAdjustmentType
} from "@/lib/vgos-data";

export type MeasurementContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
  sourceType?: string;
  sourceId?: string;
  executionItemId?: string;
  executionResultId?: string;
  planId?: string;
  objectiveId?: string;
  campaignId?: string;
};

export type MetricInput = {
  name: string;
  description: string;
  metricType: MetricType;
  source?: string;
  unit?: string;
  currentValue?: number;
  previousValue?: number;
  targetValue?: number;
  status?: MetricStatus;
  owner?: string;
};

export type MeasurementInput = {
  metricId: string;
  value: number;
  previousValue?: number;
  measuredAt?: string;
  notes?: string;
  sourceType?: string;
  sourceId?: string;
  executionItemId?: string;
  executionResultId?: string;
  planId?: string;
  objectiveId?: string;
  campaignId?: string;
};

export type LearningInput = {
  title: string;
  summary: string;
  learningType?: LearningType;
  confidenceScore?: number;
  sourceType?: string;
  sourceId?: string;
  metricId?: string;
  executionItemId?: string;
  planId?: string;
  objectiveId?: string;
  recommendationImpact?: string;
  shouldInformFuturePlans?: boolean;
};

export type AttributionInput = {
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  attributionType?: AttributionType;
  confidenceScore?: number;
  evidence: string;
};

export type StrategyAdjustmentInput = {
  title: string;
  description: string;
  adjustmentType?: StrategyAdjustmentType;
  sourceLearningId?: string;
  objectiveId?: string;
  planId?: string;
  status?: StrategyAdjustmentStatus;
  priority?: Priority;
  reasoning: string;
};

export type MetricTrend = {
  metricId: string;
  currentValue: number;
  previousValue: number;
  changeValue: number;
  changePercent: number;
  direction: "UP" | "DOWN" | "FLAT";
  status: MetricStatus;
};

export type PredictionComparison = {
  prediction: PredictedOutcome;
  measurement?: Measurement;
  actualValue?: number;
  accuracyScore: number;
  rationale: string;
};

export type DashboardMeasurementSummary = {
  metricsTracked: number;
  measurementsThisWeek: number;
  highConfidenceLearnings: number;
  pendingStrategyAdjustments: number;
  metricsNeedingAttention: number;
  attributionCount: number;
  predictionAccuracy: number;
};

export type MeasurementBundle = {
  measurement: Measurement;
  metric: Metric;
  executionResult?: ExecutionResult;
  learning?: Learning;
  attribution?: Attribution;
  strategyAdjustment?: StrategyAdjustment;
  relatedPlan?: Plan;
};
