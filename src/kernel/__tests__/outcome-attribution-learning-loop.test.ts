import { describe, expect, it } from "vitest";
import {
  attributeOutcome,
  computeAttributionConfidence,
  computeLearningLoopIntegrity,
  determineCapabilityImpact,
  determineClaimImpact,
  evaluateOutcome,
  summarizeOutcomeLearning,
  updateCapabilityFromOutcome
} from "@/kernel/outcomes";
import { summarizeCommitmentIntegrity } from "@/kernel/commitments/commitment-summary";
import { answerExecutiveQuestion } from "@/kernel/advisor/advisor-engine";
import {
  createStateTransition,
  explainStateChange,
  recordOutcome
} from "@/kernel/organizational-vm";
import { initialPlatformState, workspaceId } from "@/lib/vgos-data";

const now = "2026-07-09T12:00:00.000Z";

describe("Outcome Attribution & Learning Loop Integrity", () => {
  it("compares expected and actual outcome during evaluation", () => {
    const result = evaluateOutcome({
      workspaceId,
      sourceType: "DecisionCommitment",
      sourceId: "commitment-founder",
      expectedOutcome: "Increase founder authority and product awareness.",
      actualOutcome: "Founder-led carousel generated stronger engagement than company-page posts.",
      successCriteria: ["Engagement quality improves"],
      evidenceIds: ["metric-linkedin-impressions"],
      now
    });

    expect(result.success).toBe(true);
    expect(result.data?.deltaSummary).toMatch(/Expected:/);
    expect(result.data?.actualOutcome).toMatch(/stronger engagement/i);
    expect(result.data?.successScore).toBeGreaterThan(0.55);
  });

  it("does not automatically validate a weak decision after a successful outcome", () => {
    const result = evaluateOutcome({
      workspaceId,
      sourceType: "DecisionCommitment",
      sourceId: "commitment-lucky",
      expectedOutcome: "Increase founder authority and product awareness.",
      actualOutcome: "Founder-led carousel generated stronger engagement and product awareness.",
      successCriteria: ["Engagement quality improves"],
      evidenceIds: ["metric-linkedin-impressions"],
      decisionQualityScore: 0.28,
      now
    });

    expect(result.data?.successScore).toBeGreaterThan(0.65);
    expect(result.data?.evaluationSummary).toMatch(/lucky outcome|weak/i);
    expect(result.warnings?.some((warning) => /do not treat a good outcome as automatic validation/i.test(warning))).toBe(true);
  });

  it("does not automatically invalidate a good decision after a failed outcome", () => {
    const result = evaluateOutcome({
      workspaceId,
      sourceType: "DecisionCommitment",
      sourceId: "commitment-good-decision-poor-outcome",
      expectedOutcome: "Improve discovery and SEO authority.",
      actualOutcome: "Generic directory activity failed, ROI declined, and short-term authority remained unclear.",
      successCriteria: ["Qualified discovery traffic rises"],
      evidenceIds: ["claim-directory-submissions-slow"],
      decisionQualityScore: 0.84,
      now
    });

    expect(result.data?.successScore).toBeLessThan(0.45);
    expect(result.data?.evaluationSummary).toMatch(/decision quality was strong/i);
    expect(result.warnings?.some((warning) => /inspect execution before invalidating/i.test(warning))).toBe(true);
  });

  it("decreases attribution confidence when evidence is weak", () => {
    const strong = computeAttributionConfidence({
      sourceLinked: true,
      evidenceDirectness: 0.9,
      evidenceStrength: 0.85,
      outcomeMeasurable: true,
      timingPlausible: true,
      alternativeExplanations: 1,
      executionDataExists: true,
      reflectionConfirms: true,
      successCriteriaDefined: true
    }).data!;
    const weak = computeAttributionConfidence({
      sourceLinked: false,
      evidenceDirectness: 0.2,
      evidenceStrength: 0.3,
      outcomeMeasurable: false,
      timingPlausible: false,
      alternativeExplanations: 4,
      executionDataExists: false,
      successCriteriaDefined: false,
      outcomeVagueness: 0.8,
      timeDelayDays: 45,
      externalFactorsLikely: true
    }).data!;

    expect(weak.confidenceScore).toBeLessThan(strong.confidenceScore);
    expect(weak.negativeFactors.length).toBeGreaterThan(0);
  });

  it("marks the learning loop incomplete when no reflection exists", () => {
    const evaluation = initialPlatformState.outcomeEvaluations[0];
    const attribution = initialPlatformState.outcomeAttributions.find((item) => item.outcomeId === evaluation.outcomeId);
    const loop = computeLearningLoopIntegrity({
      workspaceId,
      sourceType: evaluation.sourceType,
      sourceId: evaluation.sourceId,
      expectedOutcome: evaluation.expectedOutcome,
      actualOutcome: evaluation.actualOutcome,
      evaluation,
      attribution,
      reflectionExists: false,
      claimImpact: initialPlatformState.claimImpacts[0],
      capabilityImpact: initialPlatformState.capabilityImpacts[0],
      stateTransitionRecorded: true,
      learningArtifact: initialPlatformState.learningArtifacts[0]
    }).data!;

    expect(loop.complete).toBe(false);
    expect(loop.warnings).toContain("Outcome learning has not been captured as a reflection.");
  });

  it("supports a validated claim when evidence is strong", () => {
    const evaluation = {
      ...initialPlatformState.outcomeEvaluations[0],
      successScore: 0.7,
      confidenceScore: 0.74
    };
    const attribution = attributeOutcome({
      workspaceId,
      outcomeId: evaluation.outcomeId,
      attributedSourceType: "Campaign",
      attributedSourceId: "campaign-founder-led-carousel",
      sourceLinked: true,
      evidenceDirectness: 0.8,
      evidenceStrength: 0.82,
      outcomeMeasurable: true,
      timingPlausible: true,
      alternativeExplanations: 1,
      executionDataExists: true,
      successCriteriaDefined: true,
      evidenceIds: ["claim-founder-content-trust"],
      now
    }).data!;
    const impact = determineClaimImpact({
      workspaceId,
      claim: {
        id: "claim-founder-content-trust",
        title: "Founder-led content improves authority",
        status: "VALIDATED",
        confidenceScore: 0.82,
        evidenceStrength: 0.78
      },
      outcomeId: evaluation.outcomeId,
      evaluation,
      attribution,
      evidenceIds: ["claim-founder-content-trust"],
      now
    }).data!;

    expect(impact.impactType).toBe("SUPPORTS");
    expect(impact.newStatus).toBe("VALIDATED");
  });

  it("challenges a claim when the outcome contradicts it", () => {
    const evaluation = initialPlatformState.outcomeEvaluations.find((item) => item.outcomeId === "outcome-generic-directory-submissions")!;
    const impact = determineClaimImpact({
      workspaceId,
      claim: {
        id: "claim-directory-short-term-roi",
        title: "Generic directory submissions improve short-term ROI",
        status: "SUPPORTED",
        confidenceScore: 0.6,
        evidenceStrength: 0.58
      },
      outcomeId: evaluation.outcomeId,
      evaluation,
      attribution: initialPlatformState.outcomeAttributions.find((item) => item.outcomeId === evaluation.outcomeId),
      evidenceIds: ["claim-evidence-directory-short-term-roi"],
      now
    }).data!;

    expect(impact.impactType).toMatch(/CHALLENGES|INVALIDATES/);
    expect(impact.newStatus).toMatch(/CHALLENGED|INVALIDATED/);
  });

  it("improves capability maturity when outcome supports capability growth", () => {
    const evaluation = initialPlatformState.outcomeEvaluations[0];
    const impact = determineCapabilityImpact({
      workspaceId,
      capability: { id: "founder-distribution", name: "Founder Distribution", maturityScore: 0.52, confidenceScore: 0.62 },
      outcomeId: evaluation.outcomeId,
      evaluation,
      attribution: initialPlatformState.outcomeAttributions[0],
      evidenceIds: ["metric-linkedin-impressions"],
      now
    }).data!;
    const updated = updateCapabilityFromOutcome({
      capability: { id: "founder-distribution", name: "Founder Distribution", maturityScore: 0.52, confidenceScore: 0.62 },
      impact
    }).data!;

    expect(impact.impactType).toBe("IMPROVED");
    expect(updated.maturityScore).toBeGreaterThan(0.52);
  });

  it("warns when a completed commitment lacks outcome evaluation", () => {
    const commitment = {
      ...initialPlatformState.decisionCommitments[0],
      id: "decision-commitment-complete-without-outcome",
      status: "COMPLETED" as const
    };
    const state = {
      ...initialPlatformState,
      decisionCommitments: [commitment],
      outcomeEvaluations: [],
      outcomeAttributions: [],
      learningLoopIntegrities: [],
      claimImpacts: [],
      capabilityImpacts: [],
      learningArtifacts: []
    };
    const summary = summarizeCommitmentIntegrity({ state, commitment, now });

    expect(summary.warnings).toContain("Commitment appears complete, but no outcome evaluation exists yet.");
    expect(summary.data?.outcomeStatus).toBe("NOT_RECORDED");
  });

  it("lets Advisor summarize what VGOS learned from an outcome", () => {
    const answer = answerExecutiveQuestion("What did we learn from this outcome?", initialPlatformState, workspaceId);

    expect(answer.answer).toMatch(/VGOS learned/i);
    expect(answer.reasoning.some((item) => /Expected outcome/i.test(item))).toBe(true);
    expect(answer.reasoning.some((item) => /Actual outcome/i.test(item))).toBe(true);
    expect(answer.suggestedNextAction).toBeTruthy();
  });

  it("surfaces the most important recent outcome for Executive Brief", () => {
    const summary = summarizeOutcomeLearning({ workspaceId, state: initialPlatformState, now });

    expect(summary.mostImportantRecentOutcome?.outcomeId).toBe("outcome-founder-led-carousel");
    expect(summary.summary).toMatch(/Founder-led|VGOS learned/i);
  });

  it("generates Work Queue outcome-learning tasks", () => {
    const summary = summarizeOutcomeLearning({ workspaceId, state: initialPlatformState, now });

    expect(summary.tasks.some((task) => task.taskType === "RECORD_MISSING_OUTCOME")).toBe(true);
    expect(summary.tasks.some((task) => task.taskType === "REVIEW_LOW_CONFIDENCE_ATTRIBUTION")).toBe(true);
    expect(summary.tasks.some((task) => task.taskType === "COMPLETE_LEARNING_LOOP")).toBe(true);
  });

  it("Organizational VM records and explains state change from outcome learning", () => {
    const recorded = recordOutcome({
      workspaceId,
      sourceType: "DecisionCommitment",
      sourceId: "decision-commitment-founder-authority-content",
      title: "Founder-led carousel campaign",
      expectedOutcome: "Increase founder authority.",
      actualOutcome: "Founder-led content generated stronger engagement.",
      successCriteria: ["Engagement quality improves"],
      evidenceIds: ["metric-linkedin-impressions"],
      now
    });
    const transition = createStateTransition({
      workspaceId,
      sourceType: "Outcome",
      sourceId: recorded.data!.outcome.id,
      fromState: "Launch learning pending",
      toState: "Founder distribution prioritized",
      reason: "Outcome learning increased confidence in founder-led distribution.",
      outcomeLearning: {
        outcomeId: recorded.data!.evaluation.outcomeId,
        evaluationSummary: recorded.data!.evaluation.evaluationSummary,
        learning: "Founder-led walkthroughs improve trust more reliably than generic distribution.",
        attributionRationale: "Founder voice carried the trust signal."
      },
      now
    }).data!;

    expect(recorded.data?.evaluation.successScore).toBeGreaterThan(0.55);
    expect(explainStateChange(transition)).toMatch(/VGOS learned/i);
  });
});
