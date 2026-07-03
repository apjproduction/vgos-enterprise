ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CLAIM_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CLAIM_VALIDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CLAIM_CHALLENGED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CLAIM_INVALIDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'BELIEF_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'BELIEF_UPDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'BELIEF_CHALLENGED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'BELIEF_REVISED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_VALIDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'REALITY_MODEL_UPDATED';

CREATE TYPE "ClaimType" AS ENUM ('MARKET', 'CUSTOMER', 'PRODUCT', 'GROWTH', 'SEO', 'AEO', 'GEO', 'CHANNEL', 'COMPETITOR', 'OPERATIONAL', 'STRATEGIC', 'PHILOSOPHICAL', 'CUSTOM');
CREATE TYPE "ClaimStatus" AS ENUM ('PROPOSED', 'SUPPORTED', 'CHALLENGED', 'VALIDATED', 'INVALIDATED', 'ARCHIVED');
CREATE TYPE "BeliefType" AS ENUM ('MARKET_BELIEF', 'CUSTOMER_BELIEF', 'PRODUCT_BELIEF', 'GROWTH_BELIEF', 'STRATEGIC_BELIEF', 'OPERATING_BELIEF', 'PHILOSOPHICAL_BELIEF', 'CUSTOM');
CREATE TYPE "BeliefStatus" AS ENUM ('ACTIVE', 'WATCHING', 'CORE', 'CHALLENGED', 'RETIRED');
CREATE TYPE "DecisionValidationStatus" AS ENUM ('STRONGLY_SUPPORTED', 'SUPPORTED', 'MIXED', 'WEAKLY_SUPPORTED', 'CONTRADICTED', 'INSUFFICIENT_EVIDENCE');

CREATE TABLE "Claim" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "statement" TEXT NOT NULL,
  "claimType" "ClaimType" NOT NULL,
  "status" "ClaimStatus" NOT NULL DEFAULT 'PROPOSED',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "evidenceStrength" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClaimEvidence" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "claimId" TEXT NOT NULL,
  "evidenceType" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "strengthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "supportsClaim" BOOLEAN NOT NULL DEFAULT true,
  "weakensClaim" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ClaimEvidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Belief" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "statement" TEXT NOT NULL,
  "beliefType" "BeliefType" NOT NULL,
  "status" "BeliefStatus" NOT NULL DEFAULT 'ACTIVE',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "stabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lastChallengedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Belief_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BeliefClaim" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "beliefId" TEXT NOT NULL,
  "claimId" TEXT NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BeliefClaim_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BeliefRevision" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "beliefId" TEXT NOT NULL,
  "previousConfidence" DOUBLE PRECISION NOT NULL,
  "newConfidence" DOUBLE PRECISION NOT NULL,
  "reason" TEXT NOT NULL,
  "triggeredByType" TEXT NOT NULL,
  "triggeredById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BeliefRevision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionValidation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "decisionId" TEXT,
  "recommendationId" TEXT,
  "missionId" TEXT,
  "title" TEXT NOT NULL,
  "validationStatus" "DecisionValidationStatus" NOT NULL,
  "supportedBeliefs" JSONB NOT NULL,
  "challengedBeliefs" JSONB NOT NULL,
  "supportingClaims" JSONB NOT NULL,
  "challengedClaims" JSONB NOT NULL,
  "evidenceSummary" TEXT NOT NULL,
  "riskSummary" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DecisionValidation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BeliefClaim_beliefId_claimId_key" ON "BeliefClaim"("beliefId", "claimId");

CREATE INDEX "Claim_organizationId_idx" ON "Claim"("organizationId");
CREATE INDEX "Claim_workspaceId_idx" ON "Claim"("workspaceId");
CREATE INDEX "Claim_claimType_idx" ON "Claim"("claimType");
CREATE INDEX "Claim_status_idx" ON "Claim"("status");
CREATE INDEX "Claim_sourceType_sourceId_idx" ON "Claim"("sourceType", "sourceId");
CREATE INDEX "Claim_confidenceScore_idx" ON "Claim"("confidenceScore");
CREATE INDEX "Claim_evidenceStrength_idx" ON "Claim"("evidenceStrength");

