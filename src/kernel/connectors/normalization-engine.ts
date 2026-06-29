import { createScopedId, orgId, type Connector, type NormalizedSignal, type RawSignal, type SignalType } from "@/lib/vgos-data";
import type { ConnectorContext, RawConnectorPayload } from "@/kernel/connectors/connector-types";

const typeByConnector: Record<string, SignalType> = {
  GOOGLE_SEARCH_CONSOLE: "SEARCH_QUERY",
  GOOGLE_ANALYTICS: "TRAFFIC_CHANGE",
  GITHUB: "GITHUB_RELEASE",
  PRODUCT_HUNT: "PRODUCT_HUNT_COMMENT",
  REDDIT: "COMMUNITY_THREAD",
  LINKEDIN: "SOCIAL_COMMENT",
  X: "SOCIAL_COMMENT",
  YOUTUBE: "SOCIAL_COMMENT",
  NEWSLETTER: "NEWSLETTER_METRIC",
  CMS: "CMS_ARTICLE",
  MANUAL_IMPORT: "CUSTOM_SIGNAL",
  CUSTOM: "CUSTOM_SIGNAL"
};

export function inferSignalType(connector: Connector, payload: RawConnectorPayload | RawSignal): SignalType {
  const sourceType = "sourceType" in payload ? payload.sourceType : undefined;
  if (sourceType && isSignalType(sourceType)) return sourceType;
  return typeByConnector[connector.connectorType] ?? "CUSTOM_SIGNAL";
}

export function createRawSignal(
  connector: Connector,
  payload: RawConnectorPayload,
  context: ConnectorContext
): RawSignal {
  const now = context.now ?? new Date().toISOString();
  const signalType = inferSignalType(connector, payload);
  return {
    id: createScopedId("raw-signal"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    connectorId: connector.id,
    source: connector.name,
    sourceType: signalType,
    externalId: payload.externalId,
    rawPayload: { ...payload, signalType },
    receivedAt: now,
    status: "RECEIVED",
    createdAt: now,
    updatedAt: now
  };
}

export function normalizeSignal(rawSignal: RawSignal, connector: Connector, context: ConnectorContext): NormalizedSignal {
  const payload = rawSignal.rawPayload as RawConnectorPayload;
  const now = context.now ?? new Date().toISOString();
  const signalType = inferSignalType(connector, rawSignal);
  const title = payload.title ?? String(payload.text ?? payload.summary ?? rawSignal.externalId ?? "Untitled signal");
  const summary = payload.summary ?? payload.text ?? title;

  return {
    id: createScopedId("normalized-signal"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    rawSignalId: rawSignal.id,
    connectorId: connector.id,
    signalType,
    title,
    summary,
    sourceUrl: payload.url,
    author: payload.author,
    platform: payload.platform ?? connector.provider,
    occurredAt: payload.occurredAt ?? rawSignal.receivedAt,
    confidenceScore: payload.confidenceScore ?? 0.75,
    priority: payload.priority ?? "MEDIUM",
    metadata: {
      ...payload.metadata,
      connectorType: connector.connectorType,
      externalId: rawSignal.externalId,
      normalizedAt: now
    },
    createdAt: now,
    updatedAt: now
  };
}

function isSignalType(value: string): value is SignalType {
  return [
    "SEARCH_QUERY",
    "TRAFFIC_CHANGE",
    "REFERRAL_TRAFFIC",
    "SOCIAL_POST",
    "SOCIAL_COMMENT",
    "COMMUNITY_THREAD",
    "COMMUNITY_REPLY",
    "PRODUCT_HUNT_COMMENT",
    "GITHUB_ISSUE",
    "GITHUB_RELEASE",
    "NEWSLETTER_METRIC",
    "CMS_ARTICLE",
    "DIRECTORY_STATUS",
    "BACKLINK_FOUND",
    "CUSTOM_SIGNAL"
  ].includes(value);
}
