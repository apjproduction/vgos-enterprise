import { qualityLabel, recommendReadinessFromScore, scoreDecisionQuality } from "@/kernel/deliberation/decision-quality";
import { getUnresolvedObjections } from "@/kernel/deliberation/objection-engine";
import { summarizeTradeoff } from "@/kernel/deliberation/tradeoff-engine";
import { weakestAssumptions } from "@/kernel/deliberation/assumption-engine";
import type {
  Assumption,
  DecisionOption,
  DecisionQualityBrief,
  DecisionQualityTask,
  Deliberation,
  DeliberationSummary,
  InstructionResult,
  Objection,
  Tradeoff
} from "@/kernel/deliberation/deliberation-types";
import type { PlatformState } from "@/lib/vgos-data";

function titleForDeliberation(deliberation: Deliberation, state?: PlatformState) {
  return deliberation.title ??
    state?.decisionSituations.find((situation) => situation.id === deliberation.situationId)?.title ??
    deliberation.summary;
}

function optionsForDeliberation(state: PlatformState, deliberation: Deliberation) {
  return state.decisionOptions.filter((option) =>
    option.deliberationId === deliberation.id || option.situationId === deliberation.situationId
  );
}

function assumptionsForDeliberation(state: PlatformState, deliberationId: string) {
  return (state.deliberationAssumptions ?? []).filter((assumption) => assumption.deliberationId === deliberationId);
}

function tradeoffsForDeliberation(state: PlatformState, deliberationId: string) {
  return (state.deliberationTradeoffs ?? []).filter((tradeoff) => tradeoff.deliberationId === deliberationId);
}

function objectionsForDeliberation(state: PlatformState, deliberationId: string) {
  return (state.deliberationObjections ?? []).filter((objection) => objection.deliberationId === deliberationId);
}

function evidenceForOption(option: DecisionOption) {
  return [...(option.evidenceIds ?? []), ...option.evidence].filter(Boolean);
}

function recommendedAction(summary: DeliberationSummary) {
  const readiness = recommendReadinessFromScore(summary.qualityScore);
  if (readiness.status === "READY_FOR_COMMITMENT") return "Convert ready decision to commitment.";
  return readiness.nextActions[0] ?? "Review the decision quality warnings.";
}

export function buildDeliberationSummary(input: {
  deliberation: Deliberation;
  options: DecisionOption[];
  assumptions?: Assumption[];
  tradeoffs?: Tradeoff[];
  objections?: Objection[];
  state?: PlatformState;
}): DeliberationSummary {
  const assumptions = input.assumptions ?? [];
  const tradeoffs = input.tradeoffs ?? [];
  const objections = input.objections ?? [];
  const recommended = input.options.find((option) => option.id === input.deliberation.recommendedOptionId);
  const decisionId = input.deliberation.decisionId ?? input.deliberation.situationId ?? input.deliberation.id;
  const qualityScore = scoreDecisionQuality({
    decisionId,
    options: input.options,
    assumptions,
    tradeoffs,
    objections,
    confidenceScore: input.deliberation.confidenceScore,
    rationale: input.deliberation.finalJudgment
  });
  const summary: DeliberationSummary = {
    deliberationId: input.deliberation.id,
    decisionId,
    title: titleForDeliberation(input.deliberation, input.state),
    status: input.deliberation.status,
    recommendedOption: recommended?.title,
    evidence: input.options.flatMap(evidenceForOption).slice(0, 5),
    assumptions: assumptions.length ? assumptions.map((assumption) => assumption.statement) : input.options.flatMap((option) => option.assumptions).slice(0, 5),
    tradeoffs: tradeoffs.map((tradeoff) => summarizeTradeoff(tradeoff, input.options)).slice(0, 4),
    unresolvedObjections: getUnresolvedObjections(objections).map((objection) => objection.statement),
    confidence: input.deliberation.confidenceScore,
    qualityScore,
    recommendedNextAction: ""
  };

  return {
    ...summary,
    recommendedNextAction: recommendedAction(summary)
  };
}

export function summarizeDeliberation(input: Parameters<typeof buildDeliberationSummary>[0]): InstructionResult<DeliberationSummary> {
  if (!input.deliberation.id) return { success: false, error: "Deliberation id is required." };
  const summary = buildDeliberationSummary(input);
  return {
    success: true,
    data: summary,
    warnings: summary.qualityScore.warnings
  };
}

