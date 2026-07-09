import { createScopedId, orgId } from "@/lib/vgos-data";
import { buildCommitmentIntegrityBrief } from "@/kernel/commitments/commitment-summary";
import { computeExecutionReadiness } from "@/kernel/commitments/execution-readiness";
import {
  convertOutcomeToReflection,
  evaluateOutcome,
  summarizeOutcomeLearning
} from "@/kernel/outcomes";
import type {
  CommitmentIntegritySummary,
  CommitmentRiskProfile,
  ExecutionReadiness
} from "@/kernel/commitments/commitment-types";
import type { PlatformState } from "@/lib/vgos-data";
import type { DecisionQualityScore, InstructionResult } from "@/kernel/deliberation/deliberation-types";
import type {
  CapabilityImpact,
  ClaimImpact,
  LearningLoopIntegrity,
  OutcomeAttribution,
  OutcomeEvaluation,
  OutcomeReflection
} from "@/kernel/outcomes";

function nowIso() {
  return new Date().toISOString();
}

export type OrganizationalDecision = {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  rationale: string;
  sourceType?: string | null;
  sourceId?: string | null;
  deliberationId?: string | null;
  confidenceScore: number;
  decisionQualityScore?: DecisionQualityScore;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationalCommitment = {
  id: string;
  organizationId: string;
  workspaceId: string;
  decisionId: string;
  title: string;
  rationale: string;
  owner: string;
  status: "COMMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  decisionQualityScore?: DecisionQualityScore;
  executionReadiness?: ExecutionReadiness;
  commitmentRiskProfile?: CommitmentRiskProfile;
  evidenceIds?: string[];
  successCriteria?: string[];
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationalOutcome = {
  id: string;
  organizationId: string;
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  title: string;
  expectedOutcome: string;
  actualOutcome: string;
  successCriteria: string[];
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type OutcomeLearningTransitionMetadata = {
  outcomeId: string;
  evaluationSummary?: string;
  attributionRationale?: string;
  claimImpact?: string;
  capabilityImpact?: string;
  learning?: string;
  integrityScore?: number;
};

export type OrganizationalStateTransition = {
  id: string;
  organizationId: string;
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  fromState: string;
  toState: string;
  reason: string;
  decisionQualityScore?: DecisionQualityScore;
  commitmentRiskProfile?: CommitmentRiskProfile;
  outcomeLearning?: OutcomeLearningTransitionMetadata;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationalState = {
  workspaceId: string;
  activeCommitments: CommitmentIntegritySummary[];
  highRiskCommitments: CommitmentIntegritySummary[];
  learningLoopIntegrity: LearningLoopIntegrity[];
  learningLoopIntegrityScore: number;
  outcomeLearningSummary: string;
  computedAt: string;
};

function lowQualityWarnings(score?: DecisionQualityScore) {
  if (!score) return [];
  return [
    score.overallScore < 0.58 ? `Linked decision quality is low (${Math.round(score.overallScore * 100)}%).` : "",
    ...score.warnings
  ].filter(Boolean);
}

export function recordDecision(input: {
  workspaceId: string;
  title: string;
  rationale: string;
  confidenceScore?: number;
  sourceType?: string | null;
  sourceId?: string | null;
  deliberationId?: string | null;
  decisionQualityScore?: DecisionQualityScore;
  organizationId?: string;
  now?: string;
}): InstructionResult<OrganizationalDecision> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.title.trim()) return { success: false, error: "Decision title is required." };
  if (!input.rationale.trim()) return { success: false, error: "Decision rationale is required." };

  const date = input.now ?? nowIso();
  return {
    success: true,
    data: {
      id: createScopedId("decision"),
      organizationId: input.organizationId ?? orgId,
      workspaceId: input.workspaceId,
      title: input.title,
      rationale: input.rationale,
      sourceType: input.sourceType ?? null,
      sourceId: input.sourceId ?? null,
      deliberationId: input.deliberationId ?? null,
      confidenceScore: input.confidenceScore ?? input.decisionQualityScore?.overallScore ?? 0.62,
      decisionQualityScore: input.decisionQualityScore,
      createdAt: date,
      updatedAt: date
    },
    warnings: lowQualityWarnings(input.decisionQualityScore)
  };
}

export function createCommitment(input: {
  workspaceId: string;
  decisionId: string;
  title: string;
  rationale?: string | null;
  owner?: string;
  dueDate?: string | null;
  evidenceIds?: string[];
  successCriteria?: string[];
  requiredResources?: string[];
  dependencies?: string[];
  decisionQualityScore?: DecisionQualityScore;
  executionReadiness?: ExecutionReadiness;
  commitmentRiskProfile?: CommitmentRiskProfile;
  organizationId?: string;
  now?: string;
}): InstructionResult<OrganizationalCommitment> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.decisionId) return { success: false, error: "decisionId is required." };
  const date = input.now ?? nowIso();
  const executionReadiness = input.executionReadiness ?? computeExecutionReadiness({
    commitment: {
      id: "pending-commitment",
      workspaceId: input.workspaceId,
      title: input.title,
      rationale: input.rationale,
      owner: input.owner,
      dueDate: input.dueDate,
      decisionId: input.decisionId,
      evidenceIds: input.evidenceIds,
      successCriteria: input.successCriteria,
      requiredResources: input.requiredResources,
      dependencies: input.dependencies
    },
    evidenceIds: input.evidenceIds,
    successCriteria: input.successCriteria,
    requiredResources: input.requiredResources,
    dependencies: input.dependencies
  }).data;
  const warnings = [
    ...lowQualityWarnings(input.decisionQualityScore),
    ...(executionReadiness?.warnings ?? []),
    input.rationale?.trim() ? "" : "Commitment is created without rationale."
  ].filter(Boolean);

  return {
    success: true,
    data: {
      id: createScopedId("commitment"),
      organizationId: input.organizationId ?? orgId,
      workspaceId: input.workspaceId,
      decisionId: input.decisionId,
      title: input.title,
      rationale: input.rationale ?? "",
      owner: input.owner ?? "VGOS",
      status: "COMMITTED",
      decisionQualityScore: input.decisionQualityScore,
      executionReadiness,
      commitmentRiskProfile: input.commitmentRiskProfile,
      evidenceIds: input.evidenceIds ?? [],
      successCriteria: input.successCriteria ?? [],
      dueDate: input.dueDate ?? null,
      createdAt: date,
      updatedAt: date
    },
    warnings
  };
}

