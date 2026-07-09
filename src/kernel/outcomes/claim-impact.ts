import {
  clampScore,
  nowIso,
  type ClaimImpact,
  type ClaimImpactInput,
  type ClaimImpactType,
  type InstructionResult,
  type UpdatedClaim
} from "@/kernel/outcomes/outcome-types";

function impactFromEvaluation(input: ClaimImpactInput): ClaimImpactType {
  const { evaluation, attribution } = input;
  const confidence = Math.min(evaluation.confidenceScore, attribution?.confidenceScore ?? evaluation.confidenceScore);
  const actual = evaluation.actualOutcome.toLowerCase();

  if (evaluation.warnings.some((warning) => /not yet measurable|actual outcome has not been recorded/i.test(warning))) {
    return "NO_CLEAR_IMPACT";
  }
  if (confidence < 0.5) return "NO_CLEAR_IMPACT";
  if (/contradict|failed|declined|lagged|unclear|weak|short-term roi remained unclear|no measurable/.test(actual)) {
    return confidence >= 0.72 ? "INVALIDATES" : "CHALLENGES";
  }
  if (evaluation.successScore >= 0.76 && confidence >= 0.74) return "VALIDATES";
  if (evaluation.successScore >= 0.55) return "SUPPORTS";
  if (evaluation.successScore < 0.45) return "CHALLENGES";
  return "NO_CLEAR_IMPACT";
}

function statusForImpact(previousStatus: string, impactType: ClaimImpactType) {
  if (impactType === "VALIDATES") return "VALIDATED";
  if (impactType === "SUPPORTS") return previousStatus === "VALIDATED" ? "VALIDATED" : "SUPPORTED";
  if (impactType === "CHALLENGES") return "CHALLENGED";
  if (impactType === "INVALIDATES") return "INVALIDATED";
  return previousStatus;
}

function deltaForImpact(impactType: ClaimImpactType, confidenceScore: number) {
  if (impactType === "VALIDATES") return Math.min(0.16, 0.06 + confidenceScore * 0.08);
  if (impactType === "SUPPORTS") return Math.min(0.1, 0.04 + confidenceScore * 0.05);
  if (impactType === "CHALLENGES") return -Math.min(0.12, 0.04 + confidenceScore * 0.07);
  if (impactType === "INVALIDATES") return -Math.min(0.2, 0.08 + confidenceScore * 0.1);
  return 0;
}

export function determineClaimImpact(input: ClaimImpactInput): InstructionResult<ClaimImpact> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.claim?.id) return { success: false, error: "claim is required." };
  const impactType = impactFromEvaluation(input);
  const confidence = Math.min(input.evaluation.confidenceScore, input.attribution?.confidenceScore ?? input.evaluation.confidenceScore);
  const confidenceDelta = deltaForImpact(impactType, confidence);
  const newStatus = statusForImpact(input.claim.status, impactType);
  const warnings = [
    impactType === "VALIDATES" && !(input.evidenceIds?.length || input.attribution?.evidenceIds.length)
      ? "Claim was validated without sufficient evidence."
      : "",
    confidence < 0.58 ? "Claim impact confidence is low." : ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      id: `claim-impact-${input.outcomeId}-${input.claim.id}`,
      workspaceId: input.workspaceId,
      claimId: input.claim.id,
      outcomeId: input.outcomeId,
      impactType,
      confidenceDelta,
      previousStatus: input.claim.status,
      newStatus,
      rationale: `${input.evaluation.deltaSummary} Claim "${input.claim.title ?? input.claim.id}" is ${impactType.toLowerCase().replace(/_/g, " ")} with ${Math.round(confidence * 100)}% confidence.`,
      evidenceIds: input.evidenceIds ?? input.attribution?.evidenceIds ?? [],
      createdAt: nowIso(input.now)
    },
    warnings
  };
}

export function updateClaimFromOutcome(input: { claim: UpdatedClaim | ClaimImpactInput["claim"]; impact: ClaimImpact }): InstructionResult<UpdatedClaim> {
  const previousConfidence = input.claim.confidenceScore ?? 0.5;
  const previousEvidenceStrength = input.claim.evidenceStrength ?? 0.5;

  return {
    success: true,
    data: {
      ...input.claim,
      status: input.impact.newStatus,
      confidenceScore: clampScore(previousConfidence + input.impact.confidenceDelta),
      evidenceStrength: clampScore(previousEvidenceStrength + input.impact.confidenceDelta * 0.75)
    }
  };
}
