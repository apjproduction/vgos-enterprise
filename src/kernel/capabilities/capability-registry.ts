import type { CapabilityDefinition } from "@/kernel/capabilities/capability-types";

export const capabilityRegistry: CapabilityDefinition[] = [
  {
    id: "memory-engine",
    name: "Memory Engine",
    description: "Stores recurring topics, entities, questions, and pain points over time.",
    version: "5.0-alpha",
    inputs: ["Observation", "Insight", "Conversation"],
    outputs: ["Memory", "MemorySnapshot"],
    dependencies: ["Event System"],
    eventsConsumed: ["OBSERVATION_CREATED", "MEMORY_UPDATED"],
    eventsProduced: ["MEMORY_CREATED", "MEMORY_UPDATED"],
    status: "ACTIVE"
  },
  {
    id: "pattern-engine",
    name: "Pattern Engine",
    description: "Detects recurring demand, content gaps, competitor complaints, and authority opportunities.",
    version: "5.0-alpha",
    inputs: ["Memory", "Observation", "Question", "PainPoint"],
    outputs: ["Pattern", "RecommendedAction"],
    dependencies: ["Memory Engine"],
    eventsConsumed: ["MEMORY_CREATED", "MEMORY_UPDATED"],
    eventsProduced: ["PATTERN_DETECTED"],
    status: "ACTIVE"
  },
  {
    id: "reasoning-engine",
    name: "Reasoning Engine",
    description: "Stores explainable traces behind recommendations and actions.",
    version: "5.0-alpha",
    inputs: ["Pattern", "Memory", "Insight"],
    outputs: ["ReasoningTrace"],
    dependencies: ["Pattern Engine"],
    eventsConsumed: ["PATTERN_DETECTED"],
    eventsProduced: ["REASONING_TRACE_CREATED"],
    status: "ACTIVE"
  },
  {
    id: "goal-engine",
    name: "Goal Engine",
    description: "Tracks objectives and key results for growth intelligence execution.",
    version: "5.0-alpha",
    inputs: ["Objective", "KeyResult", "RecommendedAction"],
    outputs: ["ObjectiveProgress", "ObjectiveHealth"],
    dependencies: ["Decision Engine"],
    eventsConsumed: ["OBJECTIVE_CREATED", "KEY_RESULT_UPDATED"],
    eventsProduced: ["HIGH_IMPACT_ACTION_SELECTED"],
    status: "ACTIVE"
  },
  {
    id: "agent-runtime",
    name: "Agent Runtime",
    description: "Runs specialized rule-based agents for conversation, content, authority, AEO, and product work.",
    version: "5.0-beta",
    inputs: ["Agent", "WorkspaceSignals"],
    outputs: ["AgentRun", "AgentHandoff"],
    dependencies: ["Memory Engine", "Pattern Engine"],
    eventsConsumed: ["AGENT_RUN_STARTED"],
    eventsProduced: ["AGENT_RUN_COMPLETED"],
    status: "ACTIVE"
  },
  {
    id: "decision-engine",
    name: "Decision Engine",
    description: "Ranks opportunities and recommended actions into daily and strategic priorities.",
    version: "5.0-alpha",
    inputs: ["RecommendedAction", "Objective", "Pattern"],
    outputs: ["RankedAction", "PriorityBriefing"],
    dependencies: ["Goal Engine", "Pattern Engine"],
    eventsConsumed: ["HIGH_OPPORTUNITY_DETECTED"],
    eventsProduced: ["HIGH_IMPACT_ACTION_SELECTED"],
    status: "ACTIVE"
  },
  {
    id: "knowledge-layer",
    name: "Knowledge Layer",
    description: "Creates canonical knowledge objects and typed relationships across VGOS.",
    version: "5.0-beta",
    inputs: ["Entity", "Question", "ContentAsset", "Memory", "Pattern"],
    outputs: ["KnowledgeObject", "KnowledgeRelationship"],
    dependencies: ["Memory Engine", "Semantic Search"],
    eventsConsumed: ["QUESTION_CREATED", "CONTENT_ASSET_CREATED", "PATTERN_DETECTED"],
    eventsProduced: ["CAPABILITY_REGISTERED"],
    status: "ACTIVE"
  },
  {
    id: "workflow-engine",
    name: "Workflow Engine",
    description: "Runs reusable workflows over intelligence, memory, patterns, recommendations, and actions.",
    version: "5.0-beta",
    inputs: ["Workflow", "WorkflowStep", "Event"],
    outputs: ["WorkflowRun", "WorkflowLog"],
    dependencies: ["Knowledge Layer", "Event System"],
    eventsConsumed: ["OBSERVATION_CREATED", "QUESTION_CREATED", "PATTERN_DETECTED"],
    eventsProduced: ["HIGH_IMPACT_ACTION_SELECTED"],
    status: "ACTIVE"
  },
  {
    id: "planning-engine",
    name: "Planning Engine",
    description: "Turns objectives, recommendations, patterns, constraints, and capacity into execution plans.",
    version: "5.0-capability",
    inputs: ["Objective", "Pattern", "RecommendedAction", "ResourceCapacity"],
    outputs: ["Plan", "Milestone", "PlanItem", "PredictedOutcome"],
    dependencies: ["Decision Engine", "Knowledge Layer", "Workflow Engine"],
    eventsConsumed: ["OBJECTIVE_CREATED", "HIGH_IMPACT_ACTION_SELECTED", "PATTERN_DETECTED"],
    eventsProduced: ["PLAN_CREATED", "PLAN_ACTIVATED", "OUTCOME_PREDICTED"],
    status: "BETA"
  },
  {
    id: "opportunity-engine",
    name: "Opportunity Engine",
    description: "Builds a unified opportunity queue across questions, pain points, content, authority, and experiments.",
    version: "5.0-sprint-4",
    inputs: ["Question", "PainPoint", "ContentAsset", "AIRecommendation"],
    outputs: ["OpportunityItem", "OpportunityScore"],
    dependencies: ["Recommendation Engine"],
    eventsConsumed: ["HIGH_OPPORTUNITY_DETECTED"],
    eventsProduced: ["HIGH_IMPACT_ACTION_SELECTED"],
    status: "ACTIVE"
  },
  {
    id: "recommendation-engine",
    name: "Recommendation Engine",
    description: "Creates AI recommendations and recommended actions from market intelligence.",
    version: "5.0-sprint-5",
    inputs: ["IntelligenceObject", "Pattern", "Question", "PainPoint"],
    outputs: ["AIRecommendation", "RecommendedAction"],
    dependencies: ["Reasoning Engine", "Opportunity Engine"],
    eventsConsumed: ["AI_RECOMMENDATION_CREATED"],
    eventsProduced: ["HIGH_OPPORTUNITY_DETECTED"],
    status: "ACTIVE"
  },
  {
    id: "event-system",
    name: "Event System",
    description: "Records workspace-scoped events that trigger workflows and kernel updates.",
    version: "5.0-sprint-4",
    inputs: ["DomainEvent"],
    outputs: ["Event", "WorkflowTrigger"],
    dependencies: [],
    eventsConsumed: [],
    eventsProduced: ["PLAN_CREATED", "CAPABILITY_REGISTERED"],
    status: "ACTIVE"
  }
];

export function getCapabilityById(id: string) {
  return capabilityRegistry.find((capability) => capability.id === id);
}

export function getCapabilitiesByStatus(status: CapabilityDefinition["status"]) {
  return capabilityRegistry.filter((capability) => capability.status === status);
}

export function getCapabilityDependencies(id: string) {
  const capability = getCapabilityById(id);
  if (!capability) return [];
  return capability.dependencies
    .map((name) => capabilityRegistry.find((candidate) => candidate.name === name || candidate.id === name))
    .filter(Boolean) as CapabilityDefinition[];
}

