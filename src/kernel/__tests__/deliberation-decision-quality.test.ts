import { describe, expect, it } from "vitest";
import {
  computeDecisionQuality,
  convertDeliberationToDecision,
  createDeliberation,
  recommendDecisionReadiness
} from "@/kernel/deliberation/deliberation-engine";
import { createAssumption } from "@/kernel/deliberation/assumption-engine";
import { addTradeoff } from "@/kernel/deliberation/tradeoff-engine";
import { raiseObjection } from "@/kernel/deliberation/objection-engine";
import { createCommitment } from "@/kernel/organizational-vm";
import { answerExecutiveQuestion } from "@/kernel/advisor/advisor-engine";
import { initialPlatformState, orgId, workspaceId, type Priority } from "@/lib/vgos-data";
import type { DecisionOption } from "@/kernel/deliberation/deliberation-types";

const now = "2026-07-07T12:00:00.000Z";

function option(overrides: Partial<DecisionOption> = {}): DecisionOption {
  return {
    id: overrides.id ?? "option-test",
    organizationId: orgId,
    workspaceId,
    situationId: overrides.situationId ?? "decision-test",
    deliberationId: overrides.deliberationId ?? "deliberation-test",
    title: overrides.title ?? "Finish demo immediately",
    description: overrides.description ?? "Finish the full demo before the next campaign.",
    optionType: overrides.optionType ?? "CREATE_DEMO",
    expectedImpact: overrides.expectedImpact ?? 84,
    estimatedEffort: overrides.estimatedEffort ?? 48,
    riskLevel: overrides.riskLevel ?? "MEDIUM",
    confidenceScore: overrides.confidenceScore ?? 0.74,
    pros: overrides.pros ?? ["Improves trust"],
    cons: overrides.cons ?? ["Uses capacity"],
    assumptions: overrides.assumptions ?? ["Demo improves trust"],
    evidence: overrides.evidence ?? ["claim-product-page-demos-trust"],
    evidenceIds: overrides.evidenceIds,
    createdAt: now,
    updatedAt: now
  };
}

function score(options: DecisionOption[], extra: Partial<Parameters<typeof computeDecisionQuality>[0]> = {}) {
  const result = computeDecisionQuality({
    ...extra,
    decisionId: extra.decisionId ?? "decision-test",
    options: extra.options ?? options
  });
  expect(result.success).toBe(true);
  expect(result.data).toBeDefined();
  return result.data!;
}

