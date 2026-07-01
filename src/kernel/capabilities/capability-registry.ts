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
    id: "execution-engine",
    name: "Execution Engine",
    description: "Turns plans, recommendations, workflows, and mission priorities into tracked execution items with approvals, evidence, blockers, outcomes, and learning.",
    version: "1.0.0",
    inputs: ["PlanItem", "Plan", "RecommendedAction", "WorkflowRun", "Objective", "Campaign"],
    outputs: ["ExecutionItem", "ExecutionEvidence", "ExecutionResult", "Events"],
    dependencies: ["Planning Engine", "Recommendation Engine", "Workflow Engine", "Event System"],
    eventsConsumed: ["PLAN_ACTIVATED", "PLAN_ITEM_COMPLETED", "AI_RECOMMENDATION_CREATED", "WORKFLOW_RUN_COMPLETED"],
    eventsProduced: ["EXECUTION_STARTED", "EXECUTION_BLOCKED", "EXECUTION_COMPLETED", "EXECUTION_RESULT_CREATED"],
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
    id: "measurement-learning-engine",
    name: "Measurement & Learning Engine",
    description: "Turns execution results and metric movement into measurements, learnings, attributions, and strategy adjustments.",
    version: "1.0.0",
    inputs: ["ExecutionResult", "Measurement", "Metric", "PredictedOutcome", "Objective"],
    outputs: ["Learning", "Attribution", "StrategyAdjustment", "Events"],
    dependencies: ["Execution Engine", "Planning Engine", "Goal Engine", "Event System", "Reasoning Engine"],
    eventsConsumed: ["EXECUTION_COMPLETED", "EXECUTION_RESULT_CREATED", "OUTCOME_PREDICTED", "PLAN_COMPLETED"],
    eventsProduced: [
      "MEASUREMENT_CREATED",
      "LEARNING_CREATED",
      "ATTRIBUTION_CREATED",
      "STRATEGY_ADJUSTMENT_PROPOSED"
    ],
    status: "BETA"
  },
  {
    id: "mission-engine",
    name: "Mission Engine",
    description: "Connects objectives, plans, execution, measurement, learning, and strategy into high-level business missions.",
    version: "5.1-enterprise",
    inputs: ["Objective", "Plan", "ExecutionItem", "Measurement", "Learning", "StrategyAdjustment"],
    outputs: ["Mission", "MissionSummary", "MissionRecommendation", "Events"],
    dependencies: ["Planning Engine", "Execution Engine", "Measurement & Learning Engine", "Decision Engine"],
    eventsConsumed: [
      "OBJECTIVE_CREATED",
      "PLAN_CREATED",
      "EXECUTION_COMPLETED",
      "MEASUREMENT_CREATED",
      "LEARNING_CREATED",
      "STRATEGY_ADJUSTMENT_PROPOSED"
    ],
    eventsProduced: [
      "MISSION_CREATED",
      "MISSION_UPDATED",
      "MISSION_PROGRESS_UPDATED",
      "MISSION_HEALTH_CHANGED",
      "MISSION_SUMMARY_GENERATED",
      "MISSION_RECOMMENDATION_CREATED"
    ],
    status: "BETA"
  },
  {
    id: "connected-intelligence",
    name: "Connected Intelligence",
    description: "Brings external APIs, manual imports, and future webhooks into VGOS through connectors, raw signals, normalized signals, events, and kernel routing.",
    version: "1.0.0",
    inputs: ["External APIs", "Manual Imports", "Webhooks", "Connector Config"],
    outputs: ["RawSignal", "NormalizedSignal", "Event", "IntelligenceObject", "Measurement", "KnowledgeObject"],
    dependencies: ["Event System", "Intelligence Pipeline", "Knowledge Layer", "Measurement & Learning Engine", "Mission Engine"],
    eventsConsumed: ["CONNECTOR_SYNC_STARTED", "RAW_SIGNAL_RECEIVED", "SIGNAL_NORMALIZED"],
    eventsProduced: [
      "CONNECTOR_CREATED",
      "CONNECTOR_CONNECTED",
      "CONNECTOR_SYNC_COMPLETED",
      "CONNECTOR_SYNC_FAILED",
      "RAW_SIGNAL_RECEIVED",
      "SIGNAL_NORMALIZED",
      "SIGNAL_ROUTED",
      "CONNECTOR_HEALTH_CHANGED"
    ],
    status: "BETA"
  },
  {
    id: "intelligence-quality",
    name: "Intelligence Quality Layer",
    description: "Scores signal quality, recommendation confidence, evidence strength, duplicate risk, missing evidence, and audit readiness before enterprise workflows consume intelligence.",
    version: "1.0.0",
    inputs: ["Signals", "Recommendations", "Actions", "KnowledgeObjects", "Missions"],
    outputs: ["Quality scores", "Confidence explanations", "Duplicate warnings", "Missing evidence reports", "Audit events"],
    dependencies: ["Intelligence Pipeline", "Knowledge Layer", "Mission Engine", "Connected Intelligence", "Event System"],
    eventsConsumed: ["RAW_SIGNAL_RECEIVED", "SIGNAL_NORMALIZED", "AI_RECOMMENDATION_CREATED", "MISSION_UPDATED"],
    eventsProduced: ["SIGNAL_ROUTED", "MISSION_HEALTH_CHANGED"],
    status: "ACTIVE"
  },
  {
    id: "production-ux-operational-readiness",
    name: "Production UX & Operational Readiness",
    description: "Simplifies daily operation through onboarding, grouped navigation, settings, system health, empty states, and production-safe UI controls.",
    version: "1.0.0",
    inputs: ["Missions", "Recommendations", "Executions", "Connectors", "System Events"],
    outputs: [
      "Simplified Mission Control",
      "Onboarding Flow",
      "Settings",
      "System Health",
      "Usability Components"
    ],
    dependencies: [
      "Mission Engine",
      "Execution Engine",
      "Connected Intelligence",
      "Intelligence Quality Layer"
    ],
    eventsConsumed: ["MISSION_UPDATED", "EXECUTION_BLOCKED", "APPROVAL_REQUESTED", "CONNECTOR_HEALTH_CHANGED"],
    eventsProduced: ["MISSION_UPDATED"],
    status: "ACTIVE"
  },
  {
    id: "executive-intelligence-experience",
    name: "Executive Intelligence Experience",
    description: "Translates VGOS kernel state into an executive brief, advisor workspace, work queue, persona navigation, and explainable recommendations.",
    version: "1.0.0",
    inputs: ["Missions", "Plans", "Executions", "Measurements", "Signals", "Recommendations"],
    outputs: [
      "Executive Brief",
      "Advisor Workspace",
      "Work Queue",
      "Persona Navigation",
      "Explainable Recommendations"
    ],
    dependencies: [
      "Mission Engine",
      "Planning Engine",
      "Execution Engine",
      "Measurement & Learning Engine",
      "Intelligence Quality Layer",
      "Connected Intelligence"
    ],
    eventsConsumed: [
      "MISSION_UPDATED",
      "EXECUTION_STARTED",
      "EXECUTION_BLOCKED",
      "APPROVAL_REQUESTED",
      "EXECUTION_COMPLETED",
      "MEASUREMENT_CREATED"
    ],
    eventsProduced: [
      "EXECUTIVE_BRIEF_GENERATED",
      "ADVISOR_QUESTION_ANSWERED",
      "WORK_QUEUE_REVIEWED"
    ],
    status: "ACTIVE"
  },
  {
    id: "reflective-cognition",
    name: "Reflective Cognition & Executive Wisdom",
    description: "Strengthens VGOS judgment by explaining assumptions, assessing evidence, finding counter-evidence, comparing tradeoffs, reflecting on outcomes, and recalibrating confidence.",
    version: "1.0.0",
    inputs: ["Recommendations", "Measurements", "Learnings", "Execution Results", "Strategy Adjustments", "Missions", "Advisor Context"],
    outputs: [
      "Assumptions",
      "Evidence Assessments",
      "Tradeoff Analyses",
      "Reflections",
      "Better Judgment Explanations",
      "Recalibrated Confidence"
    ],
    dependencies: [
      "Advisor",
      "Executive Brief",
      "Recommendation Engine",
      "Measurement & Learning Engine",
      "Mission Engine",
      "Intelligence Quality Layer"
    ],
    eventsConsumed: [
      "AI_RECOMMENDATION_CREATED",
      "MEASUREMENT_CREATED",
      "LEARNING_CREATED",
      "EXECUTION_RESULT_CREATED",
      "STRATEGY_ADJUSTMENT_PROPOSED"
    ],
    eventsProduced: [
      "ASSUMPTION_CREATED",
      "ASSUMPTION_VALIDATED",
      "ASSUMPTION_INVALIDATED",
      "EVIDENCE_ASSESSED",
      "COUNTER_EVIDENCE_FOUND",
      "TRADEOFF_ANALYZED",
      "JUDGMENT_GENERATED",
      "REFLECTION_CREATED",
      "CONFIDENCE_RECALIBRATED"
    ],
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
