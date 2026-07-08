import type { CommitmentLike, ExecutionReadiness, InstructionResult } from "@/kernel/commitments/commitment-types";

function hasText(value?: string | null) {
  return Boolean(value?.trim());
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function hasOwner(commitment: CommitmentLike) {
  const owner = commitment.owner?.trim().toLowerCase();
  return Boolean(owner && !["vgos", "unassigned", "tbd", "none"].includes(owner));
}

export function computeExecutionReadiness(input: {
  commitment: CommitmentLike;
  evidenceIds?: string[];
  dependencies?: string[];
  blockers?: string[];
  successCriteria?: string[];
  requiredResources?: string[];
}): InstructionResult<ExecutionReadiness> {
  const commitment = input.commitment;
  if (!commitment.id) return { success: false, error: "commitment.id is required." };

  const ownerAssigned = hasOwner(commitment);
  const rationalePresent = hasText(commitment.rationale) || hasText(commitment.description);
  const evidenceLinked = Boolean((input.evidenceIds ?? commitment.evidenceIds ?? []).length);
  const decisionLinked = Boolean(commitment.decisionId || commitment.situationId || commitment.deliberationId || commitment.optionId);
  const successCriteriaDefined = Boolean((input.successCriteria ?? commitment.successCriteria ?? []).length || hasText(commitment.expectedOutcome));
  const requiredResourcesKnown = Boolean((input.requiredResources ?? commitment.requiredResources ?? []).length || commitment.linkedExecutionItemId || commitment.linkedPlanItemId);
  const dependenciesKnown = Boolean((input.dependencies ?? commitment.dependencies ?? []).length || commitment.linkedPlanItemId || commitment.linkedExecutionItemId);
  const blockers = input.blockers ?? [];
  const blockersKnown = true;
  const dueDateDefined = hasText(commitment.dueDate);
  const components = [
    ownerAssigned,
    rationalePresent,
    evidenceLinked,
    decisionLinked,
    successCriteriaDefined,
    requiredResourcesKnown,
    dependenciesKnown,
    blockersKnown,
    dueDateDefined
  ];
  const readinessScore = Number(clamp01(components.filter(Boolean).length / components.length - Math.min(0.16, blockers.length * 0.08)).toFixed(2));
  const warnings = [
    ownerAssigned ? "" : "No clear owner is assigned.",
    rationalePresent ? "" : "Commitment rationale is missing.",
    evidenceLinked ? "" : "No supporting evidence is linked.",
    decisionLinked ? "" : "Commitment is not linked to a decision.",
    successCriteriaDefined ? "" : "Success criteria or expected outcome is unclear.",
    requiredResourcesKnown ? "" : "Required resources are not known.",
    dependenciesKnown ? "" : "Dependencies are not known.",
    dueDateDefined ? "" : "Due date is not defined.",
    blockers.length ? "Open blockers are attached to this commitment." : ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      commitmentId: commitment.id,
      ownerAssigned,
      rationalePresent,
      evidenceLinked,
      decisionLinked,
      successCriteriaDefined,
      requiredResourcesKnown,
      dependenciesKnown,
      blockersKnown,
      dueDateDefined,
      readinessScore,
      ready: readinessScore >= 0.78 && blockers.length === 0,
      warnings
    },
    warnings
  };
}
