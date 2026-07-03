ALTER TABLE "Assumption" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

ALTER TABLE "EvidenceAssessment"
ADD COLUMN IF NOT EXISTS "freshnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "supportsRecommendation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "weakensRecommendation" BOOLEAN NOT NULL DEFAULT false;

UPDATE "EvidenceAssessment"
SET "freshnessScore" = "recencyScore"
WHERE "freshnessScore" = 0;

UPDATE "EvidenceAssessment"
SET "supportsRecommendation" = false,
    "weakensRecommendation" = true
WHERE "evidenceType" = 'COUNTER_EVIDENCE';

ALTER TABLE "TradeoffAnalysis"
ADD COLUMN IF NOT EXISTS "optionAScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "optionBScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "relatedRecommendationId" TEXT,
ADD COLUMN IF NOT EXISTS "relatedMissionId" TEXT;

UPDATE "TradeoffAnalysis"
SET "relatedRecommendationId" = "sourceId"
WHERE "sourceType" = 'RecommendedAction' AND "relatedRecommendationId" IS NULL;

UPDATE "TradeoffAnalysis"
SET "relatedMissionId" = "sourceId"
WHERE "sourceType" = 'Mission' AND "relatedMissionId" IS NULL;

CREATE TABLE IF NOT EXISTS "JudgmentRecord" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "recommendationId" TEXT,
  "missionId" TEXT,
  "judgment" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reasoning" TEXT NOT NULL,
  "assumptions" JSONB NOT NULL,
  "supportingEvidence" JSONB NOT NULL,
  "counterEvidence" JSONB NOT NULL,
  "tradeoffs" JSONB NOT NULL,
  "changeTriggers" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "JudgmentRecord_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "JudgmentRecord" ADD CONSTRAINT "JudgmentRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JudgmentRecord" ADD CONSTRAINT "JudgmentRecord_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "JudgmentRecord_organizationId_idx" ON "JudgmentRecord"("organizationId");
CREATE INDEX IF NOT EXISTS "JudgmentRecord_workspaceId_idx" ON "JudgmentRecord"("workspaceId");
CREATE INDEX IF NOT EXISTS "JudgmentRecord_recommendationId_idx" ON "JudgmentRecord"("recommendationId");
CREATE INDEX IF NOT EXISTS "JudgmentRecord_missionId_idx" ON "JudgmentRecord"("missionId");
CREATE INDEX IF NOT EXISTS "JudgmentRecord_confidenceScore_idx" ON "JudgmentRecord"("confidenceScore");

CREATE INDEX IF NOT EXISTS "TradeoffAnalysis_relatedRecommendationId_idx" ON "TradeoffAnalysis"("relatedRecommendationId");
CREATE INDEX IF NOT EXISTS "TradeoffAnalysis_relatedMissionId_idx" ON "TradeoffAnalysis"("relatedMissionId");

ALTER TABLE "Reflection"
ADD COLUMN IF NOT EXISTS "originalJudgment" TEXT,
ADD COLUMN IF NOT EXISTS "outcomeSummary" TEXT,
ADD COLUMN IF NOT EXISTS "wasCorrect" BOOLEAN,
ADD COLUMN IF NOT EXISTS "whatWasMissed" TEXT,
ADD COLUMN IF NOT EXISTS "whatChanged" TEXT,
ADD COLUMN IF NOT EXISTS "lesson" TEXT,
ADD COLUMN IF NOT EXISTS "recalibrationSuggestion" TEXT;
