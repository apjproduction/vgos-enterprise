import { createScopedId, orgId } from "@/lib/vgos-data";
import type { ExecutionItem, PlatformState } from "@/lib/vgos-data";
import { generateOptionsForSituation } from "@/kernel/deliberation/option-generator";
import { evaluateOption } from "@/kernel/deliberation/option-evaluator";
import { challengeOption, generateDissentingView as generateOptionDissentingView } from "@/kernel/deliberation/option-challenger";
import type {
  DecisionCommitment,
  DecisionOption,
  DecisionSituation,
  Deliberation,
  DeliberationResult,
  OptionEvaluation
} from "@/kernel/deliberation/deliberation-types";

function nowIso() {
  return new Date().toISOString();
}

export function compareOptions(options: DecisionOption[], evaluations: OptionEvaluation[]) {
  return [...options].sort((a, b) => {
    const aScore = evaluations.find((item) => item.optionId === a.id)?.overallScore ?? 0;
    const bScore = evaluations.find((item) => item.optionId === b.id)?.overallScore ?? 0;
    return bScore - aScore;
  });
}

export function selectRecommendedOption(options: DecisionOption[], evaluations: OptionEvaluation[]) {
  return compareOptions(options, evaluations)[0];
}

export function generateDissentingView(option?: DecisionOption) {
  return option ? generateOptionDissentingView(option) : "The dissenting view is that VGOS should wait for better evidence before committing.";
}

export function determineIfDecisionShouldBeDeferred(recommended: DecisionOption | undefined, evaluation?: OptionEvaluation) {
  return !recommended || recommended.optionType === "DEFER_DECISION" || (evaluation?.overallScore ?? 0) < 62 || recommended.confidenceScore < 0.62;
}

export function generateFinalJudgment(input: {
  situation: DecisionSituation;
  recommended?: DecisionOption;
  evaluations: OptionEvaluation[];
  deferred: boolean;
}) {
  if (!input.recommended) return "VGOS cannot make a confident decision because no viable option was generated.";
  const score = input.evaluations.find((item) => item.optionId === input.recommended?.id)?.overallScore ?? 0;
  if (input.deferred) {
    return `VGOS should defer ${input.situation.title.toLowerCase()} because the best option only scores ${score}/100 and needs stronger evidence.`;
  }
  return `VGOS compared ${input.evaluations.length} options and recommends ${input.recommended.title.toLowerCase()} with a risk-adjusted score of ${score}/100.`;
}

export function createDecisionCommitment(input: {
  situation: DecisionSituation;
  deliberation: Deliberation;
  option: DecisionOption;
  owner?: string;
  linkedExecutionItemId?: string | null;
  linkedPlanItemId?: string | null;
}): DecisionCommitment {
  const date = nowIso();
  const isDeferred = input.option.optionType === "DEFER_DECISION" || input.deliberation.status === "DEFERRED";
  return {
    id: createScopedId("decision-commitment"),
    organizationId: input.situation.organizationId ?? orgId,
    workspaceId: input.situation.workspaceId,
    situationId: input.situation.id,
    deliberationId: input.deliberation.id,
    optionId: input.option.id,
    title: isDeferred ? `Monitor evidence for ${input.situation.title}` : `Commit: ${input.option.title}`,
    description: isDeferred ? input.deliberation.whatWouldChangeDecision : input.option.description,
    commitmentType: isDeferred ? "DEFER" : input.option.optionType === "RUN_EXPERIMENT" ? "EXPERIMENT" : input.option.optionType === "DEFER_DECISION" ? "DEFER" : "EXECUTE_NOW",
    status: "COMMITTED",
    owner: input.owner ?? "Growth Intelligence",
    dueDate: isDeferred ? null : new Date(Date.now() + 3 * 86400000).toISOString(),
    linkedExecutionItemId: input.linkedExecutionItemId ?? null,
    linkedPlanItemId: input.linkedPlanItemId ?? null,
    createdAt: date,
    updatedAt: date
  };
}

export function deliberate(situation: DecisionSituation, state: PlatformState): DeliberationResult {
  const existingOptions = state.decisionOptions.filter((item) => item.situationId === situation.id);
  const options = existingOptions.length ? existingOptions : generateOptionsForSituation(situation);
  const existingEvaluations = state.optionEvaluations.filter((item) => item.situationId === situation.id);
  const evaluations = existingEvaluations.length ? existingEvaluations : options.map((option) => evaluateOption(option, situation, state));
  const storedDeliberation = state.deliberations
    .filter((item) => item.situationId === situation.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const recommendedOption = storedDeliberation?.recommendedOptionId
    ? options.find((option) => option.id === storedDeliberation.recommendedOptionId) ?? selectRecommendedOption(options, evaluations)
    : selectRecommendedOption(options, evaluations);
  const recommendedEvaluation = evaluations.find((item) => item.optionId === recommendedOption?.id);
  const deferred = determineIfDecisionShouldBeDeferred(recommendedOption, recommendedEvaluation);
  const rejectedOptions = options.filter((option) => option.id !== recommendedOption?.id);
  const challenges = Object.fromEntries(options.map((option) => [option.id, challengeOption(option, state)]));
  const confidenceScore = Math.max(0.42, Math.min(0.92, ((recommendedEvaluation?.overallScore ?? 55) / 100) * 0.7 + (recommendedOption?.confidenceScore ?? 0.5) * 0.3));
  const date = nowIso();
  const generatedDeliberation: Deliberation = {
    id: createScopedId("deliberation"),
    organizationId: situation.organizationId,
    workspaceId: situation.workspaceId,
    situationId: situation.id,
    summary: `VGOS compared ${options.length} options for ${situation.title}.`,
    recommendedOptionId: recommendedOption?.id ?? null,
    rejectedOptionIds: rejectedOptions.map((option) => option.id),
    finalJudgment: generateFinalJudgment({ situation, recommended: recommendedOption, evaluations, deferred }),
    confidenceScore: Number(confidenceScore.toFixed(2)),
    dissentingView: generateDissentingView(recommendedOption),
    whatWouldChangeDecision: recommendedOption ? challenges[recommendedOption.id].whatWouldMakeThisWrong.join(" ") : "A viable option with stronger evidence.",
    status: deferred ? "DEFERRED" : "COMPLETED",
    createdAt: date,
    updatedAt: date
  };
  const deliberation = storedDeliberation ?? generatedDeliberation;
  const storedCommitment = state.decisionCommitments
    .find((item) => item.situationId === situation.id && item.deliberationId === deliberation.id);
  const commitment = storedCommitment ?? createDecisionCommitment({ situation, deliberation, option: recommendedOption ?? options[0] });

  return {
    situation,
    options,
    evaluations,
    recommendedOption,
    rejectedOptions,
    challenges,
    deliberation,
    commitment
  };
}

export function convertCommitmentToExecutionItem(commitment: DecisionCommitment, option: DecisionOption): Partial<ExecutionItem> {
  return {
    title: commitment.title,
    description: commitment.description,
    sourceType: "DecisionCommitment",
    sourceId: commitment.id,
    expectedImpact: option.description,
    notes: `Created from deliberation commitment ${commitment.id}.`
  };
}
