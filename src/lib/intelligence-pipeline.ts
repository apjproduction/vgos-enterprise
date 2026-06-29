import {
  orgId,
  type AIRecommendation,
  type ActionType,
  type Intent,
  type Priority,
  type RecommendedAction
} from "@/lib/vgos-data";
import { calculateRecommendationConfidence } from "@/kernel/quality/confidence-engine";
import { assessDuplicateRisk } from "@/kernel/quality/duplicate-detection";

export type PipelineSourceRecord = Record<string, unknown> & {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  summary?: string;
  rawText?: string;
  notes?: string;
  source?: string;
  url?: string;
  sourceUrl?: string;
  priority?: Priority;
  owner?: string;
  confidenceScore?: number;
};

export type IntelligencePipelineResult = {
  intelligenceObject: {
    id: string;
    organizationId: string;
    workspaceId: string;
    sourceType: string;
    sourceId: string;
    summary: string;
    detectedEntities: string[];
    detectedKeywords: string[];
    detectedIntent: Intent;
    detectedPersona: string;
    detectedPainPoints: string[];
    sentiment: string;
    opportunityScore: number;
    confidenceScore: number;
    reasoning: string;
    createdAt: string;
    updatedAt: string;
  };
  aiRecommendation: AIRecommendation;
  recommendedActions: RecommendedAction[];
};

export type IntelligenceProvider = {
  process(
    record: PipelineSourceRecord,
    options: {
      workspaceId: string;
      organizationId?: string;
      sourceType?: string;
      now?: string;
      existing?: {
        aiRecommendations?: AIRecommendation[];
        recommendedActions?: RecommendedAction[];
      };
    }
  ): Promise<IntelligencePipelineResult>;
};

type ScoringInput = {
  text: string;
  intent: Intent;
  persona: string;
  entities: string[];
  painPoints: string[];
  confidenceScore: number;
  sourcePriority?: Priority;
};

const entityRules = [
  ["VidMaker", ["vidmaker"]],
  ["Video Production Intelligence", ["video production intelligence", "production intelligence", "vpi"]],
  ["Purpose-Specific AI", ["purpose-specific ai", "purpose specific ai", "workflow-specific ai"]],
  ["Purpose Engines", ["purpose engine", "purpose engines"]],
  ["Product Page to Video", ["product page to video", "product-page-to-video", "product page url", "product page", "pdp to video", "url-to-video", "url to video"]],
  ["Blog to Video", ["blog to video", "article to video", "blog repurposing"]],
  ["Synthesia", ["synthesia"]],
  ["HeyGen", ["heygen", "hey gen"]],
  ["InVideo", ["invideo", "in video"]],
  ["VEED", ["veed"]],
  ["Pictory", ["pictory"]],
  ["Canva", ["canva"]]
] as const;

const keywordRules = [
  "Video Production Intelligence",
  "Purpose-Specific AI",
  "AI video production",
  "video workflow automation",
  "product page to video",
  "product page URL",
  "ready-to-post video",
  "source-to-output demo",
  "Blog to Video",
  "URL-to-video"
];

const sprintActionTypes: ActionType[] = [
  "WRITE_BLOG",
  "CREATE_FOUNDER_POST",
  "CREATE_COMPANY_POST",
  "CREATE_X_THREAD",
  "CREATE_PINTEREST_PIN",
  "ADD_INTERNAL_LINK",
  "SUBMIT_DIRECTORY",
  "REPLY_TO_COMMUNITY",
  "CREATE_DEMO",
  "CREATE_FAQ",
  "UPDATE_LANDING_PAGE"
];

function normalize(text: string) {
  return text.toLowerCase();
}

