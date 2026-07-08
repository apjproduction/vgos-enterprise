export type CommitmentRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CommitmentRecommendedAction =
  | "CONTINUE"
  | "CLARIFY_OWNER"
  | "ADD_EVIDENCE"
  | "ADD_RESOURCES"
  | "RESOLVE_BLOCKER"
  | "ESCALATE"
  | "PAUSE"
  | "ABANDON"
  | "REPLAN";

export type CommitmentDriftType =
  | "SCOPE_DRIFT"
  | "STRATEGIC_DRIFT"
  | "OWNER_DRIFT"
  | "DEADLINE_DRIFT"
  | "EVIDENCE_DRIFT"
  | "EXECUTION_DRIFT"
  | "OUTCOME_DRIFT";

export type CommitmentEscalationStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";

export type CommitmentEscalationType = "OWNER" | "EVIDENCE" | "BLOCKER" | "DRIFT" | "DEADLINE" | "QUALITY" | "CUSTOM";

export type CommitmentMonitoringFrequency = "DAILY" | "TWICE_WEEKLY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export type InstructionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
};

export type CommitmentLike = {
  id: string;
  organizationId?: string;
  workspaceId: string;
  title: string;
  description?: string;
  rationale?: string | null;
  owner?: string | null;
  status?: string;
  dueDate?: string | null;
  decisionId?: string | null;
  situationId?: string | null;
  deliberationId?: string | null;
  optionId?: string | null;
  missionId?: string | null;
  planId?: string | null;
  linkedExecutionItemId?: string | null;
  linkedPlanItemId?: string | null;
  evidenceIds?: string[];
  successCriteria?: string[];
  requiredResources?: string[];
  dependencies?: string[];
  expectedOutcome?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CommitmentRiskProfile = {
  commitmentId: string;
  workspaceId: string;
  riskLevel: CommitmentRiskLevel;
  riskScore: number;
  ownershipRisk: number;
  resourceRisk: number;
  dependencyRisk: number;
  evidenceRisk: number;
  deadlineRisk: number;
  driftRisk: number;
  executionRisk: number;
  warnings: string[];
  recommendedAction: CommitmentRecommendedAction;
  computedAt: string;
};

export type ExecutionReadiness = {
  commitmentId: string;
  ownerAssigned: boolean;
  rationalePresent: boolean;
  evidenceLinked: boolean;
  decisionLinked: boolean;
  successCriteriaDefined: boolean;
  requiredResourcesKnown: boolean;
  dependenciesKnown: boolean;
  blockersKnown: boolean;
  dueDateDefined: boolean;
  readinessScore: number;
  ready: boolean;
  warnings: string[];
};

export type CommitmentIntegrityScore = {
  commitmentId: string;
  decisionAlignment: number;
  evidenceTraceability: number;
  ownerClarity: number;
  executionReadiness: number;
  progressVisibility: number;
  driftControl: number;
  outcomeMeasurability: number;
  overallScore: number;
  warnings: string[];
};

export type CommitmentDriftSignal = {
  id: string;
  commitmentId: string;
  workspaceId: string;
  driftType: CommitmentDriftType;
  severity: CommitmentRiskLevel;
  description: string;
  originalIntent: string;
  currentState: string;
  evidenceIds: string[];
  detectedAt: string;
};

export type CommitmentEscalation = {
  id: string;
  commitmentId: string;
  workspaceId: string;
  escalationType: CommitmentEscalationType;
  reason: string;
  severity: CommitmentRiskLevel;
  recommendedRecipient: string;
  status: CommitmentEscalationStatus;
  createdAt: string;
  resolvedAt?: string | null;
};

export type CommitmentMonitoringPlan = {
  commitmentId: string;
  workspaceId: string;
  monitoringFrequency: CommitmentMonitoringFrequency;
  leadingIndicators: string[];
  laggingIndicators: string[];
  riskTriggers: string[];
  reviewCadence: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export type CommitmentIntegrityTask = {
  id: string;
  commitmentId: string;
  title: string;
  taskType:
    | "ASSIGN_OWNER"
    | "ADD_SUCCESS_CRITERIA"
    | "ADD_MISSING_EVIDENCE"
    | "RESOLVE_BLOCKER"
    | "REVIEW_DRIFT"
    | "ESCALATE_COMMITMENT"
    | "REPLAN_COMMITMENT"
    | "ADD_MONITORING_PLAN"
    | "CREATE_REFLECTION";
  reason: string;
  severity: CommitmentRiskLevel;
};

export type CommitmentIntegritySummary = {
  commitmentId: string;
  title: string;
  owner: string;
  riskProfile: CommitmentRiskProfile;
  readiness: ExecutionReadiness;
  integrity: CommitmentIntegrityScore;
  driftSignals: CommitmentDriftSignal[];
  escalation?: CommitmentEscalation;
  monitoringPlan?: CommitmentMonitoringPlan;
  evidence: string[];
  rationale: string;
  recommendedAction: CommitmentRecommendedAction;
  nextStep: string;
};

export type CommitmentIntegrityBrief = {
  summary: string;
  highestRiskCommitment?: CommitmentIntegritySummary;
  needsOwnerClarification: CommitmentIntegritySummary[];
  atRiskOfDrift: CommitmentIntegritySummary[];
  readyForExecution: CommitmentIntegritySummary[];
  needsEscalation: CommitmentIntegritySummary[];
  activeCommitments: CommitmentIntegritySummary[];
  tasks: CommitmentIntegrityTask[];
};
