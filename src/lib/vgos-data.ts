import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  Database,
  FlaskConical,
  Lightbulb,
  Network,
  Search,
  Sparkles,
  Target,
  UsersRound
} from "lucide-react";

export type Status =
  | "NOT_STARTED"
  | "RESEARCHING"
  | "IN_PROGRESS"
  | "PUBLISHED"
  | "SUBMITTED"
  | "LIVE"
  | "ARCHIVED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ContentType =
  | "BLOG"
  | "FOUNDER_POST"
  | "COMPANY_POST"
  | "X_THREAD"
  | "PINTEREST_PIN"
  | "NEWSLETTER"
  | "YOUTUBE_SCRIPT"
  | "FAQ"
  | "LANDING_PAGE";

export type Intent =
  | "INFORMATIONAL"
  | "COMMERCIAL"
  | "TRANSACTIONAL"
  | "NAVIGATIONAL"
  | "COMMUNITY_DISCUSSION";

export type FunnelStage = "TOFU" | "MOFU" | "BOFU";

export type RelationshipType =
  | "ANSWERS"
  | "INSPIRES"
  | "SUPPORTS"
  | "CONTRADICTS"
  | "LINKS_TO"
  | "TARGETS"
  | "GENERATED_FROM"
  | "RELATED_TO"
  | "COMPETES_WITH"
  | "MENTIONS";

export type RecommendationType =
  | "BLOG_IDEA"
  | "FOUNDER_POST"
  | "COMPANY_POST"
  | "X_THREAD"
  | "PINTEREST_PIN"
  | "FAQ"
  | "LANDING_PAGE"
  | "FEATURE_REQUEST"
  | "DIRECTORY_SUBMISSION"
  | "BACKLINK_OUTREACH"
  | "INTERNAL_LINK"
  | "COMMUNITY_REPLY";

export type EventType =
  | "OBSERVATION_CREATED"
  | "QUESTION_CREATED"
  | "PAIN_POINT_CREATED"
  | "CONTENT_ASSET_CREATED"
  | "CONTENT_ASSET_PUBLISHED"
  | "DIRECTORY_SUBMITTED"
  | "BACKLINK_LIVE"
  | "AI_RECOMMENDATION_CREATED"
  | "EXPERIMENT_STARTED"
  | "EXPERIMENT_COMPLETED"
  | "COMPETITOR_MENTIONED"
  | "HIGH_OPPORTUNITY_DETECTED"
  | "MEMORY_CREATED"
  | "MEMORY_UPDATED"
  | "PATTERN_DETECTED"
  | "REASONING_TRACE_CREATED"
  | "OBJECTIVE_CREATED"
  | "KEY_RESULT_UPDATED"
  | "AGENT_RUN_STARTED"
  | "AGENT_RUN_COMPLETED"
  | "HIGH_IMPACT_ACTION_SELECTED"
  | "PLAN_CREATED"
  | "PLAN_ACTIVATED"
  | "PLAN_COMPLETED"
  | "PLAN_ITEM_COMPLETED"
  | "PLAN_ITEM_BLOCKED"
  | "MILESTONE_COMPLETED"
  | "CONSTRAINT_ADDED"
  | "OUTCOME_PREDICTED"
  | "CAPABILITY_REGISTERED"
  | "EXECUTION_STARTED"
  | "EXECUTION_COMPLETED"
  | "EXECUTION_BLOCKED"
  | "EXECUTION_FAILED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_APPROVED"
  | "APPROVAL_REJECTED"
  | "EVIDENCE_ADDED"
  | "EXECUTION_RESULT_CREATED"
  | "METRIC_CREATED"
  | "METRIC_UPDATED"
  | "MEASUREMENT_CREATED"
  | "LEARNING_CREATED"
  | "ATTRIBUTION_CREATED"
  | "STRATEGY_ADJUSTMENT_PROPOSED"
  | "STRATEGY_ADJUSTMENT_ACCEPTED"
  | "STRATEGY_ADJUSTMENT_REJECTED"
  | "STRATEGY_ADJUSTMENT_IMPLEMENTED";

export type EventSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EventStatus = "PENDING" | "PROCESSED" | "DISMISSED";

export type ActionType =
  | "WRITE_BLOG"
  | "CREATE_FOUNDER_POST"
  | "CREATE_COMPANY_POST"
  | "CREATE_X_THREAD"
  | "CREATE_PINTEREST_PIN"
  | "ADD_INTERNAL_LINK"
  | "SUBMIT_DIRECTORY"
  | "REACH_OUT_FOR_BACKLINK"
  | "REPLY_TO_COMMUNITY"
  | "CREATE_EXPERIMENT"
  | "UPDATE_LANDING_PAGE"
  | "CREATE_FAQ"
  | "CREATE_DEMO"
  | "REVIEW_COMPETITOR"
  | "FOLLOW_UP";

export type ActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DISMISSED";

export type PatternType =
  | "RECURRING_QUESTION"
  | "COMPETITOR_COMPLAINT"
  | "CONTENT_GAP"
  | "PRODUCT_DEMAND"
  | "AUTHORITY_OPPORTUNITY"
  | "SEO_OPPORTUNITY"
  | "AEO_OPPORTUNITY"
  | "GEO_OPPORTUNITY";

export type TrendDirection = "RISING" | "STABLE" | "DECLINING";

export type ObjectiveCategory =
  | "SEO"
  | "AEO"
  | "GEO"
  | "AUTHORITY"
  | "CONTENT"
  | "PRODUCT"
  | "REVENUE"
  | "COMMUNITY"
  | "BRAND";

export type AgentType =
  | "CONVERSATION_AGENT"
  | "CONTENT_AGENT"
  | "SEO_AGENT"
  | "AEO_AGENT"
  | "GEO_AGENT"
  | "AUTHORITY_AGENT"
  | "COMPETITOR_AGENT"
  | "PRODUCT_AGENT"
  | "EXPERIMENT_AGENT";

export type KnowledgeObjectType =
  | "ENTITY"
  | "QUESTION"
  | "PAIN_POINT"
  | "CONTENT_ASSET"
  | "KEYWORD"
  | "PERSONA"
  | "COMPETITOR"
  | "COMMUNITY"
  | "MEMORY"
  | "PATTERN"
  | "INSIGHT"
  | "RECOMMENDATION"
  | "FEATURE_REQUEST"
  | "CAMPAIGN"
  | "EXPERIMENT"
  | "OBJECTIVE"
  | "BACKLINK"
  | "DIRECTORY"
  | "PRODUCT_SIGNAL";

export type KnowledgeRelationshipType =
  | RelationshipType
  | "BELONGS_TO"
  | "DEPENDS_ON"
  | "IMPROVES"
  | "RISKS"
  | "VALIDATES"
  | "INVALIDATES"
  | "DEFINES";

export type WorkflowType =
  | "CONVERSATION_TO_CONTENT"
  | "OBSERVATION_TO_INSIGHT"
  | "INSIGHT_TO_EXPERIMENT"
  | "QUESTION_TO_AEO_ASSET"
  | "PAIN_POINT_TO_FEATURE_REQUEST"
  | "PRODUCT_HUNT_TO_DEMO_CONTENT"
  | "DIRECTORY_TO_BACKLINK"
  | "COMPETITOR_COMPLAINT_TO_CONTENT"
  | "CONTENT_TO_INTERNAL_LINKS"
  | "MEMORY_TO_PATTERN";

export type TriggerType = "MANUAL" | "EVENT" | "SCHEDULED" | "AGENT";

export type WorkflowStepType =
  | "CLASSIFY"
  | "EXTRACT_ENTITIES"
  | "EXTRACT_PAIN_POINTS"
  | "CREATE_MEMORY"
  | "DETECT_PATTERN"
  | "CREATE_REASONING_TRACE"
  | "CREATE_RECOMMENDATION"
  | "CREATE_ACTION"
  | "CREATE_CONTENT_ASSET"
  | "CREATE_TASK"
  | "LINK_KNOWLEDGE_OBJECTS"
  | "NOTIFY_MISSION_CONTROL";

export type PlanType =
  | "SEO_PLAN"
  | "AEO_PLAN"
  | "GEO_PLAN"
  | "AUTHORITY_PLAN"
  | "CONTENT_PLAN"
  | "PRODUCT_PLAN"
  | "LAUNCH_PLAN"
  | "COMMUNITY_PLAN"
  | "REVENUE_PLAN"
  | "EXPERIMENT_PLAN";

export type PlanStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type PlanItemType =
  | "BLOG"
  | "FOUNDER_POST"
  | "COMPANY_POST"
  | "X_THREAD"
  | "PINTEREST_PIN"
  | "DIRECTORY_SUBMISSION"
  | "BACKLINK_OUTREACH"
  | "COMMUNITY_REPLY"
  | "DEMO"
  | "FAQ"
  | "LANDING_PAGE_UPDATE"
  | "EXPERIMENT"
  | "PRODUCT_TASK"
  | "INTERNAL_LINK"
  | "NEWSLETTER"
  | "YOUTUBE_SCRIPT";

export type PlanItemStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "ARCHIVED";

export type PlanDependencyType =
  | "BLOCKS"
  | "REQUIRES"
  | "SUPPORTS"
  | "SEQUENCED_BEFORE"
  | "SHOULD_FOLLOW";

export type PlanConstraintType =
  | "TIME"
  | "BUDGET"
  | "CONTENT_NOT_READY"
  | "DESIGN_NOT_READY"
  | "PRODUCT_NOT_READY"
  | "DATA_NOT_AVAILABLE"
  | "RESOURCE_LIMITED"
  | "APPROVAL_REQUIRED";

export type ConstraintSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ExecutionType =
  | "BLOG_PUBLISH"
  | "FOUNDER_POST"
  | "COMPANY_POST"
  | "X_POST"
  | "X_THREAD"
  | "PINTEREST_PIN"
  | "DIRECTORY_SUBMISSION"
  | "BACKLINK_OUTREACH"
  | "COMMUNITY_REPLY"
  | "DEMO_CREATION"
  | "FAQ_UPDATE"
  | "LANDING_PAGE_UPDATE"
  | "INTERNAL_LINK_UPDATE"
  | "NEWSLETTER_SEND"
  | "YOUTUBE_SCRIPT"
  | "PRODUCT_TASK"
  | "EXPERIMENT_RUN"
  | "MANUAL_ACTION";

export type ExecutionStatus =
  | "QUEUED"
  | "READY"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "NEEDS_APPROVAL"
  | "APPROVED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type EvidenceType =
  | "URL"
  | "SCREENSHOT"
  | "FILE"
  | "NOTE"
  | "METRIC"
  | "SOCIAL_POST"
  | "DIRECTORY_CONFIRMATION"
  | "BACKLINK_LIVE"
  | "BLOG_LIVE"
  | "COMMENT_REPLY"
  | "DEMO_ASSET";

export type BlockerType =
  | "MISSING_CONTENT"
  | "MISSING_GRAPHIC"
  | "MISSING_APPROVAL"
  | "MISSING_ACCESS"
  | "TECHNICAL_ISSUE"
  | "WAITING_ON_EXTERNAL_SITE"
  | "NEEDS_REVIEW"
  | "LOW_CONFIDENCE"
  | "RESOURCE_LIMIT"
  | "OTHER";

export type BlockerStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "IGNORED";

export type ApprovalType =
  | "CONTENT_APPROVAL"
  | "BRAND_APPROVAL"
  | "SEO_APPROVAL"
  | "PRODUCT_APPROVAL"
  | "LEGAL_APPROVAL"
  | "FOUNDER_APPROVAL"
  | "PUBLISHING_APPROVAL";

export type ApprovalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "CANCELLED";

export type ExecutionResultType =
  | "COMPLETED"
  | "PARTIAL_SUCCESS"
  | "FAILED"
  | "LEARNING_CAPTURED"
  | "METRIC_IMPROVED"
  | "NO_IMPACT"
  | "FOLLOW_UP_REQUIRED";

export type MetricType =
  | "TRAFFIC"
  | "SIGNUPS"
  | "CONVERSIONS"
  | "BACKLINKS"
  | "REFERRING_DOMAINS"
  | "AI_MENTIONS"
  | "SEARCH_IMPRESSIONS"
  | "SEARCH_CLICKS"
  | "SOCIAL_IMPRESSIONS"
  | "SOCIAL_ENGAGEMENT"
  | "COMMUNITY_REPLIES"
  | "DIRECTORY_APPROVALS"
  | "CONTENT_PUBLISHED"
  | "EXPERIMENT_RESULT"
  | "REVENUE"
  | "AUTHORITY_SCORE"
  | "CUSTOM";

export type MetricStatus = "HEALTHY" | "WATCH" | "IMPROVING" | "DECLINING" | "STALLED" | "ARCHIVED";

export type LearningType =
  | "CONTENT_PERFORMANCE"
  | "CHANNEL_PERFORMANCE"
  | "SEO_IMPACT"
  | "AEO_IMPACT"
  | "GEO_IMPACT"
  | "AUTHORITY_IMPACT"
  | "COMMUNITY_SIGNAL"
  | "PRODUCT_SIGNAL"
  | "EXECUTION_FAILURE"
  | "STRATEGY_UPDATE"
  | "EXPERIMENT_LEARNING"
  | "CUSTOMER_LANGUAGE"
  | "CUSTOM";

export type AttributionType = "INFLUENCED" | "CAUSED" | "CORRELATED" | "SUPPORTED" | "CONTRADICTED" | "UNKNOWN";

export type StrategyAdjustmentType =
  | "INCREASE_FOCUS"
  | "DECREASE_FOCUS"
  | "PAUSE_STRATEGY"
  | "CREATE_NEW_PLAN"
  | "UPDATE_POSITIONING"
  | "UPDATE_CONTENT_CLUSTER"
  | "UPDATE_KEYWORD_TARGET"
  | "UPDATE_PERSONA_PRIORITY"
  | "UPDATE_CHANNEL_PRIORITY"
  | "CREATE_EXPERIMENT"
  | "CREATE_FEATURE_REQUEST";

export type StrategyAdjustmentStatus = "PROPOSED" | "ACCEPTED" | "REJECTED" | "IMPLEMENTED" | "ARCHIVED";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  website: string;
  description: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
};

export type ScopedRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type CoreRecord = ScopedRecord & {
  title: string;
  description: string;
  source: string;
  url?: string;
  status: Status;
  priority: Priority;
  owner: string;
};

export type ScoredOpportunity = {
  searchVolumeEstimate: number;
  businessValueScore: number;
  painSeverityScore: number;
  competitionScore: number;
  trendScore: number;
  authorityGapScore: number;
  opportunityScore: number;
};

export type Persona = ScopedRecord & {
  name: string;
  description: string;
  industry: string;
  buyingIntent: string;
  primaryPainPoint: string;
  contentNeeds: string;
};

export type Observation = ScopedRecord & {
  title: string;
  source: string;
  sourceUrl: string;
  rawText: string;
  summary: string;
  platform: string;
  sentiment: string;
  confidenceScore: number;
};

export type Insight = ScopedRecord & {
  title: string;
  summary: string;
  strategicImplication: string;
  evidence: string;
  confidenceScore: number;
  observationId?: string;
};

export type Hypothesis = ScopedRecord & {
  title: string;
  statement: string;
  expectedOutcome: string;
  relatedMetric: string;
  confidenceScore: number;
  status: Status;
  insightId?: string;
};

export type Experiment = ScopedRecord & {
  title: string;
  description: string;
  channel: string;
  hypothesisId?: string;
  startDate?: string;
  endDate?: string;
  successMetric: string;
  result: string;
  status: Status;
};

export type Outcome = ScopedRecord & {
  title: string;
  experimentId?: string;
  metricName: string;
  metricBefore?: number;
  metricAfter?: number;
  resultSummary: string;
  learnings: string;
};

export type Question = CoreRecord &
  ScoredOpportunity & {
    intent: Intent;
    funnelStage: FunnelStage;
    conversationId?: string;
    personaIds: string[];
    contentAssetIds: string[];
  };

export type PainPoint = CoreRecord &
  ScoredOpportunity & {
    conversationId?: string;
    competitorId?: string;
    personaIds: string[];
    featureRequestIds: string[];
  };

export type ContentAsset = CoreRecord & {
  code: string;
  contentType: ContentType;
  intent: Intent;
  funnelStage: FunnelStage;
  personaIds: string[];
  questionIds: string[];
  keywordIds: string[];
  entityIds: string[];
  campaignIds: string[];
};

export type Keyword = CoreRecord & {
  name: string;
  intent: Intent;
  funnelStage: FunnelStage;
};

export type Entity = CoreRecord & {
  name: string;
  type: string;
  aliases: string[];
  synonyms: string[];
  canonicalUrl: string;
  importanceScore: number;
  entityOwner: string;
  notes: string;
};

export type Community = CoreRecord & {
  name: string;
};

export type Competitor = CoreRecord & {
  name: string;
};

export type DirectorySubmission = CoreRecord & {
  name: string;
  backlinkIds: string[];
};

export type Backlink = CoreRecord & {
  targetUrl: string;
  directorySubmissionId?: string;
};

export type Campaign = CoreRecord & {
  name: string;
  personaIds: string[];
  contentAssetIds: string[];
  taskIds: string[];
};

export type Task = CoreRecord & {
  campaignId?: string;
  dueAt?: string;
};

export type FeatureRequest = CoreRecord & {
  painPointId?: string;
  personaIds: string[];
};

export type KnowledgeNode = ScopedRecord & {
  label: string;
  type: string;
  description: string;
  sourceType: string;
  sourceId: string;
};

export type KnowledgeEdge = ScopedRecord & {
  fromNodeId: string;
  toNodeId: string;
  relationshipType: RelationshipType;
  strength: number;
  notes: string;
};

export type AIRecommendation = CoreRecord & {
  recommendationType: RecommendationType;
  targetEntityType: string;
  targetEntityId: string;
  suggestedAction: string;
  reasoning: string;
  confidenceScore: number;
  generatedBy: string;
  acceptedAt?: string;
  rejectedAt?: string;
};

export type IntelligenceObject = ScopedRecord & {
  sourceType: string;
  sourceId: string;
  summary: string;
  detectedEntities: string[];
  detectedKeywords: string[];
  detectedIntent: Intent;
  detectedPersona: string;
  detectedPainPoints: string[];
  sentiment: string;
  opportunityScore: number;
  confidenceScore: number;
  reasoning: string;
};

export type Event = {
  id: string;
  organizationId: string;
  workspaceId: string;
  eventType: EventType;
  sourceType: string;
  sourceId: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  severity: EventSeverity;
  status: EventStatus;
  createdAt: string;
  processedAt?: string;
};

export type RecommendedAction = ScopedRecord & {
  title: string;
  description: string;
  sourceType: string;
  sourceId: string;
  actionType: ActionType;
  priority: Priority;
  status: ActionStatus;
  dueDate: string;
  owner: string;
  reasoning: string;
  expectedImpact: string;
  completedAt?: string;
  objectiveId?: string;
  patternId?: string;
};

export type Memory = ScopedRecord & {
  topic: string;
  entity: string;
  summary: string;
  sourceTypes: string[];
  linkedSourceIds: string[];
  firstSeen: string;
  lastSeen: string;
  frequency: number;
  confidenceScore: number;
  importanceScore: number;
  status: Status;
};

export type MemorySnapshot = {
  id: string;
  organizationId: string;
  workspaceId: string;
  memoryId: string;
  period: string;
  summary: string;
  frequency: number;
  importanceScore: number;
  confidenceScore: number;
  trendDirection: TrendDirection;
  notableSources: string[];
  createdAt: string;
};

export type Pattern = ScopedRecord & {
  title: string;
  description: string;
  patternType: PatternType;
  relatedEntity?: string;
  evidence: Record<string, unknown>;
  frequency: number;
  trendDirection: TrendDirection;
  confidenceScore: number;
  importanceScore: number;
  status: Status;
};

export type ReasoningTrace = {
  id: string;
  organizationId: string;
  workspaceId: string;
  sourceType: string;
  sourceId: string;
  inputSummary: string;
  reasoningSteps: string[];
  conclusion: string;
  confidenceScore: number;
  recommendedActionIds: string[];
  createdAt: string;
};

export type Objective = ScopedRecord & {
  title: string;
  description: string;
  category: ObjectiveCategory;
  priority: Priority;
  status: Status;
  startDate?: string;
  endDate?: string;
};

