import type {
  Assumption,
  DecisionOption,
  Deliberation,
  Objection,
  Tradeoff
} from "@/kernel/deliberation/deliberation-types";

export function hasAtLeastTwoOptions(options: DecisionOption[]) {
  return options.length >= 2;
}

export function hasLinkedEvidence(options: DecisionOption[], assumptions: Assumption[] = []) {
  return options.some((option) => option.evidence.length > 0 || (option.evidenceIds?.length ?? 0) > 0) ||
    assumptions.some((assumption) => assumption.evidenceIds.length > 0);
}

export function hasExplicitAssumptions(options: DecisionOption[], assumptions: Assumption[] = []) {
  return assumptions.length > 0 || options.some((option) => option.assumptions.length > 0);
}

export function hasDocumentedTradeoffs(tradeoffs: Tradeoff[]) {
  return tradeoffs.some((tradeoff) =>
    Boolean(tradeoff.comparisonSummary.trim() && tradeoff.benefit.trim() && tradeoff.cost.trim())
  );
}

export function hasUnresolvedObjections(objections: Objection[]) {
  return objections.some((objection) => !["MITIGATED", "REJECTED", "SUPERSEDED"].includes(objection.status));
}

export function hasDecisionRationale(deliberation: Deliberation) {
  return Boolean(deliberation.finalJudgment.trim() || deliberation.summary.trim());
}

export function confidenceIsJustified(input: {
  confidenceScore: number;
  options: DecisionOption[];
  assumptions?: Assumption[];
}) {
  if (input.confidenceScore < 0.8) return true;
  return hasLinkedEvidence(input.options, input.assumptions ?? []);
}

export function reversibilityIsUnderstood(tradeoffs: Tradeoff[]) {
  return tradeoffs.length > 0 && tradeoffs.every((tradeoff) => tradeoff.reversibilityScore >= 0 && tradeoff.reversibilityScore <= 1);
}
