import type { KnowledgeObject, KnowledgeObjectType } from "@/lib/vgos-data";

export type SemanticSearchOptions = {
  workspaceId?: string;
  objectType?: KnowledgeObjectType | "ALL";
  limit?: number;
  minScore?: number;
};

export type SemanticSearchResult = {
  object: KnowledgeObject;
  score: number;
  matchedTerms: string[];
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);
}

function uniqueTerms(value: string) {
  return [...new Set(tokenize(value))];
}

export function buildSearchableText(input: Partial<KnowledgeObject> & Record<string, unknown>) {
  return [
    input.title,
    input.summary,
    input.description,
    input.sourceType,
    input.sourceId,
    Array.isArray(input.aliases) ? input.aliases.join(" ") : "",
    Array.isArray(input.tags) ? input.tags.join(" ") : "",
    input.metadata ? JSON.stringify(input.metadata) : ""
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function prepareObjectForEmbedding(object: KnowledgeObject) {
  const searchableText = buildSearchableText(object);
  return {
    ...object,
    searchableText,
    embeddingProvider: object.embeddingProvider ?? "mock",
    embeddingModel: object.embeddingModel ?? "keyword-similarity-v0",
    embeddingUpdatedAt: new Date().toISOString()
  };
}

export function mockSemanticSearch(
  query: string,
  objects: KnowledgeObject[],
  options: SemanticSearchOptions = {}
): SemanticSearchResult[] {
  const queryTerms = uniqueTerms(query);
  if (queryTerms.length === 0) return [];

  return objects
    .filter((object) => !options.workspaceId || object.workspaceId === options.workspaceId)
    .filter((object) => !options.objectType || options.objectType === "ALL" || object.objectType === options.objectType)
    .map((object) => {
      const searchableText = object.searchableText || buildSearchableText(object);
      const objectTerms = uniqueTerms(searchableText);
      const matchedTerms = queryTerms.filter((term) => objectTerms.includes(term) || searchableText.toLowerCase().includes(term));
      const overlapScore = matchedTerms.length / Math.max(queryTerms.length, 1);
      const authorityBoost = object.importanceScore / 100;
      const confidenceBoost = object.confidenceScore;
      const score = Number(((overlapScore * 0.68 + authorityBoost * 0.2 + confidenceBoost * 0.12) * 100).toFixed(2));
      return { object, score, matchedTerms };
    })
    .filter((result) => result.score >= (options.minScore ?? 18))
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit ?? 10);
}

export function findSimilarKnowledgeObjects(
  object: KnowledgeObject,
  objects: KnowledgeObject[],
  limit = 6
) {
  return mockSemanticSearch(object.searchableText || buildSearchableText(object), objects, {
    workspaceId: object.workspaceId,
    limit: limit + 1
  }).filter((result) => result.object.id !== object.id).slice(0, limit);
}

export function searchKnowledgeObjects(
  query: string,
  objects: KnowledgeObject[],
  options: SemanticSearchOptions = {}
) {
  return mockSemanticSearch(query, objects, options);
}

