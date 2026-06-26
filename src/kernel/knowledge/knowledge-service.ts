import {
  createScopedId,
  orgId,
  type KnowledgeObject,
  type KnowledgeObjectType,
  type KnowledgeRelationship,
  type KnowledgeRelationshipType,
  type PlatformState,
  type Status
} from "@/lib/vgos-data";
import { buildSearchableText, findSimilarKnowledgeObjects } from "@/kernel/knowledge/semantic-search";

export type KnowledgeContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type KnowledgeSource = Record<string, unknown> & {
  id?: string;
  title?: string;
  name?: string;
  topic?: string;
  summary?: string;
  description?: string;
  notes?: string;
  source?: string;
  url?: string;
  status?: Status;
  priority?: string;
};

export type CreateKnowledgeObjectInput = {
  objectType: KnowledgeObjectType;
  title: string;
  summary?: string;
  description?: string;
  sourceType: string;
  sourceId: string;
  canonicalId?: string;
  canonicalEntityId?: string;
  aliases?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  importanceScore?: number;
  confidenceScore?: number;
  status?: Status;
};

export type LinkKnowledgeObjectsInput = {
  fromObjectId: string;
  toObjectId: string;
  relationshipType: KnowledgeRelationshipType;
  strength?: number;
  evidence?: string;
  metadata?: Record<string, unknown>;
};

const sourceTypeMap: Record<string, KnowledgeObjectType> = {
  Entity: "ENTITY",
  Question: "QUESTION",
  PainPoint: "PAIN_POINT",
  ContentAsset: "CONTENT_ASSET",
  Keyword: "KEYWORD",
  Persona: "PERSONA",
  Competitor: "COMPETITOR",
  Community: "COMMUNITY",
  Memory: "MEMORY",
  Pattern: "PATTERN",
  Insight: "INSIGHT",
  AIRecommendation: "RECOMMENDATION",
  FeatureRequest: "FEATURE_REQUEST",
  Campaign: "CAMPAIGN",
  Experiment: "EXPERIMENT",
  Objective: "OBJECTIVE",
  Backlink: "BACKLINK",
  DirectorySubmission: "DIRECTORY",
  Observation: "PRODUCT_SIGNAL"
};

function sourceTitle(source: KnowledgeSource) {
  return String(source.title ?? source.name ?? source.topic ?? source.summary ?? source.id ?? "Untitled knowledge object");
}

function sourceSummary(source: KnowledgeSource) {
  return String(source.summary ?? source.description ?? source.notes ?? source.title ?? source.name ?? "");
}

export function generateCanonicalId(input: string) {
  const slug = input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `KO-${slug || "OBJECT"}`;
}

export function normalizeAliases(aliases: string[] = []) {
  return [...new Set(aliases.map((alias) => alias.trim()).filter(Boolean))];
}

