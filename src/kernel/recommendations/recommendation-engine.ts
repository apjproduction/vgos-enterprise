import {
  createScopedId,
  orgId,
  type AIRecommendation,
  type Pattern,
  type RecommendedAction
} from "@/lib/vgos-data";
import { createReasoningTrace } from "@/kernel/reasoning/reasoning-engine";

function recommendationTypeFromPattern(pattern: Pattern): AIRecommendation["recommendationType"] {
  if (pattern.patternType === "AUTHORITY_OPPORTUNITY") return "DIRECTORY_SUBMISSION";
  if (pattern.patternType === "AEO_OPPORTUNITY") return "FAQ";
  if (pattern.patternType === "GEO_OPPORTUNITY") return "LANDING_PAGE";
  if (pattern.patternType === "PRODUCT_DEMAND") return "FEATURE_REQUEST";
  return "BLOG_IDEA";
}

function actionTypeFromPattern(pattern: Pattern): RecommendedAction["actionType"] {
  if (pattern.patternType === "AUTHORITY_OPPORTUNITY") return "SUBMIT_DIRECTORY";
  if (pattern.patternType === "AEO_OPPORTUNITY") return "CREATE_FAQ";
  if (pattern.patternType === "GEO_OPPORTUNITY") return "UPDATE_LANDING_PAGE";
  if (pattern.patternType === "PRODUCT_DEMAND") return "CREATE_DEMO";
  if (pattern.patternType === "COMPETITOR_COMPLAINT") return "CREATE_FOUNDER_POST";
  return "WRITE_BLOG";
}

export function createRecommendationFromPattern(pattern: Pattern): AIRecommendation {
  const now = new Date().toISOString();
  return {
    id: createScopedId("ai-rec"),
    organizationId: pattern.organizationId ?? orgId,
    workspaceId: pattern.workspaceId,
    title: `Act on pattern: ${pattern.title}`,
    description: pattern.description,
    source: "Pattern Engine",
    url: "https://vidmaker.com",
    status: "RESEARCHING",
    priority: pattern.importanceScore >= 90 ? "CRITICAL" : pattern.importanceScore >= 75 ? "HIGH" : "MEDIUM",
    owner: "Growth Intelligence",
    recommendationType: recommendationTypeFromPattern(pattern),
    targetEntityType: "Pattern",
    targetEntityId: pattern.id,
    suggestedAction: `Create the highest-leverage response to ${pattern.title}.`,
    reasoning: `The pattern has ${pattern.frequency} supporting signals, ${Math.round(pattern.confidenceScore * 100)}% confidence, and ${pattern.importanceScore}/100 importance.`,
    confidenceScore: pattern.confidenceScore,
    generatedBy: "VGOS Intelligence Kernel",
    createdAt: now,
    updatedAt: now
  };
}

export function createActionFromPattern(pattern: Pattern, objectiveId?: string): RecommendedAction {
  const now = new Date().toISOString();
  const due = new Date(now);
  due.setDate(due.getDate() + 3);
  return {
    id: createScopedId("kernel-action"),
    organizationId: pattern.organizationId ?? orgId,
    workspaceId: pattern.workspaceId,
    title: `Respond to pattern: ${pattern.title}`,
    description: pattern.description,
    sourceType: "Pattern",
    sourceId: pattern.id,
    actionType: actionTypeFromPattern(pattern),
    priority: pattern.importanceScore >= 90 ? "CRITICAL" : pattern.importanceScore >= 75 ? "HIGH" : "MEDIUM",
    status: "PENDING",
    dueDate: due.toISOString(),
    owner: "Growth Intelligence",
    reasoning: `Selected from ${pattern.patternType} with ${pattern.trendDirection.toLowerCase()} trend.`,
    expectedImpact: "Improves VidMaker memory-to-action velocity through a concrete growth move.",
    objectiveId,
    patternId: pattern.id,
    createdAt: now,
    updatedAt: now
  };
}

export function createKernelRecommendationBundle(pattern: Pattern, objectiveId?: string) {
  const recommendation = createRecommendationFromPattern(pattern);
  const action = createActionFromPattern(pattern, objectiveId);
  const reasoningTrace = createReasoningTrace({
    workspaceId: pattern.workspaceId,
    organizationId: pattern.organizationId,
    sourceType: "Pattern",
    sourceId: pattern.id,
    inputSummary: pattern.description,
    reasoningSteps: [
      "Pattern was detected from recurring memory evidence.",
      "Pattern importance and confidence were scored.",
      "A matching recommendation and concrete action were selected.",
      "The action was connected to an objective when available."
    ],
    conclusion: action.title,
    confidenceScore: pattern.confidenceScore,
    recommendedActionIds: [action.id]
  });

  return { recommendation, action, reasoningTrace };
}
