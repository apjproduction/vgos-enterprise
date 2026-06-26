-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'METRIC_CREATED';
ALTER TYPE "EventType" ADD VALUE 'METRIC_UPDATED';
ALTER TYPE "EventType" ADD VALUE 'MEASUREMENT_CREATED';
ALTER TYPE "EventType" ADD VALUE 'LEARNING_CREATED';
ALTER TYPE "EventType" ADD VALUE 'ATTRIBUTION_CREATED';
ALTER TYPE "EventType" ADD VALUE 'STRATEGY_ADJUSTMENT_PROPOSED';
ALTER TYPE "EventType" ADD VALUE 'STRATEGY_ADJUSTMENT_ACCEPTED';
ALTER TYPE "EventType" ADD VALUE 'STRATEGY_ADJUSTMENT_REJECTED';
ALTER TYPE "EventType" ADD VALUE 'STRATEGY_ADJUSTMENT_IMPLEMENTED';

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('TRAFFIC', 'SIGNUPS', 'CONVERSIONS', 'BACKLINKS', 'REFERRING_DOMAINS', 'AI_MENTIONS', 'SEARCH_IMPRESSIONS', 'SEARCH_CLICKS', 'SOCIAL_IMPRESSIONS', 'SOCIAL_ENGAGEMENT', 'COMMUNITY_REPLIES', 'DIRECTORY_APPROVALS', 'CONTENT_PUBLISHED', 'EXPERIMENT_RESULT', 'REVENUE', 'AUTHORITY_SCORE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MetricStatus" AS ENUM ('HEALTHY', 'WATCH', 'IMPROVING', 'DECLINING', 'STALLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LearningType" AS ENUM ('CONTENT_PERFORMANCE', 'CHANNEL_PERFORMANCE', 'SEO_IMPACT', 'AEO_IMPACT', 'GEO_IMPACT', 'AUTHORITY_IMPACT', 'COMMUNITY_SIGNAL', 'PRODUCT_SIGNAL', 'EXECUTION_FAILURE', 'STRATEGY_UPDATE', 'EXPERIMENT_LEARNING', 'CUSTOMER_LANGUAGE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AttributionType" AS ENUM ('INFLUENCED', 'CAUSED', 'CORRELATED', 'SUPPORTED', 'CONTRADICTED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "StrategyAdjustmentType" AS ENUM ('INCREASE_FOCUS', 'DECREASE_FOCUS', 'PAUSE_STRATEGY', 'CREATE_NEW_PLAN', 'UPDATE_POSITIONING', 'UPDATE_CONTENT_CLUSTER', 'UPDATE_KEYWORD_TARGET', 'UPDATE_PERSONA_PRIORITY', 'UPDATE_CHANNEL_PRIORITY', 'CREATE_EXPERIMENT', 'CREATE_FEATURE_REQUEST');

-- CreateEnum
CREATE TYPE "StrategyAdjustmentStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'REJECTED', 'IMPLEMENTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "source" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "previousValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetValue" DOUBLE PRECISION,
    "status" "MetricStatus" NOT NULL DEFAULT 'WATCH',
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "executionItemId" TEXT,
    "executionResultId" TEXT,
    "planId" TEXT,
    "objectiveId" TEXT,
    "campaignId" TEXT,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "previousValue" DOUBLE PRECISION,
    "changeValue" DOUBLE PRECISION,
    "changePercent" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Learning" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "learningType" "LearningType" NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "metricId" TEXT,
    "executionItemId" TEXT,
    "planId" TEXT,
    "objectiveId" TEXT,
    "recommendationImpact" TEXT NOT NULL,
    "shouldInformFuturePlans" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Learning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribution" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "attributionType" "AttributionType" NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evidence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAdjustment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "adjustmentType" "StrategyAdjustmentType" NOT NULL,
    "sourceLearningId" TEXT,
    "objectiveId" TEXT,
    "planId" TEXT,
    "status" "StrategyAdjustmentStatus" NOT NULL DEFAULT 'PROPOSED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Metric_organizationId_idx" ON "Metric"("organizationId");
CREATE INDEX "Metric_workspaceId_idx" ON "Metric"("workspaceId");
CREATE INDEX "Metric_metricType_idx" ON "Metric"("metricType");
CREATE INDEX "Metric_status_idx" ON "Metric"("status");
CREATE INDEX "Metric_owner_idx" ON "Metric"("owner");
CREATE INDEX "Metric_source_idx" ON "Metric"("source");
CREATE INDEX "Measurement_organizationId_idx" ON "Measurement"("organizationId");
CREATE INDEX "Measurement_workspaceId_idx" ON "Measurement"("workspaceId");
CREATE INDEX "Measurement_metricId_idx" ON "Measurement"("metricId");
CREATE INDEX "Measurement_sourceType_sourceId_idx" ON "Measurement"("sourceType", "sourceId");
CREATE INDEX "Measurement_executionItemId_idx" ON "Measurement"("executionItemId");
CREATE INDEX "Measurement_executionResultId_idx" ON "Measurement"("executionResultId");
CREATE INDEX "Measurement_planId_idx" ON "Measurement"("planId");
CREATE INDEX "Measurement_objectiveId_idx" ON "Measurement"("objectiveId");
CREATE INDEX "Measurement_campaignId_idx" ON "Measurement"("campaignId");
CREATE INDEX "Measurement_measuredAt_idx" ON "Measurement"("measuredAt");
CREATE INDEX "Learning_organizationId_idx" ON "Learning"("organizationId");
CREATE INDEX "Learning_workspaceId_idx" ON "Learning"("workspaceId");
CREATE INDEX "Learning_learningType_idx" ON "Learning"("learningType");
CREATE INDEX "Learning_confidenceScore_idx" ON "Learning"("confidenceScore");
CREATE INDEX "Learning_sourceType_sourceId_idx" ON "Learning"("sourceType", "sourceId");
CREATE INDEX "Learning_metricId_idx" ON "Learning"("metricId");
CREATE INDEX "Learning_executionItemId_idx" ON "Learning"("executionItemId");
CREATE INDEX "Learning_planId_idx" ON "Learning"("planId");
CREATE INDEX "Learning_objectiveId_idx" ON "Learning"("objectiveId");
CREATE INDEX "Learning_shouldInformFuturePlans_idx" ON "Learning"("shouldInformFuturePlans");
CREATE INDEX "Attribution_organizationId_idx" ON "Attribution"("organizationId");
CREATE INDEX "Attribution_workspaceId_idx" ON "Attribution"("workspaceId");
CREATE INDEX "Attribution_sourceType_sourceId_idx" ON "Attribution"("sourceType", "sourceId");
CREATE INDEX "Attribution_targetType_targetId_idx" ON "Attribution"("targetType", "targetId");
CREATE INDEX "Attribution_attributionType_idx" ON "Attribution"("attributionType");
CREATE INDEX "Attribution_confidenceScore_idx" ON "Attribution"("confidenceScore");
CREATE INDEX "StrategyAdjustment_organizationId_idx" ON "StrategyAdjustment"("organizationId");
CREATE INDEX "StrategyAdjustment_workspaceId_idx" ON "StrategyAdjustment"("workspaceId");
CREATE INDEX "StrategyAdjustment_adjustmentType_idx" ON "StrategyAdjustment"("adjustmentType");
CREATE INDEX "StrategyAdjustment_sourceLearningId_idx" ON "StrategyAdjustment"("sourceLearningId");
CREATE INDEX "StrategyAdjustment_objectiveId_idx" ON "StrategyAdjustment"("objectiveId");
CREATE INDEX "StrategyAdjustment_planId_idx" ON "StrategyAdjustment"("planId");
CREATE INDEX "StrategyAdjustment_status_idx" ON "StrategyAdjustment"("status");
CREATE INDEX "StrategyAdjustment_priority_idx" ON "StrategyAdjustment"("priority");

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_executionResultId_fkey" FOREIGN KEY ("executionResultId") REFERENCES "ExecutionResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attribution" ADD CONSTRAINT "Attribution_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StrategyAdjustment" ADD CONSTRAINT "StrategyAdjustment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StrategyAdjustment" ADD CONSTRAINT "StrategyAdjustment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StrategyAdjustment" ADD CONSTRAINT "StrategyAdjustment_sourceLearningId_fkey" FOREIGN KEY ("sourceLearningId") REFERENCES "Learning"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StrategyAdjustment" ADD CONSTRAINT "StrategyAdjustment_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StrategyAdjustment" ADD CONSTRAINT "StrategyAdjustment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
