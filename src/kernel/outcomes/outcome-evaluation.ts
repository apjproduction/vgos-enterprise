import {
  clampScore,
  hasMeaningfulText,
  nowIso,
  uniqueWarnings,
  type InstructionResult,
  type OutcomeEvaluation,
  type OutcomeEvaluationInput
} from "@/kernel/outcomes/outcome-types";

const positiveTerms = [
  "increase",
  "increased",
  "improve",
  "improved",
  "stronger",
  "generated",
  "validated",
  "supported",
  "engagement",
  "qualified",
  "conversion",
  "trust",
  "approval",
  "created",
  "better",
  "growth"
];

const negativeTerms = [
  "failed",
  "declined",
  "lagged",
  "unclear",
  "weak",
  "weakened",
  "blocked",
  "missing",
  "no measurable",
  "pending",
  "not yet",
  "contradict",
  "short-term roi remained unclear"
];

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
  );
}

function termHits(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.filter((term) => lower.includes(term)).length;
}

function expectedActualOverlap(expectedOutcome: string, actualOutcome: string) {
  const expected = tokenize(expectedOutcome);
  const actual = tokenize(actualOutcome);
  if (!expected.size || !actual.size) return 0;
  const overlap = [...expected].filter((token) => actual.has(token)).length;
  return overlap / Math.max(1, Math.min(expected.size, actual.size));
}

function criteriaHitRate(actualOutcome: string, successCriteria: string[]) {
  if (!successCriteria.length) return 0;
  const actualTokens = tokenize(actualOutcome);
  const hits = successCriteria.filter((criterion) =>
    [...tokenize(criterion)].some((token) => actualTokens.has(token))
  ).length;
  return hits / successCriteria.length;
}

function actualOutcomeIsPending(actualOutcome: string) {
  return /no measurable|not measurable|not yet|pending|too early|awaiting/i.test(actualOutcome);
}

function scoreOutcome(input: { expectedOutcome: string; actualOutcome: string; successCriteria?: string[] }) {
  if (!hasMeaningfulText(input.actualOutcome) || actualOutcomeIsPending(input.actualOutcome)) return 0.24;

  const positive = termHits(input.actualOutcome, positiveTerms);
  const negative = termHits(input.actualOutcome, negativeTerms);
  const overlap = expectedActualOverlap(input.expectedOutcome, input.actualOutcome);
  const criteria = criteriaHitRate(input.actualOutcome, input.successCriteria ?? []);

  return clampScore(0.48 + positive * 0.045 - negative * 0.08 + overlap * 0.16 + criteria * 0.18);
}

function confidenceFromInput(input: OutcomeEvaluationInput, successScore: number) {
  const evidenceStrength = input.evidence?.length
    ? input.evidence.reduce((sum, item) => sum + (item.strengthScore ?? 0.58), 0) / input.evidence.length
    : undefined;
  const evidenceCoverage = Math.min((input.evidenceIds?.length ?? 0) / 3, 1);
  const criteriaBoost = input.successCriteria?.length ? 0.08 : -0.07;
  const actualBoost = hasMeaningfulText(input.actualOutcome) ? 0.1 : -0.14;
  const blockerPenalty = Math.min((input.blockers?.length ?? 0) * 0.05, 0.14);
  const delayPenalty = (input.timeDelayDays ?? 0) > 30 ? 0.07 : 0;
  const integrity = input.commitmentIntegrityScore ?? input.executionQualityScore ?? 0.6;
  const evidenceComponent = evidenceStrength ?? Math.max(0.45, 0.45 + evidenceCoverage * 0.28);

  return clampScore(
    0.38 +
    evidenceComponent * 0.26 +
    integrity * 0.14 +
    successScore * 0.08 +
    criteriaBoost +
    actualBoost -
    blockerPenalty -
    delayPenalty +
    (input.confidenceLevel ? (input.confidenceLevel - 0.5) * 0.12 : 0)
  );
}

