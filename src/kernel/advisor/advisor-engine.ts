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
import { validateRecommendation, validateDecision, validateMissionAgainstBeliefs } from "@/kernel/beliefs/decision-validation";
import { buildRealityModel, summarizeRealityModel } from "@/kernel/beliefs/reality-model";
import { getOpenSituations } from "@/kernel/deliberation/decision-situation-engine";
import { deliberate } from "@/kernel/deliberation/deliberation-engine";
import { buildDecisionQualityBrief } from "@/kernel/deliberation/deliberation-summary";
import { qualityLabel } from "@/kernel/deliberation/decision-quality";
import { applyOutcomeLearningToDeliberation } from "@/kernel/deliberation/outcome-learning";
import { buildCommitmentIntegrityBrief, explainCommitmentRisk } from "@/kernel/commitments/commitment-summary";
import { summarizeOutcomeLearning } from "@/kernel/outcomes";
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

function summarizeBeliefUpdates(state: PlatformState, workspaceId: string): string[] {
  const revisions = state.beliefRevisions
    .filter((revision) => revision.workspaceId === workspaceId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 3)
    .map((revision) => {
      const belief = state.beliefs.find((item) => item.id === revision.beliefId);
      const direction = revision.newConfidence >= revision.previousConfidence ? "increased" : "reduced";
      return `Confidence ${direction} in "${belief?.title ?? revision.beliefId}". ${revision.reason}`;
    });

  const coreBeliefs = state.beliefs
    .filter((belief) => belief.workspaceId === workspaceId && belief.status === "CORE")
    .slice(0, 2)
    .map((belief) => `"${belief.title}" remains a core belief.`);

  return [...revisions, ...coreBeliefs].slice(0, 5);
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
    beliefsUpdated: summarizeBeliefUpdates(state, workspaceId),
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

function explainDecisionDeliberation(context: AdvisorContext, question: string): AdvisorAnswer {
  const lower = question.toLowerCase();
  const workspaceSituations = context.state.decisionSituations.filter((item) => item.workspaceId === context.workspaceId);
  const openSituations = getOpenSituations(context.state, context.workspaceId);
  const target =
    (lower.includes("review")
      ? workspaceSituations.find((situation) => !context.state.decisionReviews.some((review) => review.situationId === situation.id))
      : undefined) ??
    workspaceSituations.find((situation) =>
      lower.split(/\W+/).filter(Boolean).some((token) => token.length > 4 && situation.title.toLowerCase().includes(token))
    ) ??
    openSituations[0] ??
    workspaceSituations[0];

  if (!target) {
    return {
      question,
      answer: "There is no active decision situation yet. Create a decision when VGOS needs to compare options before committing capacity.",
      reasoning: ["The deliberation layer has no situation records for this workspace."],
      relatedObjects: [],
      suggestedActions: [{ label: "Open Decisions", description: "Review or create decision situations.", pageId: "decisions" }],
      confidence: 0.58
    };
  }

  const result = deliberate(target, context.state);
  const scoreFor = (optionId: string) => result.evaluations.find((item) => item.optionId === optionId)?.overallScore ?? 0;
  const sortedOptions = [...result.options].sort((a, b) => scoreFor(b.id) - scoreFor(a.id));
  const doNothingOption = result.options.find((option) => option.optionType === "DO_NOTHING");
  const doNothingScore = doNothingOption ? scoreFor(doNothingOption.id) : undefined;
  const review = context.state.decisionReviews.find((item) => item.situationId === target.id);
  const best = result.recommendedOption;

  let answer = best
    ? `VGOS recommends ${best.title.toLowerCase()} for "${target.title}" because it has the best risk-adjusted score and clearer evidence than the rejected options.`
    : `VGOS has not found a strong option for "${target.title}" yet.`;

  if (/reject|rejected/.test(lower)) {
    answer = result.rejectedOptions.length
      ? `VGOS rejected ${result.rejectedOptions.map((option) => option.title).join(", ")} because their scores, evidence, or risk-adjusted tradeoffs were weaker than ${best?.title ?? "the chosen option"}.`
      : "VGOS has not rejected another option for this decision yet.";
  } else if (/defer|wait/.test(lower)) {
    answer = result.deliberation.status === "DEFERRED" || best?.optionType === "DEFER_DECISION"
      ? `VGOS should defer this decision. ${result.deliberation.whatWouldChangeDecision}`
      : `VGOS should not defer this decision right now. The current best option is ${best?.title ?? "the top scored option"}, and the decision can change if ${result.deliberation.whatWouldChangeDecision.toLowerCase()}`;
  } else if (/do nothing|nothing/.test(lower)) {
    answer = doNothingOption
      ? `Doing nothing scores ${doNothingScore}/100. VGOS considered it, but it preserves ambiguity and is weaker than ${best?.title ?? "the leading option"}.`
      : "A do-nothing option is not attached to this decision yet.";
  } else if (/review/.test(lower)) {
    answer = review
      ? `This decision has been reviewed as ${review.decisionQuality.toLowerCase()}: ${review.summary}`
      : `This decision still needs review after the commitment produces evidence. The current commitment is ${result.commitment.title}.`;
  }

  return {
    question,
    answer,
    reasoning: [
      result.deliberation.finalJudgment,
      result.deliberation.dissentingView,
      `Best option score: ${best ? scoreFor(best.id) : 0}/100.`
    ],
    decisionDeliberation: {
      situationId: target.id,
      situationTitle: target.title,
      recommendedOption: best?.title,
      rejectedOptions: result.rejectedOptions.map((option) => option.title),
      optionScores: sortedOptions.map((option) => `${option.title}: ${scoreFor(option.id)}/100`),
      dissentingView: result.deliberation.dissentingView,
      whatWouldChangeDecision: result.deliberation.whatWouldChangeDecision,
      commitmentTitle: result.commitment.title,
      needsReview: !review
    },
    relatedObjects: [
      { type: "DecisionSituation", id: target.id, title: target.title, detail: target.status },
      ...(best ? [{ type: "DecisionOption", id: best.id, title: best.title, detail: `${scoreFor(best.id)}/100` }] : [])
    ],
    suggestedActions: [
      { label: "Open Decisions", description: "Inspect options, challenges, commitment, and review state.", pageId: "decisions" },
      { label: result.commitment.title, description: result.commitment.description, pageId: "workQueue" }
    ],
    confidence: result.deliberation.confidenceScore
  };
}

function answerRealityModelQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const model = buildRealityModel(context.state, context.workspaceId);
  const lower = question.toLowerCase();
  const relatedBeliefs = /product page|product-page|video|proof/.test(lower)
    ? context.state.beliefs.filter((belief) =>
        belief.workspaceId === context.workspaceId && /product|proof|video|bofu/i.test(`${belief.title} ${belief.statement}`)
      )
    : model.strongestBeliefs;
  const relatedClaims = /weak|claims?/.test(lower)
    ? context.state.claims
        .filter((claim) => claim.workspaceId === context.workspaceId && (claim.status === "CHALLENGED" || claim.evidenceStrength < 0.65))
        .slice(0, 5)
    : model.highestConfidenceClaims.slice(0, 4);

  return {
    question,
    answer: /weak|claims?/.test(lower)
      ? `The weakest claims are ${relatedClaims.map((claim) => claim.title).join(", ") || "not visible yet"}. These should receive stronger evidence before VGOS raises confidence.`
      : `VGOS currently believes ${relatedBeliefs.map((belief) => belief.title).join(", ") || "the reality model is still forming"}. ${summarizeRealityModel(model)}`,
    reasoning: [
      "VGOS now reads beliefs from the claim and evidence loop.",
      "Core beliefs are sorted by confidence, stability, and impact.",
      model.decisionValidationSummary
    ],
    relatedObjects: [
      ...relatedBeliefs.slice(0, 3).map((belief) => ({ type: "Belief", id: belief.id, title: belief.title, detail: belief.status })),
      ...relatedClaims.slice(0, 3).map((claim) => ({ type: "Claim", id: claim.id, title: claim.title, detail: claim.status }))
    ],
    suggestedActions: [
      { label: "Open Beliefs", description: "Review current belief confidence and status.", pageId: "beliefs" },
      { label: "Open Reality Model", description: "Review the workspace reality summary.", pageId: "realityModel" }
    ],
    confidence: 0.86
  };
}

function answerBeliefChangeQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const revisions = context.state.beliefRevisions
    .filter((revision) => revision.workspaceId === context.workspaceId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 5);
  const challenged = context.state.beliefs.find((belief) => belief.workspaceId === context.workspaceId && belief.status === "CHALLENGED");

  return {
    question,
    answer: revisions.length
      ? `Recent belief changes: ${revisions.map((revision) => revision.reason).join(" ")}`
      : challenged
        ? `${challenged.title} was challenged recently and should be reviewed before confidence increases.`
        : "No recent belief revision is visible yet.",
    reasoning: [
      "Belief revisions record previous confidence, new confidence, trigger type, and trigger source.",
      challenged ? `${challenged.title} is currently challenged.` : "No challenged core belief is blocking the current plan."
    ],
    relatedObjects: revisions.map((revision) => ({
      type: "BeliefRevision",
      id: revision.id,
      title: revision.reason,
      detail: `${Math.round(revision.previousConfidence * 100)}% to ${Math.round(revision.newConfidence * 100)}%`
    })),
    suggestedActions: [
      { label: "Open Revisions", description: "Review belief confidence changes.", pageId: "beliefRevisions" },
      { label: "Open Beliefs", description: "Review challenged beliefs.", pageId: "beliefs" }
    ],
    confidence: 0.84
  };
}

function answerDecisionValidationQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const lower = question.toLowerCase();
  const validation = /mission/.test(lower)
    ? validateMissionAgainstBeliefs(context.state, context.workspaceId)
    : /decision/.test(lower)
      ? validateDecision(context.state, context.workspaceId)
      : validateRecommendation(context.state, context.workspaceId, context.topPriorities[0]?.id);

  return {
    question,
    answer: `${validation.title} is ${validation.validationStatus.toLowerCase().replace(/_/g, " ")} with ${Math.round(validation.confidenceScore * 100)}% belief alignment. ${validation.riskSummary}`,
    reasoning: [
      validation.evidenceSummary,
      "VGOS compares supporting beliefs, challenged beliefs, supporting claims, challenged claims, and evidence strength.",
      validation.confidenceScore < 0.68 ? "More evidence is needed before this becomes a high-confidence decision." : "Evidence is strong enough for a bounded commitment."
    ],
    relatedObjects: [
      { type: "DecisionValidation", id: validation.id, title: validation.title, detail: validation.validationStatus },
      ...validation.supportedBeliefs.slice(0, 3).map((item) => {
        const belief = item as { id?: string; title?: string; status?: string };
        return { type: "Belief", id: belief.id ?? "belief", title: belief.title ?? "Supporting belief", detail: belief.status };
      })
    ],
    suggestedActions: [
      { label: "Open Validations", description: "Review belief and claim support.", pageId: "decisionValidations" },
      { label: "Open Claims", description: "Inspect supporting and challenged claims.", pageId: "claims" }
    ],
    confidence: validation.confidenceScore
  };
}

function answerDecisionQualityQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const lower = question.toLowerCase();
  const brief = buildDecisionQualityBrief(context.state, context.workspaceId);
  const allSummaries = [
    ...brief.weakEvidence,
    ...brief.underDeliberation,
    ...brief.readyForCommitment,
    ...(brief.highestQualityRecentDecision ? [brief.highestQualityRecentDecision] : [])
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.deliberationId === item.deliberationId) === index);
  const weakest = [...allSummaries].sort((a, b) => a.qualityScore.overallScore - b.qualityScore.overallScore)[0];
  const ready = brief.readyForCommitment[0];
  const weakEvidence = brief.weakEvidence[0] ?? weakest;
  const target =
    /ready|commitment/.test(lower)
      ? ready
      : /weak.*assumption|assumption.*weak/.test(lower)
        ? allSummaries.find((summary) => summary.assumptions.some((assumption) =>
            brief.highRiskAssumptions.some((risk) => risk.statement === assumption)
          )) ?? weakEvidence
        : /objection/.test(lower)
          ? allSummaries.find((summary) => summary.unresolvedObjections.length > 0) ?? weakEvidence
          : /tradeoff|trade-off|ignoring/.test(lower)
            ? allSummaries.find((summary) => summary.tradeoffs.length === 0) ?? weakEvidence
            : weakEvidence;

  const answer =
    /ready|commitment/.test(lower)
      ? ready
        ? `${ready.title} is ready to become a commitment. It has ${qualityLabel(ready.qualityScore)} decision quality, ${Math.round(ready.qualityScore.evidenceQuality * 100)}% evidence quality, and the next action is to ${ready.recommendedNextAction.toLowerCase()}`
        : "No decision is ready for commitment yet. VGOS should improve evidence, assumptions, tradeoffs, and objections before committing capacity."
      : /weak.*assumption|assumption.*weak/.test(lower)
        ? `The weakest assumptions are ${brief.highRiskAssumptions.slice(0, 3).map((item) => item.statement).join(", ") || "not visible yet"}. These limit confidence until evidence or resolution is linked.`
        : /objection/.test(lower)
          ? `The unresolved objections are ${brief.unresolvedObjections.slice(0, 3).map((item) => item.statement).join(", ") || "none right now"}.`
          : /tradeoff|trade-off|ignoring/.test(lower)
            ? target
              ? `${target.title} should make this tradeoff explicit: ${target.tradeoffs[0] ?? "the opportunity cost between the leading option and the best rejected alternative."}`
              : "No active decision has an ignored tradeoff visible right now."
            : target
              ? `${target.title} needs better decision quality. Its score is ${Math.round(target.qualityScore.overallScore * 100)}%, with ${target.qualityScore.warnings.join(" ") || "no blocking warning"}`
              : "VGOS does not have enough decision-quality data to identify a weak decision yet.";

  return {
    question,
    answer,
    reasoning: [
      brief.summary,
      target ? `Evidence quality: ${Math.round(target.qualityScore.evidenceQuality * 100)}%. Assumption clarity: ${Math.round(target.qualityScore.assumptionClarity * 100)}%. Tradeoff clarity: ${Math.round(target.qualityScore.tradeoffClarity * 100)}%.` : "No target decision-quality score was available.",
      target?.qualityScore.warnings.length ? `Warnings: ${target.qualityScore.warnings.join(" ")}` : "No blocking decision-quality warning is attached to the selected decision."
    ],
    assumptions: target?.assumptions.length
      ? target.assumptions
      : brief.highRiskAssumptions.slice(0, 4).map((item) => `${item.statement} (${item.status.toLowerCase()})`),
    evidence: target?.evidence.length
      ? target.evidence
      : ["No strong linked evidence is visible for the selected decision."],
    counterEvidence: target?.unresolvedObjections.length
      ? target.unresolvedObjections
      : brief.unresolvedObjections.length
        ? brief.unresolvedObjections.slice(0, 4).map((item) => item.statement)
        : ["No unresolved objection is visible."],
    tradeoff: target?.tradeoffs[0] ?? "No explicit tradeoff is attached yet.",
    confidence: target ? Math.max(0.45, target.qualityScore.overallScore) : 0.58,
    confidenceExplanation: target
      ? `Decision quality combines evidence, assumption clarity, option coverage, tradeoffs, risk visibility, reversibility, and confidence justification.`
      : "Decision quality confidence is low because no target deliberation was found.",
    suggestedNextAction: target?.recommendedNextAction ?? "Add evidence or compare alternatives before commitment.",
    shouldWaitForEvidence: Boolean(target && target.qualityScore.evidenceQuality < 0.58),
    relatedObjects: target
      ? [{ type: "Deliberation", id: target.deliberationId, title: target.title, detail: `${Math.round(target.qualityScore.overallScore * 100)}% quality` }]
      : [],
    suggestedActions: [
      { label: "Open Decisions", description: "Review options, assumptions, objections, and quality warnings.", pageId: "decisions" },
      { label: "Open Work Queue", description: "Work through generated decision-quality tasks.", pageId: "workQueue" }
    ]
  };
}

function answerCommitmentRiskQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const lower = question.toLowerCase();
  const brief = buildCommitmentIntegrityBrief(context.state, context.workspaceId);
  const target =
    /lack.*owner|no owner|owners?/.test(lower)
      ? brief.needsOwnerClarification[0] ?? brief.highestRiskCommitment
      : /drift|drifting/.test(lower)
        ? brief.atRiskOfDrift[0] ?? brief.highestRiskCommitment
        : /escalat/.test(lower)
          ? brief.needsEscalation[0] ?? brief.highestRiskCommitment
          : /review today|should i review/.test(lower)
            ? brief.highestRiskCommitment
            : /continue|pause|abandon|replan/.test(lower)
              ? brief.highestRiskCommitment
              : brief.highestRiskCommitment;

  if (!target) {
    return {
      question,
      answer: "No active commitment risk is visible yet.",
      reasoning: ["VGOS did not find active decision commitments in this workspace."],
      evidence: ["No commitment evidence is available."],
      assumptions: ["No commitment assumptions are attached."],
      counterEvidence: ["No drift signal is visible."],
      tradeoff: "No commitment tradeoff is attached.",
      confidence: 0.55,
      suggestedNextAction: "Create or link a commitment before execution.",
      relatedObjects: [],
      suggestedActions: [{ label: "Open Decisions", description: "Review decision commitments.", pageId: "decisions" }]
    };
  }

  const sourceDecision = context.state.deliberations.find((item) => item.id === context.state.decisionCommitments.find((commitment) => commitment.id === target.commitmentId)?.deliberationId);
  const actionAnswer = /continue|pause|abandon|replan/.test(lower)
    ? `VGOS recommends ${target.recommendedAction.toLowerCase()} for ${target.title}. ${target.nextStep}`
    : /which decision created/.test(lower)
      ? `${target.title} came from ${sourceDecision?.finalJudgment ?? sourceDecision?.summary ?? "a linked decision commitment record without a stored final judgment."}`
      : /evidence/.test(lower)
        ? `${target.title} is supported by ${target.evidence.length ? target.evidence.join(", ") : "no linked evidence yet"}.`
        : `${explainCommitmentRisk(target)} Owner: ${target.owner}.`;

  return {
    question,
    answer: actionAnswer,
    reasoning: [
      `Risk level: ${target.riskProfile.riskLevel}. Risk score: ${Math.round(target.riskProfile.riskScore * 100)}%.`,
      target.riskProfile.warnings[0] ?? "No major risk warning is visible.",
      `Integrity score: ${Math.round(target.integrity.overallScore * 100)}%. Readiness score: ${Math.round(target.readiness.readinessScore * 100)}%.`
    ],
    assumptions: context.state.decisionCommitments.find((commitment) => commitment.id === target.commitmentId)?.assumptions ?? ["No explicit commitment assumptions are attached."],
    evidence: target.evidence.length ? target.evidence : [target.rationale || "No evidence or rationale is attached."],
    counterEvidence: target.driftSignals.length ? target.driftSignals.map((signal) => signal.description) : ["No drift signal is visible."],
    tradeoff: context.state.decisionCommitments.find((commitment) => commitment.id === target.commitmentId)?.tradeoffs?.[0] ?? "No explicit commitment tradeoff is attached.",
    confidence: Math.max(0.5, 1 - target.riskProfile.riskScore * 0.45),
    confidenceExplanation: `Commitment risk combines ownership, resources, dependencies, evidence, deadline, drift, and execution readiness.`,
    suggestedNextAction: target.nextStep,
    shouldWaitForEvidence: target.riskProfile.recommendedAction === "ADD_EVIDENCE" || target.riskProfile.evidenceRisk >= 0.7,
    relatedObjects: [
      { type: "DecisionCommitment", id: target.commitmentId, title: target.title, detail: target.riskProfile.riskLevel },
      ...(sourceDecision ? [{ type: "Deliberation", id: sourceDecision.id, title: sourceDecision.summary, detail: sourceDecision.status }] : [])
    ],
    suggestedActions: [
      { label: "Open Work Queue", description: "Handle the generated commitment-integrity task.", pageId: "workQueue" },
      { label: "Open Decisions", description: "Review the originating decision and commitment.", pageId: "decisions" }
    ]
  };
}

