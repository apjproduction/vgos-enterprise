import type {
  ExecutionItem,
  Learning,
  Measurement,
  Metric,
  Mission,
  MissionSummary,
  MissionType,
  Objective,
  Plan,
  PlatformState,
  Priority,
  RecommendedAction,
  StrategyAdjustment
} from "@/lib/vgos-data";

export type MissionContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type MissionInput = {
  title: string;
  description: string;
  missionType?: MissionType;
  owner?: string;
  priority?: Priority;
  startDate?: string;
  targetDate?: string;
  notes?: string;
};

export type MissionRelatedRecords = {
  mission: Mission;
  objectives: Objective[];
  plans: Plan[];
  executions: ExecutionItem[];
  metrics: Metric[];
  measurements: Measurement[];
  learnings: Learning[];
  summaries: MissionSummary[];
  recommendedActions: RecommendedAction[];
  strategyAdjustments: StrategyAdjustment[];
};

export type MissionOverview = MissionRelatedRecords & {
  completionScore: number;
  healthScore: number;
  velocityScore: number;
  riskScore: number;
  confidenceScore: number;
  latestSummary?: MissionSummary;
};

export type MissionInsight = {
  id: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export type MissionRecommendation = {
  id: string;
  title: string;
  action: string;
  priority: Priority;
  reasoning: string;
};

export type MissionBuilderResult = {
  mission: Mission;
  objectives: string[];
  plans: string[];
  recommendedActions: MissionRecommendation[];
};

export type MissionState = Pick<
  PlatformState,
  | "missions"
  | "missionObjectives"
  | "missionPlans"
  | "missionExecutions"
  | "missionLearnings"
  | "missionMetrics"
  | "missionSummaries"
  | "objectives"
  | "plans"
  | "executionItems"
  | "metrics"
  | "measurements"
  | "learnings"
  | "recommendedActions"
  | "strategyAdjustments"
>;
