-- AlterEnum
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_CREATED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_CONNECTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_SYNC_STARTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_SYNC_COMPLETED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_SYNC_FAILED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'RAW_SIGNAL_RECEIVED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'SIGNAL_NORMALIZED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'SIGNAL_ROUTED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'SIGNAL_FAILED';
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'CONNECTOR_HEALTH_CHANGED';

-- CreateEnum
CREATE TYPE "ConnectorType" AS ENUM ('GOOGLE_SEARCH_CONSOLE', 'GOOGLE_ANALYTICS', 'GITHUB', 'PRODUCT_HUNT', 'REDDIT', 'LINKEDIN', 'X', 'YOUTUBE', 'NEWSLETTER', 'CMS', 'MANUAL_IMPORT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ConnectorStatus" AS ENUM ('DRAFT', 'CONNECTED', 'DISCONNECTED', 'ERROR', 'PAUSED', 'MOCK');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'API_KEY', 'OAUTH', 'WEBHOOK', 'MANUAL');

-- CreateEnum
CREATE TYPE "RawSignalStatus" AS ENUM ('RECEIVED', 'NORMALIZED', 'ROUTED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('SEARCH_QUERY', 'TRAFFIC_CHANGE', 'REFERRAL_TRAFFIC', 'SOCIAL_POST', 'SOCIAL_COMMENT', 'COMMUNITY_THREAD', 'COMMUNITY_REPLY', 'PRODUCT_HUNT_COMMENT', 'GITHUB_ISSUE', 'GITHUB_RELEASE', 'NEWSLETTER_METRIC', 'CMS_ARTICLE', 'DIRECTORY_STATUS', 'BACKLINK_FOUND', 'CUSTOM_SIGNAL');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('STARTED', 'COMPLETED', 'FAILED', 'PARTIAL', 'CANCELLED');

-- CreateTable
CREATE TABLE "Connector" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "connectorType" "ConnectorType" NOT NULL,
    "status" "ConnectorStatus" NOT NULL DEFAULT 'DRAFT',
    "provider" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authType" "AuthType" NOT NULL DEFAULT 'NONE',
    "config" JSONB NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "nextSyncAt" TIMESTAMP(3),
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawSignal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "externalId" TEXT,
    "rawPayload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "status" "RawSignalStatus" NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NormalizedSignal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "rawSignalId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "signalType" "SignalType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "author" TEXT,
    "platform" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NormalizedSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectorSyncRun" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "recordsFetched" INTEGER NOT NULL DEFAULT 0,
    "recordsNormalized" INTEGER NOT NULL DEFAULT 0,
    "recordsRouted" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "logs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorSyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Connector_organizationId_idx" ON "Connector"("organizationId");
CREATE INDEX "Connector_workspaceId_idx" ON "Connector"("workspaceId");
CREATE INDEX "Connector_connectorType_idx" ON "Connector"("connectorType");
CREATE INDEX "Connector_status_idx" ON "Connector"("status");
CREATE INDEX "Connector_provider_idx" ON "Connector"("provider");
CREATE INDEX "Connector_lastSyncAt_idx" ON "Connector"("lastSyncAt");
CREATE INDEX "Connector_healthScore_idx" ON "Connector"("healthScore");
CREATE INDEX "RawSignal_organizationId_idx" ON "RawSignal"("organizationId");
CREATE INDEX "RawSignal_workspaceId_idx" ON "RawSignal"("workspaceId");
CREATE INDEX "RawSignal_connectorId_idx" ON "RawSignal"("connectorId");
CREATE INDEX "RawSignal_sourceType_idx" ON "RawSignal"("sourceType");
CREATE INDEX "RawSignal_externalId_idx" ON "RawSignal"("externalId");
CREATE INDEX "RawSignal_status_idx" ON "RawSignal"("status");
CREATE INDEX "RawSignal_receivedAt_idx" ON "RawSignal"("receivedAt");
CREATE INDEX "NormalizedSignal_organizationId_idx" ON "NormalizedSignal"("organizationId");
CREATE INDEX "NormalizedSignal_workspaceId_idx" ON "NormalizedSignal"("workspaceId");
CREATE INDEX "NormalizedSignal_rawSignalId_idx" ON "NormalizedSignal"("rawSignalId");
CREATE INDEX "NormalizedSignal_connectorId_idx" ON "NormalizedSignal"("connectorId");
CREATE INDEX "NormalizedSignal_signalType_idx" ON "NormalizedSignal"("signalType");
CREATE INDEX "NormalizedSignal_priority_idx" ON "NormalizedSignal"("priority");
CREATE INDEX "NormalizedSignal_occurredAt_idx" ON "NormalizedSignal"("occurredAt");
CREATE INDEX "ConnectorSyncRun_organizationId_idx" ON "ConnectorSyncRun"("organizationId");
CREATE INDEX "ConnectorSyncRun_workspaceId_idx" ON "ConnectorSyncRun"("workspaceId");
CREATE INDEX "ConnectorSyncRun_connectorId_idx" ON "ConnectorSyncRun"("connectorId");
CREATE INDEX "ConnectorSyncRun_status_idx" ON "ConnectorSyncRun"("status");
CREATE INDEX "ConnectorSyncRun_startedAt_idx" ON "ConnectorSyncRun"("startedAt");

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RawSignal" ADD CONSTRAINT "RawSignal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RawSignal" ADD CONSTRAINT "RawSignal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RawSignal" ADD CONSTRAINT "RawSignal_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NormalizedSignal" ADD CONSTRAINT "NormalizedSignal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NormalizedSignal" ADD CONSTRAINT "NormalizedSignal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NormalizedSignal" ADD CONSTRAINT "NormalizedSignal_rawSignalId_fkey" FOREIGN KEY ("rawSignalId") REFERENCES "RawSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NormalizedSignal" ADD CONSTRAINT "NormalizedSignal_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConnectorSyncRun" ADD CONSTRAINT "ConnectorSyncRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConnectorSyncRun" ADD CONSTRAINT "ConnectorSyncRun_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConnectorSyncRun" ADD CONSTRAINT "ConnectorSyncRun_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