function summarizeEvaluation(input: OutcomeEvaluationInput, successScore: number, confidenceScore: number) {
  const decisionQuality = input.decisionQualityScore;
  if (!hasMeaningfulText(input.actualOutcome) || actualOutcomeIsPending(input.actualOutcome ?? "")) {
    return "Outcome is not yet measurable. VGOS should keep the expected outcome intact and record a measurable actual outcome before attributing causality.";
  }
  if (successScore >= 0.68 && decisionQuality !== undefined && decisionQuality < 0.55) {
    return "Outcome appears successful, but the linked decision quality was weak. Treat this as a possible lucky outcome until evidence explains the causal path.";
  }
  if (successScore < 0.45 && decisionQuality !== undefined && decisionQuality >= 0.75) {
    return "Outcome was weak, but the linked decision quality was strong. VGOS should inspect execution quality, blockers, timing, and external factors before calling the decision bad.";
  }
  if (successScore >= 0.68 && confidenceScore >= 0.7) {
    return "Expected and actual outcomes are directionally aligned with enough evidence to learn from the result, while keeping attribution separate from decision quality.";
  }
  if (successScore < 0.45) {
    return "Actual outcome did not meet the expected outcome. VGOS should separate decision quality, execution quality, and external factors before updating claims.";
  }
  return "Outcome is mixed or uncertain. VGOS should preserve the evidence, attempt attribution, and avoid overstating causal certainty.";
}

export function evaluateOutcome(input: OutcomeEvaluationInput): InstructionResult<OutcomeEvaluation> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.sourceType) return { success: false, error: "sourceType is required." };
  if (!input.sourceId) return { success: false, error: "sourceId is required." };

  const expectedOutcome = input.expectedOutcome?.trim() || "No expected outcome recorded.";
  const actualOutcome = input.actualOutcome?.trim() || "";
  const successScore = scoreOutcome({ expectedOutcome, actualOutcome, successCriteria: input.successCriteria });
  const confidenceScore = confidenceFromInput(input, successScore);
  const warnings = uniqueWarnings([
    input.successCriteria?.length ? undefined : "Success criteria were missing.",
    hasMeaningfulText(actualOutcome) ? undefined : "Actual outcome has not been recorded.",
    actualOutcomeIsPending(actualOutcome) ? "Outcome is not yet measurable." : undefined,
    (input.evidenceIds?.length ?? input.evidence?.length ?? 0) ? undefined : "No outcome evidence is linked.",
    input.decisionQualityScore !== undefined && input.decisionQualityScore < 0.55
      ? "Linked decision quality was weak; do not treat a good outcome as automatic validation."
      : undefined,
    input.decisionQualityScore !== undefined && input.decisionQualityScore >= 0.75 && successScore < 0.45
      ? "Outcome was weak, but decision quality was strong; inspect execution before invalidating the decision."
      : undefined,
    input.blockers?.length ? "Blockers were present and may explain part of the outcome." : undefined,
    (input.timeDelayDays ?? 0) > 30 ? "Large time delay lowers outcome confidence." : undefined,
    confidenceScore < 0.55 ? "Outcome confidence is low." : undefined
  ]);

  return {
    success: true,
    data: {
      outcomeId: input.outcomeId ?? `${input.sourceType}-${input.sourceId}-outcome`,
      workspaceId: input.workspaceId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      expectedOutcome,
      actualOutcome,
      deltaSummary: hasMeaningfulText(actualOutcome)
        ? `Expected: ${expectedOutcome} Actual: ${actualOutcome}`
        : `Expected: ${expectedOutcome} Actual outcome is not recorded yet.`,
      successScore,
      confidenceScore,
      evaluationSummary: summarizeEvaluation(input, successScore, confidenceScore),
      evaluatedAt: nowIso(input.now),
      warnings
    },
    warnings
  };
}
