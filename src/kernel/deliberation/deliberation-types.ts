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

export type DeliberationStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "READY_FOR_DECISION"
  | "DECIDED"
  | "REOPENED"
  | "ARCHIVED"
  | "DRAFT"
  | "COMPLETED"
  | "DEFERRED"
  | "NEEDS_EVIDENCE";

export type AssumptionType = "MARKET" | "CUSTOMER" | "PRODUCT" | "GROWTH" | "OPERATIONAL" | "STRATEGIC" | "FINANCIAL" | "CUSTOM";

export type AssumptionStatus = "UNTESTED" | "SUPPORTED" | "VALIDATED" | "CHALLENGED" | "INVALIDATED" | "DEPRECATED";

export type ObjectionType = "EVIDENCE_GAP" | "RISK" | "CONSTRAINT" | "OPTION_GAP" | "TIMING" | "RESOURCE" | "CUSTOM";

export type ObjectionStatus = "OPEN" | "ACCEPTED" | "MITIGATED" | "REJECTED" | "SUPERSEDED";

export type DecisionReadinessStatus = "NOT_READY" | "NEEDS_REVIEW" | "READY_FOR_DECISION" | "READY_FOR_COMMITMENT";

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
  deliberationId?: string | null;
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
  expectedUpside?: string;
  expectedDownside?: string;
  requiredResources?: string[];
  constraints?: string[];
  evidenceIds?: string[];
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
  title?: string;
  description?: string;
  sourceType?: string | null;
  sourceId?: string | null;
  participants?: string[];
  decisionId?: string | null;
  summary: string;
  recommendedOptionId?: string | null;
  rejectedOptionIds: string[];
  finalJudgment: string;
  confidenceScore: number;
  dissentingView: string;
  whatWouldChangeDecision: string;
  status: DeliberationStatus;
};

export type Assumption = DeliberationRecord & {
  deliberationId: string;
  statement: string;
  assumptionType: AssumptionType;
  confidenceScore: number;
  evidenceIds: string[];
  status: AssumptionStatus;
};

export type Tradeoff = DeliberationRecord & {
  deliberationId: string;
  optionA: string;
  optionB: string;
  comparisonSummary: string;
  benefit: string;
  cost: string;
  risk: string;
  reversibilityScore: number;
  confidenceScore: number;
};

export type Objection = DeliberationRecord & {
  deliberationId: string;
  raisedBy: string;
  objectionType: ObjectionType;
  statement: string;
  severity: Priority;
  evidenceIds: string[];
  status: ObjectionStatus;
  resolutionSummary?: string | null;
};

export type DecisionQualityScore = {
  decisionId: string;
  evidenceQuality: number;
  assumptionClarity: number;
  optionCoverage: number;
  tradeoffClarity: number;
  riskVisibility: number;
  reversibilityScore: number;
  confidenceJustification: number;
  overallScore: number;
  warnings: string[];
};

export type DecisionQualityInput = {
  decisionId: string;
  options: DecisionOption[];
  assumptions?: Assumption[];
  tradeoffs?: Tradeoff[];
  objections?: Objection[];
  confidenceScore?: number;
  reversibilityScore?: number;
  rationale?: string | null;
  commitmentCreated?: boolean;
  commitmentRationale?: string | null;
};

export type DecisionReadinessRecommendation = {
  decisionId: string;
  status: DecisionReadinessStatus;
  score: DecisionQualityScore;
  rationale: string;
  nextActions: string[];
};

export type DeliberationSummary = {
  deliberationId: string;
  decisionId: string;
  title: string;
  status: DeliberationStatus;
  recommendedOption?: string;
  evidence: string[];
  assumptions: string[];
  tradeoffs: string[];
  unresolvedObjections: string[];
  confidence: number;
  qualityScore: DecisionQualityScore;
  recommendedNextAction: string;
};

export type DecisionQualityTask = {
  id: string;
  deliberationId: string;
  title: string;
  taskType:
    | "VALIDATE_ASSUMPTION"
    | "RESOLVE_OBJECTION"
    | "ADD_MISSING_EVIDENCE"
    | "COMPARE_ALTERNATIVES"
    | "REOPEN_WEAK_DECISION"
    | "CONVERT_READY_DECISION";
  reason: string;
  severity: Priority;
};

export type DecisionQualityBrief = {
  summary: string;
  underDeliberation: DeliberationSummary[];
  readyForCommitment: DeliberationSummary[];
  weakEvidence: DeliberationSummary[];
  unresolvedObjections: Objection[];
  highRiskAssumptions: Assumption[];
  highestQualityRecentDecision?: DeliberationSummary;
  tasks: DecisionQualityTask[];
};

export type InstructionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
};

export type ConvertedDecision = DeliberationRecord & {
  deliberationId: string;
  title: string;
  rationale: string;
  recommendedOptionId?: string | null;
  confidenceScore: number;
  qualityScore?: DecisionQualityScore;
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
  deliberationAssumptions?: Assumption[];
  deliberationTradeoffs?: Tradeoff[];
  deliberationObjections?: Objection[];
  decisionQualityScores?: DecisionQualityScore[];
};
