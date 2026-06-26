import {
  createScopedId,
  orgId,
  type Objective,
  type Pattern,
  type Plan,
  type PlanItem,
  type PlanStatus,
  type PlanType,
  type RecommendedAction
} from "@/lib/vgos-data";
import {
  buildAEOPlan,
  buildAuthorityPlan,
  buildCommunityPlan,
  buildContentPlan,
  buildGEOPlan,
  buildLaunchPlan
} from "@/kernel/planning/plan-builder";
import { detectBlockedItems } from "@/kernel/planning/dependency-engine";
import { calculateConfidence } from "@/kernel/planning/prediction-engine";
import type { PlanBundle, PlanHealth, PlanningContext, PlanningInput } from "@/kernel/planning/planning-types";

function addDays(days: number, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function createPlan(
  input: PlanningInput & {
    planType?: PlanType;
    startDate?: string;
    endDate?: string;
    expectedOutcome?: string;
    confidenceScore?: number;
  },
  context: PlanningContext
): Plan {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("plan"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    description: input.description,
    planType: input.planType ?? "CONTENT_PLAN",
    status: "DRAFT",
    objectiveId: input.objectiveId,
    startDate: input.startDate ?? now,
    endDate: input.endDate ?? addDays(30, new Date(now)),
    owner: input.owner ?? "Growth",
    expectedOutcome: input.expectedOutcome ?? `Complete ${input.title} with clear sequencing and expected outcomes.`,
    confidenceScore: input.confidenceScore ?? 0.72,
    createdAt: now,
    updatedAt: now
  };
}

export function generatePlanFromObjective(objective: Objective, context: PlanningContext): PlanBundle {
  const input = {
    title: `${objective.title} execution plan`,
    description: objective.description,
    owner: "Growth",
    objectiveId: objective.id,
    sourceType: "Objective",
    sourceId: objective.id
  };

  if (objective.category === "AUTHORITY") return buildAuthorityPlan(input, context);
  if (objective.category === "AEO") return buildAEOPlan(input, context);
  if (objective.category === "GEO") return buildGEOPlan(input, context);
  if (objective.category === "COMMUNITY") return buildCommunityPlan(input, context);
  return buildContentPlan(input, context);
}

export function generatePlanFromRecommendedActions(
  actions: RecommendedAction[],
  context: PlanningContext
): PlanBundle {
  const hasAuthority = actions.some((action) =>
    ["SUBMIT_DIRECTORY", "REACH_OUT_FOR_BACKLINK", "ADD_INTERNAL_LINK"].includes(action.actionType)
  );
  const hasLaunch = actions.some((action) => ["CREATE_DEMO", "REPLY_TO_COMMUNITY", "CREATE_X_THREAD"].includes(action.actionType));
  const title = hasLaunch
    ? "Recommended action launch plan"
    : hasAuthority
      ? "Recommended action authority plan"
      : "Recommended action content plan";
  const input = {
    title,
    description: `Generated from ${actions.length} recommended actions.`,
    owner: actions[0]?.owner ?? "Growth",
    objectiveId: actions.find((action) => action.objectiveId)?.objectiveId,
    sourceType: "RecommendedAction",
    sourceId: actions[0]?.id
  };
  if (hasLaunch) return buildLaunchPlan(input, context);
  if (hasAuthority) return buildAuthorityPlan(input, context);
  return buildContentPlan(input, context);
}

export function generatePlanFromPatterns(patterns: Pattern[], context: PlanningContext): PlanBundle {
  const topPattern = [...patterns].sort((a, b) => b.importanceScore - a.importanceScore)[0];
  const input = {
    title: topPattern ? `${topPattern.title} response plan` : "Pattern response plan",
    description: topPattern?.description ?? "Generated from recurring VGOS patterns.",
    owner: "Growth Intelligence",
    sourceType: "Pattern",
    sourceId: topPattern?.id
  };

  if (topPattern?.patternType === "AUTHORITY_OPPORTUNITY") return buildAuthorityPlan(input, context);
  if (topPattern?.patternType === "AEO_OPPORTUNITY") return buildAEOPlan(input, context);
  if (topPattern?.patternType === "GEO_OPPORTUNITY") return buildGEOPlan(input, context);
  if (topPattern?.patternType === "PRODUCT_DEMAND") return buildLaunchPlan(input, context);
  return buildContentPlan(input, context);
}

export function evaluatePlanHealth(input: {
  plan: Plan;
  items: PlanItem[];
  dependencies?: Parameters<typeof detectBlockedItems>[1];
  constraints?: unknown[];
}): PlanHealth {
  const now = Date.now();
  const dependencies = input.dependencies ?? [];
  const blockedItems = detectBlockedItems(input.items, dependencies);
  const overdueItems = input.items.filter(
    (item) => !["COMPLETED", "ARCHIVED"].includes(item.status) && new Date(item.dueDate).getTime() < now
  );
  const constraintCount = input.constraints?.length ?? 0;
  const completionRate =
    input.items.filter((item) => item.status === "COMPLETED").length / Math.max(input.items.length, 1);
  const confidence = calculateConfidence({ plan: input.plan, items: input.items, constraints: input.constraints });
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(55 + completionRate * 25 + confidence * 20 - blockedItems.length * 8 - overdueItems.length * 5 - constraintCount * 3)
    )
  );
  const status = blockedItems.length > 0 ? "BLOCKED" : score < 70 ? "AT_RISK" : "HEALTHY";
  return {
    score,
    status,
    blockedItems,
    overdueItems,
    constraintCount,
    rationale: `${input.plan.title} is ${status.toLowerCase()} with ${blockedItems.length} blocked items, ${overdueItems.length} overdue items, and ${constraintCount} constraints.`
  };
}

function updatePlanStatus(plan: Plan, status: PlanStatus): Plan {
  return {
    ...plan,
    status,
    updatedAt: new Date().toISOString()
  };
}

export function activatePlan(plan: Plan) {
  return updatePlanStatus(plan, "ACTIVE");
}

export function completePlan(plan: Plan) {
  return updatePlanStatus(plan, "COMPLETED");
}

