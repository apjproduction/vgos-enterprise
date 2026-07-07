import { createScopedId, orgId } from "@/lib/vgos-data";
import type { DecisionQualityScore, InstructionResult } from "@/kernel/deliberation/deliberation-types";

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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  decisionQualityScore?: DecisionQualityScore;
  organizationId?: string;
  now?: string;
}): InstructionResult<OrganizationalCommitment> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.decisionId) return { success: false, error: "decisionId is required." };
  const date = input.now ?? nowIso();
  const warnings = [
    ...lowQualityWarnings(input.decisionQualityScore),
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
      createdAt: date,
      updatedAt: date
    },
    warnings
  };
}

export function createStateTransition(input: {
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  fromState: string;
  toState: string;
  reason: string;
  decisionQualityScore?: DecisionQualityScore;
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
    createdAt: date,
    updatedAt: date
  };

  return {
    success: true,
    data: transition,
    warnings: input.sourceType === "Decision" ? lowQualityWarnings(input.decisionQualityScore) : undefined
  };
}

export function explainStateChange(transition: OrganizationalStateTransition) {
  const quality = transition.decisionQualityScore;
  const deliberationText = !quality
    ? "No decision-quality score is attached."
    : quality.overallScore >= 0.78
      ? `The decision was well-deliberated with a ${Math.round(quality.overallScore * 100)}% quality score.`
      : quality.overallScore >= 0.58
        ? `The decision had mixed deliberation quality at ${Math.round(quality.overallScore * 100)}%; watch the warnings before expanding commitment.`
        : `The decision was weakly deliberated at ${Math.round(quality.overallScore * 100)}%; VGOS should resolve quality warnings before relying on this state.`;

  return `${transition.fromState} changed to ${transition.toState} because ${transition.reason}. ${deliberationText}`;
}
