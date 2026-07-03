import { createScopedId, orgId, type PlatformState } from "@/lib/vgos-data";
import type {
  Belief,
  BeliefRevision,
  BeliefRevisionInput,
  Claim,
  ClaimEvidence,
  RealityModel
} from "@/kernel/beliefs/belief-types";
import { calculateBeliefStability } from "@/kernel/beliefs/belief-engine";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function terms(value: string) {
  return value.toLowerCase().split(/\W+/).filter((term) => term.length > 4);
}

function relatedClaimsForBelief(state: PlatformState, belief: Belief): Claim[] {
  const linkedClaimIds = state.beliefClaims
    .filter((link) => link.beliefId === belief.id)
    .map((link) => link.claimId);
  const direct = state.claims.filter((claim) => linkedClaimIds.includes(claim.id));
  if (direct.length) return direct;

  const beliefTerms = terms(`${belief.title} ${belief.statement}`);
  return state.claims.filter((claim) => {
    const haystack = `${claim.title} ${claim.statement}`.toLowerCase();
    return claim.workspaceId === belief.workspaceId && beliefTerms.some((term) => haystack.includes(term));
  });
}

export function validateBeliefAgainstEvidence(
  belief: Belief,
  claims: Claim[],
  evidence: ClaimEvidence[]
) {
  const relatedEvidence = evidence.filter((item) => claims.some((claim) => claim.id === item.claimId));
  const supportScore = relatedEvidence
    .filter((item) => item.supportsClaim)
    .reduce((sum, item) => sum + item.strengthScore, 0);
  const challengeScore = relatedEvidence
    .filter((item) => item.weakensClaim)
    .reduce((sum, item) => sum + item.strengthScore, 0);
  const netEvidence = clamp01((supportScore + belief.confidenceScore) / Math.max(1, relatedEvidence.length + 1) - challengeScore * 0.08);
  const stabilityScore = calculateBeliefStability(claims);

  return {
    belief,
    claims,
    evidence: relatedEvidence,
    supportScore: clamp01(supportScore),
    challengeScore: clamp01(challengeScore),
    netEvidence,
    stabilityScore,
    shouldRevise: Math.abs(netEvidence - belief.confidenceScore) >= 0.12 || challengeScore > supportScore,
    summary:
      challengeScore > supportScore
        ? `${belief.title} is challenged by stronger weakening evidence.`
        : `${belief.title} remains supported by the current claim set.`
  };
}

export function detectBeliefDrift(state: PlatformState, workspaceId: string) {
  return state.beliefs
    .filter((belief) => belief.workspaceId === workspaceId && belief.status !== "RETIRED")
    .map((belief) => {
      const revisions = state.beliefRevisions.filter((revision) => revision.beliefId === belief.id);
      const lastRevision = revisions.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
      const driftScore = lastRevision ? Math.abs(lastRevision.newConfidence - belief.confidenceScore) : 0;
      const challengedClaimCount = relatedClaimsForBelief(state, belief).filter((claim) =>
        ["CHALLENGED", "INVALIDATED"].includes(claim.status)
      ).length;

      return {
        belief,
        driftScore: clamp01(driftScore + challengedClaimCount * 0.08),
        reason: challengedClaimCount
          ? `${challengedClaimCount} linked claim(s) are challenged.`
          : "No major belief drift detected."
      };
    })
    .filter((item) => item.driftScore >= 0.08)
    .sort((a, b) => b.driftScore - a.driftScore);
}

export function detectContradictoryClaims(claims: Claim[]) {
  const contradictions: Array<{ claim: Claim; contradictoryClaim: Claim; reason: string }> = [];

  for (const claim of claims) {
    const claimTerms = terms(`${claim.title} ${claim.statement}`);
    for (const candidate of claims) {
      if (candidate.id === claim.id || candidate.workspaceId !== claim.workspaceId) continue;
      const candidateText = `${candidate.title} ${candidate.statement}`.toLowerCase();
      const overlaps = claimTerms.filter((term) => candidateText.includes(term)).length;
      const statusConflict =
        (claim.status === "VALIDATED" && ["CHALLENGED", "INVALIDATED"].includes(candidate.status)) ||
        (candidate.status === "VALIDATED" && ["CHALLENGED", "INVALIDATED"].includes(claim.status));

      if (overlaps >= 2 && statusConflict) {
        contradictions.push({
          claim,
          contradictoryClaim: candidate,
          reason: "The claims share domain language but carry conflicting validation states."
        });
      }
    }
  }

  return contradictions.slice(0, 8);
}

export function recommendBeliefRevision(input: {
  belief: Belief;
  validation: ReturnType<typeof validateBeliefAgainstEvidence>;
}) {
  const newConfidence = clamp01(input.belief.confidenceScore * 0.55 + input.validation.netEvidence * 0.45);
  const direction = newConfidence > input.belief.confidenceScore ? "increase" : "reduce";

  return {
    beliefId: input.belief.id,
    previousConfidence: input.belief.confidenceScore,
    newConfidence,
    reason: `Recommended to ${direction} confidence because ${input.validation.summary}`,
    triggeredByType: "BeliefValidation",
    triggeredById: input.belief.id
  };
}

export function createBeliefRevision(input: BeliefRevisionInput): BeliefRevision {
  return {
    id: createScopedId("belief-revision"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    beliefId: input.beliefId,
    previousConfidence: input.previousConfidence,
    newConfidence: input.newConfidence,
    reason: input.reason,
    triggeredByType: input.triggeredByType,
    triggeredById: input.triggeredById,
    createdAt: nowIso()
  };
}

export function updateRealityModel(model: RealityModel, revision: BeliefRevision): RealityModel {
  return {
    ...model,
    generatedAt: nowIso(),
    decisionValidationSummary:
      `${model.decisionValidationSummary} Belief ${revision.beliefId} was revised from ${Math.round(revision.previousConfidence * 100)}% to ${Math.round(revision.newConfidence * 100)}%.`
  };
}
