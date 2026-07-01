import type { Priority } from "@/lib/vgos-data";

export type DecisionSituationType =
  | "PRIORITY_DECISION"
  | "STRATEGY_DECISION"
  | "CONTENT_DECISION"
  | "PRODUCT_DECISION"
  | "CHANNEL_DECISION"
  | "RESOURCE_DECISION"
  | "EXECUTION_DECISION"
  | "RISK_DECISION"
  | "CUSTOM";

export type DecisionSituationStatus = "OPEN" | "DELIBERATING" | "DECIDED" | "DEFERRED" | "CANCELLED" | "REVIEWED";

export type DecisionOptionType =
  | "CREATE_CONTENT"
  | "CREATE_DEMO"
  | "PAUSE_WORK"
  | "START_EXECUTION"
  | "CHANGE_STRATEGY"
  | "RUN_EXPERIMENT"
  | "UPDATE_PAGE"
  | "REPLY_COMMUNITY"
  | "SUBMIT_DIRECTORY"
  | "DEFER_DECISION"
  | "DO_NOTHING"
  | "CUSTOM";

export type DeliberationStatus = "DRAFT" | "COMPLETED" | "DEFERRED" | "NEEDS_EVIDENCE";

export type DecisionCommitmentType = "EXECUTE_NOW" | "SCHEDULE" | "EXPERIMENT" | "MONITOR" | "DEFER" | "REJECT";

export type DecisionCommitmentStatus = "COMMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type DecisionQuality = "STRONG" | "SOUND" | "MIXED" | "WEAK";

export type DeliberationRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type DecisionSituation = DeliberationRecord & {
  title: string;
  description: string;
  situationType: DecisionSituationType;
  status: DecisionSituationStatus;
  urgency: Priority;
  sourceType?: string | null;
  sourceId?: string | null;
  missionId?: string | null;
  objectiveId?: string | null;
};

export type DecisionOption = DeliberationRecord & {
  situationId: string;
  title: string;
  description: string;
  optionType: DecisionOptionType;
  expectedImpact: number;
  estimatedEffort: number;
  riskLevel: Priority;
  confidenceScore: number;
  pros: string[];
  cons: string[];
  assumptions: string[];
  evidence: string[];
};

export type OptionEvaluation = DeliberationRecord & {
  optionId: string;
  situationId: string;
  impactScore: number;
  effortScore: number;
  riskScore: number;
  evidenceScore: number;
  alignmentScore: number;
  urgencyScore: number;
  overallScore: number;
  rationale: string;
};

export type Deliberation = DeliberationRecord & {
  situationId: string;
  summary: string;
  recommendedOptionId?: string | null;
  rejectedOptionIds: string[];
  finalJudgment: string;
  confidenceScore: number;
  dissentingView: string;
  whatWouldChangeDecision: string;
  status: DeliberationStatus;
};

export type DecisionCommitment = DeliberationRecord & {
  situationId: string;
  deliberationId: string;
  optionId: string;
  title: string;
  description: string;
  commitmentType: DecisionCommitmentType;
  status: DecisionCommitmentStatus;
  owner: string;
  dueDate?: string | null;
  linkedExecutionItemId?: string | null;
  linkedPlanItemId?: string | null;
};

export type DecisionReview = DeliberationRecord & {
  situationId: string;
  deliberationId?: string | null;
  commitmentId?: string | null;
  summary: string;
  outcomeScore: number;
  decisionQuality: DecisionQuality;
  judgmentPattern: string;
  futureRule: string;
};

export type DeliberationResult = {
  situation: DecisionSituation;
  options: DecisionOption[];
  evaluations: OptionEvaluation[];
  recommendedOption?: DecisionOption;
  rejectedOptions: DecisionOption[];
  challenges: Record<string, OptionChallenge>;
  deliberation: Deliberation;
  commitment: DecisionCommitment;
};

export type OptionChallenge = {
  optionId: string;
  weaknesses: string[];
  missingEvidence: string[];
  failureModes: string[];
  dissentingView: string;
  whatWouldMakeThisWrong: string[];
};

export type DeliberationState = {
  decisionSituations: DecisionSituation[];
  decisionOptions: DecisionOption[];
  optionEvaluations: OptionEvaluation[];
  deliberations: Deliberation[];
  decisionCommitments: DecisionCommitment[];
  decisionReviews: DecisionReview[];
};