describe("Deliberation & Decision Quality", () => {
  it("warns when a decision has no evidence", () => {
    const quality = score([option({ evidence: [], evidenceIds: [] }), option({ id: "option-2", evidence: [], evidenceIds: [] })]);

    expect(quality.warnings).toContain("No evidence is linked.");
  });

  it("warns when a high-confidence assumption has no evidence", () => {
    const assumption = createAssumption({
      workspaceId,
      deliberationId: "deliberation-test",
      statement: "Directories improve SEO authority",
      confidenceScore: 0.86,
      evidenceIds: [],
      status: "UNTESTED",
      now
    });
    const quality = score([option(), option({ id: "option-2", title: "Pause directories" })], {
      decisionId: "decision-test",
      options: [option(), option({ id: "option-2", title: "Pause directories" })],
      assumptions: [assumption]
    });

    expect(quality.warnings).toContain("A high-confidence assumption has no linked evidence.");
  });

  it("warns when an irreversible decision is low-confidence", () => {
    const quality = score([option(), option({ id: "option-2", title: "Delay demo", confidenceScore: 0.5 })], {
      decisionId: "decision-test",
      options: [option(), option({ id: "option-2", title: "Delay demo", confidenceScore: 0.5 })],
      confidenceScore: 0.52,
      reversibilityScore: 0.12
    });

    expect(quality.warnings).toContain("Decision is irreversible and low-confidence.");
  });

  it("keeps unresolved objections from ready-for-commitment readiness", () => {
    const objection = raiseObjection({
      workspaceId,
      deliberationId: "deliberation-test",
      raisedBy: "VGOS",
      statement: "Generic directory ROI is not validated yet",
      severity: "HIGH" as Priority
    }).data!;
    const quality = score([option(), option({ id: "option-2", title: "Focus niche directories" })], {
      decisionId: "decision-test",
      options: [option(), option({ id: "option-2", title: "Focus niche directories" })],
      objections: [objection]
    });
    const readiness = recommendDecisionReadiness(quality);

    expect(quality.warnings).toContain("Objections remain unresolved.");
    expect(readiness.data?.status).not.toBe("READY_FOR_COMMITMENT");
  });

  it("improves option coverage when multiple options are considered", () => {
    const oneOption = score([option()]);
    const twoOptions = score([option(), option({ id: "option-2", title: "Founder walkthrough" })]);

    expect(twoOptions.optionCoverage).toBeGreaterThan(oneOption.optionCoverage);
    expect(twoOptions.overallScore).toBeGreaterThan(oneOption.overallScore);
  });

  it("preserves rationale when converting a deliberation to a decision", () => {
    const deliberation = createDeliberation({
      workspaceId,
      title: "Product-page-to-video demo priority",
      description: "Choose the demo sequence.",
      now
    }).data!;
    const converted = convertDeliberationToDecision({
      deliberation: {
        ...deliberation,
        finalJudgment: "Finish product-page-to-video demo before next BOFU campaign.",
        recommendedOptionId: "decision-option-finish-demo-immediately",
        confidenceScore: 0.86
      },
      now
    });

    expect(converted.success).toBe(true);
    expect(converted.data?.rationale).toBe("Finish product-page-to-video demo before next BOFU campaign.");
    expect(converted.data?.deliberationId).toBe(deliberation.id);
  });

  it("surfaces a warning when commitment is created from a weak decision", () => {
    const commitment = createCommitment({
      workspaceId,
      decisionId: "decision-weak",
      title: "Commit weak decision",
      rationale: "Proceed despite weak quality.",
      decisionQualityScore: {
        decisionId: "decision-weak",
        evidenceQuality: 0.2,
        assumptionClarity: 0.3,
        optionCoverage: 0.28,
        tradeoffClarity: 0.12,
        riskVisibility: 0.3,
        reversibilityScore: 0.2,
        confidenceJustification: 0.25,
        overallScore: 0.28,
        warnings: ["No evidence is linked."]
      },
      now
    });

    expect(commitment.success).toBe(true);
    expect(commitment.warnings?.some((warning) => /quality is low/i.test(warning))).toBe(true);
  });

  it("lets Advisor summarize decision quality from primitives", () => {
    const answer = answerExecutiveQuestion("Which decisions need better evidence?", initialPlatformState, workspaceId);

    expect(answer.answer).toMatch(/decision quality|needs better/i);
    expect(answer.evidence?.length).toBeGreaterThan(0);
    expect(answer.assumptions?.length).toBeGreaterThan(0);
    expect(answer.tradeoff).toBeTruthy();
    expect(answer.suggestedNextAction).toBeTruthy();
  });

  it("documents tradeoffs as part of quality scoring", () => {
    const tradeoff = addTradeoff({
      workspaceId,
      deliberationId: "deliberation-test",
      optionA: "option-a",
      optionB: "option-b",
      comparisonSummary: "Demo-first trades speed for proof quality.",
      benefit: "Higher trust.",
      cost: "Content waits.",
      risk: "Demo can delay campaign timing.",
      reversibilityScore: 0.64,
      confidenceScore: 0.78
    }).data!;
    const quality = score([option(), option({ id: "option-2", title: "Founder walkthrough" })], {
      decisionId: "decision-test",
      options: [option(), option({ id: "option-2", title: "Founder walkthrough" })],
      tradeoffs: [tradeoff]
    });

    expect(quality.tradeoffClarity).toBeGreaterThanOrEqual(0.6);
  });
});
