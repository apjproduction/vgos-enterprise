import { describe, expect, it } from "vitest";
import { computeExecutionReadiness } from "@/kernel/commitments/execution-readiness";
import { evaluateCommitmentRisk } from "@/kernel/commitments/commitment-risk";
import { computeCommitmentIntegrity } from "@/kernel/commitments/commitment-integrity";
import { detectCommitmentDrift } from "@/kernel/commitments/commitment-drift";
import { createCommitmentEscalation } from "@/kernel/commitments/commitment-escalation";
import { createCommitmentMonitoringPlan } from "@/kernel/commitments/commitment-monitor";
import { buildCommitmentIntegrityBrief, summarizeCommitmentIntegrity } from "@/kernel/commitments/commitment-summary";
import { answerExecutiveQuestion } from "@/kernel/advisor/advisor-engine";
import { createCommitment } from "@/kernel/organizational-vm";
import { initialPlatformState, workspaceId } from "@/lib/vgos-data";
import type { CommitmentLike } from "@/kernel/commitments/commitment-types";
import type { DecisionQualityScore } from "@/kernel/deliberation/deliberation-types";

const now = "2026-07-07T12:00:00.000Z";

function commitment(overrides: Partial<CommitmentLike> = {}): CommitmentLike {
  return {
    id: overrides.id ?? "commitment-test",
    workspaceId,
    title: overrides.title ?? "Finish product-page-to-video demo",
    description: overrides.description ?? "Finish the demo proof asset.",
    owner: overrides.owner ?? "Founder/Product",
    dueDate: overrides.dueDate ?? "2026-07-12T12:00:00.000Z",
    decisionId: overrides.decisionId ?? "decision-situation-demo-priority",
    evidenceIds: overrides.evidenceIds ?? ["claim-product-page-demos-trust"],
    successCriteria: overrides.successCriteria ?? ["Demo is reusable in Product Hunt replies."],
    requiredResources: overrides.requiredResources ?? ["Founder review"],
    dependencies: overrides.dependencies ?? ["Demo source example"],
    expectedOutcome: overrides.expectedOutcome ?? "Reusable proof asset improves trust.",
    status: overrides.status ?? "COMMITTED",
    ...overrides
  };
}

const weakDecision: DecisionQualityScore = {
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
};

