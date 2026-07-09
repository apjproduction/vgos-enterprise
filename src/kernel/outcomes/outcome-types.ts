export type InstructionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
};

export type OutcomeAttributionType =
  | "PRIMARY_CAUSE"
  | "CONTRIBUTING_FACTOR"
  | "BLOCKING_FACTOR"
  | "ENABLING_FACTOR"
  | "UNKNOWN"
  | "SPURIOUS";

export type ClaimImpactType =
  | "VALIDATES"
  | "SUPPORTS"
  | "CHALLENGES"
  | "INVALIDATES"
  | "NO_CLEAR_IMPACT";

export type CapabilityImpactType =
  | "IMPROVED"
  | "WEAKENED"
  | "CONFIRMED"
  | "CREATED"
  | "NO_CLEAR_IMPACT";

export type OutcomeEvaluation = {
  outcomeId: string;
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  expectedOutcome: string;
  actualOutcome: string;
  deltaSummary: string;
  successScore: number;
  confidenceScore: number;
  evaluationSummary: string;
  evaluatedAt: string;
  warnings: string[];
};

export type OutcomeAttribution = {
  id: string;
  workspaceId: string;
  outcomeId: string;
  attributedSourceType: string;
  attributedSourceId: string;
  attributionType: OutcomeAttributionType;
  contributionScore: number;
  confidenceScore: number;
  rationale: string;
  evidenceIds: string[];
  createdAt: string;
};

export type LearningLoopIntegrity = {
  sourceType: string;
  sourceId: string;
  workspaceId: string;
  hasExpectedOutcome: boolean;
  hasActualOutcome: boolean;
  hasEvaluation: boolean;
  hasAttribution: boolean;
  hasReflection: boolean;
  hasClaimImpact: boolean;
  hasCapabilityImpact: boolean;
  hasStateTransition: boolean;
  integrityScore: number;
  complete: boolean;
  warnings: string[];
};

export type ClaimImpact = {
  id: string;
  workspaceId: string;
  claimId: string;
  outcomeId: string;
  impactType: ClaimImpactType;
  confidenceDelta: number;
  previousStatus: string;
  newStatus: string;
  rationale: string;
  evidenceIds: string[];
  createdAt: string;
};

export type CapabilityImpact = {
  id: string;
  workspaceId: string;
  capabilityId: string;
  outcomeId: string;
  impactType: CapabilityImpactType;
  maturityDelta: number;
  confidenceDelta: number;
  rationale: string;
  evidenceIds: string[];
  createdAt: string;
};

export type LearningArtifact = {
  id: string;
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  lesson: string;
  reusableLearning: string;
  appliesTo: string[];
  confidenceScore: number;
  evidenceIds: string[];
  createdAt: string;
};

export type EvidenceSignal = {
  id: string;
  summary?: string;
  strengthScore?: number;
  directlySupportsCausality?: boolean;
};

