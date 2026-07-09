import {
  nowIso,
  type ClaimImpact,
  type CapabilityImpact,
  type OutcomeEvaluation,
  type OutcomeLearningState,
  type OutcomeLearningSummary,
  type OutcomeLearningTask,
  type OutcomeRecordLike
} from "@/kernel/outcomes/outcome-types";

function sourceMatches(evaluation: OutcomeEvaluation, sourceType: string, sourceId: string) {
  return evaluation.sourceId === sourceId &&
    (evaluation.sourceType === sourceType ||
      (sourceType === "Commitment" && evaluation.sourceType === "DecisionCommitment") ||
      (sourceType === "DecisionCommitment" && evaluation.sourceType === "Commitment"));
}

function mostImportantEvaluation(evaluations: OutcomeEvaluation[]) {
  return [...evaluations].sort((a, b) =>
    (b.confidenceScore + Math.abs(b.successScore - 0.5)) - (a.confidenceScore + Math.abs(a.successScore - 0.5)) ||
    Date.parse(b.evaluatedAt) - Date.parse(a.evaluatedAt)
  )[0];
}

function missingOutcomeTasks(outcomes: OutcomeRecordLike[]): OutcomeLearningTask[] {
  return outcomes
    .filter((outcome) => !outcome.actualOutcome?.trim() && !outcome.resultSummary?.trim())
    .map((outcome) => ({
      id: `record-missing-outcome-${outcome.id}`,
      title: "Record missing outcome",
      taskType: "RECORD_MISSING_OUTCOME",
      sourceType: outcome.sourceType ?? "Outcome",
      sourceId: outcome.sourceId ?? outcome.id,
      outcomeId: outcome.id,
      reason: `${outcome.title ?? outcome.id} has an expected outcome but no measurable actual outcome yet.`,
      severity: "HIGH"
    }));
}

function completedSourceTasks(input: OutcomeLearningState, evaluations: OutcomeEvaluation[]): OutcomeLearningTask[] {
  const commitmentTasks = (input.decisionCommitments ?? [])
    .filter((commitment) => commitment.status === "COMPLETED")
    .filter((commitment) => !evaluations.some((evaluation) => sourceMatches(evaluation, "DecisionCommitment", commitment.id)))
    .map((commitment) => ({
      id: `evaluate-completed-commitment-${commitment.id}`,
      title: "Evaluate completed commitment",
      taskType: "EVALUATE_COMPLETED_COMMITMENT" as const,
      sourceType: "DecisionCommitment",
      sourceId: commitment.id,
      reason: "Commitment appears complete, but no outcome evaluation exists yet.",
      severity: "HIGH" as const
    }));

  const executionTasks = (input.executionItems ?? [])
    .filter((execution) => execution.status === "COMPLETED")
    .filter((execution) => !evaluations.some((evaluation) => sourceMatches(evaluation, "ExecutionItem", execution.id)))
    .map((execution) => ({
      id: `evaluate-completed-execution-${execution.id}`,
      title: "Evaluate completed execution",
      taskType: "EVALUATE_COMPLETED_COMMITMENT" as const,
      sourceType: "ExecutionItem",
      sourceId: execution.id,
      reason: "Completed work has not been converted into an outcome evaluation.",
      severity: "MEDIUM" as const
    }));

  return [...commitmentTasks, ...executionTasks];
}

function loopTasks(input: OutcomeLearningState, evaluations: OutcomeEvaluation[]): OutcomeLearningTask[] {
  const attributions = input.outcomeAttributions ?? [];
  const claimImpacts = input.claimImpacts ?? [];
  const capabilityImpacts = input.capabilityImpacts ?? [];
  const artifacts = input.learningArtifacts ?? [];
  const reflections = input.reflections ?? [];
  const integrities = input.learningLoopIntegrities ?? [];
  const tasks: OutcomeLearningTask[] = [];

  for (const evaluation of evaluations) {
    const attribution = attributions.find((item) => item.outcomeId === evaluation.outcomeId);
    const sourceType = evaluation.sourceType;
    const sourceId = evaluation.sourceId;
    if (!attribution) {
      tasks.push({
        id: `add-attribution-${evaluation.outcomeId}`,
        title: "Add attribution evidence",
        taskType: "ADD_ATTRIBUTION_EVIDENCE",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "Outcome has been evaluated but no attribution exists yet.",
        severity: "HIGH"
      });
    } else if (attribution.confidenceScore < 0.58) {
      tasks.push({
        id: `review-low-attribution-${evaluation.outcomeId}`,
        title: "Review low-confidence attribution",
        taskType: "REVIEW_LOW_CONFIDENCE_ATTRIBUTION",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "Attribution confidence is low enough to require review before updating strategy.",
        severity: "MEDIUM"
      });
    }
    if (!reflections.some((reflection) => reflection.sourceId === evaluation.outcomeId || reflection.sourceId === evaluation.sourceId)) {
      tasks.push({
        id: `convert-outcome-reflection-${evaluation.outcomeId}`,
        title: "Convert outcome into reflection",
        taskType: "CONVERT_OUTCOME_TO_REFLECTION",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "Outcome learning has not been captured as a reflection.",
        severity: "MEDIUM"
      });
    }
    if (!claimImpacts.some((impact) => impact.outcomeId === evaluation.outcomeId)) {
      tasks.push({
        id: `update-claim-${evaluation.outcomeId}`,
        title: "Update related claim",
        taskType: "UPDATE_RELATED_CLAIM",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "No related claim impact is recorded for this outcome.",
        severity: "MEDIUM"
      });
    }
    if (!capabilityImpacts.some((impact) => impact.outcomeId === evaluation.outcomeId)) {
      tasks.push({
        id: `update-capability-${evaluation.outcomeId}`,
        title: "Update capability maturity",
        taskType: "UPDATE_CAPABILITY_MATURITY",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "No capability maturity impact is recorded for this outcome.",
        severity: "MEDIUM"
      });
    }
    if (!artifacts.some((artifact) => artifact.sourceId === evaluation.sourceId || artifact.id.includes(evaluation.outcomeId))) {
      tasks.push({
        id: `create-learning-artifact-${evaluation.outcomeId}`,
        title: "Create reusable learning artifact",
        taskType: "CREATE_REUSABLE_LEARNING_ARTIFACT",
        sourceType,
        sourceId,
        outcomeId: evaluation.outcomeId,
        reason: "Outcome learning has not been made reusable for future decisions.",
        severity: "LOW"
      });
    }
  }

  for (const integrity of integrities.filter((item) => !item.complete)) {
    tasks.push({
      id: `complete-learning-loop-${integrity.sourceId}`,
      title: "Complete learning loop",
      taskType: "COMPLETE_LEARNING_LOOP",
      sourceType: integrity.sourceType,
      sourceId: integrity.sourceId,
      reason: integrity.warnings[0] ?? "Outcome learning loop is incomplete.",
      severity: integrity.integrityScore < 0.5 ? "HIGH" : "MEDIUM"
    });
  }

  return tasks;
}

