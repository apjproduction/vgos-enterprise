import { computeExecutionReadiness } from "@/kernel/commitments/execution-readiness";
import { evaluateCommitmentRisk } from "@/kernel/commitments/commitment-risk";
import { computeCommitmentIntegrity } from "@/kernel/commitments/commitment-integrity";
import { detectCommitmentDrift } from "@/kernel/commitments/commitment-drift";
import { createCommitmentMonitoringPlan } from "@/kernel/commitments/commitment-monitor";
import { createCommitmentEscalation } from "@/kernel/commitments/commitment-escalation";
import type {
  CommitmentIntegrityBrief,
  CommitmentIntegritySummary,
  CommitmentIntegrityTask,
  CommitmentLike,
  CommitmentRiskLevel,
  CommitmentRiskProfile,
  InstructionResult
} from "@/kernel/commitments/commitment-types";
import type { DecisionCommitment } from "@/kernel/deliberation/deliberation-types";
import type { PlatformState } from "@/lib/vgos-data";

function sortByRisk(items: CommitmentIntegritySummary[]) {
  const rank: Record<CommitmentRiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return [...items].sort((a, b) =>
    rank[a.riskProfile.riskLevel] - rank[b.riskProfile.riskLevel] ||
    b.riskProfile.riskScore - a.riskProfile.riskScore ||
    a.integrity.overallScore - b.integrity.overallScore
  );
}

function asCommitmentLike(commitment: DecisionCommitment): CommitmentLike {
  return {
    ...commitment,
    decisionId: commitment.situationId,
    rationale: commitment.rationale ?? commitment.description,
    evidenceIds: commitment.evidenceIds ?? [],
    successCriteria: commitment.successCriteria ?? [],
    requiredResources: commitment.requiredResources ?? [],
    dependencies: commitment.dependencies ?? [],
    expectedOutcome: commitment.expectedOutcome ?? commitment.description
  };
}

function evidenceForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  const direct = commitment.evidenceIds ?? [];
  const option = state.decisionOptions.find((item) => item.id === commitment.optionId);
  const decisionQuality = state.decisionQualityScores.find((item) => item.decisionId === commitment.situationId);
  const executionEvidence = state.executionEvidence
    .filter((item) => item.executionItemId === commitment.linkedExecutionItemId)
    .map((item) => item.id);

  return {
    evidenceIds: [...new Set([...direct, ...(option?.evidenceIds ?? []), ...(option?.evidence ?? []), ...executionEvidence])],
    decisionQuality
  };
}

function blockersForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  if (!commitment.linkedExecutionItemId) return [];
  return state.executionBlockers
    .filter((blocker) => blocker.executionItemId === commitment.linkedExecutionItemId && ["OPEN", "IN_REVIEW"].includes(blocker.status))
    .map((blocker) => blocker.title);
}

function progressVisible(state: PlatformState, commitment: DecisionCommitment) {
  const execution = state.executionItems.find((item) => item.id === commitment.linkedExecutionItemId);
  return Boolean(execution && ["IN_PROGRESS", "COMPLETED", "APPROVED"].includes(execution.status));
}

function strategyForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  const directoryDecision = state.deliberations.find((item) => item.id === "deliberation-directory-strategy");
  if (/directory/i.test(`${commitment.title} ${commitment.description}`)) {
    return directoryDecision?.finalJudgment ?? "Pause low-confidence generic directories and focus on niche AI/video/productivity directories.";
  }
  return state.deliberations.find((item) => item.id === commitment.deliberationId)?.finalJudgment;
}

function monitoringForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  return state.commitmentMonitoringPlans.find((plan) => plan.commitmentId === commitment.id);
}

function escalationForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  return state.commitmentEscalations.find((item) => item.commitmentId === commitment.id && item.status === "OPEN");
}

function outcomeLearningForCommitment(state: PlatformState, commitment: DecisionCommitment) {
  const evaluation = state.outcomeEvaluations.find((item) =>
    item.workspaceId === commitment.workspaceId &&
    item.sourceId === commitment.id &&
    (item.sourceType === "DecisionCommitment" || item.sourceType === "Commitment")
  );
  const attribution = evaluation
    ? state.outcomeAttributions.find((item) => item.outcomeId === evaluation.outcomeId)
    : undefined;
  const integrity = state.learningLoopIntegrities.find((item) =>
    item.workspaceId === commitment.workspaceId &&
    item.sourceId === commitment.id &&
    (item.sourceType === "DecisionCommitment" || item.sourceType === "Commitment")
  );
  const learningArtifact = state.learningArtifacts.find((item) =>
    item.workspaceId === commitment.workspaceId &&
    (item.sourceId === commitment.id || (evaluation ? item.id.includes(evaluation.outcomeId) : false))
  );
  const capabilityImpact = evaluation
    ? state.capabilityImpacts.find((item) => item.outcomeId === evaluation.outcomeId)
    : undefined;
  const outcomeStatus: CommitmentIntegritySummary["outcomeStatus"] =
    evaluation && /not yet measurable|pending/i.test(evaluation.actualOutcome)
      ? "PENDING_MEASUREMENT"
      : evaluation
        ? "EVALUATED"
        : "NOT_RECORDED";
  const outcomeWarnings = [
    ...(evaluation?.warnings ?? []),
    ...(integrity?.warnings ?? []),
    commitment.status === "COMPLETED" && !evaluation
      ? "Commitment appears complete, but no outcome evaluation exists yet."
      : "",
    attribution && attribution.confidenceScore < 0.58 ? "Outcome attribution confidence is low." : ""
  ].filter(Boolean);

  return {
    outcomeStatus,
    outcomeEvaluation: evaluation,
    attributionConfidence: attribution?.confidenceScore,
    learningLoopIntegrity: integrity,
    learningLoopComplete: Boolean(integrity?.complete),
    createdReusableLearning: Boolean(learningArtifact),
    learningArtifact,
    capabilityImpact,
    outcomeWarnings
  };
}

