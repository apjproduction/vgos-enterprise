import { createScopedId, orgId } from "@/lib/vgos-data";
import type { TradeoffAnalysis, TradeoffInput, TradeoffOption } from "@/kernel/cognition/cognition-types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function optionScore(option: TradeoffOption) {
  return clamp01(option.expectedImpact * 0.38 + option.confidence * 0.32 - option.risk * 0.2 - option.effort * 0.1);
}

export function recommendBestOption(options: TradeoffOption[]) {
  return [...options].sort((a, b) => optionScore(b) - optionScore(a))[0];
}

export function analyzeOpportunityCost(options: TradeoffOption[], recommended: TradeoffOption) {
  const alternatives = options.filter((item) => item.label !== recommended.label);
  const bestAlternative = recommendBestOption(alternatives);
  if (!bestAlternative) return "No meaningful opportunity cost was detected.";
  return `Choosing ${recommended.label} delays ${bestAlternative.label}, which may defer ${Math.round(bestAlternative.expectedImpact * 100)}% expected impact.`;
}

export function explainTradeoff(options: TradeoffOption[], recommended: TradeoffOption) {
  const scores = options.map((item) => `${item.label}: ${Math.round(optionScore(item) * 100)}`).join(", ");
  return `${recommended.label} has the best risk-adjusted score. Scores: ${scores}.`;
}

export function compareOptions(input: TradeoffInput): TradeoffAnalysis {
  const options = input.options.filter(Boolean) as TradeoffOption[];
  const recommended = recommendBestOption(options);
  const date = new Date().toISOString();
  const averageRisk = options.reduce((sum, item) => sum + item.risk, 0) / options.length;

  return {
    id: createScopedId("tradeoff"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    sourceType: input.sourceType ?? null,
    sourceId: input.sourceId ?? null,
    optionA: input.options[0].label,
    optionB: input.options[1].label,
    optionC: input.options[2]?.label ?? null,
    recommendedOption: recommended.label,
    rationale: explainTradeoff(options, recommended),
    opportunityCost: analyzeOpportunityCost(options, recommended),
    riskSummary: `Average decision risk is ${Math.round(averageRisk * 100)}%; ${recommended.label} keeps the best balance of impact and confidence.`,
    confidenceScore: Number(optionScore(recommended).toFixed(2)),
    createdAt: date,
    updatedAt: date
  };
}

export function generateTradeoffSummary(tradeoff: TradeoffAnalysis): string {
  return `${tradeoff.recommendedOption} is recommended. ${tradeoff.rationale} ${tradeoff.opportunityCost}`;
}
