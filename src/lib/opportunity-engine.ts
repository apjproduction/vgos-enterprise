import type {
  AIRecommendation,
  Backlink,
  ContentAsset,
  DirectorySubmission,
  Experiment,
  IntelligenceObject,
  PainPoint,
  PlatformState,
  Priority,
  Question
} from "@/lib/vgos-data";

export type OpportunitySourceType =
  | "Question"
  | "PainPoint"
  | "Conversation"
  | "ContentAsset"
  | "DirectorySubmission"
  | "Backlink"
  | "AIRecommendation"
  | "IntelligenceObject"
  | "Experiment";

export type OpportunityItem = {
  id: string;
  sourceType: OpportunitySourceType;
  sourceId: string;
  title: string;
  summary: string;
  opportunityScore: number;
  priority: Priority;
  status: string;
  recommendedAction: string;
  owner: string;
  dueDate: string;
  createdAt: string;
};

type ScoreInput = {
  businessValueScore?: number;
  painSeverityScore?: number;
  trendScore?: number;
  authorityGapScore?: number;
  confidenceScore?: number;
  competitionScore?: number;
  priority?: Priority;
};

const priorityBoost: Record<Priority, number> = {
  CRITICAL: 200,
  HIGH: 120,
  MEDIUM: 60,
  LOW: 20
};

export function calculateOpportunityScore(input: ScoreInput) {
  const businessValueScore = input.businessValueScore ?? 6;
  const painSeverityScore = input.painSeverityScore ?? 5;
  const trendScore = input.trendScore ?? 5;
  const authorityGapScore = input.authorityGapScore ?? 5;
  const confidenceScore = input.confidenceScore ?? 0.7;
  const competitionScore = input.competitionScore ?? 4;

  return Math.round(
    businessValueScore *
      painSeverityScore *
      trendScore *
      authorityGapScore *
      confidenceScore -
      competitionScore +
      priorityBoost[input.priority ?? "MEDIUM"]
  );
}

function fallbackDueDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function makeItem(
  sourceType: OpportunitySourceType,
  sourceId: string,
  title: string,
  summary: string,
  priority: Priority,
  status: string,
  owner: string,
  createdAt: string,
  recommendedAction: string,
  scoreInput: ScoreInput,
  dueDate = fallbackDueDate(5)
): OpportunityItem {
  return {
    id: `${sourceType}-${sourceId}`,
    sourceType,
    sourceId,
    title,
    summary,
    priority,
    status,
    owner,
    createdAt,
    dueDate,
    recommendedAction,
    opportunityScore: calculateOpportunityScore({ ...scoreInput, priority })
  };
}

export function buildOpportunityQueue(state: PlatformState, workspaceId: string) {
  const questionItems = state.questions
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: Question) =>
      makeItem(
        "Question",
        item.id,
        item.title,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        "Create or update an answer-ready content asset.",
        item,
        fallbackDueDate(4)
      )
    );

  const painItems = state.painPoints
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: PainPoint) =>
      makeItem(
        "PainPoint",
        item.id,
        item.title,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        "Turn this pain into a product, content, or community response.",
        item,
        fallbackDueDate(3)
      )
    );

  const contentItems = state.contentAssets
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: ContentAsset) =>
      makeItem(
        "ContentAsset",
        item.id,
        item.title,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        item.status === "IN_PROGRESS"
          ? "Finish and publish this asset."
          : "Review for refresh, internal links, and entity coverage.",
        { priority: item.priority, confidenceScore: 0.74 },
        fallbackDueDate(6)
      )
    );

  const directoryItems = state.directorySubmissions
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: DirectorySubmission) =>
      makeItem(
        "DirectorySubmission",
        item.id,
        item.name,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        "Submit, follow up, or improve category positioning.",
        { priority: item.priority, authorityGapScore: 8, confidenceScore: 0.72 },
        fallbackDueDate(5)
      )
    );

  const backlinkItems = state.backlinks
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: Backlink) =>
      makeItem(
        "Backlink",
        item.id,
        item.title,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        "Confirm link status and expand outreach.",
        { priority: item.priority, authorityGapScore: 9, confidenceScore: 0.7 },
        fallbackDueDate(7)
      )
    );

  const recommendationItems = state.aiRecommendations
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: AIRecommendation) =>
      makeItem(
        "AIRecommendation",
        item.id,
        item.title,
        item.reasoning,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        item.suggestedAction,
        { priority: item.priority, confidenceScore: item.confidenceScore },
        fallbackDueDate(2)
      )
    );

  const intelligenceItems = state.intelligenceObjects
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: IntelligenceObject) =>
      makeItem(
        "IntelligenceObject",
        item.id,
        item.summary.slice(0, 86),
        item.reasoning,
        item.opportunityScore >= 85 ? "CRITICAL" : item.opportunityScore >= 70 ? "HIGH" : "MEDIUM",
        "RESEARCHING",
        "Growth Intelligence",
        item.createdAt,
        "Review the recommended action generated by the intelligence pipeline.",
        {
          businessValueScore: Math.max(6, Math.round(item.opportunityScore / 10)),
          painSeverityScore: item.detectedPainPoints.length ? 8 : 5,
          trendScore: item.detectedKeywords.length ? 8 : 6,
          authorityGapScore: item.detectedEntities.length ? 8 : 6,
          confidenceScore: item.confidenceScore,
          competitionScore: 3
        },
        fallbackDueDate(2)
      )
    );

  const experimentItems = state.experiments
    .filter((item) => item.workspaceId === workspaceId)
    .map((item: Experiment) =>
      makeItem(
        "Experiment",
        item.id,
        item.title,
        item.description,
        item.status === "IN_PROGRESS" ? "HIGH" : "MEDIUM",
        item.status,
        "Growth",
        item.createdAt,
        item.status === "IN_PROGRESS"
          ? "Review signal and decide next action."
          : "Start or schedule this experiment.",
        { confidenceScore: 0.68, trendScore: 7 },
        item.endDate ?? fallbackDueDate(10)
      )
    );

  const conversationItems = state.conversations
    .filter((item) => item.workspaceId === workspaceId)
    .map((item) =>
      makeItem(
        "Conversation",
        item.id,
        item.title,
        item.description,
        item.priority,
        item.status,
        item.owner,
        item.createdAt,
        "Extract questions, pain points, and recommended actions.",
        { priority: item.priority, trendScore: 8, confidenceScore: 0.72 },
        fallbackDueDate(2)
      )
    );

  return [
    ...questionItems,
    ...painItems,
    ...conversationItems,
    ...contentItems,
    ...directoryItems,
    ...backlinkItems,
    ...recommendationItems,
    ...intelligenceItems,
    ...experimentItems
  ].sort((a, b) => b.opportunityScore - a.opportunityScore);
}
