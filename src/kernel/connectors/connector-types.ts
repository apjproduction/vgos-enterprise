import type {
  AuthType,
  Backlink,
  Connector,
  ConnectorStatus,
  ConnectorSyncRun,
  ConnectorType,
  ContentAsset,
  Event,
  IntelligenceObject,
  Keyword,
  KnowledgeObject,
  Measurement,
  Memory,
  Metric,
  NormalizedSignal,
  Observation,
  Priority,
  Question,
  RawSignal,
  SignalType,
  SyncStatus,
  Attribution,
  CoreRecord
} from "@/lib/vgos-data";

export type ConnectorDefinition = {
  id: string;
  name: string;
  type: ConnectorType;
  provider: string;
  authType: AuthType;
  supportedSignalTypes: SignalType[];
  requiredConfig: string[];
  optionalConfig: string[];
  status: ConnectorStatus;
  description: string;
};

export type ConnectorContext = {
  workspaceId: string;
  organizationId: string;
  now?: string;
};

export type RawConnectorPayload = {
  externalId?: string;
  sourceType?: string;
  title?: string;
  summary?: string;
  text?: string;
  url?: string;
  author?: string;
  platform?: string;
  occurredAt?: string;
  priority?: Priority;
  confidenceScore?: number;
  metadata?: Record<string, unknown>;
};

export type ConnectorSyncResult = {
  connector: Connector;
  run: ConnectorSyncRun;
  rawSignals: RawSignal[];
  normalizedSignals: NormalizedSignal[];
  routed: RoutedSignalResult[];
  events: Event[];
};

export type RoutedSignalResult = {
  signalId: string;
  routedCollections: string[];
  events: Event[];
  observations: Observation[];
  conversations: CoreRecord[];
  questions: Question[];
  keywords: Keyword[];
  intelligenceObjects: IntelligenceObject[];
  memories: Memory[];
  metrics: Metric[];
  measurements: Measurement[];
  attributions: Attribution[];
  backlinks: Backlink[];
  contentAssets: ContentAsset[];
  knowledgeObjects: KnowledgeObject[];
};

export type ConnectorHealthInput = {
  connector: Connector;
  recentRuns: ConnectorSyncRun[];
};

export type ConnectorHealth = {
  score: number;
  status: ConnectorStatus;
  reasons: string[];
};

export type ConnectorSyncInput = {
  connector: Connector;
  payloads?: RawConnectorPayload[];
  status?: SyncStatus;
};
