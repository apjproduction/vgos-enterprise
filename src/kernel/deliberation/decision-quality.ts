import type {
  DecisionOption,
  DecisionQualityInput,
  DecisionQualityScore,
  DecisionReadinessRecommendation,
  InstructionResult,
  Objection,
  Tradeoff
} from "@/kernel/deliberation/deliberation-types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function round2(value: number) {
  return Number(clamp01(value).toFixed(2));
}

function nonEmpty(value?: string | null) {
  return Boolean(value?.trim());
}

function evidenceIdsForOption(option: DecisionOption) {
  return [...(option.evidenceIds ?? []), ...option.evidence].filter((item) => item.trim().length > 0);
}

function allEvidenceIds(input: DecisionQualityInput) {
  return [
    ...input.options.flatMap(evidenceIdsForOption),
    ...(input.assumptions ?? []).flatMap((assumption) => assumption.evidenceIds),
    ...(input.objections ?? []).flatMap((objection) => objection.evidenceIds)
  ].filter((item) => item.trim().length > 0);
}

function unresolvedObjections(objections: Objection[]) {
  return objections.filter((objection) => !["MITIGATED", "REJECTED", "SUPERSEDED"].includes(objection.status));
}

function scoreEvidenceQuality(input: DecisionQualityInput) {
  const evidenceCount = new Set(allEvidenceIds(input)).size;
  const optionsWithEvidence = input.options.filter((option) => evidenceIdsForOption(option).length > 0).length;
  const assumptions = input.assumptions ?? [];
  const assumptionsWithEvidence = assumptions.filter((assumption) => assumption.evidenceIds.length > 0).length;
  const coverageBase = input.options.length ? optionsWithEvidence / input.options.length : 0;
  const assumptionCoverage = assumptions.length ? assumptionsWithEvidence / assumptions.length : coverageBase;
  return round2(Math.min(1, evidenceCount / 4) * 0.4 + coverageBase * 0.35 + assumptionCoverage * 0.25);
}

function scoreAssumptionClarity(input: DecisionQualityInput) {
  const explicitAssumptions = input.assumptions ?? [];
  const optionAssumptionCount = input.options.flatMap((option) => option.assumptions).filter(Boolean).length;
  const explicitScore = explicitAssumptions.length ? Math.min(1, explicitAssumptions.length / 3) : 0;
  const optionScore = Math.min(1, optionAssumptionCount / Math.max(1, input.options.length * 2));
  const statusScore = explicitAssumptions.length
    ? explicitAssumptions.filter((assumption) => ["SUPPORTED", "VALIDATED", "CHALLENGED"].includes(assumption.status)).length / explicitAssumptions.length
    : 0;
  return round2(explicitScore * 0.45 + optionScore * 0.25 + statusScore * 0.3);
}

function scoreOptionCoverage(options: DecisionOption[]) {
  if (options.length >= 3) return 1;
  if (options.length === 2) return 0.78;
  if (options.length === 1) return 0.28;
  return 0;
}

function scoreTradeoffClarity(tradeoffs: Tradeoff[]) {
  if (!tradeoffs.length) return 0.12;
  const complete = tradeoffs.filter((tradeoff) =>
    [tradeoff.comparisonSummary, tradeoff.benefit, tradeoff.cost, tradeoff.risk].every(nonEmpty)
  ).length;
  const averageConfidence = tradeoffs.reduce((sum, tradeoff) => sum + tradeoff.confidenceScore, 0) / tradeoffs.length;
  return round2(Math.min(1, complete / 2) * 0.65 + averageConfidence * 0.35);
}

function scoreRiskVisibility(input: DecisionQualityInput) {
  const optionRiskSignals = input.options.filter((option) =>
    option.riskLevel === "HIGH" ||
    option.riskLevel === "CRITICAL" ||
    option.cons.length > 0 ||
    nonEmpty(option.expectedDownside)
  ).length;
  const objectionScore = input.objections?.length ? 0.3 : 0;
  const tradeoffRiskScore = input.tradeoffs?.some((tradeoff) => nonEmpty(tradeoff.risk)) ? 0.2 : 0;
  return round2((input.options.length ? optionRiskSignals / input.options.length : 0) * 0.5 + objectionScore + tradeoffRiskScore);
}

function scoreConfidenceJustification(input: DecisionQualityInput, evidenceQuality: number) {
  const confidence = input.confidenceScore ?? averageOptionConfidence(input.options);
  const rationaleScore = nonEmpty(input.rationale) ? 0.35 : 0;
  const calibrationScore = confidence >= 0.8 && evidenceQuality < 0.55 ? 0.05 : 0.3;
  return round2(evidenceQuality * 0.35 + rationaleScore + calibrationScore);
}

function averageOptionConfidence(options: DecisionOption[]) {
  if (!options.length) return 0.5;
  return options.reduce((sum, option) => sum + option.confidenceScore, 0) / options.length;
}

