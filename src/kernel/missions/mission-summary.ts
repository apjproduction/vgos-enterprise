import { createScopedId } from "@/lib/vgos-data";
import type { MissionSummary } from "@/lib/vgos-data";
import type { MissionContext, MissionRelatedRecords } from "@/kernel/missions/mission-types";

export function generateMissionSummary(related: MissionRelatedRecords, context: MissionContext): MissionSummary {
  const now = context.now ?? new Date().toISOString();
  const completedExecutions = related.executions.filter((item) => item.status === "COMPLETED").length;
  const blockedExecutions = related.executions.filter((item) => item.status === "BLOCKED").length;
  const latestLearning = related.learnings[0]?.title ?? "No learning captured yet";

  return {
    id: createScopedId("mission-summary"),
    missionId: related.mission.id,
    workspaceId: context.workspaceId,
    summary: `${related.mission.title} is ${related.mission.completionScore}% complete with ${completedExecutions} completed execution items and ${blockedExecutions} blockers.`,
    reasoning: `Latest learning: ${latestLearning}. Health is ${related.mission.healthScore}, confidence is ${Math.round(related.mission.confidenceScore * 100)}%, and risk is ${related.mission.riskScore}.`,
    generatedAt: now,
    confidence: related.mission.confidenceScore
  };
}

export function generateExecutiveSummary(related: MissionRelatedRecords) {
  return `${related.mission.title}: ${related.mission.status.toLowerCase()} at ${related.mission.completionScore}% completion, ${related.mission.healthScore}% health, and ${related.mission.riskScore}% risk.`;
}

export function generateFounderBrief(related: MissionRelatedRecords) {
  const priorityAction = related.recommendedActions[0]?.title ?? "Review next recommended action";
  return `${related.mission.title} needs ${priorityAction}. Current note: ${related.mission.notes}`;
}
