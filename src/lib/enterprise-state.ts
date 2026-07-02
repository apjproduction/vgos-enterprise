import { buildAdvisorContext, generateDailyBrief } from "@/kernel/advisor/advisor-engine";
import { selectTopDailyPriorities } from "@/kernel/decisions/decision-engine";
import { getOpenSituations } from "@/kernel/deliberation/decision-situation-engine";
import { deliberate } from "@/kernel/deliberation/deliberation-engine";
import {
  initialPlatformState,
  workspaceId as defaultWorkspaceId,
  type PlatformState,
  type Priority
} from "@/lib/vgos-data";

export type EnterpriseNarrative = {
  greeting: string;
  summary: string;
  yesterday: string;
  today: string;
  recommendation: string;
  expectedOutcome: string;
};

export type EnterpriseHealth = {
  score: number;
  status: "strong" | "steady" | "watch" | "risk";
  summary: string;
  primaryConstraint: string;
};

export type EnterpriseFocus = {
  operatingMode: string;
  primaryMission: string;
  todayTheme: string;
  recommendation: string;
};

export type EnterprisePriority = {
  id: string;
  title: string;
  relatedMission: string;
  estimatedEffort: string;
  expectedImpact: string;
  confidence: number;
  href: string;
};

export type EnterpriseDecisionSummary = {
  id: string;
  situation: string;
  recommendation: string;
  confidence: number;
  reason: string;
  alternatives: string[];
  href: string;
};

export type EnterprisePulse = {
  label: "Momentum" | "Execution" | "Growth" | "Learning" | "Founder Capacity" | "Enterprise Fitness";
  score: number;
  status: string;
  tone: "strong" | "steady" | "watch" | "risk";
};

export type EnterpriseRadar = {
  area: "VidMaker" | "VGOS / Founder OS" | "Growth" | "Engineering" | "Marketing" | "Knowledge";
  status: string;
  note: string;
};

export type EnterpriseOpportunity = {
  id: string;
  opportunity: string;
  whyItMatters: string;
  expectedImpact: string;
  cta: string;
  href: string;
};

export type EnterpriseRisk = {
  id: string;
  risk: string;
  severity: Priority;
  mitigation: string;
};

export type EnterpriseNextAction = {
  label: string;
  detail: string;
  href: string;
};

export type EnterpriseReflectionPrompt = {
  question: string;
  placeholder: string;
};

export type EnterpriseState = {
  enterpriseId: string;
  enterpriseName: string;
  generatedAt: string;
  health: EnterpriseHealth;
  focus: EnterpriseFocus;
  narrative: EnterpriseNarrative;
  dailyWin: {
    title: string;
    mission: string;
    outcome: string;
  };
  priorities: [EnterprisePriority, EnterprisePriority, EnterprisePriority];
  decisions: EnterpriseDecisionSummary[];
  pulse: EnterprisePulse[];
  radar: EnterpriseRadar[];
  opportunities: EnterpriseOpportunity[];
  risks: EnterpriseRisk[];
  nextAction: EnterpriseNextAction;
  reflection: EnterpriseReflectionPrompt[];
};

function percent(value: number) {
  return Math.round(value * 100);
}

function formatMission(title?: string) {
  return title ?? "VidMaker growth";
}

function ensureThreePriorities(
  priorities: EnterprisePriority[]
): [EnterprisePriority, EnterprisePriority, EnterprisePriority] {
  const fallback: EnterprisePriority[] = [
    {
      id: "founder-priority-demo",
      title: "Complete the VidMaker Product Demo",
      relatedMission: "Product Page to Video Proof",
      estimatedEffort: "90 minutes",
      expectedImpact: "Unlocks Product Hunt replies, proof-led content, and stronger trust.",
      confidence: 86,
      href: "/work-queue"
    },
    {
      id: "founder-priority-proof-reply",
      title: "Reply to Product Hunt with proof",
      relatedMission: "Product Hunt Momentum",
      estimatedEffort: "45 minutes",
      expectedImpact: "Turns live attention into qualified product-page-to-video conversations.",
      confidence: 82,
      href: "/work-queue"
    },
    {
      id: "founder-priority-founder-post",
      title: "Reserve founder review for one proof narrative",
      relatedMission: "Founder Authority",
      estimatedEffort: "30 minutes",
      expectedImpact: "Uses founder trust while the category story is still fresh.",
      confidence: 81,
      href: "/work-queue"
    }
  ];

  return [...priorities, ...fallback].slice(0, 3) as [
    EnterprisePriority,
    EnterprisePriority,
    EnterprisePriority
  ];
}

