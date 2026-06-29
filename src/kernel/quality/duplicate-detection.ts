import type { DuplicateMatch, QualityEntity } from "@/kernel/quality/quality-types";

function normalizedText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: unknown) {
  return new Set(normalizedText(value).split(" ").filter((token) => token.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>) {
  if (!a.size && !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / Math.max(union, 1);
}

function sharedListScore(a: unknown[] = [], b: unknown[] = []) {
  const left = new Set(a.map((item) => normalizedText(item)).filter(Boolean));
  const right = new Set(b.map((item) => normalizedText(item)).filter(Boolean));
  return jaccard(left, right);
}

function titleOf(item: QualityEntity) {
  return item.title ?? item.name ?? item.summary ?? item.description ?? item.id ?? "";
}

function textOf(item: QualityEntity) {
  return [
    item.title,
    item.name,
    item.summary,
    item.description,
    item.reasoning,
    item.source,
    item.sourceType
  ].filter(Boolean).join(" ");
}

export function calculateSimilarity(a: QualityEntity, b: QualityEntity) {
  const reasons: string[] = [];
  const titleSimilarity = jaccard(tokens(titleOf(a)), tokens(titleOf(b)));
  const bodySimilarity = jaccard(tokens(textOf(a)), tokens(textOf(b)));
  const entitySimilarity = sharedListScore(a.detectedEntities ?? a.tags, b.detectedEntities ?? b.tags);
  const keywordSimilarity = sharedListScore(a.detectedKeywords ?? a.tags, b.detectedKeywords ?? b.tags);
  const sourceMatch = Boolean(a.sourceType && a.sourceId && a.sourceType === b.sourceType && a.sourceId === b.sourceId);
  const canonicalMatch = Boolean(a.canonicalId && a.canonicalId === b.canonicalId);

  if (titleSimilarity >= 0.65) reasons.push("Similar title");
  if (bodySimilarity >= 0.65) reasons.push("Similar body text");
  if (entitySimilarity >= 0.5) reasons.push("Shared entities");
  if (keywordSimilarity >= 0.5) reasons.push("Shared keywords");
  if (sourceMatch) reasons.push("Same source record");
  if (canonicalMatch) reasons.push("Same canonical ID");

  const similarity = Math.min(
    1,
    titleSimilarity * 0.32 +
      bodySimilarity * 0.26 +
      entitySimilarity * 0.14 +
      keywordSimilarity * 0.12 +
      (sourceMatch ? 0.18 : 0) +
      (canonicalMatch ? 0.24 : 0)
  );

  return {
    similarity: Number(similarity.toFixed(2)),
    reasons
  };
}

function detectDuplicates<T extends QualityEntity>(items: T[], threshold: number): DuplicateMatch<T>[] {
  const matches: DuplicateMatch<T>[] = [];

  for (let index = 0; index < items.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < items.length; compareIndex += 1) {
      const result = calculateSimilarity(items[index], items[compareIndex]);
      if (result.similarity >= threshold) {
        matches.push({
          item: items[compareIndex],
          duplicateOf: items[index],
          similarity: result.similarity,
          duplicateRisk: result.similarity,
          reasons: result.reasons.length ? result.reasons : ["Rule-based similarity threshold exceeded"]
        });
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

export function detectDuplicateInsights<T extends QualityEntity>(items: T[], threshold = 0.68) {
  return detectDuplicates(items, threshold);
}

export function detectDuplicateRecommendations<T extends QualityEntity>(items: T[], threshold = 0.7) {
  return detectDuplicates(items, threshold);
}

export function findDuplicateRisk(item: QualityEntity, existing: QualityEntity[], threshold = 0.7) {
  const best = existing
    .map((candidate) => ({ candidate, ...calculateSimilarity(item, candidate) }))
    .sort((a, b) => b.similarity - a.similarity)[0];

  if (!best || best.similarity < threshold) {
    return { duplicateRisk: best?.similarity ?? 0, duplicateOf: undefined, reasons: best?.reasons ?? [] };
  }

  return {
    duplicateRisk: best.similarity,
    duplicateOf: best.candidate,
    reasons: best.reasons
  };
}
export function assessDuplicateRisk<T extends QualityEntity>(
  item: T,
  existing: QualityEntity[],
  threshold = 0.7
) {
  const result = findDuplicateRisk(item, existing, threshold);
  return {
    duplicateRisk: Number(result.duplicateRisk.toFixed(2)),
    duplicateOf: result.duplicateOf,
    duplicateReasons: result.reasons,
    isLikelyDuplicate: result.duplicateRisk >= threshold
  };
}

