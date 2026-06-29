-- AlterEnum
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_STARTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_COMPLETED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_BLOCKED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_AT_RISK';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_UPDATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_SUMMARY_GENERATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_RECOMMENDATION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_HEALTH_CHANGED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'MISSION_PROGRESS_UPDATED';

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('AUTHORITY', 'SEO', 'AEO', 'GEO', 'CONTENT', 'COMMUNITY', 'PRODUCT', 'LAUNCH', 'GROWTH', 'REVENUE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'BLOCKED', 'AT_RISK', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "missionType" "MissionType" NOT NULL,
    "owner" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "velocityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionObjective" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "objectiveId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionPlan" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionExecution" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "executionItemId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionLearning" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "learningId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionLearning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionMetric" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionSummary" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MissionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mission_organizationId_idx" ON "Mission"("organizationId");
CREATE INDEX "Mission_workspaceId_idx" ON "Mission"("workspaceId");
CREATE INDEX "Mission_missionType_idx" ON "Mission"("missionType");
CREATE INDEX "Mission_priority_idx" ON "Mission"("priority");
CREATE INDEX "Mission_status_idx" ON "Mission"("status");
CREATE INDEX "Mission_owner_idx" ON "Mission"("owner");
CREATE INDEX "Mission_healthScore_idx" ON "Mission"("healthScore");
CREATE INDEX "Mission_targetDate_idx" ON "Mission"("targetDate");

-- CreateIndex
CREATE UNIQUE INDEX "MissionObjective_missionId_objectiveId_key" ON "MissionObjective"("missionId", "objectiveId");
CREATE INDEX "MissionObjective_missionId_idx" ON "MissionObjective"("missionId");
CREATE INDEX "MissionObjective_objectiveId_idx" ON "MissionObjective"("objectiveId");
CREATE INDEX "MissionObjective_workspaceId_idx" ON "MissionObjective"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "MissionPlan_missionId_planId_key" ON "MissionPlan"("missionId", "planId");
CREATE INDEX "MissionPlan_missionId_idx" ON "MissionPlan"("missionId");
CREATE INDEX "MissionPlan_planId_idx" ON "MissionPlan"("planId");
CREATE INDEX "MissionPlan_workspaceId_idx" ON "MissionPlan"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "MissionExecution_missionId_executionItemId_key" ON "MissionExecution"("missionId", "executionItemId");
CREATE INDEX "MissionExecution_missionId_idx" ON "MissionExecution"("missionId");
CREATE INDEX "MissionExecution_executionItemId_idx" ON "MissionExecution"("executionItemId");
CREATE INDEX "MissionExecution_workspaceId_idx" ON "MissionExecution"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "MissionLearning_missionId_learningId_key" ON "MissionLearning"("missionId", "learningId");
CREATE INDEX "MissionLearning_missionId_idx" ON "MissionLearning"("missionId");
CREATE INDEX "MissionLearning_learningId_idx" ON "MissionLearning"("learningId");
CREATE INDEX "MissionLearning_workspaceId_idx" ON "MissionLearning"("workspaceId");
CREATE INDEX "MissionLearning_confidence_idx" ON "MissionLearning"("confidence");

-- CreateIndex
CREATE UNIQUE INDEX "MissionMetric_missionId_metricId_key" ON "MissionMetric"("missionId", "metricId");
CREATE INDEX "MissionMetric_missionId_idx" ON "MissionMetric"("missionId");
CREATE INDEX "MissionMetric_metricId_idx" ON "MissionMetric"("metricId");
CREATE INDEX "MissionMetric_workspaceId_idx" ON "MissionMetric"("workspaceId");

-- CreateIndex
CREATE INDEX "MissionSummary_missionId_idx" ON "MissionSummary"("missionId");
CREATE INDEX "MissionSummary_workspaceId_idx" ON "MissionSummary"("workspaceId");
CREATE INDEX "MissionSummary_generatedAt_idx" ON "MissionSummary"("generatedAt");
CREATE INDEX "MissionSummary_confidence_idx" ON "MissionSummary"("confidence");

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionObjective" ADD CONSTRAINT "MissionObjective_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionObjective" ADD CONSTRAINT "MissionObjective_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionObjective" ADD CONSTRAINT "MissionObjective_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionPlan" ADD CONSTRAINT "MissionPlan_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionPlan" ADD CONSTRAINT "MissionPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionPlan" ADD CONSTRAINT "MissionPlan_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionExecution" ADD CONSTRAINT "MissionExecution_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionExecution" ADD CONSTRAINT "MissionExecution_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionExecution" ADD CONSTRAINT "MissionExecution_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionLearning" ADD CONSTRAINT "MissionLearning_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionLearning" ADD CONSTRAINT "MissionLearning_learningId_fkey" FOREIGN KEY ("learningId") REFERENCES "Learning"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionLearning" ADD CONSTRAINT "MissionLearning_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionMetric" ADD CONSTRAINT "MissionMetric_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionMetric" ADD CONSTRAINT "MissionMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionMetric" ADD CONSTRAINT "MissionMetric_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionSummary" ADD CONSTRAINT "MissionSummary_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MissionSummary" ADD CONSTRAINT "MissionSummary_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
