import {
  clampScore,
  nowIso,
  type CapabilityImpact,
  type CapabilityImpactInput,
  type CapabilityImpactType,
  type InstructionResult,
  type UpdatedCapability
} from "@/kernel/outcomes/outcome-types";

function impactFromEvaluation(input: CapabilityImpactInput): CapabilityImpactType {
  if (input.evaluation.warnings.some((warning) => /not yet measurable|actual outcome has not been recorded/i.test(warning))) {
    return "NO_CLEAR_IMPACT";
  }
  if (input.capabilityExists === false && input.evaluation.successScore >= 0.55) return "CREATED";
  if (input.evaluation.successScore >= 0.72) return "IMPROVED";
  if (input.evaluation.successScore >= 0.55) return "CONFIRMED";
  if (input.evaluation.successScore < 0.42 && input.evaluation.confidenceScore >= 0.55) return "WEAKENED";
  return "NO_CLEAR_IMPACT";
}

function maturityDeltaForImpact(impactType: CapabilityImpactType, confidenceScore: number) {
  if (impactType === "CREATED") return Math.min(0.24, 0.12 + confidenceScore * 0.08);
  if (impactType === "IMPROVED") return Math.min(0.18, 0.07 + confidenceScore * 0.08);
  if (impactType === "CONFIRMED") return Math.min(0.08, 0.03 + confidenceScore * 0.04);
  if (impactType === "WEAKENED") return -Math.min(0.14, 0.05 + confidenceScore * 0.07);
  return 0;
}

export function determineCapabilityImpact(input: CapabilityImpactInput): InstructionResult<CapabilityImpact> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.capability?.id) return { success: false, error: "capability is required." };
  const impactType = impactFromEvaluation(input);
  const confidence = Math.min(input.evaluation.confidenceScore, input.attribution?.confidenceScore ?? input.evaluation.confidenceScore);
  const maturityDelta = maturityDeltaForImpact(impactType, confidence);
  const confidenceDelta = maturityDelta * 0.65;
  const warnings = [
    impactType === "NO_CLEAR_IMPACT" ? "Capability impact is unclear." : "",
    confidence < 0.58 ? "Capability impact confidence is low." : "",
    impactType !== "NO_CLEAR_IMPACT" && !(input.evidenceIds?.length || input.attribution?.evidenceIds.length)
      ? "Capability maturity changed without evidence ids."
      : ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      id: `capability-impact-${input.outcomeId}-${input.capability.id}`,
      workspaceId: input.workspaceId,
      capabilityId: input.capability.id,
      outcomeId: input.outcomeId,
      impactType,
      maturityDelta,
      confidenceDelta,
      rationale: `${input.evaluation.deltaSummary} Capability "${input.capability.name ?? input.capability.id}" is ${impactType.toLowerCase().replace(/_/g, " ")} with ${Math.round(confidence * 100)}% confidence.`,
      evidenceIds: input.evidenceIds ?? input.attribution?.evidenceIds ?? [],
      createdAt: nowIso(input.now)
    },
    warnings
  };
}

export function updateCapabilityFromOutcome(input: {
  capability: UpdatedCapability | CapabilityImpactInput["capability"];
  impact: CapabilityImpact;
}): InstructionResult<UpdatedCapability> {
  return {
    success: true,
    data: {
      ...input.capability,
      maturityScore: clampScore((input.capability.maturityScore ?? 0.5) + input.impact.maturityDelta),
      confidenceScore: clampScore((input.capability.confidenceScore ?? 0.5) + input.impact.confidenceDelta)
    }
  };
}