function nextStep(profile: CommitmentRiskProfile) {
  if (profile.recommendedAction === "CLARIFY_OWNER") return "Assign a named owner before execution continues.";
  if (profile.recommendedAction === "ADD_EVIDENCE") return "Link evidence or reduce commitment confidence.";
  if (profile.recommendedAction === "RESOLVE_BLOCKER") return "Resolve the active blocker or replan the commitment.";
  if (profile.recommendedAction === "REPLAN") return "Replan around current strategy and drift signals.";
  if (profile.recommendedAction === "ESCALATE") return "Escalate to the recommended owner today.";
  return "Continue, but keep the monitoring plan current.";
}

function buildTasks(summary: CommitmentIntegritySummary): CommitmentIntegrityTask[] {
  const tasks: CommitmentIntegrityTask[] = [];
  const base = summary.commitmentId;
  const severity = summary.riskProfile.riskLevel === "LOW" ? "MEDIUM" : summary.riskProfile.riskLevel;

  if (!summary.readiness.ownerAssigned) {
    tasks.push({
      id: `${base}-assign-owner`,
      commitmentId: base,
      title: "Assign owner",
      taskType: "ASSIGN_OWNER",
      reason: "Commitment ownership is unclear.",
      severity
    });
  }
  if (!summary.readiness.successCriteriaDefined) {
    tasks.push({
      id: `${base}-success-criteria`,
      commitmentId: base,
      title: "Add success criteria",
      taskType: "ADD_SUCCESS_CRITERIA",
      reason: "Expected outcome needs measurable success criteria.",
      severity: "MEDIUM"
    });
  }
  if (!summary.readiness.evidenceLinked || summary.integrity.evidenceTraceability < 0.55) {
    tasks.push({
      id: `${base}-evidence`,
      commitmentId: base,
      title: "Add missing evidence",
      taskType: "ADD_MISSING_EVIDENCE",
      reason: "Evidence traceability is weak.",
      severity
    });
  }
  if (summary.riskProfile.dependencyRisk >= 0.7) {
    tasks.push({
      id: `${base}-blocker`,
      commitmentId: base,
      title: "Resolve blocker",
      taskType: "RESOLVE_BLOCKER",
      reason: "Dependencies or blockers are increasing risk.",
      severity
    });
  }
  if (summary.driftSignals.length) {
    tasks.push({
      id: `${base}-drift`,
      commitmentId: base,
      title: "Review drift",
      taskType: "REVIEW_DRIFT",
      reason: summary.driftSignals[0].description,
      severity: summary.driftSignals[0].severity
    });
  }
  if (["HIGH", "CRITICAL"].includes(summary.riskProfile.riskLevel)) {
    tasks.push({
      id: `${base}-escalate`,
      commitmentId: base,
      title: "Escalate commitment",
      taskType: "ESCALATE_COMMITMENT",
      reason: "Commitment risk is high enough to need an explicit owner decision.",
      severity: summary.riskProfile.riskLevel
    });
  }
  if (summary.riskProfile.recommendedAction === "REPLAN" || summary.riskProfile.recommendedAction === "PAUSE") {
    tasks.push({
      id: `${base}-replan`,
      commitmentId: base,
      title: "Replan commitment",
      taskType: "REPLAN_COMMITMENT",
      reason: "Current commitment path no longer matches the best strategy.",
      severity
    });
  }
  if (!summary.monitoringPlan) {
    tasks.push({
      id: `${base}-monitoring`,
      commitmentId: base,
      title: "Add monitoring plan",
      taskType: "ADD_MONITORING_PLAN",
      reason: "Execution needs leading and lagging indicators.",
      severity: "MEDIUM"
    });
  }
  if (summary.riskProfile.riskLevel === "LOW" && summary.readiness.ready) {
    tasks.push({
      id: `${base}-reflection`,
      commitmentId: base,
      title: "Convert commitment outcome into reflection",
      taskType: "CREATE_REFLECTION",
      reason: "Low-risk execution should still close the learning loop.",
      severity: "LOW"
    });
  }

  return tasks;
}

