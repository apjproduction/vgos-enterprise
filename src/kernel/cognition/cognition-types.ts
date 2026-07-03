import type {
  ExecutionItem,
  ExecutionResult,
  Learning,
  Measurement,
  Mission,
  RecommendedAction
} from "@/lib/vgos-data";

export type AssumptionStatus =
  | "ACTIVE"
  | "VALIDATED"
  | "INVALIDATED"
  | "WATCHING"
  | "ARCHIVED"
  | "UNTESTED"
  | "NEEDS_EVIDENCE";

export type CognitionRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CognitionEvidenceType =
  | "SIGNAL"
  | "MEASUREMENT"
  | "LEARNING"
  | "EXECUTION_RESULT"
  | "CONNECTOR_DATA"
  | "MANUAL_NOTE"
  | "HISTORICAL_PATTERN"
  | "COUNTER_EVIDENCE";

export type CognitionRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type Assumption = CognitionRecord & {
  title: string;
  description: string;
  sourceType?: string | null;
  sourceId?: string | null;
  status: AssumptionStatus;
  confidenceScore: number;
  riskLevel: CognitionRiskLevel;
  validationMethod?: string | null;
  validatedAt?: string | null;
  invalidatedAt?: string | null;
};

export type EvidenceAssessment = CognitionRecord & {
  sourceType: string;
  sourceId: string;
  evidenceType: CognitionEvidenceType;
  summary: string;
  strengthScore: number;
  reliabilityScore: number;
  recencyScore: number;
  freshnessScore: number;
  relevanceScore: number;
  overallScore: number;
  supportsRecommendation: boolean;
  weakensRecommendation: boolean;
  limitations: string;
};

export type TradeoffAnalysis = CognitionRecord & {
  title: string;
  sourceType?: string | null;
  sourceId?: string | null;
  optionA: string;
  optionB: string;
  optionC?: string | null;
  optionAScore: number;
  optionBScore: number;
  recommendedOption: string;
  rationale: string;
  opportunityCost: string;
  riskSummary: string;
  confidenceScore: number;
  relatedRecommendationId?: string | null;
  relatedMissionId?: string | null;
};

export type Reflection = CognitionRecord & {
  title: string;
  sourceType?: string | null;
  sourceId?: string | null;
  summary: string;
  whatWorked: string;
  whatFailed: string;
  wrongAssumptions: string;
  newLearning: string;
  futureAdjustment: string;
  confidenceScore: number;
  originalJudgment?: string | null;
  outcomeSummary?: string | null;
  wasCorrect?: boolean | null;
  whatWasMissed?: string | null;
  whatChanged?: string | null;
  lesson?: string | null;
  recalibrationSuggestion?: string | null;
};

export type JudgmentRecord = CognitionRecord & {
  title: string;
  recommendationId?: string | null;
  missionId?: string | null;
  judgment: string;
  confidenceScore: number;
  reasoning: string;
  assumptions: unknown[];
  supportingEvidence: unknown[];
  counterEvidence: unknown[];
  tradeoffs: unknown[];
  changeTriggers: unknown[];
};

export type AssumptionInput = {
  workspaceId: string;
  organizationId?: string;
  title: string;
  description: string;
  sourceType?: string | null;
  sourceId?: string | null;
  status?: AssumptionStatus;
  confidenceScore?: number;
  riskLevel?: CognitionRiskLevel;
  validationMethod?: string | null;
  validatedAt?: string | null;
  invalidatedAt?: string | null;
};

export type EvidenceAssessmentInput = {
  workspaceId: string;
  organizationId?: string;
  sourceType: string;
  sourceId: string;
  evidenceType: CognitionEvidenceType;
  summary: string;
  strengthScore?: number;
  reliabilityScore?: number;
  recencyScore?: number;
  freshnessScore?: number;
  relevanceScore?: number;
  limitations?: string;
  supportsRecommendation?: boolean;
  weakensRecommendation?: boolean;
  occurredAt?: string;
  firstParty?: boolean;
  hasMeasurement?: boolean;
  consistencyScore?: number;
  businessImpactScore?: number;
};

export type TradeoffOption = {
  label: string;
  expectedImpact: number;
  risk: number;
  effort: number;
  confidence: number;
};

export type TradeoffInput = {
  workspaceId: string;
  organizationId?: string;
  title: string;
  sourceType?: string | null;
  sourceId?: string | null;
  options: [TradeoffOption, TradeoffOption, TradeoffOption?];
};

export type JudgmentInput = {
  state: {
    assumptions: Assumption[];
    evidenceAssessments: EvidenceAssessment[];
    tradeoffAnalyses: TradeoffAnalysis[];
    judgmentRecords: JudgmentRecord[];
    reflections: Reflection[];
    recommendedActions: RecommendedAction[];
    executionItems: ExecutionItem[];
    executionResults: ExecutionResult[];
    measurements: Measurement[];
    learnings: Learning[];
    missions: Mission[];
  };
  workspaceId: string;
  sourceId?: string;
  sourceType?: string;
};

export type ExecutiveJudgment = {
  sourceType: string;
  sourceId: string;
  title: string;
  observation: string;
  interpretation: string;
  assumptions: Assumption[];
  evidence: EvidenceAssessment[];
  counterEvidence: string[];
  tradeoff?: TradeoffAnalysis;
  finalRecommendation: string;
  confidenceScore: number;
  confidenceExplanation: string;
  decisionRisk: CognitionRiskLevel;
  whatWouldChangeRecommendation: string[];
  shouldDefer: boolean;
  suggestedNextAction: string;
};

export type WorkItemCognition = {
  relatedMission?: Mission;
  expectedImpact: string;
  evidenceStrength: number;
  assumptions: Assumption[];
  counterRisk: string;
  tradeoff: string;
  flags: string[];
};

export type MissionCognition = {
  highRiskAssumptions: Assumption[];
  weakEvidenceAreas: EvidenceAssessment[];
  majorTradeoffs: TradeoffAnalysis[];
  reflections: Reflection[];
  judgmentConfidence: number;
};