function answerOutcomeLearningQuestion(context: AdvisorContext, question: string): AdvisorAnswer {
  const lower = question.toLowerCase();
  const summary = summarizeOutcomeLearning({ workspaceId: context.workspaceId, state: context.state });
  const evaluations = context.state.outcomeEvaluations.filter((item) => item.workspaceId === context.workspaceId);
  const attributions = context.state.outcomeAttributions.filter((item) => item.workspaceId === context.workspaceId);
  const lowAttribution = attributions
    .filter((item) => item.confidenceScore < 0.58 || item.attributionType === "UNKNOWN")
    .sort((a, b) => a.confidenceScore - b.confidenceScore)[0];
  const bestOutcome = [...evaluations].sort((a, b) =>
    b.successScore - a.successScore || b.confidenceScore - a.confidenceScore
  )[0];
  const claimImpact = /claim.*validated|validated.*claim/.test(lower)
    ? context.state.claimImpacts.find((impact) => impact.impactType === "VALIDATES" || impact.impactType === "SUPPORTS")
    : summary.claimImpact;
  const capabilityImpact = /capability.*improved|improved.*capability/.test(lower)
    ? context.state.capabilityImpacts.find((impact) => impact.impactType === "IMPROVED" || impact.impactType === "CREATED")
    : summary.capabilityImpact;
  const targetEvaluation =
    /best result|produced the best/.test(lower)
      ? bestOutcome
      : /unclear attribution/.test(lower)
        ? evaluations.find((item) => item.outcomeId === lowAttribution?.outcomeId) ?? summary.mostImportantRecentOutcome
        : /claim.*validated|validated.*claim/.test(lower)
          ? evaluations.find((item) => item.outcomeId === claimImpact?.outcomeId) ?? summary.mostImportantRecentOutcome
          : /capability.*improved|improved.*capability/.test(lower)
            ? evaluations.find((item) => item.outcomeId === capabilityImpact?.outcomeId) ?? summary.mostImportantRecentOutcome
            : /assumption.*weakened|weakened.*assumption/.test(lower)
              ? evaluations.find((item) => item.outcomeId === "outcome-generic-directory-submissions") ?? summary.mostImportantRecentOutcome
              : /completed commitment.*lack|lacks outcome|missing outcome evaluation/.test(lower)
                ? undefined
                : summary.mostImportantRecentOutcome;
  const attribution = targetEvaluation
    ? attributions.find((item) => item.outcomeId === targetEvaluation.outcomeId)
    : lowAttribution;
  const learningArtifact = targetEvaluation
    ? context.state.learningArtifacts.find((item) => item.sourceId === targetEvaluation.sourceId || item.id.includes(targetEvaluation.outcomeId))
    : summary.learningArtifact;
  const selectedClaimImpact = targetEvaluation
    ? context.state.claimImpacts.find((item) => item.outcomeId === targetEvaluation.outcomeId) ?? claimImpact
    : claimImpact;
  const selectedCapabilityImpact = targetEvaluation
    ? context.state.capabilityImpacts.find((item) => item.outcomeId === targetEvaluation.outcomeId) ?? capabilityImpact
    : capabilityImpact;
  const commitment = targetEvaluation
    ? context.state.decisionCommitments.find((item) => item.id === targetEvaluation.sourceId)
    : undefined;
  const decisionQuality = commitment
    ? context.state.decisionQualityScores.find((item) => item.decisionId === commitment.situationId)
    : undefined;
  const assumptionLearning = targetEvaluation && /assumption.*weakened|weakened.*assumption/.test(lower)
    ? applyOutcomeLearningToDeliberation({
        evaluation: targetEvaluation,
        claimImpact: selectedClaimImpact,
        assumptions: context.state.deliberationAssumptions.filter((item) => item.deliberationId === commitment?.deliberationId),
        objections: context.state.deliberationObjections.filter((item) => item.deliberationId === commitment?.deliberationId),
        decisionQualityScore: decisionQuality
      }).data
    : undefined;
  const missingEvaluation = summary.tasks.find((task) =>
    task.taskType === "EVALUATE_COMPLETED_COMMITMENT" || task.taskType === "RECORD_MISSING_OUTCOME"
  );

  if (/completed commitment.*lack|lacks outcome|missing outcome evaluation/.test(lower) && missingEvaluation) {
    return {
      question,
      answer: `${missingEvaluation.title}: ${missingEvaluation.reason}`,
      reasoning: [
        "VGOS checks completed commitments and completed executions against outcome evaluations.",
        "A completed commitment without evaluation cannot update claims, capabilities, or organizational state.",
        `Recommended next action: ${missingEvaluation.title}.`
      ],
      evidence: [missingEvaluation.reason],
      relatedObjects: [{ type: missingEvaluation.sourceType, id: missingEvaluation.sourceId, title: missingEvaluation.title, detail: missingEvaluation.severity }],
      suggestedActions: [{ label: "Open Work Queue", description: "Complete the generated outcome-learning task.", pageId: "workQueue" }],
      suggestedNextAction: missingEvaluation.title,
      confidence: 0.84
    };
  }

  if (!targetEvaluation) {
    return {
      question,
      answer: "VGOS does not have an evaluated outcome for that question yet.",
      reasoning: [summary.summary],
      evidence: summary.warnings.length ? summary.warnings.slice(0, 3) : ["No outcome evaluation is available."],
      relatedObjects: [],
      suggestedActions: [{ label: "Open Work Queue", description: "Record or evaluate the missing outcome.", pageId: "workQueue" }],
      suggestedNextAction: "Record a measurable actual outcome.",
      shouldWaitForEvidence: true,
      confidence: 0.58
    };
  }

  const luckyRead =
    targetEvaluation.successScore >= 0.65 && decisionQuality && decisionQuality.overallScore < 0.58
      ? "This may be a lucky outcome because decision quality was weak."
      : targetEvaluation.successScore < 0.45 && decisionQuality && decisionQuality.overallScore >= 0.75
        ? "This looks like a weak outcome after a strong decision, so execution, blockers, timing, and external factors need review."
        : "Outcome quality does not automatically prove decision quality; attribution and evidence still matter.";
  const answer = /assumption.*weakened|weakened.*assumption/.test(lower)
    ? `The weakened assumption is ${assumptionLearning?.assumptionUpdates[0]?.statement ?? "Directories improve SEO authority"}. ${targetEvaluation.evaluationSummary}`
    : /unclear attribution/.test(lower)
      ? `${targetEvaluation.outcomeId} has unclear attribution. ${attribution?.rationale ?? "No attribution is recorded."}`
      : /decision.*good.*lucky|good.*decision.*lucky|lucky/.test(lower)
        ? luckyRead
        : `${summary.summary}`;

  return {
    question,
    answer,
    reasoning: [
      `Expected outcome: ${targetEvaluation.expectedOutcome}`,
      `Actual outcome: ${targetEvaluation.actualOutcome || "Not recorded yet."}`,
      `Attribution: ${attribution?.rationale ?? "No attribution recorded."}`,
      `Attribution confidence: ${Math.round((attribution?.confidenceScore ?? targetEvaluation.confidenceScore) * 100)}%.`,
      `Claim impact: ${selectedClaimImpact ? `${selectedClaimImpact.impactType} on ${selectedClaimImpact.claimId}` : "No clear claim impact."}`,
      `Capability impact: ${selectedCapabilityImpact ? `${selectedCapabilityImpact.impactType} on ${selectedCapabilityImpact.capabilityId}` : "No clear capability impact."}`,
      `Reusable learning: ${learningArtifact?.reusableLearning ?? "No reusable learning artifact yet."}`
    ],
    assumptions: assumptionLearning?.assumptionUpdates.length
      ? assumptionLearning.assumptionUpdates.map((item) => `${item.statement}: ${item.newStatus}`)
      : [commitment?.assumptions?.[0] ?? "No specific assumption update is attached."],
    evidence: [
      ...(attribution?.evidenceIds ?? []),
      ...(selectedClaimImpact?.evidenceIds ?? []),
      ...(selectedCapabilityImpact?.evidenceIds ?? [])
    ].filter((item, index, items) => items.indexOf(item) === index),
    counterEvidence: targetEvaluation.warnings.length ? targetEvaluation.warnings : ["No counter-evidence warning is attached."],
    tradeoff: commitment?.tradeoffs?.[0] ?? "Outcome learning preserves the tradeoff between speed, evidence, and confidence.",
    confidence: Math.min(0.9, Math.max(0.5, targetEvaluation.confidenceScore)),
    confidenceExplanation: targetEvaluation.evaluationSummary,
    suggestedNextAction: summary.tasks[0]?.title ?? "Use this learning in the next related decision.",
    shouldWaitForEvidence: targetEvaluation.confidenceScore < 0.58 || /not yet measurable/i.test(targetEvaluation.actualOutcome),
    relatedObjects: [
      { type: "OutcomeEvaluation", id: targetEvaluation.outcomeId, title: targetEvaluation.sourceId, detail: `${Math.round(targetEvaluation.successScore * 100)}% success` },
      ...(attribution ? [{ type: "OutcomeAttribution", id: attribution.id, title: attribution.attributionType, detail: `${Math.round(attribution.confidenceScore * 100)}% confidence` }] : []),
      ...(selectedClaimImpact ? [{ type: "ClaimImpact", id: selectedClaimImpact.id, title: selectedClaimImpact.claimId, detail: selectedClaimImpact.impactType }] : []),
      ...(selectedCapabilityImpact ? [{ type: "CapabilityImpact", id: selectedCapabilityImpact.id, title: selectedCapabilityImpact.capabilityId, detail: selectedCapabilityImpact.impactType }] : [])
    ],
    suggestedActions: [
      { label: "Open Work Queue", description: "Handle incomplete outcome-learning tasks.", pageId: "workQueue" },
      { label: "Open Executive Brief", description: "Review the Outcome Learning section.", pageId: "executiveBrief" }
    ]
  };
}

