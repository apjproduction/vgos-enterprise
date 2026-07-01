import type { FoundationRegistry, FoundationSearchResult } from "../types/foundation";
import { getRegistryItems } from "../registry/registry";

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function scoreText(query: string, text: string): number {
  const normalizedQuery = normalize(query);
  const normalizedText = normalize(text);

  if (!normalizedQuery) return 0;
  if (normalizedText === normalizedQuery) return 100;
  if (normalizedText.includes(normalizedQuery)) return 50;

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const matches = queryTokens.filter((token) => normalizedText.includes(token)).length;
  return matches > 0 ? Math.round((matches / queryTokens.length) * 25) : 0;
}

function summarize(item: Record<string, unknown>): string {
  const purpose = item.purpose;
  const definition = item.definition;
  const statement = item.statement;

  if (typeof purpose === "string") return purpose;
  if (typeof definition === "string") return definition;
  if (typeof statement === "string") return statement;
  return "Foundation registry item.";
}

export function searchFoundation(registry: FoundationRegistry, query: string): FoundationSearchResult[] {
  const items = getRegistryItems(registry);

  return items
    .map((item) => {
      const searchable = [
        item.id,
        item.name,
        "purpose" in item ? item.purpose : "",
        "definition" in item ? item.definition : "",
        "statement" in item ? item.statement : "",
        "category" in item ? item.category : "",
        "domain" in item ? item.domain : "",
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: item.id,
        type: item.type,
        name: item.name,
        summary: summarize(item),
        score: scoreText(query, searchable),
      } satisfies FoundationSearchResult;
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
