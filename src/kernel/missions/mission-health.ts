import type { MissionRelatedRecords } from "@/kernel/missions/mission-types";
import { calculateCompletion } from "@/kernel/missions/mission-progress";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
}

export function calculateConfidence(related: Partial<MissionRelatedRecords>) {
  const values = [
    ...(related.learnings ?? []).map((learning) => learning.confidenceScore * 100),
    ...(related.summaries ?? []).map((summary) => summary.confidence * 100),
    ...(related.recommendedActions ?? []).map((action) => (action.priority === "CRITICAL" ? 88 : action.priority === "HIGH" ? 76 : 62))
  ];
  return clampScore(values.length ? average(values) : ((related.mission?.confidenceScore ?? 0.72) * 100));
}

export function calculateVelocity(related: Pick<MissionRelatedRecords, "mission" | "executions" | "measurements">) {
  const completedExecutions = related.executions.filter((item) => item.status === "COMPLETED").length;
  const activeExecutions = related.executions.filter((item) => ["READY", "IN_PROGRESS", "APPROVED"].includes(item.status)).length;
  const recentMeasurements = related.measurements.filter(
    (item) => new Date(item.measuredAt).getTime() >= Date.now() - 14 * 24 * 60 * 60 * 1000
  ).length;
  return clampScore(completedExecutions * 18 + activeExecutions * 10 + recentMeasurements * 8 + related.mission.completionScore * 0.25);
}

export function calculateRisk(related: Pick<MissionRelatedRecords, "mission" | "plans" | "executions" | "measurements">) {
  const blockedExecutions = related.executions.filter((item) => item.status === "BLOCKED").length;
  const blockedPlans = related.plans.filter((item) => item.status === "PAUSED").length;
  const negativeMeasurements = related.measurements.filter((item) => (item.changeValue ?? 0) < 0).length;
  const targetDate = new Date(related.mission.targetDate).getTime();
  const daysRemaining = Math.ceil((targetDate - Date.now()) / (24 * 60 * 60 * 1000));
  const scheduleRisk = daysRemaining < 0 ? 30 : daysRemaining < 7 ? 18 : daysRemaining < 14 ? 10 : 0;
  const stalledRisk = related.mission.velocityScore < 45 ? 15 : 0;
  return clampScore(blockedExecutions * 14 + blockedPlans * 12 + negativeMeasurements * 8 + scheduleRisk + stalledRisk);
}

export function calculateHealth(related: MissionRelatedRecords) {
  const completion = calculateCompletion(related);
  const confidence = calculateConfidence(related);
  const velocity = calculateVelocity(related);
  const risk = calculateRisk(related);
  return clampScore(completion * 0.3 + confidence * 0.25 + velocity * 0.25 + (100 - risk) * 0.2);
}

export function getHealthColor(score: number) {
  if (score >= 80) return "green";
  if (score >= 65) return "blue";
  if (score >= 45) return "amber";
  return "red";
}
