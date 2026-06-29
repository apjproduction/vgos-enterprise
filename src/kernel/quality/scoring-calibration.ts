import type { OpportunityScoreInput } from "@/kernel/quality/quality-types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeRawOpportunity(score: number) {
  if (score <= 100) return score;
  return Math.log10(score + 1) * 25;
}

export function calibrateOpportunityScore(input: number | OpportunityScoreInput) {
  if (typeof input === "number") {
    return clampScore(normalizeRawOpportunity(input));
  }

  const rawScore =
    input.opportunityScore ??
    (input.businessValueScore ?? 6) *
      (input.painSeverityScore ?? 6) *
      (input.trendScore ?? 6) *
      (input.authorityGapScore ?? 6) -
      (input.competitionScore ?? 5);
  const normalized = normalizeRawOpportunity(rawScore);
  const confidenceBoost = (input.confidenceScore ?? 0.72) * 10;
  const evidenceBoost = (input.evidenceStrength ?? 0.6) * 8;
  const qualityBoost = (input.qualityScore ?? 70) * 0.08;
  const competitionPenalty = (input.competitionScore ?? 5) * 1.4;
  const duplicatePenalty = (input.duplicateRisk ?? 0) * 18;

  return clampScore(normalized + confidenceBoost + evidenceBoost + qualityBoost - competitionPenalty - duplicatePenalty);
}