function buildNarrative(state: PlatformState, workspaceId: string): EnterpriseNarrative {
  const brief = generateDailyBrief(state, workspaceId, "Tom Promise");
  const topMission = brief.missionHealth[0]?.mission.title ?? "VidMaker proof and launch momentum";
  const topPriority = brief.priorities[0]?.title ?? "Complete the VidMaker Product Demo";

  return {
    greeting: "Good morning, Tom.",
    summary:
      `We are in a proof-first operating day. ${topMission} is the center of gravity, and the founder workspace is keeping attention on the few moves that unlock trust, distribution, and learning.`,
    yesterday: brief.recentWins[0]?.title ?? "VGOS clarified the proof bottleneck and the highest-leverage work.",
    today: topPriority,
    recommendation: "Finish the proof asset before widening promotion or adding more low-confidence work.",
    expectedOutcome: "A demo-backed story that makes the next Product Hunt reply, founder post, and content update easier to trust."
  };
}

function buildPriorities(
  state: PlatformState,
  workspaceId: string
): [EnterprisePriority, EnterprisePriority, EnterprisePriority] {
  const priorities = selectTopDailyPriorities(state, workspaceId, 5).map((action) => {
    const mission = state.missions.find((item) =>
      state.missionObjectives.some((link) => link.missionId === item.id && link.objectiveId === action.objectiveId)
    );

    return {
      id: action.id,
      title: action.title,
      relatedMission: formatMission(mission?.title),
      estimatedEffort: action.priority === "CRITICAL" ? "90 minutes" : action.priority === "HIGH" ? "45 minutes" : "30 minutes",
      expectedImpact: action.expectedImpact,
      confidence: percent(action.confidenceScore),
      href: "/work-queue"
    };
  });

  return ensureThreePriorities(priorities);
}

function buildDecisions(state: PlatformState, workspaceId: string): EnterpriseDecisionSummary[] {
  const open = getOpenSituations(state, workspaceId);
  const source = open.length ? open : state.decisionSituations.filter((item) => item.workspaceId === workspaceId);

  return source.slice(0, 3).map((situation) => {
    const result = deliberate(situation, state);
    const recommendation = result.recommendedOption?.title ?? "Wait for stronger evidence";
    const score = result.recommendedOption
      ? result.evaluations.find((item) => item.optionId === result.recommendedOption?.id)?.overallScore ?? 0
      : Math.round(result.deliberation.confidenceScore * 100);

    return {
      id: situation.id,
      situation: situation.title,
      recommendation,
      confidence: Math.max(score, Math.round(result.deliberation.confidenceScore * 100)),
      reason: result.deliberation.finalJudgment,
      alternatives: result.rejectedOptions.map((option) => option.title).slice(0, 3),
      href: "/decisions"
    };
  });
}

function pulseTone(score: number): EnterprisePulse["tone"] {
  if (score >= 80) return "strong";
  if (score >= 65) return "steady";
  if (score >= 45) return "watch";
  return "risk";
}

function buildPulse(state: PlatformState, workspaceId: string): EnterprisePulse[] {
  const context = buildAdvisorContext(state, workspaceId);
  const activeMissions = state.missions.filter((item) => item.workspaceId === workspaceId && ["ACTIVE", "AT_RISK"].includes(item.status));
  const averageHealth = Math.round(activeMissions.reduce((sum, mission) => sum + mission.healthScore, 0) / Math.max(activeMissions.length, 1));
  const readyExecution = context.readyExecutions.length + context.completedToday.length * 2 - context.blockedExecutions.length;
  const executionScore = readyExecution >= 2 ? 74 : 52;
  const growthScore = context.measurements.some((item) => (item.changeValue ?? 0) > 0) ? 78 : 64;
  const learningScore = context.learnings[0] ? Math.round(context.learnings[0].confidenceScore * 100) : 64;
  const capacityScore = context.pendingApprovals.length > 2 ? 52 : 72;
  const enterpriseScore = Math.round((averageHealth + growthScore + learningScore + capacityScore) / 4);

  return [
    { label: "Momentum", score: averageHealth, status: averageHealth >= 70 ? "Moving" : "Needs focus", tone: pulseTone(averageHealth) },
    { label: "Execution", score: executionScore, status: readyExecution >= 2 ? "Ready" : "Constrained", tone: pulseTone(executionScore) },
    { label: "Growth", score: growthScore, status: growthScore >= 70 ? "Promising" : "Waiting on proof", tone: pulseTone(growthScore) },
    { label: "Learning", score: learningScore, status: learningScore >= 75 ? "Fresh signal" : "Needs more evidence", tone: pulseTone(learningScore) },
    { label: "Founder Capacity", score: capacityScore, status: capacityScore >= 70 ? "Protected" : "Tight", tone: pulseTone(capacityScore) },
    { label: "Enterprise Fitness", score: enterpriseScore, status: enterpriseScore >= 70 ? "Healthy enough" : "Sharpen today", tone: pulseTone(enterpriseScore) }
  ];
}

