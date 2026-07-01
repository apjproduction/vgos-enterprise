import { createScopedId, orgId } from "@/lib/vgos-data";
import type { ExecutionResult, Learning, Measurement } from "@/lib/vgos-data";
import type { DecisionCommitment, DecisionQuality, DecisionReview, Deliberation } from "@/kernel/deliberation/deliberation-types";
import type { Reflection } from "@/kernel/cognition/cognition-types";

function qualityFromScore(score: number): DecisionQuality {
  if (score >= 82) return "STRONG";
  if (score >= 68) return "SOUND";
  if (score >= 50) return "MIXED";
  return "WEAK";
}

export function compareDecisionToOutcome(input: {
  deliberation: Deliberation;
  measurement?: Measurement;
  executionResult?: ExecutionResult;
}) {
  const measuredLift = input.measurement?.changePercent ?? input.executionResult?.impactScore ?? Math.round(input.deliberation.confidenceScore * 100);
  const confidence = Math.round(input.deliberation.confidenceScore * 100);
  return {
    outcomeScore: Math.max(0, Math.min(100, Math.round(Number(measuredLift)))),
    calibrationGap: Math.abs(confidence - Number(measuredLift))
  };
}

export function identifyDecisionQuality(outcomeScore: number, calibrationGap: number): DecisionQuality {
  return qualityFromScore(outcomeScore - Math.min(18, calibrationGap / 2));
}

export function identifyBadJudgmentPattern(input: { quality: DecisionQuality; deliberation: Deliberation }) {
  if (input.quality === "WEAK") return "VGOS likely overweighted confidence or urgency relative to evidence.";
  if (input.quality === "MIXED") return "VGOS made a reasonable choice but should have narrowed the commitment or waited for better evidence.";
  if (/defer/i.test(input.deliberation.finalJudgment)) return "Deferral protected capacity while evidence matured.";
  return "No bad judgment pattern detected.";
}

export function reviewDecisionOutcome(input: {
  deliberation: Deliberation;
  commitment?: DecisionCommitment;
  measurement?: Measurement;
  executionResult?: ExecutionResult;
}): DecisionReview {
  const comparison = compareDecisionToOutcome(input);
  const decisionQuality = identifyDecisionQuality(comparison.outcomeScore, comparison.calibrationGap);
  const date = new Date().toISOString();
  return {
    id: createScopedId("decision-review"),
    organizationId: input.deliberation.organizationId ?? orgId,
    workspaceId: input.deliberation.workspaceId,
    situationId: input.deliberation.situationId,
    deliberationId: input.deliberation.id,
    commitmentId: input.commitment?.id ?? null,
    summary: `Decision outcome scored ${comparison.outcomeScore}/100 with ${comparison.calibrationGap} points of confidence calibration gap.`,
    outcomeScore: comparison.outcomeScore,
    decisionQuality,
    judgmentPattern: identifyBadJudgmentPattern({ quality: decisionQuality, deliberation: input.deliberation }),
    futureRule: updateFutureDeliberationRules(decisionQuality),
    createdAt: date,
    updatedAt: date
  };
}

export function createReflectionFromDecision(review: DecisionReview, learning?: Learning): Reflection {
  const date = new Date().toISOString();
  return {
    id: createScopedId("reflection-decision"),
    organizationId: review.organizationId,
    workspaceId: review.workspaceId,
    title: `Decision reflection: ${review.decisionQuality.toLowerCase()} judgment`,
    sourceType: "DecisionReview",
    sourceId: review.id,
    summary: review.summary,
    whatWorked: review.decisionQuality === "STRONG" || review.decisionQuality === "SOUND" ? "The selected option produced a useful outcome." : "The decision created reviewable evidence.",
    whatFailed: review.decisionQuality === "WEAK" ? review.judgmentPattern : "No severe decision failure detected.",
    wrongAssumptions: review.decisionQuality === "WEAK" ? "The chosen option depended on assumptions that were not sufficiently validated." : "No major wrong assumption confirmed.",
    newLearning: learning?.summary ?? review.futureRule,
    futureAdjustment: review.futureRule,
    confidenceScore: Math.max(0.42, Math.min(0.9, review.outcomeScore / 100)),
    createdAt: date,
    updatedAt: date
  };
}

export function updateFutureDeliberationRules(quality: DecisionQuality) {
  if (quality === "WEAK") return "Require stronger evidence and a clearer dissenting view before committing similar decisions.";
  if (quality === "MIXED") return "Prefer narrower commitments or experiments when evidence is incomplete.";
  return "Keep using risk-adjusted option comparison for similar future decisions.";
}
