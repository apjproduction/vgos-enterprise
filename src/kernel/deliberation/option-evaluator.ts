import { createScopedId, orgId } from "@/lib/vgos-data";
import type { PlatformState, Priority } from "@/lib/vgos-data";
import type { DecisionOption, DecisionSituation, OptionEvaluation } from "@/kernel/deliberation/deliberation-types";

function clamp100(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function riskValue(priority: Priority) {
  return { LOW: 18, MEDIUM: 42, HIGH: 68, CRITICAL: 88 }[priority] ?? 50;
}

function urgencyValue(priority: Priority) {
  return { LOW: 25, MEDIUM: 55, HIGH: 78, CRITICAL: 92 }[priority] ?? 50;
}

export function scoreImpact(option: DecisionOption) {
  return clamp100(option.expectedImpact * 0.72 + option.confidenceScore * 28);
}

export function scoreEffort(option: DecisionOption) {
  return clamp100(100 - option.estimatedEffort);
}

export function scoreRisk(option: DecisionOption) {
  return clamp100(100 - riskValue(option.riskLevel));
}

export function scoreEvidence(option: DecisionOption, state?: PlatformState) {
  const directEvidence = option.evidence.length * 12;
  const assessed = state?.evidenceAssessments
    .filter((item) => item.workspaceId === option.workspaceId && option.evidence.some((evidence) => item.summary.toLowerCase().includes(evidence.toLowerCase().split(" ")[0] ?? "")))
    .map((item) => item.overallScore * 100) ?? [];
  const assessedAverage = assessed.length ? assessed.reduce((sum, value) => sum + value, 0) / assessed.length : 58;
  return clamp100(assessedAverage * 0.65 + directEvidence);
}

export function scoreAlignment(option: DecisionOption, situation: DecisionSituation) {
  const text = `${option.title} ${option.description}`.toLowerCase();
  let score = 58;
  if (situation.missionId) score += 12;
  if (/demo|proof|founder|content|directory|channel|mission/.test(text)) score += 14;
  if (option.optionType === "DO_NOTHING") score -= 18;
  return clamp100(score);
}

export function scoreUrgency(option: DecisionOption, situation: DecisionSituation) {
  const base = urgencyValue(situation.urgency);
  const actionBoost = ["CREATE_DEMO", "START_EXECUTION", "REPLY_COMMUNITY", "CREATE_CONTENT"].includes(option.optionType) ? 8 : 0;
  const deferPenalty = option.optionType === "DEFER_DECISION" || option.optionType === "DO_NOTHING" ? 18 : 0;
  return clamp100(base + actionBoost - deferPenalty);
}

export function calculateOverallOptionScore(input: {
  impactScore: number;
  effortScore: number;
  riskScore: number;
  evidenceScore: number;
  alignmentScore: number;
  urgencyScore: number;
}) {
  return clamp100(
    input.impactScore * 0.27 +
      input.evidenceScore * 0.2 +
      input.alignmentScore * 0.2 +
      input.urgencyScore * 0.15 +
      input.riskScore * 0.12 +
      input.effortScore * 0.06
  );
}

export function explainOptionScore(option: DecisionOption, evaluation: OptionEvaluation) {
  return `${option.title} scores ${evaluation.overallScore}/100 because impact is ${evaluation.impactScore}, evidence is ${evaluation.evidenceScore}, alignment is ${evaluation.alignmentScore}, and risk-adjusted effort is ${evaluation.riskScore}.`;
}

export function evaluateOption(option: DecisionOption, situation: DecisionSituation, state?: PlatformState): OptionEvaluation {
  const impactScore = scoreImpact(option);
  const effortScore = scoreEffort(option);
  const riskScore = scoreRisk(option);
  const evidenceScore = scoreEvidence(option, state);
  const alignmentScore = scoreAlignment(option, situation);
  const urgencyScore = scoreUrgency(option, situation);
  const overallScore = calculateOverallOptionScore({ impactScore, effortScore, riskScore, evidenceScore, alignmentScore, urgencyScore });
  const date = new Date().toISOString();

  return {
    id: createScopedId("option-evaluation"),
    organizationId: option.organizationId ?? orgId,
    workspaceId: option.workspaceId,
    optionId: option.id,
    situationId: situation.id,
    impactScore,
    effortScore,
    riskScore,
    evidenceScore,
    alignmentScore,
    urgencyScore,
    overallScore,
    rationale: explainOptionScore(option, {
      id: "",
      organizationId: option.organizationId,
      workspaceId: option.workspaceId,
      optionId: option.id,
      situationId: situation.id,
      impactScore,
      effortScore,
      riskScore,
      evidenceScore,
      alignmentScore,
      urgencyScore,
      overallScore,
      rationale: "",
      createdAt: date,
      updatedAt: date
    }),
    createdAt: date,
    updatedAt: date
  };
}
