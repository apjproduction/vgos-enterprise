import { createScopedId, orgId, type Mission, type PlatformState, type RecommendedAction } from "@/lib/vgos-data";
import type {
  Belief,
  Claim,
  DecisionValidation,
  DecisionValidationStatus
} from "@/kernel/beliefs/belief-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function terms(value: string) {
  return value.toLowerCase().split(/\W+/).filter((term) => term.length > 4);
}

function average(values: number[], fallback: number) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function matchesText(text: string, query: string) {
  const haystack = text.toLowerCase();
  return terms(query).some((term) => haystack.includes(term));
}

function beliefText(belief: Belief) {
  return `${belief.title} ${belief.statement} ${belief.beliefType}`;
}

function claimText(claim: Claim) {
  return `${claim.title} ${claim.statement} ${claim.claimType}`;
}

function selectBeliefs(state: PlatformState, workspaceId: string, query: string) {
  const beliefs = state.beliefs.filter((belief) => belief.workspaceId === workspaceId);
  const related = beliefs.filter((belief) => matchesText(beliefText(belief), query));
  return related.length ? related : beliefs.slice(0, 5);
}

function selectClaims(state: PlatformState, workspaceId: string, query: string) {
  const claims = state.claims.filter((claim) => claim.workspaceId === workspaceId);
  const related = claims.filter((claim) => matchesText(claimText(claim), query));
  return related.length ? related : claims.slice(0, 6);
}

function statusFromAlignment(alignmentScore: number, challengedCount: number, evidenceStrength: number): DecisionValidationStatus {
  if (challengedCount >= 2 && alignmentScore < 0.45) return "CONTRADICTED";
  if (evidenceStrength < 0.45) return "INSUFFICIENT_EVIDENCE";
  if (alignmentScore >= 0.84 && evidenceStrength >= 0.72) return "STRONGLY_SUPPORTED";
  if (alignmentScore >= 0.68) return "SUPPORTED";
  if (alignmentScore >= 0.52) return "MIXED";
  return "WEAKLY_SUPPORTED";
}

function serializeBeliefs(beliefs: Belief[]) {
  return beliefs.map((belief) => ({
    id: belief.id,
    title: belief.title,
    status: belief.status,
    confidenceScore: belief.confidenceScore,
    impactScore: belief.impactScore
  }));
}

function serializeClaims(claims: Claim[]) {
  return claims.map((claim) => ({
    id: claim.id,
    title: claim.title,
    status: claim.status,
    confidenceScore: claim.confidenceScore,
    evidenceStrength: claim.evidenceStrength
  }));
}

export function calculateDecisionBeliefAlignment(input: {
  supportedBeliefs: Belief[];
  challengedBeliefs: Belief[];
  supportingClaims: Claim[];
  challengedClaims: Claim[];
}) {
  const support = average(input.supportedBeliefs.map((belief) => belief.confidenceScore), 0.55) * 0.45 +
    average(input.supportingClaims.map((claim) => claim.confidenceScore), 0.55) * 0.4;
  const challenge = input.challengedBeliefs.length * 0.09 + input.challengedClaims.length * 0.07;
  return clamp01(support - challenge + 0.12);
}

export function explainBeliefSupport(beliefs: Belief[]) {
  if (!beliefs.length) return "No strong supporting beliefs are attached yet.";
  return beliefs
    .slice(0, 3)
    .map((belief) => `${belief.title} (${Math.round(belief.confidenceScore * 100)}%)`)
    .join("; ");
}

export function explainBeliefConflict(beliefs: Belief[]) {
  if (!beliefs.length) return "No material belief conflict is visible.";
  return beliefs
    .slice(0, 3)
    .map((belief) => `${belief.title} is ${belief.status.toLowerCase()}`)
    .join("; ");
}

export function recommendMoreEvidence(validation: Pick<DecisionValidation, "validationStatus" | "challengedBeliefs" | "challengedClaims" | "confidenceScore">) {
  if (validation.validationStatus === "STRONGLY_SUPPORTED" || validation.validationStatus === "SUPPORTED") {
    return "Proceed, but keep outcome measurement attached so the belief loop can update.";
  }

  if (validation.challengedClaims.length || validation.challengedBeliefs.length) {
    return "Collect outcome evidence that directly tests the challenged belief before increasing capacity.";
  }

  if (validation.confidenceScore < 0.6) {
    return "Attach stronger first-party evidence, a measurement, or a learning before committing.";
  }

  return "Run a smaller experiment and review the outcome before scaling.";
}

