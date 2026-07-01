import { buildAdvisorContext } from "@/kernel/advisor/advisor-context";
import type {
  AdvisorAnswer,
  AdvisorContext,
  AdvisorObjectReference,
  DailyBrief,
  ExecutiveReview
} from "@/kernel/advisor/advisor-types";
import { generateExecutiveJudgment } from "@/kernel/cognition/judgment-engine";
import { generateTradeoffSummary } from "@/kernel/cognition/tradeoff-engine";
import type { PlatformState } from "@/lib/vgos-data";

export { buildAdvisorContext } from "@/kernel/advisor/advisor-context";

function firstName(name?: string) {
  return (name ?? "there").split(/\s+/)[0] || "there";
}

function daypart() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function referencesFromPriorities(context: AdvisorContext): AdvisorObjectReference[] {
  return context.topPriorities.slice(0, 4).map((priority) => ({
    type: "Recommendation",
    id: priority.id,
    title: priority.title,
    detail: priority.relatedMission ? `Mission: ${priority.relatedMission.title}` : "Daily priority"
  }));
}

function referencesFromWork(context: AdvisorContext): AdvisorObjectReference[] {
  return [
    ...context.blockedExecutions.slice(0, 3).map((item) => ({
      type: "ExecutionItem",
      id: item.id,
      title: item.title,
      detail: item.status
    })),
    ...context.pendingApprovals.slice(0, 2).map((item) => ({
      type: "ApprovalRequest",
      id: item.id,
      title: item.title,
      detail: item.status
    }))
  ];
}

function summarizeList(items: string[], fallback: string) {
  return items.length ? items.join(" ") : fallback;
}

function firstRecommendationReference(answer: AdvisorAnswer) {
  return answer.relatedObjects.find((item) => /recommendation/i.test(item.type))?.id;
}

function addReflectiveCognition(
  answer: AdvisorAnswer,
  state: PlatformState,
  workspaceId: string,
  sourceId = firstRecommendationReference(answer)
): AdvisorAnswer {
  const judgment = generateExecutiveJudgment(state, workspaceId, sourceId);
  const tradeoff = judgment.tradeoff ? generateTradeoffSummary(judgment.tradeoff) : "No explicit tradeoff is attached yet; VGOS is using evidence and assumption risk.";

  return {
    ...answer,
    directAnswer: answer.answer,
    assumptions: judgment.assumptions.map((item) => `${item.title} (${item.riskLevel.toLowerCase()} risk)`),
    evidence: judgment.evidence.map((item) => `${item.summary} (${Math.round(item.overallScore * 100)}%)`),
    counterEvidence: judgment.counterEvidence.length ? judgment.counterEvidence : ["No material counter-evidence is visible yet."],
    tradeoff,
    confidence: Math.min(answer.confidence, Math.max(0.55, judgment.confidenceScore + 0.05)),
    confidenceExplanation: judgment.confidenceExplanation,
    whatWouldChangeRecommendation: judgment.whatWouldChangeRecommendation,
    suggestedNextAction: judgment.suggestedNextAction,
    shouldWaitForEvidence: judgment.shouldDefer,
    executiveJudgment: judgment
  };
}

export function generateDailyBrief(state: PlatformState, workspaceId: string, userName = "Tom Promise"): DailyBrief {
  const context = buildAdvisorContext(state, workspaceId);
  const executiveJudgment = generateExecutiveJudgment(state, workspaceId, context.topPriorities[0]?.id);
  const topPriorityTitles = context.topPriorities.map((item) => item.title);
  const blockedTitles = [
    ...context.blockedExecutions.slice(0, 3).map((item) => item.title),
    ...context.blockers.slice(0, 2).map((item) => item.title)
  ];
  const movedMissions = context.missionHealth
    .slice(0, 4)
    .map((item) => `${item.mission.title} is ${item.plainStatus}. ${item.explanation}`);

  return {
    greeting: `Good ${daypart()}, ${firstName(userName)}.`,
    summary: `Here's what matters today. ${context.recentWins[0]?.title ?? "Recent execution"} moved forward, ${context.needsAttention[0]?.title ?? "one dependency"} needs attention, and VGOS recommends focusing on proof-led work before expanding lower-confidence promotion.`,
    changedYesterday: context.recentChanges.slice(0, 5).map((item) => item.title),
    movedMissions,
    blocked: blockedTitles.length ? blockedTitles : ["No critical blockers are currently open."],
    needsAttention: context.needsAttention.slice(0, 5),
    priorities: context.topPriorities,
    missionHealth: context.missionHealth.slice(0, 6),
    recentWins: context.recentWins.slice(0, 5),
    executiveRecommendation: context.executiveRecommendation,
    executiveJudgment,
    recommendedFocus: summarizeList(topPriorityTitles.slice(0, 3), "Keep capacity on ready execution items and founder review."),
    estimatedWorkload: context.estimatedWorkload
  };
}

