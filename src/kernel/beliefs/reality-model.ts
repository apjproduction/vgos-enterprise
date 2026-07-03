import type { Outcome, PlatformState } from "@/lib/vgos-data";
import type { Belief, Claim, RealityModel } from "@/kernel/beliefs/belief-types";
import { getChallengedBeliefs, getCoreBeliefs } from "@/kernel/beliefs/belief-engine";
import { getHighConfidenceClaims } from "@/kernel/beliefs/claim-engine";
import { detectBeliefDrift } from "@/kernel/beliefs/belief-validation";

function scoreDomain(value: string) {
  const lower = value.toLowerCase();
  if (/product|demo|url|product-page|proof/.test(lower)) return "Product";
  if (/founder|linkedin|company|channel|product hunt/.test(lower)) return "Channel";
  if (/seo|aeo|geo|search|category|content/.test(lower)) return "Search and Category";
  if (/directory|authority|backlink/.test(lower)) return "Authority";
  if (/customer|buyer|trust|conversion/.test(lower)) return "Customer Trust";
  return "Operations";
}

function weakestEvidenceAreas(claims: Claim[]) {
  return claims
    .filter((claim) => claim.evidenceStrength < 0.62 || claim.status === "CHALLENGED")
    .map((claim) => ({
      domain: scoreDomain(`${claim.title} ${claim.statement}`),
      summary: claim.title,
      evidenceStrength: claim.evidenceStrength
    }))
    .sort((a, b) => a.evidenceStrength - b.evidenceStrength)
    .slice(0, 5);
}

function strategicAssumptions(beliefs: Belief[]) {
  return beliefs
    .filter((belief) => ["CORE", "ACTIVE", "WATCHING"].includes(belief.status))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5)
    .map((belief) => belief.statement);
}

export function buildRealityModel(state: PlatformState, workspaceId: string): RealityModel {
  const workspaceBeliefs = state.beliefs.filter((belief) => belief.workspaceId === workspaceId);
  const workspaceClaims = state.claims.filter((claim) => claim.workspaceId === workspaceId);
  const strongestBeliefs = getCoreBeliefs(state, workspaceId).slice(0, 5);
  const challengedBeliefs = getChallengedBeliefs(state, workspaceId).slice(0, 5);
  const highestConfidenceClaims = getHighConfidenceClaims(state, workspaceId).slice(0, 6);
  const drift = detectBeliefDrift(state, workspaceId);

  return {
    workspaceId,
    generatedAt: new Date().toISOString(),
    strongestBeliefs,
    challengedBeliefs,
    highestConfidenceClaims,
    weakestEvidenceAreas: weakestEvidenceAreas(workspaceClaims),
    currentStrategicAssumptions: strategicAssumptions(workspaceBeliefs),
    decisionValidationSummary: drift.length
      ? `${drift.length} belief area(s) need review before confidence increases.`
      : "Current decisions are mostly aligned with the strongest beliefs."
  };
}

export function summarizeRealityModel(model: RealityModel) {
  const strongest = model.strongestBeliefs[0]?.title ?? "No core belief has been established yet";
  const weakest = model.weakestEvidenceAreas[0]?.summary ?? "No weak evidence area is currently visible";
  const challenged = model.challengedBeliefs[0]?.title ?? "No core belief is currently challenged";

  return `Strongest belief: ${strongest}. Challenged belief: ${challenged}. Weakest evidence area: ${weakest}. ${model.decisionValidationSummary}`;
}

export function getRealityModelByDomain(state: PlatformState, workspaceId: string, domain: string) {
  const model = buildRealityModel(state, workspaceId);
  const lower = domain.toLowerCase();
  return {
    ...model,
    strongestBeliefs: model.strongestBeliefs.filter((belief) =>
      `${belief.title} ${belief.statement} ${belief.beliefType}`.toLowerCase().includes(lower)
    ),
    challengedBeliefs: model.challengedBeliefs.filter((belief) =>
      `${belief.title} ${belief.statement} ${belief.beliefType}`.toLowerCase().includes(lower)
    ),
    highestConfidenceClaims: model.highestConfidenceClaims.filter((claim) =>
      `${claim.title} ${claim.statement} ${claim.claimType}`.toLowerCase().includes(lower)
    ),
    weakestEvidenceAreas: model.weakestEvidenceAreas.filter((area) => area.domain.toLowerCase().includes(lower))
  };
}

export function detectRealityDrift(state: PlatformState, workspaceId: string) {
  const beliefDrift = detectBeliefDrift(state, workspaceId);
  const weakClaims = state.claims.filter(
    (claim) => claim.workspaceId === workspaceId && (claim.status === "CHALLENGED" || claim.evidenceStrength < 0.5)
  );

  return {
    driftDetected: beliefDrift.length > 0 || weakClaims.length > 0,
    beliefDrift,
    weakClaims,
    summary:
      beliefDrift.length || weakClaims.length
        ? "Reality model needs review before VGOS raises confidence."
        : "Reality model is stable enough for current recommendations."
  };
}

export function updateRealityModelFromOutcome(
  state: PlatformState,
  workspaceId: string,
  outcome: Outcome
): RealityModel {
  const model = buildRealityModel(state, workspaceId);
  const outcomeText = `${outcome.title} ${outcome.resultSummary} ${outcome.learnings}`.toLowerCase();
  const challengedBeliefs = outcomeText.includes("failed") || outcomeText.includes("slower")
    ? model.strongestBeliefs.slice(0, 1)
    : model.challengedBeliefs;

  return {
    ...model,
    challengedBeliefs,
    decisionValidationSummary: `${model.decisionValidationSummary} Outcome reviewed: ${outcome.title}.`
  };
}
