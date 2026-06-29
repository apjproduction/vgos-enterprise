import type { ExecutionItem, Measurement, Mission, Objective, Plan } from "@/lib/vgos-data";
import type { MissionContext, MissionRelatedRecords } from "@/kernel/missions/mission-types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
}

function statusProgress(status?: string) {
  if (!status) return 0;
  if (["COMPLETED", "PUBLISHED", "LIVE", "APPROVED", "IMPLEMENTED"].includes(status)) return 100;
  if (["IN_PROGRESS", "ACTIVE", "IN_REVIEW"].includes(status)) return 65;
  if (["READY", "SUBMITTED", "RESEARCHING"].includes(status)) return 45;
  if (["DRAFT", "NOT_STARTED", "QUEUED", "REQUESTED"].includes(status)) return 20;
  if (["BLOCKED", "FAILED", "AT_RISK"].includes(status)) return 15;
  return 30;
}

export function calculateObjectiveProgress(objectives: Objective[]) {
  return clampScore(average(objectives.map((objective) => statusProgress(objective.status))));
}

export function calculatePlanProgress(plans: Plan[]) {
  return clampScore(average(plans.map((plan) => statusProgress(plan.status))));
}

export function calculateExecutionProgress(executions: ExecutionItem[]) {
  return clampScore(average(executions.map((execution) => statusProgress(execution.status))));
}

export function calculateMeasurementProgress(measurements: Measurement[]) {
  if (measurements.length === 0) return 0;
  const positiveMovement = measurements.filter((measurement) => (measurement.changeValue ?? 0) > 0).length;
  return clampScore((positiveMovement / Math.max(measurements.length, 1)) * 100);
}

export function calculateCompletion(related: Pick<MissionRelatedRecords, "objectives" | "plans" | "executions" | "measurements">) {
  return clampScore(
    calculateObjectiveProgress(related.objectives) * 0.25 +
      calculatePlanProgress(related.plans) * 0.25 +
      calculateExecutionProgress(related.executions) * 0.35 +
      calculateMeasurementProgress(related.measurements) * 0.15
  );
}

export function updateMissionProgress(
  mission: Mission,
  related: Pick<MissionRelatedRecords, "objectives" | "plans" | "executions" | "measurements">,
  context?: Partial<MissionContext>
): Mission {
  const completionScore = calculateCompletion(related);
  const now = context?.now ?? new Date().toISOString();
  return {
    ...mission,
    completionScore,
    status: completionScore >= 100 ? "COMPLETED" : mission.status,
    completedDate: completionScore >= 100 ? mission.completedDate ?? now : mission.completedDate,
    updatedAt: now
  };
}
