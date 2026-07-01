import { createScopedId, orgId } from "@/lib/vgos-data";
import type { ExecutionResult, Learning, Measurement } from "@/lib/vgos-data";
import type { Reflection } from "@/kernel/cognition/cognition-types";

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
    confidenceScore: result.impactScore ? Math.min(0.92, result.impactScore / 100) : 0.72
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
    confidenceScore: measurement.changePercent === undefined ? 0.68 : Math.min(0.9, 0.65 + Math.abs(measurement.changePercent) / 100)
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
    confidenceScore: learning.confidenceScore
  });
}
