import type {
  CommitmentDriftSignal,
  CommitmentIntegrityScore,
  CommitmentLike,
  CommitmentMonitoringPlan,
  CommitmentRiskProfile,
  ExecutionReadiness,
  InstructionResult
} from "@/kernel/commitments/commitment-types";
import type { DecisionQualityScore } from "@/kernel/deliberation/deliberation-types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function round2(value: number) {
  return Number(clamp01(value).toFixed(2));
}

function hasOutcome(commitment: CommitmentLike) {
  return Boolean(commitment.expectedOutcome?.trim() || commitment.successCriteria?.length);
}

export function computeCommitmentIntegrity(input: {
  commitment: CommitmentLike;
  readiness: ExecutionReadiness;
  riskProfile?: CommitmentRiskProfile;
  decisionQualityScore?: DecisionQualityScore;
  driftSignals?: CommitmentDriftSignal[];
  monitoringPlan?: CommitmentMonitoringPlan;
  evidenceIds?: string[];
  progressVisible?: boolean;
}): InstructionResult<CommitmentIntegrityScore> {
  const commitment = input.commitment;
  if (!commitment.id) return { success: false, error: "commitment.id is required." };

  const evidenceIds = input.evidenceIds ?? commitment.evidenceIds ?? [];
  const driftSignals = input.driftSignals ?? [];
  const decisionAlignment = round2(input.decisionQualityScore?.overallScore ?? (commitment.decisionId || commitment.situationId || commitment.deliberationId ? 0.68 : 0.32));
  const evidenceTraceability = round2(evidenceIds.length ? Math.min(1, 0.42 + evidenceIds.length * 0.18) : input.decisionQualityScore?.evidenceQuality ?? 0.18);
  const ownerClarity = input.readiness.ownerAssigned ? 0.95 : 0.12;
  const executionReadiness = input.readiness.readinessScore;
  const progressVisibility = input.progressVisible || commitment.status === "IN_PROGRESS" || commitment.status === "COMPLETED" ? 0.82 : 0.42;
  const driftControl = round2(input.monitoringPlan ? 0.88 - Math.min(0.32, driftSignals.length * 0.16) : 0.54 - Math.min(0.28, driftSignals.length * 0.14));
  const outcomeMeasurability = hasOutcome(commitment) ? 0.86 : 0.28;
  const overallScore = round2(
    decisionAlignment * 0.16 +
      evidenceTraceability * 0.16 +
      ownerClarity * 0.14 +
      executionReadiness * 0.18 +
      progressVisibility * 0.1 +
      driftControl * 0.13 +
      outcomeMeasurability * 0.13
  );
  const warnings = [
    decisionAlignment < 0.58 ? "Commitment is weakly aligned to the originating decision." : "",
    evidenceTraceability < 0.55 ? "Evidence traceability is weak." : "",
    ownerClarity < 0.5 ? "Owner clarity is weak." : "",
    executionReadiness < 0.68 ? "Execution readiness is weak." : "",
    driftControl < 0.62 ? "Commitment drift needs review." : "",
    outcomeMeasurability < 0.55 ? "Expected outcome is not measurable." : "",
    input.riskProfile && ["HIGH", "CRITICAL"].includes(input.riskProfile.riskLevel) ? `Commitment risk is ${input.riskProfile.riskLevel.toLowerCase()}.` : ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      commitmentId: commitment.id,
      decisionAlignment,
      evidenceTraceability,
      ownerClarity,
      executionReadiness,
      progressVisibility,
      driftControl,
      outcomeMeasurability,
      overallScore,
      warnings
    },
    warnings
  };
}