export function generateWeeklyReview(state: PlatformState, workspaceId: string): ExecutiveReview {
  const context = buildAdvisorContext(state, workspaceId);

  return {
    period: "weekly",
    summary: `This week is best read as a proof and distribution week: ${context.recentWins[0]?.title ?? "recent wins"} created momentum while ${context.needsAttention[0]?.title ?? "execution dependencies"} still constrains throughput.`,
    wins: context.recentWins.slice(0, 6).map((item) => item.title),
    risks: context.needsAttention.slice(0, 5).map((item) => item.title),
    priorities: context.topPriorities.slice(0, 5).map((item) => item.title),
    learning: context.learnings.slice(0, 4).map((item) => item.title),
    recommendedAdjustment: context.executiveRecommendation
  };
}

export function generateMonthlyReview(state: PlatformState, workspaceId: string): ExecutiveReview {
  const context = buildAdvisorContext(state, workspaceId);
  const completed = context.state.executionItems.filter((item) => item.workspaceId === workspaceId && item.status === "COMPLETED").length;

  return {
    period: "monthly",
    summary: `The month shows ${completed} completed executions, stronger proof-led positioning, and continued need to connect live measurement sources before scaling the lower-confidence queue.`,
    wins: context.recentWins.slice(0, 8).map((item) => item.title),
    risks: context.needsAttention.slice(0, 6).map((item) => item.title),
    priorities: context.topPriorities.slice(0, 6).map((item) => item.title),
    learning: context.learnings.slice(0, 6).map((item) => item.title),
    recommendedAdjustment: context.executiveRecommendation
  };
}

export function recommendNextActions(state: PlatformState, workspaceId: string): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const priorities = context.topPriorities.slice(0, 5);

  return {
    question: "What should I do today?",
    answer: `Start with ${priorities[0]?.title ?? "the highest-confidence ready item"}. Then work through ${priorities.slice(1, 3).map((item) => item.title).join(" and ") || "ready execution items"}. Keep the day narrow: proof assets, founder review, and one high-signal distribution action.`,
    reasoning: [
      "VGOS ranked these by priority, urgency, confidence, expected impact, and mission connection.",
      `${context.blockedExecutions.length} execution items are blocked, so the queue favors ready work and unblockers.`,
      context.executiveRecommendation
    ],
    relatedObjects: referencesFromPriorities(context),
    suggestedActions: [
      { label: "Open Work Queue", description: "Review ready, blocked, approval, overdue, and completed work.", pageId: "workQueue" },
      { label: "Ask why", description: "Open the explainability panel for the top priority.", sourceId: priorities[0]?.id }
    ],
    confidence: 0.9
  };
}

export function summarizeRecentChanges(state: PlatformState, workspaceId: string): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);

  return {
    question: "What changed since yesterday?",
    answer: `The main changes are ${context.recentChanges.slice(0, 4).map((item) => item.title).join(", ") || "limited because no recent events were recorded"}. The operating read is that launch proof and founder content are still the highest-leverage surfaces.`,
    reasoning: [
      "Recent events are sorted by workspace timestamp.",
      "Wins, blockers, approvals, and connector state are combined into the executive brief.",
      context.executiveRecommendation
    ],
    relatedObjects: context.recentChanges.slice(0, 5).map((item) => ({
      type: "Event",
      id: item.id,
      title: item.title,
      detail: item.status
    })),
    suggestedActions: [
      { label: "Open Executive Brief", description: "Review the daily narrative and recommendation.", pageId: "executiveBrief" }
    ],
    confidence: 0.84
  };
}

export function summarizeBlockedWork(state: PlatformState, workspaceId: string): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const blockers = context.needsAttention.slice(0, 5);

  return {
    question: "What is blocked?",
    answer: blockers.length
      ? `The most important blocked work is ${blockers.map((item) => item.title).join(", ")}. The product demo blocker is the one most likely to slow Product Hunt follow-up, founder content, and directory confidence.`
      : "No critical work is blocked right now. The next move is to keep ready execution moving.",
    reasoning: [
      "VGOS checks blocked executions, open blockers, plan constraints, pending approvals, and connector errors.",
      "Demo assets and approvals receive extra weight because they unlock several downstream actions.",
      `${context.pendingApprovals.length} approval requests still need review.`
    ],
    relatedObjects: referencesFromWork(context),
    suggestedActions: [
      { label: "View Blocked Work", description: "Open the work queue filtered by blockers.", pageId: "workQueue" },
      { label: "View Approvals", description: "Review approval requests that are holding execution.", pageId: "approvals" }
    ],
    confidence: 0.91
  };
}