export function createKnowledgeObject(
  input: CreateKnowledgeObjectInput,
  context: KnowledgeContext
): KnowledgeObject {
  const now = context.now ?? new Date().toISOString();
  const base = {
    id: createScopedId("knowledge-object"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    createdAt: now,
    updatedAt: now
  };
  const aliases = normalizeAliases(input.aliases);
  const object = {
    ...base,
    canonicalId: input.canonicalId ?? generateCanonicalId(input.title),
    objectType: input.objectType,
    title: input.title,
    summary: input.summary ?? input.description ?? input.title,
    description: input.description ?? input.summary ?? input.title,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    canonicalEntityId: input.canonicalEntityId,
    aliases,
    tags: [...new Set(input.tags ?? [])],
    metadata: input.metadata ?? {},
    searchableText: "",
    embeddingProvider: undefined,
    embeddingModel: undefined,
    embeddingVector: undefined,
    embeddingUpdatedAt: undefined,
    importanceScore: input.importanceScore ?? 50,
    confidenceScore: input.confidenceScore ?? 0.7,
    status: input.status ?? "RESEARCHING"
  };
  return {
    ...object,
    searchableText: buildSearchableText(object)
  };
}

export function upsertKnowledgeObjectFromSource(
  objects: KnowledgeObject[],
  sourceType: string,
  source: KnowledgeSource,
  context: KnowledgeContext
) {
  const objectType = sourceTypeMap[sourceType] ?? "INSIGHT";
  const title = sourceTitle(source);
  const sourceId = String(source.id ?? createScopedId(sourceType.toLowerCase()));
  const canonicalId = generateCanonicalId(`${sourceType}-${title}`);
  const existing = findKnowledgeObjectByCanonicalId(objects, context.workspaceId, canonicalId);
  const nextObject = createKnowledgeObject(
    {
      objectType,
      title,
      summary: sourceSummary(source),
      description: sourceSummary(source),
      sourceType,
      sourceId,
      canonicalId,
      aliases: [String(source.name ?? source.topic ?? "")].filter(Boolean),
      tags: [sourceType, objectType.toLowerCase()],
      metadata: { sourceUrl: source.url, priority: source.priority },
      importanceScore: source.priority === "CRITICAL" ? 95 : source.priority === "HIGH" ? 84 : 62,
      confidenceScore: Number(source.confidenceScore ?? 0.74),
      status: source.status ?? "RESEARCHING"
    },
    context
  );

  if (!existing) {
    return { object: nextObject, objects: [nextObject, ...objects] };
  }

  const updated = {
    ...existing,
    ...nextObject,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: context.now ?? new Date().toISOString()
  };
  return {
    object: updated,
    objects: objects.map((object) => (object.id === existing.id ? updated : object))
  };
}

export function linkKnowledgeObjects(
  input: LinkKnowledgeObjectsInput,
  context: KnowledgeContext
): KnowledgeRelationship {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("knowledge-rel"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    fromObjectId: input.fromObjectId,
    toObjectId: input.toObjectId,
    relationshipType: input.relationshipType,
    strength: input.strength ?? 0.5,
    evidence: input.evidence ?? "Created by VGOS knowledge service.",
    metadata: input.metadata ?? {},
    createdAt: now,
    updatedAt: now
  };
}

export function findKnowledgeObjectByCanonicalId(
  objects: KnowledgeObject[],
  workspaceId: string,
  canonicalId: string
) {
  return objects.find((object) => object.workspaceId === workspaceId && object.canonicalId === canonicalId);
}

export function findRelatedKnowledgeObjects(
  objects: KnowledgeObject[],
  relationships: KnowledgeRelationship[],
  objectId: string,
  limit = 10
) {
  const relatedIds = relationships
    .filter((relationship) => relationship.fromObjectId === objectId || relationship.toObjectId === objectId)
    .sort((a, b) => b.strength - a.strength)
    .map((relationship) => (relationship.fromObjectId === objectId ? relationship.toObjectId : relationship.fromObjectId));
  return relatedIds
    .map((id) => objects.find((object) => object.id === id))
    .filter(Boolean)
    .slice(0, limit) as KnowledgeObject[];
}

export function getKnowledgeContextForSource(
  state: PlatformState,
  workspaceId: string,
  sourceType: string,
  sourceId: string,
  limit = 8
) {
  const sourceObject = state.knowledgeObjects.find(
    (object) => object.workspaceId === workspaceId && object.sourceType === sourceType && object.sourceId === sourceId
  );
  if (!sourceObject) {
    return {
      sourceObject: undefined,
      relatedObjects: [],
      similarObjects: []
    };
  }

  return {
    sourceObject,
    relatedObjects: findRelatedKnowledgeObjects(state.knowledgeObjects, state.knowledgeRelationships, sourceObject.id, limit),
    similarObjects: findSimilarKnowledgeObjects(sourceObject, state.knowledgeObjects, limit).map((result) => result.object)
  };
}

export function createEntityKnowledgeObject(
  title: string,
  summary: string,
  context: KnowledgeContext,
  aliases: string[] = []
) {
  return createKnowledgeObject({
    objectType: "ENTITY",
    title,
    summary,
    description: summary,
    sourceType: "Entity",
    sourceId: generateCanonicalId(title).toLowerCase(),
    canonicalId: generateCanonicalId(title),
    aliases,
    tags: ["entity"],
    importanceScore: 90,
    confidenceScore: 0.86,
    status: "RESEARCHING"
  }, context);
}

export function createContentKnowledgeObject(source: KnowledgeSource, context: KnowledgeContext) {
  return createKnowledgeObject({
    objectType: "CONTENT_ASSET",
    title: sourceTitle(source),
    summary: sourceSummary(source),
    sourceType: "ContentAsset",
    sourceId: String(source.id ?? createScopedId("content")),
    tags: ["content", "asset"],
    importanceScore: source.priority === "CRITICAL" ? 94 : 78,
    confidenceScore: Number(source.confidenceScore ?? 0.78),
    status: source.status ?? "RESEARCHING"
  }, context);
}

export function createQuestionKnowledgeObject(source: KnowledgeSource, context: KnowledgeContext) {
  return createKnowledgeObject({
    objectType: "QUESTION",
    title: sourceTitle(source),
    summary: sourceSummary(source),
    sourceType: "Question",
    sourceId: String(source.id ?? createScopedId("question")),
    tags: ["question", "aeo"],
    importanceScore: source.priority === "CRITICAL" ? 96 : 82,
    confidenceScore: Number(source.confidenceScore ?? 0.82),
    status: source.status ?? "RESEARCHING"
  }, context);
}

export function createPatternKnowledgeObject(source: KnowledgeSource, context: KnowledgeContext) {
  return createKnowledgeObject({
    objectType: "PATTERN",
    title: sourceTitle(source),
    summary: sourceSummary(source),
    sourceType: "Pattern",
    sourceId: String(source.id ?? createScopedId("pattern")),
    tags: ["pattern", "memory"],
    importanceScore: Number(source.importanceScore ?? 80),
    confidenceScore: Number(source.confidenceScore ?? 0.78),
    status: source.status ?? "RESEARCHING"
  }, context);
}

