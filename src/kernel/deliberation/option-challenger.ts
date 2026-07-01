import type { PlatformState } from "@/lib/vgos-data";
import type { DecisionOption, OptionChallenge } from "@/kernel/deliberation/deliberation-types";

export function findWeaknesses(option: DecisionOption): string[] {
  const weaknesses: string[] = [];
  const text = `${option.title} ${option.description}`.toLowerCase();
  if (/publish|content|blog/.test(text)) weaknesses.push("Product demo may still be unfinished, weakening conversion trust.");
  if (/directory|submit/.test(text)) weaknesses.push("Directory approvals may lag and delay authority outcomes.");
  if (/founder/.test(text)) weaknesses.push("Founder capacity may be limited this week.");
  if (option.confidenceScore < 0.7) weaknesses.push("Confidence is below the normal commitment threshold.");
  if (option.riskLevel === "HIGH" || option.riskLevel === "CRITICAL") weaknesses.push("Risk level is high enough to require a dissenting view.");
  if (option.optionType === "DO_NOTHING") weaknesses.push("Doing nothing preserves ambiguity and can waste current demand.");
  return weaknesses.length ? weaknesses : ["No severe weakness is visible, but VGOS should still validate outcome evidence."];
}

export function findMissingEvidence(option: DecisionOption, state?: PlatformState): string[] {
  const missing = [...option.assumptions.filter((item) => !option.evidence.some((evidence) => evidence.toLowerCase().includes(item.toLowerCase().split(" ")[0] ?? "")))];
  const hasAssessment = state?.evidenceAssessments.some((assessment) => assessment.workspaceId === option.workspaceId && option.evidence.some((evidence) => assessment.summary.includes(evidence)));
  if (!hasAssessment) missing.push("Assessed first-party evidence");
  if (/demo|proof/i.test(option.title) && !option.evidence.some((item) => /demo|proof/i.test(item))) missing.push("Live proof asset");
  return [...new Set(missing)].slice(0, 4);
}

export function identifyFailureModes(option: DecisionOption): string[] {
  const text = `${option.title} ${option.description}`.toLowerCase();
  const modes = [];
  if (/blog|content|publish/.test(text)) modes.push("Content ships but does not convert because proof is missing.");
  if (/demo|proof/.test(text)) modes.push("Demo consumes capacity and delays distribution.");
  if (/directory|submit/.test(text)) modes.push("Submissions are accepted slowly and produce weak backlinks.");
  if (/founder|linkedin/.test(text)) modes.push("Founder content waits on review and misses the timing window.");
  if (/defer|nothing/.test(text)) modes.push("The opportunity decays while VGOS waits.");
  return modes.length ? modes : ["The option works locally but does not improve the mission metric."];
}

export function generateDissentingView(option: DecisionOption): string {
  const weaknesses = findWeaknesses(option).slice(0, 2).join(" ");
  return `A reasonable dissent is that ${option.title.toLowerCase()} may be premature. ${weaknesses}`;
}

export function generateWhatWouldMakeThisOptionWrong(option: DecisionOption): string[] {
  const text = `${option.title} ${option.description}`.toLowerCase();
  const changes = ["Fresh measurement contradicts the expected impact.", "A dependency blocks the option longer than the decision window."];
  if (/blog|content|publish/.test(text)) changes.push("Search demand fades before the content can rank.");
  if (/demo|proof/.test(text)) changes.push("Proof assets do not improve qualified signup or reply quality.");
  if (/directory|submit/.test(text)) changes.push("Approval lag continues and backlinks do not materialize.");
  if (/founder/.test(text)) changes.push("Founder review capacity is unavailable this week.");
  return changes.slice(0, 4);
}

export function challengeOption(option: DecisionOption, state?: PlatformState): OptionChallenge {
  return {
    optionId: option.id,
    weaknesses: findWeaknesses(option),
    missingEvidence: findMissingEvidence(option, state),
    failureModes: identifyFailureModes(option),
    dissentingView: generateDissentingView(option),
    whatWouldMakeThisWrong: generateWhatWouldMakeThisOptionWrong(option)
  };
}