export function explainMissionRisk(state: PlatformState, workspaceId: string, missionId?: string): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const target =
    context.missionHealth.find((item) => item.mission.id === missionId) ??
    context.missionHealth.find((item) => item.plainStatus === "blocked" || item.plainStatus === "at risk") ??
    context.missionHealth[0];

  if (!target) {
    return {
      question: "Why is this mission at risk?",
      answer: "There is no active mission risk to explain yet.",
      reasoning: ["No active mission health summary was available."],
      relatedObjects: [],
      suggestedActions: [{ label: "Open Missions", description: "Review mission setup.", pageId: "missions" }],
      confidence: 0.62
    };
  }

  return {
    question: "Why is this mission at risk?",
    answer: `${target.mission.title} is ${target.plainStatus}. ${target.explanation} The likely causes are blocked execution, missing proof evidence, pending approvals, or weak measurement coverage.`,
    reasoning: [
      `Health score: ${target.overview?.healthScore ?? target.mission.healthScore}/100.`,
      `Risk score: ${target.overview?.riskScore ?? target.mission.riskScore}/100.`,
      `${target.overview?.executions.filter((item) => item.status === "BLOCKED").length ?? 0} linked executions are blocked.`
    ],
    relatedObjects: [
      {
        type: "Mission",
        id: target.mission.id,
        title: target.mission.title,
        detail: target.plainStatus
      }
    ],
    suggestedActions: [
      { label: "Open Missions", description: "Inspect mission details and related work.", pageId: "missions" },
      { label: "Open Work Queue", description: "Find the linked blocker or approval.", pageId: "workQueue" }
    ],
    confidence: 0.86
  };
}

export function explainRecommendation(state: PlatformState, workspaceId: string, recommendationId?: string): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const priority =
    context.topPriorities.find((item) => item.id === recommendationId) ??
    context.topPriorities[0];

  if (!priority) {
    return {
      question: "Why does VGOS recommend this?",
      answer: "There is no active recommendation to explain yet.",
      reasoning: ["No ranked recommendation was available."],
      relatedObjects: [],
      suggestedActions: [{ label: "Create Recommendation", description: "Add a recommendation for VGOS to rank.", pageId: "recommendedActions" }],
      confidence: 0.58
    };
  }

  return {
    question: "Why does VGOS recommend this?",
    answer: `VGOS recommends ${priority.title} because it has ${Math.round(priority.confidenceScore * 100)}% confidence, clear expected impact, and a direct link to ${priority.relatedMission?.title ?? "the current operating focus"}.`,
    reasoning: [
      priority.whyItMatters,
      priority.expectedImpact,
      priority.missingEvidence.length ? `Missing evidence: ${priority.missingEvidence.join(", ")}.` : "No major missing evidence is listed."
    ],
    relatedObjects: [
      {
        type: "RecommendedAction",
        id: priority.id,
        title: priority.title,
        detail: `${Math.round(priority.confidenceScore * 100)}% confidence`
      }
    ],
    suggestedActions: [
      { label: "Start Work", description: "Convert the recommendation into execution.", sourceId: priority.id },
      { label: "Open Work Queue", description: "Review nearby execution items.", pageId: "workQueue" }
    ],
    confidence: 0.9
  };
}

function answerPublishingQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const publishable = context.topPriorities.filter((item) =>
    /blog|founder|linkedin|faq|content|publish|post/i.test(`${item.title} ${item.sourceAction.actionType}`)
  );
  const top = publishable[0] ?? context.topPriorities[0];

  return {
    question,
    answer: top
      ? `Publish ${top.title} next. It has the best mix of confidence, mission connection, and proof value. Use the founder-led angle where possible, and attach evidence before broad promotion.`
      : "No publishable recommendation is queued yet. Create one from a content, founder, or FAQ opportunity.",
    reasoning: [
      "The advisor looks for content, founder, FAQ, and publish-oriented recommendations first.",
      "Proof-led content is weighted because recent signals ask for demos and output quality.",
      context.executiveRecommendation
    ],
    relatedObjects: top ? [{ type: "Recommendation", id: top.id, title: top.title, detail: top.expectedImpact }] : [],
    suggestedActions: [
      { label: "Open Advisor", description: "Ask for a draft queue or founder content opportunities.", pageId: "advisor" },
      { label: "Open Work Queue", description: "Start the ready content item.", pageId: "workQueue" }
    ],
    confidence: 0.82
  };
}