function includesAny(text: string, terms: readonly string[]) {
  const lower = normalize(text);
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function sourceText(record: PipelineSourceRecord) {
  return [
    record.title,
    record.name,
    record.description,
    record.summary,
    record.rawText,
    record.notes,
    record.source
  ]
    .filter(Boolean)
    .join(" ");
}

function sourceSummary(record: PipelineSourceRecord) {
  return String(record.summary ?? record.description ?? record.rawText ?? record.title ?? record.name ?? "").trim();
}

export function classifyIntent(text: string): Intent {
  const lower = normalize(text);

  if (includesAny(lower, ["pricing", "sign up", "signup", "subscribe", "buy", "purchase", "start trial", "book demo"])) {
    return "TRANSACTIONAL";
  }

  if (includesAny(lower, ["login", "docs", "documentation", "support", "vidmaker dashboard", "account"])) {
    return "NAVIGATIONAL";
  }

  if (
    includesAny(lower, [
      "product page",
      "ready-to-post",
      "demo",
      "proof",
      "compare",
      "vs ",
      "alternative",
      "can vidmaker",
      "does vidmaker",
      "workflow"
    ])
  ) {
    return "COMMERCIAL";
  }

  if (includesAny(lower, ["reddit", "linkedin", "product hunt", "hacker news", "indie hackers", "comment", "thread", "community"])) {
    return "COMMUNITY_DISCUSSION";
  }

  return "INFORMATIONAL";
}

export function detectPersona(text: string) {
  const lower = normalize(text);

  if (includesAny(lower, ["product page", "ecommerce", "e-commerce", "shopify", "pdp", "product video", "product page url"])) {
    return "Ecommerce Brand";
  }
  if (includesAny(lower, ["agency", "client", "white label", "retainer", "campaign deliverables"])) {
    return "Agency";
  }
  if (includesAny(lower, ["course", "lesson", "teacher", "educator", "curriculum", "training module"])) {
    return "Educator";
  }
  if (includesAny(lower, ["saas", "onboarding", "product-led", "feature launch", "changelog", "activation"])) {
    return "SaaS Team";
  }
  if (includesAny(lower, ["enterprise", "brand governance", "approval", "marketing team", "legal review", "compliance"])) {
    return "Enterprise Marketing Team";
  }
  if (includesAny(lower, ["affiliate", "review page", "comparison page", "buyer guide"])) {
    return "Affiliate Marketer";
  }
  if (includesAny(lower, ["youtube", "creator", "shorts", "tiktok", "newsletter creator", "content creator"])) {
    return "Creator";
  }

  return "Creator";
}

export function extractPainPoints(text: string) {
  const lower = normalize(text);
  const painPoints: string[] = [];

  if (includesAny(lower, ["product page", "product page url", "pdp", "ready-to-post", "product video"])) {
    painPoints.push("Need automated product video creation");
  }
  if (includesAny(lower, ["manual cleanup", "cleanup", "too much editing", "heavy editing", "fix the output"])) {
    painPoints.push("AI video output requires too much manual cleanup");
  }
  if (includesAny(lower, ["proof", "trust", "coherent", "brand-safe", "quality", "ready-to-post"])) {
    painPoints.push("Need proof that generated videos are coherent and brand-safe");
  }
  if (includesAny(lower, ["template", "source understanding", "campaign purpose", "generic generator"])) {
    painPoints.push("Template-first tools do not understand campaign purpose");
  }
  if (includesAny(lower, ["accuracy", "preserve", "source page", "product details", "hallucination"])) {
    painPoints.push("Need product accuracy preserved from source pages");
  }
  if (includesAny(lower, ["workflow", "repeatable", "scale", "automate", "automation"])) {
    painPoints.push("Need repeatable video workflow automation");
  }

  return painPoints.length ? unique(painPoints) : ["Need clearer VidMaker answer, proof, or workflow guidance"];
}

export function detectEntities(text: string) {
  const lower = normalize(text);
  return entityRules
    .filter(([, aliases]) => aliases.some((alias) => lower.includes(alias)))
    .map(([entity]) => entity);
}

export function detectKeywords(text: string) {
  const lower = normalize(text);
  return keywordRules.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

export function detectSentiment(text: string) {
  const lower = normalize(text);
  if (includesAny(lower, ["complain", "criticize", "skeptical", "manual cleanup", "does not", "lack of", "too much"])) {
    return "negative";
  }
  if (includesAny(lower, ["can vidmaker", "can ", "does vidmaker", "ready-to-post", "product page"])) {
    return "curious/high-intent";
  }
  if (includesAny(lower, ["love", "great", "useful", "more engagement", "interested"])) {
    return "positive";
  }
  return "neutral";
}

export function calculateOpportunityScore(input: ScoringInput) {
  const lower = normalize(input.text);
  const hasProductPage = includesAny(lower, ["product page", "pdp", "url-to-video", "url to video"]);
  const hasDemoDemand = includesAny(lower, ["demo", "proof", "ready-to-post", "source-to-output"]);
  const hasCompetitor = input.entities.some((entity) =>
    ["Synthesia", "HeyGen", "InVideo", "VEED", "Pictory", "Canva"].includes(entity)
  );

  const businessValue =
    input.sourcePriority === "CRITICAL" ? 10 : hasProductPage ? 10 : input.intent === "COMMERCIAL" || input.intent === "TRANSACTIONAL" ? 9 : 7;
  const painSeverity = Math.min(10, 5 + input.painPoints.length + (hasDemoDemand ? 3 : 0) + (hasProductPage ? 1 : 0));
  const trendScore = Math.min(10, 6 + (includesAny(lower, ["ai video", "automation", "workflow", "product page"]) ? 2 : 0) + (hasDemoDemand ? 1 : 0));
  const authorityGap = Math.min(
    10,
    6 + (input.entities.includes("Video Production Intelligence") ? 2 : 0) + (input.entities.includes("Product Page to Video") ? 2 : 0)
  );
  const confidence = Math.round(Math.min(1, Math.max(0, input.confidenceScore)) * 10);
  const competition = hasCompetitor ? 6 : hasProductPage ? 3 : 4;

  return Math.max(
    0,
    Math.min(100, Math.round((businessValue + painSeverity + trendScore + authorityGap + confidence - competition) * 2))
  );
}

export function generateRecommendedActions(
  intelligenceObject: IntelligencePipelineResult["intelligenceObject"],
  now = new Date().toISOString(),
  existingActions: RecommendedAction[] = []
) {
  const sourceType = "IntelligenceObject";
  const sourceId = intelligenceObject.id;
  const actions: Array<Pick<RecommendedAction, "title" | "description" | "actionType" | "priority" | "owner" | "reasoning" | "expectedImpact">> = [];
  const entities = intelligenceObject.detectedEntities;
  const pains = intelligenceObject.detectedPainPoints.join(" ").toLowerCase();
  const hasProductPage = entities.includes("Product Page to Video") || pains.includes("product video");
  const priority: Priority = intelligenceObject.opportunityScore >= 85 ? "CRITICAL" : intelligenceObject.opportunityScore >= 70 ? "HIGH" : "MEDIUM";

  if (hasProductPage) {
    actions.push({
      title: "Create product-page-to-video demo",
      description: "Create product-page-to-video demo showing a source URL becoming a ready-to-post video.",
      actionType: "CREATE_DEMO",
      priority,
      owner: "Growth",
      reasoning: "The signal combines commercial investigation, ecommerce persona fit, and product-page-to-video pain.",
      expectedImpact: "Improves BOFU trust and gives community, landing page, and content teams a concrete proof asset."
    });
    actions.push({
      title: "Update product-page-to-video landing page",
      description: "Add source-to-output proof, FAQ answers, and a product accuracy section to the landing page.",
      actionType: "UPDATE_LANDING_PAGE",
      priority,
      owner: "Growth",
      reasoning: "The detected pain point needs visible proof before prospects believe the workflow claim.",
      expectedImpact: "Turns high-intent demand into a clearer conversion path."
    });
  }

  if (["INFORMATIONAL", "COMMERCIAL"].includes(intelligenceObject.detectedIntent)) {
    actions.push({
      title: "Write answer-ready blog from intelligence signal",
      description: `Turn the signal into an answer-ready article around ${entities[0] ?? "VidMaker workflow intelligence"}.`,
      actionType: "WRITE_BLOG",
      priority,
      owner: "Content",
      reasoning: "Search and answer engines need a structured explanation attached to the detected entity.",
      expectedImpact: "Improves SEO, AEO, and GEO coverage for the market question."
    });
  }

  if (intelligenceObject.detectedIntent === "COMMUNITY_DISCUSSION" || includesAny(intelligenceObject.summary, ["reddit", "linkedin", "product hunt", "hacker news", "thread", "comment"])) {
    actions.push({
      title: "Reply to community signal with useful proof",
      description: "Reply with the clearest demo, short explanation, and source-to-output evidence.",
      actionType: "REPLY_TO_COMMUNITY",
      priority,
      owner: "Community Intelligence",
      reasoning: "Community-originated signals should be closed with helpful, non-generic evidence.",
      expectedImpact: "Creates qualified conversation and captures objections for future content."
    });
  }

  if (entities.includes("Video Production Intelligence") || entities.includes("Purpose-Specific AI")) {
    actions.push({
      title: "Create FAQ block for category language",
      description: "Create FAQ entries that define the entity and connect it to VidMaker workflows.",
      actionType: "CREATE_FAQ",
      priority,
      owner: "AEO Strategy",
      reasoning: "Entity recognition found category language that answer engines need to understand.",
      expectedImpact: "Improves answer coverage and internal linking targets."
    });
  }

  if (includesAny(intelligenceObject.summary, ["directory", "listing", "toolify", "futurepedia"])) {
    actions.push({
      title: "Submit directory listing with entity-rich positioning",
      description: "Submit VidMaker using Video Production Intelligence and product-page-to-video positioning.",
      actionType: "SUBMIT_DIRECTORY",
      priority,
      owner: "Authority",
      reasoning: "The signal shows an authority gap that can be closed through directory submissions.",
      expectedImpact: "Builds authority for VidMaker and category-level entities."
    });
  }

  if (intelligenceObject.detectedKeywords.length > 1) {
    actions.push({
      title: "Add internal links to the strongest related assets",
      description: "Connect related content assets, entity pages, and FAQs around the detected keywords.",
      actionType: "ADD_INTERNAL_LINK",
      priority: priority === "CRITICAL" ? "HIGH" : priority,
      owner: "Content",
      reasoning: "Multiple detected keywords indicate a cluster that should not remain isolated.",
      expectedImpact: "Strengthens topical authority and makes the pipeline output reusable."
    });
  }

  const due = new Date(now);
  due.setDate(due.getDate() + 3);

  return unique(actions.map((action) => action.actionType))
    .map((actionType) => actions.find((action) => action.actionType === actionType))
    .filter((action): action is NonNullable<typeof action> => Boolean(action))
    .filter((action) => sprintActionTypes.includes(action.actionType))
    .slice(0, 4)
    .map((action, index) => {
      const candidate = {
        id: `action-${slug(sourceId)}-${slug(action.actionType)}-${index + 1}`,
        organizationId: intelligenceObject.organizationId,
        workspaceId: intelligenceObject.workspaceId,
        title: action.title,
        description: action.description,
        sourceType,
        sourceId,
        actionType: action.actionType,
        priority: action.priority,
        status: "PENDING" as const,
        dueDate: due.toISOString(),
        owner: action.owner,
        reasoning: action.reasoning,
        expectedImpact: action.expectedImpact,
        confidenceScore: intelligenceObject.confidenceScore,
        qualityScore: 0,
        evidenceStrength: 0,
        missingEvidence: [] as string[],
        duplicateRisk: 0,
        confidenceExplanation: "",
        createdAt: now,
        updatedAt: now
      };
      const duplicate = assessDuplicateRisk(candidate, existingActions);
      const quality = calculateRecommendationConfidence({
        ...candidate,
        summary: candidate.description,
        detectedEntities: intelligenceObject.detectedEntities,
        detectedKeywords: intelligenceObject.detectedKeywords,
        duplicateRisk: duplicate.duplicateRisk
      });
      return {
        ...candidate,
        confidenceScore: quality.confidenceScore,
        qualityScore: quality.qualityScore,
        evidenceStrength: quality.evidenceStrength,
        missingEvidence: quality.missingEvidence,
        duplicateRisk: quality.duplicateRisk,
        confidenceExplanation: quality.confidenceExplanation,
        reviewedAt: now,
        reviewedBy: "VGOS Intelligence Pipeline"
      };
    });
}

export function processIntelligenceRecord(
  record: PipelineSourceRecord,
  options: {
    workspaceId: string;
    organizationId?: string;
    sourceType?: string;
    now?: string;
    existing?: {
      aiRecommendations?: AIRecommendation[];
      recommendedActions?: RecommendedAction[];
    };
  }
): IntelligencePipelineResult {
  const now = options.now ?? new Date().toISOString();
  const text = sourceText(record);
  const summary = sourceSummary(record) || text || "Untitled market signal";
  const detectedIntent = classifyIntent(text);
  const detectedPersona = detectPersona(text);
  const detectedEntities = detectEntities(text);
  const detectedKeywords = detectKeywords(text);
  const detectedPainPoints = extractPainPoints(text);
  const sentiment = detectSentiment(text);
  const confidenceScore = Number(
    Math.min(0.96, Math.max(0.55, Number(record.confidenceScore ?? 0.72) + detectedEntities.length * 0.02 + detectedPainPoints.length * 0.015)).toFixed(2)
  );
  const opportunityScore = calculateOpportunityScore({
    text,
    intent: detectedIntent,
    persona: detectedPersona,
    entities: detectedEntities,
    painPoints: detectedPainPoints,
    confidenceScore,
    sourcePriority: record.priority
  });
  const sourceType = options.sourceType ?? String(record.sourceType ?? "Observation");
  const intelligenceId = `intelligence-${slug(sourceType)}-${slug(record.id)}`;
  const intentLabel = detectedIntent === "COMMERCIAL" ? "Commercial Investigation" : detectedIntent.replace(/_/g, " ");
  const reasoning = [
    `${intentLabel}: the signal asks about VidMaker capability, proof, or workflow fit.`,
    `Persona detected as ${detectedPersona} from source language and use-case clues.`,
    `Opportunity score uses business value + pain severity + trend score + authority gap + confidence - competition.`
  ].join(" ");

  const intelligenceObject = {
    id: intelligenceId,
    organizationId: options.organizationId ?? orgId,
    workspaceId: options.workspaceId,
    sourceType,
    sourceId: record.id,
    summary,
    detectedEntities: detectedEntities.length ? detectedEntities : ["VidMaker"],
    detectedKeywords,
    detectedIntent,
    detectedPersona,
    detectedPainPoints,
    sentiment,
    opportunityScore,
    confidenceScore,
    reasoning,
    createdAt: now,
    updatedAt: now
  };

  const recommendedActions = generateRecommendedActions(intelligenceObject, now, options.existing?.recommendedActions ?? []);
  const primaryAction = recommendedActions[0];
  const aiRecommendationCandidate: AIRecommendation = {
    id: `ai-rec-${slug(intelligenceId)}`,
    organizationId: intelligenceObject.organizationId,
    workspaceId: intelligenceObject.workspaceId,
    title: primaryAction?.title ?? `Review intelligence signal: ${summary.slice(0, 72)}`,
    description: primaryAction?.description ?? summary,
    source: "Intelligence Pipeline",
    url: String(record.url ?? record.sourceUrl ?? "https://vidmaker.com"),
    status: "RESEARCHING",
    priority: primaryAction?.priority ?? "HIGH",
    owner: primaryAction?.owner ?? "Growth Intelligence",
    recommendationType:
      primaryAction?.actionType === "CREATE_FAQ"
        ? "FAQ"
        : primaryAction?.actionType === "UPDATE_LANDING_PAGE"
          ? "LANDING_PAGE"
          : primaryAction?.actionType === "REPLY_TO_COMMUNITY"
            ? "COMMUNITY_REPLY"
            : "BLOG_IDEA",
    targetEntityType: "IntelligenceObject",
    targetEntityId: intelligenceObject.id,
    suggestedAction: primaryAction?.description ?? "Review the intelligence result and choose the next growth action.",
    reasoning: intelligenceObject.reasoning,
    confidenceScore: intelligenceObject.confidenceScore,
    qualityScore: 0,
    evidenceStrength: 0,
    missingEvidence: [],
    duplicateRisk: 0,
    confidenceExplanation: "",
    generatedBy: "VGOS Intelligence Pipeline",
    createdAt: now,
    updatedAt: now
  };
  const aiDuplicate = assessDuplicateRisk(aiRecommendationCandidate, options.existing?.aiRecommendations ?? []);
  const aiQuality = calculateRecommendationConfidence({
    ...aiRecommendationCandidate,
    summary: aiRecommendationCandidate.description,
    sourceType: aiRecommendationCandidate.targetEntityType,
    sourceId: aiRecommendationCandidate.targetEntityId,
    detectedEntities: intelligenceObject.detectedEntities,
    detectedKeywords: intelligenceObject.detectedKeywords,
    duplicateRisk: aiDuplicate.duplicateRisk
  });
  const aiRecommendation: AIRecommendation = {
    ...aiRecommendationCandidate,
    confidenceScore: aiQuality.confidenceScore,
    qualityScore: aiQuality.qualityScore,
    evidenceStrength: aiQuality.evidenceStrength,
    missingEvidence: aiQuality.missingEvidence,
    duplicateRisk: aiQuality.duplicateRisk,
    confidenceExplanation: aiQuality.confidenceExplanation,
    reviewedAt: now,
    reviewedBy: "VGOS Intelligence Pipeline"
  };

  return {
    intelligenceObject,
    aiRecommendation,
    recommendedActions
  };
}

export const ruleBasedIntelligenceProvider: IntelligenceProvider = {
  async process(record, options) {
    return processIntelligenceRecord(record, options);
  }
};
