import {
  createScopedId,
  orgId,
  type ActionStatus,
  type PlatformState,
  type Status,
  type TriggerType,
  type Workflow,
  type WorkflowRun,
  type WorkflowStep,
  type WorkflowStepType,
  type WorkflowType
} from "@/lib/vgos-data";
import type { Event as VgosEvent } from "@/lib/vgos-data";

export type WorkflowContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type CreateWorkflowInput = {
  name: string;
  description: string;
  workflowType: WorkflowType;
  triggerType?: TriggerType;
  steps?: WorkflowStepInput[];
};

type WorkflowStepInput = {
  name: string;
  stepType: WorkflowStepType;
  config?: Record<string, unknown>;
};

function nowFrom(context?: Partial<WorkflowContext>) {
  return context?.now ?? new Date().toISOString();
}

export function createWorkflow(input: CreateWorkflowInput, context: WorkflowContext) {
  const now = nowFrom(context);
  const workflow: Workflow = {
    id: createScopedId("workflow"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    name: input.name,
    title: input.name,
    description: input.description,
    workflowType: input.workflowType,
    status: "LIVE" as Status,
    triggerType: input.triggerType ?? "MANUAL",
    triggerConfig: { createdBy: "workflow-engine" },
    createdAt: now,
    updatedAt: now
  };

  const steps = (input.steps ?? defaultStepsForWorkflow(input.workflowType)).map((step, index) =>
    createWorkflowStep(workflow.id, index + 1, step.name, step.stepType, step.config)
  );

  return { workflow, steps };
}

function createWorkflowStep(
  workflowId: string,
  order: number,
  name: string,
  stepType: WorkflowStepType,
  config: Record<string, unknown> = {}
): WorkflowStep {
  const now = new Date().toISOString();
  return {
    id: createScopedId("workflow-step"),
    workflowId,
    order,
    name,
    stepType,
    config,
    status: "PENDING" as ActionStatus,
    createdAt: now,
    updatedAt: now
  };
}

function defaultStepsForWorkflow(workflowType: WorkflowType): WorkflowStepInput[] {
  if (workflowType === "PAIN_POINT_TO_FEATURE_REQUEST") {
    return [
      { name: "Extract pain point", stepType: "EXTRACT_PAIN_POINTS" as WorkflowStepType },
      { name: "Create reasoning trace", stepType: "CREATE_REASONING_TRACE" as WorkflowStepType },
      { name: "Create recommendation", stepType: "CREATE_RECOMMENDATION" as WorkflowStepType },
      { name: "Create task", stepType: "CREATE_TASK" as WorkflowStepType }
    ];
  }

  if (workflowType === "MEMORY_TO_PATTERN") {
    return [
      { name: "Create memory", stepType: "CREATE_MEMORY" as WorkflowStepType },
      { name: "Detect pattern", stepType: "DETECT_PATTERN" as WorkflowStepType },
      { name: "Link knowledge objects", stepType: "LINK_KNOWLEDGE_OBJECTS" as WorkflowStepType },
      { name: "Notify Mission Control", stepType: "NOTIFY_MISSION_CONTROL" as WorkflowStepType }
    ];
  }

  return [
    { name: "Classify signal", stepType: "CLASSIFY" as WorkflowStepType },
    { name: "Extract entities", stepType: "EXTRACT_ENTITIES" as WorkflowStepType },
    { name: "Create recommendation", stepType: "CREATE_RECOMMENDATION" as WorkflowStepType },
    { name: "Create action", stepType: "CREATE_ACTION" as WorkflowStepType }
  ];
}

export function runWorkflowStep(step: WorkflowStep, state: PlatformState, workspaceId?: string) {
  const workspaceObjects = state.knowledgeObjects.filter((object) => !workspaceId || object.workspaceId === workspaceId);
  const outputByType: Partial<Record<WorkflowStepType, string>> = {
    CLASSIFY: "Classified incoming signal with rule-based intent and source context.",
    EXTRACT_ENTITIES: `Matched ${Math.min(workspaceObjects.length, 5)} knowledge entities.`,
    EXTRACT_PAIN_POINTS: "Extracted pain severity and mapped downstream product opportunity.",
    CREATE_MEMORY: "Created or updated memory candidate.",
    DETECT_PATTERN: "Checked recurring evidence for pattern creation.",
    CREATE_REASONING_TRACE: "Stored explainable reasoning trace.",
    CREATE_RECOMMENDATION: "Created AI recommendation candidate.",
    CREATE_ACTION: "Created recommended action candidate.",
    CREATE_CONTENT_ASSET: "Created content asset candidate.",
    CREATE_TASK: "Created execution task candidate.",
    LINK_KNOWLEDGE_OBJECTS: "Linked related knowledge objects.",
    NOTIFY_MISSION_CONTROL: "Mission Control summary updated."
  };

  return {
    stepId: step.id,
    status: "COMPLETED" as ActionStatus,
    log: outputByType[step.stepType] ?? `${step.name} completed.`,
    output: {
      stepType: step.stepType,
      workflowId: step.workflowId
    }
  };
}

export function runWorkflow(
  workflow: Workflow,
  steps: WorkflowStep[],
  state: PlatformState,
  context?: Partial<WorkflowContext> & { triggerSourceType?: string; triggerSourceId?: string }
): WorkflowRun {
  const startedAt = nowFrom(context);
  const stepResults = steps
    .filter((step) => step.workflowId === workflow.id)
    .sort((a, b) => a.order - b.order)
    .map((step) => runWorkflowStep(step, state, workflow.workspaceId));

  return {
    id: createScopedId("workflow-run"),
    organizationId: context?.organizationId ?? workflow.organizationId ?? orgId,
    workspaceId: context?.workspaceId ?? workflow.workspaceId,
    workflowId: workflow.id,
    status: "COMPLETED" as ActionStatus,
    triggerSourceType: context?.triggerSourceType ?? workflow.triggerType,
    triggerSourceId: context?.triggerSourceId ?? "manual-run",
    input: {
      workflowType: workflow.workflowType,
      triggerType: workflow.triggerType
    },
    output: {
      stepsExecuted: stepResults.length,
      stepOutputs: stepResults.map((result) => result.output)
    },
    startedAt,
    completedAt: new Date().toISOString(),
    logs: stepResults.map((result) => result.log)
  };
}

export function triggerWorkflowFromEvent(
  event: VgosEvent,
  workflows: Workflow[],
  steps: WorkflowStep[],
  state: PlatformState
) {
  const workflow = workflows.find(
    (candidate) => candidate.workspaceId === event.workspaceId && candidate.triggerType === "EVENT" && candidate.status === "LIVE"
  );
  if (!workflow) return null;
  return runWorkflow(workflow, steps, state, {
    workspaceId: event.workspaceId,
    organizationId: event.organizationId,
    triggerSourceType: event.sourceType,
    triggerSourceId: event.sourceId
  });
}

export function getWorkflowRunLogs(run: WorkflowRun) {
  return run.logs.map((log, index) => `${index + 1}. ${log}`);
}

export function createDefaultWorkflows(context: WorkflowContext) {
  return [
    createWorkflow(
      {
        name: "Product Hunt Comment to Demo Content Recommendation",
        description: "Turns launch comments into demo-led content recommendations.",
        workflowType: "PRODUCT_HUNT_TO_DEMO_CONTENT",
        triggerType: "EVENT"
      },
      context
    ),
    createWorkflow(
      {
        name: "Question to AEO Blog Asset",
        description: "Turns high-value questions into answer-ready content assets.",
        workflowType: "QUESTION_TO_AEO_ASSET",
        triggerType: "MANUAL"
      },
      context
    ),
    createWorkflow(
      {
        name: "Pain Point to Feature Request",
        description: "Turns repeated product pain into product backlog candidates.",
        workflowType: "PAIN_POINT_TO_FEATURE_REQUEST",
        triggerType: "EVENT"
      },
      context
    ),
    createWorkflow(
      {
        name: "Competitor Complaint to Comparison Content",
        description: "Turns competitor dissatisfaction into comparison content and positioning.",
        workflowType: "COMPETITOR_COMPLAINT_TO_CONTENT",
        triggerType: "AGENT"
      },
      context
    ),
    createWorkflow(
      {
        name: "Memory to Pattern Detection",
        description: "Summarizes recurring memories into patterns for Mission Control.",
        workflowType: "MEMORY_TO_PATTERN",
        triggerType: "SCHEDULED"
      },
      context
    )
  ];
}
