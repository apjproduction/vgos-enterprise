import {
  createScopedId,
  orgId,
  type Learning,
  type StrategyAdjustment
} from "@/lib/vgos-data";
import type { MeasurementContext, StrategyAdjustmentInput } from "@/kernel/measurement/measurement-types";

export function createStrategyAdjustment(
  input: StrategyAdjustmentInput,
  context: MeasurementContext
): StrategyAdjustment {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("strategy-adjustment"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    description: input.description,
    adjustmentType: input.adjustmentType ?? "INCREASE_FOCUS",
    sourceLearningId: input.sourceLearningId,
    objectiveId: input.objectiveId ?? context.objectiveId,
    planId: input.planId ?? context.planId,
    status: input.status ?? "PROPOSED",
    priority: input.priority ?? "HIGH",
    reasoning: input.reasoning,
    createdAt: now,
    updatedAt: now
  };
}

export function suggestStrategyAdjustments(
  learnings: Learning[],
  context: MeasurementContext
): StrategyAdjustment[] {
  return learnings
    .filter((learning) => learning.shouldInformFuturePlans)
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 5)
    .map((learning) =>
      createStrategyAdjustment(
        {
          title: titleFromLearning(learning),
          description: learning.recommendationImpact,
          adjustmentType: typeFromLearning(learning),
          sourceLearningId: learning.id,
          objectiveId: learning.objectiveId,
          planId: learning.planId,
          priority: learning.confidenceScore >= 0.86 ? "CRITICAL" : "HIGH",
          reasoning: `${learning.summary} ${learning.recommendationImpact}`.trim()
        },
        context
      )
    );
}

export function applyStrategyAdjustment(adjustment: StrategyAdjustment, context?: Partial<MeasurementContext>) {
  return updateStrategyAdjustmentStatus(adjustment, "IMPLEMENTED", context);
}

export function acceptStrategyAdjustment(adjustment: StrategyAdjustment, context?: Partial<MeasurementContext>) {
  return updateStrategyAdjustmentStatus(adjustment, "ACCEPTED", context);
}

export function rejectStrategyAdjustment(adjustment: StrategyAdjustment, context?: Partial<MeasurementContext>) {
  return updateStrategyAdjustmentStatus(adjustment, "REJECTED", context);
}

export function getPendingAdjustments(adjustments: StrategyAdjustment[]) {
  return adjustments.filter((adjustment) => adjustment.status === "PROPOSED");
}

function updateStrategyAdjustmentStatus(
  adjustment: StrategyAdjustment,
  status: StrategyAdjustment["status"],
  context?: Partial<MeasurementContext>
): StrategyAdjustment {
  return {
    ...adjustment,
    status,
    updatedAt: context?.now ?? new Date().toISOString()
  };
}

function typeFromLearning(learning: Learning): StrategyAdjustment["adjustmentType"] {
  if (learning.learningType === "AUTHORITY_IMPACT") return "CREATE_NEW_PLAN";
  if (learning.learningType === "SEO_IMPACT" || learning.learningType === "AEO_IMPACT" || learning.learningType === "GEO_IMPACT") return "UPDATE_CONTENT_CLUSTER";
  if (learning.learningType === "CHANNEL_PERFORMANCE" || learning.learningType === "COMMUNITY_SIGNAL") return "UPDATE_CHANNEL_PRIORITY";
  if (learning.learningType === "PRODUCT_SIGNAL") return "CREATE_EXPERIMENT";
  if (learning.learningType === "CUSTOMER_LANGUAGE") return "UPDATE_POSITIONING";
  return "INCREASE_FOCUS";
}

function titleFromLearning(learning: Learning) {
  if (learning.learningType === "CUSTOMER_LANGUAGE") return `Update positioning from ${learning.title}`;
  if (learning.learningType === "AUTHORITY_IMPACT") return `Adjust authority plan from ${learning.title}`;
  if (learning.learningType === "PRODUCT_SIGNAL") return `Create experiment from ${learning.title}`;
  return `Adjust strategy from ${learning.title}`;
}
