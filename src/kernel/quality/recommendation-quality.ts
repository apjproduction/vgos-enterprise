import type {
  RecommendationQualityInput,
  RecommendationQualityFields,
  QualityEntity
} from "@/kernel/quality/quality-types";

function textLength(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ").trim().length;
}

function hasMeaningfulUrl(input: QualityEntity) {
  const url = input.url ?? input.sourceUrl;
  return Boolean(url && /^https?:\/\//i.test(url));
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function identifyMissingEvidence(input: RecommendationQualityInput): string[] {
  const missing: string[] = [];
  const evidenceText = textLength(input.summary, input.description, input.reasoning, input.suggestedAction, input.expectedImpact);

  if (!input.source && !input.sourceType) missing.push("Source context");
  if (!input.sourceId && !input.canonicalId) missing.push("Source record link");
  if (!hasMeaningfulUrl(input)) missing.push("Source URL or citation");
  if (evidenceText < 120) missing.push("Detailed reasoning");
  if (!input.expectedImpact && !input.suggestedAction) missing.push("Expected impact");
  if (!input.priority) missing.push("Priority rationale");

  return [...new Set(missing)];
}

export function calculateEvidenceStrength(input: RecommendationQualityInput) {
  const missing = identifyMissingEvidence(input);
  const evidenceText = textLength(input.summary, input.description, input.reasoning, input.suggestedAction, input.expectedImpact);
  const entitySupport = Math.min(0.2, ((input.detectedEntities?.length ?? 0) + (input.tags?.length ?? 0)) * 0.04);
  const keywordSupport = Math.min(0.16, (input.detectedKeywords?.length ?? 0) * 0.04);
  const sourceSupport = input.sourceId || input.canonicalId ? 0.18 : 0;
  const urlSupport = hasMeaningfulUrl(input) ? 0.12 : 0;
  const reasoningSupport = Math.min(0.26, evidenceText / 900);
  const penalty = missing.length * 0.08;

  return clamp01(0.24 + entitySupport + keywordSupport + sourceSupport + urlSupport + reasoningSupport - penalty);
}

export function rankRecommendationsByEvidenceStrength<T extends RecommendationQualityInput>(recommendations: T[]) {
  return [...recommendations].sort((a, b) => {
    const aStrength = a.evidenceStrength ?? calculateEvidenceStrength(a);
    const bStrength = b.evidenceStrength ?? calculateEvidenceStrength(b);
    return bStrength - aStrength;
  });
}

export function buildRecommendationQualityFields(
  input: RecommendationQualityInput,
  duplicateRisk = input.duplicateRisk ?? 0
): Pick<RecommendationQualityFields, "evidenceStrength" | "missingEvidence" | "duplicateRisk" | "qualityScore"> {
  const missingEvidence = identifyMissingEvidence(input);
  const evidenceStrength = calculateEvidenceStrength(input);
  const confidence = input.confidenceScore ?? 0.72;
  const qualityScore = Math.round(
    Math.max(
      0,
      Math.min(100, confidence * 36 + evidenceStrength * 44 + (input.priority === "CRITICAL" ? 10 : input.priority === "HIGH" ? 6 : 3) - duplicateRisk * 22 - missingEvidence.length * 3)
    )
  );

  return {
    evidenceStrength,
    missingEvidence,
    duplicateRisk,
    qualityScore
  };
}
