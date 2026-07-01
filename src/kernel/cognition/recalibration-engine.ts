import type { Assumption, Reflection } from "@/kernel/cognition/cognition-types";
import type { RecommendedAction } from "@/lib/vgos-data";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function detectRepeatedWrongAssumptions(reflections: Reflection[], pattern: string) {
  const lower = pattern.toLowerCase();
  return reflections.filter((item) => item.wrongAssumptions.toLowerCase().includes(lower) || item.summary.toLowerCase().includes(lower));
}

export function recalibrateRecommendationConfidence(action: RecommendedAction, reflections: Reflection[]) {
  const repeatedDirectoryLag = detectRepeatedWrongAssumptions(reflections, "directory").length;
  const proofGap = detectRepeatedWrongAssumptions(reflections, "proof").length;
  const penalty = Math.min(0.22, repeatedDirectoryLag * 0.06 + proofGap * 0.05);
  return Number(clamp01(action.confidenceScore - penalty).toFixed(2));
}

export function updateAssumptionConfidence(assumption: Assumption, reflections: Reflection[]) {
  const related = reflections.filter((item) =>
    `${item.summary} ${item.wrongAssumptions} ${item.newLearning}`.toLowerCase().includes(assumption.title.toLowerCase().split(/\W+/)[0] ?? "")
  );
  const penalty = related.filter((item) => item.wrongAssumptions !== "No specific wrong assumption is confirmed yet.").length * 0.08;
  const boost = related.filter((item) => item.whatWorked.length > item.whatFailed.length).length * 0.04;
  return Number(clamp01(assumption.confidenceScore + boost - penalty).toFixed(2));
}

export function adjustFuturePriorityRules(reflections: Reflection[]) {
  const rules: string[] = [];
  if (detectRepeatedWrongAssumptions(reflections, "directory").length >= 2) {
    rules.push("Reduce priority confidence for directory submissions until approval evidence or follow-up capacity exists.");
  }
  if (detectRepeatedWrongAssumptions(reflections, "proof").length >= 2) {
    rules.push("Raise proof-first work above BOFU promotion when conversion trust is uncertain.");
  }
  if (detectRepeatedWrongAssumptions(reflections, "founder").length >= 1) {
    rules.push("Favor founder-led distribution when qualitative engagement is the deciding signal.");
  }
  return rules.length ? rules : ["No repeated wrong-assumption pattern is strong enough to change future priority rules yet."];
}

export function improveFutureJudgment(reflections: Reflection[]) {
  return {
    repeatedWrongAssumptions: reflections
      .filter((item) => item.wrongAssumptions !== "No specific wrong assumption is confirmed yet.")
      .map((item) => item.wrongAssumptions),
    priorityRules: adjustFuturePriorityRules(reflections),
    confidenceNote: "Future judgment should lower confidence when a recommendation depends on assumptions that recent reflections contradicted."
  };
}
