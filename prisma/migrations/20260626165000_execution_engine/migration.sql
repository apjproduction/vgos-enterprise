-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'EXECUTION_STARTED';
ALTER TYPE "EventType" ADD VALUE 'EXECUTION_COMPLETED';
ALTER TYPE "EventType" ADD VALUE 'EXECUTION_BLOCKED';
ALTER TYPE "EventType" ADD VALUE 'EXECUTION_FAILED';
ALTER TYPE "EventType" ADD VALUE 'APPROVAL_REQUESTED';
ALTER TYPE "EventType" ADD VALUE 'APPROVAL_APPROVED';
ALTER TYPE "EventType" ADD VALUE 'APPROVAL_REJECTED';
ALTER TYPE "EventType" ADD VALUE 'EVIDENCE_ADDED';
ALTER TYPE "EventType" ADD VALUE 'EXECUTION_RESULT_CREATED';

-- CreateEnum
CREATE TYPE "ExecutionType" AS ENUM ('BLOG_PUBLISH', 'FOUNDER_POST', 'COMPANY_POST', 'X_POST', 'X_THREAD', 'PINTEREST_PIN', 'DIRECTORY_SUBMISSION', 'BACKLINK_OUTREACH', 'COMMUNITY_REPLY', 'DEMO_CREATION', 'FAQ_UPDATE', 'LANDING_PAGE_UPDATE', 'INTERNAL_LINK_UPDATE', 'NEWSLETTER_SEND', 'YOUTUBE_SCRIPT', 'PRODUCT_TASK', 'EXPERIMENT_RUN', 'MANUAL_ACTION');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('QUEUED', 'READY', 'IN_PROGRESS', 'BLOCKED', 'NEEDS_APPROVAL', 'APPROVED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('URL', 'SCREENSHOT', 'FILE', 'NOTE', 'METRIC', 'SOCIAL_POST', 'DIRECTORY_CONFIRMATION', 'BACKLINK_LIVE', 'BLOG_LIVE', 'COMMENT_REPLY', 'DEMO_ASSET');

-- CreateEnum
CREATE TYPE "BlockerType" AS ENUM ('MISSING_CONTENT', 'MISSING_GRAPHIC', 'MISSING_APPROVAL', 'MISSING_ACCESS', 'TECHNICAL_ISSUE', 'WAITING_ON_EXTERNAL_SITE', 'NEEDS_REVIEW', 'LOW_CONFIDENCE', 'RESOURCE_LIMIT', 'OTHER');

-- CreateEnum
CREATE TYPE "BlockerStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'IGNORED');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('CONTENT_APPROVAL', 'BRAND_APPROVAL', 'SEO_APPROVAL', 'PRODUCT_APPROVAL', 'LEGAL_APPROVAL', 'FOUNDER_APPROVAL', 'PUBLISHING_APPROVAL');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExecutionResultType" AS ENUM ('COMPLETED', 'PARTIAL_SUCCESS', 'FAILED', 'LEARNING_CAPTURED', 'METRIC_IMPROVED', 'NO_IMPACT', 'FOLLOW_UP_REQUIRED');

-- CreateTable
CREATE TABLE "ExecutionItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "executionType" "ExecutionType" NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'QUEUED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "sourceType" TEXT,
    "sourceId" TEXT,
    "planId" TEXT,
    "planItemId" TEXT,
    "recommendedActionId" TEXT,
    "workflowRunId" TEXT,
    "objectiveId" TEXT,
    "campaignId" TEXT,
    "expectedImpact" TEXT NOT NULL,
    "actualImpact" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionEvidence" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "executionItemId" TEXT NOT NULL,
    "evidenceType" "EvidenceType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT NOT NULL,
    "uploadedAssetUrl" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionBlocker" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "executionItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "blockerType" "BlockerType" NOT NULL,
    "severity" "ConstraintSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "BlockerStatus" NOT NULL DEFAULT 'OPEN',
    "owner" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionBlocker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "executionItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approvalType" "ApprovalType" NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedBy" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionResult" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "executionItemId" TEXT NOT NULL,
    "resultType" "ExecutionResultType" NOT NULL,
    "summary" TEXT NOT NULL,
    "metricName" TEXT,
    "metricBefore" DOUBLE PRECISION,
    "metricAfter" DOUBLE PRECISION,
    "impactScore" INTEGER,
    "learning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExecutionItem_organizationId_idx" ON "ExecutionItem"("organizationId");
CREATE INDEX "ExecutionItem_workspaceId_idx" ON "ExecutionItem"("workspaceId");
CREATE INDEX "ExecutionItem_executionType_idx" ON "ExecutionItem"("executionType");
CREATE INDEX "ExecutionItem_status_idx" ON "ExecutionItem"("status");
CREATE INDEX "ExecutionItem_priority_idx" ON "ExecutionItem"("priority");
CREATE INDEX "ExecutionItem_owner_idx" ON "ExecutionItem"("owner");
CREATE INDEX "ExecutionItem_dueDate_idx" ON "ExecutionItem"("dueDate");
CREATE INDEX "ExecutionItem_sourceType_sourceId_idx" ON "ExecutionItem"("sourceType", "sourceId");
CREATE INDEX "ExecutionItem_planId_idx" ON "ExecutionItem"("planId");
CREATE INDEX "ExecutionItem_planItemId_idx" ON "ExecutionItem"("planItemId");
CREATE INDEX "ExecutionItem_recommendedActionId_idx" ON "ExecutionItem"("recommendedActionId");
CREATE INDEX "ExecutionItem_workflowRunId_idx" ON "ExecutionItem"("workflowRunId");
CREATE INDEX "ExecutionItem_objectiveId_idx" ON "ExecutionItem"("objectiveId");
CREATE INDEX "ExecutionItem_campaignId_idx" ON "ExecutionItem"("campaignId");
CREATE INDEX "ExecutionEvidence_organizationId_idx" ON "ExecutionEvidence"("organizationId");
CREATE INDEX "ExecutionEvidence_workspaceId_idx" ON "ExecutionEvidence"("workspaceId");
CREATE INDEX "ExecutionEvidence_executionItemId_idx" ON "ExecutionEvidence"("executionItemId");
CREATE INDEX "ExecutionEvidence_evidenceType_idx" ON "ExecutionEvidence"("evidenceType");
CREATE INDEX "ExecutionEvidence_capturedAt_idx" ON "ExecutionEvidence"("capturedAt");
CREATE INDEX "ExecutionBlocker_organizationId_idx" ON "ExecutionBlocker"("organizationId");
CREATE INDEX "ExecutionBlocker_workspaceId_idx" ON "ExecutionBlocker"("workspaceId");
CREATE INDEX "ExecutionBlocker_executionItemId_idx" ON "ExecutionBlocker"("executionItemId");
CREATE INDEX "ExecutionBlocker_blockerType_idx" ON "ExecutionBlocker"("blockerType");
CREATE INDEX "ExecutionBlocker_severity_idx" ON "ExecutionBlocker"("severity");
CREATE INDEX "ExecutionBlocker_status_idx" ON "ExecutionBlocker"("status");
CREATE INDEX "ExecutionBlocker_owner_idx" ON "ExecutionBlocker"("owner");
CREATE INDEX "ApprovalRequest_organizationId_idx" ON "ApprovalRequest"("organizationId");
CREATE INDEX "ApprovalRequest_workspaceId_idx" ON "ApprovalRequest"("workspaceId");
CREATE INDEX "ApprovalRequest_executionItemId_idx" ON "ApprovalRequest"("executionItemId");
CREATE INDEX "ApprovalRequest_approvalType_idx" ON "ApprovalRequest"("approvalType");
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");
CREATE INDEX "ApprovalRequest_reviewer_idx" ON "ApprovalRequest"("reviewer");
CREATE INDEX "ApprovalRequest_requestedAt_idx" ON "ApprovalRequest"("requestedAt");
CREATE INDEX "ExecutionResult_organizationId_idx" ON "ExecutionResult"("organizationId");
CREATE INDEX "ExecutionResult_workspaceId_idx" ON "ExecutionResult"("workspaceId");
CREATE INDEX "ExecutionResult_executionItemId_idx" ON "ExecutionResult"("executionItemId");
CREATE INDEX "ExecutionResult_resultType_idx" ON "ExecutionResult"("resultType");
CREATE INDEX "ExecutionResult_metricName_idx" ON "ExecutionResult"("metricName");

-- AddForeignKey
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_planItemId_fkey" FOREIGN KEY ("planItemId") REFERENCES "PlanItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_recommendedActionId_fkey" FOREIGN KEY ("recommendedActionId") REFERENCES "RecommendedAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "WorkflowRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionItem" ADD CONSTRAINT "ExecutionItem_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExecutionEvidence" ADD CONSTRAINT "ExecutionEvidence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionEvidence" ADD CONSTRAINT "ExecutionEvidence_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionEvidence" ADD CONSTRAINT "ExecutionEvidence_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionBlocker" ADD CONSTRAINT "ExecutionBlocker_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionBlocker" ADD CONSTRAINT "ExecutionBlocker_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionBlocker" ADD CONSTRAINT "ExecutionBlocker_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionResult" ADD CONSTRAINT "ExecutionResult_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionResult" ADD CONSTRAINT "ExecutionResult_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExecutionResult" ADD CONSTRAINT "ExecutionResult_executionItemId_fkey" FOREIGN KEY ("executionItemId") REFERENCES "ExecutionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
