import type {
  Milestone,
  Plan,
  PlanConstraint,
  PlanDependency,
  PlanItem,
  PredictedOutcome,
  ResourceCapacity
} from "@/lib/vgos-data";

export type PlanningContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type PlanBundle = {
  plan: Plan;
  milestones: Milestone[];
  items: PlanItem[];
  dependencies: PlanDependency[];
  constraints: PlanConstraint[];
  predictedOutcomes: PredictedOutcome[];
};

export type PlanHealth = {
  score: number;
  status: "HEALTHY" | "AT_RISK" | "BLOCKED";
  blockedItems: PlanItem[];
  overdueItems: PlanItem[];
  constraintCount: number;
  rationale: string;
};

export type CapacityAllocation = {
  owner: string;
  weeklyHours: number;
  allocatedEffort: number;
  remainingHours: number;
  overloaded: boolean;
  items: PlanItem[];
};

export type PlanningInput = {
  title: string;
  description: string;
  owner?: string;
  objectiveId?: string;
  sourceType?: string;
  sourceId?: string;
};

export type ResourcePlan = {
  capacities: ResourceCapacity[];
  allocations: CapacityAllocation[];
};

