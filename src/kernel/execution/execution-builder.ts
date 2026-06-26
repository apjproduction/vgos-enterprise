import {
  createScopedId,
  orgId,
  type Campaign,
  type ExecutionItem,
  type ExecutionType,
  type Plan,
  type PlanItem,
  type RecommendedAction,
  type WorkflowRun
} from "@/lib/vgos-data";
import type { CreateExecutionInput, ExecutionContext } from "@/kernel/execution/execution-types";

function nowFrom(context?: Partial<ExecutionContext>) {
  return context?.now ?? new Date().toISOString();
}

function dueDateFrom(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function suggestExecutionType(source: { itemType?: string; actionType?: string; title?: string }): ExecutionType {
  const value = `${source.itemType ?? ""} ${source.actionType ?? ""} ${source.title ?? ""}`.toLowerCase();
  if (value.includes("blog")) return "BLOG_PUBLISH";
  if (value.includes("founder")) return "FOUNDER_POST";
  if (value.includes("company")) return "COMPANY_POST";
  if (value.includes("x_thread") || value.includes("thread")) return "X_THREAD";
  if (value.includes("x_post")) return "X_POST";
  if (value.includes("pinterest")) return "PINTEREST_PIN";
  if (value.includes("directory")) return "DIRECTORY_SUBMISSION";
  if (value.includes("backlink")) return "BACKLINK_OUTREACH";
  if (value.includes("community") || value.includes("reply")) return "COMMUNITY_REPLY";
  if (value.includes("demo")) return "DEMO_CREATION";
  if (value.includes("faq")) return "FAQ_UPDATE";
  if (value.includes("landing")) return "LANDING_PAGE_UPDATE";
  if (value.includes("internal_link") || value.includes("internal link")) return "INTERNAL_LINK_UPDATE";
  if (value.includes("newsletter")) return "NEWSLETTER_SEND";
  if (value.includes("youtube")) return "YOUTUBE_SCRIPT";
  if (value.includes("product")) return "PRODUCT_TASK";
  if (value.includes("experiment")) return "EXPERIMENT_RUN";
  return "MANUAL_ACTION";
}

export function createExecutionItem(input: CreateExecutionInput, context: ExecutionContext): ExecutionItem {
  const now = nowFrom(context);
  return {
    id: createScopedId("execution-item"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    description: input.description ?? input.title,
    executionType: input.executionType ?? suggestExecutionType(input),
    status: input.status ?? "QUEUED",
    priority: input.priority ?? "HIGH",
    owner: input.owner ?? "Growth",
    dueDate: input.dueDate ?? dueDateFrom(7),
    startedAt: undefined,
    completedAt: undefined,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    planId: input.planId,
    planItemId: input.planItemId,
    recommendedActionId: input.recommendedActionId,
    workflowRunId: input.workflowRunId,
    objectiveId: input.objectiveId,
    campaignId: input.campaignId,
    expectedImpact: input.expectedImpact ?? "Move planned growth work into shipped proof and measurable learning.",
    actualImpact: "",
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now
  };
}

export function createExecutionFromPlanItem(item: PlanItem, context: ExecutionContext): ExecutionItem {
  return createExecutionItem(
    {
      title: item.title,
      description: item.description,
      executionType: suggestExecutionType({ itemType: item.itemType, title: item.title }),
      status: item.status === "BLOCKED" ? "BLOCKED" : "READY",
      priority: item.priority,
      owner: item.owner,
      dueDate: item.dueDate,
      sourceType: item.sourceType ?? "PlanItem",
      sourceId: item.sourceId ?? item.id,
      planId: item.planId,
      planItemId: item.id,
      expectedImpact: `Estimated impact ${item.estimatedImpactScore}; effort ${item.estimatedEffortScore}.`
    },
    context
  );
}

export function createExecutionFromRecommendedAction(
  action: RecommendedAction,
  context: ExecutionContext
): ExecutionItem {
  return createExecutionItem(
    {
      title: action.title,
      description: action.description,
      executionType: suggestExecutionType({ actionType: action.actionType, title: action.title }),
      status: "READY",
      priority: action.priority,
      owner: action.owner,
      dueDate: action.dueDate,
      sourceType: action.sourceType,
      sourceId: action.sourceId,
      recommendedActionId: action.id,
      objectiveId: action.objectiveId,
      expectedImpact: action.expectedImpact,
      notes: action.reasoning
    },
    context
  );
}

export function createExecutionFromWorkflowRun(run: WorkflowRun, context: ExecutionContext): ExecutionItem {
  return createExecutionItem(
    {
      title: `Execute workflow output: ${run.workflowId}`,
      description: String(run.output.summary ?? run.logs.at(-1) ?? "Workflow output requires execution."),
      executionType: "MANUAL_ACTION",
      status: "READY",
      priority: "HIGH",
      owner: "Workflow Operator",
      sourceType: run.triggerSourceType,
      sourceId: run.triggerSourceId,
      workflowRunId: run.id,
      notes: run.logs.join("\n")
    },
    context
  );
}

export function createExecutionFromCampaign(campaign: Campaign, context: ExecutionContext): ExecutionItem {
  return createExecutionItem(
    {
      title: `Execute campaign: ${campaign.title}`,
      description: campaign.description,
      executionType: "MANUAL_ACTION",
      status: "QUEUED",
      priority: campaign.priority,
      owner: campaign.owner,
      sourceType: "Campaign",
      sourceId: campaign.id,
      campaignId: campaign.id
    },
    context
  );
}

export function batchCreateExecutionsFromPlan(
  plan: Plan,
  items: PlanItem[],
  context: ExecutionContext
): ExecutionItem[] {
  return items
    .filter((item) => item.planId === plan.id && item.status !== "ARCHIVED")
    .map((item) => createExecutionFromPlanItem(item, context));
}
