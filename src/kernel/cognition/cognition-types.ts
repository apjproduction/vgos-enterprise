import type {
  ExecutionItem,
  ExecutionResult,
  Learning,
  Measurement,
  Mission,
  RecommendedAction
} from "@/lib/vgos-data";

export type AssumptionStatus = "UNTESTED" | "VALIDATED" | "INVALIDATED" | "NEEDS_EVIDENCE" | "ARCHIVED";

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
  relevanceScore: number;
  overallScore: number;
  limitations: string;
};

export type TradeoffAnalysis = CognitionRecord & {
  title: string;
  sourceType?: string | null;
  sourceId?: string | null;
  optionA: string;
  optionB: string;
  optionC?: string | null;
  recommendedOption: string;
  rationale: string;
  opportunityCost: string;
  riskSummary: string;
  confidenceScore: number;
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
  relevanceScore?: number;
  limitations?: string;
  occurredAt?: string;
  firstParty?: boolean;
  hasMeasurement?: boolean;
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
};

export type MissionCognition = {
  highRiskAssumptions: Assumption[];
  weakEvidenceAreas: EvidenceAssessment[];
  majorTradeoffs: TradeoffAnalysis[];
  reflections: Reflection[];
  judgmentConfidence: number;
};
