ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_SITUATION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_OPTION_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'OPTION_EVALUATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'OPTION_CHALLENGED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DELIBERATION_STARTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DELIBERATION_COMPLETED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_COMMITTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_DEFERRED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'DECISION_REVIEWED';

CREATE TYPE "DecisionSituationType" AS ENUM ('PRIORITY_DECISION', 'STRATEGY_DECISION', 'CONTENT_DECISION', 'PRODUCT_DECISION', 'CHANNEL_DECISION', 'RESOURCE_DECISION', 'EXECUTION_DECISION', 'RISK_DECISION', 'CUSTOM');

CREATE TYPE "DecisionSituationStatus" AS ENUM ('OPEN', 'DELIBERATING', 'DECIDED', 'DEFERRED', 'CANCELLED', 'REVIEWED');

CREATE TYPE "DecisionOptionType" AS ENUM ('CREATE_CONTENT', 'CREATE_DEMO', 'PAUSE_WORK', 'START_EXECUTION', 'CHANGE_STRATEGY', 'RUN_EXPERIMENT', 'UPDATE_PAGE', 'REPLY_COMMUNITY', 'SUBMIT_DIRECTORY', 'DEFER_DECISION', 'DO_NOTHING', 'CUSTOM');

CREATE TYPE "DeliberationStatus" AS ENUM ('DRAFT', 'COMPLETED', 'DEFERRED', 'NEEDS_EVIDENCE');

CREATE TYPE "DecisionCommitmentType" AS ENUM ('EXECUTE_NOW', 'SCHEDULE', 'EXPERIMENT', 'MONITOR', 'DEFER', 'REJECT');

CREATE TYPE "DecisionCommitmentStatus" AS ENUM ('COMMITTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TYPE "DecisionQuality" AS ENUM ('STRONG', 'SOUND', 'MIXED', 'WEAK');

CREATE TABLE "DecisionSituation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "situationType" "DecisionSituationType" NOT NULL,
  "status" "DecisionSituationStatus" NOT NULL DEFAULT 'OPEN',
  "urgency" "Priority" NOT NULL DEFAULT 'MEDIUM',
  "sourceType" TEXT,
  "sourceId" TEXT,
  "missionId" TEXT,
  "objectiveId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DecisionSituation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionOption" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "situationId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "optionType" "DecisionOptionType" NOT NULL,
  "expectedImpact" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "estimatedEffort" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" "Priority" NOT NULL DEFAULT 'MEDIUM',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "pros" JSONB NOT NULL,
  "cons" JSONB NOT NULL,
  "assumptions" JSONB NOT NULL,
  "evidence" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DecisionOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OptionEvaluation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "optionId" TEXT NOT NULL,
  "situationId" TEXT NOT NULL,
  "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "effortScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "evidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "alignmentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "urgencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rationale" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OptionEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Deliberation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "situationId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "recommendedOptionId" TEXT,
  "rejectedOptionIds" JSONB NOT NULL,
  "finalJudgment" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dissentingView" TEXT NOT NULL,
  "whatWouldChangeDecision" TEXT NOT NULL,
  "status" "DeliberationStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Deliberation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionCommitment" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "situationId" TEXT NOT NULL,
  "deliberationId" TEXT NOT NULL,
  "optionId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "commitmentType" "DecisionCommitmentType" NOT NULL,
  "status" "DecisionCommitmentStatus" NOT NULL DEFAULT 'COMMITTED',
  "owner" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3),
  "linkedExecutionItemId" TEXT,
  "linkedPlanItemId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DecisionCommitment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionReview" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "situationId" TEXT NOT NULL,
  "deliberationId" TEXT,
  "commitmentId" TEXT,
  "summary" TEXT NOT NULL,
  "outcomeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "decisionQuality" "DecisionQuality" NOT NULL,
  "judgmentPattern" TEXT NOT NULL,
  "futureRule" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DecisionReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DecisionSituation_organizationId_idx" ON "DecisionSituation"("organizationId");
CREATE INDEX "DecisionSituation_workspaceId_idx" ON "DecisionSituation"("workspaceId");
CREATE INDEX "DecisionSituation_situationType_idx" ON "DecisionSituation"("situationType");
CREATE INDEX "DecisionSituation_status_idx" ON "DecisionSituation"("status");
CREATE INDEX "DecisionSituation_urgency_idx" ON "DecisionSituation"("urgency");
CREATE INDEX "DecisionSituation_sourceType_sourceId_idx" ON "DecisionSituation"("sourceType", "sourceId");
CREATE INDEX "DecisionSituation_missionId_idx" ON "DecisionSituation"("missionId");
CREATE INDEX "DecisionSituation_objectiveId_idx" ON "DecisionSituation"("objectiveId");

CREATE INDEX "DecisionOption_organizationId_idx" ON "DecisionOption"("organizationId");
CREATE INDEX "DecisionOption_workspaceId_idx" ON "DecisionOption"("workspaceId");
CREATE INDEX "DecisionOption_situationId_idx" ON "DecisionOption"("situationId");
CREATE INDEX "DecisionOption_optionType_idx" ON "DecisionOption"("optionType");
CREATE INDEX "DecisionOption_riskLevel_idx" ON "DecisionOption"("riskLevel");
CREATE INDEX "DecisionOption_confidenceScore_idx" ON "DecisionOption"("confidenceScore");

