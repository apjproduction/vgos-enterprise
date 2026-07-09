import {
  type InstructionResult,
  type LearningLoopIntegrity,
  type OutcomeAttribution,
  type OutcomeEvaluation
} from "@/kernel/outcomes/outcome-types";

export type OutcomeLearningLoopValidation = {
  valid: boolean;
  integrityScore: number;
  warnings: string[];
};

export function validateOutcomeLearningLoop(input: {
  integrity: LearningLoopIntegrity;
  evaluation?: OutcomeEvaluation;
  attribution?: OutcomeAttribution;
}): InstructionResult<OutcomeLearningLoopValidation> {
  const warnings = [
    ...input.integrity.warnings,
    input.evaluation && input.evaluation.confidenceScore < 0.55 ? "Outcome evaluation confidence is low." : "",
    input.attribution && input.attribution.confidenceScore < 0.58 ? "Attribution confidence is low." : "",
    input.evaluation?.warnings.find((warning) => /success criteria/i.test(warning)) ?? ""
  ].filter(Boolean);

  return {
    success: true,
    data: {
      valid: input.integrity.complete && warnings.length === 0,
      integrityScore: input.integrity.integrityScore,
      warnings
    },
    warnings
  };
}
