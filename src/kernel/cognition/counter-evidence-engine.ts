import type { PlatformState } from "@/lib/vgos-data";
import type { EvidenceAssessment } from "@/kernel/cognition/cognition-types";
import { identifyWeakEvidence } from "@/kernel/cognition/evidence-evaluator";

function includesAny(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function findCounterEvidence(state: PlatformState, workspaceId: string, sourceId?: string): string[] {
  const explicit = state.evidenceAssessments
    .filter((item) => item.workspaceId === workspaceId && item.evidenceType === "COUNTER_EVIDENCE" && (!sourceId || item.sourceId === sourceId))
    .map((item) => item.summary);

  const blockers = state.executionItems
    .filter((item) => item.workspaceId === workspaceId && ["BLOCKED", "NEEDS_APPROVAL", "FAILED"].includes(item.status))
    .filter((item) => !sourceId || item.id === sourceId || item.recommendedActionId === sourceId || item.sourceId === sourceId)
    .map((item) => `${item.title} is ${item.status.toLowerCase().replace(/_/g, " ")}.`);

  const cautionaryLearnings = state.learnings
    .filter((item) => item.workspaceId === workspaceId)
    .filter((item) => includesAny(`${item.title} ${item.summary} ${item.recommendationImpact}`, ["lag", "delay", "before", "proof", "slower", "skeptic", "needs evidence"]))
    .slice(0, 4)
    .map((item) => item.summary);

  return [...new Set([...explicit, ...blockers, ...cautionaryLearnings])].slice(0, 6);
}

export function summarizeCounterEvidence(items: string[]): string {
  if (!items.length) return "No material counter-evidence is visible yet.";
  return items.slice(0, 3).join(" ");
}

export function calculateCounterEvidenceRisk(items: string[] | EvidenceAssessment[]): number {
  if (!items.length) return 0.12;
  const textRisk = items.reduce((sum, item) => {
    const text = typeof item === "string" ? item : item.summary;
    const critical = /blocked|failed|conversion|proof|capacity|delay|slower|skeptic/i.test(text) ? 0.18 : 0.1;
    return sum + critical;
  }, 0);
  const evidencePenalty = Array.isArray(items) && items.length && typeof items[0] !== "string"
    ? identifyWeakEvidence(items as EvidenceAssessment[]).length * 0.08
    : 0;
  return Math.min(0.88, textRisk + evidencePenalty);
}

export function identifyWhatWouldChangeTheDecision(items: string[]): string[] {
  const changes = [
    "A validated measurement showing conversion lift without additional proof assets.",
    "A resolved blocker that makes the demo or approval dependency ready.",
    "Fresh first-party evidence that the distribution channel is still outperforming alternatives."
  ];
  if (items.some((item) => /directory|approval|backlink/i.test(item))) {
    changes.push("Directory approval timing improving enough to reduce authority lag risk.");
  }
  if (items.some((item) => /founder|capacity/i.test(item))) {
    changes.push("Founder capacity becoming available for review and distribution in the current week.");
  }
  return changes.slice(0, 4);
}
