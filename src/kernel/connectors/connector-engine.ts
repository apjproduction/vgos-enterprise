import {
  createScopedId,
  orgId,
  type Connector,
  type ConnectorStatus,
  type ConnectorSyncRun,
  type RawSignal
} from "@/lib/vgos-data";
import { connectorRegistry, registerConnector as registerConnectorDefinition } from "@/kernel/connectors/connector-registry";
import { getConnectorHealth as calculateConnectorHealth } from "@/kernel/connectors/connector-health";
import { createRawSignal, normalizeSignal as normalizeRawSignal } from "@/kernel/connectors/normalization-engine";
import { routeSignalToKernel as routeNormalizedSignal } from "@/kernel/connectors/signal-router";
import type {
  ConnectorContext,
  ConnectorDefinition,
  ConnectorSyncInput,
  ConnectorSyncResult,
  RawConnectorPayload
} from "@/kernel/connectors/connector-types";

export function registerConnector(definition: ConnectorDefinition) {
  return registerConnectorDefinition(definition);
}

export function createConnector(definition: ConnectorDefinition, context: ConnectorContext): Connector {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("connector"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    name: definition.name,
    connectorType: definition.type,
    status: definition.status,
    provider: definition.provider,
    description: definition.description,
    authType: definition.authType,
    config: {
      requiredConfig: definition.requiredConfig,
      optionalConfig: definition.optionalConfig,
      mode: "mock",
      kernelFirst: true
    },
    healthScore: definition.status === "MOCK" ? 75 : 50,
    createdAt: now,
    updatedAt: now
  };
}

export function updateConnectorStatus(connector: Connector, status: ConnectorStatus, context?: Partial<ConnectorContext>): Connector {
  return {
    ...connector,
    status,
    updatedAt: context?.now ?? new Date().toISOString()
  };
}

export function processRawSignal(rawSignal: RawSignal, connector: Connector, context: ConnectorContext) {
  const normalizedSignal = normalizeRawSignal(rawSignal, connector, context);
  const routed = routeNormalizedSignal(normalizedSignal, context);
  return { normalizedSignal, routed };
}

export function normalizeSignal(rawSignal: RawSignal, connector: Connector, context: ConnectorContext) {
  return normalizeRawSignal(rawSignal, connector, context);
}

export function routeSignalToKernel(signal: ReturnType<typeof normalizeRawSignal>, context: ConnectorContext) {
  return routeNormalizedSignal(signal, context);
}

export function runConnectorSync(input: ConnectorSyncInput, context: ConnectorContext): ConnectorSyncResult {
  const now = context.now ?? new Date().toISOString();
  const payloads = input.payloads ?? getMockPayloads(input.connector);
  const rawSignals = payloads.map((payload) => createRawSignal(input.connector, payload, { ...context, now }));
  const processed = rawSignals.map((rawSignal) => processRawSignal(rawSignal, input.connector, { ...context, now }));
  const failed = input.status === "FAILED";
  const run: ConnectorSyncRun = {
    id: createScopedId("connector-sync-run"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    connectorId: input.connector.id,
    status: failed ? "FAILED" : "COMPLETED",
    startedAt: now,
    completedAt: failed ? undefined : now,
    recordsFetched: rawSignals.length,
    recordsNormalized: failed ? 0 : processed.length,
    recordsRouted: failed ? 0 : processed.reduce((total, item) => total + item.routed.routedCollections.length, 0),
    error: failed ? "Mock sync failed by request." : undefined,
    logs: {
      mode: "mock",
      kernelFirst: true,
      connectorType: input.connector.connectorType,
      messages: failed
        ? ["Sync started", "Mock failure returned before normalization"]
        : ["Sync started", "Raw signals received", "Signals normalized", "Signals routed"]
    },
    createdAt: now,
    updatedAt: now
  };
  const connector = {
    ...input.connector,
    lastSyncAt: now,
    healthScore: calculateConnectorHealth({ connector: input.connector, recentRuns: [run] }).score,
    updatedAt: now
  };
  const syncEvents = [
    {
      id: createScopedId("event"),
      organizationId: context.organizationId ?? orgId,
      workspaceId: context.workspaceId,
      eventType: "CONNECTOR_SYNC_STARTED" as const,
      sourceType: "Connector",
      sourceId: input.connector.id,
      title: `${input.connector.name} sync started`,
      description: `Connected Intelligence started a ${input.connector.connectorType} sync.`,
      metadata: { connectorType: input.connector.connectorType, mode: "mock" },
      severity: "MEDIUM" as const,
      status: "PROCESSED" as const,
      createdAt: now,
      processedAt: now
    },
    {
      id: createScopedId("event"),
      organizationId: context.organizationId ?? orgId,
      workspaceId: context.workspaceId,
      eventType: failed ? "CONNECTOR_SYNC_FAILED" as const : "CONNECTOR_SYNC_COMPLETED" as const,
      sourceType: "ConnectorSyncRun",
      sourceId: run.id,
      title: `${input.connector.name} sync ${failed ? "failed" : "completed"}`,
      description: run.error ?? `Fetched ${run.recordsFetched}, normalized ${run.recordsNormalized}, and routed ${run.recordsRouted} records.`,
      metadata: { connectorId: input.connector.id, connectorType: input.connector.connectorType, mode: "mock" },
      severity: failed ? "HIGH" as const : "MEDIUM" as const,
      status: failed ? "PENDING" as const : "PROCESSED" as const,
      createdAt: now,
      processedAt: failed ? undefined : now
    }
  ];

  return {
    connector,
    run,
    rawSignals: rawSignals.map((rawSignal) => ({ ...rawSignal, status: failed ? "FAILED" : "ROUTED", processedAt: failed ? undefined : now })),
    normalizedSignals: failed ? [] : processed.map((item) => item.normalizedSignal),
    routed: failed ? [] : processed.map((item) => item.routed),
    events: failed ? syncEvents : [...syncEvents, ...processed.flatMap((item) => item.routed.events)]
  };
}

export function getConnectorHealth(connector: Connector, syncRuns: ConnectorSyncRun[]) {
  return calculateConnectorHealth({
    connector,
    recentRuns: syncRuns.filter((run) => run.connectorId === connector.id).slice(0, 5)
  });
}

export function getConnectorSyncHistory(connectorId: string, syncRuns: ConnectorSyncRun[]) {
  return syncRuns
    .filter((run) => run.connectorId === connectorId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

function getMockPayloads(connector: Connector): RawConnectorPayload[] {
  const definition = connectorRegistry.find((item) => item.type === connector.connectorType);
  const signalType = definition?.supportedSignalTypes[0] ?? "CUSTOM_SIGNAL";
  return [
    {
      externalId: `${connector.id}-mock-1`,
      sourceType: signalType,
      title:
        connector.connectorType === "GOOGLE_SEARCH_CONSOLE"
          ? "product page to video"
          : `${connector.name} mock signal`,
      summary:
        connector.connectorType === "PRODUCT_HUNT"
          ? "Product Hunt visitor asks for a URL-to-video example."
          : `Mock ${signalType.toLowerCase()} payload routed through Connected Intelligence.`,
      url: "https://vidmaker.com",
      author: connector.provider,
      platform: connector.provider,
      priority: connector.connectorType === "PRODUCT_HUNT" ? "CRITICAL" : "HIGH",
      confidenceScore: 0.84,
      metadata: { generatedBy: "mock-connector" }
    }
  ];
}
