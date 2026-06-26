import {
  createScopedId,
  orgId,
  type Milestone,
  type Plan,
  type PlanItem,
  type PlanItemType,
  type PlanType,
  type Priority
} from "@/lib/vgos-data";
import { suggestDependencies } from "@/kernel/planning/dependency-engine";
import { predictPlanOutcomes } from "@/kernel/planning/prediction-engine";
import { assignDueDates } from "@/kernel/planning/scheduler";
import type { PlanBundle, PlanningContext, PlanningInput } from "@/kernel/planning/planning-types";

function addDays(days: number, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function createBasePlan(input: PlanningInput, planType: PlanType, context: PlanningContext): Plan {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("plan"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    description: input.description,
    planType,
    status: "DRAFT",
    objectiveId: input.objectiveId,
    startDate: now,
    endDate: addDays(30, new Date(now)),
    owner: input.owner ?? "Growth",
    expectedOutcome: `Execute ${input.title} with sequenced, objective-backed work.`,
    confidenceScore: 0.72,
    createdAt: now,
    updatedAt: now
  };
}

function createMilestone(plan: Plan, title: string, order: number, dueOffset: number, priority: Priority = "HIGH"): Milestone {
  const now = new Date().toISOString();
  return {
    id: createScopedId("milestone"),
    organizationId: plan.organizationId,
    workspaceId: plan.workspaceId,
    planId: plan.id,
    title,
    description: title,
    dueDate: addDays(dueOffset),
    status: "NOT_STARTED",
    priority,
    owner: plan.owner,
    expectedImpact: `${title} advances ${plan.title}.`,
    order,
    createdAt: now,
    updatedAt: now
  };
}

function createPlanItem(
  plan: Plan,
  milestone: Milestone,
  title: string,
  itemType: PlanItemType,
  priority: Priority,
  impact: number,
  effort: number,
  sourceType?: string,
  sourceId?: string
): PlanItem {
  const now = new Date().toISOString();
  return {
    id: createScopedId("plan-item"),
    organizationId: plan.organizationId,
    workspaceId: plan.workspaceId,
    planId: plan.id,
    milestoneId: milestone.id,
    title,
    description: title,
    itemType,
    sourceType,
    sourceId,
    priority,
    status: "NOT_STARTED",
    owner: plan.owner,
    dueDate: milestone.dueDate,
    estimatedImpactScore: impact,
    estimatedEffortScore: effort,
    createdAt: now,
    updatedAt: now
  };
}

function bundle(plan: Plan, milestones: Milestone[], items: PlanItem[], context: PlanningContext): PlanBundle {
  const scheduledItems = assignDueDates(items, plan.startDate);
  const dependencies = suggestDependencies(scheduledItems, context);
  return {
    plan,
    milestones,
    items: scheduledItems,
    dependencies,
    constraints: [],
    predictedOutcomes: predictPlanOutcomes(plan, scheduledItems, plan.organizationId)
  };
}

export function buildContentPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "CONTENT_PLAN", context);
  const milestones = [
    createMilestone(plan, "Publish proof article", 1, 7, "CRITICAL"),
    createMilestone(plan, "Expand authority cluster", 2, 18, "HIGH"),
    createMilestone(plan, "Repurpose into answer assets", 3, 28, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Publish BLOG-004", "BLOG", "CRITICAL", 96, 4, input.sourceType, input.sourceId),
    createPlanItem(plan, milestones[0], "Add proof examples", "BLOG", "CRITICAL", 92, 3),
    createPlanItem(plan, milestones[1], "Draft next authority blog", "BLOG", "HIGH", 82, 4),
    createPlanItem(plan, milestones[2], "Create FAQ from content cluster", "FAQ", "HIGH", 78, 2),
    createPlanItem(plan, milestones[2], "Create newsletter summary", "NEWSLETTER", "MEDIUM", 64, 2)
  ];
  return bundle(plan, milestones, items, context);
}

