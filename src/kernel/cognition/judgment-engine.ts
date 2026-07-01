import { rankRecommendedActions } from "@/kernel/decisions/decision-engine";
import { getAssumptionsForRecommendation } from "@/kernel/cognition/assumption-engine";
import { findCounterEvidence, calculateCounterEvidenceRisk, identifyWhatWouldChangeTheDecision } from "@/kernel/cognition/counter-evidence-engine";
import { getEvidenceForRecommendation, identifyWeakEvidence, summarizeEvidenceQuality } from "@/kernel/cognition/evidence-evaluator";
import type { CognitionRiskLevel, ExecutiveJudgment, MissionCognition, WorkItemCognition } from "@/kernel/cognition/cognition-types";
import type { PlatformState, RecommendedAction } from "@/lib/vgos-data";

function riskFromScore(score: number): CognitionRiskLevel {
  if (score >= 0.74) return "CRITICAL";
  if (score >= 0.52) return "HIGH";
  if (score >= 0.3) return "MEDIUM";
  return "LOW";
}

function average(values: number[], fallback: number) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateJudgmentConfidence(input: {
  recommendationConfidence: number;
  evidenceScores: number[];
  highRiskAssumptionCount: number;
  counterEvidenceRisk: number;
}) {
  const evidenceAverage = average(input.evidenceScores, 0.58);
  const assumptionPenalty = Math.min(0.22, input.highRiskAssumptionCount * 0.07);
  const confidence = input.recommendationConfidence * 0.45 + evidenceAverage * 0.38 - input.counterEvidenceRisk * 0.14 - assumptionPenalty;
  return Math.max(0.1, Math.min(0.98, Number(confidence.toFixed(2))));
}

export function identifyDecisionRisk(input: { confidenceScore: number; counterEvidenceRisk: number; weakEvidenceCount: number }): CognitionRiskLevel {
  return riskFromScore((1 - input.confidenceScore) * 0.45 + input.counterEvidenceRisk * 0.38 + Math.min(0.3, input.weakEvidenceCount * 0.1));
}

export function recommendDeferDecision(judgment: Pick<ExecutiveJudgment, "confidenceScore" | "decisionRisk" | "assumptions" | "evidence">) {
  return (
    judgment.confidenceScore < 0.62 ||
    judgment.decisionRisk === "CRITICAL" ||
    (judgment.assumptions.some((item) => item.riskLevel === "CRITICAL" && item.status !== "VALIDATED") && judgment.evidence.length < 2)
  );
}

function selectRecommendation(state: PlatformState, workspaceId: string, sourceId?: string): RecommendedAction | undefined {
  if (sourceId) return state.recommendedActions.find((item) => item.id === sourceId);
  return rankRecommendedActions(state, workspaceId)[0];
}

export function generateExecutiveJudgment(state: PlatformState, workspaceId: string, sourceId?: string): ExecutiveJudgment {
  const recommendation = selectRecommendation(state, workspaceId, sourceId);
  const fallbackId = sourceId ?? "executive-judgment";
  const assumptions = recommendation ? getAssumptionsForRecommendation(state, recommendation.id) : state.assumptions.filter((item) => item.workspaceId === workspaceId).slice(0, 3);
  const evidence = recommendation ? getEvidenceForRecommendation(state, recommendation.id) : state.evidenceAssessments.filter((item) => item.workspaceId === workspaceId).slice(0, 4);
  const counterEvidence = findCounterEvidence(state, workspaceId, recommendation?.id);
  const counterEvidenceRisk = calculateCounterEvidenceRisk(counterEvidence);
  const weakEvidence = identifyWeakEvidence(evidence);
  const confidenceScore = calculateJudgmentConfidence({
    recommendationConfidence: recommendation?.confidenceScore ?? 0.74,
    evidenceScores: evidence.map((item) => item.overallScore),
    highRiskAssumptionCount: assumptions.filter((item) => ["HIGH", "CRITICAL"].includes(item.riskLevel) && item.status !== "VALIDATED").length,
    counterEvidenceRisk
  });
  const decisionRisk = identifyDecisionRisk({ confidenceScore, counterEvidenceRisk, weakEvidenceCount: weakEvidence.length });
  const tradeoff = state.tradeoffAnalyses.find((item) => item.workspaceId === workspaceId && item.sourceId === recommendation?.id) ??
    state.tradeoffAnalyses.find((item) => item.workspaceId === workspaceId);
  const baseJudgment: ExecutiveJudgment = {
    sourceType: recommendation ? "RecommendedAction" : "Workspace",
    sourceId: recommendation?.id ?? fallbackId,
    title: recommendation?.title ?? "Executive judgment",
    observation: recommendation
      ? `${recommendation.title} is the strongest current recommendation with ${Math.round(recommendation.confidenceScore * 100)}% base confidence.`
      : "VGOS has workspace evidence, assumptions, and reflections available for judgment.",
    interpretation: recommendation
      ? `${recommendation.expectedImpact} The decision depends on whether evidence quality outweighs counter-risk.`
      : "The workspace should favor proof-led work until live evidence reduces uncertainty.",
    assumptions,
    evidence,
    counterEvidence,
    tradeoff,
    finalRecommendation: recommendation
      ? recommendation.title
      : "Complete the highest-confidence proof asset before scaling lower-confidence distribution.",
    confidenceScore,
    confidenceExplanation: `${summarizeEvidenceQuality(evidence)} Counter-evidence risk is ${Math.round(counterEvidenceRisk * 100)}%; decision risk is ${decisionRisk.toLowerCase()}.`,
    decisionRisk,
    whatWouldChangeRecommendation: identifyWhatWouldChangeTheDecision(counterEvidence),
    shouldDefer: false,
    suggestedNextAction: recommendation?.title ?? "Review the strongest assumption and attach fresh evidence."
  };

  return {
    ...baseJudgment,
    shouldDefer: recommendDeferDecision(baseJudgment)
  };
}