function createDecisionValidation(input: {
  workspaceId: string;
  organizationId?: string;
  title: string;
  decisionId?: string | null;
  recommendationId?: string | null;
  missionId?: string | null;
  supportedBeliefs: Belief[];
  challengedBeliefs: Belief[];
  supportingClaims: Claim[];
  challengedClaims: Claim[];
}): DecisionValidation {
  const date = nowIso();
  const evidenceStrength = average(input.supportingClaims.map((claim) => claim.evidenceStrength), 0.48);
  const confidenceScore = calculateDecisionBeliefAlignment(input);
  const validationStatus = statusFromAlignment(
    confidenceScore,
    input.challengedBeliefs.length + input.challengedClaims.length,
    evidenceStrength
  );

  return {
    id: createScopedId("decision-validation"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    decisionId: input.decisionId ?? null,
    recommendationId: input.recommendationId ?? null,
    missionId: input.missionId ?? null,
    title: input.title,
    validationStatus,
    supportedBeliefs: serializeBeliefs(input.supportedBeliefs),
    challengedBeliefs: serializeBeliefs(input.challengedBeliefs),
    supportingClaims: serializeClaims(input.supportingClaims),
    challengedClaims: serializeClaims(input.challengedClaims),
    evidenceSummary: `Belief support: ${explainBeliefSupport(input.supportedBeliefs)}. Supporting claims: ${
      input.supportingClaims.slice(0, 3).map((claim) => claim.title).join("; ") || "none attached"
    }.`,
    riskSummary: `${explainBeliefConflict(input.challengedBeliefs)} Safer path: ${recommendMoreEvidence({
      validationStatus,
      challengedBeliefs: serializeBeliefs(input.challengedBeliefs),
      challengedClaims: serializeClaims(input.challengedClaims),
      confidenceScore
    })}`,
    confidenceScore,
    createdAt: date,
    updatedAt: date
  };
}

export function validateRecommendation(
  state: PlatformState,
  workspaceId: string,
  recommendationId?: string
): DecisionValidation {
  const recommendation =
    state.recommendedActions.find((item) => item.id === recommendationId) ??
    state.recommendedActions.find((item) => item.workspaceId === workspaceId);
  const query = recommendation
    ? `${recommendation.title} ${recommendation.description} ${recommendation.reasoning} ${recommendation.expectedImpact}`
    : "workspace recommendation";
  const beliefs = selectBeliefs(state, workspaceId, query);
  const claims = selectClaims(state, workspaceId, query);
  const supportedBeliefs = beliefs.filter((belief) => ["CORE", "ACTIVE"].includes(belief.status));
  const challengedBeliefs = beliefs.filter((belief) => belief.status === "CHALLENGED");
  const supportingClaims = claims.filter((claim) => ["SUPPORTED", "VALIDATED"].includes(claim.status));
  const challengedClaims = claims.filter((claim) => ["CHALLENGED", "INVALIDATED"].includes(claim.status));

  return createDecisionValidation({
    workspaceId,
    organizationId: recommendation?.organizationId,
    title: recommendation ? `Validate recommendation: ${recommendation.title}` : "Validate current recommendation",
    recommendationId: recommendation?.id ?? recommendationId ?? null,
    missionId: null,
    supportedBeliefs,
    challengedBeliefs,
    supportingClaims,
    challengedClaims
  });
}

export function validateDecision(
  state: PlatformState,
  workspaceId: string,
  decisionId?: string
): DecisionValidation {
  const situation =
    state.decisionSituations.find((item) => item.id === decisionId) ??
    state.decisionSituations.find((item) => item.workspaceId === workspaceId);
  const query = situation ? `${situation.title} ${situation.description}` : "workspace decision";
  const beliefs = selectBeliefs(state, workspaceId, query);
  const claims = selectClaims(state, workspaceId, query);

  return createDecisionValidation({
    workspaceId,
    organizationId: situation?.organizationId,
    title: situation ? `Validate decision: ${situation.title}` : "Validate current decision",
    decisionId: situation?.id ?? decisionId ?? null,
    missionId: situation?.missionId ?? null,
    supportedBeliefs: beliefs.filter((belief) => ["CORE", "ACTIVE"].includes(belief.status)),
    challengedBeliefs: beliefs.filter((belief) => belief.status === "CHALLENGED"),
    supportingClaims: claims.filter((claim) => ["SUPPORTED", "VALIDATED"].includes(claim.status)),
    challengedClaims: claims.filter((claim) => ["CHALLENGED", "INVALIDATED"].includes(claim.status))
  });
}

export function validateMissionAgainstBeliefs(
  state: PlatformState,
  workspaceId: string,
  missionId?: string
): DecisionValidation {
  const mission =
    state.missions.find((item) => item.id === missionId) ??
    state.missions.find((item) => item.workspaceId === workspaceId);
  const query = mission ? `${mission.title} ${mission.description} ${mission.notes}` : "workspace mission";
  const beliefs = selectBeliefs(state, workspaceId, query);
  const claims = selectClaims(state, workspaceId, query);

  return createDecisionValidation({
    workspaceId,
    organizationId: mission?.organizationId,
    title: mission ? `Validate mission: ${mission.title}` : "Validate current mission",
    missionId: mission?.id ?? missionId ?? null,
    supportedBeliefs: beliefs.filter((belief) => ["CORE", "ACTIVE"].includes(belief.status)),
    challengedBeliefs: beliefs.filter((belief) => belief.status === "CHALLENGED"),
    supportingClaims: claims.filter((claim) => ["SUPPORTED", "VALIDATED"].includes(claim.status)),
    challengedClaims: claims.filter((claim) => ["CHALLENGED", "INVALIDATED"].includes(claim.status))
  });
}

export function explainRecommendationBeliefAlignment(
  state: PlatformState,
  workspaceId: string,
  recommendation: RecommendedAction
) {
  const validation = validateRecommendation(state, workspaceId, recommendation.id);
  return `${validation.title} is ${validation.validationStatus.toLowerCase().replace(/_/g, " ")} with ${Math.round(validation.confidenceScore * 100)}% belief alignment. ${validation.evidenceSummary}`;
}

export function explainMissionBeliefAlignment(state: PlatformState, workspaceId: string, mission: Mission) {
  const validation = validateMissionAgainstBeliefs(state, workspaceId, mission.id);
  return `${mission.title} is ${validation.validationStatus.toLowerCase().replace(/_/g, " ")} by current beliefs. ${validation.riskSummary}`;
}