function buildRadar(state: PlatformState, workspaceId: string): EnterpriseRadar[] {
  const atRiskMission = state.missions.find((mission) => mission.workspaceId === workspaceId && mission.status === "AT_RISK");
  const demoBlocked = state.executionItems.some((item) => item.workspaceId === workspaceId && /demo/i.test(item.title) && item.status === "BLOCKED");
  const learning = state.learnings.find((item) => item.workspaceId === workspaceId);

  return [
    { area: "VidMaker", status: atRiskMission ? "Proof bottleneck" : "Focused", note: atRiskMission?.title ?? "Product-page-to-video remains the main story." },
    { area: "VGOS / Founder OS", status: "Live workspace", note: "Today is organized around one win, three priorities, and a decision queue." },
    { area: "Growth", status: "Launch attention", note: "Product Hunt and LinkedIn signals should be answered with visible proof." },
    { area: "Engineering", status: demoBlocked ? "Demo blocked" : "Demo path clear", note: demoBlocked ? "Unblock the proof asset before broad promotion." : "Keep demo work moving." },
    { area: "Marketing", status: "Founder-led", note: "Proof narratives are stronger than broad company updates today." },
    { area: "Knowledge", status: learning ? "Learning active" : "Needs signal", note: learning?.title ?? "Capture the next result before changing strategy." }
  ];
}

function buildOpportunities(state: PlatformState, workspaceId: string): EnterpriseOpportunity[] {
  return selectTopDailyPriorities(state, workspaceId, 6)
    .slice(3, 6)
    .map((action) => ({
      id: action.id,
      opportunity: action.title,
      whyItMatters: action.reasoning || "This can turn current attention into a clearer proof loop.",
      expectedImpact: action.expectedImpact,
      cta: "Review",
      href: "/work-queue"
    }))
    .slice(0, 3);
}

function buildRisks(state: PlatformState, workspaceId: string): EnterpriseRisk[] {
  const context = buildAdvisorContext(state, workspaceId);
  return context.needsAttention.slice(0, 3).map((item) => ({
    id: item.id,
    risk: item.title,
    severity: item.severity,
    mitigation:
      item.sourceType === "Connector"
        ? "Keep decisions bounded until live data is connected."
        : item.sourceType === "ExecutionItem"
          ? "Unblock the linked work before expanding the queue."
          : "Narrow scope and require visible evidence before committing more capacity."
  }));
}

function buildHealth(pulse: EnterprisePulse[], risks: EnterpriseRisk[]): EnterpriseHealth {
  const fitness = pulse.find((item) => item.label === "Enterprise Fitness");
  const score = fitness?.score ?? 70;
  const status = fitness?.tone ?? "steady";

  return {
    score,
    status,
    summary: score >= 70 ? "Healthy enough for focused execution today." : "Needs a narrower day and stronger proof discipline.",
    primaryConstraint: risks[0]?.risk ?? "Founder attention should stay on proof before expansion."
  };
}

function buildFocus(
  narrative: EnterpriseNarrative,
  priorities: [EnterprisePriority, EnterprisePriority, EnterprisePriority]
): EnterpriseFocus {
  return {
    operatingMode: "Proof-first operating day",
    primaryMission: priorities[0]?.relatedMission ?? "Product Page to Video Proof",
    todayTheme: narrative.today,
    recommendation: narrative.recommendation
  };
}

function enterpriseNameFor(state: PlatformState, workspaceId: string) {
  const workspace = state.workspaces.find((item) => item.id === workspaceId);
  return workspace?.companyProductName ?? workspace?.name ?? "VidMaker";
}

export function getEnterpriseState(
  state: PlatformState = initialPlatformState,
  workspaceId: string = defaultWorkspaceId
): EnterpriseState {
  const narrative = buildNarrative(state, workspaceId);
  const priorities = buildPriorities(state, workspaceId);
  const decisions = buildDecisions(state, workspaceId);
  const pulse = buildPulse(state, workspaceId);
  const radar = buildRadar(state, workspaceId);
  const opportunities = buildOpportunities(state, workspaceId);
  const risks = buildRisks(state, workspaceId);

  return {
    enterpriseId: workspaceId,
    enterpriseName: enterpriseNameFor(state, workspaceId),
    generatedAt: new Date().toISOString(),
    health: buildHealth(pulse, risks),
    focus: buildFocus(narrative, priorities),
    narrative,
    dailyWin: {
      title: "Complete the VidMaker Product Demo",
      mission: "Product Page to Video Proof",
      outcome: "Make the next launch reply and founder narrative visibly credible."
    },
    priorities,
    decisions,
    pulse,
    radar,
    opportunities,
    risks,
    nextAction: {
      label: "Continue Product Demo",
      detail: "Use the next focused block to finish the proof asset before broadening promotion.",
      href: "/work-queue"
    },
    reflection: [
      { question: "What changed?", placeholder: "Capture the signal or constraint that shifted today." },
      { question: "What was completed?", placeholder: "Name the proof, reply, content, or decision that moved." },
      { question: "What did we learn?", placeholder: "Write the learning that should change tomorrow's confidence." },
      { question: "What should tomorrow improve?", placeholder: "Pick one operating improvement for the next day." }
    ]
  };
}
