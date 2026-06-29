import { afterEach, describe, expect, it, vi } from "vitest";
import { routeSignalToKernel } from "@/kernel/connectors/signal-router";
import { createRawSignal, normalizeSignal } from "@/kernel/connectors/normalization-engine";
import { rankRecommendedActions } from "@/kernel/decisions/decision-engine";
import { startExecution, completeExecution } from "@/kernel/execution/execution-engine";
import { calculateMetricChange } from "@/kernel/measurement/measurement-engine";
import { calculateHealth } from "@/kernel/missions/mission-health";
import { evaluatePlanHealth } from "@/kernel/planning/planning-engine";
import { calculateRecommendationConfidence } from "@/kernel/quality/confidence-engine";
import { assessDuplicateRisk } from "@/kernel/quality/duplicate-detection";
import { calculateOpportunityScore } from "@/lib/intelligence-pipeline";
import type {
  Connector,
  ExecutionItem,
  Mission,
  MissionSummary,
  Objective,
  Pattern,
  Plan,
  PlanItem,
  PlatformState,
  RecommendedAction
} from "@/lib/vgos-data";
import type { MissionRelatedRecords } from "@/kernel/missions/mission-types";

const workspaceId = "workspace-test";
const organizationId = "org-test";
const now = "2026-06-29T12:00:00.000Z";

afterEach(() => {
  vi.useRealTimers();
});

function scoped(id: string) {
  return {
    id,
    organizationId,
    workspaceId,
    createdAt: now,
    updatedAt: now
  };
}

function action(overrides: Partial<RecommendedAction> = {}): RecommendedAction {
  return {
    ...scoped(overrides.id ?? "action-test"),
    title: "Create product page to video demo",
    description: "Create a source-to-output proof asset for product page to video demand.",
    sourceType: "IntelligenceObject",
    sourceId: "intel-1",
    actionType: "CREATE_DEMO",
    priority: "HIGH",
    status: "PENDING",
    dueDate: "2026-07-01T12:00:00.000Z",
    owner: "Growth",
    reasoning: "High-intent ecommerce demand needs visible workflow proof.",
    expectedImpact: "Improves conversion confidence for product page to video prospects.",
    confidenceScore: 0.82,
    qualityScore: 78,
    evidenceStrength: 0.74,
    missingEvidence: [],
    duplicateRisk: 0.05,
    confidenceExplanation: "Strong supporting evidence.",
    ...overrides
  };
}

function plan(overrides: Partial<Plan> = {}): Plan {
  return {
    ...scoped(overrides.id ?? "plan-test"),
    title: "Product page proof plan",
    description: "Ship proof assets for product page to video demand.",
    planType: "CONTENT_PLAN",
    status: "ACTIVE",
    startDate: now,
    endDate: "2026-07-29T12:00:00.000Z",
    owner: "Growth",
    expectedOutcome: "Publish proof assets and connect them to answer pages.",
    confidenceScore: 0.82,
    ...overrides
  };
}

function planItem(overrides: Partial<PlanItem> = {}): PlanItem {
  return {
    ...scoped(overrides.id ?? "plan-item-test"),
    planId: overrides.planId ?? "plan-test",
    title: "Publish demo asset",
    description: "Create and publish the product page workflow proof.",
    itemType: "DEMO",
    priority: "HIGH",
    status: "COMPLETED",
    owner: "Growth",
    dueDate: "2026-07-03T12:00:00.000Z",
    estimatedImpactScore: 82,
    estimatedEffortScore: 5,
    ...overrides
  };
}

function executionItem(overrides: Partial<ExecutionItem> = {}): ExecutionItem {
  return {
    ...scoped(overrides.id ?? "execution-test"),
    title: "Publish product page demo",
    description: "Publish the workflow proof asset.",
    executionType: "DEMO_CREATION",
    status: "READY",
    priority: "HIGH",
    owner: "Growth",
    dueDate: "2026-07-02T12:00:00.000Z",
    expectedImpact: "Increase proof for BOFU visitors.",
    actualImpact: "",
    notes: "",
    ...overrides
  };
}