export function produceRecommendationWithCognition(state: PlatformState, workspaceId: string, recommendationId?: string) {
  const judgment = generateExecutiveJudgment(state, workspaceId, recommendationId);
  return {
    recommendation: judgment.finalRecommendation,
    judgment,
    explanation: explainJudgment(judgment)
  };
}

export function explainJudgment(judgment: ExecutiveJudgment) {
  const assumptionText = judgment.assumptions[0]?.title ?? "current workspace assumptions";
  const evidenceText = judgment.evidence[0]?.summary ?? "limited assessed evidence";
  const counterText = judgment.counterEvidence[0] ?? "no major counter-evidence";
  return `Observation: ${judgment.observation} Interpretation: ${judgment.interpretation} Main assumption: ${assumptionText}. Main evidence: ${evidenceText}. Counter-evidence: ${counterText}. Recommendation: ${judgment.finalRecommendation}.`;
}

export function explainWorkItemCognition(state: PlatformState, executionItemId: string): WorkItemCognition {
  const item = state.executionItems.find((candidate) => candidate.id === executionItemId);
  const missionLink = state.missionExecutions.find((link) => link.executionItemId === executionItemId);
  const relatedMission =
    (missionLink ? state.missions.find((mission) => mission.id === missionLink.missionId) : undefined) ??
    state.missions.find((mission) => mission.id === state.missionPlans.find((link) => link.planId === item?.planId)?.missionId);
  const sourceIds = [executionItemId, item?.sourceId, item?.recommendedActionId, item?.planId].filter(Boolean) as string[];
  const assumptions = state.assumptions.filter((assumption) => sourceIds.includes(assumption.sourceId ?? "")).slice(0, 3);
  const evidence = state.evidenceAssessments.filter((assessment) => sourceIds.includes(assessment.sourceId)).slice(0, 4);
  const tradeoff = state.tradeoffAnalyses.find((analysis) => sourceIds.includes(analysis.sourceId ?? ""));
  const counterEvidence = findCounterEvidence(state, item?.workspaceId ?? relatedMission?.workspaceId ?? "", executionItemId);

  return {
    relatedMission,
    expectedImpact: item?.expectedImpact ?? "Expected impact is not attached yet.",
    evidenceStrength: average(evidence.map((assessment) => assessment.overallScore), item?.expectedImpact ? 0.68 : 0.5),
    assumptions,
    counterRisk: counterEvidence[0] ?? "No material counter-risk is visible yet.",
    tradeoff: tradeoff ? `${tradeoff.recommendedOption}: ${tradeoff.rationale}` : "No explicit tradeoff is attached yet."
  };
}

export function summarizeMissionCognition(state: PlatformState, missionId: string): MissionCognition {
  const mission = state.missions.find((item) => item.id === missionId);
  const executionIds = state.missionExecutions.filter((link) => link.missionId === missionId).map((link) => link.executionItemId);
  const learningIds = state.missionLearnings.filter((link) => link.missionId === missionId).map((link) => link.learningId);
  const sourceIds = [missionId, ...executionIds, ...learningIds];
  const evidence = state.evidenceAssessments.filter((item) => sourceIds.includes(item.sourceId));
  const highRiskAssumptions = state.assumptions
    .filter((item) => sourceIds.includes(item.sourceId ?? "") || item.description.toLowerCase().includes(mission?.title.toLowerCase().split(" ")[0] ?? ""))
    .filter((item) => ["HIGH", "CRITICAL"].includes(item.riskLevel))
    .slice(0, 5);
  const weakEvidenceAreas = identifyWeakEvidence(evidence.length ? evidence : state.evidenceAssessments.filter((item) => item.workspaceId === mission?.workspaceId).slice(0, 5)).slice(0, 5);
  const majorTradeoffs = state.tradeoffAnalyses
    .filter((item) => item.workspaceId === mission?.workspaceId && (sourceIds.includes(item.sourceId ?? "") || item.title.toLowerCase().includes(mission?.title.toLowerCase().split(" ")[0] ?? "")))
    .slice(0, 4);
  const reflections = state.reflections
    .filter((item) => item.workspaceId === mission?.workspaceId && (sourceIds.includes(item.sourceId ?? "") || item.summary.toLowerCase().includes(mission?.title.toLowerCase().split(" ")[0] ?? "")))
    .slice(0, 4);
  const evidenceAverage = average(evidence.map((item) => item.overallScore), mission?.confidenceScore ?? 0.7);

  return {
    highRiskAssumptions,
    weakEvidenceAreas,
    majorTradeoffs,
    reflections,
    judgmentConfidence: Math.round(((mission?.confidenceScore ?? 0.72) * 0.55 + evidenceAverage * 0.45) * 100)
  };
}
