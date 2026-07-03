import { createScopedId, orgId, type PlatformState } from "@/lib/vgos-data";
import type {
  Claim,
  ClaimEvidence,
  ClaimEvidenceInput,
  ClaimInput,
  ClaimStatus,
  ClaimType
} from "@/kernel/beliefs/belief-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function inferClaimType(text: string): ClaimType {
  const lower = text.toLowerCase();
  if (/customer|buyer|user|persona|comment/.test(lower)) return "CUSTOMER";
  if (/product|demo|feature|url|product-page/.test(lower)) return "PRODUCT";
  if (/growth|conversion|launch|signup|trust/.test(lower)) return "GROWTH";
  if (/seo|search|rank|keyword/.test(lower)) return "SEO";
  if (/aeo|answer/.test(lower)) return "AEO";
  if (/geo|generative engine/.test(lower)) return "GEO";
  if (/linkedin|founder|product hunt|channel|directory/.test(lower)) return "CHANNEL";
  if (/competitor|generic/.test(lower)) return "COMPETITOR";
  if (/strategy|category|positioning/.test(lower)) return "STRATEGIC";
  return "OPERATIONAL";
}

function statusFromScores(confidenceScore: number, evidenceStrength: number): ClaimStatus {
  if (confidenceScore >= 0.82 && evidenceStrength >= 0.72) return "VALIDATED";
  if (confidenceScore >= 0.68 && evidenceStrength >= 0.58) return "SUPPORTED";
  if (confidenceScore < 0.45 || evidenceStrength < 0.36) return "CHALLENGED";
  return "PROPOSED";
}

function terms(value: string) {
  return value.toLowerCase().split(/\W+/).filter((term) => term.length > 4);
}

export function createClaim(input: ClaimInput): Claim {
  const date = nowIso();
  const confidenceScore = clamp01(input.confidenceScore ?? 0.62);
  const evidenceStrength = clamp01(input.evidenceStrength ?? confidenceScore * 0.85);

  return {
    id: createScopedId("claim"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    title: input.title,
    statement: input.statement,
    claimType: input.claimType ?? inferClaimType(`${input.title} ${input.statement}`),
    status: input.status ?? statusFromScores(confidenceScore, evidenceStrength),
    confidenceScore,
    evidenceStrength,
    sourceType: input.sourceType ?? null,
    sourceId: input.sourceId ?? null,
    createdAt: date,
    updatedAt: date
  };
}

export function createClaimFromEvidence(input: {
  workspaceId: string;
  organizationId?: string;
  evidenceType?: string;
  sourceType: string;
  sourceId: string;
  summary: string;
  claimType?: ClaimType;
  strengthScore?: number;
}): Claim {
  return createClaim({
    workspaceId: input.workspaceId,
    organizationId: input.organizationId,
    title: input.summary.replace(/\.$/, ""),
    statement: input.summary,
    claimType: input.claimType,
    confidenceScore: input.strengthScore ?? 0.64,
    evidenceStrength: input.strengthScore ?? 0.64,
    sourceType: input.sourceType,
    sourceId: input.sourceId
  });
}

export function updateClaimConfidence(claim: Claim, evidence: ClaimEvidence[] = []): Claim {
  const supporting = evidence.filter((item) => item.claimId === claim.id && item.supportsClaim);
  const weakening = evidence.filter((item) => item.claimId === claim.id && item.weakensClaim);
  const supportScore = supporting.reduce((sum, item) => sum + item.strengthScore, 0);
  const weakenScore = weakening.reduce((sum, item) => sum + item.strengthScore, 0);
  const evidenceStrength = evidence.length
    ? clamp01((supportScore + claim.evidenceStrength) / Math.max(1, supporting.length + 1) - weakenScore * 0.12)
    : claim.evidenceStrength;
  const confidenceScore = clamp01(claim.confidenceScore * 0.55 + evidenceStrength * 0.45);

  return {
    ...claim,
    confidenceScore,
    evidenceStrength,
    status: statusFromScores(confidenceScore, evidenceStrength),
    updatedAt: nowIso()
  };
}

export function attachEvidenceToClaim(
  claim: Claim,
  input: Omit<ClaimEvidenceInput, "workspaceId" | "organizationId" | "claimId">
): { claim: Claim; evidence: ClaimEvidence } {
  const date = nowIso();
  const evidence: ClaimEvidence = {
    id: createScopedId("claim-evidence"),
    organizationId: claim.organizationId,
    workspaceId: claim.workspaceId,
    claimId: claim.id,
    evidenceType: input.evidenceType,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    summary: input.summary,
    strengthScore: clamp01(input.strengthScore ?? 0.62),
    supportsClaim: input.supportsClaim ?? true,
    weakensClaim: input.weakensClaim ?? false,
    createdAt: date,
    updatedAt: date
  };

  return {
    claim: updateClaimConfidence(claim, [evidence]),
    evidence
  };
}

export function challengeClaim(claim: Claim, reason = "New evidence challenged this claim."): Claim {
  return {
    ...claim,
    status: "CHALLENGED",
    confidenceScore: clamp01(claim.confidenceScore - 0.12),
    statement: `${claim.statement} Challenge: ${reason}`,
    updatedAt: nowIso()
  };
}

export function validateClaim(claim: Claim): Claim {
  return {
    ...claim,
    status: "VALIDATED",
    confidenceScore: clamp01(Math.max(claim.confidenceScore, 0.82)),
    evidenceStrength: clamp01(Math.max(claim.evidenceStrength, 0.74)),
    updatedAt: nowIso()
  };
}

export function invalidateClaim(claim: Claim, reason = "Outcome evidence contradicted the claim."): Claim {
  return {
    ...claim,
    status: "INVALIDATED",
    confidenceScore: clamp01(Math.min(claim.confidenceScore, 0.32)),
    statement: `${claim.statement} Invalidated because ${reason}`,
    updatedAt: nowIso()
  };
}

export function findRelatedClaims(claims: Claim[], query: string, workspaceId?: string): Claim[] {
  const queryTerms = terms(query);
  return claims
    .filter((claim) => !workspaceId || claim.workspaceId === workspaceId)
    .filter((claim) => {
      const haystack = `${claim.title} ${claim.statement} ${claim.claimType}`.toLowerCase();
      return queryTerms.some((term) => haystack.includes(term));
    })
    .sort((a, b) => b.confidenceScore - a.confidenceScore);
}

export function getHighConfidenceClaims(state: PlatformState, workspaceId: string): Claim[] {
  return state.claims
    .filter((claim) => claim.workspaceId === workspaceId && ["SUPPORTED", "VALIDATED"].includes(claim.status))
    .sort((a, b) => b.confidenceScore - a.confidenceScore || b.evidenceStrength - a.evidenceStrength);
}

export function getChallengedClaims(state: PlatformState, workspaceId: string): Claim[] {
  return state.claims
    .filter((claim) => claim.workspaceId === workspaceId && ["CHALLENGED", "INVALIDATED"].includes(claim.status))
    .sort((a, b) => a.confidenceScore - b.confidenceScore);
}