function summarizeProductHunt(context: AdvisorContext, question: string): AdvisorAnswer {
  const relatedChanges = context.state.events
    .filter((item) => item.workspaceId === context.workspaceId && /product hunt/i.test(`${item.title} ${item.description}`))
    .slice(0, 4);
  const relatedExecutions = context.state.executionItems
    .filter((item) => item.workspaceId === context.workspaceId && /product hunt/i.test(`${item.title} ${item.description} ${item.planId}`))
    .slice(0, 4);

  return {
    question,
    answer: "Product Hunt momentum is useful but conditional. The launch created attention and comment demand, especially around product-page-to-video proof. The next leverage point is replying with a demo, then reusing that proof across founder content and directory submissions.",
    reasoning: [
      "Product Hunt and LinkedIn signals both ask for proof clips.",
      "The product demo blocker limits follow-up quality.",
      "A single demo asset can unlock Product Hunt replies, founder posts, blog proof, and directory confidence."
    ],
    relatedObjects: [
      ...relatedChanges.map((item) => ({ type: "Event", id: item.id, title: item.title, detail: item.status })),
      ...relatedExecutions.map((item) => ({ type: "ExecutionItem", id: item.id, title: item.title, detail: item.status }))
    ],
    suggestedActions: [
      { label: "Start Demo Work", description: "Move the product-page-to-video demo forward.", pageId: "workQueue" },
      { label: "Reply to Product Hunt", description: "Use proof-first language in the comment reply.", pageId: "workQueue" }
    ],
    confidence: 0.87
  };
}

function summarizeFounderContent(context: AdvisorContext, question: string): AdvisorAnswer {
  const founderItems = context.state.executionItems
    .filter((item) => item.workspaceId === context.workspaceId && /founder|linkedin|authority/i.test(`${item.title} ${item.owner} ${item.executionType}`))
    .slice(0, 5);

  return {
    question,
    answer: "The best founder content opportunity is proof-first narrative: explain Video Production Intelligence, show the product-page-to-video demo, and contrast it with generic AI video generation. Keep it tied to a visible artifact, not abstract positioning alone.",
    reasoning: [
      "Founder-led content is high leverage because current signals need trust and proof.",
      "LinkedIn carousel performance favors proof-led formats.",
      "The same demo can feed Product Hunt, blog, FAQ, and founder posts."
    ],
    relatedObjects: founderItems.map((item) => ({
      type: "ExecutionItem",
      id: item.id,
      title: item.title,
      detail: item.status
    })),
    suggestedActions: [
      { label: "Review Founder Post", description: "Open approval-needed founder content.", pageId: "workQueue" },
      { label: "Open Results", description: "Use recent learning before publishing.", pageId: "results" }
    ],
    confidence: 0.88
  };
}

export function answerExecutiveQuestion(
  question: string,
  state: PlatformState,
  workspaceId: string
): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const lower = question.toLowerCase();

  if (/blocked|stuck|waiting/.test(lower)) return addReflectiveCognition(summarizeBlockedWork(state, workspaceId), state, workspaceId);
  if (/changed|yesterday|recent/.test(lower)) return addReflectiveCognition(summarizeRecentChanges(state, workspaceId), state, workspaceId);
  if (/risk|at risk|why.*mission/.test(lower)) return addReflectiveCognition(explainMissionRisk(state, workspaceId), state, workspaceId);
  if (/publish|content|blog|faq/.test(lower)) return addReflectiveCognition(answerPublishingQuestion(context, question), state, workspaceId);
  if (/highest confidence|confidence|recommendations/.test(lower)) return addReflectiveCognition(explainRecommendation(state, workspaceId), state, workspaceId);
  if (/product hunt|launch momentum/.test(lower)) return addReflectiveCognition(summarizeProductHunt(context, question), state, workspaceId);
  if (/founder|linkedin|authority/.test(lower)) return addReflectiveCognition(summarizeFounderContent(context, question), state, workspaceId);
  if (/work queue|today|next action|should i do/.test(lower)) return addReflectiveCognition(recommendNextActions(state, workspaceId), state, workspaceId);

  const brief = generateDailyBrief(state, workspaceId);
  return addReflectiveCognition({
    question,
    answer: `${brief.summary} Recommended focus: ${brief.recommendedFocus}`,
    reasoning: [
      "The advisor did not match a specialized rule, so it returned the executive brief.",
      context.executiveRecommendation
    ],
    relatedObjects: referencesFromPriorities(context),
    suggestedActions: [
      { label: "Open Executive Brief", description: "Review the full daily brief.", pageId: "executiveBrief" },
      { label: "Open Work Queue", description: "Start the highest-priority ready item.", pageId: "workQueue" }
    ],
    confidence: 0.8
  }, state, workspaceId);
}