export function recordOutcome(input: {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  title: string;
  expectedOutcome: string;
  actualOutcome: string;
  successCriteria?: string[];
  evidenceIds?: string[];
  decisionQualityScore?: DecisionQualityScore;
  commitmentIntegrityScore?: number;
  executionQualityScore?: number;
  organizationId?: string;
  now?: string;
}): InstructionResult<{ outcome: OrganizationalOutcome; evaluation: OutcomeEvaluation }> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.sourceType) return { success: false, error: "sourceType is required." };
  if (!input.sourceId) return { success: false, error: "sourceId is required." };
  if (!input.expectedOutcome.trim()) return { success: false, error: "expectedOutcome is required." };

  const date = input.now ?? nowIso();
  const outcomeId = createScopedId("outcome");
  const evaluation = evaluateOutcome({
    workspaceId: input.workspaceId,
    outcomeId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    expectedOutcome: input.expectedOutcome,
    actualOutcome: input.actualOutcome,
    successCriteria: input.successCriteria,
    evidenceIds: input.evidenceIds,
    decisionQualityScore: input.decisionQualityScore?.overallScore,
    commitmentIntegrityScore: input.commitmentIntegrityScore,
    executionQualityScore: input.executionQualityScore,
    now: date
  });
  if (!evaluation.success || !evaluation.data) return { success: false, error: evaluation.error ?? "Outcome evaluation failed." };

  return {
    success: true,
    data: {
      outcome: {
        id: outcomeId,
        organizationId: input.organizationId ?? orgId,
        workspaceId: input.workspaceId,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        title: input.title,
        expectedOutcome: input.expectedOutcome,
        actualOutcome: input.actualOutcome,
        successCriteria: input.successCriteria ?? [],
        evidenceIds: input.evidenceIds ?? [],
        createdAt: date,
        updatedAt: date
      },
      evaluation: evaluation.data
    },
    warnings: evaluation.warnings
  };
}

export function reflect(input: {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  outcomeId: string;
  evaluation: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
  claimImpact?: ClaimImpact;
  capabilityImpact?: CapabilityImpact;
  appliesTo?: string[];
  now?: string;
}): InstructionResult<OutcomeReflection> {
  return convertOutcomeToReflection(input);
}

