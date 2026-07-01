ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'ASSUMPTION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'ASSUMPTION_VALIDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'ASSUMPTION_INVALIDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'EVIDENCE_ASSESSED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'COUNTER_EVIDENCE_FOUND';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'TRADEOFF_ANALYZED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'JUDGMENT_GENERATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'REFLECTION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONFIDENCE_RECALIBRATED';

CREATE TYPE "AssumptionStatus" AS ENUM ('UNTESTED', 'VALIDATED', 'INVALIDATED', 'NEEDS_EVIDENCE', 'ARCHIVED');

CREATE TYPE "CognitionRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TYPE "CognitionEvidenceType" AS ENUM ('SIGNAL', 'MEASUREMENT', 'LEARNING', 'EXECUTION_RESULT', 'CONNECTOR_DATA', 'MANUAL_NOTE', 'HISTORICAL_PATTERN', 'COUNTER_EVIDENCE');

CREATE TABLE "Assumption" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "status" "AssumptionStatus" NOT NULL DEFAULT 'UNTESTED',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" "CognitionRiskLevel" NOT NULL DEFAULT 'MEDIUM',
  "validationMethod" TEXT,
  "validatedAt" TIMESTAMP(3),
  "invalidatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Assumption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvidenceAssessment" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "evidenceType" "CognitionEvidenceType" NOT NULL,
  "summary" TEXT NOT NULL,
  "strengthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "recencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "relevanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "limitations" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "EvidenceAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradeoffAnalysis" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "optionA" TEXT NOT NULL,
  "optionB" TEXT NOT NULL,
  "optionC" TEXT,
  "recommendedOption" TEXT NOT NULL,
  "rationale" TEXT NOT NULL,
  "opportunityCost" TEXT NOT NULL,
  "riskSummary" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TradeoffAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reflection" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "summary" TEXT NOT NULL,
  "whatWorked" TEXT NOT NULL,
  "whatFailed" TEXT NOT NULL,
  "wrongAssumptions" TEXT NOT NULL,
  "newLearning" TEXT NOT NULL,
  "futureAdjustment" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Assumption_organizationId_idx" ON "Assumption"("organizationId");
CREATE INDEX "Assumption_workspaceId_idx" ON "Assumption"("workspaceId");
CREATE INDEX "Assumption_sourceType_sourceId_idx" ON "Assumption"("sourceType", "sourceId");
CREATE INDEX "Assumption_status_idx" ON "Assumption"("status");
CREATE INDEX "Assumption_riskLevel_idx" ON "Assumption"("riskLevel");
CREATE INDEX "Assumption_confidenceScore_idx" ON "Assumption"("confidenceScore");

CREATE INDEX "EvidenceAssessment_organizationId_idx" ON "EvidenceAssessment"("organizationId");
CREATE INDEX "EvidenceAssessment_workspaceId_idx" ON "EvidenceAssessment"("workspaceId");
CREATE INDEX "EvidenceAssessment_sourceType_sourceId_idx" ON "EvidenceAssessment"("sourceType", "sourceId");
CREATE INDEX "EvidenceAssessment_evidenceType_idx" ON "EvidenceAssessment"("evidenceType");
CREATE INDEX "EvidenceAssessment_overallScore_idx" ON "EvidenceAssessment"("overallScore");

CREATE INDEX "TradeoffAnalysis_organizationId_idx" ON "TradeoffAnalysis"("organizationId");
CREATE INDEX "TradeoffAnalysis_workspaceId_idx" ON "TradeoffAnalysis"("workspaceId");
CREATE INDEX "TradeoffAnalysis_sourceType_sourceId_idx" ON "TradeoffAnalysis"("sourceType", "sourceId");
CREATE INDEX "TradeoffAnalysis_confidenceScore_idx" ON "TradeoffAnalysis"("confidenceScore");

CREATE INDEX "Reflection_organizationId_idx" ON "Reflection"("organizationId");
CREATE INDEX "Reflection_workspaceId_idx" ON "Reflection"("workspaceId");
CREATE INDEX "Reflection_sourceType_sourceId_idx" ON "Reflection"("sourceType", "sourceId");
CREATE INDEX "Reflection_confidenceScore_idx" ON "Reflection"("confidenceScore");

ALTER TABLE "Assumption" ADD CONSTRAINT "Assumption_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assumption" ADD CONSTRAINT "Assumption_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EvidenceAssessment" ADD CONSTRAINT "EvidenceAssessment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EvidenceAssessment" ADD CONSTRAINT "EvidenceAssessment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TradeoffAnalysis" ADD CONSTRAINT "TradeoffAnalysis_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeoffAnalysis" ADD CONSTRAINT "TradeoffAnalysis_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
