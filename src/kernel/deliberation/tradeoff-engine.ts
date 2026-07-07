import { createScopedId, orgId } from "@/lib/vgos-data";
import type { DecisionOption, InstructionResult, Tradeoff } from "@/kernel/deliberation/deliberation-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function optionName(optionId: string, options: DecisionOption[]) {
  return options.find((option) => option.id === optionId)?.title ?? optionId;
}

export function addTradeoff(input: {
  workspaceId: string;
  deliberationId: string;
  optionA: string;
  optionB: string;
  comparisonSummary: string;
  benefit: string;
  cost: string;
  risk: string;
  reversibilityScore?: number;
  confidenceScore?: number;
  organizationId?: string;
  now?: string;
}): InstructionResult<Tradeoff> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.deliberationId) return { success: false, error: "deliberationId is required." };
  if (!input.optionA || !input.optionB) return { success: false, error: "Two options are required for a tradeoff." };
  if (!input.comparisonSummary.trim()) return { success: false, error: "comparisonSummary is required." };

  const date = input.now ?? nowIso();
  const tradeoff: Tradeoff = {
    id: createScopedId("deliberation-tradeoff"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    deliberationId: input.deliberationId,
    optionA: input.optionA,
    optionB: input.optionB,
    comparisonSummary: input.comparisonSummary,
    benefit: input.benefit,
    cost: input.cost,
    risk: input.risk,
    reversibilityScore: clamp01(input.reversibilityScore ?? 0.58),
    confidenceScore: clamp01(input.confidenceScore ?? 0.64),
    createdAt: date,
    updatedAt: date
  };

  return {
    success: true,
    data: tradeoff,
    warnings: tradeoff.risk.trim() ? undefined : ["Tradeoff has no risk statement."]
  };
}

export function generateTradeoffFromOptions(input: {
  deliberationId: string;
  workspaceId: string;
  optionA: DecisionOption;
  optionB: DecisionOption;
  organizationId?: string;
}): Tradeoff {
  const upsideDelta = input.optionA.expectedImpact - input.optionB.expectedImpact;
  const effortDelta = input.optionA.estimatedEffort - input.optionB.estimatedEffort;
  const optionAName = input.optionA.title;
  const optionBName = input.optionB.title;

  return addTradeoff({
    workspaceId: input.workspaceId,
    organizationId: input.organizationId ?? input.optionA.organizationId,
    deliberationId: input.deliberationId,
    optionA: input.optionA.id,
    optionB: input.optionB.id,
    comparisonSummary: `${optionAName} has ${Math.abs(upsideDelta)} points ${upsideDelta >= 0 ? "more" : "less"} expected impact than ${optionBName}.`,
    benefit: upsideDelta >= 0 ? `${optionAName} has stronger upside.` : `${optionBName} preserves more upside.`,
    cost: effortDelta > 0 ? `${optionAName} requires more execution capacity.` : `${optionBName} requires more execution capacity.`,
    risk: input.optionA.cons[0] ?? input.optionB.cons[0] ?? "The opportunity cost is not yet fully understood.",
    reversibilityScore: input.optionA.optionType === "DEFER_DECISION" || input.optionB.optionType === "DEFER_DECISION" ? 0.72 : 0.55,
    confidenceScore: (input.optionA.confidenceScore + input.optionB.confidenceScore) / 2
  }).data as Tradeoff;
}

export function summarizeTradeoff(tradeoff: Tradeoff, options: DecisionOption[] = []) {
  return `${optionName(tradeoff.optionA, options)} vs ${optionName(tradeoff.optionB, options)}: ${tradeoff.comparisonSummary} Benefit: ${tradeoff.benefit} Cost: ${tradeoff.cost}`;
}
