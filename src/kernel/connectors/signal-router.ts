import {
  createScopedId,
  orgId,
  type Attribution,
  type Backlink,
  type ContentAsset,
  type Event,
  type IntelligenceObject,
  type Keyword,
  type KnowledgeObject,
  type Measurement,
  type Memory,
  type Metric,
  type NormalizedSignal,
  type Observation,
  type Question,
  type CoreRecord
} from "@/lib/vgos-data";
import type { ConnectorContext, RoutedSignalResult } from "@/kernel/connectors/connector-types";

function base(context: ConnectorContext, now: string) {
  return {
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    createdAt: now,
    updatedAt: now
  };
}

function opportunity(signal: NormalizedSignal) {
  const confidence = Math.round(signal.confidenceScore * 10);
  return {
    searchVolumeEstimate: signal.signalType === "SEARCH_QUERY" ? 1200 : 200,
    businessValueScore: signal.priority === "CRITICAL" ? 10 : signal.priority === "HIGH" ? 8 : 6,
    painSeverityScore: signal.priority === "CRITICAL" ? 9 : 7,
    competitionScore: 4,
    trendScore: confidence,
    authorityGapScore: signal.signalType === "SEARCH_QUERY" ? 8 : 6,
    opportunityScore: (signal.priority === "CRITICAL" ? 10 : 8) * 9 * confidence - 4
  };
}

