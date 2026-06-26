import type { Objective, Pattern, PlatformState, RecommendedAction } from "@/lib/vgos-data";
import { normalizeScore, scorePriority, scoreStatus, scoreUrgency } from "@/kernel/scoring/kernel-scoring";
import { evaluateObjectiveProgress } from "@/kernel/goals/goal-engine";

export type RankedAction = RecommendedAction & {
  impactScore: number;
  linkedObjective?: Objective;
  linkedPattern?: Pattern;
  reasoningSummary: string;
};

export function calculateImpactScore(input: {
  action: RecommendedAction;
  objective?: Objective;
  pattern?: Pattern;
  confidenceScore?: number;
}) {
  const objectiveBoost = input.objective ? scorePriority(input.objective.priority) : 8;
  const patternBoost = input.pattern ? input.pattern.importanceScore * 0.28 + input.pattern.frequency : 8;
  const confidenceBoost = (input.confidenceScore ?? input.pattern?.confidenceScore ?? 0.72) * 20;
  return normalizeScore(
    scorePriority(input.action.priority) +
      scoreUrgency(input.action.dueDate) +
      scoreStatus(input.action.status) +
      objectiveBoost +
      patternBoost +
      confidenceBoost
  );
}

export function explainPriorityRanking(action: RankedAction) {
  const objective = action.linkedObjective ? ` Linked objective: ${action.linkedObjective.title}.` : "";
  const pattern = action.linkedPattern ? ` Pattern: ${action.linkedPattern.title}.` : "";
  return `${action.title} is ranked at ${action.impactScore}/100 because of priority, urgency, confidence, and objective impact.${objective}${pattern}`;
}

export function rankRecommendedActions(state: PlatformState, workspaceId: string): RankedAction[] {
  return state.recommendedActions
    .filter((action) => action.workspaceId === workspaceId && action.status !== "COMPLETED" && action.status !== "DISMISSED")
    .map((action) => {
      const linkedObjective = state.objectives.find((objective) => objective.id === action.objectiveId);
      const linkedPattern = state.patterns.find((pattern) => pattern.id === action.patternId || pattern.id === action.sourceId);
      const impactScore = calculateImpactScore({ action, objective: linkedObjective, pattern: linkedPattern });
      return {
        ...action,
        impactScore,
        linkedObjective,
        linkedPattern,
        reasoningSummary: action.reasoning || "Ranked by the VGOS Intelligence Kernel."
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore);
}

export function rankOpportunities(state: PlatformState, workspaceId: string) {
  return [
    ...state.patterns
      .filter((item) => item.workspaceId === workspaceId)
      .map((item) => ({
        id: item.id,
        title: item.title,
        sourceType: "Pattern",
        score: normalizeScore(item.importanceScore + item.frequency + item.confidenceScore * 10)
      })),
    ...state.memories
      .filter((item) => item.workspaceId === workspaceId)
      .map((item) => ({
        id: item.id,
        title: item.topic,
        sourceType: "Memory",
        score: normalizeScore(item.importanceScore + item.frequency + item.confidenceScore * 10)
      }))
  ].sort((a, b) => b.score - a.score);
}

export function selectTopDailyPriorities(state: PlatformState, workspaceId: string, limit = 5) {
  return rankRecommendedActions(state, workspaceId).slice(0, limit);
}

export function selectTopWeeklyPriorities(state: PlatformState, workspaceId: string, limit = 8) {
  return rankRecommendedActions(state, workspaceId)
    .filter((action) => {
      if (!action.dueDate) return true;
      const days = Math.ceil((new Date(action.dueDate).getTime() - Date.now()) / 86400000);
      return days <= 7;
    })
    .slice(0, limit);
}

export function summarizeObjectiveProgress(state: PlatformState, workspaceId: string) {
  return state.objectives
    .filter((objective) => objective.workspaceId === workspaceId)
    .map((objective) => ({
      objective,
      progress: evaluateObjectiveProgress(objective, state.keyResults)
    }))
    .sort((a, b) => b.progress - a.progress);
}
