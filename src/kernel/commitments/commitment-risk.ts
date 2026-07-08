import type { DecisionQualityScore } from "@/kernel/deliberation/deliberation-types";
import type {
  CommitmentDriftSignal,
  CommitmentLike,
  CommitmentRecommendedAction,
  CommitmentRiskLevel,
  CommitmentRiskProfile,
  ExecutionReadiness,
  InstructionResult
} from "@/kernel/commitments/commitment-types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function riskLevel(score: number): CommitmentRiskLevel {
  if (score >= 0.78) return "CRITICAL";
  if (score >= 0.62) return "HIGH";
  if (score >= 0.38) return "MEDIUM";
  return "LOW";
}

function daysUntil(date?: string | null, now = new Date()) {
  if (!date) return undefined;
  return Math.ceil((new Date(date).getTime() - now.getTime()) / 86400000);
}

function ownerRisk(commitment: CommitmentLike) {
  const owner = commitment.owner?.trim().toLowerCase();
  return owner && !["vgos", "unassigned", "tbd", "none"].includes(owner) ? 0.05 : 0.92;
}

function resourceRisk(commitment: CommitmentLike) {
  return commitment.requiredResources?.length || commitment.linkedExecutionItemId || commitment.linkedPlanItemId ? 0.18 : 0.58;
}

function dependencyRisk(commitment: CommitmentLike, blockers: string[]) {
  if (blockers.length) return 0.82;
  if (commitment.dependencies?.length || commitment.linkedPlanItemId || commitment.linkedExecutionItemId) return 0.22;
  return 0.52;
}

function evidenceRisk(commitment: CommitmentLike, evidenceIds: string[], decisionQualityScore?: DecisionQualityScore) {
  if (evidenceIds.length || commitment.evidenceIds?.length) return decisionQualityScore && decisionQualityScore.evidenceQuality < 0.55 ? 0.48 : 0.18;
  return decisionQualityScore && decisionQualityScore.evidenceQuality >= 0.7 ? 0.35 : 0.88;
}

function deadlineRisk(commitment: CommitmentLike, executionConfidence: number, now = new Date()) {
  const days = daysUntil(commitment.dueDate, now);
  if (days === undefined) return 0.72;
  if (days < 0) return 0.86;
  if (days <= 2 && executionConfidence < 0.68) return 0.76;
  if (days <= 5 && executionConfidence < 0.58) return 0.62;
  return 0.2;
}

function executionRisk(readiness?: ExecutionReadiness, progressVisible = false) {
  if (!readiness) return progressVisible ? 0.36 : 0.58;
  return clamp01(1 - readiness.readinessScore + (progressVisible ? -0.08 : 0.08));
}

function driftRisk(driftSignals: CommitmentDriftSignal[]) {
  if (!driftSignals.length) return 0.12;
  const severityScore = Math.max(...driftSignals.map((signal) => ({ LOW: 0.24, MEDIUM: 0.46, HIGH: 0.74, CRITICAL: 0.92 }[signal.severity])));
  return severityScore;
}

export function recommendCommitmentAction(profile: CommitmentRiskProfile): CommitmentRecommendedAction {
  if (profile.riskLevel === "CRITICAL") return "ESCALATE";
  if (profile.ownershipRisk >= 0.7) return "CLARIFY_OWNER";
  if (profile.evidenceRisk >= 0.7) return "ADD_EVIDENCE";
  if (profile.dependencyRisk >= 0.7) return "RESOLVE_BLOCKER";
  if (profile.driftRisk >= 0.7) return "REPLAN";
  if (profile.resourceRisk >= 0.55) return "ADD_RESOURCES";
  if (profile.deadlineRisk >= 0.65) return "REPLAN";
  return "CONTINUE";
}

export function evaluateCommitmentRisk(input: {
  commitment: CommitmentLike;
  readiness?: ExecutionReadiness;
  decisionQualityScore?: DecisionQualityScore;
  evidenceIds?: string[];
  blockers?: string[];
  driftSignals?: CommitmentDriftSignal[];
  executionConfidence?: number;
  progressVisible?: boolean;
  now?: string;
}): InstructionResult<CommitmentRiskProfile> {
  const commitment = input.commitment;
  if (!commitment.id) return { success: false, error: "commitment.id is required." };
  const blockers = input.blockers ?? [];
  const evidenceIds = input.evidenceIds ?? commitment.evidenceIds ?? [];
  const driftSignals = input.driftSignals ?? [];
  const ownership = ownerRisk(commitment);
  const resource = resourceRisk(commitment);
  const dependency = dependencyRisk(commitment, blockers);
  const evidence = evidenceRisk(commitment, evidenceIds, input.decisionQualityScore);
  const deadline = deadlineRisk(commitment, input.executionConfidence ?? input.readiness?.readinessScore ?? 0.5, input.now ? new Date(input.now) : new Date());
  const drift = driftRisk(driftSignals);
  const execution = executionRisk(input.readiness, input.progressVisible);
  const linkedDecisionPenalty = input.decisionQualityScore && input.decisionQualityScore.overallScore < 0.58 ? 0.12 : 0;
  const weightedRiskScore = clamp01(
    ownership * 0.17 +
      resource * 0.1 +
      dependency * 0.16 +
      evidence * 0.18 +
      deadline * 0.13 +
      drift * 0.13 +
      execution * 0.13 +
      linkedDecisionPenalty
  );
  const riskFloor = evidence >= 0.7 && drift >= 0.7 ? 0.68 : 0;
  const riskScore = Number(Math.max(weightedRiskScore, riskFloor).toFixed(2));
  const warnings = [
    ownership >= 0.7 ? "No clear owner is assigned." : "",
    resource >= 0.55 ? "Required resources are unclear." : "",
    dependency >= 0.7 ? "Dependencies or blockers create execution risk." : "",
    evidence >= 0.7 ? "No supporting evidence is linked." : "",
    deadline >= 0.65 ? "Deadline is missing, overdue, or close with low execution confidence." : "",
    drift >= 0.7 ? "Commitment drift is visible." : "",
    execution >= 0.65 ? "Execution readiness is weak." : "",
    input.decisionQualityScore && input.decisionQualityScore.overallScore < 0.58 ? "Linked decision quality is low." : ""
  ].filter(Boolean);
  const profileWithoutAction = {
    commitmentId: commitment.id,
    workspaceId: commitment.workspaceId,
    riskLevel: riskLevel(riskScore),
    riskScore,
    ownershipRisk: Number(ownership.toFixed(2)),
    resourceRisk: Number(resource.toFixed(2)),
    dependencyRisk: Number(dependency.toFixed(2)),
    evidenceRisk: Number(evidence.toFixed(2)),
    deadlineRisk: Number(deadline.toFixed(2)),
    driftRisk: Number(drift.toFixed(2)),
    executionRisk: Number(execution.toFixed(2)),
    warnings,
    recommendedAction: "CONTINUE" as CommitmentRecommendedAction,
    computedAt: input.now ?? new Date().toISOString()
  };
  const profile: CommitmentRiskProfile = {
    ...profileWithoutAction,
    recommendedAction: recommendCommitmentAction(profileWithoutAction)
  };

  return {
    success: true,
    data: profile,
    warnings
  };
}

export { riskLevel as commitmentRiskLevelFromScore };