export function buildAuthorityPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "AUTHORITY_PLAN", context);
  const milestones = [
    createMilestone(plan, "Finalize authority copy", 1, 3, "HIGH"),
    createMilestone(plan, "Submit priority directories", 2, 12, "HIGH"),
    createMilestone(plan, "Follow up for backlinks", 3, 21, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Finalize directory copy", "DIRECTORY_SUBMISSION", "HIGH", 82, 2),
    createPlanItem(plan, milestones[1], "Submit Futurepedia", "DIRECTORY_SUBMISSION", "HIGH", 84, 2),
    createPlanItem(plan, milestones[1], "Submit Toolify", "DIRECTORY_SUBMISSION", "HIGH", 84, 2),
    createPlanItem(plan, milestones[2], "Follow up for backlink approvals", "BACKLINK_OUTREACH", "HIGH", 76, 2),
    createPlanItem(plan, milestones[2], "Add approved directory links to tracker", "INTERNAL_LINK", "MEDIUM", 60, 1)
  ];
  return bundle(plan, milestones, items, context);
}

export function buildAEOPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "AEO_PLAN", context);
  const milestones = [
    createMilestone(plan, "Select answer questions", 1, 4, "HIGH"),
    createMilestone(plan, "Publish answer assets", 2, 14, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Prioritize product-page-to-video FAQ", "FAQ", "HIGH", 88, 2),
    createPlanItem(plan, milestones[0], "Prioritize Video Production Intelligence FAQ", "FAQ", "HIGH", 86, 2),
    createPlanItem(plan, milestones[1], "Update landing page FAQ block", "LANDING_PAGE_UPDATE", "HIGH", 84, 3),
    createPlanItem(plan, milestones[1], "Create founder answer post", "FOUNDER_POST", "HIGH", 78, 2)
  ];
  return bundle(plan, milestones, items, context);
}

export function buildGEOPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "GEO_PLAN", context);
  const milestones = [
    createMilestone(plan, "Strengthen entity definitions", 1, 8, "HIGH"),
    createMilestone(plan, "Connect entity cluster", 2, 18, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Update VidMaker entity description", "LANDING_PAGE_UPDATE", "HIGH", 78, 2),
    createPlanItem(plan, milestones[0], "Update Purpose-Specific AI entity description", "LANDING_PAGE_UPDATE", "HIGH", 76, 2),
    createPlanItem(plan, milestones[1], "Add internal entity links", "INTERNAL_LINK", "HIGH", 82, 2),
    createPlanItem(plan, milestones[1], "Publish company post about Purpose Engines", "COMPANY_POST", "MEDIUM", 64, 2)
  ];
  return bundle(plan, milestones, items, context);
}

export function buildLaunchPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "LAUNCH_PLAN", context);
  const milestones = [
    createMilestone(plan, "Create proof demo", 1, 5, "CRITICAL"),
    createMilestone(plan, "Reply and distribute", 2, 12, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Create product-page-to-video demo", "DEMO", "CRITICAL", 98, 5),
    createPlanItem(plan, milestones[1], "Reply to community launch comments", "COMMUNITY_REPLY", "CRITICAL", 90, 3),
    createPlanItem(plan, milestones[1], "Publish X thread from launch proof", "X_THREAD", "HIGH", 76, 2),
    createPlanItem(plan, milestones[1], "Create Pinterest proof pin set", "PINTEREST_PIN", "MEDIUM", 58, 2)
  ];
  return bundle(plan, milestones, items, context);
}

export function buildCommunityPlan(input: PlanningInput, context: PlanningContext): PlanBundle {
  const plan = createBasePlan(input, "COMMUNITY_PLAN", context);
  const milestones = [
    createMilestone(plan, "Find response opportunities", 1, 3, "HIGH"),
    createMilestone(plan, "Publish proof replies", 2, 10, "HIGH")
  ];
  const items = [
    createPlanItem(plan, milestones[0], "Select Reddit and Product Hunt threads", "COMMUNITY_REPLY", "HIGH", 80, 2),
    createPlanItem(plan, milestones[1], "Reply with demo proof", "COMMUNITY_REPLY", "CRITICAL", 92, 3),
    createPlanItem(plan, milestones[1], "Create founder follow-up post", "FOUNDER_POST", "HIGH", 78, 2)
  ];
  return bundle(plan, milestones, items, context);
}

