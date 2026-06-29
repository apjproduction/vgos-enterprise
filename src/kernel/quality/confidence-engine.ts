import type {
  RecommendationQualityFields,
  RecommendationQualityInput
} from "@/kernel/quality/quality-types";
import {
  buildRecommendationQualityFields,
  identifyMissingEvidence
} from "@/kernel/quality/recommendation-quality";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function explainConfidenceScore(input: RecommendationQualityInput) {
  const missingEvidence = identifyMissingEvidence(input);
  const evidenceStrength = input.evidenceStrength ?? buildRecommendationQualityFields(input).evidenceStrength;
  const duplicateRisk = input.duplicateRisk ?? 0;
  const confidence = input.confidenceScore ?? 0.72;

  const strengths = [
    evidenceStrength >= 0.75 ? "strong supporting evidence" : null,
    input.sourceId || input.canonicalId ? "traceable source record" : null,
    input.priority === "CRITICAL" || input.priority === "HIGH" ? `${String(input.priority).toLowerCase()} priority context` : null
  ].filter(Boolean);

  const risks = [
    duplicateRisk >= 0.5 ? "duplicate risk is elevated" : null,
    missingEvidence.length ? `missing ${missingEvidence.join(", ").toLowerCase()}` : null,
    confidence < 0.6 ? "base confidence is low" : null
  ].filter(Boolean);

  const strengthText = strengths.length ? strengths.join(", ") : "moderate source support";
  const riskText = risks.length ? ` Watch items: ${risks.join("; ")}.` : " No major quality blockers detected.";
  return `Confidence is ${Math.round(confidence * 100)}% with ${strengthText}.${riskText}`;
}

export function calculateRecommendationConfidence(
  input: RecommendationQualityInput
): RecommendationQualityFields {
  const baseConfidence = input.confidenceScore ?? 0.72;
  const quality = buildRecommendationQualityFields(input, input.duplicateRisk ?? 0);
  const adjustedConfidence = clamp01(
    baseConfidence * 0.55 +
      quality.evidenceStrength * 0.35 +
      (quality.missingEvidence.length === 0 ? 0.08 : 0) -
      quality.duplicateRisk * 0.18
  );
  const confidenceScore = Number(adjustedConfidence.toFixed(2));
  const confidenceExplanation = explainConfidenceScore({
    ...input,
    confidenceScore,
    evidenceStrength: quality.evidenceStrength,
    missingEvidence: quality.missingEvidence,
    duplicateRisk: quality.duplicateRisk
  });

  return {
    ...quality,
    confidenceScore,
    explanation: confidenceExplanation,
    confidenceExplanation
  };
}
