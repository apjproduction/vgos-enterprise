import {
  createScopedId,
  orgId,
  type Memory,
  type MemorySnapshot,
  type Observation,
  type Status,
  type TrendDirection
} from "@/lib/vgos-data";

function textOf(input: Partial<Observation> & Record<string, unknown>) {
  return String(input.summary ?? input.rawText ?? input.description ?? input.title ?? "");
}

function inferTopic(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("product page") || lower.includes("url")) return "Product-page-to-video demand";
  if (lower.includes("purpose-specific")) return "Purpose-Specific AI curiosity";
  if (lower.includes("cleanup") || lower.includes("generic")) return "Generic AI video output complaints";
  if (lower.includes("product hunt")) return "Product Hunt launch feedback";
  return "VidMaker growth signal";
}

function inferEntity(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("product page")) return "Product Page to Video";
  if (lower.includes("video production intelligence")) return "Video Production Intelligence";
  if (lower.includes("purpose-specific")) return "Purpose-Specific AI";
  if (lower.includes("directory")) return "Authority";
  return "VidMaker";
}

export function createMemoryFromObservation(
  observation: Partial<Observation> & Record<string, unknown>,
  workspaceId: string
): Memory {
  const now = new Date().toISOString();
  const text = textOf(observation);
  return {
    id: createScopedId("memory"),
    organizationId: String(observation.organizationId ?? orgId),
    workspaceId,
    topic: inferTopic(text),
    entity: inferEntity(text),
    summary: text || "New VidMaker memory",
    sourceTypes: ["Observation"],
    linkedSourceIds: observation.id ? [String(observation.id)] : [],
    firstSeen: now,
    lastSeen: now,
    frequency: 1,
    confidenceScore: Number(observation.confidenceScore ?? 0.7),
    importanceScore: text.toLowerCase().includes("product page") ? 90 : 68,
    status: "RESEARCHING",
    createdAt: now,
    updatedAt: now
  };
}

export function updateMemoryFrequency(memory: Memory, sourceType: string, sourceId: string): Memory {
  const now = new Date().toISOString();
  return {
    ...memory,
    sourceTypes: [...new Set([...memory.sourceTypes, sourceType])],
    linkedSourceIds: [...new Set([...memory.linkedSourceIds, sourceId])],
    frequency: memory.frequency + 1,
    lastSeen: now,
    importanceScore: Math.min(100, memory.importanceScore + 4),
    updatedAt: now
  };
}

export function findSimilarMemories(memories: Memory[], query: string, limit = 5) {
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return memories
    .map((memory) => {
      const haystack = `${memory.topic} ${memory.entity} ${memory.summary}`.toLowerCase();
      const overlap = terms.filter((term) => haystack.includes(term)).length;
      return { memory, score: overlap + memory.frequency * 0.2 + memory.importanceScore * 0.01 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.memory);
}

export function linkMemoryToInsight(memory: Memory, insightId: string): Memory {
  return updateMemoryFrequency(memory, "Insight", insightId);
}

export function getHighImportanceMemories(memories: Memory[], threshold = 80) {
  return memories
    .filter((memory) => memory.status !== ("ARCHIVED" as Status) && memory.importanceScore >= threshold)
    .sort((a, b) => b.importanceScore - a.importanceScore);
}

export function createMemorySnapshot(
  memory: Memory,
  period = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date())
): MemorySnapshot {
  return {
    id: createScopedId("memory-snapshot"),
    organizationId: memory.organizationId ?? orgId,
    workspaceId: memory.workspaceId,
    memoryId: memory.id,
    period,
    summary: memory.summary,
    frequency: memory.frequency,
    importanceScore: memory.importanceScore,
    confidenceScore: memory.confidenceScore,
    trendDirection: "STABLE",
    notableSources: memory.sourceTypes,
    createdAt: new Date().toISOString()
  };
}

export function compareMemorySnapshots(previous?: MemorySnapshot, current?: MemorySnapshot) {
  if (!previous || !current) {
    return {
      frequencyDelta: current?.frequency ?? 0,
      importanceDelta: current?.importanceScore ?? 0,
      confidenceDelta: current?.confidenceScore ?? 0,
      trendDirection: current?.trendDirection ?? ("STABLE" as TrendDirection)
    };
  }

  const frequencyDelta = current.frequency - previous.frequency;
  const importanceDelta = current.importanceScore - previous.importanceScore;
  const confidenceDelta = Number((current.confidenceScore - previous.confidenceScore).toFixed(2));
  const trendDirection: TrendDirection =
    frequencyDelta > 1 || importanceDelta > 5 ? "RISING" : frequencyDelta < -1 || importanceDelta < -5 ? "DECLINING" : "STABLE";

  return {
    frequencyDelta,
    importanceDelta,
    confidenceDelta,
    trendDirection
  };
}

export function getMemoryTrend(snapshots: MemorySnapshot[], memoryId: string) {
  const ordered = snapshots
    .filter((snapshot) => snapshot.memoryId === memoryId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const previous = ordered.at(-2);
  const current = ordered.at(-1);
  return {
    memoryId,
    snapshots: ordered,
    ...compareMemorySnapshots(previous, current)
  };
}

export function getMonthlyMemorySummary(snapshots: MemorySnapshot[], period: string) {
  const monthlySnapshots = snapshots.filter((snapshot) => snapshot.period === period);
  const rising = monthlySnapshots.filter((snapshot) => snapshot.trendDirection === "RISING").length;
  const declining = monthlySnapshots.filter((snapshot) => snapshot.trendDirection === "DECLINING").length;
  const averageImportance =
    monthlySnapshots.reduce((total, snapshot) => total + snapshot.importanceScore, 0) /
    Math.max(monthlySnapshots.length, 1);

  return {
    period,
    totalSnapshots: monthlySnapshots.length,
    rising,
    declining,
    averageImportance: Math.round(averageImportance),
    topMemories: [...monthlySnapshots].sort((a, b) => b.importanceScore - a.importanceScore).slice(0, 5)
  };
}