CREATE INDEX "ClaimEvidence_organizationId_idx" ON "ClaimEvidence"("organizationId");
CREATE INDEX "ClaimEvidence_workspaceId_idx" ON "ClaimEvidence"("workspaceId");
CREATE INDEX "ClaimEvidence_claimId_idx" ON "ClaimEvidence"("claimId");
CREATE INDEX "ClaimEvidence_evidenceType_idx" ON "ClaimEvidence"("evidenceType");
CREATE INDEX "ClaimEvidence_sourceType_sourceId_idx" ON "ClaimEvidence"("sourceType", "sourceId");
CREATE INDEX "ClaimEvidence_strengthScore_idx" ON "ClaimEvidence"("strengthScore");

CREATE INDEX "Belief_organizationId_idx" ON "Belief"("organizationId");
CREATE INDEX "Belief_workspaceId_idx" ON "Belief"("workspaceId");
CREATE INDEX "Belief_beliefType_idx" ON "Belief"("beliefType");
CREATE INDEX "Belief_status_idx" ON "Belief"("status");
CREATE INDEX "Belief_confidenceScore_idx" ON "Belief"("confidenceScore");
CREATE INDEX "Belief_stabilityScore_idx" ON "Belief"("stabilityScore");
CREATE INDEX "Belief_impactScore_idx" ON "Belief"("impactScore");
CREATE INDEX "Belief_lastChallengedAt_idx" ON "Belief"("lastChallengedAt");

CREATE INDEX "BeliefClaim_organizationId_idx" ON "BeliefClaim"("organizationId");
CREATE INDEX "BeliefClaim_workspaceId_idx" ON "BeliefClaim"("workspaceId");
CREATE INDEX "BeliefClaim_beliefId_idx" ON "BeliefClaim"("beliefId");
CREATE INDEX "BeliefClaim_claimId_idx" ON "BeliefClaim"("claimId");
CREATE INDEX "BeliefClaim_weight_idx" ON "BeliefClaim"("weight");

CREATE INDEX "BeliefRevision_organizationId_idx" ON "BeliefRevision"("organizationId");
CREATE INDEX "BeliefRevision_workspaceId_idx" ON "BeliefRevision"("workspaceId");
CREATE INDEX "BeliefRevision_beliefId_idx" ON "BeliefRevision"("beliefId");
CREATE INDEX "BeliefRevision_triggeredByType_triggeredById_idx" ON "BeliefRevision"("triggeredByType", "triggeredById");
CREATE INDEX "BeliefRevision_newConfidence_idx" ON "BeliefRevision"("newConfidence");
CREATE INDEX "BeliefRevision_createdAt_idx" ON "BeliefRevision"("createdAt");

CREATE INDEX "DecisionValidation_organizationId_idx" ON "DecisionValidation"("organizationId");
CREATE INDEX "DecisionValidation_workspaceId_idx" ON "DecisionValidation"("workspaceId");
CREATE INDEX "DecisionValidation_decisionId_idx" ON "DecisionValidation"("decisionId");
CREATE INDEX "DecisionValidation_recommendationId_idx" ON "DecisionValidation"("recommendationId");
CREATE INDEX "DecisionValidation_missionId_idx" ON "DecisionValidation"("missionId");
CREATE INDEX "DecisionValidation_validationStatus_idx" ON "DecisionValidation"("validationStatus");
CREATE INDEX "DecisionValidation_confidenceScore_idx" ON "DecisionValidation"("confidenceScore");

ALTER TABLE "Claim" ADD CONSTRAINT "Claim_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Belief" ADD CONSTRAINT "Belief_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Belief" ADD CONSTRAINT "Belief_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BeliefClaim" ADD CONSTRAINT "BeliefClaim_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BeliefClaim" ADD CONSTRAINT "BeliefClaim_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BeliefClaim" ADD CONSTRAINT "BeliefClaim_beliefId_fkey" FOREIGN KEY ("beliefId") REFERENCES "Belief"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BeliefClaim" ADD CONSTRAINT "BeliefClaim_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BeliefRevision" ADD CONSTRAINT "BeliefRevision_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BeliefRevision" ADD CONSTRAINT "BeliefRevision_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BeliefRevision" ADD CONSTRAINT "BeliefRevision_beliefId_fkey" FOREIGN KEY ("beliefId") REFERENCES "Belief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DecisionValidation" ADD CONSTRAINT "DecisionValidation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionValidation" ADD CONSTRAINT "DecisionValidation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionValidation" ADD CONSTRAINT "DecisionValidation_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "DecisionSituation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionValidation" ADD CONSTRAINT "DecisionValidation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "RecommendedAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionValidation" ADD CONSTRAINT "DecisionValidation_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
