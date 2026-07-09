import { computeAttributionConfidence } from "@/kernel/outcomes/attribution-confidence";
import {
  clampScore,
  nowIso,
  type InstructionResult,
  type OutcomeAttribution,
  type OutcomeAttributionInput,
  type OutcomeAttributionType
} from "@/kernel/outcomes/outcome-types";

function attributionTypeFromScore(contributionScore: number, confidenceScore: number): OutcomeAttributionType {
  if (confidenceScore < 0.35) return "UNKNOWN";
  if (contributionScore <= -0.35) return "BLOCKING_FACTOR";
  if (contributionScore >= 0.75 && confidenceScore >= 0.68) return "PRIMARY_CAUSE";
  if (contributionScore >= 0.35) return "CONTRIBUTING_FACTOR";
  if (contributionScore > 0) return "ENABLING_FACTOR";
  return "SPURIOUS";
}

function defaultRationale(input: OutcomeAttributionInput, confidenceScore: number, attributionType: OutcomeAttributionType) {
  if (attributionType === "UNKNOWN") {
    return "VGOS cannot confidently identify a causal source yet because the outcome or evidence is incomplete.";
  }
  return `${input.attributedSourceType} ${input.attributedSourceId} is treated as ${attributionType.toLowerCase().replace(/_/g, " ")} with ${Math.round(confidenceScore * 100)}% attribution confidence.`;
}

export function attributeOutcome(input: OutcomeAttributionInput): InstructionResult<OutcomeAttribution> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.outcomeId) return { success: false, error: "outcomeId is required." };
  if (!input.attributedSourceType) return { success: false, error: "attributedSourceType is required." };
  if (!input.attributedSourceId) return { success: false, error: "attributedSourceId is required." };

  const confidence = computeAttributionConfidence(input);
  const confidenceScore = confidence.data?.confidenceScore ?? 0.42;
  const contributionScore = clampScore(input.contributionScore ?? (confidenceScore >= 0.68 ? 0.74 : confidenceScore >= 0.52 ? 0.48 : 0.18));
  const attributionType = input.attributionType ?? attributionTypeFromScore(contributionScore, confidenceScore);

  return {
    success: true,
    data: {
      id: input.id ?? `outcome-attribution-${input.outcomeId}-${input.attributedSourceId}`,
      workspaceId: input.workspaceId,
      outcomeId: input.outcomeId,
      attributedSourceType: input.attributedSourceType,
      attributedSourceId: input.attributedSourceId,
      attributionType,
      contributionScore,
      confidenceScore,
      rationale: input.rationale ?? defaultRationale(input, confidenceScore, attributionType),
      evidenceIds: input.evidenceIds ?? [],
      createdAt: nowIso(input.now)
    },
    warnings: confidence.warnings
  };
}

export function explainOutcomeAttribution(attribution: OutcomeAttribution): InstructionResult<string> {
  const confidence = Math.round(attribution.confidenceScore * 100);
  const contribution = Math.round(attribution.contributionScore * 100);
  const uncertainty = attribution.confidenceScore < 0.6
    ? " Attribution is still uncertain and should not be treated as proof."
    : "";

  return {
    success: true,
    data: `${attribution.attributedSourceType} ${attribution.attributedSourceId} is marked as ${attribution.attributionType.toLowerCase().replace(/_/g, " ")} for ${attribution.outcomeId}. Contribution is ${contribution}% and confidence is ${confidence}%. ${attribution.rationale}${uncertainty}`,
    warnings: attribution.confidenceScore < 0.6 ? ["Attribution confidence is low."] : []
  };
}
