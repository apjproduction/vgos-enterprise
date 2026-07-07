import {
  confidenceIsJustified,
  hasAtLeastTwoOptions,
  hasDecisionRationale,
  hasDocumentedTradeoffs,
  hasExplicitAssumptions,
  hasLinkedEvidence,
  hasUnresolvedObjections,
  reversibilityIsUnderstood
} from "@/kernel/deliberation/deliberation-invariants";
import type {
  Assumption,
  DecisionOption,
  Deliberation,
  InstructionResult,
  Objection,
  Tradeoff
} from "@/kernel/deliberation/deliberation-types";

export type DeliberationValidationReport = {
  deliberationId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateDeliberationForDecision(input: {
  deliberation: Deliberation;
  options: DecisionOption[];
  assumptions?: Assumption[];
  tradeoffs?: Tradeoff[];
  objections?: Objection[];
}): InstructionResult<DeliberationValidationReport> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const assumptions = input.assumptions ?? [];
  const tradeoffs = input.tradeoffs ?? [];
  const objections = input.objections ?? [];

  if (!input.deliberation.id) errors.push("Deliberation must have an id.");
  if (!hasAtLeastTwoOptions(input.options)) warnings.push("At least two options should be considered before decision.");
  if (!hasLinkedEvidence(input.options, assumptions)) warnings.push("Decision has no linked evidence.");
  if (!hasExplicitAssumptions(input.options, assumptions)) warnings.push("Major assumptions are not explicit.");
  if (!hasDocumentedTradeoffs(tradeoffs)) warnings.push("Tradeoffs are not documented.");
  if (hasUnresolvedObjections(objections)) warnings.push("Unresolved objections remain.");
  if (!hasDecisionRationale(input.deliberation)) warnings.push("Decision rationale is missing.");
  if (!confidenceIsJustified({
    confidenceScore: input.deliberation.confidenceScore,
    options: input.options,
    assumptions
  })) {
    warnings.push("High confidence is not justified by linked evidence.");
  }
  if (tradeoffs.length > 0 && !reversibilityIsUnderstood(tradeoffs)) {
    warnings.push("Reversibility is not understood.");
  }

  return {
    success: errors.length === 0,
    data: {
      deliberationId: input.deliberation.id,
      valid: errors.length === 0,
      errors,
      warnings
    },
    error: errors[0],
    warnings
  };
}
