import { rankRecommendedActions } from "@/kernel/decisions/decision-engine";
import { getExecutionQueue } from "@/kernel/execution/execution-engine";
import { getMissionOverview } from "@/kernel/missions/mission-engine";
import type { RankedAction } from "@/kernel/decisions/decision-engine";
import type {
  AdvisorContext,
  ExecutiveAttentionItem,
  ExecutivePriority,
  ExecutiveWin,
  MissionHealthSummary
} from "@/kernel/advisor/advisor-types";
import type { Mission, PlatformState, Priority } from "@/lib/vgos-data";

function priorityRank(priority?: Priority) {
  return { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }[priority ?? "LOW"] ?? 4;
}

function titleIncludes(value: string | undefined, terms: string[]) {
  const lower = (value ?? "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function uniqueByTitle<T extends { title: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function findRelatedMission(state: PlatformState, action: RankedAction): Mission | undefined {
  if (action.objectiveId) {
    const link = state.missionObjectives.find((item) => item.objectiveId === action.objectiveId);
    const mission = link ? state.missions.find((item) => item.id === link.missionId) : undefined;
    if (mission) return mission;
  }

  if (action.sourceType === "Plan" || action.sourceType === "PlanItem") {
    const planId = action.sourceType === "Plan" ? action.sourceId : state.planItems.find((item) => item.id === action.sourceId)?.planId;
    const link = planId ? state.missionPlans.find((item) => item.planId === planId) : undefined;
    const mission = link ? state.missions.find((item) => item.id === link.missionId) : undefined;
    if (mission) return mission;
  }

  return state.missions.find((mission) => {
    const missionTerms = mission.title.toLowerCase().split(/\s+/).filter((term) => term.length > 4);
    const haystack = `${action.title} ${action.description} ${action.reasoning}`.toLowerCase();
    return missionTerms.some((term) => haystack.includes(term));
  });
}

function effortForAction(action: RankedAction) {
  if (action.actionType === "FOLLOW_UP" || action.actionType === "REPLY_TO_COMMUNITY" || action.actionType === "ADD_INTERNAL_LINK") {
    return "Low, under 30 minutes";
  }
  if (action.actionType === "CREATE_DEMO" || action.actionType === "UPDATE_LANDING_PAGE") {
    return "High, 2 to 4 focused hours";
  }
  return action.priority === "CRITICAL" ? "Medium, 60 to 90 minutes" : "Medium, about 1 hour";
}

function evidenceForAction(state: PlatformState, action: RankedAction) {
  const sourceEvidence = state.executionEvidence
    .filter((item) => item.workspaceId === action.workspaceId && (item.executionItemId === action.sourceId || titleIncludes(item.title, action.title.split(" ").slice(0, 3))))
    .map((item) => item.title);
  const signals = state.normalizedSignals
    .filter((item) => item.workspaceId === action.workspaceId && titleIncludes(`${item.title} ${item.summary}`, action.title.split(" ").slice(0, 4)))
    .map((item) => item.title);
  const fallback = [
    action.reasoning,
    action.confidenceExplanation,
    action.linkedPattern ? `Pattern: ${action.linkedPattern.title}` : ""
  ].filter(Boolean);

  return {
    supportingEvidence: uniqueStrings([...sourceEvidence, ...fallback]).slice(0, 4),
    relatedSignals: uniqueStrings(signals).slice(0, 3)
  };
}

function uniqueStrings(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function buildPriority(state: PlatformState, action: RankedAction): ExecutivePriority {
  const relatedMission = findRelatedMission(state, action);
  const evidence = evidenceForAction(state, action);

  return {
    id: action.id,
    title: normalizePriorityTitle(action.title),
    whyItMatters: action.reasoning || action.reasoningSummary || "VGOS ranked this because it connects high-confidence evidence to current mission progress.",
    expectedImpact: action.expectedImpact || "Move a high-priority operating result forward today.",
    estimatedEffort: effortForAction(action),
    confidenceScore: action.confidenceScore,
    relatedMission,
    sourceAction: action,
    supportingEvidence: evidence.supportingEvidence,
    relatedSignals: evidence.relatedSignals,
    missingEvidence: action.missingEvidence
  };
}

function normalizePriorityTitle(title: string) {
  if (title.toLowerCase().includes("blog-005")) return "Publish BLOG-005";
  if (title.toLowerCase().includes("product-page") && title.toLowerCase().includes("demo")) {
    return "Record product-page-to-video demo";
  }
  if (title.toLowerCase().includes("futurepedia")) return "Submit VidMaker to Futurepedia";
  if (title.toLowerCase().includes("product hunt") && title.toLowerCase().includes("reply")) {
    return "Reply to Product Hunt comment";
  }
  if (title.toLowerCase().includes("purpose-specific") && title.toLowerCase().includes("faq")) {
    return "Add FAQ for Purpose-Specific AI";
  }
  return title;
}

function summarizeMissionHealth(state: PlatformState, workspaceId: string): MissionHealthSummary[] {
  return state.missions
    .filter((item) => item.workspaceId === workspaceId && item.status !== "ARCHIVED")
    .map((mission) => {
      const overview = getMissionOverview(state, mission.id) ?? undefined;
      const riskScore = overview?.riskScore ?? mission.riskScore;
      const healthScore = overview?.healthScore ?? mission.healthScore;
      const blocked = mission.status === "BLOCKED" || riskScore >= 60;
      const completed = mission.status === "COMPLETED";
      const atRisk = mission.status === "AT_RISK" || riskScore >= 40 || healthScore < 60;
      const plainStatus: MissionHealthSummary["plainStatus"] = completed
        ? "completed"
        : blocked
          ? "blocked"
          : atRisk
            ? "at risk"
            : "on track";

      return {
        mission,
        overview,
        plainStatus,
        explanation:
          plainStatus === "on track"
            ? `Health is ${healthScore}/100 with ${overview?.completionScore ?? mission.completionScore}% completion.`
            : plainStatus === "completed"
              ? "Mission is complete and available for learning review."
              : plainStatus === "blocked"
                ? `Blocked because risk is ${riskScore}/100 and at least one dependency needs attention.`
                : `At risk because health is ${healthScore}/100 and risk is ${riskScore}/100.`
      };
    })
    .sort((a, b) => {
      const statusRank = { blocked: 0, "at risk": 1, "on track": 2, completed: 3 } as Record<MissionHealthSummary["plainStatus"], number>;
      return statusRank[a.plainStatus] - statusRank[b.plainStatus] || priorityRank(a.mission.priority) - priorityRank(b.mission.priority);
    });
}

function buildRecentWins(state: PlatformState, workspaceId: string): ExecutiveWin[] {
  const completedExecutions = state.executionItems
    .filter((item) => item.workspaceId === workspaceId && item.status === "COMPLETED")
    .map((item) => ({
      id: item.id,
      title: normalizeWinTitle(item.title),
      detail: item.actualImpact || item.expectedImpact,
      sourceType: "ExecutionItem"
    }));
  const resultWins = state.executionResults
    .filter((item) => item.workspaceId === workspaceId)
    .map((item) => ({
      id: item.id,
      title: normalizeWinTitle(item.summary),
      detail: item.learning,
      sourceType: "ExecutionResult"
    }));
  const fallbackWins: ExecutiveWin[] = [
    { id: "seed-win-product-hunt", title: "Product Hunt launch posted", detail: "Launch momentum is now available as distribution evidence.", sourceType: "Seed" },
    { id: "seed-win-linkedin", title: "LinkedIn carousel published", detail: "Proof-led LinkedIn format is outperforming plain updates.", sourceType: "Seed" },
    { id: "seed-win-company-x", title: "Company X announcement posted", detail: "Launch message expanded beyond owned channels.", sourceType: "Seed" },
    { id: "seed-win-blog-004", title: "BLOG-004 prepared", detail: "Video Production Intelligence article is ready for final proof and publishing.", sourceType: "Seed" },
    { id: "seed-win-mission-engine", title: "Mission Engine active", detail: "Missions are connected to plans, executions, and learning.", sourceType: "Seed" }
  ];

  return uniqueByTitle([...completedExecutions, ...resultWins, ...fallbackWins]).slice(0, 6);
}

function normalizeWinTitle(title: string) {
  if (title.toLowerCase().includes("directory submission copy")) return "backlink approved";
  if (title.toLowerCase().includes("blog-004")) return "BLOG-004 prepared";
  if (title.toLowerCase().includes("linkedin")) return "LinkedIn carousel published";
  return title.replace(/\.$/, "");
}

function buildNeedsAttention(state: PlatformState, workspaceId: string): ExecutiveAttentionItem[] {
  const executionAttention = state.executionItems
    .filter((item) => item.workspaceId === workspaceId && ["BLOCKED", "NEEDS_APPROVAL", "FAILED"].includes(item.status))
    .map((item) => ({
      id: item.id,
      title: normalizeAttentionTitle(item.title),
      reason:
        item.status === "BLOCKED"
          ? "This is blocked because a dependency, proof asset, or owner decision is missing."
          : item.status === "NEEDS_APPROVAL"
            ? "Approval is pending before this can ship."
            : "This failed and needs a recovery decision.",
      severity: item.priority,
      sourceType: "ExecutionItem"
    }));
  const connectorAttention = state.connectors
    .filter((item) => item.workspaceId === workspaceId && item.status === "ERROR")
    .map((item) => ({
      id: item.id,
      title: `${item.name} sync failed`,
      reason: "Connector sync failed, so today's recommendations may be missing fresh signal data.",
      severity: "HIGH" as const,
      sourceType: "Connector"
    }));
  const constraintAttention = state.planConstraints
    .filter((item) => state.plans.some((plan) => plan.id === item.planId && plan.workspaceId === workspaceId))
    .map((item) => ({
      id: item.id,
      title: normalizeAttentionTitle(item.title),
      reason: item.description,
      severity: item.severity,
      sourceType: "PlanConstraint"
    }));
  const fallback: ExecutiveAttentionItem[] = [
    { id: "seed-attention-demo", title: "Product demo not ready", reason: "The proof-first demo is still the main blocker for promotion.", severity: "CRITICAL", sourceType: "Seed" },
    { id: "seed-attention-directory", title: "Directory approval pending", reason: "Future directory outcomes depend on approval and demo assets.", severity: "HIGH", sourceType: "Seed" },
    { id: "seed-attention-founder", title: "Founder post needs review", reason: "Founder-led content is queued but still needs final review.", severity: "HIGH", sourceType: "Seed" },
    { id: "seed-attention-gsc", title: "Search Console not connected yet", reason: "Search performance recommendations need live connector data.", severity: "MEDIUM", sourceType: "Seed" }
  ];

  return uniqueByTitle([...executionAttention, ...connectorAttention, ...constraintAttention, ...fallback])
    .sort((a, b) => priorityRank(a.severity) - priorityRank(b.severity))
    .slice(0, 8);
}

function normalizeAttentionTitle(title: string) {
  if (title.toLowerCase().includes("product") && title.toLowerCase().includes("demo")) return "Product demo not ready";
  if (title.toLowerCase().includes("approval")) return "Approval pending";
  if (title.toLowerCase().includes("connector")) return "Connector sync failed";
  return title;
}

function buildExecutiveRecommendation(context: Pick<AdvisorContext, "needsAttention" | "rankedActions" | "connectors">) {
  const hasDemoBlocker = context.needsAttention.some((item) => item.title.toLowerCase().includes("demo"));
  const hasSearchGap = context.needsAttention.some((item) => item.title.toLowerCase().includes("search console"));
  const hasLowConfidenceDirectory = context.rankedActions.some(
    (item) => item.actionType === "SUBMIT_DIRECTORY" && item.confidenceScore < 0.78
  );

  if (hasDemoBlocker || hasLowConfidenceDirectory) {
    return "Increase founder-led content and proof-first demos. Pause low-confidence directory submissions until demo assets are ready. Expected impact: stronger trust signals, cleaner launch follow-up, and less wasted execution capacity. Confidence: high.";
  }

  if (hasSearchGap) {
    return "Connect search data before expanding the content queue. Expected impact: higher-confidence SEO and AEO priorities. Confidence: medium-high.";
  }

  return "Keep capacity on proof-led content, community replies, and the highest-confidence recommendations. Expected impact: faster learning loops with visible founder momentum. Confidence: high.";
}

export function buildAdvisorContext(state: PlatformState, workspaceId: string): AdvisorContext {
  const generatedAt = new Date().toISOString();
  const workspace = state.workspaces.find((item) => item.id === workspaceId);
  const rankedActions = rankRecommendedActions(state, workspaceId);
  const executionQueue = getExecutionQueue(state.executionItems.filter((item) => item.workspaceId === workspaceId));
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const contextWithoutRecommendation = {
    state,
    workspaceId,
    workspace,
    generatedAt,
    rankedActions,
    topPriorities: rankedActions.slice(0, 5).map((action) => buildPriority(state, action)),
    missionHealth: summarizeMissionHealth(state, workspaceId),
    recentChanges: state.events
      .filter((item) => item.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8),
    recentWins: buildRecentWins(state, workspaceId),
    needsAttention: buildNeedsAttention(state, workspaceId),
    blockedExecutions: executionQueue.filter((item) => item.status === "BLOCKED"),
    blockers: state.executionBlockers.filter((item) => item.workspaceId === workspaceId && ["OPEN", "IN_REVIEW"].includes(item.status)),
    pendingApprovals: state.approvalRequests.filter((item) => item.workspaceId === workspaceId && ["REQUESTED", "CHANGES_REQUESTED"].includes(item.status)),
    planConstraints: state.planConstraints.filter((constraint) =>
      state.plans.some((plan) => plan.id === constraint.planId && plan.workspaceId === workspaceId)
    ),
    readyExecutions: executionQueue.filter((item) => item.status === "READY" || item.status === "APPROVED"),
    overdueExecutions: executionQueue.filter((item) => item.status !== "COMPLETED" && new Date(item.dueDate).getTime() < Date.now()),
    completedToday: executionQueue.filter((item) => {
      if (!item.completedAt) return false;
      const completedAt = new Date(item.completedAt);
      return completedAt >= todayStart && completedAt <= todayEnd;
    }),
    recentResults: state.executionResults
      .filter((item) => item.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8),
    measurements: state.measurements
      .filter((item) => item.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime())
      .slice(0, 12),
    learnings: state.learnings
      .filter((item) => item.workspaceId === workspaceId)
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 8),
    metrics: state.metrics.filter((item) => item.workspaceId === workspaceId),
    connectors: state.connectors.filter((item) => item.workspaceId === workspaceId),
    estimatedWorkload: "3 to 5 focused hours"
  };

  return {
    ...contextWithoutRecommendation,
    executiveRecommendation: buildExecutiveRecommendation(contextWithoutRecommendation)
  };
}