export function answerExecutiveQuestion(
  question: string,
  state: PlatformState,
  workspaceId: string
): AdvisorAnswer {
  const context = buildAdvisorContext(state, workspaceId);
  const lower = question.toLowerCase();

  if (/outcome learning|what did we learn from this outcome|learn.*outcome|outcome.*learn|which commitment produced the best result|best result|unclear attribution|which claim was validated|claim.*validated|which assumption was weakened|assumption.*weakened|which capability improved|capability.*improved|completed commitment.*lack|lacks outcome evaluation|missing outcome evaluation|good.*decision.*lucky|decision.*good.*lucky|what should we remember/.test(lower)) return answerOutcomeLearningQuestion(context, question);
  if (/commitments?.*(risk|review|owner|drift|drifting|escalat|decision|evidence|continue|pause|abandon|replan)|which commitments?|why.*commitment.*risky|commitment.*risky|which decision created this commitment|what evidence supports this commitment/.test(lower)) return answerCommitmentRiskQuestion(context, question);
  if (/decision.*quality|decisions?.*better evidence|weakest assumptions?|assumptions?.*weakest|ready.*commitment|commitment.*ready|unresolved objections?|objections?.*unresolved|trade-?off.*ignoring|ignoring.*trade-?off|low-confidence|low confidence|quality score|improve.*decision.*quality/.test(lower)) return answerDecisionQualityQuestion(context, question);
  if (/align.*belief|belief.*support|evidence.*before deciding|before deciding|decision.*safe|more evidence|validate.*recommendation|validate.*decision/.test(lower)) return addReflectiveCognition(answerDecisionValidationQuestion(context, question), state, workspaceId);
  if (/what changed.*belief|changed our belief|belief.*changed|challenged recently|recently challenged/.test(lower)) return addReflectiveCognition(answerBeliefChangeQuestion(context, question), state, workspaceId);
  if (/belief|believe|claims?|reality model|product page to video|product-page-to-video/.test(lower)) return addReflectiveCognition(answerRealityModelQuestion(context, question), state, workspaceId);
  if (/what.*assuming|assumption|assumptions|why.*recommendation|what could go wrong|wrong|change.*mind|what would change/.test(lower)) return addReflectiveCognition(explainRecommendation(state, workspaceId), state, workspaceId);
  if (/learn|learned|reflection|outcome/.test(lower)) return answerOutcomeLearningQuestion(context, question);
  if (/option|chosen|choose|reject|rejected|tradeoff|trade-off|defer|delay|do nothing|risk-adjusted|decision.*review|needs review/.test(lower)) return addReflectiveCognition(explainDecisionDeliberation(context, question), state, workspaceId);
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
