import { createScopedId, orgId } from "@/lib/vgos-data";
import type { PlatformState } from "@/lib/vgos-data";
import type { CognitionEvidenceType, EvidenceAssessment, EvidenceAssessmentInput } from "@/kernel/cognition/cognition-types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function round2(value: number) {
  return Number(clamp01(value).toFixed(2));
}

function ageInDays(date?: string) {
  if (!date) return 30;
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return 30;
  return Math.max(0, Math.floor((Date.now() - time) / 86400000));
}

export function calculateReliability(input: {
  sourceType: string;
  evidenceType: CognitionEvidenceType;
  firstParty?: boolean;
  hasMeasurement?: boolean;
}) {
  const sourceReliability: Record<string, number> = {
    Measurement: 0.88,
    Learning: 0.82,
    ExecutionResult: 0.78,
    Metric: 0.84,
    ConnectorSyncRun: 0.72,
    NormalizedSignal: 0.7,
    Observation: 0.64,
    Manual: 0.58
  };
  const typeReliability: Record<CognitionEvidenceType, number> = {
    MEASUREMENT: 0.9,
    LEARNING: 0.84,
    EXECUTION_RESULT: 0.8,
    CONNECTOR_DATA: 0.74,
    HISTORICAL_PATTERN: 0.72,
    SIGNAL: 0.66,
    MANUAL_NOTE: 0.58,
    COUNTER_EVIDENCE: 0.76
  };

  return round2(
    (sourceReliability[input.sourceType] ?? 0.64) * 0.45 +
      typeReliability[input.evidenceType] * 0.4 +
      (input.firstParty ? 0.08 : 0) +
      (input.hasMeasurement ? 0.07 : 0)
  );
}

export function calculateRecency(occurredAt?: string) {
  const age = ageInDays(occurredAt);
  if (age <= 3) return 0.94;
  if (age <= 14) return 0.84;
  if (age <= 45) return 0.68;
  if (age <= 90) return 0.52;
  return 0.38;
}

export function calculateRelevance(input: { summary: string; sourceType: string; sourceId: string; targetText?: string }) {
  const targetTerms = (input.targetText ?? input.sourceId)
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 4);
  if (!targetTerms.length) return 0.66;

  const haystack = `${input.summary} ${input.sourceType} ${input.sourceId}`.toLowerCase();
  const hits = targetTerms.filter((term) => haystack.includes(term)).length;
  return round2(0.5 + Math.min(0.42, hits * 0.11));
}

export function calculateEvidenceStrength(input: EvidenceAssessmentInput) {
  const explicit = input.strengthScore;
  if (explicit !== undefined) return round2(explicit);
  return round2(
    calculateReliability(input) * 0.42 +
      calculateRecency(input.occurredAt) * 0.23 +
      calculateRelevance(input) * 0.25 +
      (input.hasMeasurement ? 0.1 : 0)
  );
}

export function assessEvidence(input: EvidenceAssessmentInput): EvidenceAssessment {
  const reliabilityScore = round2(input.reliabilityScore ?? calculateReliability(input));
  const recencyScore = round2(input.recencyScore ?? calculateRecency(input.occurredAt));
  const relevanceScore = round2(input.relevanceScore ?? calculateRelevance(input));
  const strengthScore = round2(input.strengthScore ?? calculateEvidenceStrength(input));
  const limitationPenalty = input.limitations ? 0.04 : 0;
  const overallScore = round2(strengthScore * 0.35 + reliabilityScore * 0.3 + recencyScore * 0.15 + relevanceScore * 0.2 - limitationPenalty);
  const date = new Date().toISOString();

  return {
    id: createScopedId("evidence-assessment"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    evidenceType: input.evidenceType,
    summary: input.summary,
    strengthScore,
    reliabilityScore,
    recencyScore,
    relevanceScore,
    overallScore,
    limitations: input.limitations ?? "",
    createdAt: date,
    updatedAt: date
  };
}

export function summarizeEvidenceQuality(evidence: EvidenceAssessment[]): string {
  if (!evidence.length) return "No supporting evidence has been assessed yet.";
  const average = evidence.reduce((sum, item) => sum + item.overallScore, 0) / evidence.length;
  const weak = evidence.filter((item) => item.overallScore < 0.65).length;
  return `Evidence quality averages ${Math.round(average * 100)}% across ${evidence.length} source${evidence.length === 1 ? "" : "s"}${weak ? `, with ${weak} weak area${weak === 1 ? "" : "s"}` : ""}.`;
}

export function getEvidenceForRecommendation(state: PlatformState, recommendationId: string): EvidenceAssessment[] {
  const direct = state.evidenceAssessments.filter((item) => item.sourceId === recommendationId);
  if (direct.length) return direct;

  const recommendation = state.recommendedActions.find((item) => item.id === recommendationId) ?? state.aiRecommendations.find((item) => item.id === recommendationId);
  if (!recommendation) return [];

  const terms = `${recommendation.title} ${recommendation.description}`
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 5);

  return state.evidenceAssessments.filter((item) => {
    if (item.workspaceId !== recommendation.workspaceId) return false;
    const haystack = `${item.summary} ${item.sourceType} ${item.sourceId}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });
}

export function identifyWeakEvidence(evidence: EvidenceAssessment[], threshold = 0.65): EvidenceAssessment[] {
  return evidence
    .filter((item) => item.overallScore < threshold || Boolean(item.limitations))
    .sort((a, b) => a.overallScore - b.overallScore);
}