export type KeyResult = {
  id: string;
  objectiveId: string;
  title: string;
  metricName: string;
  targetValue: number;
  currentValue: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Agent = ScopedRecord & {
  name: string;
  title: string;
  description: string;
  agentType: AgentType;
  status: Status;
  mission: string;
  inputSources: string[];
  outputTypes: string[];
  parentAgentId?: string;
  dependsOnAgentIds: string[];
  handoffRules: Record<string, unknown>;
  allowedWorkflowIds: string[];
  lastRunAt?: string;
};

export type AgentRun = {
  id: string;
  organizationId: string;
  workspaceId: string;
  agentId: string;
  status: ActionStatus;
  inputSummary: string;
  outputSummary: string;
  recommendationsCreated: number;
  actionsCreated: number;
  startedAt: string;
  completedAt?: string;
  logs: string[];
};

export type KnowledgeObject = ScopedRecord & {
  canonicalId: string;
  objectType: KnowledgeObjectType;
  title: string;
  summary: string;
  description: string;
  sourceType: string;
  sourceId: string;
  canonicalEntityId?: string;
  aliases: string[];
  tags: string[];
  metadata: Record<string, unknown>;
  searchableText: string;
  embeddingProvider?: string;
  embeddingModel?: string;
  embeddingVector?: number[];
  embeddingUpdatedAt?: string;
  importanceScore: number;
  confidenceScore: number;
  status: Status;
};

export type KnowledgeRelationship = ScopedRecord & {
  fromObjectId: string;
  toObjectId: string;
  relationshipType: KnowledgeRelationshipType;
  strength: number;
  evidence: string;
  metadata: Record<string, unknown>;
};

export type Workflow = ScopedRecord & {
  name: string;
  title: string;
  description: string;
  workflowType: WorkflowType;
  status: Status;
  triggerType: TriggerType;
  triggerConfig: Record<string, unknown>;
};

export type WorkflowStep = {
  id: string;
  workflowId: string;
  order: number;
  name: string;
  stepType: WorkflowStepType;
  config: Record<string, unknown>;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowRun = {
  id: string;
  organizationId: string;
  workspaceId: string;
  workflowId: string;
  status: ActionStatus;
  triggerSourceType: string;
  triggerSourceId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  logs: string[];
};

export type AgentHandoff = {
  id: string;
  organizationId: string;
  workspaceId: string;
  fromAgentId: string;
  toAgentId: string;
  sourceType: string;
  sourceId: string;
  reason: string;
  status: ActionStatus;
  createdAt: string;
  completedAt?: string;
};

export type Plan = ScopedRecord & {
  title: string;
  description: string;
  planType: PlanType;
  status: PlanStatus;
  objectiveId?: string;
  startDate: string;
  endDate: string;
  owner: string;
  expectedOutcome: string;
  confidenceScore: number;
};

export type Milestone = ScopedRecord & {
  planId: string;
  title: string;
  description: string;
  dueDate: string;
  status: PlanItemStatus;
  priority: Priority;
  owner: string;
  expectedImpact: string;
  order: number;
};

export type PlanItem = ScopedRecord & {
  planId: string;
  milestoneId?: string;
  title: string;
  description: string;
  itemType: PlanItemType;
  sourceType?: string;
  sourceId?: string;
  priority: Priority;
  status: PlanItemStatus;
  owner: string;
  dueDate: string;
  estimatedImpactScore: number;
  estimatedEffortScore: number;
};

export type PlanDependency = ScopedRecord & {
  planId: string;
  fromItemId: string;
  toItemId: string;
  dependencyType: PlanDependencyType;
  reason: string;
};

export type PlanConstraint = ScopedRecord & {
  planId: string;
  title: string;
  description: string;
  constraintType: PlanConstraintType;
  severity: ConstraintSeverity;
};

export type PredictedOutcome = ScopedRecord & {
  planId: string;
  metricName: string;
  predictedValue: number;
  confidenceScore: number;
  rationale: string;
};

export type ResourceCapacity = ScopedRecord & {
  owner: string;
  role: string;
  weeklyHours: number;
  focusArea: string;
  notes: string;
};

export type ExecutionItem = ScopedRecord & {
  title: string;
  description: string;
  executionType: ExecutionType;
  status: ExecutionStatus;
  priority: Priority;
  owner: string;
  dueDate: string;
  startedAt?: string;
  completedAt?: string;
  sourceType?: string;
  sourceId?: string;
  planId?: string;
  planItemId?: string;
  recommendedActionId?: string;
  workflowRunId?: string;
  objectiveId?: string;
  campaignId?: string;
  expectedImpact: string;
  actualImpact: string;
  notes: string;
};

export type ExecutionEvidence = ScopedRecord & {
  executionItemId: string;
  evidenceType: EvidenceType;
  title: string;
  url?: string;
  description: string;
  uploadedAssetUrl?: string;
  capturedAt: string;
};

export type ExecutionBlocker = ScopedRecord & {
  executionItemId: string;
  title: string;
  description: string;
  blockerType: BlockerType;
  severity: ConstraintSeverity;
  status: BlockerStatus;
  owner: string;
  resolvedAt?: string;
};

export type ApprovalRequest = ScopedRecord & {
  executionItemId: string;
  title: string;
  description: string;
  approvalType: ApprovalType;
  status: ApprovalStatus;
  requestedBy: string;
  reviewer: string;
  requestedAt: string;
  reviewedAt?: string;
  decisionNotes?: string;
};

export type ExecutionResult = ScopedRecord & {
  executionItemId: string;
  resultType: ExecutionResultType;
  summary: string;
  metricName?: string;
  metricBefore?: number;
  metricAfter?: number;
  impactScore?: number;
  learning: string;
};

export type Metric = ScopedRecord & {
  name: string;
  title: string;
  description: string;
  metricType: MetricType;
  source: string;
  unit: string;
  currentValue: number;
  previousValue: number;
  targetValue?: number;
  status: MetricStatus;
  owner: string;
};

export type Measurement = ScopedRecord & {
  metricId: string;
  sourceType?: string;
  sourceId?: string;
  executionItemId?: string;
  executionResultId?: string;
  planId?: string;
  objectiveId?: string;
  campaignId?: string;
  measuredAt: string;
  value: number;
  previousValue?: number;
  changeValue?: number;
  changePercent?: number;
  notes?: string;
};

export type Learning = ScopedRecord & {
  title: string;
  summary: string;
  learningType: LearningType;
  confidenceScore: number;
  sourceType?: string;
  sourceId?: string;
  metricId?: string;
  executionItemId?: string;
  planId?: string;
  objectiveId?: string;
  recommendationImpact: string;
  shouldInformFuturePlans: boolean;
};

export type Attribution = ScopedRecord & {
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  attributionType: AttributionType;
  confidenceScore: number;
  evidence: string;
};

export type StrategyAdjustment = ScopedRecord & {
  title: string;
  description: string;
  adjustmentType: StrategyAdjustmentType;
  sourceLearningId?: string;
  objectiveId?: string;
  planId?: string;
  status: StrategyAdjustmentStatus;
  priority: Priority;
  reasoning: string;
};

export type BriefingSection = {
  id: string;
  title: string;
  summary: string;
  items: string[];
};

export type PlatformState = {
  organizations: Organization[];
  workspaces: Workspace[];
  personas: Persona[];
  observations: Observation[];
  insights: Insight[];
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  outcomes: Outcome[];
  conversations: CoreRecord[];
  questions: Question[];
  painPoints: PainPoint[];
  contentAssets: ContentAsset[];
  keywords: Keyword[];
  entities: Entity[];
  communities: Community[];
  competitors: Competitor[];
  directorySubmissions: DirectorySubmission[];
  backlinks: Backlink[];
  campaigns: Campaign[];
  tasks: Task[];
  featureRequests: FeatureRequest[];
  knowledgeNodes: KnowledgeNode[];
  knowledgeEdges: KnowledgeEdge[];
  aiRecommendations: AIRecommendation[];
  intelligenceObjects: IntelligenceObject[];
  memories: Memory[];
  patterns: Pattern[];
  reasoningTraces: ReasoningTrace[];
  objectives: Objective[];
  keyResults: KeyResult[];
  agents: Agent[];
  agentRuns: AgentRun[];
  knowledgeObjects: KnowledgeObject[];
  knowledgeRelationships: KnowledgeRelationship[];
  memorySnapshots: MemorySnapshot[];
  workflows: Workflow[];
  workflowSteps: WorkflowStep[];
  workflowRuns: WorkflowRun[];
  agentHandoffs: AgentHandoff[];
  plans: Plan[];
  milestones: Milestone[];
  planItems: PlanItem[];
  planDependencies: PlanDependency[];
  planConstraints: PlanConstraint[];
  predictedOutcomes: PredictedOutcome[];
  resourceCapacities: ResourceCapacity[];
  executionItems: ExecutionItem[];
  executionEvidence: ExecutionEvidence[];
  executionBlockers: ExecutionBlocker[];
  approvalRequests: ApprovalRequest[];
  executionResults: ExecutionResult[];
  metrics: Metric[];
  measurements: Measurement[];
  learnings: Learning[];
  attributions: Attribution[];
  strategyAdjustments: StrategyAdjustment[];
  events: Event[];
  recommendedActions: RecommendedAction[];
  briefingSections: BriefingSection[];
};

export type PageId =
  | "missionControl"
  | "briefing"
  | "intelligencePipeline"
  | "memory"
  | "patterns"
  | "objectives"
  | "agents"
  | "reasoning"
  | "decisions"
  | "knowledge"
  | "workflows"
  | "plans"
  | "executions"
  | "approvals"
  | "blockers"
  | "evidence"
  | "results"
  | "metrics"
  | "measurements"
  | "learnings"
  | "attributions"
  | "strategyAdjustments"
  | "capabilities"
  | "opportunityQueue"
  | "recommendedActions"
  | "intelligenceEngine"
  | "contentEngine"
  | "authorityEngine"
  | "searchEngine"
  | "productEngine"
  | "knowledgeGraph";

export type CollectionKey =
  | "observations"
  | "conversations"
  | "insights"
  | "hypotheses"
  | "experiments"
  | "outcomes"
  | "personas"
  | "knowledgeNodes"
  | "knowledgeEdges"
  | "aiRecommendations"
  | "intelligenceObjects"
  | "memories"
  | "patterns"
  | "reasoningTraces"
  | "objectives"
  | "keyResults"
  | "agents"
  | "agentRuns"
  | "knowledgeObjects"
  | "knowledgeRelationships"
  | "memorySnapshots"
  | "workflows"
  | "workflowSteps"
  | "workflowRuns"
  | "agentHandoffs"
  | "plans"
  | "milestones"
  | "planItems"
  | "planDependencies"
  | "planConstraints"
  | "predictedOutcomes"
  | "resourceCapacities"
  | "executionItems"
  | "executionEvidence"
  | "executionBlockers"
  | "approvalRequests"
  | "executionResults"
  | "metrics"
  | "measurements"
  | "learnings"
  | "attributions"
  | "strategyAdjustments"
  | "recommendedActions"
  | "events"
  | "contentAssets"
  | "directorySubmissions"
  | "backlinks"
  | "keywords"
  | "questions"
  | "painPoints"
  | "featureRequests"
  | "tasks";

export type PageDefinition = {
  id: PageId;
  label: string;
  description: string;
  icon: typeof Activity;
  collection?: CollectionKey;
};

export const orgId = "org-apj-labs";
export const workspaceId = "workspace-vidmaker-growth-os";

const now = new Date();
const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const daysFromNow = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const scoped = (days = 0) => ({
  organizationId: orgId,
  workspaceId,
  createdAt: daysAgo(days + 7),
  updatedAt: daysAgo(days)
});

const score = (
  businessValueScore: number,
  painSeverityScore: number,
  trendScore: number,
  authorityGapScore: number,
  competitionScore: number
) =>
  businessValueScore * painSeverityScore * trendScore * authorityGapScore -
  competitionScore;

export const pageDefinitions: PageDefinition[] = [
  {
    id: "missionControl",
    label: "Mission Control",
    description: "Executive command center for what the VidMaker team should do next.",
    icon: Activity
  },
  {
    id: "briefing",
    label: "Intelligence Briefing",
    description: "Rule-based summary of recent changes, attention areas, and weekly focus.",
    icon: Search,
  },
  {
    id: "intelligencePipeline",
    label: "Intelligence Pipeline",
    description: "Processes raw signals into intent, persona, entities, pain, scores, and actions.",
    icon: BrainCircuit,
    collection: "intelligenceObjects"
  },
  {
    id: "memory",
    label: "Memory",
    description: "Recurring topics, entities, questions, and pain points remembered over time.",
    icon: BrainCircuit,
    collection: "memories"
  },
  {
    id: "patterns",
    label: "Patterns",
    description: "Detected recurring questions, complaints, gaps, demands, and opportunities.",
    icon: Network,
    collection: "patterns"
  },
  {
    id: "objectives",
    label: "Objectives",
    description: "Active goals and key results for VidMaker growth intelligence.",
    icon: Target,
    collection: "objectives"
  },
  {
    id: "agents",
    label: "Agents",
    description: "Rule-based kernel agents and their latest workspace-scoped runs.",
    icon: UsersRound,
    collection: "agents"
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Stored reasoning traces that explain recommendations and actions.",
    icon: CircleHelp,
    collection: "reasoningTraces"
  },
  {
    id: "decisions",
    label: "Decisions",
    description: "Ranked daily and weekly priorities selected by the decision engine.",
    icon: Sparkles
  },
  {
    id: "knowledge",
    label: "Knowledge",
    description: "Universal knowledge layer for entities, assets, memories, patterns, objectives, and recommendations.",
    icon: Network,
    collection: "knowledgeObjects"
  },
  {
    id: "workflows",
    label: "Workflows",
    description: "Workflow orchestration across signals, memory, patterns, recommendations, and actions.",
    icon: FlaskConical,
    collection: "workflows"
  },
  {
    id: "plans",
    label: "Plans",
    description: "Execution plans that sequence objectives, recommendations, constraints, and expected outcomes.",
    icon: Target,
    collection: "plans"
  },
  {
    id: "executions",
    label: "Executions",
    description: "Trackable execution items from plans, recommendations, workflows, and campaigns.",
    icon: CheckCircle2,
    collection: "executionItems"
  },
  {
    id: "approvals",
    label: "Approvals",
    description: "Approval requests for content, brand, SEO, product, founder, and publishing checks.",
    icon: CircleHelp,
    collection: "approvalRequests"
  },
  {
    id: "blockers",
    label: "Blockers",
    description: "Open and resolved execution blockers that prevent growth work from shipping.",
    icon: FlaskConical,
    collection: "executionBlockers"
  },
  {
    id: "evidence",
    label: "Evidence",
    description: "Proof that execution happened: URLs, screenshots, files, notes, metrics, and live assets.",
    icon: Database,
    collection: "executionEvidence"
  },
  {
    id: "results",
    label: "Results",
    description: "Execution results, impact notes, metric movement, follow-ups, and learning.",
    icon: Sparkles,
    collection: "executionResults"
  },
  {
    id: "metrics",
    label: "Metrics",
    description: "Tracked growth, authority, content, community, and revenue metrics.",
    icon: Database,
    collection: "metrics"
  },
  {
    id: "measurements",
    label: "Measurements",
    description: "Before-and-after metric snapshots linked to executions, plans, objectives, and campaigns.",
    icon: Activity,
    collection: "measurements"
  },
  {
    id: "learnings",
    label: "Learnings",
    description: "Captured lessons from measurements, execution results, experiments, channels, and customer language.",
    icon: Lightbulb,
    collection: "learnings"
  },
  {
    id: "attributions",
    label: "Attributions",
    description: "Rule-based source-to-impact relationships across executions, metrics, content, and channels.",
    icon: Network,
    collection: "attributions"
  },
  {
    id: "strategyAdjustments",
    label: "Strategy Adjustments",
    description: "Proposed and accepted changes to plans, positioning, channels, content clusters, and experiments.",
    icon: Target,
    collection: "strategyAdjustments"
  },
  {
    id: "capabilities",
    label: "Capabilities",
    description: "Registered VGOS kernel capabilities, dependencies, inputs, outputs, and operating status.",
    icon: Sparkles
  },
  {
    id: "opportunityQueue",
    label: "Opportunity Queue",
    description: "Unified queue across questions, pain, content, authority, experiments, and recommendations.",
    icon: Target
  },
  {
    id: "recommendedActions",
    label: "Recommended Actions",
    description: "Action queue with completion and task conversion.",
    icon: Sparkles,
    collection: "recommendedActions"
  },
  {
    id: "intelligenceEngine",
    label: "Intelligence Engine",
    description: "Observations, insights, hypotheses, experiments, and outcomes.",
    icon: BrainCircuit
  },
  {
    id: "contentEngine",
    label: "Content Engine",
    description: "Content assets needing creation, publishing, refresh, and internal links.",
    icon: CheckCircle2,
    collection: "contentAssets"
  },
  {
    id: "authorityEngine",
    label: "Authority Engine",
    description: "Directory submissions, backlinks, and authority actions.",
    icon: FlaskConical
  },
  {
    id: "searchEngine",
    label: "Search Engine",
    description: "Questions and keyword opportunities for SEO, AEO, and GEO.",
    icon: UsersRound,
  },
  {
    id: "productEngine",
    label: "Product Engine",
    description: "Pain points, feature requests, and product feedback.",
    icon: Lightbulb
  },
  {
    id: "knowledgeGraph",
    label: "Knowledge Graph",
    description: "Nodes and relationships connecting evidence, assets, entities, and actions.",
    icon: Network,
    collection: "knowledgeNodes"
  }
];

const personas: Persona[] = [
  ["Creator", "Creator Economy", "Wants faster idea-to-video workflows"],
  ["Agency", "Marketing Services", "Needs scalable client video production"],
  ["Educator", "Education", "Needs lessons and explainers from curriculum"],
  ["Ecommerce Brand", "Ecommerce", "Needs product pages converted into product videos"],
  ["SaaS Team", "SaaS", "Needs feature and onboarding videos at product speed"],
  ["Enterprise Marketing Team", "Enterprise Marketing", "Needs governed video production intelligence"],
  ["Affiliate Marketer", "Affiliate Marketing", "Needs landing-page and review content turned into videos"]
].map(([name, industry, buyingIntent], index) => ({
  id: `persona-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name,
  description: `${name} persona for VidMaker Growth OS.`,
  industry,
  buyingIntent,
  primaryPainPoint:
    "Needs useful, coherent video output from existing source material without slow manual production loops.",
  contentNeeds:
    "Proof-led demos, workflow examples, answer-ready explainers, and channel-specific production guidance.",
  ...scoped(index)
}));

const observations: Observation[] = [
  "Several Product Hunt and LinkedIn comments focused on whether VidMaker can transform URLs and product pages into coherent finished videos.",
  "LinkedIn commenters asked for proof clips before trusting URL-to-video claims.",
  "Reddit discussions complain that AI video tools still require too much manual cleanup.",
  "X posts around AI video launches get more engagement when demos show source-to-output flow.",
  "YouTube creators search for repeatable production systems, not one-off generation prompts.",
  "AI directories describe most tools as generators, leaving room for workflow intelligence positioning.",
  "Competitor reviews praise templates but criticize lack of source understanding.",
  "Hacker News discussions are skeptical of AI video unless the tool proves control and coherence.",
  "Indie Hackers threads mention landing pages and launch pages as reusable video inputs.",
  "Product Hunt comments ask whether VidMaker can preserve product accuracy when generating videos."
].map((rawText, index) => {
  const platforms = [
    "Product Hunt",
    "LinkedIn",
    "Reddit",
    "X",
    "YouTube",
    "Directories",
    "Competitor Reviews",
    "Hacker News",
    "Indie Hackers",
    "Product Hunt"
  ];
  return {
    id: `observation-${String(index + 1).padStart(2, "0")}`,
    title: rawText.slice(0, 82),
    source: platforms[index],
    sourceUrl: "https://vidmaker.com",
    rawText,
    summary: rawText,
    platform: platforms[index],
    sentiment: index === 2 || index === 6 ? "negative" : index === 1 || index === 7 ? "neutral" : "positive",
    confidenceScore: Number((0.72 + index * 0.02).toFixed(2)),
    ...scoped(index)
  };
});

const insights: Insight[] = [
  [
    "insight-url-to-video-trust",
    "Users are highly interested in URL-to-video and product-page-to-video workflows, but they want proof of output quality and coherence.",
    "VidMaker should make quality proof central to BOFU content and onboarding."
  ],
  [
    "insight-workflow-positioning",
    "Workflow intelligence is a stronger wedge than generic AI video generation.",
    "Position around Video Production Intelligence and governed production workflows."
  ],
  [
    "insight-cleanup-objection",
    "Manual cleanup is the clearest objection against AI video tools.",
    "Product and content should show source traceability, review controls, and editable output logic."
  ],
  [
    "insight-demo-led-conversion",
    "Demo-led distribution earns more trust than abstract feature claims.",
    "Campaigns should publish source-to-output examples across community and owned channels."
  ],
  [
    "insight-directory-category-gap",
    "Directories under-describe workflow intelligence, creating an authority gap.",
    "Directory submissions should introduce VidMaker as a Video Production Intelligence system."
  ]
].map(([id, summary, strategicImplication], index) => ({
  id,
  title: summary,
  summary,
  strategicImplication,
  evidence: observations[index]?.summary ?? "Cross-channel evidence",
  confidenceScore: Number((0.78 + index * 0.03).toFixed(2)),
  observationId: observations[index]?.id,
  ...scoped(index)
}));

const hypotheses: Hypothesis[] = [
  [
    "hypothesis-product-page-demo-trust",
    "Publishing product-page-to-video demos will increase trust and improve trial conversion.",
    "Trial conversion improves when visitors see coherent outputs from real source pages.",
    "trial_conversion_rate"
  ],
  [
    "hypothesis-category-definition",
    "Defining Video Production Intelligence will improve AEO/GEO recall for VidMaker.",
    "Answer engines and searchers associate VidMaker with the category.",
    "branded_category_mentions"
  ],
  [
    "hypothesis-cleanup-proof",
    "Showing editable source traceability will reduce manual cleanup objections.",
    "Demo viewers understand how VidMaker preserves control.",
    "demo_completion_rate"
  ],
  [
    "hypothesis-community-replies",
    "Helpful community replies with demos will create qualified traffic.",
    "Community traffic and assisted signups increase from targeted threads.",
    "community_assisted_trials"
  ],
  [
    "hypothesis-directory-language",
    "Directory listings that introduce workflow intelligence will produce better authority signals.",
    "Directory backlinks and mentions reinforce the right category language.",
    "qualified_backlinks"
  ]
].map(([id, statement, expectedOutcome, relatedMetric], index) => ({
  id,
  title: statement,
  statement,
  expectedOutcome,
  relatedMetric,
  confidenceScore: Number((0.7 + index * 0.04).toFixed(2)),
  status: (index === 0 ? "IN_PROGRESS" : "RESEARCHING") as Status,
  insightId: insights[index]?.id,
  ...scoped(index)
}));

const experiments: Experiment[] = [
  [
    "experiment-product-page-demo-series",
    "Create and publish 3 product-page-to-video examples across LinkedIn, X, Product Hunt update, and VidMaker blog.",
    "LinkedIn, X, Product Hunt, Blog"
  ],
  ["experiment-vpi-definition", "Publish category definition package for Video Production Intelligence.", "Blog + FAQ"],
  ["experiment-source-traceability-demo", "Add source traceability section to demo videos and landing pages.", "Landing Page"],
  ["experiment-community-reply-sprint", "Reply to 20 relevant community conversations with useful examples.", "Community"],
  ["experiment-directory-category-copy", "Submit directory listings with workflow-intelligence positioning.", "Directories"]
].map(([id, description, channel], index) => ({
  id,
  title: description,
  description,
  channel,
  hypothesisId: hypotheses[index]?.id,
  startDate: daysFromNow(index),
  endDate: daysFromNow(index + 14),
  successMetric: index === 0 ? "trial_conversion_rate" : "qualified_signal_count",
  result: index === 0 ? "" : "Pending",
  status: (index === 0 ? "IN_PROGRESS" : "NOT_STARTED") as Status,
  ...scoped(index)
}));

const entities: Entity[] = [
  ["VidMaker", "Brand", 100],
  ["VidMaker Labs", "Organization", 84],
  ["Video Production Intelligence", "Category", 98],
  ["Purpose-Specific AI", "Concept", 92],
  ["Purpose Engines", "Concept", 90],
  ["AI Video Production", "Category", 88],
  ["Video Workflow Automation", "Workflow", 86],
  ["Product Page to Video", "Use Case", 94],
  ["Blog to Video", "Use Case", 80],
  ["4K Video Production", "Capability", 72]
].map(([name, type, importanceScore], index) => ({
  id: `entity-${String(name).toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name: String(name),
  title: String(name),
  description: `${name} is tracked in VidMaker's GEO and authority graph.`,
  source: "Sprint 3 entity foundation",
  url: "https://vidmaker.com",
  status: "RESEARCHING" as Status,
  priority: (Number(importanceScore) >= 90 ? "CRITICAL" : "HIGH") as Priority,
  owner: "GEO Strategy",
  type: String(type),
  aliases: [String(name)],
  synonyms: [`${name} workflow`],
  canonicalUrl: `https://vidmaker.com/${String(name).toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  importanceScore: Number(importanceScore),
  entityOwner: "GEO Strategy",
  notes: `${name} should be consistently represented across content, schema, directories, and answer engines.`,
  ...scoped(index)
}));

const keywords: Keyword[] = [
  ["Video Production Intelligence", "INFORMATIONAL", "TOFU", "CRITICAL"],
  ["Purpose-Specific AI", "INFORMATIONAL", "TOFU", "HIGH"],
  ["AI video production", "COMMERCIAL", "MOFU", "CRITICAL"],
  ["video workflow automation", "COMMERCIAL", "MOFU", "HIGH"],
  ["product page to video", "TRANSACTIONAL", "BOFU", "CRITICAL"]
].map(([name, intent, funnelStage, priority], index) => ({
  id: `keyword-${String(name).toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name,
  title: name,
  description: `${name} is tracked for SEO, AEO, and opportunity scoring.`,
  source: "VidMaker keyword strategy",
  url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
  status: "RESEARCHING" as Status,
  priority: priority as Priority,
  owner: "SEO Strategy",
  intent: intent as Intent,
  funnelStage: funnelStage as FunnelStage,
  ...scoped(index)
}));

const communities: Community[] = [
  "Reddit",
  "LinkedIn",
  "X",
  "Product Hunt",
  "Hacker News",
  "Indie Hackers",
  "YouTube"
].map((name, index) => ({
  id: `community-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name,
  title: name,
  description: `${name} is monitored for VidMaker market signals.`,
  source: "Community intelligence map",
  url: "https://vidmaker.com",
  status: "LIVE" as Status,
  priority: "HIGH" as Priority,
  owner: "Community Intelligence",
  ...scoped(index)
}));

const competitors: Competitor[] = [
  "Synthesia",
  "HeyGen",
  "InVideo",
  "VEED",
  "Pictory",
  "Descript",
  "Canva"
].map((name, index) => ({
  id: `competitor-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  name,
  title: name,
  description: `${name} is monitored for positioning, complaints, SEO motion, and workflow gaps.`,
  source: "Competitor watchlist",
  url: "https://vidmaker.com",
  status: "RESEARCHING" as Status,
  priority: (index < 2 ? "HIGH" : "MEDIUM") as Priority,
  owner: "Competitive Intelligence",
  ...scoped(index)
}));

const questions: Question[] = [
  {
    id: "question-product-page-to-video",
    title: "How do you turn a product page into a video?",
    description: "High-intent AEO question tied to URL-to-video and product-page-to-video workflows.",
    source: "Conversation Intelligence",
    url: "https://vidmaker.com/product-page-to-video",
    status: "RESEARCHING",
    priority: "CRITICAL",
    owner: "AEO Strategy",
    intent: "TRANSACTIONAL",
    funnelStage: "BOFU",
    searchVolumeEstimate: 900,
    businessValueScore: 9,
    painSeverityScore: 9,
    competitionScore: 4,
    trendScore: 8,
    authorityGapScore: 9,
    opportunityScore: score(9, 9, 8, 9, 4),
    conversationId: "conversation-url-to-video-demand",
    personaIds: ["persona-ecommerce-brand", "persona-saas-team", "persona-agency"],
    contentAssetIds: ["content-blog-004"],
    ...scoped(0)
  },
  {
    id: "question-video-production-intelligence",
    title: "What is Video Production Intelligence?",
    description: "Category-definition question for answer engines and VidMaker-owned language.",
    source: "GEO Entity Tracker",
    url: "https://vidmaker.com/video-production-intelligence",
    status: "RESEARCHING",
    priority: "CRITICAL",
    owner: "GEO Strategy",
    intent: "INFORMATIONAL",
    funnelStage: "TOFU",
    searchVolumeEstimate: 260,
    businessValueScore: 8,
    painSeverityScore: 7,
    competitionScore: 3,
    trendScore: 8,
    authorityGapScore: 10,
    opportunityScore: score(8, 7, 8, 10, 3),
    conversationId: "conversation-url-to-video-demand",
    personaIds: ["persona-saas-team", "persona-agency"],
    contentAssetIds: ["content-blog-002", "content-blog-003"],
    ...scoped(1)
  },
  {
    id: "question-purpose-specific-ai",
    title: "Why should video teams use purpose-specific AI?",
    description: "MOFU question contrasting workflow-specific AI systems with generic video generators.",
    source: "AEO Question Bank",
    url: "https://vidmaker.com/purpose-specific-ai",
    status: "RESEARCHING",
    priority: "HIGH",
    owner: "AEO Strategy",
    intent: "COMMERCIAL",
    funnelStage: "MOFU",
    searchVolumeEstimate: 320,
    businessValueScore: 7,
    painSeverityScore: 7,
    competitionScore: 4,
    trendScore: 7,
    authorityGapScore: 8,
    opportunityScore: score(7, 7, 7, 8, 4),
    personaIds: ["persona-saas-team", "persona-enterprise-marketing-team"],
    contentAssetIds: ["content-blog-003"],
    ...scoped(2)
  }
];

const painPoints: PainPoint[] = [
  {
    id: "painpoint-output-coherence-proof",
    title: "Users want proof that URL-to-video output is coherent",
    description: "Prospects are interested in URL-to-video, but need proof that the finished video is coherent, brand-safe, and useful without heavy cleanup.",
    source: "Product Hunt and LinkedIn comments",
    url: "https://vidmaker.com",
    status: "RESEARCHING",
    priority: "CRITICAL",
    owner: "Product Intelligence",
    searchVolumeEstimate: 700,
    businessValueScore: 9,
    painSeverityScore: 10,
    competitionScore: 4,
    trendScore: 8,
    authorityGapScore: 8,
    opportunityScore: score(9, 10, 8, 8, 4),
    conversationId: "conversation-url-to-video-demand",
    competitorId: "competitor-synthesia",
    personaIds: ["persona-ecommerce-brand", "persona-saas-team", "persona-agency"],
    featureRequestIds: ["feature-url-to-video-proof-mode"],
    ...scoped(0)
  },
  {
    id: "painpoint-template-first-workflow",
    title: "Template-first tools do not understand campaign purpose",
    description: "Template-first video workflows help teams start quickly but do not translate source URLs into campaign-specific video logic.",
    source: "Competitor positioning audit",
    url: "https://vidmaker.com",
    status: "RESEARCHING",
    priority: "HIGH",
    owner: "Product Intelligence",
    searchVolumeEstimate: 420,
    businessValueScore: 7,
    painSeverityScore: 7,
    competitionScore: 5,
    trendScore: 7,
    authorityGapScore: 7,
    opportunityScore: score(7, 7, 7, 7, 5),
    competitorId: "competitor-canva",
    personaIds: ["persona-agency", "persona-ecommerce-brand"],
    featureRequestIds: [],
    ...scoped(1)
  }
];

const contentAssets: ContentAsset[] = [
  ["content-blog-002", "BLOG-002", "What Is Video Production Intelligence?", "question-video-production-intelligence"],
  ["content-blog-003", "BLOG-003", "Purpose-Specific AI for Video Teams", "question-purpose-specific-ai"],
  ["content-blog-004", "BLOG-004", "How to Turn a Product Page Into a Video", "question-product-page-to-video"]
].map(([id, code, title, questionId], index) => ({
  id,
  code,
  title,
  description: `${title} connects answer demand, keywords, entities, and campaign execution.`,
  source: "Content Engine",
  url: `https://vidmaker.com/blog/${code.toLowerCase()}`,
  status: "IN_PROGRESS" as Status,
  priority: (code === "BLOG-003" ? "HIGH" : "CRITICAL") as Priority,
  owner: "Content",
  contentType: "BLOG" as ContentType,
  intent: (code === "BLOG-004" ? "TRANSACTIONAL" : "INFORMATIONAL") as Intent,
  funnelStage: (code === "BLOG-004" ? "BOFU" : "TOFU") as FunnelStage,
  personaIds: ["persona-ecommerce-brand", "persona-saas-team", "persona-agency"],
  questionIds: [questionId],
  keywordIds: code === "BLOG-004" ? ["keyword-product-page-to-video", "keyword-ai-video-production"] : ["keyword-video-production-intelligence"],
  entityIds: ["entity-vidmaker", "entity-video-production-intelligence"],
  campaignIds: ["campaign-product-page-to-video-proof"],
  ...scoped(index)
}));

const knowledgeNodes: KnowledgeNode[] = [
  "VidMaker",
  "Video Production Intelligence",
  "Purpose-Specific AI",
  "Purpose Engines",
  "AI Video Production",
  "Product Page to Video",
  "Blog to Video",
  "URL-to-video demand",
  "Output coherence proof",
  "How do you turn a product page into a video?",
  "What is Video Production Intelligence?",
  "BLOG-002",
  "BLOG-003",
  "BLOG-004",
  "Video Production Intelligence keyword",
  "Product page to video keyword",
  "Synthesia",
  "Canva",
  "URL-to-video proof mode",
  "Product Page to Video Proof Sprint"
].map((label, index) => ({
  id: `node-${String(index + 1).padStart(2, "0")}`,
  label,
  type:
    index < 7
      ? "Entity"
      : index < 9
        ? "Signal"
        : index < 11
          ? "Question"
          : index < 14
            ? "ContentAsset"
            : index < 16
              ? "Keyword"
              : index < 18
                ? "Competitor"
                : index === 18
                  ? "FeatureRequest"
                  : "Campaign",
  description: `${label} is represented in the VidMaker growth intelligence graph.`,
  sourceType: "Sprint3Seed",
  sourceId: label.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  ...scoped(index)
}));

const edgeTypes: RelationshipType[] = [
  "ANSWERS",
  "INSPIRES",
  "SUPPORTS",
  "CONTRADICTS",
  "LINKS_TO",
  "TARGETS",
  "GENERATED_FROM",
  "RELATED_TO",
  "COMPETES_WITH",
  "MENTIONS"
];

const knowledgeEdges: KnowledgeEdge[] = Array.from({ length: 30 }, (_, index) => ({
  id: `edge-${String(index + 1).padStart(2, "0")}`,
  fromNodeId: knowledgeNodes[index % knowledgeNodes.length].id,
  toNodeId: knowledgeNodes[(index + 3) % knowledgeNodes.length].id,
  relationshipType: edgeTypes[index % edgeTypes.length],
  strength: Number((0.52 + index * 0.01).toFixed(2)),
  notes: `Sprint 3 relationship ${index + 1}.`,
  ...scoped(index)
}));

const aiRecommendations: AIRecommendation[] = [
  ["BLOG_IDEA", "ContentAsset", "content-blog-004", "Add proof-first examples to BLOG-004"],
  ["FOUNDER_POST", "Insight", "insight-url-to-video-trust", "Publish founder narrative about coherent URL-to-video workflows"],
  ["COMPANY_POST", "Campaign", "campaign-product-page-to-video-proof", "Announce the proof sprint with source-to-output demos"],
  ["X_THREAD", "Question", "question-product-page-to-video", "Turn the product-page-to-video workflow into an X thread"],
  ["PINTEREST_PIN", "ContentAsset", "content-blog-004", "Create visual pin for product-page-to-video use cases"],
  ["FAQ", "Question", "question-video-production-intelligence", "Add FAQ answer blocks for Video Production Intelligence"],
  ["LANDING_PAGE", "Entity", "entity-product-page-to-video", "Create product-page-to-video landing page"],
  ["FEATURE_REQUEST", "PainPoint", "painpoint-output-coherence-proof", "Prioritize URL-to-video proof mode"],
  ["DIRECTORY_SUBMISSION", "DirectorySubmission", "directory-ai-video-tools", "Submit VidMaker with workflow-intelligence positioning"],
  ["BACKLINK_OUTREACH", "ContentAsset", "content-blog-002", "Pitch Video Production Intelligence definition to AI workflow newsletters"]
].map(([recommendationType, targetEntityType, targetEntityId, title], index) => ({
  id: `ai-rec-${String(index + 1).padStart(2, "0")}`,
  title,
  description: `${title} is generated from intelligence signals, opportunity scores, and graph context.`,
  source: "AI Recommendation Engine",
  url: "https://vidmaker.com",
  status: "RESEARCHING" as Status,
  priority: (index < 4 ? "CRITICAL" : "HIGH") as Priority,
  owner: "Growth Intelligence",
  recommendationType: recommendationType as RecommendationType,
  targetEntityType,
  targetEntityId,
  suggestedAction: title,
  reasoning:
    "Market observations, opportunity scores, and knowledge graph relationships indicate this action can improve growth outcomes.",
  confidenceScore: Number((0.74 + index * 0.02).toFixed(2)),
  generatedBy: "VGOS Intelligence Engine",
  ...scoped(index)
}));

const intelligenceObjects: IntelligenceObject[] = [
  {
    id: "intelligence-product-page-to-video-demo",
    sourceType: "Question",
    sourceId: "question-product-page-to-video",
    summary: "Can VidMaker take a product page URL and turn it into a ready-to-post video?",
    detectedEntities: ["VidMaker", "Product Page to Video"],
    detectedKeywords: ["product page URL", "product page to video", "ready-to-post video"],
    detectedIntent: "COMMERCIAL",
    detectedPersona: "Ecommerce Brand",
    detectedPainPoints: ["Need automated product video creation"],
    sentiment: "curious/high-intent",
    opportunityScore: 92,
    confidenceScore: 0.91,
    reasoning:
      "Commercial Investigation: ecommerce teams want proof that VidMaker can transform a product page URL into a finished product video. The highest-value next action is to create a product-page-to-video demo.",
    ...scoped(0)
  },
  {
    id: "intelligence-manual-cleanup-objection",
    sourceType: "Observation",
    sourceId: "observation-03",
    summary: "Reddit discussions complain that AI video tools still require too much manual cleanup.",
    detectedEntities: ["VidMaker"],
    detectedKeywords: ["AI video production", "video workflow automation"],
    detectedIntent: "COMMUNITY_DISCUSSION",
    detectedPersona: "Creator",
    detectedPainPoints: ["AI video output requires too much manual cleanup"],
    sentiment: "negative",
    opportunityScore: 78,
    confidenceScore: 0.84,
    reasoning:
      "Community discussion shows a recurring cleanup objection that VidMaker can answer with workflow automation proof and source traceability.",
    ...scoped(2)
  },
  {
    id: "intelligence-video-production-intelligence-definition",
    sourceType: "Question",
    sourceId: "question-video-production-intelligence",
    summary: "What is Video Production Intelligence?",
    detectedEntities: ["VidMaker", "Video Production Intelligence", "Purpose-Specific AI"],
    detectedKeywords: ["Video Production Intelligence", "Purpose-Specific AI", "AI video production"],
    detectedIntent: "INFORMATIONAL",
    detectedPersona: "SaaS Team",
    detectedPainPoints: ["Need clearer VidMaker answer, proof, or workflow guidance"],
    sentiment: "neutral",
    opportunityScore: 84,
    confidenceScore: 0.88,
    reasoning:
      "Informational category-definition demand gives VidMaker a chance to own entity language across SEO, AEO, and GEO surfaces.",
    ...scoped(1)
  }
];

const memories: Memory[] = ([
  ["Product-page-to-video demand", "Product Page to Video", "Prospects repeatedly ask whether VidMaker can transform product pages and URLs into finished videos.", 8, 0.92, 96],
  ["Video Production Intelligence category ownership", "Video Production Intelligence", "VidMaker should remember that category ownership is a recurring SEO, AEO, and GEO opportunity.", 7, 0.9, 94],
  ["Purpose-Specific AI curiosity", "Purpose-Specific AI", "Users and answer engines need a sharper distinction between purpose-specific AI and generic generation.", 5, 0.84, 86],
  ["Product Hunt launch feedback", "Product Hunt", "Launch comments ask for concrete examples and product proof after seeing VidMaker positioning.", 6, 0.83, 88],
  ["Need for real product demos", "Product Page to Video", "The strongest trust signal is a demo that shows source material becoming a finished ready-to-post video.", 9, 0.91, 97],
  ["Generic AI video output complaints", "AI Video Production", "Communities complain that generic AI video output needs too much cleanup and lacks coherent workflow logic.", 7, 0.86, 89],
  ["Ecommerce brands needing product video automation", "Ecommerce Brand", "Ecommerce teams want product videos created from existing product pages without manual production loops.", 6, 0.88, 92],
  ["Directory authority gap", "Authority", "Directory submissions are needed to reinforce VidMaker across AI tool, video production, and workflow-intelligence surfaces.", 4, 0.78, 81],
  ["4K quality proof concern", "4K Video Production", "Audience skepticism exists around claims like 4K unless proof and output control are shown clearly.", 3, 0.72, 74],
  ["Workflow positioning resonance", "Video Workflow Automation", "Audience responds better to workflow positioning than one-off text-to-video generation claims.", 5, 0.82, 84]
] as const).map(([topic, entity, summary, frequency, confidenceScore, importanceScore], index) => ({
  id: `memory-${String(index + 1).padStart(2, "0")}`,
  topic,
  entity,
  summary,
  sourceTypes: index % 2 === 0 ? ["Observation", "Question"] : ["Pattern", "Insight"],
  linkedSourceIds: index % 2 === 0 ? ["observation-01", "question-product-page-to-video"] : ["insight-workflow-positioning", "content-blog-004"],
  firstSeen: daysAgo(index + 14),
  lastSeen: daysAgo(index),
  frequency,
  confidenceScore,
  importanceScore,
  status: "RESEARCHING" as Status,
  ...scoped(index)
}));

const patterns: Pattern[] = ([
  ["Users ask for example outputs after seeing launch announcement.", "RECURRING_QUESTION", "Product Page to Video", "RISING", 8, 0.91, 96],
  ["Repeated concern about generic AI video tools needing cleanup.", "COMPETITOR_COMPLAINT", "AI Video Production", "RISING", 7, 0.87, 90],
  ["Opportunity to own Video Production Intelligence.", "GEO_OPPORTUNITY", "Video Production Intelligence", "RISING", 6, 0.9, 95],
  ["Need for demo content after Product Hunt launch.", "CONTENT_GAP", "Product Hunt", "RISING", 6, 0.84, 88],
  ["Audience responds well to workflow positioning.", "PRODUCT_DEMAND", "Video Workflow Automation", "STABLE", 5, 0.82, 84],
  ["Directory submissions are needed for authority and AI visibility.", "AUTHORITY_OPPORTUNITY", "Authority", "RISING", 4, 0.78, 82],
  ["Purpose-Specific AI needs answer-ready FAQ coverage.", "AEO_OPPORTUNITY", "Purpose-Specific AI", "STABLE", 4, 0.8, 80],
  ["Concern exists around 4K quality versus 4K label.", "PRODUCT_DEMAND", "4K Video Production", "STABLE", 3, 0.72, 73]
] as const).map(([title, patternType, relatedEntity, trendDirection, frequency, confidenceScore, importanceScore], index) => ({
  id: `pattern-${String(index + 1).padStart(2, "0")}`,
  title,
  description: title,
  patternType: patternType as PatternType,
  relatedEntity,
  evidence: { memoryIds: memories.slice(0, 3).map((memory) => memory.id) },
  frequency,
  trendDirection: trendDirection as TrendDirection,
  confidenceScore,
  importanceScore,
  status: "RESEARCHING" as Status,
  ...scoped(index)
}));

const objectives: Objective[] = ([
  ["objective-own-vpi", "Own Video Production Intelligence category.", "Establish VidMaker as the authority for Video Production Intelligence.", "GEO", "CRITICAL"],
  ["objective-authority", "Increase external authority through directories and backlinks.", "Submit VidMaker to authority surfaces and convert listings into backlinks.", "AUTHORITY", "HIGH"],
  ["objective-product-hunt", "Convert Product Hunt launch interest into demos, content, and signups.", "Turn launch comments into proof assets and conversion paths.", "REVENUE", "CRITICAL"],
  ["objective-aeo-geo", "Build AEO/GEO visibility around Purpose-Specific AI and product-page-to-video.", "Create answer-ready assets for core VidMaker entities and use cases.", "AEO", "HIGH"],
  ["objective-demo-assets", "Create 3 demo assets from real product pages.", "Use real product pages to prove VidMaker output quality and workflow intelligence.", "CONTENT", "CRITICAL"]
] as const).map(([id, title, description, category, priority], index) => ({
  id,
  title,
  description,
  category: category as ObjectiveCategory,
  priority: priority as Priority,
  status: "IN_PROGRESS" as Status,
  startDate: daysAgo(7),
  endDate: daysFromNow(23 + index),
  ...scoped(index)
}));

const keyResults: KeyResult[] = ([
  ["kr-vpi-articles", "Publish 10 authority articles in 30 days.", "articles_published", 10, 3, "objective-own-vpi"],
  ["kr-vpi-entity-pages", "Create 4 entity-owned pages.", "entity_pages_live", 4, 1, "objective-own-vpi"],
  ["kr-directory-submissions", "Submit VidMaker to 25 directories in 30 days.", "directories_submitted", 25, 4, "objective-authority"],
  ["kr-backlinks", "Secure 10 live backlinks.", "live_backlinks", 10, 1, "objective-authority"],
  ["kr-launch-demos", "Publish 3 launch demo assets.", "demo_assets_live", 3, 1, "objective-product-hunt"],
  ["kr-signups", "Generate 50 qualified signups from launch traffic.", "qualified_signups", 50, 12, "objective-product-hunt"],
  ["kr-aeo-faqs", "Create 20 AEO-ready FAQ answers.", "faq_answers_live", 20, 5, "objective-aeo-geo"],
  ["kr-geo-mentions", "Increase answer-engine entity mentions.", "entity_mentions", 15, 3, "objective-aeo-geo"],
  ["kr-real-product-pages", "Process 3 real product pages into demos.", "real_product_page_demos", 3, 1, "objective-demo-assets"],
  ["kr-demo-distribution", "Distribute demo assets across 4 channels.", "channels_distributed", 4, 1, "objective-demo-assets"]
] as const).map(([id, title, metricName, targetValue, currentValue, objectiveId], index) => ({
  id,
  objectiveId,
  title,
  metricName,
  targetValue,
  currentValue,
  status: currentValue >= targetValue ? "LIVE" : "IN_PROGRESS",
  createdAt: daysAgo(index + 4),
  updatedAt: daysAgo(index)
}));

const agents: Agent[] = ([
  ["Conversation Agent", "CONVERSATION_AGENT", "Convert comments, questions, and community threads into memories, patterns, and actions.", ["Conversation", "Observation"], ["Memory", "Pattern", "RecommendedAction"]],
  ["Content Agent", "CONTENT_AGENT", "Find content gaps and propose answer-ready content assets.", ["Question", "Pattern", "Keyword"], ["AIRecommendation", "RecommendedAction"]],
  ["Authority Agent", "AUTHORITY_AGENT", "Find directory, backlink, and authority-building actions.", ["DirectorySubmission", "Backlink", "Pattern"], ["RecommendedAction", "Event"]],
  ["AEO Agent", "AEO_AGENT", "Turn recurring questions into FAQ, answer blocks, and entity coverage.", ["Question", "Entity", "Memory"], ["AIRecommendation", "ReasoningTrace"]],
  ["Product Agent", "PRODUCT_AGENT", "Convert pain patterns into feature requests and product proof actions.", ["PainPoint", "Pattern", "Competitor"], ["FeatureRequest", "RecommendedAction"]]
] as const).map(([name, agentType, mission, inputSources, outputTypes], index) => ({
  id: `agent-${String(index + 1).padStart(2, "0")}`,
  name,
  title: name,
  description: `${name} is part of the VGOS Intelligence Kernel.`,
  agentType: agentType as AgentType,
  status: "LIVE" as Status,
  mission,
  inputSources: [...inputSources],
  outputTypes: [...outputTypes],
  parentAgentId: index === 0 ? undefined : "agent-01",
  dependsOnAgentIds: index === 0 ? [] : ["agent-01"],
  handoffRules: { handoffWhen: index === 2 ? "content_needs_backlinks" : "output_created" },
  allowedWorkflowIds: ["workflow-product-hunt-demo", "workflow-question-aeo", "workflow-memory-pattern"],
  lastRunAt: daysAgo(index),
  ...scoped(index)
}));

const agentRuns: AgentRun[] = agents.map((agent, index) => ({
  id: `agent-run-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  agentId: agent.id,
  status: index === 0 ? "IN_PROGRESS" : "COMPLETED",
  inputSummary: `${agent.name} reviewed VidMaker kernel signals.`,
  outputSummary: `${agent.name} produced rule-based memory, pattern, reasoning, and action outputs.`,
  recommendationsCreated: index + 1,
  actionsCreated: index + 2,
  startedAt: daysAgo(index + 1),
  completedAt: index === 0 ? undefined : daysAgo(index),
  logs: ["Loaded workspace-scoped signals.", "Matched signals to memory and pattern rules.", "Produced recommendations and reasoning traces."]
}));

const reasoningTraces: ReasoningTrace[] = Array.from({ length: 10 }, (_, index) => ({
  id: `reasoning-trace-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  sourceType: index < 5 ? "Pattern" : "Memory",
  sourceId: index < 5 ? patterns[index % patterns.length].id : memories[index % memories.length].id,
  inputSummary:
    index === 0
      ? "Several launch comments ask whether VidMaker can transform product pages into finished videos."
      : `Kernel trace ${index + 1} explains a VidMaker growth decision.`,
  reasoningSteps: [
    "Multiple comments reference product pages and URLs.",
    "Product page to video is a commercial use case.",
    "Product proof would increase trust.",
    "A demo can support SEO, Product Hunt, LinkedIn, and Pinterest."
  ],
  conclusion:
    index === 0
      ? "Create a product-page-to-video demo and publish it across channels."
      : "Prioritize the highest-confidence action tied to recurring VidMaker demand.",
  confidenceScore: Number((0.78 + index * 0.015).toFixed(2)),
  recommendedActionIds: [`kernel-action-${String((index % 15) + 1).padStart(2, "0")}`],
  createdAt: daysAgo(index)
}));

const knowledgeObjectSeeds = [
  ["KO-VIDMAKER", "ENTITY", "VidMaker", "VidMaker is the Growth Intelligence and video production platform being operated in VGOS.", "Entity", "entity-vidmaker", ["VidMaker AI"], ["brand", "platform"], 100, 0.98],
  ["KO-VIDEO-PRODUCTION-INTELLIGENCE", "ENTITY", "Video Production Intelligence", "VidMaker category language for production-aware AI video workflows.", "Entity", "entity-video-production-intelligence", ["VPI"], ["category", "geo"], 98, 0.94],
  ["KO-PURPOSE-SPECIFIC-AI", "ENTITY", "Purpose-Specific AI", "Workflow-specific AI concept for focused video production systems.", "Entity", "entity-purpose-specific-ai", ["workflow-specific AI"], ["category", "aeo"], 92, 0.9],
  ["KO-BLOG-002", "CONTENT_ASSET", "BLOG-002", "What Is Video Production Intelligence?", "ContentAsset", "content-blog-002", ["VPI article"], ["blog", "seo"], 88, 0.84],
  ["KO-BLOG-003", "CONTENT_ASSET", "BLOG-003", "Purpose-Specific AI for Video Teams.", "ContentAsset", "content-blog-003", ["Purpose-Specific AI article"], ["blog", "aeo"], 84, 0.82],
  ["KO-BLOG-004", "CONTENT_ASSET", "BLOG-004", "How to Turn a Product Page Into a Video.", "ContentAsset", "content-blog-004", ["Product Page to Video blog"], ["blog", "bofu"], 96, 0.9],
  ["KO-BLOG-005", "CONTENT_ASSET", "BLOG-005", "Why generic AI video tools still need cleanup.", "ContentAsset", "content-blog-005", ["Generic AI video complaints article"], ["blog", "comparison"], 86, 0.78],
  ["KO-PRODUCT-PAGE-TO-VIDEO", "ENTITY", "Product Page to Video", "VidMaker use case for turning product pages into ready-to-post videos.", "Entity", "entity-product-page-to-video", ["PDP to video", "URL to video"], ["use-case", "ecommerce"], 97, 0.93],
  ["KO-PRODUCT-HUNT-LAUNCH", "PRODUCT_SIGNAL", "Product Hunt Launch", "Launch feedback and comments from Product Hunt.", "Observation", "observation-product-hunt-comments", ["PH launch"], ["community", "launch"], 89, 0.82],
  ["KO-GENERIC-AI-VIDEO-COMPLAINTS", "PATTERN", "Generic AI Video Complaints", "Recurring complaints about cleanup and weak source understanding.", "Pattern", "pattern-02", ["cleanup complaints"], ["competitor", "pain"], 90, 0.87],
  ["KO-ECOMMERCE-BRAND", "PERSONA", "Ecommerce Brand", "Persona needing automated product video creation from product pages.", "Persona", "persona-ecommerce-brand", ["commerce team"], ["persona"], 91, 0.88],
  ["KO-AGENCY", "PERSONA", "Agency", "Persona needing scalable client video production.", "Persona", "persona-agency", ["marketing agency"], ["persona"], 78, 0.78],
  ["KO-CREATOR", "PERSONA", "Creator", "Persona needing faster idea-to-video workflows.", "Persona", "persona-creator", ["content creator"], ["persona"], 75, 0.76],
  ["KO-QUESTION-PRODUCT-PAGE", "QUESTION", "How do you turn a product page into a video?", "High-intent AEO question tied to product-page-to-video workflows.", "Question", "question-product-page-to-video", ["PDP video question"], ["question", "aeo"], 94, 0.89],
  ["KO-QUESTION-VPI", "QUESTION", "What is Video Production Intelligence?", "Category-definition question for answer engines.", "Question", "question-video-production-intelligence", ["VPI question"], ["question", "geo"], 93, 0.91],
  ["KO-KEYWORD-VPI", "KEYWORD", "Video Production Intelligence keyword", "Tracked keyword for category ownership.", "Keyword", "keyword-video-production-intelligence", ["VPI keyword"], ["keyword", "seo"], 82, 0.8],
  ["KO-KEYWORD-PRODUCT-PAGE", "KEYWORD", "product page to video keyword", "Tracked keyword for product-page-to-video demand.", "Keyword", "keyword-product-page-to-video", ["PDP video keyword"], ["keyword", "bofu"], 91, 0.86],
  ["KO-DIRECTORY-STRATEGY", "DIRECTORY", "Directory submission strategy", "Authority plan for VidMaker AI tool directories.", "DirectorySubmission", "directory-ai-video-tools", ["directory strategy"], ["authority"], 80, 0.76],
  ["KO-BACKLINK-DIRECTORY", "BACKLINK", "AI Video Tools backlink", "Backlink opportunity from AI video tools directory.", "Backlink", "backlink-ai-video-tools-directory", ["directory backlink"], ["authority"], 72, 0.72],
  ["KO-MEMORY-PRODUCT-PAGE", "MEMORY", "Product-page-to-video demand memory", "Recurring memory for product-page-to-video demand.", "Memory", "memory-01", ["product-page memory"], ["memory"], 95, 0.91],
  ["KO-PATTERN-EXAMPLES", "PATTERN", "Users ask for example outputs", "Pattern showing demo requests after launch.", "Pattern", "pattern-01", ["example output pattern"], ["pattern"], 94, 0.9],
  ["KO-OBJECTIVE-OWN-VPI", "OBJECTIVE", "Own Video Production Intelligence category", "Objective to establish VidMaker as category authority.", "Objective", "objective-own-vpi", ["VPI objective"], ["objective"], 96, 0.88],
  ["KO-FEATURE-PROOF-MODE", "FEATURE_REQUEST", "URL-to-video proof mode", "Feature request for traceable source-to-output proof.", "FeatureRequest", "feature-url-to-video-proof-mode", ["proof mode"], ["product"], 90, 0.84],
  ["KO-CAMPAIGN-PROOF-SPRINT", "CAMPAIGN", "Product Page to Video Proof Sprint", "Campaign to publish demos and proof-led content.", "Campaign", "campaign-product-page-to-video-proof", ["proof sprint"], ["campaign"], 92, 0.86],
  ["KO-EXPERIMENT-DEMO-SERIES", "EXPERIMENT", "Product-page demo series experiment", "Experiment testing demo distribution and trial conversion.", "Experiment", "experiment-product-page-demo-series", ["demo experiment"], ["experiment"], 78, 0.74]
] as const;

const knowledgeObjects: KnowledgeObject[] = knowledgeObjectSeeds.map(
  ([canonicalId, objectType, title, summary, sourceType, sourceId, aliases, tags, importanceScore, confidenceScore], index) => ({
    id: `ko-${String(index + 1).padStart(2, "0")}`,
    canonicalId,
    objectType: objectType as KnowledgeObjectType,
    title,
    summary,
    description: summary,
    sourceType,
    sourceId,
    canonicalEntityId: objectType === "ENTITY" ? `ko-${String(index + 1).padStart(2, "0")}` : undefined,
    aliases: [...aliases],
    tags: [...tags],
    metadata: { phase: "beta", seedIndex: index },
    searchableText: `${title} ${summary} ${aliases.join(" ")} ${tags.join(" ")}`,
    embeddingProvider: index < 10 ? "mock" : undefined,
    embeddingModel: index < 10 ? "keyword-similarity-v0" : undefined,
    embeddingVector: index < 10 ? [Number((importanceScore / 100).toFixed(2)), confidenceScore, Number((index / 25).toFixed(2))] : undefined,
    embeddingUpdatedAt: index < 10 ? daysAgo(0) : undefined,
    importanceScore,
    confidenceScore,
    status: "RESEARCHING" as Status,
    ...scoped(index)
  })
);

const relationshipTypes: KnowledgeRelationshipType[] = [
  "DEFINES",
  "SUPPORTS",
  "ANSWERS",
  "GENERATED_FROM",
  "SUPPORTS",
  "INSPIRES",
  "RELATED_TO",
  "LINKS_TO",
  "TARGETS",
  "MENTIONS",
  "IMPROVES",
  "VALIDATES"
];

const knowledgeRelationships: KnowledgeRelationship[] = Array.from({ length: 40 }, (_, index) => {
  const fixed = [
    ["ko-01", "ko-02", "DEFINES"],
    ["ko-03", "ko-02", "SUPPORTS"],
    ["ko-06", "ko-15", "ANSWERS"],
    ["ko-09", "ko-01", "GENERATED_FROM"],
    ["ko-08", "ko-11", "SUPPORTS"],
    ["ko-10", "ko-07", "INSPIRES"]
  ][index] as [string, string, KnowledgeRelationshipType] | undefined;
  const fromObjectId = fixed?.[0] ?? knowledgeObjects[index % knowledgeObjects.length].id;
  const toObjectId = fixed?.[1] ?? knowledgeObjects[(index + 3) % knowledgeObjects.length].id;
  const relationshipType = fixed?.[2] ?? relationshipTypes[index % relationshipTypes.length];
  return {
    id: `knowledge-rel-${String(index + 1).padStart(2, "0")}`,
    fromObjectId,
    toObjectId,
    relationshipType,
    strength: Number((0.52 + (index % 10) * 0.04).toFixed(2)),
    evidence: `Seeded Phase Beta relationship ${index + 1}.`,
    metadata: { phase: "beta" },
    ...scoped(index)
  };
});

const memorySnapshots: MemorySnapshot[] = ([
  ["memory-01", "June 2026", "Product-page-to-video demand increased after Product Hunt launch.", 8, 96, 0.92, "RISING"],
  ["memory-05", "June 2026", "More users asked for real examples and ready-to-post output proof.", 9, 97, 0.91, "RISING"],
  ["memory-06", "June 2026", "Generic AI video complaints continued around cleanup and source understanding.", 7, 89, 0.86, "STABLE"],
  ["memory-03", "June 2026", "Purpose-Specific AI curiosity remained steady around category education.", 5, 86, 0.84, "STABLE"],
  ["memory-08", "June 2026", "Directory authority became more important for AI visibility.", 4, 81, 0.78, "RISING"]
] as const).map(([memoryId, period, summary, frequency, importanceScore, confidenceScore, trendDirection], index) => ({
  id: `memory-snapshot-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  memoryId,
  period,
  summary,
  frequency,
  importanceScore,
  confidenceScore,
  trendDirection: trendDirection as TrendDirection,
  notableSources: ["Product Hunt", "LinkedIn", "Reddit"],
  createdAt: daysAgo(index)
}));

const workflows: Workflow[] = ([
  ["workflow-product-hunt-demo", "Product Hunt Comment to Demo Content Recommendation", "PRODUCT_HUNT_TO_DEMO_CONTENT", "EVENT"],
  ["workflow-question-aeo", "Question to AEO Blog Asset", "QUESTION_TO_AEO_ASSET", "MANUAL"],
  ["workflow-pain-feature", "Pain Point to Feature Request", "PAIN_POINT_TO_FEATURE_REQUEST", "EVENT"],
  ["workflow-competitor-content", "Competitor Complaint to Comparison Content", "COMPETITOR_COMPLAINT_TO_CONTENT", "AGENT"],
  ["workflow-memory-pattern", "Memory to Pattern Detection", "MEMORY_TO_PATTERN", "SCHEDULED"]
] as const).map(([id, name, workflowType, triggerType], index) => ({
  id,
  name,
  title: name,
  description: `${name} orchestrates Beta kernel outputs for VidMaker.`,
  workflowType,
  status: "LIVE" as Status,
  triggerType,
  triggerConfig: { mode: triggerType },
  ...scoped(index)
}));

const workflowStepTypes: WorkflowStepType[] = [
  "CLASSIFY",
  "EXTRACT_ENTITIES",
  "CREATE_MEMORY",
  "DETECT_PATTERN",
  "CREATE_REASONING_TRACE",
  "CREATE_RECOMMENDATION",
  "CREATE_ACTION",
  "LINK_KNOWLEDGE_OBJECTS",
  "NOTIFY_MISSION_CONTROL"
];

const workflowSteps: WorkflowStep[] = Array.from({ length: 20 }, (_, index) => ({
  id: `workflow-step-${String(index + 1).padStart(2, "0")}`,
  workflowId: workflows[index % workflows.length].id,
  order: (index % 4) + 1,
  name: `${formatEnum(workflowStepTypes[index % workflowStepTypes.length])} step`,
  stepType: workflowStepTypes[index % workflowStepTypes.length],
  config: { phase: "beta", order: (index % 4) + 1 },
  status: "PENDING",
  createdAt: daysAgo(index + 2),
  updatedAt: daysAgo(index)
}));

const workflowRuns: WorkflowRun[] = Array.from({ length: 10 }, (_, index) => ({
  id: `workflow-run-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  workflowId: workflows[index % workflows.length].id,
  status: (index === 2 ? "PENDING" : index === 3 ? "IN_PROGRESS" : "COMPLETED") as ActionStatus,
  triggerSourceType: index % 2 === 0 ? "Event" : "Manual",
  triggerSourceId: index % 2 === 0 ? `kernel-event-${String((index % 20) + 1).padStart(2, "0")}` : "manual-run",
  input: { phase: "beta", source: "seed" },
  output: { recommendationsCreated: index + 1, actionsCreated: index + 2 },
  startedAt: daysAgo(index + 1),
  completedAt: index === 3 ? undefined : daysAgo(index),
  logs: ["Workflow loaded trigger.", "Kernel services executed.", "Mission Control notified."]
}));

const agentHandoffs: AgentHandoff[] = Array.from({ length: 10 }, (_, index) => ({
  id: `agent-handoff-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  fromAgentId: agents[index % agents.length].id,
  toAgentId: agents[(index + 1) % agents.length].id,
  sourceType: index % 2 === 0 ? "Question" : "Pattern",
  sourceId: index % 2 === 0 ? "question-product-page-to-video" : "pattern-01",
  reason: "Conversation signal produced a downstream action opportunity.",
  status: (index < 4 ? "PENDING" : "COMPLETED") as ActionStatus,
  createdAt: daysAgo(index),
  completedAt: index < 4 ? undefined : daysAgo(index - 1)
}));

const plans: Plan[] = ([
  ["plan-vpi-authority", "30-Day Video Production Intelligence Authority Plan", "Build authority around Video Production Intelligence with proof-led content, internal links, and distribution.", "AUTHORITY_PLAN", "ACTIVE", "objective-own-vpi", 0, 30, "Growth", "VidMaker becomes more visible as the Video Production Intelligence category owner.", 0.84],
  ["plan-product-hunt-follow-up", "Product Hunt Follow-Up Plan", "Convert launch attention into demos, replies, founder posts, and learning loops.", "LAUNCH_PLAN", "ACTIVE", "objective-product-hunt", 0, 14, "Community Intelligence", "Launch demand turns into qualified product-page-to-video proof and signups.", 0.82],
  ["plan-directory-submission", "Directory Submission Plan", "Submit and monitor VidMaker across priority AI video and workflow directories.", "AUTHORITY_PLAN", "DRAFT", "objective-authority", 1, 21, "Authority", "VidMaker earns directory approvals, backlinks, and AI visibility signals.", 0.78],
  ["plan-blog-004-010-content", "BLOG-004 to BLOG-010 Content Plan", "Publish the next content cluster around product-page-to-video, Purpose-Specific AI, and workflow automation.", "CONTENT_PLAN", "ACTIVE", "objective-aeo-geo", 0, 35, "Content", "VidMaker publishes a connected authority cluster with answer-ready assets.", 0.8],
  ["plan-aeo-geo-visibility", "AEO/GEO Visibility Plan", "Create answer coverage and entity relationships for AEO and GEO visibility.", "AEO_PLAN", "DRAFT", "objective-aeo-geo", 2, 28, "Search Strategy", "VidMaker answers more AEO questions and strengthens entity association.", 0.76]
] as const).map(([id, title, description, planType, status, objectiveId, startOffset, endOffset, owner, expectedOutcome, confidenceScore], index) => ({
  id,
  title,
  description,
  planType: planType as PlanType,
  status: status as PlanStatus,
  objectiveId,
  startDate: daysFromNow(startOffset),
  endDate: daysFromNow(endOffset),
  owner,
  expectedOutcome,
  confidenceScore,
  ...scoped(index)
}));

const milestones: Milestone[] = ([
  ["milestone-publish-blog-004", "plan-blog-004-010-content", "Publish BLOG-004", "Publish product-page-to-video proof article.", 4, "IN_PROGRESS", "CRITICAL", "Content", "Creates the core proof asset.", 1],
  ["milestone-publish-blog-005", "plan-blog-004-010-content", "Publish BLOG-005", "Publish comparison article on generic AI video cleanup.", 9, "NOT_STARTED", "HIGH", "Content", "Captures competitor dissatisfaction.", 2],
  ["milestone-submit-10-directories", "plan-directory-submission", "Submit 10 directories", "Submit VidMaker to priority AI tool directories.", 12, "NOT_STARTED", "HIGH", "Authority", "Builds referring domain and AI visibility momentum.", 1],
  ["milestone-create-product-demo", "plan-product-hunt-follow-up", "Create product-page-to-video demo", "Create demo showing product page URL to ready-to-post video.", 3, "IN_PROGRESS", "CRITICAL", "Growth", "Provides proof for launch follow-up.", 1],
  ["milestone-add-internal-links", "plan-vpi-authority", "Add internal links between BLOG-002, BLOG-003, BLOG-004", "Connect the Video Production Intelligence content cluster.", 7, "NOT_STARTED", "HIGH", "SEO Strategy", "Strengthens authority cluster.", 2],
  ["milestone-publish-10-pins", "plan-product-hunt-follow-up", "Publish 10 Pinterest pins", "Turn proof snippets into Pinterest assets.", 11, "NOT_STARTED", "MEDIUM", "Content", "Expands visual distribution.", 3],
  ["milestone-founder-authority", "plan-vpi-authority", "Create founder authority post", "Publish founder post on Purpose-Specific AI and Video Production Intelligence.", 5, "NOT_STARTED", "HIGH", "Tom Promise", "Builds category narrative.", 1],
  ["milestone-aeo-faq", "plan-aeo-geo-visibility", "Create AEO FAQ set", "Publish FAQ answers for product-page-to-video and VPI questions.", 10, "NOT_STARTED", "HIGH", "Search Strategy", "Improves answer engine readiness.", 1],
  ["milestone-geo-entities", "plan-aeo-geo-visibility", "Strengthen GEO entity coverage", "Connect VidMaker, Purpose-Specific AI, and Product Page to Video entities.", 16, "NOT_STARTED", "HIGH", "Search Strategy", "Improves entity confidence.", 2],
  ["milestone-blog-010", "plan-blog-004-010-content", "Publish BLOG-010", "Complete the BLOG-004 to BLOG-010 cluster.", 32, "NOT_STARTED", "MEDIUM", "Content", "Completes the authority cluster.", 5]
] as const).map(([id, planId, title, description, dueOffset, status, priority, owner, expectedImpact, order], index) => ({
  id,
  planId,
  title,
  description,
  dueDate: daysFromNow(dueOffset),
  status: status as PlanItemStatus,
  priority: priority as Priority,
  owner,
  expectedImpact,
  order,
  ...scoped(index)
}));

const planItemSeeds = [
  ["plan-vpi-authority", "milestone-founder-authority", "Draft founder authority post", "FOUNDER_POST", "RecommendedAction", "action-24", "HIGH", "NOT_STARTED", "Tom Promise", 88, 4, 2],
  ["plan-vpi-authority", "milestone-founder-authority", "Publish founder authority post", "FOUNDER_POST", "RecommendedAction", "kernel-action-11", "HIGH", "NOT_STARTED", "Tom Promise", 92, 3, 5],
  ["plan-vpi-authority", "milestone-add-internal-links", "Audit BLOG-002 internal links", "INTERNAL_LINK", "ContentAsset", "content-blog-002", "HIGH", "NOT_STARTED", "SEO Strategy", 78, 2, 6],
  ["plan-vpi-authority", "milestone-add-internal-links", "Audit BLOG-003 internal links", "INTERNAL_LINK", "ContentAsset", "content-blog-003", "HIGH", "NOT_STARTED", "SEO Strategy", 76, 2, 6],
  ["plan-vpi-authority", "milestone-add-internal-links", "Add links into BLOG-004", "INTERNAL_LINK", "ContentAsset", "content-blog-004", "HIGH", "BLOCKED", "SEO Strategy", 86, 2, 8],
  ["plan-vpi-authority", "milestone-add-internal-links", "Update VPI landing page references", "LANDING_PAGE_UPDATE", "Entity", "entity-video-production-intelligence", "HIGH", "NOT_STARTED", "Growth", 84, 4, 10],
  ["plan-vpi-authority", "milestone-founder-authority", "Create category definition FAQ", "FAQ", "Question", "question-video-production-intelligence", "HIGH", "NOT_STARTED", "Search Strategy", 82, 3, 11],
  ["plan-vpi-authority", "milestone-add-internal-links", "Publish VPI newsletter section", "NEWSLETTER", "ContentAsset", "content-blog-002", "MEDIUM", "NOT_STARTED", "Content", 68, 3, 14],
  ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Script product-page-to-video demo", "DEMO", "Question", "question-product-page-to-video", "CRITICAL", "IN_PROGRESS", "Growth", 96, 5, 1],
  ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Record product-page-to-video demo", "DEMO", "RecommendedAction", "action-01", "CRITICAL", "BLOCKED", "Growth", 98, 6, 3],
  ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Create demo landing page section", "LANDING_PAGE_UPDATE", "Entity", "entity-product-page-to-video", "HIGH", "NOT_STARTED", "Growth", 86, 4, 5],
  ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 1", "PINTEREST_PIN", "ContentAsset", "content-blog-004", "MEDIUM", "NOT_STARTED", "Design System", 55, 1, 6],
  ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 2", "PINTEREST_PIN", "ContentAsset", "content-blog-004", "MEDIUM", "NOT_STARTED", "Design System", 55, 1, 7],
  ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 3", "PINTEREST_PIN", "ContentAsset", "content-blog-004", "MEDIUM", "NOT_STARTED", "Design System", 55, 1, 8],
  ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Reply to top Product Hunt comments", "COMMUNITY_REPLY", "Observation", "observation-01", "CRITICAL", "NOT_STARTED", "Community Intelligence", 92, 3, 4],
  ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Publish X thread from demo", "X_THREAD", "RecommendedAction", "action-07", "HIGH", "NOT_STARTED", "Content", 78, 3, 6],
  ["plan-directory-submission", "milestone-submit-10-directories", "Finalize directory category copy", "DIRECTORY_SUBMISSION", "DirectorySubmission", "directory-ai-video-tools", "HIGH", "IN_PROGRESS", "Authority", 82, 3, 2],
  ["plan-directory-submission", "milestone-submit-10-directories", "Submit Futurepedia listing", "DIRECTORY_SUBMISSION", "DirectorySubmission", "directory-ai-video-tools", "HIGH", "NOT_STARTED", "Authority", 84, 2, 5],
  ["plan-directory-submission", "milestone-submit-10-directories", "Submit Toolify listing", "DIRECTORY_SUBMISSION", "DirectorySubmission", "directory-ai-video-tools", "HIGH", "NOT_STARTED", "Authority", 84, 2, 6],
  ["plan-directory-submission", "milestone-submit-10-directories", "Submit There's An AI For That listing", "DIRECTORY_SUBMISSION", "DirectorySubmission", "directory-ai-video-tools", "HIGH", "NOT_STARTED", "Authority", 80, 2, 7],
  ["plan-directory-submission", "milestone-submit-10-directories", "Follow up on AI Video Tools backlink", "BACKLINK_OUTREACH", "Backlink", "backlink-ai-video-tools-directory", "HIGH", "NOT_STARTED", "Authority", 76, 2, 9],
  ["plan-directory-submission", "milestone-submit-10-directories", "Track directory approvals", "BACKLINK_OUTREACH", "DirectorySubmission", "directory-ai-video-tools", "MEDIUM", "NOT_STARTED", "Authority", 66, 2, 13],
  ["plan-blog-004-010-content", "milestone-publish-blog-004", "Finish BLOG-004 draft", "BLOG", "ContentAsset", "content-blog-004", "CRITICAL", "IN_PROGRESS", "Content", 96, 5, 2],
  ["plan-blog-004-010-content", "milestone-publish-blog-004", "Add BLOG-004 proof examples", "BLOG", "AIRecommendation", "ai-rec-01", "CRITICAL", "BLOCKED", "Content", 94, 4, 3],
  ["plan-blog-004-010-content", "milestone-publish-blog-004", "Publish BLOG-004", "BLOG", "RecommendedAction", "action-03", "CRITICAL", "NOT_STARTED", "Content", 98, 2, 4],
  ["plan-blog-004-010-content", "milestone-publish-blog-005", "Outline BLOG-005", "BLOG", "Pattern", "pattern-02", "HIGH", "NOT_STARTED", "Content", 84, 3, 7],
  ["plan-blog-004-010-content", "milestone-publish-blog-005", "Publish BLOG-005", "BLOG", "ContentAsset", "content-blog-005", "HIGH", "NOT_STARTED", "Content", 88, 4, 9],
  ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-006 brief", "BLOG", "Keyword", "keyword-ai-video-production", "HIGH", "NOT_STARTED", "Content", 74, 3, 12],
  ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-007 brief", "BLOG", "Keyword", "keyword-video-workflow-automation", "HIGH", "NOT_STARTED", "Content", 74, 3, 15],
  ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-008 brief", "BLOG", "Entity", "entity-purpose-specific-ai", "MEDIUM", "NOT_STARTED", "Content", 70, 3, 18],
  ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-009 brief", "BLOG", "Entity", "entity-purpose-engines", "MEDIUM", "NOT_STARTED", "Content", 68, 3, 22],
  ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-010 brief", "BLOG", "Question", "question-purpose-specific-ai", "MEDIUM", "NOT_STARTED", "Content", 66, 3, 28],
  ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer product-page-to-video FAQ", "FAQ", "Question", "question-product-page-to-video", "HIGH", "NOT_STARTED", "Search Strategy", 86, 2, 5],
  ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer VPI FAQ", "FAQ", "Question", "question-video-production-intelligence", "HIGH", "NOT_STARTED", "Search Strategy", 88, 2, 6],
  ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer Purpose-Specific AI FAQ", "FAQ", "Question", "question-purpose-specific-ai", "HIGH", "NOT_STARTED", "Search Strategy", 82, 2, 8],
  ["plan-aeo-geo-visibility", "milestone-geo-entities", "Update VidMaker entity page", "LANDING_PAGE_UPDATE", "Entity", "entity-vidmaker", "HIGH", "NOT_STARTED", "Search Strategy", 78, 3, 12],
  ["plan-aeo-geo-visibility", "milestone-geo-entities", "Update Product Page to Video entity page", "LANDING_PAGE_UPDATE", "Entity", "entity-product-page-to-video", "HIGH", "NOT_STARTED", "Search Strategy", 80, 3, 14],
  ["plan-aeo-geo-visibility", "milestone-geo-entities", "Create company post on Purpose Engines", "COMPANY_POST", "Entity", "entity-purpose-engines", "MEDIUM", "NOT_STARTED", "Content", 64, 2, 15],
  ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Create YouTube script from FAQ set", "YOUTUBE_SCRIPT", "Question", "question-video-production-intelligence", "MEDIUM", "NOT_STARTED", "Content", 62, 4, 19],
  ["plan-aeo-geo-visibility", "milestone-geo-entities", "Run answer coverage experiment", "EXPERIMENT", "Objective", "objective-aeo-geo", "HIGH", "NOT_STARTED", "Search Strategy", 82, 5, 22]
] as const;

const planItems: PlanItem[] = planItemSeeds.map(
  ([planId, milestoneId, title, itemType, sourceType, sourceId, priority, status, owner, estimatedImpactScore, estimatedEffortScore, dueOffset], index) => ({
    id: `plan-item-${String(index + 1).padStart(2, "0")}`,
    planId,
    milestoneId,
    title,
    description: title,
    itemType: itemType as PlanItemType,
    sourceType,
    sourceId,
    priority: priority as Priority,
    status: status as PlanItemStatus,
    owner,
    dueDate: daysFromNow(dueOffset),
    estimatedImpactScore,
    estimatedEffortScore,
    ...scoped(index)
  })
);

const planDependencies: PlanDependency[] = ([
  ["plan-vpi-authority", "plan-item-25", "plan-item-05", "SEQUENCED_BEFORE", "BLOG-004 should be published before internal links point to it."],
  ["plan-product-hunt-follow-up", "plan-item-10", "plan-item-16", "BLOCKS", "Product page demo should be created before demo promotion."],
  ["plan-directory-submission", "plan-item-17", "plan-item-18", "REQUIRES", "Directory copy should be finalized before directory submissions."],
  ["plan-directory-submission", "plan-item-17", "plan-item-19", "REQUIRES", "Directory copy should be finalized before Toolify submission."],
  ["plan-blog-004-010-content", "plan-item-24", "plan-item-25", "BLOCKS", "Proof examples are required before BLOG-004 publishing."],
  ["plan-blog-004-010-content", "plan-item-25", "plan-item-27", "SHOULD_FOLLOW", "BLOG-005 should follow the product-page-to-video proof article."],
  ["plan-aeo-geo-visibility", "plan-item-34", "plan-item-40", "SUPPORTS", "VPI FAQ coverage supports the answer coverage experiment."],
  ["plan-product-hunt-follow-up", "plan-item-10", "plan-item-15", "BLOCKS", "Community replies should include the demo proof link."]
] as const).map(([planId, fromItemId, toItemId, dependencyType, reason], index) => ({
  id: `plan-dependency-${String(index + 1).padStart(2, "0")}`,
  planId,
  fromItemId,
  toItemId,
  dependencyType: dependencyType as PlanDependencyType,
  reason,
  ...scoped(index)
}));

const planConstraints: PlanConstraint[] = ([
  ["plan-product-hunt-follow-up", "Product demo not ready", "Product-page-to-video demo needs final proof assets before promotion.", "PRODUCT_NOT_READY", "CRITICAL"],
  ["plan-vpi-authority", "Limited founder time", "Founder publishing capacity is capped this week.", "RESOURCE_LIMITED", "HIGH"],
  ["plan-blog-004-010-content", "Need graphics for BLOG-004", "BLOG-004 requires diagrams and proof visuals.", "DESIGN_NOT_READY", "HIGH"],
  ["plan-blog-004-010-content", "Need proof examples for product-page-to-video", "Article requires source-to-output proof examples.", "CONTENT_NOT_READY", "CRITICAL"],
  ["plan-directory-submission", "Directory approvals may lag", "Submission review time may delay backlink outcomes.", "APPROVAL_REQUIRED", "MEDIUM"]
] as const).map(([planId, title, description, constraintType, severity], index) => ({
  id: `plan-constraint-${String(index + 1).padStart(2, "0")}`,
  planId,
  title,
  description,
  constraintType: constraintType as PlanConstraintType,
  severity: severity as ConstraintSeverity,
  ...scoped(index)
}));

const predictedOutcomes: PredictedOutcome[] = ([
  ["plan-directory-submission", "directory approvals", 10, 0.78, "+10 directory submissions are likely if copy is finalized this week."],
  ["plan-directory-submission", "potential backlinks", 5, 0.7, "+5 potential backlinks from approved listings and follow-ups."],
  ["plan-blog-004-010-content", "authority articles", 4, 0.74, "+4 authority articles from the BLOG-004 to BLOG-010 cluster."],
  ["plan-product-hunt-follow-up", "social content assets", 20, 0.72, "+20 social content assets from demo clips, Pinterest pins, and X threads."],
  ["plan-product-hunt-follow-up", "product demo assets", 3, 0.8, "+3 product demo assets from product-page-to-video proof work."],
  ["plan-aeo-geo-visibility", "AEO questions answered", 10, 0.76, "+10 AEO questions answered through FAQ and landing page updates."],
  ["plan-vpi-authority", "AI mentions", 6, 0.64, "Improved entity clarity should lift AI mentions over time."],
  ["plan-product-hunt-follow-up", "signups", 25, 0.58, "Demo-led follow-up should create a modest signup lift."]
] as const).map(([planId, metricName, predictedValue, confidenceScore, rationale], index) => ({
  id: `predicted-outcome-${String(index + 1).padStart(2, "0")}`,
  planId,
  metricName,
  predictedValue,
  confidenceScore,
  rationale,
  ...scoped(index)
}));

const resourceCapacities: ResourceCapacity[] = ([
  ["Tom Promise", "Founder", 20, "Strategy and publishing", "Protect founder time for authority posts, launch follow-up, and final approvals."],
  ["Content System", "AI-assisted", 40, "Content production", "Drafts, outlines, FAQs, newsletters, scripts, and social repurposing."],
  ["Design System", "AI-assisted", 15, "Graphics and carousel assets", "Pinterest pins, article graphics, proof visuals, and social carousels."]
] as const).map(([owner, role, weeklyHours, focusArea, notes], index) => ({
  id: `resource-capacity-${String(index + 1).padStart(2, "0")}`,
  owner,
  role,
  weeklyHours,
  focusArea,
  notes,
  ...scoped(index)
}));

const executionItemSeeds = [
  ["execution-blog-004-publish", "Publish BLOG-004: What Is Video Production Intelligence?", "BLOG_PUBLISH", "NEEDS_APPROVAL", "CRITICAL", "Content", "plan-blog-004-010-content", "plan-item-25", "content-blog-004"],
  ["execution-blog-004-internal-links", "Add internal links from BLOG-002 and BLOG-003 to BLOG-004", "INTERNAL_LINK_UPDATE", "READY", "HIGH", "SEO Strategy", "plan-vpi-authority", "plan-item-05", "content-blog-004"],
  ["execution-product-page-demo", "Create product-page-to-video demo", "DEMO_CREATION", "BLOCKED", "CRITICAL", "Growth", "plan-product-hunt-follow-up", "plan-item-10", "question-product-page-to-video"],
  ["execution-futurepedia-submit", "Submit VidMaker to Futurepedia", "DIRECTORY_SUBMISSION", "READY", "HIGH", "Authority", "plan-directory-submission", "plan-item-18", "directory-ai-video-tools"],
  ["execution-toolify-submit", "Submit VidMaker to Toolify", "DIRECTORY_SUBMISSION", "QUEUED", "HIGH", "Authority", "plan-directory-submission", "plan-item-19", "directory-ai-video-tools"],
  ["execution-founder-boundaries", "Publish founder post about automation boundaries", "FOUNDER_POST", "NEEDS_APPROVAL", "HIGH", "Tom Promise", "plan-vpi-authority", "plan-item-01", "entity-purpose-specific-ai"],
  ["execution-pinterest-blog-004", "Publish Pinterest Pin for BLOG-004", "PINTEREST_PIN", "BLOCKED", "MEDIUM", "Design System", "plan-product-hunt-follow-up", "plan-item-12", "content-blog-004"],
  ["execution-product-hunt-reply", "Reply to Product Hunt comment asking for product-page demo", "COMMUNITY_REPLY", "READY", "CRITICAL", "Community Intelligence", "plan-product-hunt-follow-up", "plan-item-15", "observation-url-product-comments"],
  ["execution-purpose-specific-faq", "Create FAQ for Purpose-Specific AI", "FAQ_UPDATE", "READY", "HIGH", "Search Strategy", "plan-aeo-geo-visibility", "plan-item-35", "question-purpose-specific-ai"],
  ["execution-vpi-landing-section", "Update VidMaker landing page with Video Production Intelligence section", "LANDING_PAGE_UPDATE", "BLOCKED", "HIGH", "Growth", "plan-vpi-authority", "plan-item-06", "entity-video-production-intelligence"],
  ["execution-ph-proof-screenshot", "Add Product Hunt launch proof screenshot", "MANUAL_ACTION", "READY", "HIGH", "Community Intelligence", "plan-product-hunt-follow-up", "plan-item-15", "observation-product-hunt-comments"],
  ["execution-directory-copy-bank", "Create directory submission copy bank", "DIRECTORY_SUBMISSION", "COMPLETED", "HIGH", "Authority", "plan-directory-submission", "plan-item-17", "directory-ai-video-tools"],
  ["execution-company-linkedin-blog-004", "Publish company LinkedIn post for BLOG-004", "COMPANY_POST", "NEEDS_APPROVAL", "HIGH", "Content", "plan-blog-004-010-content", "plan-item-25", "content-blog-004"],
  ["execution-x-thread-blog-004", "Create X thread from BLOG-004", "X_THREAD", "QUEUED", "HIGH", "Content", "plan-product-hunt-follow-up", "plan-item-16", "content-blog-004"],
  ["execution-4k-proof-asset", "Create demo proof asset for 4K quality", "DEMO_CREATION", "BLOCKED", "HIGH", "Growth", "plan-product-hunt-follow-up", "plan-item-10", "ai-rec-08"],
  ["execution-blog-005-outline", "Outline BLOG-005 competitor cleanup article", "BLOG_PUBLISH", "QUEUED", "HIGH", "Content", "plan-blog-004-010-content", "plan-item-26", "pattern-02"],
  ["execution-vpi-newsletter", "Send newsletter section on Video Production Intelligence", "NEWSLETTER_SEND", "QUEUED", "MEDIUM", "Content", "plan-vpi-authority", "plan-item-08", "content-blog-002"],
  ["execution-vpi-faq", "Answer VPI FAQ", "FAQ_UPDATE", "READY", "HIGH", "Search Strategy", "plan-aeo-geo-visibility", "plan-item-34", "question-video-production-intelligence"],
  ["execution-product-page-entity", "Update Product Page to Video entity page", "LANDING_PAGE_UPDATE", "QUEUED", "HIGH", "Search Strategy", "plan-aeo-geo-visibility", "plan-item-38", "entity-product-page-to-video"],
  ["execution-purpose-engines-company-post", "Create company post on Purpose Engines", "COMPANY_POST", "QUEUED", "MEDIUM", "Content", "plan-aeo-geo-visibility", "plan-item-39", "entity-purpose-engines"],
  ["execution-faq-youtube-script", "Create YouTube script from FAQ set", "YOUTUBE_SCRIPT", "QUEUED", "MEDIUM", "Content", "plan-aeo-geo-visibility", "plan-item-39", "question-video-production-intelligence"],
  ["execution-answer-coverage-experiment", "Run answer coverage experiment", "EXPERIMENT_RUN", "READY", "HIGH", "Search Strategy", "plan-aeo-geo-visibility", "plan-item-40", "objective-aeo-geo"],
  ["execution-ai-video-tools-backlink", "Follow up on AI Video Tools backlink", "BACKLINK_OUTREACH", "READY", "HIGH", "Authority", "plan-directory-submission", "plan-item-21", "backlink-ai-video-tools-directory"],
  ["execution-pinterest-proof-pin-2", "Create Pinterest proof pin 2", "PINTEREST_PIN", "QUEUED", "MEDIUM", "Design System", "plan-product-hunt-follow-up", "plan-item-13", "content-blog-004"],
  ["execution-founder-vpi-post", "Publish founder authority post on Video Production Intelligence", "FOUNDER_POST", "IN_PROGRESS", "HIGH", "Tom Promise", "plan-vpi-authority", "plan-item-02", "kernel-action-11"]
] as const;

const executionItems: ExecutionItem[] = executionItemSeeds.map(
  ([id, title, executionType, status, priority, owner, planId, planItemId, sourceId], index) => ({
    id,
    title,
    description: `${title} for VidMaker execution tracking.`,
    executionType: executionType as ExecutionType,
    status: status as ExecutionStatus,
    priority: priority as Priority,
    owner,
    dueDate: daysFromNow((index % 9) + 1),
    startedAt: ["IN_PROGRESS", "BLOCKED", "NEEDS_APPROVAL"].includes(status) ? daysAgo((index % 4) + 1) : undefined,
    completedAt: status === "COMPLETED" ? daysAgo(1) : undefined,
    sourceType: "Seed",
    sourceId,
    planId,
    planItemId,
    expectedImpact: "Move a planned VidMaker growth action into shipped proof, authority, distribution, or learning.",
    actualImpact: status === "COMPLETED" ? "Execution completed and learning captured." : "",
    notes: "",
    ...scoped(index)
  })
);

const executionEvidence: ExecutionEvidence[] = ([
  ["execution-blog-004-publish", "BLOG-004 draft note", "NOTE", "", "Draft includes Video Production Intelligence positioning and proof placeholders."],
  ["execution-product-page-demo", "Product-page-to-video demo placeholder", "DEMO_ASSET", "https://vidmaker.com/product-page-to-video", "Placeholder URL for product-page-to-video proof asset."],
  ["execution-product-hunt-reply", "Product Hunt URL", "URL", "https://www.producthunt.com", "Source thread for launch comments and demo requests."],
  ["execution-company-linkedin-blog-004", "LinkedIn launch post URL", "SOCIAL_POST", "https://www.linkedin.com/company/vidmaker", "Placeholder for LinkedIn company post proof."],
  ["execution-futurepedia-submit", "Futurepedia submission placeholder", "DIRECTORY_CONFIRMATION", "https://www.futurepedia.io", "Directory submission confirmation placeholder."],
  ["execution-toolify-submit", "Toolify submission placeholder", "DIRECTORY_CONFIRMATION", "https://www.toolify.ai", "Directory submission confirmation placeholder."],
  ["execution-blog-004-internal-links", "Internal link completion note", "NOTE", "", "BLOG-002 and BLOG-003 internal link targets identified."],
  ["execution-pinterest-blog-004", "Pinterest image brief", "FILE", "", "Image requirements captured for BLOG-004 pin."],
  ["execution-ph-proof-screenshot", "Product Hunt proof screenshot placeholder", "SCREENSHOT", "", "Screenshot slot for launch proof."],
  ["execution-directory-copy-bank", "Directory copy bank note", "NOTE", "", "Copy bank emphasizes VPI and product-page-to-video proof."],
  ["execution-x-thread-blog-004", "X thread draft note", "NOTE", "", "Thread structure drafted from BLOG-004 outline."],
  ["execution-4k-proof-asset", "4K proof requirement", "NOTE", "", "Proof example must show quality and control."],
  ["execution-vpi-faq", "FAQ answer draft", "NOTE", "", "Draft answer defines Video Production Intelligence."],
  ["execution-ai-video-tools-backlink", "AI Video Tools backlink monitor", "BACKLINK_LIVE", "https://example.com/ai-video-tools", "Backlink monitoring placeholder."],
  ["execution-answer-coverage-experiment", "Answer coverage metric baseline", "METRIC", "", "Baseline answer coverage score captured before experiment."]
] as const).map(([executionItemId, title, evidenceType, url, description], index) => ({
  id: `execution-evidence-${String(index + 1).padStart(2, "0")}`,
  executionItemId,
  evidenceType: evidenceType as EvidenceType,
  title,
  url: url || undefined,
  description,
  uploadedAssetUrl: undefined,
  capturedAt: daysAgo(index % 5),
  ...scoped(index)
}));

const executionBlockers: ExecutionBlocker[] = ([
  ["execution-product-page-demo", "Product-page demo graphic not ready", "MISSING_GRAPHIC", "CRITICAL", "Design System"],
  ["execution-directory-copy-bank", "Directory copy needs review", "NEEDS_REVIEW", "HIGH", "Authority"],
  ["execution-blog-004-publish", "BLOG-004 needs final CTA", "MISSING_CONTENT", "HIGH", "Content"],
  ["execution-pinterest-blog-004", "Pinterest image needed", "MISSING_GRAPHIC", "MEDIUM", "Design System"],
  ["execution-product-hunt-reply", "Product Hunt comment response pending", "NEEDS_REVIEW", "HIGH", "Community Intelligence"],
  ["execution-vpi-landing-section", "Landing page proof section needs design", "MISSING_GRAPHIC", "HIGH", "Growth"],
  ["execution-4k-proof-asset", "4K proof example needed", "MISSING_CONTENT", "HIGH", "Growth"],
  ["execution-founder-boundaries", "Founder post needs final review", "MISSING_APPROVAL", "HIGH", "Tom Promise"]
] as const).map(([executionItemId, title, blockerType, severity, owner], index) => ({
  id: `execution-blocker-${String(index + 1).padStart(2, "0")}`,
  executionItemId,
  title,
  description: `${title} before this execution can be completed.`,
  blockerType: blockerType as BlockerType,
  severity: severity as ConstraintSeverity,
  status: index === 1 ? "IN_REVIEW" : "OPEN",
  owner,
  resolvedAt: undefined,
  ...scoped(index)
}));

const approvalRequests: ApprovalRequest[] = ([
  ["execution-blog-004-publish", "Founder approval for BLOG-004", "FOUNDER_APPROVAL", "REQUESTED", "Content", "Tom Promise"],
  ["execution-product-page-demo", "Brand approval for product-page demo", "BRAND_APPROVAL", "CHANGES_REQUESTED", "Growth", "Brand"],
  ["execution-blog-004-internal-links", "SEO approval for internal links", "SEO_APPROVAL", "REQUESTED", "SEO Strategy", "SEO Lead"],
  ["execution-company-linkedin-blog-004", "Publishing approval for LinkedIn company post", "PUBLISHING_APPROVAL", "REQUESTED", "Content", "Growth"],
  ["execution-product-page-demo", "Product approval for URL-to-video proof messaging", "PRODUCT_APPROVAL", "REQUESTED", "Growth", "Product"],
  ["execution-founder-boundaries", "Founder post final approval", "FOUNDER_APPROVAL", "REQUESTED", "Content", "Tom Promise"],
  ["execution-vpi-landing-section", "Brand approval for VPI landing section", "BRAND_APPROVAL", "REQUESTED", "Growth", "Brand"],
  ["execution-purpose-specific-faq", "Content approval for Purpose-Specific AI FAQ", "CONTENT_APPROVAL", "APPROVED", "Search Strategy", "Content"]
] as const).map(([executionItemId, title, approvalType, status, requestedBy, reviewer], index) => ({
  id: `approval-request-${String(index + 1).padStart(2, "0")}`,
  executionItemId,
  title,
  description: `${title} is required before publication or distribution.`,
  approvalType: approvalType as ApprovalType,
  status: status as ApprovalStatus,
  requestedBy,
  reviewer,
  requestedAt: daysAgo((index % 4) + 1),
  reviewedAt: status === "APPROVED" || status === "CHANGES_REQUESTED" ? daysAgo(index % 2) : undefined,
  decisionNotes: status === "CHANGES_REQUESTED" ? "Clarify proof claim before publishing." : undefined,
  ...scoped(index)
}));

const executionResults: ExecutionResult[] = ([
  ["execution-company-linkedin-blog-004", "COMPLETED", "LinkedIn carousel published", "engagement_rate", 0, 0, 72, "LinkedIn proof-led posts should include source-to-output visuals."],
  ["execution-product-hunt-reply", "COMPLETED", "Product Hunt launch announcement published", "comment_replies", 0, 3, 78, "Community replies perform better when linked to a concrete demo."],
  ["execution-x-thread-blog-004", "LEARNING_CAPTURED", "Company X account created", "followers", 0, 12, 55, "X should be used for demo-thread distribution after proof assets are ready."],
  ["execution-blog-004-internal-links", "COMPLETED", "BLOG-003 published and linked into the VPI cluster", "internal_links", 0, 4, 80, "Cluster linking strengthens VPI category ownership."],
  ["execution-futurepedia-submit", "FOLLOW_UP_REQUIRED", "Directory submission wave pending", "submissions", 0, 2, 65, "Directory submissions need review-ready copy bank before batching."]
] as const).map(([executionItemId, resultType, summary, metricName, metricBefore, metricAfter, impactScore, learning], index) => ({
  id: `execution-result-${String(index + 1).padStart(2, "0")}`,
  executionItemId,
  resultType: resultType as ExecutionResultType,
  summary,
  metricName,
  metricBefore,
  metricAfter,
  impactScore,
  learning,
  ...scoped(index)
}));

const metrics: Metric[] = ([
  ["metric-organic-traffic", "Organic traffic", "Sessions from organic search to VidMaker owned pages.", "TRAFFIC", "Search Console", "sessions", 1480, 1325, 2200, "IMPROVING", "SEO Strategy"],
  ["metric-search-impressions", "Search impressions", "Total search impressions for VidMaker growth and product pages.", "SEARCH_IMPRESSIONS", "Search Console", "impressions", 41200, 36800, 60000, "IMPROVING", "SEO Strategy"],
  ["metric-search-clicks", "Search clicks", "Search clicks from target queries and entity pages.", "SEARCH_CLICKS", "Search Console", "clicks", 910, 820, 1600, "IMPROVING", "SEO Strategy"],
  ["metric-product-hunt-referrals", "Product Hunt referrals", "Referral sessions from Product Hunt launch and follow-up work.", "TRAFFIC", "Analytics", "sessions", 264, 98, 500, "IMPROVING", "Community Intelligence"],
  ["metric-linkedin-impressions", "LinkedIn impressions", "Impressions from founder and company LinkedIn posts.", "SOCIAL_IMPRESSIONS", "LinkedIn", "impressions", 18400, 9100, 25000, "IMPROVING", "Content"],
  ["metric-x-impressions", "X impressions", "Impressions from X launch announcements and threads.", "SOCIAL_IMPRESSIONS", "X", "impressions", 4200, 900, 12000, "WATCH", "Content"],
  ["metric-pinterest-impressions", "Pinterest impressions", "Impressions from Pinterest proof pins and article pins.", "SOCIAL_IMPRESSIONS", "Pinterest", "impressions", 1300, 420, 5000, "WATCH", "Design System"],
  ["metric-backlinks", "Backlinks", "Live backlinks from directories, newsletters, and authority outreach.", "BACKLINKS", "Authority Tracker", "links", 7, 4, 25, "IMPROVING", "Authority"],
  ["metric-referring-domains", "Referring domains", "Unique referring domains pointing to VidMaker.", "REFERRING_DOMAINS", "Authority Tracker", "domains", 5, 3, 18, "IMPROVING", "Authority"],
  ["metric-directory-submissions", "Directory submissions", "Submitted directory listings for VidMaker.", "DIRECTORY_APPROVALS", "Directory Tracker", "submissions", 12, 3, 25, "IMPROVING", "Authority"],
  ["metric-directory-approvals", "Directory approvals", "Approved directory listings that can produce authority signals.", "DIRECTORY_APPROVALS", "Directory Tracker", "approvals", 2, 0, 10, "WATCH", "Authority"],
  ["metric-blog-posts-published", "Blog posts published", "Published blog and FAQ assets from the content engine.", "CONTENT_PUBLISHED", "Content Engine", "posts", 4, 2, 10, "IMPROVING", "Content"],
  ["metric-community-replies", "Community replies", "Helpful replies shipped to Product Hunt, Reddit, LinkedIn, X, and forums.", "COMMUNITY_REPLIES", "Community Intelligence", "replies", 18, 6, 40, "IMPROVING", "Community Intelligence"],
  ["metric-qualified-signups", "Qualified signups", "Signups with commercial or product workflow intent.", "SIGNUPS", "Analytics", "signups", 31, 18, 75, "IMPROVING", "Growth"],
  ["metric-ai-mentions", "AI mentions", "Answer-engine and AI surface mentions of VidMaker and Video Production Intelligence.", "AI_MENTIONS", "AEO/GEO Tracker", "mentions", 9, 4, 30, "WATCH", "Search Strategy"]
] as const).map(([id, name, description, metricType, source, unit, currentValue, previousValue, targetValue, status, owner], index) => ({
  id,
  name,
  title: name,
  description,
  metricType: metricType as MetricType,
  source,
  unit,
  currentValue,
  previousValue,
  targetValue,
  status: status as MetricStatus,
  owner,
  ...scoped(index)
}));

const measurementSeeds = [
  ["metric-search-impressions", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 41200, 36800, "BLOG-004 category definition lifted impressions."],
  ["metric-search-clicks", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 910, 820, "Search clicks improved after category article updates."],
  ["metric-blog-posts-published", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 4, 3, "BLOG-004 moved content output forward."],
  ["metric-linkedin-impressions", "Campaign", "campaign-product-page-to-video-proof", "execution-company-linkedin-blog-004", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 18400, 9100, "LinkedIn carousel outperformed plain company post."],
  ["metric-product-hunt-referrals", "Observation", "observation-product-hunt-comments", "execution-product-hunt-reply", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 264, 98, "Product Hunt follow-up produced qualified referral traffic."],
  ["metric-community-replies", "Observation", "observation-url-product-comments", "execution-product-hunt-reply", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 18, 6, "Community replies increased conversation quality."],
  ["metric-qualified-signups", "Campaign", "campaign-product-page-to-video-proof", "execution-product-hunt-reply", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 31, 18, "Demo-linked replies produced higher-intent signups."],
  ["metric-x-impressions", "ContentAsset", "content-blog-004", "execution-x-thread-blog-004", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 4200, 900, "X launch announcement created early distribution."],
  ["metric-pinterest-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-blog-004", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 1300, 420, "Pinterest pin drafts need stronger proof visuals."],
  ["metric-directory-submissions", "DirectorySubmission", "directory-ai-video-tools", "execution-futurepedia-submit", "plan-directory-submission", "objective-authority", "", 12, 3, "Directory submission volume increased after copy bank."],
  ["metric-directory-approvals", "DirectorySubmission", "directory-ai-video-tools", "execution-futurepedia-submit", "plan-directory-submission", "objective-authority", "", 2, 0, "Approvals lag submission volume."],
  ["metric-backlinks", "Backlink", "backlink-ai-video-tools-directory", "execution-ai-video-tools-backlink", "plan-directory-submission", "objective-authority", "", 7, 4, "Backlink count is improving but slower than predicted."],
  ["metric-referring-domains", "Backlink", "backlink-ai-video-tools-directory", "execution-ai-video-tools-backlink", "plan-directory-submission", "objective-authority", "", 5, 3, "Directory work added referring-domain diversity."],
  ["metric-ai-mentions", "Entity", "entity-video-production-intelligence", "execution-vpi-landing-section", "plan-vpi-authority", "objective-own-vpi", "", 9, 4, "Entity clarity improved answer-engine mentions."],
  ["metric-organic-traffic", "ContentAsset", "content-blog-002", "execution-vpi-newsletter", "plan-vpi-authority", "objective-own-vpi", "", 1480, 1325, "VPI cluster is lifting organic traffic."],
  ["metric-search-impressions", "Question", "question-video-production-intelligence", "execution-vpi-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 41200, 37100, "FAQ coverage supports answer-ready visibility."],
  ["metric-ai-mentions", "Question", "question-purpose-specific-ai", "execution-purpose-specific-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 9, 5, "Purpose-Specific AI FAQ improved entity language."],
  ["metric-linkedin-impressions", "Insight", "insight-url-to-video-trust", "execution-founder-boundaries", "plan-vpi-authority", "objective-own-vpi", "", 18400, 11200, "Founder framing attracts stronger qualitative comments."],
  ["metric-linkedin-impressions", "Campaign", "campaign-product-page-to-video-proof", "execution-company-linkedin-blog-004", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 18400, 12600, "LinkedIn engagement signal is tracked through launch post reach for now."],
  ["metric-community-replies", "PainPoint", "painpoint-output-coherence-proof", "execution-4k-proof-asset", "plan-product-hunt-follow-up", "objective-demo-assets", "", 18, 10, "4K proof comments show skepticism needs evidence."],
  ["metric-qualified-signups", "Question", "question-product-page-to-video", "execution-product-page-demo", "plan-product-hunt-follow-up", "objective-demo-assets", "campaign-product-page-to-video-proof", 31, 20, "Product-page demo intent remains commercial."],
  ["metric-search-clicks", "Entity", "entity-product-page-to-video", "execution-product-page-entity", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 910, 840, "Product Page to Video entity page improved clicks."],
  ["metric-blog-posts-published", "Question", "question-purpose-specific-ai", "execution-blog-005-outline", "plan-blog-004-010-content", "objective-aeo-geo", "", 4, 3, "BLOG-005 outline supports the authority cluster."],
  ["metric-directory-submissions", "DirectorySubmission", "directory-ai-video-tools", "execution-toolify-submit", "plan-directory-submission", "objective-authority", "", 12, 8, "Toolify submission increased directory coverage."],
  ["metric-backlinks", "DirectorySubmission", "directory-ai-video-tools", "execution-directory-copy-bank", "plan-directory-submission", "objective-authority", "", 7, 4, "Copy bank should improve backlink conversion."],
  ["metric-x-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-proof-pin-2", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 4200, 2100, "Cross-channel repurposing is increasing reach."],
  ["metric-pinterest-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-proof-pin-2", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 1300, 700, "Second proof pin improved Pinterest visibility."],
  ["metric-ai-mentions", "Entity", "entity-purpose-engines", "execution-purpose-engines-company-post", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 9, 6, "Purpose Engines language should be reinforced."],
  ["metric-search-impressions", "Experiment", "experiment-product-page-demo-series", "execution-answer-coverage-experiment", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 41200, 38800, "Answer coverage experiment improved impressions modestly."],
  ["metric-qualified-signups", "Experiment", "experiment-product-page-demo-series", "execution-answer-coverage-experiment", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 31, 24, "Demo-led answer coverage improved signup quality."]
] as const;

const measurements: Measurement[] = measurementSeeds.map(
  ([metricId, sourceType, sourceId, executionItemId, planId, objectiveId, campaignId, value, previousValue, notes], index) => {
    const changeValue = Number(value) - Number(previousValue);
    return {
      id: `measurement-${String(index + 1).padStart(2, "0")}`,
      metricId,
      sourceType,
      sourceId,
      executionItemId,
      executionResultId: index < executionResults.length ? executionResults[index].id : undefined,
      planId,
      objectiveId,
      campaignId: campaignId || undefined,
      measuredAt: daysAgo(index % 10),
      value: Number(value),
      previousValue: Number(previousValue),
      changeValue,
      changePercent: Number(previousValue) === 0 ? undefined : Math.round((changeValue / Number(previousValue)) * 10000) / 100,
      notes,
      ...scoped(index)
    };
  }
);

const learnings: Learning[] = ([
  ["Launch carousel beat text-only company post", "Launch carousel generated stronger LinkedIn engagement than a text-only company post.", "CHANNEL_PERFORMANCE", 0.89, "Measurement", "measurement-04", "metric-linkedin-impressions", "execution-company-linkedin-blog-004", "plan-blog-004-010-content", "objective-aeo-geo", "Prioritize proof-led carousel formats for launch and category posts.", true],
  ["Product-page-to-video is commercial intent", "Product-page-to-video questions indicate high commercial investigation intent.", "CUSTOMER_LANGUAGE", 0.93, "Question", "question-product-page-to-video", "metric-qualified-signups", "execution-product-page-demo", "plan-product-hunt-follow-up", "objective-demo-assets", "Future recommendations should treat product-page-to-video as BOFU proof demand.", true],
  ["Directory approvals lag submissions", "Directory submissions require longer approval windows than the plan predicted.", "AUTHORITY_IMPACT", 0.82, "Measurement", "measurement-11", "metric-directory-approvals", "execution-futurepedia-submit", "plan-directory-submission", "objective-authority", "Authority plans should extend timelines and increase follow-up volume.", true],
  ["Category definition supports AEO/GEO", "Category-definition content supports answer-engine and generative-engine positioning.", "AEO_IMPACT", 0.86, "ContentAsset", "content-blog-004", "metric-ai-mentions", "execution-vpi-landing-section", "plan-vpi-authority", "objective-own-vpi", "Keep building answer-ready sections around Video Production Intelligence.", true],
  ["Founder posts create better comments", "Founder posts generate better qualitative comments than company posts.", "CHANNEL_PERFORMANCE", 0.81, "Insight", "insight-url-to-video-trust", "metric-linkedin-impressions", "execution-founder-boundaries", "plan-vpi-authority", "objective-own-vpi", "Increase founder-led narrative posts around proof, trust, and workflow intelligence.", true],
  ["Demo proof needed before BOFU push", "Demo proof is needed before pushing BOFU conversion posts harder.", "PRODUCT_SIGNAL", 0.9, "PainPoint", "painpoint-output-coherence-proof", "metric-qualified-signups", "execution-product-page-demo", "plan-product-hunt-follow-up", "objective-demo-assets", "Require proof assets before aggressive conversion messaging.", true],
  ["Community replies work with concrete demos", "Community replies perform best when paired with a concrete source-to-output demo.", "COMMUNITY_SIGNAL", 0.88, "Observation", "observation-product-hunt-comments", "metric-community-replies", "execution-product-hunt-reply", "plan-product-hunt-follow-up", "objective-product-hunt", "Recommend reply-to-community actions only when proof links are ready.", true],
  ["AEO FAQ blocks improve coverage", "Answer-ready FAQ sections improved search impressions and AI mentions.", "AEO_IMPACT", 0.84, "Measurement", "measurement-16", "metric-search-impressions", "execution-vpi-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "Create more FAQ sections around Purpose-Specific AI, VPI, and product-page workflows.", true],
  ["Pinterest needs stronger visuals", "Pinterest visibility improves only when pins carry concrete workflow proof.", "CONTENT_PERFORMANCE", 0.73, "Measurement", "measurement-27", "metric-pinterest-impressions", "execution-pinterest-proof-pin-2", "plan-product-hunt-follow-up", "objective-product-hunt", "Delay Pinterest pushes until proof visuals are ready.", true],
  ["Backlink work needs copy bank", "Directory and backlink outreach performed better after reusable copy was prepared.", "AUTHORITY_IMPACT", 0.8, "ExecutionResult", "execution-result-05", "metric-backlinks", "execution-directory-copy-bank", "plan-directory-submission", "objective-authority", "Create copy banks before scaling authority submissions.", true],
  ["X is useful after proof assets", "X distribution should follow proof asset readiness, not precede it.", "CHANNEL_PERFORMANCE", 0.76, "ExecutionResult", "execution-result-03", "metric-x-impressions", "execution-x-thread-blog-004", "plan-product-hunt-follow-up", "objective-product-hunt", "Sequence X threads after demos and screenshots are ready.", true],
  ["Entity pages need proof sections", "Entity pages earn better search clicks when proof sections are explicit.", "SEO_IMPACT", 0.79, "Measurement", "measurement-22", "metric-search-clicks", "execution-product-page-entity", "plan-aeo-geo-visibility", "objective-aeo-geo", "Update entity landing pages with proof-first examples.", true],
  ["4K quality claims require evidence", "4K quality comments show that claims without proof create skepticism.", "PRODUCT_SIGNAL", 0.77, "Observation", "observation-hn-skepticism", "metric-community-replies", "execution-4k-proof-asset", "plan-product-hunt-follow-up", "objective-demo-assets", "Avoid quality claims until demo evidence is visible.", true],
  ["Purpose-Specific AI needs repetition", "Purpose-Specific AI language is promising but needs repeated answer-ready reinforcement.", "GEO_IMPACT", 0.74, "Question", "question-purpose-specific-ai", "metric-ai-mentions", "execution-purpose-specific-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "Recommend more cluster content around purpose-specific AI.", true],
  ["Internal links strengthen VPI cluster", "Cluster linking between BLOG-002, BLOG-003, and BLOG-004 strengthened category ownership.", "SEO_IMPACT", 0.83, "ExecutionResult", "execution-result-04", "metric-organic-traffic", "execution-blog-004-internal-links", "plan-vpi-authority", "objective-own-vpi", "Future content recommendations should include internal-link actions by default.", true]
] as const).map(([title, summary, learningType, confidenceScore, sourceType, sourceId, metricId, executionItemId, planId, objectiveId, recommendationImpact, shouldInformFuturePlans], index) => ({
  id: `learning-${String(index + 1).padStart(2, "0")}`,
  title,
  summary,
  learningType: learningType as LearningType,
  confidenceScore,
  sourceType,
  sourceId,
  metricId,
  executionItemId,
  planId,
  objectiveId,
  recommendationImpact,
  shouldInformFuturePlans,
  ...scoped(index)
}));

const attributions: Attribution[] = ([
  ["ExecutionItem", "execution-product-hunt-reply", "Metric", "metric-product-hunt-referrals", "INFLUENCED", 0.82, "Product Hunt launch replies influenced referral traffic."],
  ["ExecutionItem", "execution-company-linkedin-blog-004", "Metric", "metric-linkedin-impressions", "INFLUENCED", 0.86, "LinkedIn carousel influenced profile visits and post impressions."],
  ["ContentAsset", "content-blog-004", "Metric", "metric-ai-mentions", "SUPPORTED", 0.78, "BLOG-004 supported category authority and AI mentions."],
  ["DirectorySubmission", "directory-ai-video-tools", "Metric", "metric-backlinks", "SUPPORTED", 0.74, "Directory submissions supported backlink acquisition."],
  ["ExecutionItem", "execution-product-hunt-reply", "Metric", "metric-community-replies", "CAUSED", 0.88, "Community replies directly increased conversation quality."],
  ["ExecutionItem", "execution-product-page-demo", "Metric", "metric-qualified-signups", "INFLUENCED", 0.81, "Product-page demo reduced skepticism and influenced qualified signups."],
  ["ExecutionItem", "execution-blog-004-internal-links", "Metric", "metric-organic-traffic", "SUPPORTED", 0.79, "Internal links supported organic traffic growth."],
  ["ExecutionItem", "execution-vpi-faq", "Metric", "metric-search-impressions", "SUPPORTED", 0.76, "VPI FAQ supported answer-ready search visibility."],
  ["ExecutionItem", "execution-founder-boundaries", "Metric", "metric-linkedin-impressions", "CORRELATED", 0.69, "Founder post timing correlated with higher LinkedIn engagement."],
  ["ExecutionItem", "execution-futurepedia-submit", "Metric", "metric-directory-approvals", "INFLUENCED", 0.72, "Futurepedia submission influenced approval volume but with lag."],
  ["ExecutionItem", "execution-ai-video-tools-backlink", "Metric", "metric-referring-domains", "SUPPORTED", 0.74, "Backlink follow-up supported referring-domain growth."],
  ["ExecutionItem", "execution-pinterest-proof-pin-2", "Metric", "metric-pinterest-impressions", "INFLUENCED", 0.7, "Proof pin influenced Pinterest impressions."],
  ["Question", "question-product-page-to-video", "Metric", "metric-qualified-signups", "CORRELATED", 0.67, "Commercial question demand correlates with qualified signup lift."],
  ["Entity", "entity-video-production-intelligence", "Metric", "metric-ai-mentions", "SUPPORTED", 0.75, "VPI entity clarity supported answer-engine mentions."],
  ["ExecutionItem", "execution-directory-copy-bank", "Metric", "metric-backlinks", "INFLUENCED", 0.73, "Directory copy bank influenced backlink conversion readiness."]
] as const).map(([sourceType, sourceId, targetType, targetId, attributionType, confidenceScore, evidence], index) => ({
  id: `attribution-${String(index + 1).padStart(2, "0")}`,
  sourceType,
  sourceId,
  targetType,
  targetId,
  attributionType: attributionType as AttributionType,
  confidenceScore,
  evidence,
  ...scoped(index)
}));

const strategyAdjustments: StrategyAdjustment[] = ([
  ["Increase product-page-to-video demo content", "Increase focus on product-page-to-video demo content across launch and BOFU assets.", "INCREASE_FOCUS", "learning-02", "objective-demo-assets", "plan-product-hunt-follow-up", "PROPOSED", "CRITICAL", "Commercial-intent questions and signup movement point to demo-led demand."],
  ["Increase founder-led posts", "Increase founder-led posts around proof, quality, and workflow intelligence.", "INCREASE_FOCUS", "learning-05", "objective-own-vpi", "plan-vpi-authority", "PROPOSED", "HIGH", "Founder posts generated better qualitative comments than company-only posts."],
  ["Create more answer-ready FAQ sections", "Create more FAQ sections for Purpose-Specific AI, VPI, and Product Page to Video.", "UPDATE_CONTENT_CLUSTER", "learning-08", "objective-aeo-geo", "plan-aeo-geo-visibility", "PROPOSED", "HIGH", "FAQ coverage improved search visibility and AI mentions."],
  ["Slow low-quality directory submissions", "Slow low-quality directory submissions and prioritize higher-authority listings.", "DECREASE_FOCUS", "learning-03", "objective-authority", "plan-directory-submission", "PROPOSED", "MEDIUM", "Directory approvals lag submission volume."],
  ["Increase AEO content around Purpose-Specific AI", "Increase AEO content around Purpose-Specific AI definitions and use cases.", "INCREASE_FOCUS", "learning-14", "objective-aeo-geo", "plan-aeo-geo-visibility", "ACCEPTED", "HIGH", "Purpose-Specific AI language needs repeated answer-ready reinforcement."],
  ["Create proof-first landing page sections", "Create proof-first landing page sections before heavier BOFU conversion pushes.", "UPDATE_POSITIONING", "learning-06", "objective-demo-assets", "plan-product-hunt-follow-up", "PROPOSED", "CRITICAL", "Demo proof is needed before pushing conversion messaging harder."],
  ["Prioritize evidence before BOFU posts", "Prioritize demo evidence before BOFU conversion posts and community replies.", "UPDATE_CHANNEL_PRIORITY", "learning-06", "objective-demo-assets", "plan-product-hunt-follow-up", "PROPOSED", "CRITICAL", "Conversion recommendations should wait for visible proof assets."],
  ["Extend authority timeline", "Extend authority plan timeline and add follow-up volume.", "CREATE_NEW_PLAN", "learning-03", "objective-authority", "plan-directory-submission", "PROPOSED", "HIGH", "Actual directory approvals are lower than predicted backlinks."],
  ["Add internal links by default", "Add internal-link tasks to every new authority article plan.", "UPDATE_CONTENT_CLUSTER", "learning-15", "objective-own-vpi", "plan-vpi-authority", "IMPLEMENTED", "HIGH", "Internal links strengthened the VPI cluster."],
  ["Create proof-quality experiment", "Create an experiment testing proof-first versus claim-first demo sections.", "CREATE_EXPERIMENT", "learning-13", "objective-demo-assets", "plan-product-hunt-follow-up", "PROPOSED", "HIGH", "Quality claims require evidence to reduce skepticism."]
] as const).map(([title, description, adjustmentType, sourceLearningId, objectiveId, planId, status, priority, reasoning], index) => ({
  id: `strategy-adjustment-${String(index + 1).padStart(2, "0")}`,
  title,
  description,
  adjustmentType: adjustmentType as StrategyAdjustmentType,
  sourceLearningId,
  objectiveId,
  planId,
  status: status as StrategyAdjustmentStatus,
  priority: priority as Priority,
  reasoning,
  ...scoped(index)
}));

const recommendedActions: RecommendedAction[] = [
  ["CREATE_DEMO", "Pattern", "pattern-01", "Create product-page-to-video demo from a real ecommerce page.", "CRITICAL", "objective-demo-assets", "pattern-01"],
  ["WRITE_BLOG", "Pattern", "pattern-03", "Publish Video Production Intelligence category article.", "CRITICAL", "objective-own-vpi", "pattern-03"],
  ["CREATE_FAQ", "Pattern", "pattern-07", "Create FAQ block for Purpose-Specific AI and product-page-to-video.", "HIGH", "objective-aeo-geo", "pattern-07"],
  ["SUBMIT_DIRECTORY", "Pattern", "pattern-06", "Submit VidMaker to five AI video directories this week.", "HIGH", "objective-authority", "pattern-06"],
  ["ADD_INTERNAL_LINK", "Pattern", "pattern-03", "Link BLOG-002, BLOG-003, and BLOG-004 into one authority cluster.", "HIGH", "objective-own-vpi", "pattern-03"],
  ["CREATE_X_THREAD", "Pattern", "pattern-04", "Turn the product-page demo into an X thread.", "HIGH", "objective-product-hunt", "pattern-04"],
  ["CREATE_PINTEREST_PIN", "Pattern", "pattern-01", "Create Pinterest pin from product-page-to-video workflow.", "MEDIUM", "objective-product-hunt", "pattern-01"],
  ["REPLY_TO_COMMUNITY", "Pattern", "pattern-04", "Reply to Product Hunt example requests with demo proof.", "CRITICAL", "objective-product-hunt", "pattern-04"],
  ["UPDATE_LANDING_PAGE", "Pattern", "pattern-01", "Add source-to-output proof to product-page-to-video landing page.", "CRITICAL", "objective-demo-assets", "pattern-01"],
  ["CREATE_COMPANY_POST", "Pattern", "pattern-05", "Publish LinkedIn company post on workflow intelligence.", "HIGH", "objective-own-vpi", "pattern-05"],
  ["CREATE_FOUNDER_POST", "Pattern", "pattern-02", "Publish founder post contrasting VidMaker with simple text-to-video tools.", "HIGH", "objective-own-vpi", "pattern-02"],
  ["REACH_OUT_FOR_BACKLINK", "Pattern", "pattern-06", "Pitch Video Production Intelligence definition to AI workflow newsletters.", "HIGH", "objective-authority", "pattern-06"],
  ["CREATE_DEMO", "Pattern", "pattern-08", "Create 4K proof clip showing quality and control.", "HIGH", "objective-demo-assets", "pattern-08"],
  ["WRITE_BLOG", "Pattern", "pattern-02", "Write comparison article on workflow AI versus generic AI video generators.", "HIGH", "objective-aeo-geo", "pattern-02"],
  ["FOLLOW_UP", "Pattern", "pattern-01", "Review kernel priority list and assign owners for the week.", "HIGH", "objective-product-hunt", "pattern-01"],
  [
    "CREATE_DEMO",
    "IntelligenceObject",
    "intelligence-product-page-to-video-demo",
    "Create product-page-to-video demo showing a product page URL becoming a ready-to-post video.",
    "CRITICAL"
  ],
  ["CREATE_DEMO", "Question", "question-product-page-to-video", "Create a product-page-to-video demo and publish it across LinkedIn, X, Product Hunt update, and blog.", "CRITICAL"],
  ["WRITE_BLOG", "ContentAsset", "content-blog-004", "Publish BLOG-004: What Is Video Production Intelligence?", "CRITICAL"],
  ["ADD_INTERNAL_LINK", "ContentAsset", "content-blog-004", "Add internal links from BLOG-002 and BLOG-003 to BLOG-004.", "HIGH"],
  ["SUBMIT_DIRECTORY", "DirectorySubmission", "directory-ai-video-tools", "Submit VidMaker to Futurepedia and Toolify.", "HIGH"],
  ["CREATE_FAQ", "Question", "question-video-production-intelligence", "Create FAQ section explaining Purpose-Specific AI.", "HIGH"],
  ["CREATE_X_THREAD", "Question", "question-product-page-to-video", "Turn the product-page-to-video workflow into a short X thread.", "HIGH"],
  ["CREATE_FOUNDER_POST", "Insight", "insight-url-to-video-trust", "Publish founder narrative about coherent URL-to-video workflows.", "HIGH"],
  ["CREATE_COMPANY_POST", "Campaign", "campaign-product-page-to-video-proof", "Announce the Product Page to Video Proof Sprint on LinkedIn.", "HIGH"],
  ["CREATE_PINTEREST_PIN", "ContentAsset", "content-blog-004", "Create a Pinterest visual for product-page-to-video use cases.", "MEDIUM"],
  ["REACH_OUT_FOR_BACKLINK", "Backlink", "backlink-ai-video-tools-directory", "Follow up on AI Video Tools backlink approval.", "HIGH"],
  ["REPLY_TO_COMMUNITY", "Observation", "observation-01", "Reply to Product Hunt comments with the strongest demo example.", "CRITICAL"],
  ["CREATE_EXPERIMENT", "Hypothesis", "hypothesis-product-page-demo-trust", "Create experiment from product-page demo trust hypothesis.", "CRITICAL"],
  ["UPDATE_LANDING_PAGE", "Entity", "entity-product-page-to-video", "Update product-page-to-video landing page with source-to-output proof.", "HIGH"],
  ["REVIEW_COMPETITOR", "Competitor", "competitor-synthesia", "Review Synthesia complaints around output coherence.", "HIGH"],
  ["FOLLOW_UP", "Experiment", "experiment-product-page-demo-series", "Check first week signal from demo distribution experiment.", "HIGH"],
  ["WRITE_BLOG", "Question", "question-purpose-specific-ai", "Draft Purpose-Specific AI comparison article.", "HIGH"],
  ["ADD_INTERNAL_LINK", "ContentAsset", "content-blog-002", "Link BLOG-002 to Product Page to Video and Purpose Engines entities.", "MEDIUM"],
  ["REPLY_TO_COMMUNITY", "PainPoint", "painpoint-output-coherence-proof", "Answer community objections about coherent output quality.", "CRITICAL"],
  ["REACH_OUT_FOR_BACKLINK", "ContentAsset", "content-blog-002", "Pitch Video Production Intelligence definition to AI workflow newsletters.", "HIGH"],
  ["FOLLOW_UP", "AIRecommendation", "ai-rec-08", "Convert proof-mode AI recommendation into product task.", "HIGH"]
].map(([actionType, sourceType, sourceId, title, priority, objectiveId, patternId], index) => ({
  id: sourceType === "Pattern" ? `kernel-action-${String(index + 1).padStart(2, "0")}` : `action-${String(index + 1).padStart(2, "0")}`,
  title,
  description: title,
  sourceType,
  sourceId,
  actionType: actionType as ActionType,
  priority: priority as Priority,
  status: (index < 12 ? "PENDING" : "IN_PROGRESS") as ActionStatus,
  dueDate: daysFromNow((index % 7) + 1),
  owner: index % 3 === 0 ? "Growth" : index % 3 === 1 ? "Content" : "Authority",
  reasoning:
    "VGOS detected this as a high-value next move from opportunity scores, events, and intelligence graph context.",
  expectedImpact:
    "Improves VidMaker proof, authority, answer coverage, community engagement, or experiment velocity.",
  objectiveId,
  patternId,
  ...scoped(index)
}));

const eventTypes: EventType[] = [
  "OBSERVATION_CREATED",
  "OBSERVATION_CREATED",
  "OBSERVATION_CREATED",
  "QUESTION_CREATED",
  "QUESTION_CREATED",
  "PAIN_POINT_CREATED",
  "PAIN_POINT_CREATED",
  "CONTENT_ASSET_CREATED",
  "CONTENT_ASSET_CREATED",
  "CONTENT_ASSET_CREATED",
  "AI_RECOMMENDATION_CREATED",
  "AI_RECOMMENDATION_CREATED",
  "EXPERIMENT_STARTED",
  "EXPERIMENT_STARTED",
  "EXPERIMENT_COMPLETED",
  "DIRECTORY_SUBMITTED",
  "BACKLINK_LIVE",
  "COMPETITOR_MENTIONED",
  "HIGH_OPPORTUNITY_DETECTED",
  "HIGH_OPPORTUNITY_DETECTED"
];

const eventTitles = [
  "Product Hunt comment asked whether VidMaker can turn product pages into ready-to-post videos.",
  "LinkedIn proof-quality observation captured.",
  "Reddit manual-cleanup objection captured.",
  "Product-page-to-video question created from community demand.",
  "Video Production Intelligence category question created.",
  "Output coherence proof pain point created.",
  "Template-first workflow pain point created.",
  "BLOG-002 content asset created.",
  "BLOG-003 content asset created.",
  "BLOG-004 content asset created.",
  "AI recommendation created for BLOG-004 proof examples.",
  "AI recommendation created for URL-to-video proof mode.",
  "Product-page-to-video demo experiment started.",
  "Community reply experiment queued.",
  "Directory category copy experiment completed placeholder created.",
  "AI Video Tools directory submission created.",
  "Directory backlink moved into monitoring.",
  "Synthesia mentioned in output-coherence complaints.",
  "High opportunity detected for product-page-to-video question.",
  "High opportunity detected for output coherence pain point."
];

const kernelEventTypes: EventType[] = [
  "MEMORY_CREATED",
  "MEMORY_CREATED",
  "MEMORY_UPDATED",
  "PATTERN_DETECTED",
  "PATTERN_DETECTED",
  "REASONING_TRACE_CREATED",
  "OBJECTIVE_CREATED",
  "OBJECTIVE_CREATED",
  "KEY_RESULT_UPDATED",
  "KEY_RESULT_UPDATED",
  "AGENT_RUN_STARTED",
  "AGENT_RUN_COMPLETED",
  "AGENT_RUN_COMPLETED",
  "HIGH_IMPACT_ACTION_SELECTED",
  "HIGH_IMPACT_ACTION_SELECTED",
  "MEMORY_UPDATED",
  "PATTERN_DETECTED",
  "REASONING_TRACE_CREATED",
  "AGENT_RUN_STARTED",
  "AGENT_RUN_COMPLETED"
];

const kernelEvents: Event[] = kernelEventTypes.map((eventType, index) => ({
  id: `kernel-event-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  eventType,
  sourceType: index % 3 === 0 ? "Memory" : index % 3 === 1 ? "Pattern" : "AgentRun",
  sourceId:
    index % 3 === 0
      ? memories[index % memories.length].id
      : index % 3 === 1
        ? patterns[index % patterns.length].id
        : agentRuns[index % agentRuns.length].id,
  title: `Kernel event ${index + 1}: ${formatEnum(eventType)}`,
  description: `VGOS Intelligence Kernel produced ${formatEnum(eventType)} for VidMaker.`,
  metadata: { phase: "alpha", generatedBy: "kernel-seed" },
  severity: (index < 5 || eventType === "HIGH_IMPACT_ACTION_SELECTED" ? "CRITICAL" : "HIGH") as EventSeverity,
  status: (index < 4 ? "PENDING" : "PROCESSED") as EventStatus,
  createdAt: daysAgo(index),
  processedAt: index < 4 ? undefined : daysAgo(index - 1)
}));

const growthEvents: Event[] = eventTitles.map((title, index) => ({
  id: `event-${String(index + 1).padStart(2, "0")}`,
  organizationId: orgId,
  workspaceId,
  eventType: eventTypes[index],
  sourceType: index < 3 ? "Observation" : index < 5 ? "Question" : index < 7 ? "PainPoint" : "GrowthObject",
  sourceId: index < 3 ? observations[index].id : index < 5 ? questions[index - 3].id : index < 7 ? painPoints[index - 5].id : `source-${index + 1}`,
  title,
  description: title,
  metadata: { sprint: 4, generatedBy: "local-seed" },
  severity: (index === 0 || index === 3 || index === 5 || index > 17 ? "CRITICAL" : index < 14 ? "HIGH" : "MEDIUM") as EventSeverity,
  status: (index < 6 ? "PENDING" : "PROCESSED") as EventStatus,
  createdAt: daysAgo(index),
  processedAt: index < 6 ? undefined : daysAgo(index - 1)
}));

const events: Event[] = [...kernelEvents, ...growthEvents];

const briefingSections: BriefingSection[] = [
  {
    id: "briefing-market-signals",
    title: "Market Signals",
    summary: "Recent observations and conversations point to strong URL-to-video demand.",
    items: [
      "Product Hunt and LinkedIn comments ask for product-page-to-video proof.",
      "Reddit objections focus on manual cleanup and output coherence.",
      "Competitor reviews leave a positioning gap for production intelligence."
    ]
  },
  {
    id: "briefing-content-opportunities",
    title: "Content Opportunities",
    summary: "Questions and pain points should become proof-led content.",
    items: [
      "Finish BLOG-004 with source-to-output demo examples.",
      "Add FAQ blocks for Purpose-Specific AI and Video Production Intelligence.",
      "Create short social variants from the product-page-to-video workflow."
    ]
  },
  {
    id: "briefing-authority-opportunities",
    title: "Authority Opportunities",
    summary: "Directory and backlink actions can reinforce category language.",
    items: [
      "Submit VidMaker to Futurepedia and Toolify.",
      "Follow up on AI Video Tools backlink approval.",
      "Pitch Video Production Intelligence definition to AI workflow newsletters."
    ]
  },
  {
    id: "briefing-product-opportunities",
    title: "Product Opportunities",
    summary: "Output coherence proof is the strongest product signal.",
    items: [
      "Convert proof-mode recommendation into a product task.",
      "Show source traceability in demos and landing pages.",
      "Use competitor complaints to shape product messaging."
    ]
  },
  {
    id: "briefing-recommended-focus",
    title: "Recommended Focus",
    summary: "Top 3 actions for the week.",
    items: [
      "Publish the strongest product-page-to-video demo.",
      "Ship BLOG-004 and internal links from BLOG-002/BLOG-003.",
      "Run the demo distribution experiment across LinkedIn, X, Product Hunt, and blog."
    ]
  }
];

export const initialPlatformState: PlatformState = {
  organizations: [
    {
      id: orgId,
      name: "APJ Labs",
      slug: "apj-labs",
      website: "https://apjlabs.com",
      description: "APJ Labs operates growth intelligence systems for product-led teams."
    }
  ],
  workspaces: [
    {
      id: workspaceId,
      name: "VidMaker Growth OS",
      slug: "vidmaker-growth-os",
      organizationId: orgId
    }
  ],
  personas,
  observations,
  insights,
  hypotheses,
  experiments,
  outcomes: [
    {
      id: "outcome-product-page-demo-series",
      title: "Pending outcome for product-page-to-video demo series",
      experimentId: "experiment-product-page-demo-series",
      metricName: "trial_conversion_rate",
      resultSummary: "",
      learnings: "",
      ...scoped(0)
    }
  ],
  conversations: [
    {
      id: "conversation-url-to-video-demand",
      title: "URL-to-video demand is appearing across launch channels",
      description:
        "Product Hunt, LinkedIn, Reddit, and X comments ask whether VidMaker can transform URLs and product pages into coherent finished videos.",
      source: "Product Hunt + LinkedIn + Reddit + X",
      url: "https://vidmaker.com",
      status: "RESEARCHING",
      priority: "CRITICAL",
      owner: "Community Intelligence",
      ...scoped(0)
    }
  ],
  questions,
  painPoints,
  contentAssets,
  keywords,
  entities,
  communities,
  competitors,
  directorySubmissions: [
    {
      id: "directory-ai-video-tools",
      name: "AI Video Tools Directory",
      title: "AI Video Tools Directory",
      description: "Authority-building directory submission for VidMaker and product-page-to-video workflows.",
      source: "Authority & Backlink Engine",
      url: "https://example.com/ai-video-tools",
      status: "SUBMITTED",
      priority: "HIGH",
      owner: "Authority",
      backlinkIds: ["backlink-ai-video-tools-directory"],
      ...scoped(1)
    }
  ],
  backlinks: [
    {
      id: "backlink-ai-video-tools-directory",
      title: "VidMaker listing backlink",
      description: "Backlink expected from the AI Video Tools Directory after moderation approval.",
      source: "AI Video Tools Directory",
      url: "https://example.com/ai-video-tools/vidmaker",
      targetUrl: "https://vidmaker.com",
      status: "SUBMITTED",
      priority: "HIGH",
      owner: "Authority",
      directorySubmissionId: "directory-ai-video-tools",
      ...scoped(1)
    }
  ],
  campaigns: [
    {
      id: "campaign-product-page-to-video-proof",
      name: "Product Page to Video Proof Sprint",
      title: "Product Page to Video Proof Sprint",
      description: "Sprint to publish URL-to-video demos, answer-engine content, and social proof.",
      source: "Weekly Sprint Planner",
      url: "https://vidmaker.com",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      owner: "Growth",
      personaIds: ["persona-ecommerce-brand", "persona-saas-team", "persona-agency"],
      contentAssetIds: ["content-blog-002", "content-blog-003", "content-blog-004"],
      taskIds: ["task-demo-examples", "task-blog-proof"],
      ...scoped(0)
    }
  ],
  tasks: [
    {
      id: "task-demo-examples",
      title: "Create three product-page-to-video demo examples",
      description: "Create three product-page-to-video demos for the proof sprint.",
      source: "Weekly Sprint Planner",
      url: "https://vidmaker.com",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      owner: "Growth",
      campaignId: "campaign-product-page-to-video-proof",
      dueAt: daysFromNow(3),
      ...scoped(0)
    }
  ],
  featureRequests: [
    {
      id: "feature-url-to-video-proof-mode",
      title: "URL-to-video proof mode",
      description: "Generate a coherent product-page-to-video demo with traceable source sections and scene logic.",
      source: "Pain point synthesis",
      url: "https://vidmaker.com",
      status: "NOT_STARTED",
      priority: "CRITICAL",
      owner: "Product",
      painPointId: "painpoint-output-coherence-proof",
      personaIds: ["persona-ecommerce-brand", "persona-saas-team"],
      ...scoped(0)
    }
  ],
  knowledgeNodes,
  knowledgeEdges,
  aiRecommendations,
  intelligenceObjects,
  memories,
  patterns,
  reasoningTraces,
  objectives,
  keyResults,
  agents,
  agentRuns,
  knowledgeObjects,
  knowledgeRelationships,
  memorySnapshots,
  workflows,
  workflowSteps,
  workflowRuns,
  agentHandoffs,
  plans,
  milestones,
  planItems,
  planDependencies,
  planConstraints,
  predictedOutcomes,
  resourceCapacities,
  executionItems,
  executionEvidence,
  executionBlockers,
  approvalRequests,
  executionResults,
  metrics,
  measurements,
  learnings,
  attributions,
  strategyAdjustments,
  events,
  recommendedActions,
  briefingSections
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatEnum(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function calculateOpportunityScore(item: ScoredOpportunity) {
  return score(
    item.businessValueScore,
    item.painSeverityScore,
    item.trendScore,
    item.authorityGapScore,
    item.competitionScore
  );
}

export function getExecutiveMetrics(state: PlatformState, activeWorkspaceId: string) {
  const observations = state.observations.filter((item) => item.workspaceId === activeWorkspaceId);
  const insights = state.insights.filter((item) => item.workspaceId === activeWorkspaceId);
  const hypotheses = state.hypotheses.filter((item) => item.workspaceId === activeWorkspaceId);
  const experiments = state.experiments.filter((item) => item.workspaceId === activeWorkspaceId);
  const recommendations = state.aiRecommendations.filter((item) => item.workspaceId === activeWorkspaceId);
  const intelligenceObjects = state.intelligenceObjects.filter((item) => item.workspaceId === activeWorkspaceId);
  const memories = state.memories.filter((item) => item.workspaceId === activeWorkspaceId);
  const patterns = state.patterns.filter((item) => item.workspaceId === activeWorkspaceId);
  const objectives = state.objectives.filter((item) => item.workspaceId === activeWorkspaceId);
  const agentRuns = state.agentRuns.filter((item) => item.workspaceId === activeWorkspaceId);
  const reasoningTraces = state.reasoningTraces.filter((item) => item.workspaceId === activeWorkspaceId);
  const knowledgeObjects = state.knowledgeObjects.filter((item) => item.workspaceId === activeWorkspaceId);
  const knowledgeRelationships = state.knowledgeRelationships.filter((item) => item.workspaceId === activeWorkspaceId);
  const workflows = state.workflows.filter((item) => item.workspaceId === activeWorkspaceId);
  const workflowRuns = state.workflowRuns.filter((item) => item.workspaceId === activeWorkspaceId);
  const agentHandoffs = state.agentHandoffs.filter((item) => item.workspaceId === activeWorkspaceId);
  const plans = state.plans.filter((item) => item.workspaceId === activeWorkspaceId);
  const planItems = state.planItems.filter((item) => item.workspaceId === activeWorkspaceId);
  const predictedOutcomes = state.predictedOutcomes.filter((item) => item.workspaceId === activeWorkspaceId);
  const resourceCapacities = state.resourceCapacities.filter((item) => item.workspaceId === activeWorkspaceId);
  const executionItems = state.executionItems.filter((item) => item.workspaceId === activeWorkspaceId);
  const executionEvidence = state.executionEvidence.filter((item) => item.workspaceId === activeWorkspaceId);
  const executionBlockers = state.executionBlockers.filter((item) => item.workspaceId === activeWorkspaceId);
  const approvalRequests = state.approvalRequests.filter((item) => item.workspaceId === activeWorkspaceId);
  const executionResults = state.executionResults.filter((item) => item.workspaceId === activeWorkspaceId);
  const metricRecords = state.metrics.filter((item) => item.workspaceId === activeWorkspaceId);
  const measurements = state.measurements.filter((item) => item.workspaceId === activeWorkspaceId);
  const learnings = state.learnings.filter((item) => item.workspaceId === activeWorkspaceId);
  const attributions = state.attributions.filter((item) => item.workspaceId === activeWorkspaceId);
  const strategyAdjustments = state.strategyAdjustments.filter((item) => item.workspaceId === activeWorkspaceId);
  const highImpactActions = state.recommendedActions.filter(
    (item) => item.workspaceId === activeWorkspaceId && ["HIGH", "CRITICAL"].includes(item.priority)
  );
  const questions = state.questions.filter((item) => item.workspaceId === activeWorkspaceId);
  const painPoints = state.painPoints.filter((item) => item.workspaceId === activeWorkspaceId);
  const highPriorityOpportunities = [
    ...questions.filter((item) => ["HIGH", "CRITICAL"].includes(item.priority)),
    ...painPoints.filter((item) => ["HIGH", "CRITICAL"].includes(item.priority)),
    ...intelligenceObjects.filter((item) => item.opportunityScore >= 80)
  ].length;
  const confidenceValues = [
    ...observations.map((item) => item.confidenceScore),
    ...insights.map((item) => item.confidenceScore),
    ...hypotheses.map((item) => item.confidenceScore),
    ...recommendations.map((item) => item.confidenceScore),
    ...intelligenceObjects.map((item) => item.confidenceScore)
  ];
  const averageConfidence =
    confidenceValues.reduce((total, value) => total + value, 0) /
    Math.max(confidenceValues.length, 1);
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const predictionComparisons = predictedOutcomes
    .map((prediction) => {
      const normalizedPredictionMetric = prediction.metricName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const measurement = measurements.find(
        (item) =>
          item.planId === prediction.planId &&
          state.metrics
            .find((metric) => metric.id === item.metricId)
            ?.name.toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(normalizedPredictionMetric.slice(0, 12))
      );
      if (!measurement) return null;
      const actual = measurement.changeValue ?? measurement.value - (measurement.previousValue ?? 0);
      const predicted = prediction.predictedValue;
      return Math.max(0, Math.min(1, 1 - Math.abs(actual - predicted) / Math.max(Math.abs(predicted), 1)));
    })
    .filter((item): item is number => item !== null);
  const predictionAccuracy =
    predictionComparisons.reduce((total, value) => total + value, 0) /
    Math.max(predictionComparisons.length, 1);

  return {
    totalObservations: observations.length,
    totalInsights: insights.length,
    totalHypotheses: hypotheses.length,
    totalIntelligenceObjects: intelligenceObjects.length,
    totalConversations: state.conversations.filter((item) => item.workspaceId === activeWorkspaceId).length,
    totalQuestions: questions.length,
    totalContentAssets: state.contentAssets.filter((item) => item.workspaceId === activeWorkspaceId).length,
    totalKeywords: state.keywords.filter((item) => item.workspaceId === activeWorkspaceId).length,
    totalBacklinks: state.backlinks.filter((item) => item.workspaceId === activeWorkspaceId).length,
    totalDirectorySubmissions: state.directorySubmissions.filter((item) => item.workspaceId === activeWorkspaceId).length,
    totalAIRecommendations: recommendations.length,
    highPriorityOpportunities,
    activeMemories: memories.filter((item) => item.status !== "ARCHIVED").length,
    detectedPatterns: patterns.filter((item) => item.status !== "ARCHIVED").length,
    activeObjectives: objectives.filter((item) => item.status === "IN_PROGRESS").length,
    agentRuns: agentRuns.length,
    reasoningTraces: reasoningTraces.length,
    highImpactActions: highImpactActions.length,
    totalKnowledgeObjects: knowledgeObjects.length,
    totalKnowledgeRelationships: knowledgeRelationships.length,
    topEntities: knowledgeObjects.filter((item) => item.objectType === "ENTITY").length,
    topTopics: knowledgeObjects.filter((item) => item.tags.includes("category") || item.tags.includes("use-case")).length,
    knowledgeGaps: knowledgeObjects.filter((item) => item.confidenceScore < 0.8).length,
    activeWorkflows: workflows.filter((item) => item.status === "LIVE" || item.status === "IN_PROGRESS").length,
    recentWorkflowRuns: workflowRuns.length,
    failedWorkflowRuns: workflowRuns.filter((item) => item.status === "DISMISSED").length,
    workflowsWaitingForApproval: workflowRuns.filter((item) => item.status === "PENDING").length,
    activeAgents: state.agents.filter((item) => item.workspaceId === activeWorkspaceId && item.status === "LIVE").length,
    pendingHandoffs: agentHandoffs.filter((item) => item.status === "PENDING").length,
    activePlans: plans.filter((item) => item.status === "ACTIVE").length,
    draftPlans: plans.filter((item) => item.status === "DRAFT").length,
    overduePlanItems: planItems.filter(
      (item) => item.status !== "COMPLETED" && item.status !== "ARCHIVED" && new Date(item.dueDate).getTime() < Date.now()
    ).length,
    blockedPlanItems: planItems.filter((item) => item.status === "BLOCKED").length,
    predictedOutcomes: predictedOutcomes.length,
    resourceCapacityHours: resourceCapacities.reduce((total, item) => total + item.weeklyHours, 0),
    readyExecutions: executionItems.filter((item) => item.status === "READY").length,
    inProgressExecutions: executionItems.filter((item) => item.status === "IN_PROGRESS").length,
    blockedExecutions: executionItems.filter((item) => item.status === "BLOCKED").length,
    pendingApprovals: approvalRequests.filter((item) => item.status === "REQUESTED" || item.status === "CHANGES_REQUESTED").length,
    completedExecutionsThisWeek: executionItems.filter(
      (item) => item.status === "COMPLETED" && item.completedAt && new Date(item.completedAt).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
    evidenceAdded: executionEvidence.length,
    executionResults: executionResults.length,
    openExecutionBlockers: executionBlockers.filter((item) => item.status === "OPEN" || item.status === "IN_REVIEW").length,
    metricsTracked: metricRecords.length,
    measurementsThisWeek: measurements.filter((item) => new Date(item.measuredAt).getTime() >= oneWeekAgo).length,
    highConfidenceLearnings: learnings.filter((item) => item.confidenceScore >= 0.8).length,
    pendingStrategyAdjustments: strategyAdjustments.filter((item) => item.status === "PROPOSED").length,
    objectiveMetricsImproved: new Set(
      measurements.filter((item) => item.objectiveId && (item.changeValue ?? 0) > 0).map((item) => item.objectiveId)
    ).size,
    predictionAccuracy,
    metricsNeedingAttention: metricRecords.filter((item) => item.status === "WATCH" || item.status === "DECLINING" || item.status === "STALLED").length,
    attributionsCreated: attributions.length,
    planHealthScore: Math.round(
      Math.max(
        0,
        100 -
          planItems.filter((item) => item.status === "BLOCKED").length * 8 -
          planItems.filter(
            (item) => item.status !== "COMPLETED" && item.status !== "ARCHIVED" && new Date(item.dueDate).getTime() < Date.now()
          ).length *
            5
      )
    ),
    activeExperiments: experiments.filter((item) => item.status === "IN_PROGRESS").length,
    completedExperiments: experiments.filter((item) => item.status === "LIVE" || item.status === "PUBLISHED").length,
    averageConfidence,
    highOpportunityQuestions: state.questions.filter(
      (item) => item.workspaceId === activeWorkspaceId && item.opportunityScore >= 3500
    ).length,
    highOpportunityPainPoints: state.painPoints.filter(
      (item) => item.workspaceId === activeWorkspaceId && item.opportunityScore >= 3500
    ).length,
    highOpportunityIntelligenceObjects: intelligenceObjects.filter((item) => item.opportunityScore >= 80).length,
    aiRecommendationsPending: recommendations.filter(
      (item) => !["LIVE", "PUBLISHED", "ARCHIVED"].includes(item.status)
    ).length,
    knowledgeGraphNodes: state.knowledgeNodes.filter((item) => item.workspaceId === activeWorkspaceId).length,
    knowledgeGraphEdges: state.knowledgeEdges.filter((item) => item.workspaceId === activeWorkspaceId).length
  };
}

export function getTitle(item: Record<string, unknown>) {
  return String(item.title ?? item.name ?? item.topic ?? item.label ?? item.id ?? "Untitled");
}

export function getOpportunityItems(state: PlatformState, activeWorkspaceId: string) {
  return [
    ...state.questions
      .filter((item) => item.workspaceId === activeWorkspaceId)
      .map((item) => ({ ...item, opportunityKind: "Question" as const })),
    ...state.painPoints
      .filter((item) => item.workspaceId === activeWorkspaceId)
      .map((item) => ({ ...item, opportunityKind: "PainPoint" as const }))
  ].sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function createScopedId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

export function createDefaultRecord(collection: CollectionKey, activeWorkspaceId: string): Record<string, unknown> {
  const date = new Date().toISOString();
  const base = {
    id: createScopedId(collection),
    organizationId: orgId,
    workspaceId: activeWorkspaceId,
    createdAt: date,
    updatedAt: date
  };

  if (collection === "observations") {
    return {
      ...base,
      title: "New observation",
      source: "Manual",
      sourceUrl: "https://vidmaker.com",
      rawText: "",
      summary: "",
      platform: "LinkedIn",
      sentiment: "neutral",
      confidenceScore: 0.7
    };
  }

  if (collection === "conversations") {
    return {
      ...base,
      title: "New conversation",
      description: "",
      source: "Community Intelligence",
      url: "https://vidmaker.com",
      status: "RESEARCHING",
      priority: "HIGH",
      owner: "Community Intelligence"
    };
  }

  if (collection === "insights") {
    return {
      ...base,
      title: "New insight",
      summary: "",
      strategicImplication: "",
      evidence: "",
      confidenceScore: 0.7
    };
  }

  if (collection === "hypotheses") {
    return {
      ...base,
      title: "New hypothesis",
      statement: "",
      expectedOutcome: "",
      relatedMetric: "",
      confidenceScore: 0.7,
      status: "RESEARCHING"
    };
  }

  if (collection === "experiments") {
    return {
      ...base,
      title: "New experiment",
      description: "",
      channel: "Blog",
      successMetric: "",
      result: "",
      status: "NOT_STARTED"
    };
  }

  if (collection === "outcomes") {
    return {
      ...base,
      title: "New outcome",
      metricName: "",
      metricBefore: 0,
      metricAfter: 0,
      resultSummary: "",
      learnings: ""
    };
  }

  if (collection === "personas") {
    return {
      ...base,
      name: "New persona",
      description: "",
      industry: "",
      buyingIntent: "",
      primaryPainPoint: "",
      contentNeeds: ""
    };
  }

  if (collection === "knowledgeNodes") {
    return {
      ...base,
      label: "New knowledge node",
      type: "Signal",
      description: "",
      sourceType: "Manual",
      sourceId: ""
    };
  }

  if (collection === "knowledgeEdges") {
    return {
      ...base,
      fromNodeId: "",
      toNodeId: "",
      relationshipType: "RELATED_TO",
      strength: 0.5,
      notes: ""
    };
  }

  if (collection === "contentAssets") {
    return {
      ...base,
      code: `CONTENT-${Date.now()}`,
      title: "New content asset",
      description: "",
      source: "Content Engine",
      url: "https://vidmaker.com",
      status: "NOT_STARTED",
      priority: "HIGH",
      owner: "Content",
      contentType: "BLOG",
      intent: "INFORMATIONAL",
      funnelStage: "TOFU",
      personaIds: [],
      questionIds: [],
      keywordIds: [],
      entityIds: [],
      campaignIds: []
    };
  }

  if (collection === "directorySubmissions") {
    return {
      ...base,
      name: "New directory submission",
      title: "New directory submission",
      description: "",
      source: "Authority Engine",
      url: "https://example.com",
      status: "NOT_STARTED",
      priority: "HIGH",
      owner: "Authority",
      backlinkIds: []
    };
  }

  if (collection === "backlinks") {
    return {
      ...base,
      title: "New backlink opportunity",
      description: "",
      source: "Authority Engine",
      url: "https://example.com",
      targetUrl: "https://vidmaker.com",
      status: "NOT_STARTED",
      priority: "HIGH",
      owner: "Authority"
    };
  }

  if (collection === "featureRequests") {
    return {
      ...base,
      title: "New feature request",
      description: "",
      source: "Product Engine",
      url: "https://vidmaker.com",
      status: "NOT_STARTED",
      priority: "HIGH",
      owner: "Product",
      personaIds: []
    };
  }

  if (collection === "keywords") {
    return {
      ...base,
      name: "New keyword",
      title: "New keyword",
      description: "",
      source: "Search Engine",
      url: "https://www.google.com/search?q=vidmaker",
      status: "RESEARCHING",
      priority: "HIGH",
      owner: "SEO Strategy",
      intent: "INFORMATIONAL",
      funnelStage: "TOFU"
    };
  }

  if (collection === "tasks") {
    return {
      ...base,
      title: "New task",
      description: "",
      source: "Recommended Action",
      url: "https://vidmaker.com",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      owner: "Growth"
    };
  }

  if (collection === "events") {
    return {
      ...base,
      eventType: "OBSERVATION_CREATED",
      sourceType: "Manual",
      sourceId: "",
      title: "New event",
      description: "",
      metadata: {},
      severity: "MEDIUM",
      status: "PENDING",
      processedAt: undefined
    };
  }

  if (collection === "recommendedActions") {
    return {
      ...base,
      title: "New recommended action",
      description: "",
      sourceType: "Manual",
      sourceId: "",
      actionType: "FOLLOW_UP",
      priority: "HIGH",
      status: "PENDING",
      dueDate: date,
      owner: "Growth",
      reasoning: "",
      expectedImpact: ""
    };
  }

  if (collection === "memories") {
    return {
      ...base,
      topic: "New memory",
      entity: "VidMaker",
      summary: "",
      sourceTypes: [],
      linkedSourceIds: [],
      firstSeen: date,
      lastSeen: date,
      frequency: 1,
      confidenceScore: 0.7,
      importanceScore: 50,
      status: "RESEARCHING"
    };
  }

  if (collection === "patterns") {
    return {
      ...base,
      title: "New pattern",
      description: "",
      patternType: "CONTENT_GAP",
      relatedEntity: "VidMaker",
      evidence: {},
      frequency: 1,
      trendDirection: "STABLE",
      confidenceScore: 0.7,
      importanceScore: 50,
      status: "RESEARCHING"
    };
  }

  if (collection === "objectives") {
    return {
      ...base,
      title: "New objective",
      description: "",
      category: "CONTENT",
      priority: "HIGH",
      status: "IN_PROGRESS",
      startDate: date,
      endDate: date
    };
  }

  if (collection === "keyResults") {
    return {
      id: createScopedId(collection),
      objectiveId: "objective-own-vpi",
      title: "New key result",
      metricName: "metric",
      targetValue: 1,
      currentValue: 0,
      status: "IN_PROGRESS",
      createdAt: date,
      updatedAt: date
    };
  }

  if (collection === "agents") {
    return {
      ...base,
      name: "New agent",
      title: "New agent",
      description: "",
      agentType: "CONVERSATION_AGENT",
      status: "LIVE",
      mission: "",
      inputSources: [],
      outputTypes: [],
      parentAgentId: undefined,
      dependsOnAgentIds: [],
      handoffRules: {},
      allowedWorkflowIds: [],
      lastRunAt: date
    };
  }

  if (collection === "agentRuns") {
    return {
      id: createScopedId(collection),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      agentId: "",
      status: "COMPLETED",
      inputSummary: "",
      outputSummary: "",
      recommendationsCreated: 0,
      actionsCreated: 0,
      startedAt: date,
      completedAt: date,
      logs: []
    };
  }

  if (collection === "reasoningTraces") {
    return {
      id: createScopedId(collection),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      sourceType: "Manual",
      sourceId: "",
      inputSummary: "",
      reasoningSteps: [],
      conclusion: "",
      confidenceScore: 0.7,
      recommendedActionIds: [],
      createdAt: date
    };
  }

  if (collection === "intelligenceObjects") {
    return {
      ...base,
      sourceType: "Manual",
      sourceId: "",
      summary: "New intelligence object",
      detectedEntities: [],
      detectedKeywords: [],
      detectedIntent: "INFORMATIONAL",
      detectedPersona: "Creator",
      detectedPainPoints: [],
      sentiment: "neutral",
      opportunityScore: 0,
      confidenceScore: 0.7,
      reasoning: ""
    };
  }

  if (collection === "plans") {
    return {
      ...base,
      title: "New execution plan",
      description: "",
      planType: "CONTENT_PLAN",
      status: "DRAFT",
      objectiveId: "",
      startDate: date,
      endDate: daysFromNow(30),
      owner: "Growth",
      expectedOutcome: "",
      confidenceScore: 0.7
    };
  }

  if (collection === "milestones") {
    return {
      ...base,
      planId: "",
      title: "New milestone",
      description: "",
      dueDate: daysFromNow(7),
      status: "NOT_STARTED",
      priority: "HIGH",
      owner: "Growth",
      expectedImpact: "",
      order: 1
    };
  }

  if (collection === "planItems") {
    return {
      ...base,
      planId: "",
      milestoneId: "",
      title: "New plan item",
      description: "",
      itemType: "BLOG",
      sourceType: "Manual",
      sourceId: "",
      priority: "HIGH",
      status: "NOT_STARTED",
      owner: "Growth",
      dueDate: daysFromNow(7),
      estimatedImpactScore: 70,
      estimatedEffortScore: 3
    };
  }

  if (collection === "planDependencies") {
    return {
      ...base,
      planId: "",
      fromItemId: "",
      toItemId: "",
      dependencyType: "SEQUENCED_BEFORE",
      reason: ""
    };
  }

  if (collection === "planConstraints") {
    return {
      ...base,
      planId: "",
      title: "New constraint",
      description: "",
      constraintType: "RESOURCE_LIMITED",
      severity: "MEDIUM"
    };
  }

  if (collection === "predictedOutcomes") {
    return {
      ...base,
      planId: "",
      metricName: "signups",
      predictedValue: 0,
      confidenceScore: 0.7,
      rationale: ""
    };
  }

  if (collection === "resourceCapacities") {
    return {
      ...base,
      owner: "New owner",
      role: "Contributor",
      weeklyHours: 10,
      focusArea: "Planning",
      notes: ""
    };
  }

  if (collection === "executionItems") {
    return {
      ...base,
      planId: "",
      planItemId: "",
      recommendedActionId: "",
      workflowRunId: "",
      objectiveId: "",
      campaignId: "",
      title: "New execution item",
      description: "",
      executionType: "MANUAL_ACTION",
      status: "QUEUED",
      priority: "HIGH",
      owner: "Growth",
      dueDate: daysFromNow(7),
      startedAt: undefined,
      completedAt: undefined,
      sourceType: "Manual",
      sourceId: "",
      expectedImpact: "",
      actualImpact: "",
      notes: ""
    };
  }

  if (collection === "executionEvidence") {
    return {
      ...base,
      executionItemId: "",
      evidenceType: "NOTE",
      title: "New evidence",
      url: "",
      description: "",
      uploadedAssetUrl: "",
      capturedAt: date
    };
  }

  if (collection === "executionBlockers") {
    return {
      ...base,
      executionItemId: "",
      title: "New blocker",
      description: "",
      blockerType: "OTHER",
      severity: "MEDIUM",
      status: "OPEN",
      owner: "Growth",
      resolvedAt: undefined
    };
  }

  if (collection === "approvalRequests") {
    return {
      ...base,
      executionItemId: "",
      title: "New approval request",
      description: "",
      approvalType: "CONTENT_APPROVAL",
      status: "REQUESTED",
      requestedBy: "Growth",
      reviewer: "Approver",
      requestedAt: date,
      reviewedAt: undefined,
      decisionNotes: ""
    };
  }

  if (collection === "executionResults") {
    return {
      ...base,
      executionItemId: "",
      resultType: "LEARNING_CAPTURED",
      summary: "",
      metricName: "",
      metricBefore: 0,
      metricAfter: 0,
      impactScore: 50,
      learning: ""
    };
  }

  if (collection === "metrics") {
    return {
      ...base,
      name: "New metric",
      title: "New metric",
      description: "",
      metricType: "CUSTOM",
      source: "Manual",
      unit: "count",
      currentValue: 0,
      previousValue: 0,
      targetValue: undefined,
      status: "WATCH",
      owner: "Growth"
    };
  }

  if (collection === "measurements") {
    return {
      ...base,
      metricId: "",
      sourceType: "Manual",
      sourceId: "",
      executionItemId: "",
      executionResultId: "",
      planId: "",
      objectiveId: "",
      campaignId: "",
      measuredAt: date,
      value: 0,
      previousValue: 0,
      changeValue: 0,
      changePercent: 0,
      notes: ""
    };
  }

  if (collection === "learnings") {
    return {
      ...base,
      title: "New learning",
      summary: "",
      learningType: "CUSTOM",
      confidenceScore: 0.7,
      sourceType: "Manual",
      sourceId: "",
      metricId: "",
      executionItemId: "",
      planId: "",
      objectiveId: "",
      recommendationImpact: "",
      shouldInformFuturePlans: true
    };
  }

  if (collection === "attributions") {
    return {
      ...base,
      sourceType: "ExecutionItem",
      sourceId: "",
      targetType: "Metric",
      targetId: "",
      attributionType: "INFLUENCED",
      confidenceScore: 0.7,
      evidence: ""
    };
  }

  if (collection === "strategyAdjustments") {
    return {
      ...base,
      title: "New strategy adjustment",
      description: "",
      adjustmentType: "INCREASE_FOCUS",
      sourceLearningId: "",
      objectiveId: "",
      planId: "",
      status: "PROPOSED",
      priority: "HIGH",
      reasoning: ""
    };
  }

  if (collection === "knowledgeObjects") {
    return {
      ...base,
      canonicalId: `KO-${Date.now()}`,
      objectType: "INSIGHT",
      title: "New knowledge object",
      summary: "",
      description: "",
      sourceType: "Manual",
      sourceId: "",
      canonicalEntityId: undefined,
      aliases: [],
      tags: [],
      metadata: {},
      searchableText: "",
      embeddingProvider: undefined,
      embeddingModel: undefined,
      embeddingVector: undefined,
      embeddingUpdatedAt: undefined,
      importanceScore: 50,
      confidenceScore: 0.7,
      status: "RESEARCHING"
    };
  }

  if (collection === "knowledgeRelationships") {
    return {
      ...base,
      fromObjectId: "",
      toObjectId: "",
      relationshipType: "RELATED_TO",
      strength: 0.5,
      evidence: "",
      metadata: {}
    };
  }

  if (collection === "memorySnapshots") {
    return {
      id: createScopedId(collection),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      memoryId: "",
      period: new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" }),
      summary: "",
      frequency: 1,
      importanceScore: 50,
      confidenceScore: 0.7,
      trendDirection: "STABLE",
      notableSources: [],
      createdAt: date
    };
  }

  if (collection === "workflows") {
    return {
      ...base,
      name: "New workflow",
      title: "New workflow",
      description: "",
      workflowType: "OBSERVATION_TO_INSIGHT",
      status: "LIVE",
      triggerType: "MANUAL",
      triggerConfig: {}
    };
  }

  if (collection === "workflowSteps") {
    return {
      id: createScopedId(collection),
      workflowId: "",
      order: 1,
      name: "New workflow step",
      stepType: "CLASSIFY",
      config: {},
      status: "PENDING",
      createdAt: date,
      updatedAt: date
    };
  }

  if (collection === "workflowRuns") {
    return {
      id: createScopedId(collection),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      workflowId: "",
      status: "PENDING",
      triggerSourceType: "Manual",
      triggerSourceId: "manual-run",
      input: {},
      output: {},
      startedAt: date,
      completedAt: undefined,
      logs: []
    };
  }

  if (collection === "agentHandoffs") {
    return {
      id: createScopedId(collection),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      fromAgentId: "",
      toAgentId: "",
      sourceType: "Manual",
      sourceId: "",
      reason: "",
      status: "PENDING",
      createdAt: date,
      completedAt: undefined
    };
  }

  return {
    ...base,
    title: "New recommendation",
    description: "",
    source: "AI Recommendation Engine",
    url: "https://vidmaker.com",
    status: "RESEARCHING",
    priority: "HIGH",
    owner: "Growth Intelligence",
    recommendationType: "BLOG_IDEA",
    targetEntityType: "ContentAsset",
    targetEntityId: "",
    suggestedAction: "",
    reasoning: "",
    confidenceScore: 0.7,
    generatedBy: "VGOS Intelligence Engine"
  };
}