CREATE INDEX "OptionEvaluation_organizationId_idx" ON "OptionEvaluation"("organizationId");
CREATE INDEX "OptionEvaluation_workspaceId_idx" ON "OptionEvaluation"("workspaceId");
CREATE INDEX "OptionEvaluation_optionId_idx" ON "OptionEvaluation"("optionId");
CREATE INDEX "OptionEvaluation_situationId_idx" ON "OptionEvaluation"("situationId");
CREATE INDEX "OptionEvaluation_overallScore_idx" ON "OptionEvaluation"("overallScore");

CREATE INDEX "Deliberation_organizationId_idx" ON "Deliberation"("organizationId");
CREATE INDEX "Deliberation_workspaceId_idx" ON "Deliberation"("workspaceId");
CREATE INDEX "Deliberation_situationId_idx" ON "Deliberation"("situationId");
CREATE INDEX "Deliberation_recommendedOptionId_idx" ON "Deliberation"("recommendedOptionId");
CREATE INDEX "Deliberation_status_idx" ON "Deliberation"("status");
CREATE INDEX "Deliberation_confidenceScore_idx" ON "Deliberation"("confidenceScore");

CREATE INDEX "DecisionCommitment_organizationId_idx" ON "DecisionCommitment"("organizationId");
CREATE INDEX "DecisionCommitment_workspaceId_idx" ON "DecisionCommitment"("workspaceId");
CREATE INDEX "DecisionCommitment_situationId_idx" ON "DecisionCommitment"("situationId");
CREATE INDEX "DecisionCommitment_deliberationId_idx" ON "DecisionCommitment"("deliberationId");
CREATE INDEX "DecisionCommitment_optionId_idx" ON "DecisionCommitment"("optionId");
CREATE INDEX "DecisionCommitment_commitmentType_idx" ON "DecisionCommitment"("commitmentType");
CREATE INDEX "DecisionCommitment_status_idx" ON "DecisionCommitment"("status");
CREATE INDEX "DecisionCommitment_linkedExecutionItemId_idx" ON "DecisionCommitment"("linkedExecutionItemId");
CREATE INDEX "DecisionCommitment_linkedPlanItemId_idx" ON "DecisionCommitment"("linkedPlanItemId");

CREATE INDEX "DecisionReview_organizationId_idx" ON "DecisionReview"("organizationId");
CREATE INDEX "DecisionReview_workspaceId_idx" ON "DecisionReview"("workspaceId");
CREATE INDEX "DecisionReview_situationId_idx" ON "DecisionReview"("situationId");
CREATE INDEX "DecisionReview_deliberationId_idx" ON "DecisionReview"("deliberationId");
CREATE INDEX "DecisionReview_commitmentId_idx" ON "DecisionReview"("commitmentId");
CREATE INDEX "DecisionReview_decisionQuality_idx" ON "DecisionReview"("decisionQuality");
CREATE INDEX "DecisionReview_outcomeScore_idx" ON "DecisionReview"("outcomeScore");

ALTER TABLE "DecisionSituation" ADD CONSTRAINT "DecisionSituation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionSituation" ADD CONSTRAINT "DecisionSituation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionSituation" ADD CONSTRAINT "DecisionSituation_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionSituation" ADD CONSTRAINT "DecisionSituation_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DecisionOption" ADD CONSTRAINT "DecisionOption_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionOption" ADD CONSTRAINT "DecisionOption_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionOption" ADD CONSTRAINT "DecisionOption_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "DecisionSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OptionEvaluation" ADD CONSTRAINT "OptionEvaluation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OptionEvaluation" ADD CONSTRAINT "OptionEvaluation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OptionEvaluation" ADD CONSTRAINT "OptionEvaluation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "DecisionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OptionEvaluation" ADD CONSTRAINT "OptionEvaluation_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "DecisionSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Deliberation" ADD CONSTRAINT "Deliberation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Deliberation" ADD CONSTRAINT "Deliberation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Deliberation" ADD CONSTRAINT "Deliberation_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "DecisionSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "DecisionSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_deliberationId_fkey" FOREIGN KEY ("deliberationId") REFERENCES "Deliberation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "DecisionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_linkedExecutionItemId_fkey" FOREIGN KEY ("linkedExecutionItemId") REFERENCES "ExecutionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionCommitment" ADD CONSTRAINT "DecisionCommitment_linkedPlanItemId_fkey" FOREIGN KEY ("linkedPlanItemId") REFERENCES "PlanItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "DecisionSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_deliberationId_fkey" FOREIGN KEY ("deliberationId") REFERENCES "Deliberation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionReview" ADD CONSTRAINT "DecisionReview_commitmentId_fkey" FOREIGN KEY ("commitmentId") REFERENCES "DecisionCommitment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
