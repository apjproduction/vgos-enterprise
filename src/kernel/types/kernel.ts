export type KernelStatus = "idle" | "running" | "completed" | "blocked";

export type KernelRunContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type KernelArtifactType =
  | "Memory"
  | "Pattern"
  | "ReasoningTrace"
  | "Objective"
  | "AgentRun"
  | "KnowledgeObject"
  | "KnowledgeRelationship"
  | "MemorySnapshot"
  | "Workflow"
  | "WorkflowRun"
  | "AgentHandoff"
  | "Plan"
  | "Milestone"
  | "PlanItem"
  | "PlanDependency"
  | "PlanConstraint"
  | "PredictedOutcome"
  | "ResourceCapacity"
  | "ExecutionItem"
  | "ExecutionEvidence"
  | "ExecutionBlocker"
  | "ApprovalRequest"
  | "ExecutionResult"
  | "Metric"
  | "Measurement"
  | "Learning"
  | "Attribution"
  | "StrategyAdjustment"
  | "AIRecommendation"
  | "RecommendedAction"
  | "Event";
