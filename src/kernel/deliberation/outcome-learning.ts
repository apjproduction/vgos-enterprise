import type {
  Assumption,
  DecisionQualityScore,
  InstructionResult,
  Objection
} from "@/kernel/deliberation/deliberation-types";
import type { ClaimImpact, OutcomeEvaluation } from "@/kernel/outcomes";

export type DeliberationOutcomeLearning = {
  outcomeId: string;
  assumptionUpdates: Array<{
    assumptionId?: string;
    statement: string;
    previousStatus?: string;
    newStatus: string;
    rationale: string;
  }>;
  objectionUpdates: Array<{
    objectionId?: string;
    statement: string;
    previousStatus?: string;
    newStatus: string;
    rationale: string;
  }>;
  decisionQualityHistory: {
    decisionId?: string;
    outcomeAdjustedQuality: number;
    summary: string;
  };
  futureDeliberationWarnings: string[];
};

function textMatches(left: string, right: string) {
  const tokens = right
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 5);
  const lower = left.toLowerCase();
  return tokens.some((token) => lower.includes(token));
}

export function applyOutcomeLearningToDeliberation(input: {
  evaluation: OutcomeEvaluation;
  claimImpact?: ClaimImpact;
  assumptions?: Assumption[];
  objections?: Objection[];
  decisionQualityScore?: DecisionQualityScore;
}): InstructionResult<DeliberationOutcomeLearning> {
  const negativeOutcome = input.evaluation.successScore < 0.45 || input.claimImpact?.impactType === "CHALLENGES" || input.claimImpact?.impactType === "INVALIDATES";
  const positiveOutcome = input.evaluation.successScore >= 0.65 && (input.claimImpact?.impactType === "SUPPORTS" || input.claimImpact?.impactType === "VALIDATES");
  const assumptionUpdates = (input.assumptions ?? [])
    .filter((assumption) => textMatches(input.evaluation.deltaSummary, assumption.statement) || textMatches(input.evaluation.evaluationSummary, assumption.statement))
    .map((assumption) => ({
      assumptionId: assumption.id,
      statement: assumption.statement,
      previousStatus: assumption.status,
      newStatus: negativeOutcome ? "WEAKENED" : positiveOutcome ? "SUPPORTED" : assumption.status ?? "UNTESTED",
      rationale: negativeOutcome
        ? `Outcome ${input.evaluation.outcomeId} weakens this assumption: ${input.evaluation.actualOutcome}`
        : `Outcome ${input.evaluation.outcomeId} supports this assumption: ${input.evaluation.actualOutcome}`
    }));
  const objectionUpdates = (input.objections ?? [])
    .filter((objection) => textMatches(input.evaluation.deltaSummary, objection.statement) || textMatches(input.evaluation.evaluationSummary, objection.statement))
    .map((objection) => ({
      objectionId: objection.id,
      statement: objection.statement,
      previousStatus: objection.status,
      newStatus: negativeOutcome ? "CONFIRMED" : positiveOutcome ? "MITIGATED" : objection.status ?? "OPEN",
      rationale: negativeOutcome
        ? `Outcome ${input.evaluation.outcomeId} confirms this objection should stay visible.`
        : `Outcome ${input.evaluation.outcomeId} reduces this objection.`
    }));
  const baseQuality = input.decisionQualityScore?.overallScore ?? input.evaluation.confidenceScore;
  const outcomeAdjustment = input.evaluation.successScore >= 0.65 ? 0.04 : input.evaluation.successScore < 0.45 ? -0.05 : 0;
  const outcomeAdjustedQuality = Math.max(0, Math.min(1, baseQuality + outcomeAdjustment));
  const futureDeliberationWarnings = [
    negativeOutcome ? "Do not reuse this assumption without new evidence." : "",
    input.evaluation.warnings.some((warning) => /success criteria/i.test(warning)) ? "Require measurable success criteria before future commitments." : "",
    input.evaluation.confidenceScore < 0.55 ? "Avoid updating decision quality history until evidence improves." : "",
    input.claimImpact?.impactType === "CHALLENGES" ? "Surface the challenged claim before similar future decisions." : ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      outcomeId: input.evaluation.outcomeId,
      assumptionUpdates,
      objectionUpdates,
      decisionQualityHistory: {
        decisionId: input.decisionQualityScore?.decisionId,
        outcomeAdjustedQuality,
        summary: positiveOutcome
          ? "Outcome supports this deliberation path, but VGOS should still distinguish decision quality from outcome luck."
          : negativeOutcome
            ? "Outcome weakens the deliberation path or its assumptions; future decisions should require stronger evidence."
            : "Outcome is mixed, so decision quality history should stay cautious."
      },
      futureDeliberationWarnings
    },
    warnings: futureDeliberationWarnings
  };
}
