-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'RESEARCHING', 'IN_PROGRESS', 'PUBLISHED', 'SUBMITTED', 'LIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('BLOG', 'FOUNDER_POST', 'COMPANY_POST', 'X_THREAD', 'PINTEREST_PIN', 'NEWSLETTER', 'YOUTUBE_SCRIPT', 'FAQ', 'LANDING_PAGE');

-- CreateEnum
CREATE TYPE "Intent" AS ENUM ('INFORMATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'NAVIGATIONAL', 'COMMUNITY_DISCUSSION');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('TOFU', 'MOFU', 'BOFU');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('ANSWERS', 'INSPIRES', 'SUPPORTS', 'CONTRADICTS', 'LINKS_TO', 'TARGETS', 'GENERATED_FROM', 'RELATED_TO', 'COMPETES_WITH', 'MENTIONS');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('BLOG_IDEA', 'FOUNDER_POST', 'COMPANY_POST', 'X_THREAD', 'PINTEREST_PIN', 'FAQ', 'LANDING_PAGE', 'FEATURE_REQUEST', 'DIRECTORY_SUBMISSION', 'BACKLINK_OUTREACH', 'INTERNAL_LINK', 'COMMUNITY_REPLY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('OBSERVATION_CREATED', 'QUESTION_CREATED', 'PAIN_POINT_CREATED', 'CONTENT_ASSET_CREATED', 'CONTENT_ASSET_PUBLISHED', 'DIRECTORY_SUBMITTED', 'BACKLINK_LIVE', 'AI_RECOMMENDATION_CREATED', 'EXPERIMENT_STARTED', 'EXPERIMENT_COMPLETED', 'COMPETITOR_MENTIONED', 'HIGH_OPPORTUNITY_DETECTED', 'MEMORY_CREATED', 'MEMORY_UPDATED', 'PATTERN_DETECTED', 'REASONING_TRACE_CREATED', 'OBJECTIVE_CREATED', 'KEY_RESULT_UPDATED', 'AGENT_RUN_STARTED', 'AGENT_RUN_COMPLETED', 'HIGH_IMPACT_ACTION_SELECTED', 'PLAN_CREATED', 'PLAN_ACTIVATED', 'PLAN_COMPLETED', 'PLAN_ITEM_COMPLETED', 'PLAN_ITEM_BLOCKED', 'MILESTONE_COMPLETED', 'CONSTRAINT_ADDED', 'OUTCOME_PREDICTED', 'CAPABILITY_REGISTERED');

-- CreateEnum
CREATE TYPE "EventSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'PROCESSED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('WRITE_BLOG', 'CREATE_FOUNDER_POST', 'CREATE_COMPANY_POST', 'CREATE_X_THREAD', 'CREATE_PINTEREST_PIN', 'ADD_INTERNAL_LINK', 'SUBMIT_DIRECTORY', 'REACH_OUT_FOR_BACKLINK', 'REPLY_TO_COMMUNITY', 'CREATE_EXPERIMENT', 'UPDATE_LANDING_PAGE', 'CREATE_FAQ', 'CREATE_DEMO', 'REVIEW_COMPETITOR', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "PatternType" AS ENUM ('RECURRING_QUESTION', 'COMPETITOR_COMPLAINT', 'CONTENT_GAP', 'PRODUCT_DEMAND', 'AUTHORITY_OPPORTUNITY', 'SEO_OPPORTUNITY', 'AEO_OPPORTUNITY', 'GEO_OPPORTUNITY');

-- CreateEnum
CREATE TYPE "TrendDirection" AS ENUM ('RISING', 'STABLE', 'DECLINING');

-- CreateEnum
CREATE TYPE "ObjectiveCategory" AS ENUM ('SEO', 'AEO', 'GEO', 'AUTHORITY', 'CONTENT', 'PRODUCT', 'REVENUE', 'COMMUNITY', 'BRAND');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('CONVERSATION_AGENT', 'CONTENT_AGENT', 'SEO_AGENT', 'AEO_AGENT', 'GEO_AGENT', 'AUTHORITY_AGENT', 'COMPETITOR_AGENT', 'PRODUCT_AGENT', 'EXPERIMENT_AGENT');

-- CreateEnum
CREATE TYPE "KnowledgeObjectType" AS ENUM ('ENTITY', 'QUESTION', 'PAIN_POINT', 'CONTENT_ASSET', 'KEYWORD', 'PERSONA', 'COMPETITOR', 'COMMUNITY', 'MEMORY', 'PATTERN', 'INSIGHT', 'RECOMMENDATION', 'FEATURE_REQUEST', 'CAMPAIGN', 'EXPERIMENT', 'OBJECTIVE', 'BACKLINK', 'DIRECTORY', 'PRODUCT_SIGNAL');

-- CreateEnum
CREATE TYPE "KnowledgeRelationshipType" AS ENUM ('ANSWERS', 'INSPIRES', 'SUPPORTS', 'CONTRADICTS', 'LINKS_TO', 'TARGETS', 'GENERATED_FROM', 'RELATED_TO', 'COMPETES_WITH', 'MENTIONS', 'BELONGS_TO', 'DEPENDS_ON', 'IMPROVES', 'RISKS', 'VALIDATES', 'INVALIDATES', 'DEFINES');

-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('CONVERSATION_TO_CONTENT', 'OBSERVATION_TO_INSIGHT', 'INSIGHT_TO_EXPERIMENT', 'QUESTION_TO_AEO_ASSET', 'PAIN_POINT_TO_FEATURE_REQUEST', 'PRODUCT_HUNT_TO_DEMO_CONTENT', 'DIRECTORY_TO_BACKLINK', 'COMPETITOR_COMPLAINT_TO_CONTENT', 'CONTENT_TO_INTERNAL_LINKS', 'MEMORY_TO_PATTERN');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('MANUAL', 'EVENT', 'SCHEDULED', 'AGENT');

-- CreateEnum
CREATE TYPE "WorkflowStepType" AS ENUM ('CLASSIFY', 'EXTRACT_ENTITIES', 'EXTRACT_PAIN_POINTS', 'CREATE_MEMORY', 'DETECT_PATTERN', 'CREATE_REASONING_TRACE', 'CREATE_RECOMMENDATION', 'CREATE_ACTION', 'CREATE_CONTENT_ASSET', 'CREATE_TASK', 'LINK_KNOWLEDGE_OBJECTS', 'NOTIFY_MISSION_CONTROL');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('SEO_PLAN', 'AEO_PLAN', 'GEO_PLAN', 'AUTHORITY_PLAN', 'CONTENT_PLAN', 'PRODUCT_PLAN', 'LAUNCH_PLAN', 'COMMUNITY_PLAN', 'REVENUE_PLAN', 'EXPERIMENT_PLAN');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlanItemType" AS ENUM ('BLOG', 'FOUNDER_POST', 'COMPANY_POST', 'X_THREAD', 'PINTEREST_PIN', 'DIRECTORY_SUBMISSION', 'BACKLINK_OUTREACH', 'COMMUNITY_REPLY', 'DEMO', 'FAQ', 'LANDING_PAGE_UPDATE', 'EXPERIMENT', 'PRODUCT_TASK', 'INTERNAL_LINK', 'NEWSLETTER', 'YOUTUBE_SCRIPT');

-- CreateEnum
CREATE TYPE "PlanItemStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlanDependencyType" AS ENUM ('BLOCKS', 'REQUIRES', 'SUPPORTS', 'SEQUENCED_BEFORE', 'SHOULD_FOLLOW');

-- CreateEnum
CREATE TYPE "PlanConstraintType" AS ENUM ('TIME', 'BUDGET', 'CONTENT_NOT_READY', 'DESIGN_NOT_READY', 'PRODUCT_NOT_READY', 'DATA_NOT_AVAILABLE', 'RESOURCE_LIMITED', 'APPROVAL_REQUIRED');

-- CreateEnum
CREATE TYPE "ConstraintSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "buyingIntent" TEXT NOT NULL,
    "primaryPainPoint" TEXT NOT NULL,
    "contentNeeds" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "communityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "intent" "Intent",
    "funnelStage" "FunnelStage",
    "searchVolumeEstimate" INTEGER,
    "businessValueScore" INTEGER NOT NULL DEFAULT 0,
    "painSeverityScore" INTEGER NOT NULL DEFAULT 0,
    "competitionScore" INTEGER NOT NULL DEFAULT 0,
    "trendScore" INTEGER NOT NULL DEFAULT 0,
    "authorityGapScore" INTEGER NOT NULL DEFAULT 0,
    "opportunityScore" INTEGER NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "conversationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainPoint" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "searchVolumeEstimate" INTEGER,
    "businessValueScore" INTEGER NOT NULL DEFAULT 0,
    "painSeverityScore" INTEGER NOT NULL DEFAULT 0,
    "competitionScore" INTEGER NOT NULL DEFAULT 0,
    "trendScore" INTEGER NOT NULL DEFAULT 0,
    "authorityGapScore" INTEGER NOT NULL DEFAULT 0,
    "opportunityScore" INTEGER NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "conversationId" TEXT,
    "competitorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PainPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAsset" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "intent" "Intent",
    "funnelStage" "FunnelStage",
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "intent" "Intent",
    "funnelStage" "FunnelStage",
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canonicalUrl" TEXT,
    "importanceScore" INTEGER NOT NULL DEFAULT 0,
    "entityOwner" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'LIVE',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectorySubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectorySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backlink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "targetUrl" TEXT,
    "status" "Status" NOT NULL DEFAULT 'SUBMITTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "directorySubmissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Backlink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "campaignId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "painPointId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "rawText" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strategicImplication" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "observationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hypothesis" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "relatedMetric" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "insightId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "successMetric" TEXT NOT NULL,
    "result" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "hypothesisId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricBefore" DOUBLE PRECISION,
    "metricAfter" DOUBLE PRECISION,
    "resultSummary" TEXT NOT NULL,
    "learnings" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "experimentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeNode" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeEdge" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "relationshipType" "RelationshipType" NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "notes" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "owner" TEXT NOT NULL,
    "recommendationType" "RecommendationType" NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "suggestedAction" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "generatedBy" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "conversationId" TEXT,
    "questionId" TEXT,
    "contentAssetId" TEXT,
    "painPointId" TEXT,
    "featureRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceObject" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detectedEntities" JSONB NOT NULL,
    "detectedKeywords" JSONB NOT NULL,
    "detectedIntent" "Intent" NOT NULL,
    "detectedPersona" TEXT NOT NULL,
    "detectedPainPoints" JSONB NOT NULL,
    "sentiment" TEXT NOT NULL,
    "opportunityScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntelligenceObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sourceTypes" JSONB NOT NULL,
    "linkedSourceIds" JSONB NOT NULL,
    "firstSeen" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "importanceScore" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patternType" "PatternType" NOT NULL,
    "relatedEntity" TEXT,
    "evidence" JSONB NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "trendDirection" "TrendDirection" NOT NULL DEFAULT 'STABLE',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "importanceScore" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReasoningTrace" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "inputSummary" TEXT NOT NULL,
    "reasoningSteps" JSONB NOT NULL,
    "conclusion" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendedActionIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReasoningTrace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ObjectiveCategory" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyResult" (
    "id" TEXT NOT NULL,
    "objectiveId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agentType" "AgentType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'LIVE',
    "mission" TEXT NOT NULL,
    "inputSources" JSONB NOT NULL,
    "outputTypes" JSONB NOT NULL,
    "parentAgentId" TEXT,
    "dependsOnAgentIds" JSONB,
    "handoffRules" JSONB,
    "allowedWorkflowIds" JSONB,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'COMPLETED',
    "inputSummary" TEXT NOT NULL,
    "outputSummary" TEXT NOT NULL,
    "recommendationsCreated" INTEGER NOT NULL DEFAULT 0,
    "actionsCreated" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "logs" JSONB NOT NULL,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeObject" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "canonicalId" TEXT NOT NULL,
    "objectType" "KnowledgeObjectType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "canonicalEntityId" TEXT,
    "aliases" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "searchableText" TEXT NOT NULL,
    "embeddingProvider" TEXT,
    "embeddingModel" TEXT,
    "embeddingVector" JSONB,
    "embeddingUpdatedAt" TIMESTAMP(3),
    "importanceScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'RESEARCHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeRelationship" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "fromObjectId" TEXT NOT NULL,
    "toObjectId" TEXT NOT NULL,
    "relationshipType" "KnowledgeRelationshipType" NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "evidence" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorySnapshot" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "importanceScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendDirection" "TrendDirection" NOT NULL DEFAULT 'STABLE',
    "notableSources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemorySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workflowType" "WorkflowType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'LIVE',
    "triggerType" "TriggerType" NOT NULL,
    "triggerConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "stepType" "WorkflowStepType" NOT NULL,
    "config" JSONB NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRun" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "triggerSourceType" TEXT NOT NULL,
    "triggerSourceId" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "logs" JSONB NOT NULL,

    CONSTRAINT "WorkflowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentHandoff" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "fromAgentId" TEXT NOT NULL,
    "toAgentId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AgentHandoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "objectiveId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "PlanItemStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT NOT NULL,
    "expectedImpact" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itemType" "PlanItemType" NOT NULL,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "PlanItemStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "owner" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "estimatedImpactScore" INTEGER NOT NULL DEFAULT 0,
    "estimatedEffortScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanDependency" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "fromItemId" TEXT NOT NULL,
    "toItemId" TEXT NOT NULL,
    "dependencyType" "PlanDependencyType" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanConstraint" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraintType" "PlanConstraintType" NOT NULL,
    "severity" "ConstraintSeverity" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanConstraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictedOutcome" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "predictedValue" DOUBLE PRECISION NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rationale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredictedOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceCapacity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "weeklyHours" INTEGER NOT NULL,
    "focusArea" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "severity" "EventSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedAction" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "expectedImpact" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "questionId" TEXT,
    "painPointId" TEXT,
    "observationId" TEXT,
    "contentAssetId" TEXT,
    "aiRecommendationId" TEXT,
    "experimentId" TEXT,
    "directorySubmissionId" TEXT,
    "backlinkId" TEXT,
    "competitorId" TEXT,
    "objectiveId" TEXT,
    "patternId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendedAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionContentAsset" (
    "questionId" TEXT NOT NULL,
    "contentAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionContentAsset_pkey" PRIMARY KEY ("questionId","contentAssetId")
);

-- CreateTable
CREATE TABLE "ContentAssetKeyword" (
    "contentAssetId" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAssetKeyword_pkey" PRIMARY KEY ("contentAssetId","keywordId")
);

-- CreateTable
CREATE TABLE "ContentAssetEntity" (
    "contentAssetId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAssetEntity_pkey" PRIMARY KEY ("contentAssetId","entityId")
);

-- CreateTable
CREATE TABLE "CampaignContentAsset" (
    "campaignId" TEXT NOT NULL,
    "contentAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignContentAsset_pkey" PRIMARY KEY ("campaignId","contentAssetId")
);

-- CreateTable
CREATE TABLE "_PersonaToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PersonaToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PainPointToPersona" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PainPointToPersona_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ContentAssetToPersona" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContentAssetToPersona_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CampaignToPersona" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignToPersona_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FeatureRequestToPersona" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FeatureRequestToPersona_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Workspace_organizationId_idx" ON "Workspace"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_organizationId_slug_key" ON "Workspace"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "Persona_organizationId_idx" ON "Persona"("organizationId");

-- CreateIndex
CREATE INDEX "Persona_workspaceId_idx" ON "Persona"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_workspaceId_name_key" ON "Persona"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Conversation_organizationId_idx" ON "Conversation"("organizationId");

-- CreateIndex
CREATE INDEX "Conversation_workspaceId_idx" ON "Conversation"("workspaceId");

-- CreateIndex
CREATE INDEX "Conversation_communityId_idx" ON "Conversation"("communityId");

-- CreateIndex
CREATE INDEX "Conversation_priority_idx" ON "Conversation"("priority");

-- CreateIndex
CREATE INDEX "Conversation_status_idx" ON "Conversation"("status");

-- CreateIndex
CREATE INDEX "Conversation_owner_idx" ON "Conversation"("owner");

-- CreateIndex
CREATE INDEX "Question_organizationId_idx" ON "Question"("organizationId");

-- CreateIndex
CREATE INDEX "Question_workspaceId_idx" ON "Question"("workspaceId");

-- CreateIndex
CREATE INDEX "Question_conversationId_idx" ON "Question"("conversationId");

-- CreateIndex
CREATE INDEX "Question_intent_idx" ON "Question"("intent");

-- CreateIndex
CREATE INDEX "Question_funnelStage_idx" ON "Question"("funnelStage");

-- CreateIndex
CREATE INDEX "Question_priority_idx" ON "Question"("priority");

-- CreateIndex
CREATE INDEX "Question_status_idx" ON "Question"("status");

-- CreateIndex
CREATE INDEX "Question_opportunityScore_idx" ON "Question"("opportunityScore");

-- CreateIndex
CREATE INDEX "PainPoint_organizationId_idx" ON "PainPoint"("organizationId");

-- CreateIndex
CREATE INDEX "PainPoint_workspaceId_idx" ON "PainPoint"("workspaceId");

-- CreateIndex
CREATE INDEX "PainPoint_conversationId_idx" ON "PainPoint"("conversationId");

-- CreateIndex
CREATE INDEX "PainPoint_competitorId_idx" ON "PainPoint"("competitorId");

-- CreateIndex
CREATE INDEX "PainPoint_priority_idx" ON "PainPoint"("priority");

-- CreateIndex
CREATE INDEX "PainPoint_status_idx" ON "PainPoint"("status");

-- CreateIndex
CREATE INDEX "PainPoint_opportunityScore_idx" ON "PainPoint"("opportunityScore");

-- CreateIndex
CREATE INDEX "ContentAsset_organizationId_idx" ON "ContentAsset"("organizationId");

-- CreateIndex
CREATE INDEX "ContentAsset_workspaceId_idx" ON "ContentAsset"("workspaceId");

-- CreateIndex
CREATE INDEX "ContentAsset_contentType_idx" ON "ContentAsset"("contentType");

-- CreateIndex
CREATE INDEX "ContentAsset_funnelStage_idx" ON "ContentAsset"("funnelStage");

-- CreateIndex
CREATE INDEX "ContentAsset_intent_idx" ON "ContentAsset"("intent");

-- CreateIndex
CREATE INDEX "ContentAsset_priority_idx" ON "ContentAsset"("priority");

-- CreateIndex
CREATE INDEX "ContentAsset_status_idx" ON "ContentAsset"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAsset_workspaceId_code_key" ON "ContentAsset"("workspaceId", "code");

-- CreateIndex
CREATE INDEX "Keyword_organizationId_idx" ON "Keyword"("organizationId");

-- CreateIndex
CREATE INDEX "Keyword_workspaceId_idx" ON "Keyword"("workspaceId");

-- CreateIndex
CREATE INDEX "Keyword_intent_idx" ON "Keyword"("intent");

-- CreateIndex
CREATE INDEX "Keyword_funnelStage_idx" ON "Keyword"("funnelStage");

-- CreateIndex
CREATE INDEX "Keyword_priority_idx" ON "Keyword"("priority");

-- CreateIndex
CREATE INDEX "Keyword_status_idx" ON "Keyword"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_workspaceId_name_key" ON "Keyword"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Entity_organizationId_idx" ON "Entity"("organizationId");

-- CreateIndex
CREATE INDEX "Entity_workspaceId_idx" ON "Entity"("workspaceId");

-- CreateIndex
CREATE INDEX "Entity_type_idx" ON "Entity"("type");

-- CreateIndex
CREATE INDEX "Entity_priority_idx" ON "Entity"("priority");

-- CreateIndex
CREATE INDEX "Entity_status_idx" ON "Entity"("status");

-- CreateIndex
CREATE INDEX "Entity_importanceScore_idx" ON "Entity"("importanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_workspaceId_name_key" ON "Entity"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Community_organizationId_idx" ON "Community"("organizationId");

-- CreateIndex
CREATE INDEX "Community_workspaceId_idx" ON "Community"("workspaceId");

-- CreateIndex
CREATE INDEX "Community_priority_idx" ON "Community"("priority");

-- CreateIndex
CREATE INDEX "Community_status_idx" ON "Community"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Community_workspaceId_name_key" ON "Community"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Competitor_organizationId_idx" ON "Competitor"("organizationId");

-- CreateIndex
CREATE INDEX "Competitor_workspaceId_idx" ON "Competitor"("workspaceId");

-- CreateIndex
CREATE INDEX "Competitor_priority_idx" ON "Competitor"("priority");

-- CreateIndex
CREATE INDEX "Competitor_status_idx" ON "Competitor"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Competitor_workspaceId_name_key" ON "Competitor"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "DirectorySubmission_organizationId_idx" ON "DirectorySubmission"("organizationId");

-- CreateIndex
CREATE INDEX "DirectorySubmission_workspaceId_idx" ON "DirectorySubmission"("workspaceId");

-- CreateIndex
CREATE INDEX "DirectorySubmission_priority_idx" ON "DirectorySubmission"("priority");

-- CreateIndex
CREATE INDEX "DirectorySubmission_status_idx" ON "DirectorySubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DirectorySubmission_workspaceId_name_key" ON "DirectorySubmission"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Backlink_organizationId_idx" ON "Backlink"("organizationId");

-- CreateIndex
CREATE INDEX "Backlink_workspaceId_idx" ON "Backlink"("workspaceId");

-- CreateIndex
CREATE INDEX "Backlink_directorySubmissionId_idx" ON "Backlink"("directorySubmissionId");

-- CreateIndex
CREATE INDEX "Backlink_priority_idx" ON "Backlink"("priority");

-- CreateIndex
CREATE INDEX "Backlink_status_idx" ON "Backlink"("status");

-- CreateIndex
CREATE INDEX "Campaign_organizationId_idx" ON "Campaign"("organizationId");

-- CreateIndex
CREATE INDEX "Campaign_workspaceId_idx" ON "Campaign"("workspaceId");

-- CreateIndex
CREATE INDEX "Campaign_priority_idx" ON "Campaign"("priority");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_workspaceId_name_key" ON "Campaign"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_idx" ON "Task"("workspaceId");

-- CreateIndex
CREATE INDEX "Task_campaignId_idx" ON "Task"("campaignId");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "FeatureRequest_organizationId_idx" ON "FeatureRequest"("organizationId");

-- CreateIndex
CREATE INDEX "FeatureRequest_workspaceId_idx" ON "FeatureRequest"("workspaceId");

-- CreateIndex
CREATE INDEX "FeatureRequest_painPointId_idx" ON "FeatureRequest"("painPointId");

-- CreateIndex
CREATE INDEX "FeatureRequest_priority_idx" ON "FeatureRequest"("priority");

-- CreateIndex
CREATE INDEX "FeatureRequest_status_idx" ON "FeatureRequest"("status");

-- CreateIndex
CREATE INDEX "Observation_organizationId_idx" ON "Observation"("organizationId");

-- CreateIndex
CREATE INDEX "Observation_workspaceId_idx" ON "Observation"("workspaceId");

-- CreateIndex
CREATE INDEX "Observation_platform_idx" ON "Observation"("platform");

-- CreateIndex
CREATE INDEX "Observation_confidenceScore_idx" ON "Observation"("confidenceScore");

-- CreateIndex
CREATE INDEX "Insight_organizationId_idx" ON "Insight"("organizationId");

-- CreateIndex
CREATE INDEX "Insight_workspaceId_idx" ON "Insight"("workspaceId");

-- CreateIndex
CREATE INDEX "Insight_observationId_idx" ON "Insight"("observationId");

-- CreateIndex
CREATE INDEX "Insight_confidenceScore_idx" ON "Insight"("confidenceScore");

-- CreateIndex
CREATE INDEX "Hypothesis_organizationId_idx" ON "Hypothesis"("organizationId");

-- CreateIndex
CREATE INDEX "Hypothesis_workspaceId_idx" ON "Hypothesis"("workspaceId");

-- CreateIndex
CREATE INDEX "Hypothesis_insightId_idx" ON "Hypothesis"("insightId");

-- CreateIndex
CREATE INDEX "Hypothesis_status_idx" ON "Hypothesis"("status");

-- CreateIndex
CREATE INDEX "Hypothesis_confidenceScore_idx" ON "Hypothesis"("confidenceScore");

-- CreateIndex
CREATE INDEX "Experiment_organizationId_idx" ON "Experiment"("organizationId");

-- CreateIndex
CREATE INDEX "Experiment_workspaceId_idx" ON "Experiment"("workspaceId");

-- CreateIndex
CREATE INDEX "Experiment_hypothesisId_idx" ON "Experiment"("hypothesisId");

-- CreateIndex
CREATE INDEX "Experiment_status_idx" ON "Experiment"("status");

-- CreateIndex
CREATE INDEX "Outcome_organizationId_idx" ON "Outcome"("organizationId");

-- CreateIndex
CREATE INDEX "Outcome_workspaceId_idx" ON "Outcome"("workspaceId");

-- CreateIndex
CREATE INDEX "Outcome_experimentId_idx" ON "Outcome"("experimentId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_organizationId_idx" ON "KnowledgeNode"("organizationId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_workspaceId_idx" ON "KnowledgeNode"("workspaceId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_type_idx" ON "KnowledgeNode"("type");

-- CreateIndex
CREATE INDEX "KnowledgeNode_sourceType_sourceId_idx" ON "KnowledgeNode"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_organizationId_idx" ON "KnowledgeEdge"("organizationId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_workspaceId_idx" ON "KnowledgeEdge"("workspaceId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_fromNodeId_idx" ON "KnowledgeEdge"("fromNodeId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_toNodeId_idx" ON "KnowledgeEdge"("toNodeId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_relationshipType_idx" ON "KnowledgeEdge"("relationshipType");

-- CreateIndex
CREATE INDEX "AIRecommendation_organizationId_idx" ON "AIRecommendation"("organizationId");

-- CreateIndex
CREATE INDEX "AIRecommendation_workspaceId_idx" ON "AIRecommendation"("workspaceId");

-- CreateIndex
CREATE INDEX "AIRecommendation_targetEntityType_targetEntityId_idx" ON "AIRecommendation"("targetEntityType", "targetEntityId");

-- CreateIndex
CREATE INDEX "AIRecommendation_recommendationType_idx" ON "AIRecommendation"("recommendationType");

-- CreateIndex
CREATE INDEX "AIRecommendation_conversationId_idx" ON "AIRecommendation"("conversationId");

-- CreateIndex
CREATE INDEX "AIRecommendation_questionId_idx" ON "AIRecommendation"("questionId");

-- CreateIndex
CREATE INDEX "AIRecommendation_contentAssetId_idx" ON "AIRecommendation"("contentAssetId");

-- CreateIndex
CREATE INDEX "AIRecommendation_painPointId_idx" ON "AIRecommendation"("painPointId");

-- CreateIndex
CREATE INDEX "AIRecommendation_featureRequestId_idx" ON "AIRecommendation"("featureRequestId");

-- CreateIndex
CREATE INDEX "AIRecommendation_priority_idx" ON "AIRecommendation"("priority");

-- CreateIndex
CREATE INDEX "AIRecommendation_status_idx" ON "AIRecommendation"("status");

-- CreateIndex
CREATE INDEX "IntelligenceObject_organizationId_idx" ON "IntelligenceObject"("organizationId");

-- CreateIndex
CREATE INDEX "IntelligenceObject_workspaceId_idx" ON "IntelligenceObject"("workspaceId");

-- CreateIndex
CREATE INDEX "IntelligenceObject_sourceType_sourceId_idx" ON "IntelligenceObject"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "IntelligenceObject_detectedIntent_idx" ON "IntelligenceObject"("detectedIntent");

-- CreateIndex
CREATE INDEX "IntelligenceObject_opportunityScore_idx" ON "IntelligenceObject"("opportunityScore");

-- CreateIndex
CREATE INDEX "Memory_organizationId_idx" ON "Memory"("organizationId");

-- CreateIndex
CREATE INDEX "Memory_workspaceId_idx" ON "Memory"("workspaceId");

-- CreateIndex
CREATE INDEX "Memory_topic_idx" ON "Memory"("topic");

-- CreateIndex
CREATE INDEX "Memory_entity_idx" ON "Memory"("entity");

-- CreateIndex
CREATE INDEX "Memory_importanceScore_idx" ON "Memory"("importanceScore");

-- CreateIndex
CREATE INDEX "Memory_status_idx" ON "Memory"("status");

-- CreateIndex
CREATE INDEX "Pattern_organizationId_idx" ON "Pattern"("organizationId");

-- CreateIndex
CREATE INDEX "Pattern_workspaceId_idx" ON "Pattern"("workspaceId");

-- CreateIndex
CREATE INDEX "Pattern_patternType_idx" ON "Pattern"("patternType");

-- CreateIndex
CREATE INDEX "Pattern_relatedEntity_idx" ON "Pattern"("relatedEntity");

-- CreateIndex
CREATE INDEX "Pattern_trendDirection_idx" ON "Pattern"("trendDirection");

-- CreateIndex
CREATE INDEX "Pattern_importanceScore_idx" ON "Pattern"("importanceScore");

-- CreateIndex
CREATE INDEX "Pattern_status_idx" ON "Pattern"("status");

-- CreateIndex
CREATE INDEX "ReasoningTrace_organizationId_idx" ON "ReasoningTrace"("organizationId");

-- CreateIndex
CREATE INDEX "ReasoningTrace_workspaceId_idx" ON "ReasoningTrace"("workspaceId");

-- CreateIndex
CREATE INDEX "ReasoningTrace_sourceType_sourceId_idx" ON "ReasoningTrace"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "ReasoningTrace_confidenceScore_idx" ON "ReasoningTrace"("confidenceScore");

-- CreateIndex
CREATE INDEX "Objective_organizationId_idx" ON "Objective"("organizationId");

-- CreateIndex
CREATE INDEX "Objective_workspaceId_idx" ON "Objective"("workspaceId");

-- CreateIndex
CREATE INDEX "Objective_category_idx" ON "Objective"("category");

-- CreateIndex
CREATE INDEX "Objective_priority_idx" ON "Objective"("priority");

-- CreateIndex
CREATE INDEX "Objective_status_idx" ON "Objective"("status");

-- CreateIndex
CREATE INDEX "KeyResult_objectiveId_idx" ON "KeyResult"("objectiveId");

-- CreateIndex
CREATE INDEX "KeyResult_status_idx" ON "KeyResult"("status");

-- CreateIndex
CREATE INDEX "Agent_organizationId_idx" ON "Agent"("organizationId");

-- CreateIndex
CREATE INDEX "Agent_workspaceId_idx" ON "Agent"("workspaceId");

-- CreateIndex
CREATE INDEX "Agent_agentType_idx" ON "Agent"("agentType");

-- CreateIndex
CREATE INDEX "Agent_status_idx" ON "Agent"("status");

-- CreateIndex
CREATE INDEX "Agent_parentAgentId_idx" ON "Agent"("parentAgentId");

-- CreateIndex
CREATE INDEX "AgentRun_agentId_idx" ON "AgentRun"("agentId");

-- CreateIndex
CREATE INDEX "AgentRun_organizationId_idx" ON "AgentRun"("organizationId");

-- CreateIndex
CREATE INDEX "AgentRun_workspaceId_idx" ON "AgentRun"("workspaceId");

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");

-- CreateIndex
CREATE INDEX "AgentRun_startedAt_idx" ON "AgentRun"("startedAt");

-- CreateIndex
CREATE INDEX "KnowledgeObject_organizationId_idx" ON "KnowledgeObject"("organizationId");

-- CreateIndex
CREATE INDEX "KnowledgeObject_workspaceId_idx" ON "KnowledgeObject"("workspaceId");

-- CreateIndex
CREATE INDEX "KnowledgeObject_objectType_idx" ON "KnowledgeObject"("objectType");

-- CreateIndex
CREATE INDEX "KnowledgeObject_sourceType_sourceId_idx" ON "KnowledgeObject"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "KnowledgeObject_canonicalEntityId_idx" ON "KnowledgeObject"("canonicalEntityId");

-- CreateIndex
CREATE INDEX "KnowledgeObject_importanceScore_idx" ON "KnowledgeObject"("importanceScore");

-- CreateIndex
CREATE INDEX "KnowledgeObject_status_idx" ON "KnowledgeObject"("status");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeObject_workspaceId_canonicalId_key" ON "KnowledgeObject"("workspaceId", "canonicalId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_organizationId_idx" ON "KnowledgeRelationship"("organizationId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_workspaceId_idx" ON "KnowledgeRelationship"("workspaceId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_fromObjectId_idx" ON "KnowledgeRelationship"("fromObjectId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_toObjectId_idx" ON "KnowledgeRelationship"("toObjectId");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_relationshipType_idx" ON "KnowledgeRelationship"("relationshipType");

-- CreateIndex
CREATE INDEX "KnowledgeRelationship_strength_idx" ON "KnowledgeRelationship"("strength");

-- CreateIndex
CREATE INDEX "MemorySnapshot_organizationId_idx" ON "MemorySnapshot"("organizationId");

-- CreateIndex
CREATE INDEX "MemorySnapshot_workspaceId_idx" ON "MemorySnapshot"("workspaceId");

-- CreateIndex
CREATE INDEX "MemorySnapshot_memoryId_idx" ON "MemorySnapshot"("memoryId");

-- CreateIndex
CREATE INDEX "MemorySnapshot_period_idx" ON "MemorySnapshot"("period");

-- CreateIndex
CREATE INDEX "MemorySnapshot_trendDirection_idx" ON "MemorySnapshot"("trendDirection");

-- CreateIndex
CREATE INDEX "Workflow_organizationId_idx" ON "Workflow"("organizationId");

-- CreateIndex
CREATE INDEX "Workflow_workspaceId_idx" ON "Workflow"("workspaceId");

-- CreateIndex
CREATE INDEX "Workflow_workflowType_idx" ON "Workflow"("workflowType");

-- CreateIndex
CREATE INDEX "Workflow_status_idx" ON "Workflow"("status");

-- CreateIndex
CREATE INDEX "Workflow_triggerType_idx" ON "Workflow"("triggerType");

-- CreateIndex
CREATE INDEX "WorkflowStep_workflowId_idx" ON "WorkflowStep"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowStep_order_idx" ON "WorkflowStep"("order");

-- CreateIndex
CREATE INDEX "WorkflowStep_stepType_idx" ON "WorkflowStep"("stepType");

-- CreateIndex
CREATE INDEX "WorkflowStep_status_idx" ON "WorkflowStep"("status");

-- CreateIndex
CREATE INDEX "WorkflowRun_organizationId_idx" ON "WorkflowRun"("organizationId");

-- CreateIndex
CREATE INDEX "WorkflowRun_workspaceId_idx" ON "WorkflowRun"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkflowRun_workflowId_idx" ON "WorkflowRun"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowRun_status_idx" ON "WorkflowRun"("status");

-- CreateIndex
CREATE INDEX "WorkflowRun_triggerSourceType_triggerSourceId_idx" ON "WorkflowRun"("triggerSourceType", "triggerSourceId");

-- CreateIndex
CREATE INDEX "WorkflowRun_startedAt_idx" ON "WorkflowRun"("startedAt");

-- CreateIndex
CREATE INDEX "AgentHandoff_organizationId_idx" ON "AgentHandoff"("organizationId");

-- CreateIndex
CREATE INDEX "AgentHandoff_workspaceId_idx" ON "AgentHandoff"("workspaceId");

-- CreateIndex
CREATE INDEX "AgentHandoff_fromAgentId_idx" ON "AgentHandoff"("fromAgentId");

-- CreateIndex
CREATE INDEX "AgentHandoff_toAgentId_idx" ON "AgentHandoff"("toAgentId");

-- CreateIndex
CREATE INDEX "AgentHandoff_sourceType_sourceId_idx" ON "AgentHandoff"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "AgentHandoff_status_idx" ON "AgentHandoff"("status");

-- CreateIndex
CREATE INDEX "Plan_organizationId_idx" ON "Plan"("organizationId");

-- CreateIndex
CREATE INDEX "Plan_workspaceId_idx" ON "Plan"("workspaceId");

-- CreateIndex
CREATE INDEX "Plan_planType_idx" ON "Plan"("planType");

-- CreateIndex
CREATE INDEX "Plan_status_idx" ON "Plan"("status");

-- CreateIndex
CREATE INDEX "Plan_objectiveId_idx" ON "Plan"("objectiveId");

-- CreateIndex
CREATE INDEX "Plan_startDate_idx" ON "Plan"("startDate");

-- CreateIndex
CREATE INDEX "Plan_endDate_idx" ON "Plan"("endDate");

-- CreateIndex
CREATE INDEX "Milestone_organizationId_idx" ON "Milestone"("organizationId");

-- CreateIndex
CREATE INDEX "Milestone_workspaceId_idx" ON "Milestone"("workspaceId");

-- CreateIndex
CREATE INDEX "Milestone_planId_idx" ON "Milestone"("planId");

-- CreateIndex
CREATE INDEX "Milestone_dueDate_idx" ON "Milestone"("dueDate");

-- CreateIndex
CREATE INDEX "Milestone_status_idx" ON "Milestone"("status");

-- CreateIndex
CREATE INDEX "Milestone_priority_idx" ON "Milestone"("priority");

-- CreateIndex
CREATE INDEX "Milestone_order_idx" ON "Milestone"("order");

-- CreateIndex
CREATE INDEX "PlanItem_organizationId_idx" ON "PlanItem"("organizationId");

-- CreateIndex
CREATE INDEX "PlanItem_workspaceId_idx" ON "PlanItem"("workspaceId");

-- CreateIndex
CREATE INDEX "PlanItem_planId_idx" ON "PlanItem"("planId");

-- CreateIndex
CREATE INDEX "PlanItem_milestoneId_idx" ON "PlanItem"("milestoneId");

-- CreateIndex
CREATE INDEX "PlanItem_itemType_idx" ON "PlanItem"("itemType");

-- CreateIndex
CREATE INDEX "PlanItem_sourceType_sourceId_idx" ON "PlanItem"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "PlanItem_priority_idx" ON "PlanItem"("priority");

-- CreateIndex
CREATE INDEX "PlanItem_status_idx" ON "PlanItem"("status");

-- CreateIndex
CREATE INDEX "PlanItem_dueDate_idx" ON "PlanItem"("dueDate");

-- CreateIndex
CREATE INDEX "PlanDependency_organizationId_idx" ON "PlanDependency"("organizationId");

-- CreateIndex
CREATE INDEX "PlanDependency_workspaceId_idx" ON "PlanDependency"("workspaceId");

-- CreateIndex
CREATE INDEX "PlanDependency_planId_idx" ON "PlanDependency"("planId");

-- CreateIndex
CREATE INDEX "PlanDependency_fromItemId_idx" ON "PlanDependency"("fromItemId");

-- CreateIndex
CREATE INDEX "PlanDependency_toItemId_idx" ON "PlanDependency"("toItemId");

-- CreateIndex
CREATE INDEX "PlanDependency_dependencyType_idx" ON "PlanDependency"("dependencyType");

-- CreateIndex
CREATE INDEX "PlanConstraint_organizationId_idx" ON "PlanConstraint"("organizationId");

-- CreateIndex
CREATE INDEX "PlanConstraint_workspaceId_idx" ON "PlanConstraint"("workspaceId");

-- CreateIndex
CREATE INDEX "PlanConstraint_planId_idx" ON "PlanConstraint"("planId");

-- CreateIndex
CREATE INDEX "PlanConstraint_constraintType_idx" ON "PlanConstraint"("constraintType");

-- CreateIndex
CREATE INDEX "PlanConstraint_severity_idx" ON "PlanConstraint"("severity");

-- CreateIndex
CREATE INDEX "PredictedOutcome_organizationId_idx" ON "PredictedOutcome"("organizationId");

-- CreateIndex
CREATE INDEX "PredictedOutcome_workspaceId_idx" ON "PredictedOutcome"("workspaceId");

-- CreateIndex
CREATE INDEX "PredictedOutcome_planId_idx" ON "PredictedOutcome"("planId");

-- CreateIndex
CREATE INDEX "PredictedOutcome_metricName_idx" ON "PredictedOutcome"("metricName");

-- CreateIndex
CREATE INDEX "PredictedOutcome_confidenceScore_idx" ON "PredictedOutcome"("confidenceScore");

-- CreateIndex
CREATE INDEX "ResourceCapacity_organizationId_idx" ON "ResourceCapacity"("organizationId");

-- CreateIndex
CREATE INDEX "ResourceCapacity_workspaceId_idx" ON "ResourceCapacity"("workspaceId");

-- CreateIndex
CREATE INDEX "ResourceCapacity_owner_idx" ON "ResourceCapacity"("owner");

-- CreateIndex
CREATE INDEX "ResourceCapacity_role_idx" ON "ResourceCapacity"("role");

-- CreateIndex
CREATE INDEX "ResourceCapacity_focusArea_idx" ON "ResourceCapacity"("focusArea");

-- CreateIndex
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");

-- CreateIndex
CREATE INDEX "Event_workspaceId_idx" ON "Event"("workspaceId");

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- CreateIndex
CREATE INDEX "Event_sourceType_sourceId_idx" ON "Event"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "Event_severity_idx" ON "Event"("severity");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "RecommendedAction_organizationId_idx" ON "RecommendedAction"("organizationId");

-- CreateIndex
CREATE INDEX "RecommendedAction_workspaceId_idx" ON "RecommendedAction"("workspaceId");

-- CreateIndex
CREATE INDEX "RecommendedAction_sourceType_sourceId_idx" ON "RecommendedAction"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "RecommendedAction_actionType_idx" ON "RecommendedAction"("actionType");

-- CreateIndex
CREATE INDEX "RecommendedAction_priority_idx" ON "RecommendedAction"("priority");

-- CreateIndex
CREATE INDEX "RecommendedAction_status_idx" ON "RecommendedAction"("status");

-- CreateIndex
CREATE INDEX "RecommendedAction_dueDate_idx" ON "RecommendedAction"("dueDate");

-- CreateIndex
CREATE INDEX "RecommendedAction_objectiveId_idx" ON "RecommendedAction"("objectiveId");

-- CreateIndex
CREATE INDEX "RecommendedAction_patternId_idx" ON "RecommendedAction"("patternId");

-- CreateIndex
CREATE INDEX "_PersonaToQuestion_B_index" ON "_PersonaToQuestion"("B");

-- CreateIndex
CREATE INDEX "_PainPointToPersona_B_index" ON "_PainPointToPersona"("B");

-- CreateIndex
CREATE INDEX "_ContentAssetToPersona_B_index" ON "_ContentAssetToPersona"("B");

-- CreateIndex
CREATE INDEX "_CampaignToPersona_B_index" ON "_CampaignToPersona"("B");

-- CreateIndex
CREATE INDEX "_FeatureRequestToPersona_B_index" ON "_FeatureRequestToPersona"("B");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainPoint" ADD CONSTRAINT "PainPoint_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainPoint" ADD CONSTRAINT "PainPoint_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainPoint" ADD CONSTRAINT "PainPoint_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainPoint" ADD CONSTRAINT "PainPoint_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAsset" ADD CONSTRAINT "ContentAsset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAsset" ADD CONSTRAINT "ContentAsset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectorySubmission" ADD CONSTRAINT "DirectorySubmission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectorySubmission" ADD CONSTRAINT "DirectorySubmission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backlink" ADD CONSTRAINT "Backlink_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backlink" ADD CONSTRAINT "Backlink_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backlink" ADD CONSTRAINT "Backlink_directorySubmissionId_fkey" FOREIGN KEY ("directorySubmissionId") REFERENCES "DirectorySubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "PainPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "PainPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntelligenceObject" ADD CONSTRAINT "IntelligenceObject_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntelligenceObject" ADD CONSTRAINT "IntelligenceObject_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReasoningTrace" ADD CONSTRAINT "ReasoningTrace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReasoningTrace" ADD CONSTRAINT "ReasoningTrace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_parentAgentId_fkey" FOREIGN KEY ("parentAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeObject" ADD CONSTRAINT "KnowledgeObject_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeObject" ADD CONSTRAINT "KnowledgeObject_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_fromObjectId_fkey" FOREIGN KEY ("fromObjectId") REFERENCES "KnowledgeObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeRelationship" ADD CONSTRAINT "KnowledgeRelationship_toObjectId_fkey" FOREIGN KEY ("toObjectId") REFERENCES "KnowledgeObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorySnapshot" ADD CONSTRAINT "MemorySnapshot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorySnapshot" ADD CONSTRAINT "MemorySnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorySnapshot" ADD CONSTRAINT "MemorySnapshot_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentHandoff" ADD CONSTRAINT "AgentHandoff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentHandoff" ADD CONSTRAINT "AgentHandoff_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentHandoff" ADD CONSTRAINT "AgentHandoff_fromAgentId_fkey" FOREIGN KEY ("fromAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentHandoff" ADD CONSTRAINT "AgentHandoff_toAgentId_fkey" FOREIGN KEY ("toAgentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDependency" ADD CONSTRAINT "PlanDependency_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDependency" ADD CONSTRAINT "PlanDependency_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDependency" ADD CONSTRAINT "PlanDependency_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDependency" ADD CONSTRAINT "PlanDependency_fromItemId_fkey" FOREIGN KEY ("fromItemId") REFERENCES "PlanItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDependency" ADD CONSTRAINT "PlanDependency_toItemId_fkey" FOREIGN KEY ("toItemId") REFERENCES "PlanItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanConstraint" ADD CONSTRAINT "PlanConstraint_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanConstraint" ADD CONSTRAINT "PlanConstraint_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanConstraint" ADD CONSTRAINT "PlanConstraint_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictedOutcome" ADD CONSTRAINT "PredictedOutcome_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictedOutcome" ADD CONSTRAINT "PredictedOutcome_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictedOutcome" ADD CONSTRAINT "PredictedOutcome_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceCapacity" ADD CONSTRAINT "ResourceCapacity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceCapacity" ADD CONSTRAINT "ResourceCapacity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_painPointId_fkey" FOREIGN KEY ("painPointId") REFERENCES "PainPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_aiRecommendationId_fkey" FOREIGN KEY ("aiRecommendationId") REFERENCES "AIRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_directorySubmissionId_fkey" FOREIGN KEY ("directorySubmissionId") REFERENCES "DirectorySubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_backlinkId_fkey" FOREIGN KEY ("backlinkId") REFERENCES "Backlink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAction" ADD CONSTRAINT "RecommendedAction_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionContentAsset" ADD CONSTRAINT "QuestionContentAsset_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionContentAsset" ADD CONSTRAINT "QuestionContentAsset_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAssetKeyword" ADD CONSTRAINT "ContentAssetKeyword_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAssetKeyword" ADD CONSTRAINT "ContentAssetKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAssetEntity" ADD CONSTRAINT "ContentAssetEntity_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAssetEntity" ADD CONSTRAINT "ContentAssetEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContentAsset" ADD CONSTRAINT "CampaignContentAsset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContentAsset" ADD CONSTRAINT "CampaignContentAsset_contentAssetId_fkey" FOREIGN KEY ("contentAssetId") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonaToQuestion" ADD CONSTRAINT "_PersonaToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonaToQuestion" ADD CONSTRAINT "_PersonaToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PainPointToPersona" ADD CONSTRAINT "_PainPointToPersona_A_fkey" FOREIGN KEY ("A") REFERENCES "PainPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PainPointToPersona" ADD CONSTRAINT "_PainPointToPersona_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentAssetToPersona" ADD CONSTRAINT "_ContentAssetToPersona_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentAssetToPersona" ADD CONSTRAINT "_ContentAssetToPersona_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToPersona" ADD CONSTRAINT "_CampaignToPersona_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToPersona" ADD CONSTRAINT "_CampaignToPersona_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureRequestToPersona" ADD CONSTRAINT "_FeatureRequestToPersona_A_fkey" FOREIGN KEY ("A") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureRequestToPersona" ADD CONSTRAINT "_FeatureRequestToPersona_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
