import { createScopedId, orgId } from "@/lib/vgos-data";
import type { ExecutionResult, Learning, Measurement, PlatformState, RecommendedAction } from "@/lib/vgos-data";
import type { ExecutiveJudgment, JudgmentRecord, Reflection } from "@/kernel/cognition/cognition-types";

function baseReflection(input: {
  workspaceId: string;
  organizationId?: string;
  title: string;
  sourceType: string;
  sourceId: string;
  summary: string;
  whatWorked: string;
  whatFailed: string;
  wrongAssumptions: string;
  newLearning: string;
  futureAdjustment: string;
  confidenceScore: number;
  originalJudgment?: string | null;
  outcomeSummary?: string | null;
  wasCorrect?: boolean | null;
  whatWasMissed?: string | null;
  whatChanged?: string | null;
  lesson?: string | null;
  recalibrationSuggestion?: string | null;
}): Reflection {
  const date = new Date().toISOString();
  return {
    id: createScopedId("reflection"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    summary: input.summary,
    whatWorked: input.whatWorked,
    whatFailed: input.whatFailed,
    wrongAssumptions: input.wrongAssumptions,
    newLearning: input.newLearning,
    futureAdjustment: input.futureAdjustment,
    confidenceScore: input.confidenceScore,
    originalJudgment: input.originalJudgment ?? null,
    outcomeSummary: input.outcomeSummary ?? input.summary,
    wasCorrect: input.wasCorrect ?? null,
    whatWasMissed: input.whatWasMissed ?? input.whatFailed,
    whatChanged: input.whatChanged ?? input.newLearning,
    lesson: input.lesson ?? input.newLearning,
    recalibrationSuggestion: input.recalibrationSuggestion ?? input.futureAdjustment,
    createdAt: date,
    updatedAt: date
  };
}

export function summarizeWhatWorked(summary: string) {
  if (/increase|improv|outperform|strong|better|lift|created/i.test(summary)) return summary;
  return "The work created enough observable signal to inform the next operating decision.";
}

export function summarizeWhatFailed(summary: string) {
  if (/lag|delay|blocked|lower|slower|skeptic|missing/i.test(summary)) return summary;
  return "No major failure is confirmed yet; the main gap is whether the outcome is measured clearly enough.";
}

export function extractWrongAssumptions(summary: string) {
  if (/directory|approval|lag|slower/i.test(summary)) return "Directory approval timing was more uncertain than the original plan assumed.";
  if (/proof|skeptic|demo|conversion/i.test(summary)) return "Trust did not improve enough without visible product proof.";
  if (/founder|company|linkedin/i.test(summary)) return "Company-only distribution was weaker than founder-led narrative.";
  return "No specific wrong assumption is confirmed yet.";
}

export function recommendFutureAdjustment(summary: string) {
  if (/directory|approval|lag|slower/i.test(summary)) return "Extend authority timelines and add follow-up checkpoints before forecasting backlink impact.";
  if (/proof|skeptic|demo|conversion/i.test(summary)) return "Sequence proof assets before BOFU conversion pushes.";
  if (/founder|company|linkedin/i.test(summary)) return "Prefer founder-led proof narratives when qualitative engagement is the goal.";
  return "Attach measurement before raising future recommendation confidence.";
}

export function compareJudgmentToOutcome(input: {
  originalJudgment: string;
  outcomeSummary: string;
  confidenceScore?: number;
}) {
  const outcome = input.outcomeSummary.toLowerCase();
  const positiveOutcome = /better|increase|improv|strong|lift|worked|valuable|demand|comments|converted/i.test(outcome);
  const negativeOutcome = /lag|delay|blocked|lower|slower|skeptic|missing|poorly|failed/i.test(outcome);
  const wasCorrect = positiveOutcome && !negativeOutcome ? true : negativeOutcome ? false : null;
  return {
    wasCorrect,
    whatWasMissed: negativeOutcome
      ? extractWrongAssumptions(input.outcomeSummary)
      : "No major missed signal is confirmed yet.",
    confidenceDelta: wasCorrect === true ? 0.05 : wasCorrect === false ? -0.1 : -0.02
  };
}

export function identifyMissedSignals(summary: string): string[] {
  const missed: string[] = [];
  if (/directory|approval|lag|slower/i.test(summary)) missed.push("Approval timing should have been treated as uncertain evidence.");
  if (/proof|demo|skeptic|conversion/i.test(summary)) missed.push("Proof readiness should have been weighted above content momentum.");
  if (/founder|company|linkedin/i.test(summary)) missed.push("Founder-led qualitative engagement deserved stronger weight.");
  if (/capacity|review|blocked/i.test(summary)) missed.push("Owner capacity should have reduced execution confidence.");
  return missed.length ? missed : ["No specific missed signal is confirmed yet."];
}

export function extractLesson(summary: string) {
  if (/directory|approval|lag|slower/i.test(summary)) return "Authority work should use slower approval timelines unless approvals are already observed.";
  if (/proof|demo|skeptic|conversion/i.test(summary)) return "Conversion-focused recommendations need proof assets before confidence rises.";
  if (/founder|company|linkedin/i.test(summary)) return "Founder-led proof content deserves priority when trust is the scarce signal.";
  return "Future recommendations should stay bounded until measurement confirms the outcome.";
}

export function createRecalibrationSuggestion(summary: string) {
  if (/directory|approval|lag|slower/i.test(summary)) return "Lower confidence for directory-heavy recommendations until approval evidence arrives.";
  if (/proof|demo|skeptic|conversion/i.test(summary)) return "Raise demo/proof dependencies above BOFU publishing when trust is uncertain.";
  if (/founder|company|linkedin/i.test(summary)) return "Increase weight for founder-led distribution in authority recommendations.";
  return "Keep confidence conservative and attach fresher evidence before prioritizing similar work.";
}

export function createReflection(input: {
  workspaceId: string;
  organizationId?: string;
  sourceType: string;
  sourceId: string;
  originalJudgment: string;
  outcomeSummary: string;
  confidenceScore?: number;
}): Reflection {
  const comparison = compareJudgmentToOutcome(input);
  return baseReflection({
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    title: `Reflection: ${input.sourceType} ${input.sourceId}`,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    summary: input.outcomeSummary,
    whatWorked: summarizeWhatWorked(input.outcomeSummary),
    whatFailed: summarizeWhatFailed(input.outcomeSummary),
    wrongAssumptions: extractWrongAssumptions(input.outcomeSummary),
    newLearning: extractLesson(input.outcomeSummary),
    futureAdjustment: createRecalibrationSuggestion(input.outcomeSummary),
    confidenceScore: input.confidenceScore ?? 0.72,
    originalJudgment: input.originalJudgment,
    outcomeSummary: input.outcomeSummary,
    wasCorrect: comparison.wasCorrect,
    whatWasMissed: identifyMissedSignals(input.outcomeSummary).join(" "),
    whatChanged: comparison.confidenceDelta > 0 ? "Outcome strengthened the judgment pattern." : "Outcome lowered or bounded the judgment pattern.",
    lesson: extractLesson(input.outcomeSummary),
    recalibrationSuggestion: createRecalibrationSuggestion(input.outcomeSummary)
  });
}

export function createReflectionFromExecution(result: ExecutionResult): Reflection {
  return baseReflection({
    workspaceId: result.workspaceId,
    organizationId: result.organizationId,
    title: `Reflection: ${result.summary}`,
    sourceType: "ExecutionResult",
    sourceId: result.id,
    summary: result.summary,
    whatWorked: summarizeWhatWorked(`${result.summary} ${result.learning}`),
    whatFailed: summarizeWhatFailed(`${result.summary} ${result.learning}`),
    wrongAssumptions: extractWrongAssumptions(`${result.summary} ${result.learning}`),
    newLearning: result.learning,
    futureAdjustment: recommendFutureAdjustment(`${result.summary} ${result.learning}`),
    confidenceScore: result.impactScore ? Math.min(0.92, result.impactScore / 100) : 0.72,
    originalJudgment: "Execution was expected to create measurable progress.",
    outcomeSummary: result.summary,
    wasCorrect: result.impactScore ? result.impactScore >= 70 : null,
    whatWasMissed: identifyMissedSignals(`${result.summary} ${result.learning}`).join(" "),
    whatChanged: result.learning,
    lesson: extractLesson(`${result.summary} ${result.learning}`),
    recalibrationSuggestion: createRecalibrationSuggestion(`${result.summary} ${result.learning}`)
  });
}

export function createReflectionFromMeasurement(measurement: Measurement): Reflection {
  const changed = measurement.changePercent !== undefined ? `${measurement.changePercent}% change` : "measurement captured";
  const summary = `${changed}. ${measurement.notes ?? "Measurement is available for judgment."}`;
  return baseReflection({
    workspaceId: measurement.workspaceId,
    organizationId: measurement.organizationId,
    title: `Reflection: ${measurement.metricId}`,
    sourceType: "Measurement",
    sourceId: measurement.id,
    summary,
    whatWorked: summarizeWhatWorked(summary),
    whatFailed: summarizeWhatFailed(summary),
    wrongAssumptions: extractWrongAssumptions(summary),
    newLearning: measurement.notes ?? "Measurement should inform future confidence.",
    futureAdjustment: recommendFutureAdjustment(summary),
    confidenceScore: measurement.changePercent === undefined ? 0.68 : Math.min(0.9, 0.65 + Math.abs(measurement.changePercent) / 100),
    originalJudgment: "Measurement was expected to clarify recommendation quality.",
    outcomeSummary: summary,
    wasCorrect: measurement.changePercent === undefined ? null : measurement.changePercent >= 0,
    whatWasMissed: identifyMissedSignals(summary).join(" "),
    whatChanged: measurement.notes ?? "Measurement changed confidence calibration.",
    lesson: extractLesson(summary),
    recalibrationSuggestion: createRecalibrationSuggestion(summary)
  });
}

export function createReflectionFromLearning(learning: Learning): Reflection {
  const summary = `${learning.summary} ${learning.recommendationImpact}`;
  return baseReflection({
    workspaceId: learning.workspaceId,
    organizationId: learning.organizationId,
    title: `Reflection: ${learning.title}`,
    sourceType: "Learning",
    sourceId: learning.id,
    summary: learning.summary,
    whatWorked: summarizeWhatWorked(summary),
    whatFailed: summarizeWhatFailed(summary),
    wrongAssumptions: extractWrongAssumptions(summary),
    newLearning: learning.recommendationImpact,
    futureAdjustment: recommendFutureAdjustment(summary),
    confidenceScore: learning.confidenceScore,
    originalJudgment: learning.recommendationImpact,
    outcomeSummary: learning.summary,
    wasCorrect: /increase|improv|strong|better|support/i.test(summary) ? true : /lag|delay|lower|failed|missing/i.test(summary) ? false : null,
    whatWasMissed: identifyMissedSignals(summary).join(" "),
    whatChanged: learning.recommendationImpact,
    lesson: extractLesson(summary),
    recalibrationSuggestion: createRecalibrationSuggestion(summary)
  });
}

export const reflectOnCompletedExecution = createReflectionFromExecution;

export function reflectOnRecommendationOutcome(
  recommendation: RecommendedAction,
  outcomeSummary: string,
  judgment?: ExecutiveJudgment | JudgmentRecord
): Reflection {
  const originalJudgment = judgment
    ? "finalRecommendation" in judgment
      ? judgment.finalRecommendation
      : judgment.judgment
    : recommendation.title;
  return createReflection({
    workspaceId: recommendation.workspaceId,
    organizationId: recommendation.organizationId,
    sourceType: "RecommendedAction",
    sourceId: recommendation.id,
    originalJudgment,
    outcomeSummary,
    confidenceScore: recommendation.confidenceScore
  });
}

export function reflectionsForWorkspace(state: PlatformState, workspaceId: string) {
  return state.reflections.filter((item) => item.workspaceId === workspaceId);
}
