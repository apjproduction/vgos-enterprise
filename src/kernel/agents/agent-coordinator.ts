import {
  createScopedId,
  orgId,
  type Agent,
  type AgentHandoff,
  type AgentRun,
  type PlatformState,
  type Workflow,
  type WorkflowRun
} from "@/lib/vgos-data";
import { runAgent } from "@/kernel/agents/agent-runtime";
import { runWorkflow } from "@/kernel/workflows/workflow-engine";

export type AgentCoordinationResult = {
  workflow: Workflow;
  agents: Agent[];
  runs: AgentRun[];
  handoffs: AgentHandoff[];
  evaluation: ReturnType<typeof evaluateAgentOutput>;
};

export function getAvailableAgentsForWorkflow(agents: Agent[], workflow: Workflow) {
  return agents
    .filter((agent) => agent.workspaceId === workflow.workspaceId && agent.status === "LIVE")
    .filter(
      (agent) =>
        agent.allowedWorkflowIds.length === 0 ||
        agent.allowedWorkflowIds.includes(workflow.id) ||
        agent.inputSources.includes(workflow.workflowType)
    )
    .sort((a, b) => a.dependsOnAgentIds.length - b.dependsOnAgentIds.length);
}

export function createAgentHandoff(input: {
  fromAgentId: string;
  toAgentId: string;
  workspaceId: string;
  organizationId?: string;
  sourceType: string;
  sourceId: string;
  reason: string;
}): AgentHandoff {
  const now = new Date().toISOString();
  return {
    id: createScopedId("agent-handoff"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    fromAgentId: input.fromAgentId,
    toAgentId: input.toAgentId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    reason: input.reason,
    status: "PENDING",
    createdAt: now
  };
}

export function handoffBetweenAgents(fromAgent: Agent, toAgent: Agent, sourceType: string, sourceId: string, reason: string) {
  return createAgentHandoff({
    fromAgentId: fromAgent.id,
    toAgentId: toAgent.id,
    workspaceId: fromAgent.workspaceId,
    organizationId: fromAgent.organizationId,
    sourceType,
    sourceId,
    reason
  });
}

export function evaluateAgentOutput(run: AgentRun) {
  const totalCreated = run.recommendationsCreated + run.actionsCreated;
  const confidenceScore = Math.min(0.95, 0.55 + totalCreated * 0.08);
  return {
    runId: run.id,
    accepted: run.status === "COMPLETED" && totalCreated > 0,
    confidenceScore,
    summary:
      totalCreated > 0
        ? `Agent produced ${totalCreated} downstream objects.`
        : "Agent produced a summary but no downstream objects."
  };
}

export function runAgentWorkflow(
  agent: Agent,
  workflow: Workflow,
  state: PlatformState
): { agentRun: AgentRun; workflowRun: WorkflowRun } {
  const agentRun = runAgent(agent, state);
  const workflowRun = runWorkflow(
    workflow,
    state.workflowSteps.filter((step) => step.workflowId === workflow.id),
    state,
    {
      workspaceId: workflow.workspaceId,
      organizationId: workflow.organizationId,
      triggerSourceType: "Agent",
      triggerSourceId: agent.id
    }
  );
  return { agentRun, workflowRun };
}

export function coordinateAgents(state: PlatformState, workflow: Workflow): AgentCoordinationResult {
  const agents = getAvailableAgentsForWorkflow(state.agents, workflow).slice(0, 4);
  const runs = agents.map((agent) => runAgent(agent, state));
  const handoffs = agents.slice(0, -1).map((agent, index) =>
    handoffBetweenAgents(
      agent,
      agents[index + 1],
      "Workflow",
      workflow.id,
      `${agent.name} completed a workflow stage and passed context to ${agents[index + 1].name}.`
    )
  );
  const evaluation = evaluateAgentOutput(
    runs[0] ?? {
      id: createScopedId("agent-run"),
      organizationId: workflow.organizationId,
      workspaceId: workflow.workspaceId,
      agentId: "none",
      status: "DISMISSED",
      inputSummary: "No agent available.",
      outputSummary: "No agent could run this workflow.",
      recommendationsCreated: 0,
      actionsCreated: 0,
      startedAt: new Date().toISOString(),
      logs: []
    }
  );

  return {
    workflow,
    agents,
    runs,
    handoffs,
    evaluation
  };
}