function deriveWarnings(input: DecisionQualityInput, score: Omit<DecisionQualityScore, "warnings">) {
  const warnings: string[] = [];
  const evidenceCount = allEvidenceIds(input).length;
  const confidence = input.confidenceScore ?? averageOptionConfidence(input.options);
  const assumptions = input.assumptions ?? [];
  const objections = input.objections ?? [];

  if (input.options.length <= 1) warnings.push("Only one option exists.");
  if (evidenceCount === 0) warnings.push("No evidence is linked.");
  if (assumptions.some((assumption) => assumption.status === "UNTESTED")) warnings.push("One or more assumptions are untested.");
  if (assumptions.some((assumption) => assumption.confidenceScore >= 0.8 && assumption.evidenceIds.length === 0)) {
    warnings.push("A high-confidence assumption has no linked evidence.");
  }
  if (unresolvedObjections(objections).length > 0) warnings.push("Objections remain unresolved.");
  if (confidence >= 0.8 && score.evidenceQuality < 0.55) warnings.push("Confidence is high but evidence is weak.");
  if (score.reversibilityScore < 0.3 && confidence < 0.65) warnings.push("Decision is irreversible and low-confidence.");
  if (input.commitmentCreated && !nonEmpty(input.commitmentRationale) && !nonEmpty(input.rationale)) {
    warnings.push("Commitment is created without rationale.");
  }

  return warnings;
}

export function scoreDecisionQuality(input: DecisionQualityInput): DecisionQualityScore {
  const tradeoffs = input.tradeoffs ?? [];
  const evidenceQuality = scoreEvidenceQuality(input);
  const assumptionClarity = scoreAssumptionClarity(input);
  const optionCoverage = scoreOptionCoverage(input.options);
  const tradeoffClarity = scoreTradeoffClarity(tradeoffs);
  const riskVisibility = scoreRiskVisibility(input);
  const reversibilityScore = round2(input.reversibilityScore ?? (tradeoffs.length
    ? tradeoffs.reduce((sum, tradeoff) => sum + tradeoff.reversibilityScore, 0) / tradeoffs.length
    : 0.55));
  const confidenceJustification = scoreConfidenceJustification(input, evidenceQuality);
  const overallScore = round2(
    evidenceQuality * 0.2 +
      assumptionClarity * 0.16 +
      optionCoverage * 0.16 +
      tradeoffClarity * 0.14 +
      riskVisibility * 0.14 +
      reversibilityScore * 0.08 +
      confidenceJustification * 0.12
  );
  const score = {
    decisionId: input.decisionId,
    evidenceQuality,
    assumptionClarity,
    optionCoverage,
    tradeoffClarity,
    riskVisibility,
    reversibilityScore,
    confidenceJustification,
    overallScore
  };

  return {
    ...score,
    warnings: deriveWarnings(input, score)
  };
}

export function computeDecisionQuality(input: DecisionQualityInput): InstructionResult<DecisionQualityScore> {
  if (!input.decisionId) return { success: false, error: "decisionId is required." };
  return {
    success: true,
    data: scoreDecisionQuality(input),
    warnings: input.options.length === 0 ? ["No decision options were supplied."] : undefined
  };
}

export function recommendReadinessFromScore(score: DecisionQualityScore): DecisionReadinessRecommendation {
  const blockingWarnings = score.warnings.filter((warning) =>
    /no evidence|unresolved|irreversible|only one option|untested/i.test(warning)
  );
  const status =
    score.overallScore >= 0.78 && blockingWarnings.length === 0
      ? "READY_FOR_COMMITMENT"
      : score.overallScore >= 0.66 && blockingWarnings.length <= 1
        ? "READY_FOR_DECISION"
        : score.overallScore >= 0.5
          ? "NEEDS_REVIEW"
          : "NOT_READY";
  const nextActions = [
    score.evidenceQuality < 0.62 ? "Add or link evidence to the key assumptions." : "",
    score.optionCoverage < 0.65 ? "Compare at least one credible alternative." : "",
    score.tradeoffClarity < 0.6 ? "Document the main tradeoff and opportunity cost." : "",
    score.riskVisibility < 0.6 ? "Raise or resolve the strongest objection." : "",
    score.confidenceJustification < 0.62 ? "Write the decision rationale and confidence explanation." : ""
  ].filter(Boolean);

  return {
    decisionId: score.decisionId,
    status,
    score,
    rationale:
      status === "READY_FOR_COMMITMENT"
        ? "Decision quality is strong enough for a bounded commitment."
        : status === "READY_FOR_DECISION"
          ? "Decision quality is adequate, but one quality gap should be watched."
          : "Decision quality needs more work before VGOS should commit capacity.",
    nextActions: nextActions.length ? nextActions : ["Convert the deliberation into a decision commitment."]
  };
}

export function qualityLabel(score: DecisionQualityScore) {
  if (score.overallScore >= 0.78) return "strong";
  if (score.overallScore >= 0.66) return "sound";
  if (score.overallScore >= 0.5) return "mixed";
  return "weak";
}
