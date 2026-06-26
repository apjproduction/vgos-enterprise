import {
  createScopedId,
  orgId,
  type Pattern,
  type ReasoningTrace,
  type RecommendedAction
} from "@/lib/vgos-data";

export function inferStrategicImplication(inputSummary: string) {
  const lower = inputSummary.toLowerCase();
  if (lower.includes("product page") || lower.includes("url")) {
    return "Product-page-to-video demand should become proof-led demos, landing page copy, and answer-ready content.";
  }
  if (lower.includes("directory") || lower.includes("backlink")) {
    return "Authority opportunities should become directory submissions, backlink follow-up, and entity-rich descriptions.";
  }
  if (lower.includes("purpose-specific") || lower.includes("video production intelligence")) {
    return "Category language should become FAQ, GEO, and internal linking assets.";
  }
  return "The signal should be converted into a focused growth action with clear owner and objective context.";
}

export function generateConclusionFromPattern(pattern: Pattern) {
  if (pattern.patternType === "CONTENT_GAP") return `Create content that closes: ${pattern.title}`;
  if (pattern.patternType === "AUTHORITY_OPPORTUNITY") return `Prioritize authority action for ${pattern.relatedEntity ?? "VidMaker"}.`;
  if (pattern.patternType === "RECURRING_QUESTION") return `Answer recurring question with proof and reusable content: ${pattern.title}`;
  if (pattern.patternType === "PRODUCT_DEMAND") return `Turn product demand into demo, landing page, or feature proof: ${pattern.title}`;
  return `Review pattern and select next action: ${pattern.title}`;
}

export function createReasoningTrace(input: {
  workspaceId: string;
  organizationId?: string;
  sourceType: string;
  sourceId: string;
  inputSummary: string;
  reasoningSteps: string[];
  conclusion: string;
  confidenceScore?: number;
  recommendedActionIds?: string[];
}): ReasoningTrace {
  return {
    id: createScopedId("reasoning-trace"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    inputSummary: input.inputSummary,
    reasoningSteps: input.reasoningSteps,
    conclusion: input.conclusion,
    confidenceScore: input.confidenceScore ?? 0.76,
    recommendedActionIds: input.recommendedActionIds ?? [],
    createdAt: new Date().toISOString()
  };
}

export function explainRecommendation(action: RecommendedAction, pattern?: Pattern) {
  const patternText = pattern ? ` It is linked to ${pattern.title} with ${pattern.trendDirection.toLowerCase()} trend.` : "";
  return `${action.title} ranks ${action.priority.toLowerCase()} because it can ${action.expectedImpact.toLowerCase()}.${patternText}`;
}

export function connectObservationToAction(inputSummary: string, action: RecommendedAction) {
  return createReasoningTrace({
    workspaceId: action.workspaceId,
    organizationId: action.organizationId,
    sourceType: action.sourceType,
    sourceId: action.sourceId,
    inputSummary,
    reasoningSteps: [
      "Observation was converted into a remembered signal.",
      "The signal matched a recurring memory or pattern.",
      "The pattern maps to an active VidMaker objective.",
      "The recommended action is the next concrete step."
    ],
    conclusion: action.title,
    confidenceScore: action.priority === "CRITICAL" ? 0.9 : 0.78,
    recommendedActionIds: [action.id]
  });
}
