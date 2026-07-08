import type {
  CommitmentIntegrityScore,
  CommitmentRiskProfile,
  ExecutionReadiness,
  InstructionResult
} from "@/kernel/commitments/commitment-types";

export type CommitmentIntegrityValidationReport = {
  commitmentId: string;
  valid: boolean;
  warnings: string[];
  errors: string[];
};

export function validateCommitmentIntegrity(input: {
  readiness: ExecutionReadiness;
  riskProfile: CommitmentRiskProfile;
  integrity: CommitmentIntegrityScore;
}): InstructionResult<CommitmentIntegrityValidationReport> {
  const errors: string[] = [];
  const warnings = [
    ...input.readiness.warnings,
    ...input.riskProfile.warnings,
    ...input.integrity.warnings
  ].filter((item, index, items) => items.indexOf(item) === index);

  if (!input.readiness.commitmentId) errors.push("commitmentId is required.");
  if (input.riskProfile.riskLevel === "CRITICAL" && input.integrity.overallScore < 0.5) {
    warnings.push("Critical-risk commitment should be escalated before execution continues.");
  }

  return {
    success: errors.length === 0,
    data: {
      commitmentId: input.readiness.commitmentId,
      valid: errors.length === 0,
      warnings,
      errors
    },
    error: errors[0],
    warnings
  };
}
