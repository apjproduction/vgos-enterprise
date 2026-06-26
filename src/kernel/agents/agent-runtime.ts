import {
  createScopedId,
  orgId,
  type Agent,
  type AgentRun,
  type PlatformState
} from "@/lib/vgos-data";
import { detectContentGaps, detectProductDemand } from "@/kernel/patterns/pattern-engine";
import { getHighImportanceMemories } from "@/kernel/memory/memory-engine";

export function createAgentRunLog(...entries: string[]) {
  return entries.filter(Boolean);
}

export function runAgent(agent: Agent, state: PlatformState): AgentRun {
  if (agent.agentType === "CONVERSATION_AGENT") return runConversationAgent(agent, state);
  if (agent.agentType === "CONTENT_AGENT") return runContentAgent(agent, state);
  if (agent.agentType === "AUTHORITY_AGENT") return runAuthorityAgent(agent, state);
  if (agent.agentType === "PRODUCT_AGENT") return runProductAgent(agent, state);
  return baseRun(agent, "Reviewed workspace signals.", "Produced a rule-based workspace summary.", 1, 1);
}

export function runConversationAgent(agent: Agent, state: PlatformState) {
  const memories = getHighImportanceMemories(state.memories, 75);
  return baseRun(
    agent,
    `Reviewed ${state.conversations.length} conversations and ${state.observations.length} observations.`,
    `Identified ${memories.length} high-importance memories for follow-up.`,
    memories.length,
    Math.min(memories.length, 5)
  );
}

export function runContentAgent(agent: Agent, state: PlatformState) {
  const patterns = detectContentGaps(state.memories);
  return baseRun(agent, `Reviewed ${state.questions.length} questions and content gaps.`, `Detected ${patterns.length} content gaps.`, patterns.length, 3);
}

export function runAuthorityAgent(agent: Agent, state: PlatformState) {
  return baseRun(
    agent,
    `Reviewed ${state.directorySubmissions.length} directory submissions and ${state.backlinks.length} backlinks.`,
    "Selected authority actions for directory follow-up and backlink outreach.",
    2,
    3
  );
}

export function runProductAgent(agent: Agent, state: PlatformState) {
  const patterns = detectProductDemand(state.memories);
  return baseRun(agent, `Reviewed ${state.painPoints.length} pain points.`, `Detected ${patterns.length} product-demand patterns.`, patterns.length, 4);
}

function baseRun(
  agent: Agent,
  inputSummary: string,
  outputSummary: string,
  recommendationsCreated: number,
  actionsCreated: number
): AgentRun {
  const now = new Date().toISOString();
  return {
    id: createScopedId("agent-run"),
    organizationId: agent.organizationId ?? orgId,
    workspaceId: agent.workspaceId,
    agentId: agent.id,
    status: "COMPLETED",
    inputSummary,
    outputSummary,
    recommendationsCreated,
    actionsCreated,
    startedAt: now,
    completedAt: now,
    logs: createAgentRunLog("Loaded workspace scope.", "Applied rule-based kernel logic.", "Created run summary.")
  };
}