function textForImpact(impact?: ClaimImpact | CapabilityImpact) {
  if (!impact) return undefined;
  return `${impact.impactType.toLowerCase().replace(/_/g, " ")} (${Math.round(Math.abs("confidenceDelta" in impact ? impact.confidenceDelta : 0) * 100)} pts)`;
}

export function summarizeOutcomeLearning(input: {
  workspaceId: string;
  state: OutcomeLearningState;
  now?: string;
}): OutcomeLearningSummary {
  const evaluations = (input.state.outcomeEvaluations ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const attributions = (input.state.outcomeAttributions ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const artifacts = (input.state.learningArtifacts ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const claimImpacts = (input.state.claimImpacts ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const capabilityImpacts = (input.state.capabilityImpacts ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const integrities = (input.state.learningLoopIntegrities ?? []).filter((item) => item.workspaceId === input.workspaceId);
  const top = mostImportantEvaluation(evaluations);
  const attribution = top ? attributions.find((item) => item.outcomeId === top.outcomeId) : undefined;
  const learningArtifact = top ? artifacts.find((item) => item.sourceId === top.sourceId || item.id.includes(top.outcomeId)) : undefined;
  const claimImpact = top ? claimImpacts.find((item) => item.outcomeId === top.outcomeId) : undefined;
  const capabilityImpact = top ? capabilityImpacts.find((item) => item.outcomeId === top.outcomeId) : undefined;
  const incompleteLearningLoop = integrities.find((item) => !item.complete);
  const commitmentMissingOutcomeEvaluation = (input.state.decisionCommitments ?? [])
    .filter((commitment) => commitment.workspaceId === input.workspaceId && commitment.status === "COMPLETED")
    .find((commitment) => !evaluations.some((evaluation) => sourceMatches(evaluation, "DecisionCommitment", commitment.id)));
  const tasks = [
    ...missingOutcomeTasks(input.state.outcomes ?? []),
    ...completedSourceTasks(input.state, evaluations),
    ...loopTasks(input.state, evaluations)
  ].filter((task, index, items) => items.findIndex((candidate) => candidate.id === task.id) === index);
  const summary = top
    ? `VGOS learned from ${top.sourceType} ${top.sourceId}: ${learningArtifact?.lesson ?? top.evaluationSummary} Cause: ${attribution?.rationale ?? "Attribution is still unclear."}`
    : "VGOS has no evaluated outcomes yet. Record actual outcomes before updating claims, capabilities, or state.";
  const warnings = [
    ...integrities.flatMap((item) => item.warnings),
    ...evaluations.flatMap((item) => item.warnings),
    attribution && attribution.confidenceScore < 0.58 ? "Most important outcome has low attribution confidence." : "",
    commitmentMissingOutcomeEvaluation ? "Commitment appears complete, but no outcome evaluation exists yet." : ""
  ].filter(Boolean);

  return {
    workspaceId: input.workspaceId,
    generatedAt: nowIso(input.now),
    mostImportantRecentOutcome: top,
    attribution,
    learningArtifact,
    claimImpact,
    capabilityImpact,
    incompleteLearningLoop,
    commitmentMissingOutcomeEvaluation,
    summary: [
      summary,
      claimImpact ? `Claim impact: ${textForImpact(claimImpact)}.` : "",
      capabilityImpact ? `Capability impact: ${textForImpact(capabilityImpact)}.` : ""
    ].filter(Boolean).join(" "),
    tasks,
    warnings: [...new Set(warnings)]
  };
}