function buildTasks(summary: DeliberationSummary, assumptions: Assumption[], objections: Objection[], options: DecisionOption[]): DecisionQualityTask[] {
  const tasks: DecisionQualityTask[] = [];
  const base = `${summary.deliberationId}-${summary.qualityScore.decisionId}`;

  if (summary.qualityScore.warnings.some((warning) => /untested|high-confidence assumption/i.test(warning))) {
    const assumption = weakestAssumptions(assumptions)[0];
    tasks.push({
      id: `${base}-validate-assumption`,
      deliberationId: summary.deliberationId,
      title: `Validate assumption${assumption ? `: ${assumption.statement}` : ""}`,
      taskType: "VALIDATE_ASSUMPTION",
      reason: "Assumption quality is limiting decision confidence.",
      severity: "HIGH"
    });
  }

  if (summary.qualityScore.warnings.some((warning) => /objections remain/i.test(warning))) {
    const objection = getUnresolvedObjections(objections)[0];
    tasks.push({
      id: `${base}-resolve-objection`,
      deliberationId: summary.deliberationId,
      title: `Resolve objection${objection ? `: ${objection.statement}` : ""}`,
      taskType: "RESOLVE_OBJECTION",
      reason: "Unresolved objections reduce readiness.",
      severity: objection?.severity ?? "HIGH"
    });
  }

  if (summary.qualityScore.warnings.some((warning) => /no evidence|evidence is weak/i.test(warning))) {
    tasks.push({
      id: `${base}-add-evidence`,
      deliberationId: summary.deliberationId,
      title: "Add missing evidence",
      taskType: "ADD_MISSING_EVIDENCE",
      reason: "Evidence quality is below the commitment threshold.",
      severity: "HIGH"
    });
  }

  if (options.length < 2) {
    tasks.push({
      id: `${base}-compare-alternatives`,
      deliberationId: summary.deliberationId,
      title: "Compare alternatives",
      taskType: "COMPARE_ALTERNATIVES",
      reason: "A decision should consider at least two viable options.",
      severity: "MEDIUM"
    });
  }

  if (summary.qualityScore.overallScore < 0.5 && ["DECIDED", "COMPLETED"].includes(summary.status)) {
    tasks.push({
      id: `${base}-reopen-weak`,
      deliberationId: summary.deliberationId,
      title: "Reopen weak decision",
      taskType: "REOPEN_WEAK_DECISION",
      reason: "A committed decision has weak decision-quality coverage.",
      severity: "CRITICAL"
    });
  }

  if (recommendReadinessFromScore(summary.qualityScore).status === "READY_FOR_COMMITMENT") {
    tasks.push({
      id: `${base}-convert-commitment`,
      deliberationId: summary.deliberationId,
      title: "Convert ready decision to commitment",
      taskType: "CONVERT_READY_DECISION",
      reason: "Decision quality is high enough for a bounded commitment.",
      severity: "MEDIUM"
    });
  }

  return tasks;
}

export function buildDecisionQualityBrief(state: PlatformState, workspaceId: string): DecisionQualityBrief {
  const workspaceDeliberations = state.deliberations
    .filter((deliberation) => deliberation.workspaceId === workspaceId)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const summaries = workspaceDeliberations.map((deliberation) =>
    buildDeliberationSummary({
      deliberation,
      options: optionsForDeliberation(state, deliberation),
      assumptions: assumptionsForDeliberation(state, deliberation.id),
      tradeoffs: tradeoffsForDeliberation(state, deliberation.id),
      objections: objectionsForDeliberation(state, deliberation.id),
      state
    })
  );
  const readyForCommitment = summaries.filter((summary) => recommendReadinessFromScore(summary.qualityScore).status === "READY_FOR_COMMITMENT");
  const weakEvidence = summaries.filter((summary) =>
    summary.qualityScore.evidenceQuality < 0.55 || summary.qualityScore.warnings.some((warning) => /no evidence|evidence is weak/i.test(warning))
  );
  const unresolvedObjections = (state.deliberationObjections ?? []).filter((objection) =>
    objection.workspaceId === workspaceId && !["MITIGATED", "REJECTED", "SUPERSEDED"].includes(objection.status)
  );
  const highRiskAssumptions = (state.deliberationAssumptions ?? []).filter((assumption) =>
    assumption.workspaceId === workspaceId &&
    (assumption.status === "CHALLENGED" || assumption.status === "UNTESTED" || (assumption.confidenceScore >= 0.8 && assumption.evidenceIds.length === 0))
  );
  const highestQualityRecentDecision = summaries
    .filter((summary) => ["DECIDED", "COMPLETED", "READY_FOR_DECISION", "DECIDED"].includes(summary.status))
    .sort((a, b) => b.qualityScore.overallScore - a.qualityScore.overallScore)[0] ?? summaries.sort((a, b) => b.qualityScore.overallScore - a.qualityScore.overallScore)[0];
  const underDeliberation = summaries.filter((summary) =>
    ["OPEN", "UNDER_REVIEW", "REOPENED", "DRAFT", "NEEDS_EVIDENCE"].includes(summary.status)
  );
  const tasks = summaries.flatMap((summary) =>
    buildTasks(
      summary,
      (state.deliberationAssumptions ?? []).filter((assumption) => assumption.deliberationId === summary.deliberationId),
      (state.deliberationObjections ?? []).filter((objection) => objection.deliberationId === summary.deliberationId),
      state.decisionOptions.filter((option) => option.deliberationId === summary.deliberationId || option.situationId === summary.decisionId)
    )
  );
  const ready = readyForCommitment[0];
  const weak = weakEvidence[0];
  const summary = ready
    ? `VGOS found that ${ready.title} is ready for commitment with ${qualityLabel(ready.qualityScore)} decision quality. ${weak && weak.deliberationId !== ready.deliberationId ? `${weak.title} remains lower-confidence because ${weak.qualityScore.warnings[0]?.toLowerCase() ?? "evidence coverage is weak"}.` : ""}`
    : weak
      ? `VGOS found no decision ready for commitment yet. ${weak.title} needs better evidence before confidence should rise.`
      : "VGOS did not find a decision-quality blocker in the current workspace.";

  return {
    summary,
    underDeliberation,
    readyForCommitment,
    weakEvidence,
    unresolvedObjections,
    highRiskAssumptions,
    highestQualityRecentDecision,
    tasks
  };
}