export function routeSignalToKernel(signal: NormalizedSignal, context: ConnectorContext): RoutedSignalResult {
  const now = context.now ?? new Date().toISOString();
  const scoped = base(context, now);
  const result: RoutedSignalResult = {
    signalId: signal.id,
    routedCollections: [],
    events: [
      {
        id: createScopedId("event"),
        organizationId: scoped.organizationId,
        workspaceId: scoped.workspaceId,
        eventType: "SIGNAL_ROUTED",
        sourceType: "NormalizedSignal",
        sourceId: signal.id,
        title: `${signal.title} routed`,
        description: signal.summary,
        metadata: { signalType: signal.signalType, connectorId: signal.connectorId },
        severity: signal.priority === "CRITICAL" ? "CRITICAL" : "HIGH",
        status: "PROCESSED",
        createdAt: now,
        processedAt: now
      }
    ],
    observations: [],
    conversations: [],
    questions: [],
    keywords: [],
    intelligenceObjects: [],
    memories: [],
    metrics: [],
    measurements: [],
    attributions: [],
    backlinks: [],
    contentAssets: [],
    knowledgeObjects: []
  };

  const addIntelligence = () => {
    result.intelligenceObjects.push({
      id: createScopedId("intelligence"),
      ...scoped,
      sourceType: "NormalizedSignal",
      sourceId: signal.id,
      summary: signal.summary,
      detectedEntities: ["VidMaker", "Video Production Intelligence"],
      detectedKeywords: [signal.title],
      detectedIntent: signal.signalType === "SEARCH_QUERY" ? "INFORMATIONAL" : "COMMUNITY_DISCUSSION",
      detectedPersona: signal.platform?.includes("Product Hunt") ? "SaaS Team" : "Ecommerce Brand",
      detectedPainPoints: signal.summary.toLowerCase().includes("generic") ? ["Generic AI video tools lack control"] : [],
      sentiment: signal.priority === "CRITICAL" ? "urgent" : "neutral",
      opportunityScore: signal.priority === "CRITICAL" ? 92 : signal.priority === "HIGH" ? 80 : 64,
      confidenceScore: signal.confidenceScore,
      reasoning: `Connected Intelligence routed ${signal.signalType} through the normalized signal kernel.`
    });
    result.routedCollections.push("intelligenceObjects");
  };

  if (signal.signalType === "SEARCH_QUERY") {
    result.questions.push({
      id: createScopedId("question"),
      ...scoped,
      title: signal.title,
      description: signal.summary,
      source: signal.platform ?? "Search Console",
      url: signal.sourceUrl,
      status: "RESEARCHING",
      priority: signal.priority,
      owner: "Search",
      intent: "INFORMATIONAL",
      funnelStage: "TOFU",
      personaIds: [],
      contentAssetIds: [],
      ...opportunity(signal)
    } as Question);
    result.keywords.push({
      id: createScopedId("keyword"),
      ...scoped,
      name: signal.title,
      title: signal.title,
      description: signal.summary,
      source: signal.platform ?? "Search Console",
      url: signal.sourceUrl,
      status: "RESEARCHING",
      priority: signal.priority,
      owner: "Search",
      intent: "INFORMATIONAL",
      funnelStage: "TOFU"
    } as Keyword);
    result.routedCollections.push("questions", "keywords");
    addIntelligence();
  } else if (signal.signalType === "TRAFFIC_CHANGE" || signal.signalType === "REFERRAL_TRAFFIC") {
    const metric: Metric = {
      id: createScopedId("metric"),
      ...scoped,
      name: signal.title,
      title: signal.title,
      description: signal.summary,
      metricType: signal.signalType === "REFERRAL_TRAFFIC" ? "TRAFFIC" : "CUSTOM",
      source: signal.platform ?? "Analytics",
      unit: "visits",
      currentValue: 100,
      previousValue: 82,
      targetValue: 140,
      status: "IMPROVING",
      owner: "Growth"
    };
    result.metrics.push(metric);
    result.measurements.push({
      id: createScopedId("measurement"),
      ...scoped,
      metricId: metric.id,
      sourceType: "NormalizedSignal",
      sourceId: signal.id,
      measuredAt: signal.occurredAt,
      value: 100,
      previousValue: 82,
      changeValue: 18,
      changePercent: 21.95,
      notes: signal.summary
    });
    if (signal.signalType === "REFERRAL_TRAFFIC") {
      result.attributions.push({
        id: createScopedId("attribution"),
        ...scoped,
        sourceType: "NormalizedSignal",
        sourceId: signal.id,
        targetType: "Metric",
        targetId: metric.id,
        attributionType: "INFLUENCED",
        confidenceScore: signal.confidenceScore,
        evidence: signal.summary
      });
    }
    result.routedCollections.push("metrics", "measurements", "attributions");
  } else if (signal.signalType === "PRODUCT_HUNT_COMMENT" || signal.signalType === "SOCIAL_COMMENT") {
    result.observations.push({
      id: createScopedId("observation"),
      ...scoped,
      title: signal.title,
      source: signal.platform ?? "Social",
      sourceUrl: signal.sourceUrl ?? "https://vidmaker.com",
      rawText: signal.summary,
      summary: signal.summary,
      platform: signal.platform ?? "External",
      sentiment: signal.priority === "CRITICAL" ? "urgent" : "neutral",
      confidenceScore: signal.confidenceScore
    });
    result.routedCollections.push("observations");
    addIntelligence();
    if (signal.signalType === "PRODUCT_HUNT_COMMENT") {
      result.memories.push({
        id: createScopedId("memory"),
        ...scoped,
        topic: signal.title,
        entity: "VidMaker",
        summary: signal.summary,
        sourceTypes: ["NormalizedSignal"],
        linkedSourceIds: [signal.id],
        firstSeen: signal.occurredAt,
        lastSeen: now,
        frequency: 1,
        confidenceScore: signal.confidenceScore,
        importanceScore: signal.priority === "CRITICAL" ? 90 : 75,
        status: "RESEARCHING"
      });
      result.routedCollections.push("memories");
    }
  } else if (signal.signalType === "COMMUNITY_THREAD") {
    const conversation: CoreRecord = {
      id: createScopedId("conversation"),
      ...scoped,
      title: signal.title,
      description: signal.summary,
      source: signal.platform ?? "Community",
      url: signal.sourceUrl,
      status: "RESEARCHING",
      priority: signal.priority,
      owner: "Community Intelligence"
    };
    result.conversations.push(conversation);
    result.questions.push({
      id: createScopedId("question"),
      ...scoped,
      title: signal.title,
      description: signal.summary,
      source: signal.platform ?? "Community",
      url: signal.sourceUrl,
      status: "RESEARCHING",
      priority: signal.priority,
      owner: "Community Intelligence",
      intent: "COMMUNITY_DISCUSSION",
      funnelStage: "MOFU",
      conversationId: conversation.id,
      personaIds: [],
      contentAssetIds: [],
      ...opportunity(signal)
    } as Question);
    result.routedCollections.push("conversations", "questions");
    addIntelligence();
  } else if (signal.signalType === "GITHUB_RELEASE" || signal.signalType === "CMS_ARTICLE") {
    result.knowledgeObjects.push({
      id: createScopedId("knowledge-object"),
      ...scoped,
      canonicalId: `KO-${signal.id}`,
      objectType: signal.signalType === "CMS_ARTICLE" ? "CONTENT_ASSET" : "PRODUCT_SIGNAL",
      title: signal.title,
      summary: signal.summary,
      description: signal.summary,
      sourceType: "NormalizedSignal",
      sourceId: signal.id,
      aliases: [],
      tags: [signal.signalType, signal.platform ?? "external"],
      metadata: { sourceUrl: signal.sourceUrl },
      searchableText: `${signal.title} ${signal.summary}`,
      importanceScore: signal.priority === "CRITICAL" ? 90 : 75,
      confidenceScore: signal.confidenceScore,
      status: "RESEARCHING"
    });
    result.routedCollections.push("knowledgeObjects");
    if (signal.signalType === "CMS_ARTICLE") {
      result.contentAssets.push({
        id: createScopedId("content"),
        ...scoped,
        code: `CMS-${signal.id}`,
        title: signal.title,
        description: signal.summary,
        source: signal.platform ?? "CMS",
        url: signal.sourceUrl,
        status: "PUBLISHED",
        priority: signal.priority,
        owner: "Content",
        contentType: "BLOG",
        intent: "INFORMATIONAL",
        funnelStage: "TOFU",
        personaIds: [],
        questionIds: [],
        keywordIds: [],
        entityIds: [],
        campaignIds: []
      } as ContentAsset);
      result.routedCollections.push("contentAssets");
    }
  } else if (signal.signalType === "BACKLINK_FOUND") {
    const backlink: Backlink = {
      id: createScopedId("backlink"),
      ...scoped,
      title: signal.title,
      description: signal.summary,
      source: signal.platform ?? "Manual Import",
      url: signal.sourceUrl,
      status: "LIVE",
      priority: signal.priority,
      owner: "Authority",
      targetUrl: "https://vidmaker.com"
    };
    result.backlinks.push(backlink);
    result.measurements.push({
      id: createScopedId("measurement"),
      ...scoped,
      metricId: "metric-backlinks",
      sourceType: "Backlink",
      sourceId: backlink.id,
      measuredAt: signal.occurredAt,
      value: 1,
      previousValue: 0,
      changeValue: 1,
      changePercent: 100,
      notes: signal.summary
    });
    result.attributions.push({
      id: createScopedId("attribution"),
      ...scoped,
      sourceType: "Backlink",
      sourceId: backlink.id,
      targetType: "Metric",
      targetId: "metric-backlinks",
      attributionType: "SUPPORTED",
      confidenceScore: signal.confidenceScore,
      evidence: signal.summary
    });
    result.routedCollections.push("backlinks", "measurements", "attributions");
  } else {
    result.observations.push({
      id: createScopedId("observation"),
      ...scoped,
      title: signal.title,
      source: signal.platform ?? "External",
      sourceUrl: signal.sourceUrl ?? "https://vidmaker.com",
      rawText: signal.summary,
      summary: signal.summary,
      platform: signal.platform ?? "External",
      sentiment: "neutral",
      confidenceScore: signal.confidenceScore
    });
    result.routedCollections.push("observations");
    addIntelligence();
  }

  return result;
}
