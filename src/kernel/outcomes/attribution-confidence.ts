import {
  clampScore,
  type AttributionConfidence,
  type AttributionConfidenceInput,
  type InstructionResult
} from "@/kernel/outcomes/outcome-types";

export function computeAttributionConfidence(input: AttributionConfidenceInput): InstructionResult<AttributionConfidence> {
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  let score = 0.42;

  if (input.sourceLinked) {
    score += 0.12;
    positiveFactors.push("Source is clearly linked to the outcome.");
  } else {
    score -= 0.08;
    negativeFactors.push("Source linkage is not explicit.");
  }

  if ((input.evidenceDirectness ?? 0) >= 0.75) {
    score += 0.14;
    positiveFactors.push("Evidence directly supports the causal relationship.");
  } else if ((input.evidenceDirectness ?? 0) <= 0.35) {
    score -= 0.12;
    negativeFactors.push("Evidence is weak or indirect.");
  }

  if ((input.evidenceStrength ?? 0) >= 0.75) {
    score += 0.08;
    positiveFactors.push("Evidence strength is high.");
  } else if ((input.evidenceStrength ?? 0) > 0 && (input.evidenceStrength ?? 0) < 0.5) {
    score -= 0.08;
    negativeFactors.push("Evidence strength is low.");
  }

  if (input.outcomeMeasurable) {
    score += 0.1;
    positiveFactors.push("Expected outcome was measurable.");
  } else {
    score -= 0.1;
    negativeFactors.push("Outcome is vague or not measurable yet.");
  }

  if (input.timingPlausible) {
    score += 0.07;
    positiveFactors.push("Timing is plausible.");
  } else if (input.timingPlausible === false) {
    score -= 0.1;
    negativeFactors.push("Timing does not strongly support causality.");
  }

  if ((input.alternativeExplanations ?? 1) <= 1) {
    score += 0.07;
    positiveFactors.push("Alternative explanations appear limited.");
  } else if ((input.alternativeExplanations ?? 0) >= 3) {
    score -= 0.12;
    negativeFactors.push("Multiple plausible causes exist.");
  }

  if (input.executionDataExists) {
    score += 0.07;
    positiveFactors.push("Related execution data exists.");
  } else {
    score -= 0.06;
    negativeFactors.push("Related execution data is missing.");
  }

  if (input.reflectionConfirms) {
    score += 0.06;
    positiveFactors.push("Reflection confirms the causal path.");
  }

  if (input.successCriteriaDefined) {
    score += 0.05;
    positiveFactors.push("Success criteria were defined.");
  } else {
    score -= 0.08;
    negativeFactors.push("No success criteria were defined.");
  }

  if ((input.outcomeVagueness ?? 0) >= 0.6) {
    score -= 0.1;
    negativeFactors.push("Outcome language is vague.");
  }

  if ((input.timeDelayDays ?? 0) > 30) {
    score -= 0.08;
    negativeFactors.push("Time delay is large.");
  }

  if (input.externalFactorsLikely) {
    score -= 0.1;
    negativeFactors.push("External factors likely influenced the outcome.");
  }

  const confidenceScore = clampScore(score);
  return {
    success: true,
    data: {
      confidenceScore,
      positiveFactors,
      negativeFactors
    },
    warnings: negativeFactors
  };
}
