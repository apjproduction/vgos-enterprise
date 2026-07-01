import type {
  ApprovalRequest,
  Connector,
  Event,
  ExecutionBlocker,
  ExecutionItem,
  ExecutionResult,
  Learning,
  Measurement,
  Metric,
  Mission,
  PlanConstraint,
  PlatformState,
  Workspace
} from "@/lib/vgos-data";
import type { RankedAction } from "@/kernel/decisions/decision-engine";
import type { MissionOverview } from "@/kernel/missions/mission-types";
import type { ExecutiveJudgment } from "@/kernel/cognition/cognition-types";

export type AdvisorObjectReference = {
  type: string;
  id: string;
  title: string;
  detail?: string;
};

export type AdvisorSuggestedAction = {
  label: string;
  description: string;
  pageId?: string;
  sourceId?: string;
};

export type AdvisorAnswer = {
  question: string;
  directAnswer?: string;
  answer: string;
  reasoning: string[];
  assumptions?: string[];
  evidence?: string[];
  counterEvidence?: string[];
  tradeoff?: string;
  confidenceExplanation?: string;
  whatWouldChangeRecommendation?: string[];
  suggestedNextAction?: string;
  shouldWaitForEvidence?: boolean;
  executiveJudgment?: ExecutiveJudgment;
  relatedObjects: AdvisorObjectReference[];
  suggestedActions: AdvisorSuggestedAction[];
  confidence: number;
};

export type ExecutivePriority = {
  id: string;
  title: string;
  whyItMatters: string;
  expectedImpact: string;
  estimatedEffort: string;
  confidenceScore: number;
  relatedMission?: Mission;
  sourceAction: RankedAction;
  supportingEvidence: string[];
  relatedSignals: string[];
  missingEvidence: string[];
};

export type MissionHealthSummary = {
  mission: Mission;
  overview?: MissionOverview;
  plainStatus: "on track" | "at risk" | "blocked" | "completed";
  explanation: string;
};

export type ExecutiveAttentionItem = {
  id: string;
  title: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceType: string;
};

export type ExecutiveWin = {
  id: string;
  title: string;
  detail: string;
  sourceType: string;
};

export type AdvisorContext = {
  state: PlatformState;
  workspaceId: string;
  workspace?: Workspace;
  generatedAt: string;
  rankedActions: RankedAction[];
  topPriorities: ExecutivePriority[];
  missionHealth: MissionHealthSummary[];
  recentChanges: Event[];
  recentWins: ExecutiveWin[];
  needsAttention: ExecutiveAttentionItem[];
  blockedExecutions: ExecutionItem[];
  blockers: ExecutionBlocker[];
  pendingApprovals: ApprovalRequest[];
  planConstraints: PlanConstraint[];
  readyExecutions: ExecutionItem[];
  overdueExecutions: ExecutionItem[];
  completedToday: ExecutionItem[];
  recentResults: ExecutionResult[];
  measurements: Measurement[];
  learnings: Learning[];
  metrics: Metric[];
  connectors: Connector[];
  executiveRecommendation: string;
  estimatedWorkload: string;
};

export type DailyBrief = {
  greeting: string;
  summary: string;
  changedYesterday: string[];
  movedMissions: string[];
  blocked: string[];
  needsAttention: ExecutiveAttentionItem[];
  priorities: ExecutivePriority[];
  missionHealth: MissionHealthSummary[];
  recentWins: ExecutiveWin[];
  executiveRecommendation: string;
  executiveJudgment: ExecutiveJudgment;
  recommendedFocus: string;
  estimatedWorkload: string;
};

export type ExecutiveReview = {
  period: "weekly" | "monthly";
  summary: string;
  wins: string[];
  risks: string[];
  priorities: string[];
  learning: string[];
  recommendedAdjustment: string;
};
