import {
  clampScore,
  hasMeaningfulText,
  nowIso,
  uniqueWarnings,
  type InstructionResult,
  type LearningArtifact,
  type LearningArtifactInput,
  type LearningLoopIntegrity,
  type LearningLoopIntegrityInput,
  type OutcomeReflection
} from "@/kernel/outcomes/outcome-types";

function sourceName(sourceType: string, sourceId: string) {
  return `${sourceType} ${sourceId}`;
}

export function computeLearningLoopIntegrity(input: LearningLoopIntegrityInput): InstructionResult<LearningLoopIntegrity> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.sourceType) return { success: false, error: "sourceType is required." };
  if (!input.sourceId) return { success: false, error: "sourceId is required." };

  const hasExpectedOutcome = hasMeaningfulText(input.expectedOutcome ?? input.evaluation?.expectedOutcome);
  const hasActualOutcome = hasMeaningfulText(input.actualOutcome ?? input.evaluation?.actualOutcome);
  const hasEvaluation = Boolean(input.evaluation);
  const hasAttribution = Boolean(input.attribution);
  const hasReflection = Boolean(input.reflectionExists);
  const hasClaimImpact = Boolean(input.claimImpact);
  const hasCapabilityImpact = Boolean(input.capabilityImpact);
  const hasStateTransition = Boolean(input.stateTransitionRecorded);
  const hasLearningArtifact = Boolean(input.learningArtifact);

  const integrityScore = clampScore(
    (hasExpectedOutcome ? 0.12 : 0) +
    (hasActualOutcome ? 0.12 : 0) +
    (hasEvaluation ? 0.16 : 0) +
    (hasAttribution ? 0.14 : 0) +
    (hasReflection ? 0.12 : 0) +
    (hasClaimImpact ? 0.1 : 0) +
    (hasCapabilityImpact ? 0.1 : 0) +
    (hasStateTransition ? 0.08 : 0) +
    (hasLearningArtifact ? 0.06 : 0)
  );
  const complete = integrityScore >= 0.86 &&
    hasExpectedOutcome &&
    hasActualOutcome &&
    hasEvaluation &&
    hasAttribution &&
    hasReflection &&
    hasClaimImpact &&
    hasCapabilityImpact &&
    hasStateTransition;
  const warnings = uniqueWarnings([
    hasExpectedOutcome ? undefined : "Commitment has no expected outcome.",
    hasActualOutcome ? undefined : "Commitment has no recorded outcome.",
    hasEvaluation ? undefined : "Outcome has no evaluation.",
    hasAttribution ? undefined : "Outcome has no attribution.",
    hasReflection ? undefined : "Outcome learning has not been captured as a reflection.",
    input.attribution && input.attribution.confidenceScore < 0.58 ? "Attribution confidence is low." : undefined,
    hasReflection && (!hasClaimImpact || !hasCapabilityImpact) ? "Reflection exists but no claim or capability was updated." : undefined,
    input.claimImpact && input.claimImpact.impactType === "VALIDATES" && input.claimImpact.evidenceIds.length === 0
      ? "Claim was validated without sufficient evidence."
      : undefined,
    input.capabilityImpact && input.capabilityImpact.impactType !== "NO_CLEAR_IMPACT" && !input.capabilityImpact.rationale.trim()
      ? "Capability maturity changed without rationale."
      : undefined,
    input.evaluation?.warnings.includes("Success criteria were missing.") ? "Success criteria were missing." : undefined,
    hasLearningArtifact ? undefined : "Reusable learning artifact has not been created.",
    hasStateTransition ? undefined : "State transition has not recorded outcome learning metadata."
  ]);

  return {
    success: true,
    data: {
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      workspaceId: input.workspaceId,
      hasExpectedOutcome,
      hasActualOutcome,
      hasEvaluation,
      hasAttribution,
      hasReflection,
      hasClaimImpact,
      hasCapabilityImpact,
      hasStateTransition,
      integrityScore,
      complete,
      warnings
    },
    warnings
  };
}

export function createLearningArtifact(input: LearningArtifactInput): InstructionResult<LearningArtifact> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  const attribution = input.attribution?.rationale ?? "Attribution is still forming.";
  const capability = input.capabilityImpact && input.capabilityImpact.impactType !== "NO_CLEAR_IMPACT"
    ? `Capability impact: ${input.capabilityImpact.impactType.toLowerCase().replace(/_/g, " ")}.`
    : "No clear capability impact yet.";
  const claim = input.claimImpact && input.claimImpact.impactType !== "NO_CLEAR_IMPACT"
    ? `Claim impact: ${input.claimImpact.impactType.toLowerCase().replace(/_/g, " ")}.`
    : "No clear claim impact yet.";
  const lesson = input.evaluation.actualOutcome
    ? `${input.evaluation.actualOutcome} ${claim} ${capability}`.trim()
    : "Outcome measurement is still pending.";

  return {
    success: true,
    data: {
      id: `learning-artifact-${input.outcomeId}`,
      workspaceId: input.workspaceId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      lesson,
      reusableLearning: `${input.evaluation.evaluationSummary} ${attribution}`.trim(),
      appliesTo: input.appliesTo?.length ? input.appliesTo : [input.sourceType, "Future decisions", "Future commitments"],
      confidenceScore: clampScore(Math.min(input.evaluation.confidenceScore, input.attribution?.confidenceScore ?? 0.64) + 0.04),
      evidenceIds: [
        ...(input.attribution?.evidenceIds ?? []),
        ...(input.claimImpact?.evidenceIds ?? []),
        ...(input.capabilityImpact?.evidenceIds ?? [])
      ].filter((item, index, items) => items.indexOf(item) === index),
      createdAt: nowIso(input.now)
    }
  };
}

export function convertOutcomeToReflection(input: LearningArtifactInput): InstructionResult<OutcomeReflection> {
  const artifact = createLearningArtifact(input);
  if (!artifact.success || !artifact.data) return { success: false, error: artifact.error ?? "Unable to create learning artifact." };
  const attributionText = input.attribution?.rationale ?? "Attribution is unclear.";
  const successful = input.evaluation.successScore >= 0.65;
  const date = nowIso(input.now);

  return {
    success: true,
    data: {
      id: `reflection-${input.outcomeId}`,
      workspaceId: input.workspaceId,
      title: `Outcome reflection: ${sourceName(input.sourceType, input.sourceId)}`,
      sourceType: "OutcomeEvaluation",
      sourceId: input.outcomeId,
      summary: input.evaluation.evaluationSummary,
      whatWorked: successful ? input.evaluation.actualOutcome : "The outcome created evidence VGOS can learn from.",
      whatFailed: successful ? "No clear failure was confirmed." : input.evaluation.deltaSummary,
      wrongAssumptions: input.claimImpact?.impactType === "CHALLENGES" || input.claimImpact?.impactType === "INVALIDATES"
        ? input.claimImpact.rationale
        : "No major assumption was invalidated.",
      newLearning: artifact.data.reusableLearning,
      futureAdjustment: attributionText,
      confidenceScore: artifact.data.confidenceScore,
      createdAt: date,
      updatedAt: date
    },
    warnings: artifact.warnings
  };
}
