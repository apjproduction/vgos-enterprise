import { createScopedId } from "@/lib/vgos-data";
import type { MissionInsight, MissionRecommendation, MissionRelatedRecords } from "@/kernel/missions/mission-types";

export function calculateMissionMomentum(related: MissionRelatedRecords) {
  const completed = related.executions.filter((item) => item.status === "COMPLETED").length;
  const active = related.executions.filter((item) => ["READY", "IN_PROGRESS", "APPROVED"].includes(item.status)).length;
  const learnings = related.learnings.length;
  return Math.min(100, Math.round(completed * 16 + active * 9 + learnings * 6 + related.mission.velocityScore * 0.3));
}

export function detectMissionStagnation(related: MissionRelatedRecords) {
  return related.mission.velocityScore < 45 || related.executions.every((item) => item.status !== "IN_PROGRESS" && item.status !== "READY");
}

export function generateMissionInsights(related: MissionRelatedRecords): MissionInsight[] {
  const insights: MissionInsight[] = [];
  if (related.mission.riskScore >= 45) {
    insights.push({
      id: createScopedId("mission-insight"),
      title: "Mission risk is elevated",
      description: "Risk score is high enough to require owner review and a shorter execution loop.",
      severity: "CRITICAL"
    });
  }
  if (detectMissionStagnation(related)) {
    insights.push({
      id: createScopedId("mission-insight"),
      title: "Mission velocity is slowing",
      description: "No active execution queue is visible, or velocity has dropped below the healthy threshold.",
      severity: "HIGH"
    });
  }
  if (related.measurements.length === 0) {
    insights.push({
      id: createScopedId("mission-insight"),
      title: "Mission lacks measurement",
      description: "Attach at least one metric and measurement so the mission can learn from execution.",
      severity: "MEDIUM"
    });
  }
  return insights;
}

export function recommendMissionChanges(related: MissionRelatedRecords): MissionRecommendation[] {
  const recommendations: MissionRecommendation[] = [];
  if (related.mission.riskScore >= 45) {
    recommendations.push({
      id: createScopedId("mission-recommendation"),
      title: "Create recovery execution",
      action: "Add one owner-assigned execution item due this week.",
      priority: "CRITICAL",
      reasoning: "High mission risk should be converted into a concrete near-term action."
    });
  }
  if (related.metrics.length === 0) {
    recommendations.push({
      id: createScopedId("mission-recommendation"),
      title: "Attach mission metric",
      action: "Link the mission to one primary outcome metric.",
      priority: "HIGH",
      reasoning: "Mission health cannot become reliable until measurement is attached."
    });
  }
  if (related.learnings.length > 0 && related.strategyAdjustments.length === 0) {
    recommendations.push({
      id: createScopedId("mission-recommendation"),
      title: "Convert learning into strategy adjustment",
      action: "Review the strongest learning and decide whether the mission needs a strategy change.",
      priority: "HIGH",
      reasoning: "Learning should feed back into mission strategy, not sit as passive notes."
    });
  }
  return recommendations;
}

export function generateMissionRecommendations(related: MissionRelatedRecords) {
  return recommendMissionChanges(related);
}
