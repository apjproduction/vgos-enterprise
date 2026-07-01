import { createScopedId, orgId } from "@/lib/vgos-data";
import type { ExecutionItem, Mission, PlatformState, Priority, RecommendedAction } from "@/lib/vgos-data";
import type { DecisionSituation, DecisionSituationStatus, DecisionSituationType } from "@/kernel/deliberation/deliberation-types";

function nowIso() {
  return new Date().toISOString();
}

function inferSituationType(text: string): DecisionSituationType {
  const lower = text.toLowerCase();
  if (/blog|content|publish|post|faq/.test(lower)) return "CONTENT_DECISION";
  if (/demo|product|page|proof/.test(lower)) return "PRODUCT_DECISION";
  if (/channel|linkedin|product hunt|reddit|x|pinterest/.test(lower)) return "CHANNEL_DECISION";
  if (/capacity|resource|owner|founder/.test(lower)) return "RESOURCE_DECISION";
  if (/risk|pause|defer|blocked/.test(lower)) return "RISK_DECISION";
  if (/execution|work|queue|start/.test(lower)) return "EXECUTION_DECISION";
  if (/strategy|increase|decrease|focus/.test(lower)) return "STRATEGY_DECISION";
  return "PRIORITY_DECISION";
}

function inferUrgency(priority?: Priority, text = ""): Priority {
  if (priority === "CRITICAL" || /today|blocked|critical|urgent|capacity/i.test(text)) return "CRITICAL";
  if (priority === "HIGH" || /this week|publish|launch|demo|proof/i.test(text)) return "HIGH";
  return priority ?? "MEDIUM";
}

export function createDecisionSituation(input: {
  workspaceId: string;
  organizationId?: string;
  title: string;
  description: string;
  situationType?: DecisionSituationType;
  status?: DecisionSituationStatus;
  urgency?: Priority;
  sourceType?: string | null;
  sourceId?: string | null;
  missionId?: string | null;
  objectiveId?: string | null;
}): DecisionSituation {
  const date = nowIso();
  const text = `${input.title} ${input.description}`;
  return {
    id: createScopedId("decision-situation"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    description: input.description,
    situationType: input.situationType ?? inferSituationType(text),
    status: input.status ?? "OPEN",
    urgency: input.urgency ?? inferUrgency(undefined, text),
    sourceType: input.sourceType ?? null,
    sourceId: input.sourceId ?? null,
    missionId: input.missionId ?? null,
    objectiveId: input.objectiveId ?? null,
    createdAt: date,
    updatedAt: date
  };
}

export function createSituationFromRecommendation(action: RecommendedAction, mission?: Mission): DecisionSituation {
  return createDecisionSituation({
    workspaceId: action.workspaceId,
    organizationId: action.organizationId,
    title: `Should VGOS commit to ${action.title}?`,
    description: `${action.expectedImpact} VGOS should compare this recommendation against alternatives before committing capacity.`,
    sourceType: "RecommendedAction",
    sourceId: action.id,
    missionId: mission?.id ?? null,
    objectiveId: action.objectiveId ?? null,
    urgency: action.priority,
    situationType: inferSituationType(action.title)
  });
}

export function createSituationFromMissionRisk(mission: Mission): DecisionSituation {
  return createDecisionSituation({
    workspaceId: mission.workspaceId,
    organizationId: mission.organizationId,
    title: `How should VGOS respond to ${mission.title} risk?`,
    description: `${mission.title} has ${mission.riskScore}% risk. VGOS should deliberate before changing priority or capacity.`,
    sourceType: "Mission",
    sourceId: mission.id,
    missionId: mission.id,
    urgency: inferUrgency(mission.priority, mission.description),
    situationType: "RISK_DECISION"
  });
}

export function createSituationFromWorkQueueConflict(items: ExecutionItem[]): DecisionSituation | null {
  if (items.length < 2) return null;
  const top = items.slice(0, 3);
  const first = top[0];
  return createDecisionSituation({
    workspaceId: first.workspaceId,
    organizationId: first.organizationId,
    title: `How should VGOS use today's limited execution capacity?`,
    description: `Capacity conflict between ${top.map((item) => item.title).join(", ")}. VGOS should deliberate instead of simply ranking all work.`,
    sourceType: "WorkQueue",
    sourceId: top.map((item) => item.id).join(","),
    missionId: null,
    objectiveId: first.objectiveId ?? null,
    urgency: top.some((item) => item.priority === "CRITICAL") ? "CRITICAL" : "HIGH",
    situationType: "RESOURCE_DECISION"
  });
}

export function createSituationFromSignal(input: {
  workspaceId: string;
  organizationId?: string;
  title: string;
  summary: string;
  sourceType: string;
  sourceId: string;
  priority?: Priority;
}): DecisionSituation {
  return createDecisionSituation({
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    title: input.title,
    description: input.summary,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    urgency: inferUrgency(input.priority, `${input.title} ${input.summary}`),
    situationType: inferSituationType(`${input.title} ${input.summary}`)
  });
}

export function updateSituationStatus(situation: DecisionSituation, status: DecisionSituationStatus): DecisionSituation {
  return { ...situation, status, updatedAt: nowIso() };
}

export function getOpenSituations(state: PlatformState, workspaceId: string): DecisionSituation[] {
  return state.decisionSituations
    .filter((item) => item.workspaceId === workspaceId && ["OPEN", "DELIBERATING"].includes(item.status))
    .sort((a, b) => priorityRank(a.urgency) - priorityRank(b.urgency));
}

export function getHighUrgencySituations(state: PlatformState, workspaceId: string): DecisionSituation[] {
  return getOpenSituations(state, workspaceId).filter((item) => item.urgency === "CRITICAL" || item.urgency === "HIGH");
}

function priorityRank(priority?: Priority) {
  return { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }[priority ?? "LOW"] ?? 4;
}