export function summarizeCommitmentIntegrity(input: {
  state: PlatformState;
  commitment: DecisionCommitment;
  now?: string;
}): InstructionResult<CommitmentIntegritySummary> {
  const { state, commitment } = input;
  const commitmentLike = asCommitmentLike(commitment);
  const { evidenceIds, decisionQuality } = evidenceForCommitment(state, commitment);
  const blockers = blockersForCommitment(state, commitment);
  const persistedDrift = state.commitmentDriftSignals.filter((item) => item.commitmentId === commitment.id);
  const detectedDrift = detectCommitmentDrift({
    commitment: {
      ...commitmentLike,
      evidenceIds
    },
    validatedStrategy: strategyForCommitment(state, commitment),
    evidenceIds,
    now: input.now
  }).data ?? [];
  const driftSignals = [...persistedDrift, ...detectedDrift].filter((item, index, items) =>
    items.findIndex((candidate) => candidate.driftType === item.driftType && candidate.commitmentId === item.commitmentId) === index
  );
  const readiness = computeExecutionReadiness({
    commitment: {
      ...commitmentLike,
      evidenceIds
    },
    evidenceIds,
    blockers
  }).data!;
  const riskProfile = evaluateCommitmentRisk({
    commitment: {
      ...commitmentLike,
      evidenceIds
    },
    readiness,
    decisionQualityScore: decisionQuality,
    evidenceIds,
    blockers,
    driftSignals,
    progressVisible: progressVisible(state, commitment),
    now: input.now
  }).data!;
  const monitoringPlan = monitoringForCommitment(state, commitment);
  const generatedMonitoringPlan = createCommitmentMonitoringPlan({
    commitment: {
      ...commitmentLike,
      evidenceIds
    },
    now: input.now
  }).data;
  const integrity = computeCommitmentIntegrity({
    commitment: {
      ...commitmentLike,
      evidenceIds
    },
    readiness,
    riskProfile,
    decisionQualityScore: decisionQuality,
    driftSignals,
    monitoringPlan: monitoringPlan ?? generatedMonitoringPlan,
    evidenceIds,
    progressVisible: progressVisible(state, commitment)
  }).data!;
  const escalation = escalationForCommitment(state, commitment) ??
    (riskProfile.riskLevel === "CRITICAL"
      ? createCommitmentEscalation({
          commitmentId: commitment.id,
          workspaceId: commitment.workspaceId,
          reason: riskProfile.warnings[0] ?? "Commitment risk is critical.",
          riskProfile,
          now: input.now
        }).data
      : undefined);
  const outcomeLearning = outcomeLearningForCommitment(state, commitment);

  return {
    success: true,
    data: {
      commitmentId: commitment.id,
      title: commitment.title,
      owner: commitment.owner || "Unassigned",
      riskProfile,
      readiness,
      integrity,
      driftSignals,
      escalation,
      monitoringPlan,
      evidence: evidenceIds,
      rationale: commitment.rationale ?? commitment.description,
      recommendedAction: riskProfile.recommendedAction,
      nextStep: nextStep(riskProfile),
      ...outcomeLearning
    },
    warnings: [...riskProfile.warnings, ...integrity.warnings, ...outcomeLearning.outcomeWarnings]
  };
}

export function buildCommitmentIntegrityBrief(state: PlatformState, workspaceId: string): CommitmentIntegrityBrief {
  const summaries = sortByRisk(
    state.decisionCommitments
      .filter((commitment) => commitment.workspaceId === workspaceId && commitment.status !== "CANCELLED")
      .map((commitment) => summarizeCommitmentIntegrity({ state, commitment }).data!)
  );
  const highestRiskCommitment = summaries[0];
  const needsOwnerClarification = summaries.filter((item) => !item.readiness.ownerAssigned);
  const atRiskOfDrift = summaries.filter((item) => item.driftSignals.length > 0);
  const readyForExecution = summaries.filter((item) => item.readiness.ready && item.riskProfile.riskLevel === "LOW");
  const needsEscalation = summaries.filter((item) => ["HIGH", "CRITICAL"].includes(item.riskProfile.riskLevel) || item.escalation);
  const tasks = summaries.flatMap(buildTasks);
  const summary = highestRiskCommitment
    ? `VGOS found that ${highestRiskCommitment.title} is ${highestRiskCommitment.riskProfile.riskLevel.toLowerCase()} risk. ${highestRiskCommitment.riskProfile.warnings[0] ?? highestRiskCommitment.nextStep}`
    : "VGOS found no active commitments to assess.";

  return {
    summary,
    highestRiskCommitment,
    needsOwnerClarification,
    atRiskOfDrift,
    readyForExecution,
    needsEscalation,
    activeCommitments: summaries,
    tasks
  };
}

export function explainCommitmentRisk(summary: CommitmentIntegritySummary) {
  return `${summary.title} is ${summary.riskProfile.riskLevel.toLowerCase()} risk (${Math.round(summary.riskProfile.riskScore * 100)}%). ${summary.riskProfile.warnings.join(" ") || "No major warning is visible."} Recommended action: ${summary.recommendedAction}. Next step: ${summary.nextStep}`;
}