export function createStateTransition(input: {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  fromState: string;
  toState: string;
  reason: string;
  decisionQualityScore?: DecisionQualityScore;
  commitmentRiskProfile?: CommitmentRiskProfile;
  outcomeLearning?: OutcomeLearningTransitionMetadata;
  organizationId?: string;
  now?: string;
}): InstructionResult<OrganizationalStateTransition> {
  const date = input.now ?? nowIso();
  const transition: OrganizationalStateTransition = {
    id: createScopedId("state-transition"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    fromState: input.fromState,
    toState: input.toState,
    reason: input.reason,
    decisionQualityScore: input.sourceType === "Decision" ? input.decisionQualityScore : undefined,
    commitmentRiskProfile: input.sourceType === "Commitment" ? input.commitmentRiskProfile : undefined,
    outcomeLearning: input.outcomeLearning,
    createdAt: date,
    updatedAt: date
  };

  return {
    success: true,
    data: transition,
    warnings: [
      ...(input.sourceType === "Decision" ? lowQualityWarnings(input.decisionQualityScore) : []),
      ...(input.sourceType === "Commitment" && input.commitmentRiskProfile && ["HIGH", "CRITICAL"].includes(input.commitmentRiskProfile.riskLevel)
        ? [`Commitment transition carries ${input.commitmentRiskProfile.riskLevel.toLowerCase()} risk.`]
        : [])
    ]
  };
}

export function explainStateChange(transition: OrganizationalStateTransition) {
  const quality = transition.decisionQualityScore;
  const commitmentRisk = transition.commitmentRiskProfile;
  const deliberationText = !quality
    ? "No decision-quality score is attached."
    : quality.overallScore >= 0.78
      ? `The decision was well-deliberated with a ${Math.round(quality.overallScore * 100)}% quality score.`
      : quality.overallScore >= 0.58
        ? `The decision had mixed deliberation quality at ${Math.round(quality.overallScore * 100)}%; watch the warnings before expanding commitment.`
        : `The decision was weakly deliberated at ${Math.round(quality.overallScore * 100)}%; VGOS should resolve quality warnings before relying on this state.`;

  const commitmentText = !commitmentRisk
    ? ""
    : commitmentRisk.riskLevel === "LOW" || commitmentRisk.riskLevel === "MEDIUM"
      ? ` Commitment risk is ${commitmentRisk.riskLevel.toLowerCase()} and the transition appears to reduce organizational risk if monitoring continues.`
      : ` Commitment risk is ${commitmentRisk.riskLevel.toLowerCase()}, so this transition increases organizational risk until the recommended action is handled.`;
  const learningText = !transition.outcomeLearning
    ? ""
    : ` VGOS learned from outcome ${transition.outcomeLearning.outcomeId}: ${transition.outcomeLearning.learning ?? transition.outcomeLearning.evaluationSummary ?? "outcome learning was recorded"}. ${transition.outcomeLearning.attributionRationale ?? ""}`.trimEnd();

  return `${transition.fromState} changed to ${transition.toState} because ${transition.reason}. ${deliberationText}${commitmentText}${learningText ? ` ${learningText}` : ""}`;
}

export function computeOrganizationalState(input: {
  state: PlatformState;
  workspaceId: string;
  commitmentSummaries?: CommitmentIntegritySummary[];
  now?: string;
}): InstructionResult<OrganizationalState> {
  const activeCommitments = [...(input.commitmentSummaries ?? buildCommitmentIntegrityBrief(input.state, input.workspaceId).activeCommitments)].sort((a, b) =>
    b.riskProfile.riskScore - a.riskProfile.riskScore || a.integrity.overallScore - b.integrity.overallScore
  );
  const highRiskCommitments = activeCommitments.filter((item) => ["HIGH", "CRITICAL"].includes(item.riskProfile.riskLevel));
  const learningLoopIntegrity = input.state.learningLoopIntegrities.filter((item) => item.workspaceId === input.workspaceId);
  const learningLoopIntegrityScore = learningLoopIntegrity.length
    ? learningLoopIntegrity.reduce((sum, item) => sum + item.integrityScore, 0) / learningLoopIntegrity.length
    : 0;
  const outcomeSummary = summarizeOutcomeLearning({ workspaceId: input.workspaceId, state: input.state, now: input.now });

  return {
    success: true,
    data: {
      workspaceId: input.workspaceId,
      activeCommitments,
      highRiskCommitments,
      learningLoopIntegrity,
      learningLoopIntegrityScore,
      outcomeLearningSummary: outcomeSummary.summary,
      computedAt: input.now ?? nowIso()
    }
  };
}
