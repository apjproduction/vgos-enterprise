import type { KeyResult, Objective, RecommendedAction } from "@/lib/vgos-data";

export function getActiveObjectives(objectives: Objective[]) {
  return objectives
    .filter((objective) => objective.status === "IN_PROGRESS" || objective.status === "RESEARCHING")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

export function linkActionToObjective(action: RecommendedAction, objectiveId: string): RecommendedAction {
  return {
    ...action,
    objectiveId,
    updatedAt: new Date().toISOString()
  };
}

export function evaluateObjectiveProgress(objective: Objective, keyResults: KeyResult[]) {
  const related = keyResults.filter((item) => item.objectiveId === objective.id);
  const progress =
    related.reduce((total, item) => total + Math.min(1, item.currentValue / Math.max(item.targetValue, 1)), 0) /
    Math.max(related.length, 1);
  return Math.round(progress * 100);
}

export function calculateObjectiveHealth(objective: Objective, keyResults: KeyResult[]) {
  const progress = evaluateObjectiveProgress(objective, keyResults);
  if (objective.priority === "CRITICAL" && progress < 35) return "AT_RISK";
  if (progress >= 75) return "ON_TRACK";
  if (progress >= 35) return "WATCH";
  return "AT_RISK";
}

export function suggestActionsForObjective(objective: Objective, actions: RecommendedAction[]) {
  return actions
    .filter((action) => action.objectiveId === objective.id || action.title.toLowerCase().includes(objective.title.toLowerCase().split(" ")[0]))
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 5);
}

function priorityRank(priority: Objective["priority"]) {
  if (priority === "CRITICAL") return 0;
  if (priority === "HIGH") return 1;
  if (priority === "MEDIUM") return 2;
  return 3;
}
