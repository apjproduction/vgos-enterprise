-- VGOS v5.3 Intelligence Quality & Enterprise Hardening

ALTER TABLE "AIRecommendation"
ADD COLUMN IF NOT EXISTS "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "evidenceStrength" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "missingEvidence" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "duplicateRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "confidenceExplanation" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;

ALTER TABLE "RecommendedAction"
ADD COLUMN IF NOT EXISTS "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "evidenceStrength" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "missingEvidence" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "duplicateRisk" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "confidenceExplanation" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_workspaceId_idx" ON "AuditLog"("workspaceId");
CREATE INDEX IF NOT EXISTS "AuditLog_actor_idx" ON "AuditLog"("actor");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'AuditLog_workspaceId_fkey'
    ) THEN
        ALTER TABLE "AuditLog"
        ADD CONSTRAINT "AuditLog_workspaceId_fkey"
        FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
