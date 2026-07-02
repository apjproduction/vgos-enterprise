import { getEnterpriseState, type EnterpriseState } from "@/lib/enterprise-state";
import type { PlatformState, Priority } from "@/lib/vgos-data";

export type FounderNarrative = {
  greeting: string;
  summary: string;
  yesterday: string;
  today: string;
  recommendation: string;
  expectedOutcome: string;
};

export type FounderDailyWin = {
  title: string;
  mission: string;
  outcome: string;
};

export type FounderPriority = {
  id: string;
  title: string;
  relatedMission: string;
  estimatedEffort: string;
  expectedImpact: string;
  confidence: number;
  href: string;
};

export type FounderDecision = {
  id: string;
  situation: string;
  recommendation: string;
  confidence: number;
  reason: string;
  alternatives: string[];
  href: string;
};

export type FounderPulseIndicator = {
  label: "Momentum" | "Execution" | "Growth" | "Learning" | "Founder Capacity" | "Enterprise Fitness";
  status: string;
  tone: "strong" | "steady" | "watch" | "risk";
};

export type FounderRadarItem = {
  area: "VidMaker" | "VGOS / Founder OS" | "Growth" | "Engineering" | "Marketing" | "Knowledge";
  status: string;
  note: string;
};

export type FounderOpportunity = {
  id: string;
  opportunity: string;
  whyItMatters: string;
  expectedImpact: string;
  cta: string;
  href: string;
};

export type FounderRisk = {
  id: string;
  risk: string;
  severity: Priority;
  mitigation: string;
};

export type FounderNextAction = {
  label: string;
  detail: string;
  href: string;
};

export type FounderReflectionPrompt = {
  question: string;
  placeholder: string;
};

export type FounderWorkspaceData = {
  narrative: FounderNarrative;
  dailyWin: FounderDailyWin;
  priorities: [FounderPriority, FounderPriority, FounderPriority];
  decisions: FounderDecision[];
  pulse: FounderPulseIndicator[];
  radar: FounderRadarItem[];
  opportunities: FounderOpportunity[];
  risks: FounderRisk[];
  nextAction: FounderNextAction;
  reflection: FounderReflectionPrompt[];
};

function isEnterpriseState(state?: EnterpriseState | PlatformState): state is EnterpriseState {
  return Boolean(state && "enterpriseId" in state && "health" in state && "focus" in state);
}

export function mapEnterpriseStateToFounderWorkspace(state: EnterpriseState): FounderWorkspaceData {
  return {
    narrative: state.narrative,
    dailyWin: state.dailyWin,
    priorities: state.priorities,
    decisions: state.decisions.slice(0, 3),
    pulse: state.pulse.map(({ label, status, tone }) => ({ label, status, tone })),
    radar: state.radar,
    opportunities: state.opportunities.slice(0, 3),
    risks: state.risks.slice(0, 3),
    nextAction: state.nextAction,
    reflection: state.reflection
  };
}

export function getFounderWorkspaceData(
  state?: EnterpriseState | PlatformState,
  workspaceId?: string
): FounderWorkspaceData {
  const enterpriseState = isEnterpriseState(state) ? state : getEnterpriseState(state, workspaceId);
  return mapEnterpriseStateToFounderWorkspace(enterpriseState);
}
