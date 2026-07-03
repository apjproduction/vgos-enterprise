import { createScopedId, orgId, type PlatformState } from "@/lib/vgos-data";
import type {
  Belief,
  BeliefClaim,
  BeliefInput,
  BeliefStatus,
  BeliefType,
  Claim
} from "@/kernel/beliefs/belief-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function clamp100(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[], fallback: number) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function inferBeliefType(text: string): BeliefType {
  const lower = text.toLowerCase();
  if (/customer|buyer|user/.test(lower)) return "CUSTOMER_BELIEF";
  if (/product|demo|feature|proof/.test(lower)) return "PRODUCT_BELIEF";
  if (/growth|conversion|launch|trust|content/.test(lower)) return "GROWTH_BELIEF";
  if (/strategy|category|positioning|authority/.test(lower)) return "STRATEGIC_BELIEF";
  if (/operating|capacity|workflow|approval|directory/.test(lower)) return "OPERATING_BELIEF";
  if (/purpose|philosoph|principle/.test(lower)) return "PHILOSOPHICAL_BELIEF";
  return "MARKET_BELIEF";
}

function statusFromScores(confidenceScore: number, stabilityScore: number): BeliefStatus {
  if (confidenceScore >= 0.82 && stabilityScore >= 78) return "CORE";
  if (confidenceScore >= 0.68) return "ACTIVE";
  if (confidenceScore < 0.5 || stabilityScore < 44) return "CHALLENGED";
  return "WATCHING";
}

export function calculateBeliefStability(claims: Claim[], revisions: { beliefId?: string; previousConfidence: number; newConfidence: number }[] = []) {
  const evidenceAverage = average(claims.map((claim) => claim.evidenceStrength), 0.58);
  const challengePenalty = claims.filter((claim) => ["CHALLENGED", "INVALIDATED"].includes(claim.status)).length * 12;
  const revisionVolatility = revisions.reduce((sum, item) => sum + Math.abs(item.newConfidence - item.previousConfidence), 0) * 22;
  return clamp100(evidenceAverage * 100 - challengePenalty - revisionVolatility);
}

export function calculateBeliefImpact(belief: Pick<Belief, "statement" | "beliefType">, claims: Claim[] = []) {
  const text = `${belief.statement} ${belief.beliefType}`.toLowerCase();
  const strategicBoost = /proof|trust|conversion|category|founder|authority|product-page|launch/.test(text) ? 18 : 8;
  const claimBoost = Math.min(24, claims.length * 6);
  const confidenceBoost = average(claims.map((claim) => claim.confidenceScore), 0.62) * 42;
  return clamp100(strategicBoost + claimBoost + confidenceBoost);
}

export function createBelief(input: BeliefInput): Belief {
  const date = nowIso();
  const confidenceScore = clamp01(input.confidenceScore ?? 0.64);
  const stabilityScore = clamp100(input.stabilityScore ?? confidenceScore * 84);
  const draft = {
    statement: input.statement,
    beliefType: input.beliefType ?? inferBeliefType(`${input.title} ${input.statement}`)
  };

  return {
    id: createScopedId("belief"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    statement: input.statement,
    beliefType: draft.beliefType,
    status: input.status ?? statusFromScores(confidenceScore, stabilityScore),
    confidenceScore,
    stabilityScore,
    impactScore: input.impactScore ?? calculateBeliefImpact(draft),
    lastChallengedAt: input.lastChallengedAt ?? null,
    createdAt: date,
    updatedAt: date
  };
}

export function createBeliefFromClaims(input: {
  workspaceId: string;
  organizationId?: string;
  title: string;
  statement: string;
  beliefType?: BeliefType;
  claims: Claim[];
}): { belief: Belief; links: BeliefClaim[] } {
  const confidenceScore = clamp01(average(input.claims.map((claim) => claim.confidenceScore), 0.62));
  const stabilityScore = calculateBeliefStability(input.claims);
  const belief = createBelief({
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    title: input.title,
    statement: input.statement,
    beliefType: input.beliefType,
    confidenceScore,
    stabilityScore,
    impactScore: calculateBeliefImpact({ statement: input.statement, beliefType: input.beliefType ?? inferBeliefType(input.statement) }, input.claims)
  });

  return {
    belief,
    links: input.claims.map((claim, index) => ({
      id: createScopedId("belief-claim"),
      organizationId: belief.organizationId,
      workspaceId: belief.workspaceId,
      beliefId: belief.id,
      claimId: claim.id,
      weight: clamp01(claim.confidenceScore * (1 - index * 0.08)),
      createdAt: nowIso()
    }))
  };
}

export function updateBeliefConfidence(belief: Belief, claims: Claim[] = [], revisions: { previousConfidence: number; newConfidence: number }[] = []): Belief {
  const confidenceScore = clamp01(average(claims.map((claim) => claim.confidenceScore), belief.confidenceScore));
  const stabilityScore = calculateBeliefStability(claims, revisions);

  return {
    ...belief,
    confidenceScore,
    stabilityScore,
    impactScore: calculateBeliefImpact(belief, claims),
    status: statusFromScores(confidenceScore, stabilityScore),
    updatedAt: nowIso()
  };
}

export function challengeBelief(belief: Belief, reason = "Contradictory evidence challenged this belief."): Belief {
  const date = nowIso();
  return {
    ...belief,
    status: "CHALLENGED",
    confidenceScore: clamp01(belief.confidenceScore - 0.14),
    stabilityScore: clamp100(belief.stabilityScore - 18),
    statement: `${belief.statement} Challenge: ${reason}`,
    lastChallengedAt: date,
    updatedAt: date
  };
}

export function retireBelief(belief: Belief): Belief {
  return {
    ...belief,
    status: "RETIRED",
    confidenceScore: clamp01(Math.min(belief.confidenceScore, 0.28)),
    updatedAt: nowIso()
  };
}

export function getCoreBeliefs(state: PlatformState, workspaceId: string): Belief[] {
  return state.beliefs
    .filter((belief) => belief.workspaceId === workspaceId && ["CORE", "ACTIVE"].includes(belief.status))
    .sort((a, b) => b.impactScore - a.impactScore || b.confidenceScore - a.confidenceScore);
}

export function getChallengedBeliefs(state: PlatformState, workspaceId: string): Belief[] {
  return state.beliefs
    .filter((belief) => belief.workspaceId === workspaceId && belief.status === "CHALLENGED")
    .sort((a, b) => a.confidenceScore - b.confidenceScore || a.stabilityScore - b.stabilityScore);
}