export type OutcomeRecordLike = {
  id: string;
  workspaceId: string;
  title?: string;
  sourceType?: string;
  sourceId?: string;
  expectedOutcome?: string | null;
  actualOutcome?: string | null;
  resultSummary?: string | null;
  learnings?: string | null;
  successCriteria?: string[];
  evidenceIds?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type OutcomeEvaluationInput = {
  workspaceId: string;
  outcomeId?: string;
  sourceType: string;
  sourceId: string;
  expectedOutcome?: string | null;
  actualOutcome?: string | null;
  successCriteria?: string[];
  evidenceIds?: string[];
  evidence?: EvidenceSignal[];
  commitmentIntegrityScore?: number;
  executionQualityScore?: number;
  decisionQualityScore?: number;
  assumptions?: Array<{
    id?: string;
    statement: string;
    status?: string;
    confidenceScore?: number;
    evidenceIds?: string[];
  }>;
  blockers?: string[];
  timeDelayDays?: number;
  confidenceLevel?: number;
  now?: string;
};

export type AttributionConfidenceInput = {
  sourceLinked?: boolean;
  evidenceDirectness?: number;
  evidenceStrength?: number;
  outcomeMeasurable?: boolean;
  timingPlausible?: boolean;
  alternativeExplanations?: number;
  executionDataExists?: boolean;
  reflectionConfirms?: boolean;
  successCriteriaDefined?: boolean;
  outcomeVagueness?: number;
  timeDelayDays?: number;
  externalFactorsLikely?: boolean;
};

export type AttributionConfidence = {
  confidenceScore: number;
  positiveFactors: string[];
  negativeFactors: string[];
};

export type OutcomeAttributionInput = AttributionConfidenceInput & {
  id?: string;
  workspaceId: string;
  outcomeId: string;
  attributedSourceType: string;
  attributedSourceId: string;
  attributionType?: OutcomeAttributionType;
  contributionScore?: number;
  rationale?: string;
  evidenceIds?: string[];
  now?: string;
};

export type LearningLoopIntegrityInput = {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  expectedOutcome?: string | null;
  actualOutcome?: string | null;
  evaluation?: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  reflectionExists?: boolean;
  claimImpact?: ClaimImpact;
  capabilityImpact?: CapabilityImpact;
  stateTransitionRecorded?: boolean;
  learningArtifact?: LearningArtifact;
};

export type ClaimLike = {
  id: string;
  workspaceId?: string;
  title?: string;
  statement?: string;
  status: string;
  confidenceScore?: number;
  evidenceStrength?: number;
};

export type ClaimImpactInput = {
  workspaceId: string;
  claim: ClaimLike;
  outcomeId: string;
  evaluation: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  evidenceIds?: string[];
  now?: string;
};

export type CapabilityLike = {
  id: string;
  name?: string;
  maturityScore?: number;
  confidenceScore?: number;
};

export type CapabilityImpactInput = {
  workspaceId: string;
  capability: CapabilityLike;
  outcomeId: string;
  evaluation: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  evidenceIds?: string[];
  capabilityExists?: boolean;
  now?: string;
};

export type LearningArtifactInput = {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  outcomeId: string;
  evaluation: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  claimImpact?: ClaimImpact;
  capabilityImpact?: CapabilityImpact;
  appliesTo?: string[];
  now?: string;
};

export type OutcomeReflection = {
  id: string;
  workspaceId: string;
  title: string;
  sourceType: string;
  sourceId: string;
  summary: string;
  whatWorked: string;
  whatFailed: string;
  wrongAssumptions: string;
  newLearning: string;
  futureAdjustment: string;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdatedClaim = ClaimLike & {
  status: string;
  confidenceScore: number;
  evidenceStrength: number;
};

export type UpdatedCapability = CapabilityLike & {
  maturityScore: number;
  confidenceScore: number;
};

export type OutcomeLearningTaskType =
  | "RECORD_MISSING_OUTCOME"
  | "EVALUATE_COMPLETED_COMMITMENT"
  | "ADD_ATTRIBUTION_EVIDENCE"
  | "CONVERT_OUTCOME_TO_REFLECTION"
  | "UPDATE_RELATED_CLAIM"
  | "UPDATE_CAPABILITY_MATURITY"
  | "CREATE_REUSABLE_LEARNING_ARTIFACT"
  | "REVIEW_LOW_CONFIDENCE_ATTRIBUTION"
  | "COMPLETE_LEARNING_LOOP";

export type OutcomeLearningTask = {
  id: string;
  title: string;
  taskType: OutcomeLearningTaskType;
  sourceType: string;
  sourceId: string;
  outcomeId?: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export type OutcomeLearningSummary = {
  workspaceId: string;
  generatedAt: string;
  mostImportantRecentOutcome?: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  learningArtifact?: LearningArtifact;
  claimImpact?: ClaimImpact;
  capabilityImpact?: CapabilityImpact;
  incompleteLearningLoop?: LearningLoopIntegrity;
  commitmentMissingOutcomeEvaluation?: { id: string; title: string };
  summary: string;
  tasks: OutcomeLearningTask[];
  warnings: string[];
};

export type OutcomeLearningState = {
  outcomes?: OutcomeRecordLike[];
  outcomeEvaluations?: OutcomeEvaluation[];
  outcomeAttributions?: OutcomeAttribution[];
  learningLoopIntegrities?: LearningLoopIntegrity[];
  claimImpacts?: ClaimImpact[];
  capabilityImpacts?: CapabilityImpact[];
  learningArtifacts?: LearningArtifact[];
  reflections?: Array<{ sourceType?: string | null; sourceId?: string | null }>;
  decisionCommitments?: Array<{
    id: string;
    title: string;
    workspaceId: string;
    status?: string;
    expectedOutcome?: string | null;
  }>;
  executionItems?: Array<{
    id: string;
    title: string;
    workspaceId: string;
    status?: string;
    actualImpact?: string;
    completedAt?: string;
  }>;
};

export function clampScore(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

export function nowIso(input?: string) {
  return input ?? new Date().toISOString();
}

export function hasMeaningfulText(value?: string | null) {
  return Boolean(value && value.trim().length > 0 && !/^(n\/a|none|null|unknown)$/i.test(value.trim()));
}

export function uniqueWarnings(warnings: Array<string | undefined | false | null>) {
  return [...new Set(warnings.filter(Boolean) as string[])];
}
