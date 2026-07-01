import { createScopedId, orgId } from "@/lib/vgos-data";
import type { PlatformState, RecommendedAction } from "@/lib/vgos-data";
import type { Assumption, AssumptionInput, AssumptionStatus, CognitionRiskLevel } from "@/kernel/cognition/cognition-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function inferRiskLevel(text: string, confidenceScore: number): CognitionRiskLevel {
  const lower = text.toLowerCase();
  if (/blocked|critical|conversion|launch|proof|trust|capacity|delay/.test(lower) && confidenceScore < 0.72) return "CRITICAL";
  if (/demo|directory|founder|approval|measurement|bofu|rank/.test(lower)) return "HIGH";
  if (/traffic|engagement|search|authority|content/.test(lower)) return "MEDIUM";
  return "LOW";
}

function sourceText(input: Pick<RecommendedAction, "title" | "description" | "expectedImpact" | "reasoning"> | string) {
  return typeof input === "string" ? input : `${input.title}. ${input.description}. ${input.expectedImpact}. ${input.reasoning}`;
}

export function createAssumption(input: AssumptionInput): Assumption {
  const date = nowIso();
  const confidenceScore = clamp01(input.confidenceScore ?? 0.68);
  const text = `${input.title} ${input.description}`;

  return {
    id: createScopedId("assumption"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    description: input.description,
    sourceType: input.sourceType ?? null,
    sourceId: input.sourceId ?? null,
    status: input.status ?? (confidenceScore < 0.65 ? "NEEDS_EVIDENCE" : "UNTESTED"),
    confidenceScore,
    riskLevel: input.riskLevel ?? inferRiskLevel(text, confidenceScore),
    validationMethod: input.validationMethod ?? null,
    validatedAt: input.validatedAt ?? null,
    invalidatedAt: input.invalidatedAt ?? null,
    createdAt: date,
    updatedAt: date
  };
}

export function extractAssumptions(input: {
  workspaceId: string;
  organizationId?: string;
  sourceType?: string;
  sourceId?: string;
  title: string;
  description?: string;
  expectedImpact?: string;
  confidenceScore?: number;
}): Assumption[] {
  const text = `${input.title}. ${input.description ?? ""}. ${input.expectedImpact ?? ""}`.toLowerCase();
  const assumptions: AssumptionInput[] = [];

  if (/blog|content|seo|rank|search/.test(text)) {
    assumptions.push({
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      title: "Search demand will remain active long enough for content to compound.",
      description: "VGOS is assuming the demand signal behind this content recommendation will not disappear before the asset can rank or distribute.",
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      confidenceScore: 0.72,
      riskLevel: "MEDIUM"
    });
  }

  if (/demo|proof|product-page|conversion|bofu/.test(text)) {
    assumptions.push({
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      title: "Visible proof assets will increase conversion trust.",
      description: "VGOS is assuming source-to-output proof will reduce skepticism and improve qualified conversion behavior.",
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      confidenceScore: 0.82,
      riskLevel: "HIGH"
    });
  }

  if (/founder|linkedin|post|authority/.test(text)) {
    assumptions.push({
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      title: "Founder-led distribution will outperform company-only posting.",
      description: "VGOS is assuming founder voice creates stronger qualitative engagement than a branded update alone.",
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      confidenceScore: 0.78,
      riskLevel: "MEDIUM"
    });
  }

  if (/directory|backlink|authority|futurepedia|toolify/.test(text)) {
    assumptions.push({
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      title: "Directory submissions will generate authority signals after approval.",
      description: "VGOS is assuming directory moderation will complete in time to produce useful backlinks, mentions, or referring-domain evidence.",
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      confidenceScore: 0.58,
      riskLevel: "HIGH",
      status: "NEEDS_EVIDENCE"
    });
  }

  if (assumptions.length === 0) {
    assumptions.push({
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      title: "The expected impact can happen with the current workspace context.",
      description: "VGOS is assuming the recommendation has enough owner capacity, supporting assets, and measurement coverage to produce the stated outcome.",
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      confidenceScore: input.confidenceScore ?? 0.66,
      riskLevel: "MEDIUM"
    });
  }

  return assumptions.map(createAssumption);
}

export function validateAssumption(assumption: Assumption, validationMethod = "Measured or observed support"): Assumption {
  const date = nowIso();
  return {
    ...assumption,
    status: "VALIDATED",
    confidenceScore: clamp01(assumption.confidenceScore + 0.12),
    validationMethod,
    validatedAt: date,
    invalidatedAt: null,
    updatedAt: date
  };
}

export function invalidateAssumption(assumption: Assumption, validationMethod = "Outcome contradicted assumption"): Assumption {
  const date = nowIso();
  return {
    ...assumption,
    status: "INVALIDATED",
    confidenceScore: clamp01(assumption.confidenceScore - 0.22),
    validationMethod,
    invalidatedAt: date,
    validatedAt: null,
    updatedAt: date
  };
}

export function getAssumptionsForRecommendation(state: PlatformState, recommendationId: string): Assumption[] {
  const direct = state.assumptions.filter((item) => item.sourceId === recommendationId);
  if (direct.length) return direct;

  const action = state.recommendedActions.find((item) => item.id === recommendationId);
  const recommendation = state.aiRecommendations.find((item) => item.id === recommendationId);
  const source = action ?? recommendation;
  if (!source) return [];

  const text = sourceText(
    "expectedImpact" in source
      ? source
      : {
          title: source.title,
          description: source.description,
          expectedImpact: source.suggestedAction,
          reasoning: source.reasoning
        }
  );
  const terms = text.toLowerCase().split(/\W+/).filter((term) => term.length > 5);
  return state.assumptions.filter((item) =>
    item.workspaceId === source.workspaceId &&
    terms.some((term) => `${item.title} ${item.description}`.toLowerCase().includes(term))
  );
}

export function getHighRiskAssumptions(state: PlatformState, workspaceId: string): Assumption[] {
  return state.assumptions
    .filter((item) => item.workspaceId === workspaceId && ["HIGH", "CRITICAL"].includes(item.riskLevel) && item.status !== "ARCHIVED")
    .sort((a, b) => {
      const riskRank: Record<CognitionRiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return riskRank[a.riskLevel] - riskRank[b.riskLevel] || a.confidenceScore - b.confidenceScore;
    });
}

export function explainAssumptions(assumptions: Assumption[]): string {
  if (!assumptions.length) return "No explicit assumptions are attached yet; VGOS should ask for evidence before raising confidence.";
  return assumptions
    .slice(0, 4)
    .map((item) => `${item.title} (${item.riskLevel.toLowerCase()} risk, ${Math.round(item.confidenceScore * 100)}% confidence)`)
    .join(" ");
}

export function updateAssumptionStatus(assumption: Assumption, status: AssumptionStatus): Assumption {
  const date = nowIso();
  return {
    ...assumption,
    status,
    updatedAt: date,
    validatedAt: status === "VALIDATED" ? date : assumption.validatedAt ?? null,
    invalidatedAt: status === "INVALIDATED" ? date : assumption.invalidatedAt ?? null
  };
}
