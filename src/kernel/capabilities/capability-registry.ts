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
    id: "enterprise-state-foundation",
    name: "Enterprise State Foundation",
    description: "Defines EnterpriseState as the canonical operating state that Founder OS renders without adding a new intelligence engine.",
    version: "1.0.0",
    inputs: [
      "Missions",
      "Decisions",
      "Priorities",
      "Reflections",
      "Recommendations",
      "Advisor Outputs",
      "Deliberations"
    ],
    outputs: [
      "EnterpriseState",
      "Founder Workspace Data",
      "Founder Operating Snapshot"
    ],
    dependencies: [
      "Executive Intelligence Experience",
      "Deliberation Layer",
      "Mission Engine",
      "Execution Engine"
    ],
    eventsConsumed: [
      "MISSION_UPDATED",
      "HIGH_IMPACT_ACTION_SELECTED",
      "EXECUTION_BLOCKED",
      "LEARNING_CREATED",
      "REFLECTION_CREATED"
    ],
    eventsProduced: [],
    status: "ACTIVE"
  },
  {
    id: "enterprise-events-foundation",
    name: "Enterprise Events Foundation",
    description: "Defines EnterpriseEvent as the lightweight bridge from real operational signals into event-informed EnterpriseState and Founder OS.",
    version: "1.0.0",
    inputs: [
      "GitHub Signals",
      "Vercel Signals",
      "Founder Reflections",
      "Mission Updates",
      "Decisions",
      "Content Activity",
      "Product Activity",
      "Customer Feedback"
    ],
    outputs: [
      "EnterpriseEvent",
      "Demo Enterprise Event Feed",
      "Event-informed EnterpriseState",
      "Founder Event Timeline"
    ],
    dependencies: [
      "Enterprise State Foundation",
      "Founder OS",
      "Runtime",
      "Connected Intelligence"
    ],
    eventsConsumed: [
      "GITHUB_COMMIT_CREATED",
      "GITHUB_PULL_REQUEST_OPENED",
      "GITHUB_PULL_REQUEST_MERGED",
      "VERCEL_DEPLOYMENT_CREATED",
      "VERCEL_DEPLOYMENT_SUCCEEDED",
      "VERCEL_DEPLOYMENT_FAILED",
      "FOUNDER_REFLECTION_SUBMITTED",
      "MISSION_UPDATED",
      "DECISION_ACCEPTED",
      "DECISION_POSTPONED",
      "CONTENT_PUBLISHED",
      "PRODUCT_DEMO_COMPLETED",
      "CUSTOMER_FEEDBACK_RECEIVED"
    ],
    eventsProduced: [],
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
      "Judgment Records",
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
      "JUDGMENT_CREATED",
      "REFLECTION_CREATED",
      "RECOMMENDATION_RECALIBRATED"
    ],
    status: "BETA"
  },
  {
    id: "deliberation-layer",
    name: "Deliberation Layer",
    description: "Forces VGOS to identify decision situations, generate options, score tradeoffs, challenge choices, commit deliberately, and review outcomes before changing capacity or strategy.",
    version: "1.0.0",
    inputs: ["Decision Situations", "Recommendations", "Missions", "Execution Items", "Evidence", "Reflections"],
    outputs: [
      "Decision Options",
      "Option Evaluations",
      "Option Challenges",
      "Deliberations",
      "Decision Commitments",
      "Decision Reviews"
    ],
    dependencies: [
      "Reflective Cognition & Executive Wisdom",
      "Executive Intelligence Experience",
      "Mission Engine",
      "Execution Engine",
      "Measurement & Learning Engine"
    ],
    eventsConsumed: [
      "HIGH_IMPACT_ACTION_SELECTED",
      "MISSION_HEALTH_CHANGED",
      "EXECUTION_BLOCKED",
      "LEARNING_CREATED",
      "REFLECTION_CREATED"
    ],
    eventsProduced: [
      "DECISION_SITUATION_CREATED",
      "DECISION_OPTION_CREATED",
      "OPTION_EVALUATED",
      "OPTION_CHALLENGED",
      "DELIBERATION_STARTED",
      "DELIBERATION_COMPLETED",
      "DECISION_COMMITTED",
      "DECISION_DEFERRED",
      "DECISION_REVIEWED"
    ],
    status: "ACTIVE"
  },
  {
    id: "belief-claim-decision-validation",
    name: "Belief, Claim & Decision Validation",
    description: "Connects evidence to claims, claims to beliefs, and beliefs to decision validation so VGOS can explain what it believes and whether recommendations are supported.",
    version: "1.0.0",
    inputs: ["Evidence", "Claims", "Beliefs", "Recommendations", "Decisions", "Reflections"],
    outputs: [
      "Claims",
      "Claim Evidence",
      "Beliefs",
      "Belief Revisions",
      "Decision Validations",
      "Reality Model"
    ],
    dependencies: [
      "Reflective Cognition & Executive Wisdom",
      "Deliberation Layer",
      "Executive Intelligence Experience",
      "Recommendation Engine"
    ],
    eventsConsumed: [
      "EVIDENCE_ADDED",
      "REFLECTION_CREATED",
      "DECISION_COMMITTED",
      "DECISION_REVIEWED",
      "HIGH_IMPACT_ACTION_SELECTED"
    ],
    eventsProduced: [
      "CLAIM_CREATED",
      "CLAIM_VALIDATED",
      "CLAIM_CHALLENGED",
      "CLAIM_INVALIDATED",
      "BELIEF_CREATED",
      "BELIEF_UPDATED",
      "BELIEF_CHALLENGED",
      "BELIEF_REVISED",
      "DECISION_VALIDATED",
      "REALITY_MODEL_UPDATED"
    ],
    status: "ACTIVE"
  },
  {
    id: "outcome-attribution-learning-loop",
    name: "Outcome Attribution & Learning Loop Integrity",
    description: "Attributes outcomes, evaluates learning-loop completeness, and updates claims, capabilities, reflections, and organizational state without overstating causality.",
    version: "1.3.0-alpha",
    inputs: ["Outcomes", "Commitments", "Decisions", "Evidence", "Reflections", "Claims", "Capabilities"],
    outputs: [
      "Outcome Evaluations",
      "Outcome Attributions",
      "Learning Loop Integrity Scores",
      "Claim Impacts",
      "Capability Impacts",
      "Learning Artifacts"
    ],
    dependencies: [
      "Organizational VM Kernel",
      "Deliberation & Decision Quality",
      "Commitment Risk & Execution Integrity",
      "Measurement & Learning Engine",
      "Executive Intelligence Experience"
    ],
    eventsConsumed: [
      "OUTCOME_RECORDED",
      "EXECUTION_COMPLETED",
      "DECISION_REVIEWED",
      "REFLECTION_CREATED"
    ],
    eventsProduced: [
      "OUTCOME_EVALUATED",
      "OUTCOME_ATTRIBUTED",
      "CLAIM_IMPACT_RECORDED",
      "CAPABILITY_IMPACT_RECORDED",
      "LEARNING_ARTIFACT_CREATED"
    ],
    status: "BETA"
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
