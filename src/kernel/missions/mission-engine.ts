import { createScopedId, orgId, type Mission } from "@/lib/vgos-data";
import { calculateConfidence, calculateHealth, calculateRisk, calculateVelocity } from "@/kernel/missions/mission-health";
import { calculateCompletion } from "@/kernel/missions/mission-progress";
import type { MissionContext, MissionInput, MissionOverview, MissionRelatedRecords, MissionState } from "@/kernel/missions/mission-types";

function addDays(days: number, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function createMission(input: MissionInput, context: MissionContext): Mission {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("mission"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    title: input.title,
    description: input.description,
    missionType: input.missionType ?? "GROWTH",
    owner: input.owner ?? "Growth",
    priority: input.priority ?? "HIGH",
    status: "DRAFT",
    healthScore: 70,
    confidenceScore: 0.72,
    velocityScore: 40,
    completionScore: 0,
    riskScore: 30,
    startDate: input.startDate ?? now,
    targetDate: input.targetDate ?? addDays(30, new Date(now)),
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now
  };
}

export function updateMission(mission: Mission, updates: Partial<Mission>, context?: Partial<MissionContext>): Mission {
  return {
    ...mission,
    ...updates,
    updatedAt: context?.now ?? new Date().toISOString()
  };
}

export function archiveMission(mission: Mission, context?: Partial<MissionContext>): Mission {
  return updateMission(mission, { status: "ARCHIVED" }, context);
}

export function completeMission(mission: Mission, context?: Partial<MissionContext>): Mission {
  const now = context?.now ?? new Date().toISOString();
  return updateMission(
    mission,
    {
      status: "COMPLETED",
      completionScore: 100,
      completedDate: mission.completedDate ?? now
    },
    { ...context, now }
  );
}

export function calculateMissionCompletion(related: Pick<MissionRelatedRecords, "objectives" | "plans" | "executions" | "measurements">) {
  return calculateCompletion(related);
}

export function calculateMissionHealth(related: MissionRelatedRecords) {
  return calculateHealth(related);
}

export function calculateMissionVelocity(related: Pick<MissionRelatedRecords, "mission" | "executions" | "measurements">) {
  return calculateVelocity(related);
}

export function calculateMissionRisk(related: Pick<MissionRelatedRecords, "mission" | "plans" | "executions" | "measurements">) {
  return calculateRisk(related);
}

export function getMissionOverview(state: MissionState, missionId: string): MissionOverview | null {
  const mission = state.missions.find((item) => item.id === missionId);
  if (!mission) return null;

  const objectiveIds = new Set(state.missionObjectives.filter((item) => item.missionId === missionId).map((item) => item.objectiveId));
  const planIds = new Set(state.missionPlans.filter((item) => item.missionId === missionId).map((item) => item.planId));
  const executionIds = new Set(state.missionExecutions.filter((item) => item.missionId === missionId).map((item) => item.executionItemId));
  const learningIds = new Set(state.missionLearnings.filter((item) => item.missionId === missionId).map((item) => item.learningId));
  const metricIds = new Set(state.missionMetrics.filter((item) => item.missionId === missionId).map((item) => item.metricId));

  const related: MissionRelatedRecords = {
    mission,
    objectives: state.objectives.filter((item) => objectiveIds.has(item.id)),
    plans: state.plans.filter((item) => planIds.has(item.id)),
    executions: state.executionItems.filter((item) => executionIds.has(item.id)),
    metrics: state.metrics.filter((item) => metricIds.has(item.id)),
    measurements: state.measurements.filter((item) => metricIds.has(item.metricId) || planIds.has(item.planId ?? "")),
    learnings: state.learnings.filter((item) => learningIds.has(item.id)),
    summaries: state.missionSummaries.filter((item) => item.missionId === missionId),
    recommendedActions: state.recommendedActions.filter(
      (item) => objectiveIds.has(item.objectiveId ?? "") || planIds.has(item.sourceId) || item.title.toLowerCase().includes(mission.title.toLowerCase().split(" ")[0])
    ),
    strategyAdjustments: state.strategyAdjustments.filter(
      (item) => objectiveIds.has(item.objectiveId ?? "") || planIds.has(item.planId ?? "")
    )
  };

  const latestSummary = [...related.summaries].sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];

  return {
    ...related,
    completionScore: calculateMissionCompletion(related),
    healthScore: calculateMissionHealth(related),
    velocityScore: calculateMissionVelocity(related),
    riskScore: calculateMissionRisk(related),
    confidenceScore: calculateConfidence(related),
    latestSummary
  };
}