describe("VGOS v5.3 enterprise hardening", () => {
  it("scores high-intent product-page intelligence as a strong opportunity", () => {
    const score = calculateOpportunityScore({
      text: "VidMaker product page to video demo proof for ecommerce teams comparing HeyGen",
      intent: "COMMERCIAL",
      persona: "Ecommerce Brand",
      entities: ["VidMaker", "Video Production Intelligence", "Product Page to Video", "HeyGen"],
      painPoints: ["Need automated product video creation", "Need proof that videos are coherent"],
      confidenceScore: 0.9,
      sourcePriority: "HIGH"
    });

    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("ranks recommended actions by priority, urgency, and linked objective impact", () => {
    vi.setSystemTime(new Date(now));
    const objective: Objective = {
      ...scoped("objective-1"),
      title: "Increase ecommerce proof",
      description: "Show product page to video output quality.",
      category: "CONTENT",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      startDate: now,
      endDate: "2026-07-29T12:00:00.000Z"
    };
    const state = {
      recommendedActions: [
        action({ id: "action-low", priority: "LOW", dueDate: "2026-07-20T12:00:00.000Z" }),
        action({ id: "action-critical", priority: "CRITICAL", objectiveId: objective.id, dueDate: "2026-06-30T12:00:00.000Z" }),
        action({ id: "action-completed", status: "COMPLETED" })
      ],
      objectives: [objective],
      patterns: [] as Pattern[]
    } as unknown as PlatformState;

    const ranked = rankRecommendedActions(state, workspaceId);

    expect(ranked.map((item) => item.id)).toEqual(["action-critical", "action-low"]);
    expect(ranked[0].linkedObjective?.id).toBe(objective.id);
  });

  it("calibrates recommendation confidence from evidence and duplicate risk", () => {
    const quality = calculateRecommendationConfidence({
      title: "Update product-page-to-video landing page",
      description: "Add source-to-output proof, FAQ answers, and a product accuracy section to the landing page for ecommerce teams.",
      source: "Intelligence Pipeline",
      sourceType: "IntelligenceObject",
      sourceId: "intel-1",
      url: "https://vidmaker.com/product-page-to-video",
      priority: "HIGH",
      suggestedAction: "Publish the proof section and link it from related answer pages.",
      expectedImpact: "Improves BOFU trust and creates reusable evidence for sales and community replies.",
      detectedEntities: ["VidMaker", "Product Page to Video"],
      detectedKeywords: ["product page to video", "source-to-output demo"],
      confidenceScore: 0.88,
      duplicateRisk: 0.1
    });

    expect(quality.confidenceScore).toBeGreaterThan(0.65);
    expect(quality.qualityScore).toBeGreaterThan(60);
    expect(quality.missingEvidence).toEqual([]);
  });

  it("flags likely duplicate recommendations with reasons", () => {
    const duplicate = assessDuplicateRisk(
      {
        id: "new-rec",
        title: "Create product page to video demo",
        description: "Create a product page to video workflow proof asset.",
        sourceType: "IntelligenceObject",
        sourceId: "intel-1",
        canonicalId: "demo-proof"
      },
      [
        {
          id: "old-rec",
          title: "Create product page to video demo",
          description: "Create a product page to video workflow proof asset.",
          sourceType: "IntelligenceObject",
          sourceId: "intel-1",
          canonicalId: "demo-proof"
        }
      ]
    );

    expect(duplicate.isLikelyDuplicate).toBe(true);
    expect(duplicate.duplicateRisk).toBeGreaterThanOrEqual(0.7);
    expect(duplicate.duplicateReasons.length).toBeGreaterThan(0);
  });

  it("normalizes and routes connected search signals into kernel collections", () => {
    const connector: Connector = {
      ...scoped("connector-1"),
      name: "Search Console",
      connectorType: "GOOGLE_SEARCH_CONSOLE",
      status: "CONNECTED",
      provider: "Google",
      description: "Search demand connector",
      authType: "OAUTH",
      config: {},
      healthScore: 96
    };
    const context = { workspaceId, organizationId, now };
    const raw = createRawSignal(
      connector,
      {
        externalId: "query-1",
        title: "product page to video",
        summary: "Search demand is rising for product page to video workflows.",
        url: "https://search.google.com/search-console",
        priority: "HIGH",
        confidenceScore: 0.86
      },
      context
    );
    const normalized = normalizeSignal(raw, connector, context);
    const routed = routeSignalToKernel(normalized, context);

    expect(raw.status).toBe("RECEIVED");
    expect(normalized.signalType).toBe("SEARCH_QUERY");
    expect(routed.routedCollections).toEqual(expect.arrayContaining(["questions", "keywords", "intelligenceObjects"]));
    expect(routed.events[0].eventType).toBe("SIGNAL_ROUTED");
  });

  it("calculates mission health from progress, confidence, velocity, and risk", () => {
    vi.setSystemTime(new Date(now));
    const mission: Mission = {
      ...scoped("mission-1"),
      title: "Ecommerce proof mission",
      description: "Build confidence around product page to video workflows.",
      missionType: "GROWTH",
      owner: "Growth",
      priority: "HIGH",
      status: "ACTIVE",
      healthScore: 0,
      confidenceScore: 0.82,
      velocityScore: 72,
      completionScore: 50,
      riskScore: 12,
      startDate: now,
      targetDate: "2026-08-01T12:00:00.000Z",
      notes: ""
    };
    const summary: MissionSummary = {
      id: "mission-summary-1",
      missionId: mission.id,
      workspaceId,
      summary: "The mission is moving with healthy proof output.",
      reasoning: "Completed execution and positive measurements reduce risk.",
      generatedAt: now,
      confidence: 0.84
    };
    const related: MissionRelatedRecords = {
      mission,
      objectives: [
        {
          ...scoped("objective-1"),
          title: "Increase ecommerce proof",
          description: "Show source-to-output quality.",
          category: "CONTENT",
          priority: "HIGH",
          status: "IN_PROGRESS"
        }
      ],
      plans: [plan({ id: "plan-1" })],
      executions: [executionItem({ id: "execution-1", status: "COMPLETED" })],
      metrics: [],
      measurements: [
        {
          ...scoped("measurement-1"),
          metricId: "metric-1",
          measuredAt: "2026-06-28T12:00:00.000Z",
          value: 120,
          previousValue: 100,
          changeValue: 20,
          changePercent: 20
        }
      ],
      learnings: [],
      summaries: [summary],
      recommendedActions: [action({ id: "action-1" })],
      strategyAdjustments: []
    };

    expect(calculateHealth(related)).toBeGreaterThan(60);
  });

  it("evaluates plan health with completion and blockers", () => {
    vi.setSystemTime(new Date(now));
    const healthy = evaluatePlanHealth({
      plan: plan(),
      items: [planItem({ id: "item-1", status: "COMPLETED" }), planItem({ id: "item-2", status: "COMPLETED" })]
    });
    const blocked = evaluatePlanHealth({
      plan: plan(),
      items: [planItem({ id: "item-1", status: "NOT_STARTED" }), planItem({ id: "item-2", status: "BLOCKED" })],
      dependencies: [
        {
          ...scoped("dependency-1"),
          planId: "plan-test",
          fromItemId: "item-2",
          toItemId: "item-1",
          dependencyType: "BLOCKS",
          reason: "Blocked demo asset prevents landing page update."
        }
      ]
    });

    expect(healthy.status).toBe("HEALTHY");
    expect(blocked.status).toBe("BLOCKED");
  });

  it("moves execution records through start and completion states", () => {
    const started = startExecution(executionItem(), { now });
    const completed = completeExecution(started, "Demo asset published.", { now });

    expect(started.status).toBe("IN_PROGRESS");
    expect(started.startedAt).toBe(now);
    expect(completed.status).toBe("COMPLETED");
    expect(completed.completedAt).toBe(now);
    expect(completed.actualImpact).toBe("Demo asset published.");
  });

  it("calculates metric value and percentage changes", () => {
    expect(calculateMetricChange(125, 100)).toEqual({ changeValue: 25, changePercent: 25 });
    expect(calculateMetricChange(10, 0)).toEqual({ changeValue: 10, changePercent: undefined });
  });
});
