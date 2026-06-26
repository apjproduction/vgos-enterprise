import {
  createScopedId,
  orgId,
  type Memory,
  type Pattern,
  type PatternType,
  type TrendDirection
} from "@/lib/vgos-data";

function makePattern(
  memory: Memory,
  patternType: PatternType,
  title: string,
  trendDirection: TrendDirection = "STABLE"
): Pattern {
  const now = new Date().toISOString();
  return {
    id: createScopedId("pattern"),
    organizationId: memory.organizationId ?? orgId,
    workspaceId: memory.workspaceId,
    title,
    description: `${title} Evidence comes from recurring memory: ${memory.topic}.`,
    patternType,
    relatedEntity: memory.entity,
    evidence: { memoryIds: [memory.id], sourceTypes: memory.sourceTypes },
    frequency: memory.frequency,
    trendDirection,
    confidenceScore: memory.confidenceScore,
    importanceScore: memory.importanceScore,
    status: "RESEARCHING",
    createdAt: now,
    updatedAt: now
  };
}

export function detectRecurringQuestions(memories: Memory[]) {
  return memories
    .filter((memory) => /ask|question|demand|curiosity/i.test(memory.topic + memory.summary))
    .map((memory) => makePattern(memory, "RECURRING_QUESTION", `Recurring question: ${memory.topic}`, "RISING"));
}

export function detectCompetitorComplaints(memories: Memory[]) {
  return memories
    .filter((memory) => /complaint|cleanup|generic|competitor|skeptic/i.test(memory.topic + memory.summary))
    .map((memory) => makePattern(memory, "COMPETITOR_COMPLAINT", `Competitor complaint: ${memory.topic}`, "RISING"));
}

export function detectContentGaps(memories: Memory[]) {
  return memories
    .filter((memory) => /example|demo|proof|faq|article|content/i.test(memory.topic + memory.summary))
    .map((memory) => makePattern(memory, "CONTENT_GAP", `Content gap: ${memory.topic}`, "RISING"));
}

export function detectProductDemand(memories: Memory[]) {
  return memories
    .filter((memory) => /need|demand|automation|workflow|product/i.test(memory.topic + memory.summary))
    .map((memory) => makePattern(memory, "PRODUCT_DEMAND", `Product demand: ${memory.topic}`, "RISING"));
}

export function detectAuthorityOpportunities(memories: Memory[]) {
  return memories
    .filter((memory) => /authority|directory|backlink|visibility|category/i.test(memory.topic + memory.summary))
    .map((memory) => makePattern(memory, "AUTHORITY_OPPORTUNITY", `Authority opportunity: ${memory.topic}`, "STABLE"));
}

export function generatePatternFromMemory(memory: Memory) {
  if (/directory|authority|backlink/i.test(memory.topic + memory.summary)) {
    return makePattern(memory, "AUTHORITY_OPPORTUNITY", `Authority opportunity: ${memory.topic}`, "STABLE");
  }
  if (/question|ask/i.test(memory.topic + memory.summary)) {
    return makePattern(memory, "RECURRING_QUESTION", `Recurring question: ${memory.topic}`, "RISING");
  }
  if (/demo|proof|content|example/i.test(memory.topic + memory.summary)) {
    return makePattern(memory, "CONTENT_GAP", `Content gap: ${memory.topic}`, "RISING");
  }
  return makePattern(memory, "PRODUCT_DEMAND", `Product demand: ${memory.topic}`, "STABLE");
}
