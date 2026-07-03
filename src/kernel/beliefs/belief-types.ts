export type ClaimType =
  | "MARKET"
  | "CUSTOMER"
  | "PRODUCT"
  | "GROWTH"
  | "SEO"
  | "AEO"
  | "GEO"
  | "CHANNEL"
  | "COMPETITOR"
  | "OPERATIONAL"
  | "STRATEGIC"
  | "PHILOSOPHICAL"
  | "CUSTOM";

export type ClaimStatus =
  | "PROPOSED"
  | "SUPPORTED"
  | "CHALLENGED"
  | "VALIDATED"
  | "INVALIDATED"
  | "ARCHIVED";

export type BeliefType =
  | "MARKET_BELIEF"
  | "CUSTOMER_BELIEF"
  | "PRODUCT_BELIEF"
  | "GROWTH_BELIEF"
  | "STRATEGIC_BELIEF"
  | "OPERATING_BELIEF"
  | "PHILOSOPHICAL_BELIEF"
  | "CUSTOM";

export type BeliefStatus = "ACTIVE" | "WATCHING" | "CORE" | "CHALLENGED" | "RETIRED";

export type DecisionValidationStatus =
  | "STRONGLY_SUPPORTED"
  | "SUPPORTED"
  | "MIXED"
  | "WEAKLY_SUPPORTED"
  | "CONTRADICTED"
  | "INSUFFICIENT_EVIDENCE";

export type BeliefRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type Claim = BeliefRecord & {
  title: string;
  statement: string;
  claimType: ClaimType;
  status: ClaimStatus;
  confidenceScore: number;
  evidenceStrength: number;
  sourceType?: string | null;
  sourceId?: string | null;
};

export type ClaimEvidence = BeliefRecord & {
  claimId: string;
  evidenceType: string;
  sourceType: string;
  sourceId: string;
  summary: string;
  strengthScore: number;
  supportsClaim: boolean;
  weakensClaim: boolean;
};

export type Belief = BeliefRecord & {
  title: string;
  statement: string;
  beliefType: BeliefType;
  status: BeliefStatus;
  confidenceScore: number;
  stabilityScore: number;
  impactScore: number;
  lastChallengedAt?: string | null;
};

export type BeliefClaim = {
  id: string;
  organizationId: string;
  workspaceId: string;
  beliefId: string;
  claimId: string;
  weight: number;
  createdAt: string;
};

export type BeliefRevision = {
  id: string;
  organizationId: string;
  workspaceId: string;
  beliefId: string;
  previousConfidence: number;
  newConfidence: number;
  reason: string;
  triggeredByType: string;
  triggeredById: string;
  createdAt: string;
};

export type DecisionValidation = BeliefRecord & {
  decisionId?: string | null;
  recommendationId?: string | null;
  missionId?: string | null;
  title: string;
  validationStatus: DecisionValidationStatus;
  supportedBeliefs: unknown[];
  challengedBeliefs: unknown[];
  supportingClaims: unknown[];
  challengedClaims: unknown[];
  evidenceSummary: string;
  riskSummary: string;
  confidenceScore: number;
};

export type ClaimInput = {
  workspaceId: string;
  organizationId?: string;
  title: string;
  statement: string;
  claimType?: ClaimType;
  status?: ClaimStatus;
  confidenceScore?: number;
  evidenceStrength?: number;
  sourceType?: string | null;
  sourceId?: string | null;
};

export type ClaimEvidenceInput = {
  workspaceId: string;
  organizationId?: string;
  claimId: string;
  evidenceType: string;
  sourceType: string;
  sourceId: string;
  summary: string;
  strengthScore?: number;
  supportsClaim?: boolean;
  weakensClaim?: boolean;
};

export type BeliefInput = {
  workspaceId: string;
  organizationId?: string;
  title: string;
  statement: string;
  beliefType?: BeliefType;
  status?: BeliefStatus;
  confidenceScore?: number;
  stabilityScore?: number;
  impactScore?: number;
  lastChallengedAt?: string | null;
};

export type BeliefRevisionInput = {
  workspaceId: string;
  organizationId?: string;
  beliefId: string;
  previousConfidence: number;
  newConfidence: number;
  reason: string;
  triggeredByType: string;
  triggeredById: string;
};

export type RealityModel = {
  workspaceId: string;
  generatedAt: string;
  strongestBeliefs: Belief[];
  challengedBeliefs: Belief[];
  highestConfidenceClaims: Claim[];
  weakestEvidenceAreas: Array<{
    domain: string;
    summary: string;
    evidenceStrength: number;
  }>;
  currentStrategicAssumptions: string[];
  decisionValidationSummary: string;
};