describe("Commitment Risk & Execution Integrity", () => {
  it("marks a commitment with no owner as high risk", () => {
    const bare = commitment({ owner: "", dueDate: null, evidenceIds: [], successCriteria: [], requiredResources: [], dependencies: [] });
    const readiness = computeExecutionReadiness({ commitment: bare }).data!;
    const risk = evaluateCommitmentRisk({ commitment: bare, readiness, now }).data!;

    expect(risk.riskLevel).toMatch(/HIGH|CRITICAL/);
    expect(risk.warnings).toContain("No clear owner is assigned.");
  });

  it("warns when a commitment has no evidence", () => {
    const target = commitment({ evidenceIds: [] });
    const readiness = computeExecutionReadiness({ commitment: target }).data!;
    const risk = evaluateCommitmentRisk({ commitment: target, readiness, now }).data!;

    expect(readiness.warnings).toContain("No supporting evidence is linked.");
    expect(risk.warnings).toContain("No supporting evidence is linked.");
  });

  it("warns when linked decision quality is weak", () => {
    const target = commitment({ decisionId: "decision-weak" });
    const readiness = computeExecutionReadiness({ commitment: target }).data!;
    const risk = evaluateCommitmentRisk({ commitment: target, readiness, decisionQualityScore: weakDecision, now }).data!;

    expect(risk.warnings).toContain("Linked decision quality is low.");
  });

  it("scores clear commitments higher than unclear commitments", () => {
    const clear = commitment();
    const unclear = commitment({ owner: "", dueDate: null, evidenceIds: [], successCriteria: [], requiredResources: [], dependencies: [], expectedOutcome: "" });
    const clearReadiness = computeExecutionReadiness({ commitment: clear }).data!;
    const unclearReadiness = computeExecutionReadiness({ commitment: unclear }).data!;
    const clearRisk = evaluateCommitmentRisk({ commitment: clear, readiness: clearReadiness, now }).data!;
    const unclearRisk = evaluateCommitmentRisk({ commitment: unclear, readiness: unclearReadiness, now }).data!;
    const clearIntegrity = computeCommitmentIntegrity({ commitment: clear, readiness: clearReadiness, riskProfile: clearRisk, evidenceIds: clear.evidenceIds }).data!;
    const unclearIntegrity = computeCommitmentIntegrity({ commitment: unclear, readiness: unclearReadiness, riskProfile: unclearRisk, evidenceIds: [] }).data!;

    expect(clearReadiness.readinessScore).toBeGreaterThan(unclearReadiness.readinessScore);
    expect(clearIntegrity.overallScore).toBeGreaterThan(unclearIntegrity.overallScore);
  });

  it("detects strategic drift when commitment conflicts with validated strategy", () => {
    const drift = detectCommitmentDrift({
      commitment: commitment({
        id: "commitment-directory",
        title: "Continue generic directory submissions",
        description: "Keep broad generic submissions moving.",
        evidenceIds: []
      }),
      validatedStrategy: "Pause low-confidence generic directories and focus on niche AI/video/productivity directories.",
      now
    }).data!;

    expect(drift.some((signal) => signal.driftType === "STRATEGIC_DRIFT")).toBe(true);
  });

  it("creates escalation for critical risk", () => {
    const escalation = createCommitmentEscalation({
      commitmentId: "commitment-critical",
      workspaceId,
      reason: "Critical risk needs owner decision.",
      severity: "CRITICAL",
      now
    }).data!;

    expect(escalation.status).toBe("OPEN");
    expect(escalation.severity).toBe("CRITICAL");
  });

  it("creates monitoring plan with leading and lagging indicators", () => {
    const plan = createCommitmentMonitoringPlan({ commitment: commitment(), now }).data!;

    expect(plan.leadingIndicators.length).toBeGreaterThan(0);
    expect(plan.laggingIndicators.length).toBeGreaterThan(0);
  });

  it("lets Advisor summarize commitment risk", () => {
    const answer = answerExecutiveQuestion("Which commitments are at risk?", initialPlatformState, workspaceId);

    expect(answer.answer).toMatch(/risk/i);
    expect(answer.evidence?.length).toBeGreaterThan(0);
    expect(answer.suggestedNextAction).toBeTruthy();
  });

  it("surfaces the highest-risk commitment for Executive Brief", () => {
    const brief = buildCommitmentIntegrityBrief(initialPlatformState, workspaceId);

    expect(brief.highestRiskCommitment?.title).toMatch(/directory/i);
    expect(brief.summary).toMatch(/risk/i);
  });

  it("generates Work Queue commitment-integrity tasks", () => {
    const brief = buildCommitmentIntegrityBrief(initialPlatformState, workspaceId);

    expect(brief.tasks.some((task) => task.taskType === "REVIEW_DRIFT")).toBe(true);
    expect(brief.tasks.some((task) => task.taskType === "ADD_MISSING_EVIDENCE")).toBe(true);
  });

  it("Organizational VM commitment includes readiness warnings", () => {
    const created = createCommitment({
      workspaceId,
      decisionId: "decision-test",
      title: "Commit without owner",
      rationale: "",
      owner: "",
      evidenceIds: [],
      successCriteria: [],
      now
    });

    expect(created.success).toBe(true);
    expect(created.warnings?.some((warning) => /owner|rationale|evidence/i.test(warning))).toBe(true);
  });

  it("summarizes seeded commitment integrity from primitives", () => {
    const commitmentRecord = initialPlatformState.decisionCommitments.find((item) => item.id === "decision-commitment-generic-directory-continue")!;
    const summary = summarizeCommitmentIntegrity({ state: initialPlatformState, commitment: commitmentRecord, now }).data!;

    expect(summary.riskProfile.riskLevel).toMatch(/HIGH|CRITICAL/);
    expect(summary.driftSignals.length).toBeGreaterThan(0);
  });
});
