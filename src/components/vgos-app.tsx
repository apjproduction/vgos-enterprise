"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Database,
  Edit3,
  Filter,
  Plus,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { processIntelligenceRecord } from "@/lib/intelligence-pipeline";
import { buildOpportunityQueue, type OpportunityItem } from "@/lib/opportunity-engine";
import {
  rankRecommendedActions,
  rankOpportunities,
  selectTopDailyPriorities,
  selectTopWeeklyPriorities,
  summarizeObjectiveProgress,
  type RankedAction
} from "@/kernel/decisions/decision-engine";
import { calculateObjectiveHealth } from "@/kernel/goals/goal-engine";
import { runAgent } from "@/kernel/agents/agent-runtime";
import {
  calculateOpportunityScore,
  createDefaultRecord,
  createScopedId,
  formatDate,
  formatEnum,
  getExecutiveMetrics,
  getOpportunityItems,
  getTitle,
  initialPlatformState,
  orgId,
  pageDefinitions,
  workspaceId,
  type ActionStatus,
  type CollectionKey,
  type Objective,
  type PageDefinition,
  type PageId,
  type PlatformState,
  type Priority,
  type RecommendationType,
  type RelationshipType,
  type Status
} from "@/lib/vgos-data";

type AnyRecord = Record<string, any>;
type EditableCollection = CollectionKey;
type FilterValue<T extends string> = "ALL" | T;
type OpportunityFilter =
  | "ALL"
  | "HIGH_OPPORTUNITY"
  | "CRITICAL_OPPORTUNITY"
  | "LOW_COMPETITION"
  | "HIGH_BUSINESS_VALUE";

type DraftState = {
  collection: EditableCollection;
  item: AnyRecord;
  isNew: boolean;
} | null;

type FieldConfig = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "number" | "select" | "tags";
  options?: string[];
};

const statusOptions = [
  "NOT_STARTED",
  "RESEARCHING",
  "IN_PROGRESS",
  "PUBLISHED",
  "SUBMITTED",
  "LIVE",
  "ARCHIVED",
  "PENDING",
  "PROCESSED",
  "COMPLETED",
  "DISMISSED"
];

const priorityOptions: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const recommendationOptions: RecommendationType[] = [
  "BLOG_IDEA",
  "FOUNDER_POST",
  "COMPANY_POST",
  "X_THREAD",
  "PINTEREST_PIN",
  "FAQ",
  "LANDING_PAGE",
  "FEATURE_REQUEST",
  "DIRECTORY_SUBMISSION",
  "BACKLINK_OUTREACH",
  "INTERNAL_LINK",
  "COMMUNITY_REPLY"
];

const relationshipOptions: RelationshipType[] = [
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

const knowledgeObjectTypeOptions = [
  "ENTITY",
  "QUESTION",
  "PAIN_POINT",
  "CONTENT_ASSET",
  "KEYWORD",
  "PERSONA",
  "COMPETITOR",
  "COMMUNITY",
  "MEMORY",
  "PATTERN",
  "INSIGHT",
  "RECOMMENDATION",
  "FEATURE_REQUEST",
  "CAMPAIGN",
  "EXPERIMENT",
  "OBJECTIVE",
  "BACKLINK",
  "DIRECTORY",
  "PRODUCT_SIGNAL"
];

const knowledgeRelationshipOptions = [
  ...relationshipOptions,
  "BELONGS_TO",
  "DEPENDS_ON",
  "IMPROVES",
  "RISKS",
  "VALIDATES",
  "INVALIDATES",
  "DEFINES"
];

const workflowTypeOptions = [
  "CONVERSATION_TO_CONTENT",
  "OBSERVATION_TO_INSIGHT",
  "INSIGHT_TO_EXPERIMENT",
  "QUESTION_TO_AEO_ASSET",
  "PAIN_POINT_TO_FEATURE_REQUEST",
  "PRODUCT_HUNT_TO_DEMO_CONTENT",
  "DIRECTORY_TO_BACKLINK",
  "COMPETITOR_COMPLAINT_TO_CONTENT",
  "CONTENT_TO_INTERNAL_LINKS",
  "MEMORY_TO_PATTERN"
];

const triggerTypeOptions = ["MANUAL", "EVENT", "SCHEDULED", "AGENT"];

const workflowStepTypeOptions = [
  "CLASSIFY",
  "EXTRACT_ENTITIES",
  "EXTRACT_PAIN_POINTS",
  "CREATE_MEMORY",
  "DETECT_PATTERN",
  "CREATE_REASONING_TRACE",
  "CREATE_RECOMMENDATION",
  "CREATE_ACTION",
  "CREATE_CONTENT_ASSET",
  "CREATE_TASK",
  "LINK_KNOWLEDGE_OBJECTS",
  "NOTIFY_MISSION_CONTROL"
];

function priorityTone(priority?: Priority) {
  if (priority === "CRITICAL") return "red";
  if (priority === "HIGH") return "amber";
  if (priority === "MEDIUM") return "blue";
  return "slate";
}

function statusTone(status?: string) {
  if (status === "LIVE" || status === "PUBLISHED") return "green";
  if (status === "IN_PROGRESS" || status === "RESEARCHING") return "blue";
  if (status === "SUBMITTED") return "teal";
  if (status === "ARCHIVED") return "slate";
  return "amber";
}

function intentLabel(intent?: string) {
  if (intent === "COMMERCIAL") return "Commercial Investigation";
  return intent ? formatEnum(intent) : "Unknown";
}

function sourceTypeToCollection(sourceType: string): EditableCollection {
  const map: Record<string, EditableCollection> = {
    Question: "questions",
    PainPoint: "painPoints",
    Conversation: "conversations",
    ContentAsset: "contentAssets",
    DirectorySubmission: "directorySubmissions",
    Backlink: "backlinks",
    AIRecommendation: "aiRecommendations",
    IntelligenceObject: "intelligenceObjects",
    Memory: "memories",
    Pattern: "patterns",
    ReasoningTrace: "reasoningTraces",
    Objective: "objectives",
    KeyResult: "keyResults",
    Agent: "agents",
    AgentRun: "agentRuns",
    KnowledgeObject: "knowledgeObjects",
    KnowledgeRelationship: "knowledgeRelationships",
    MemorySnapshot: "memorySnapshots",
    Workflow: "workflows",
    WorkflowStep: "workflowSteps",
    WorkflowRun: "workflowRuns",
    AgentHandoff: "agentHandoffs",
    Experiment: "experiments",
    Observation: "observations",
    Insight: "insights",
    Hypothesis: "hypotheses",
    Competitor: "recommendedActions"
  };
  return map[sourceType] ?? "recommendedActions";
}

function collectionToSourceType(collection: EditableCollection) {
  const map: Partial<Record<EditableCollection, string>> = {
    observations: "Observation",
    conversations: "Conversation",
    questions: "Question",
    painPoints: "PainPoint",
    contentAssets: "ContentAsset",
    directorySubmissions: "DirectorySubmission",
    backlinks: "Backlink",
    aiRecommendations: "AIRecommendation",
    intelligenceObjects: "IntelligenceObject",
    memories: "Memory",
    patterns: "Pattern",
    reasoningTraces: "ReasoningTrace",
    objectives: "Objective",
    keyResults: "KeyResult",
    agents: "Agent",
    agentRuns: "AgentRun",
    knowledgeObjects: "KnowledgeObject",
    knowledgeRelationships: "KnowledgeRelationship",
    memorySnapshots: "MemorySnapshot",
    workflows: "Workflow",
    workflowSteps: "WorkflowStep",
    workflowRuns: "WorkflowRun",
    agentHandoffs: "AgentHandoff",
    experiments: "Experiment",
    insights: "Insight",
    hypotheses: "Hypothesis"
  };
  return map[collection] ?? "Record";
}

function findSourceRecord(state: PlatformState, sourceType: string, sourceId: string) {
  const collection = sourceTypeToCollection(sourceType);
  return getCollection(state, collection).find((item) => item.id === sourceId);
}

function eventTypeForCollection(collection: EditableCollection) {
  const map: Record<string, string> = {
    observations: "OBSERVATION_CREATED",
    questions: "QUESTION_CREATED",
    painPoints: "PAIN_POINT_CREATED",
    contentAssets: "CONTENT_ASSET_CREATED",
    aiRecommendations: "AI_RECOMMENDATION_CREATED",
    experiments: "EXPERIMENT_STARTED",
    memories: "MEMORY_CREATED",
    patterns: "PATTERN_DETECTED",
    reasoningTraces: "REASONING_TRACE_CREATED",
    objectives: "OBJECTIVE_CREATED",
    keyResults: "KEY_RESULT_UPDATED",
    agentRuns: "AGENT_RUN_STARTED"
  };
  return map[collection] ?? null;
}

function addGeneratedEvent(
  state: PlatformState,
  collection: EditableCollection,
  item: AnyRecord,
  activeWorkspaceId: string
): PlatformState {
  const eventType = eventTypeForCollection(collection);
  if (!eventType) return state;
  const now = new Date().toISOString();
  return {
    ...state,
    events: [
      {
        id: createScopedId("event"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        eventType: eventType as any,
        sourceType: collection,
        sourceId: item.id,
        title: `${getTitle(item)} created`,
        description: recordDescription(item) || `${getTitle(item)} was created in VGOS.`,
        metadata: { generatedBy: "ui", collection },
        severity: item.priority === "CRITICAL" ? "CRITICAL" : "MEDIUM",
        status: "PENDING",
        createdAt: now
      },
      ...state.events
    ]
  };
}

function createActionFromSource(item: AnyRecord, activeWorkspaceId: string) {
  const now = new Date().toISOString();
  return {
    id: createScopedId("action"),
    organizationId: "org-apj-labs",
    workspaceId: activeWorkspaceId,
    title: `Act on ${getTitle(item)}`,
    description: recordDescription(item),
    sourceType: item.opportunityKind ?? item.targetEntityType ?? "GrowthObject",
    sourceId: item.id,
    actionType: "FOLLOW_UP",
    priority: item.priority ?? "HIGH",
    status: "PENDING" as ActionStatus,
    dueDate: now,
    owner: item.owner ?? "Growth",
    reasoning: "Created from a VGOS conversion action.",
    expectedImpact: "Moves this intelligence object into active execution.",
    createdAt: now,
    updatedAt: now
  };
}

function getCollection(state: PlatformState, collection: EditableCollection): AnyRecord[] {
  return (state as unknown as Record<EditableCollection, AnyRecord[]>)[collection] ?? [];
}

function setCollection(
  state: PlatformState,
  collection: EditableCollection,
  records: AnyRecord[]
) {
  return { ...state, [collection]: records } as PlatformState;
}

function itemMatchesFilters(
  item: AnyRecord,
  query: string,
  statusFilter: FilterValue<string>,
  priorityFilter: FilterValue<Priority>
) {
  const text = JSON.stringify(item).toLowerCase();
  const matchesQuery = !query || text.includes(query.toLowerCase());
  const matchesStatus =
    statusFilter === "ALL" || !("status" in item) || item.status === statusFilter;
  const matchesPriority =
    priorityFilter === "ALL" || !("priority" in item) || item.priority === priorityFilter;
  return matchesQuery && matchesStatus && matchesPriority;
}

function recordDescription(item: AnyRecord) {
  return String(
    item.description ??
      item.summary ??
      item.rawText ??
      item.statement ??
      item.expectedOutcome ??
      item.suggestedAction ??
      item.inputSummary ??
      item.conclusion ??
      item.mission ??
      item.outputSummary ??
      item.notes ??
      ""
  );
}

export function VgosApp({ initialPage = "missionControl" }: { initialPage?: PageId } = {}) {
  const [state, setState] = useState<PlatformState>(initialPlatformState);
  const [activePage, setActivePage] = useState<PageId>(initialPage);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaceId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterValue<string>>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<FilterValue<Priority>>("ALL");
  const [opportunityFilter, setOpportunityFilter] = useState<OpportunityFilter>("ALL");
  const [draft, setDraft] = useState<DraftState>(null);

  const page = pageDefinitions.find((item) => item.id === activePage) ?? pageDefinitions[0];
  const workspace = state.workspaces.find((item) => item.id === activeWorkspaceId);
  const metrics = useMemo(
    () => getExecutiveMetrics(state, activeWorkspaceId),
    [state, activeWorkspaceId]
  );

  function openCreate(collection: EditableCollection) {
    const item =
      collection === "questions" || collection === "painPoints"
        ? createDefaultOpportunity(collection, activeWorkspaceId)
        : createDefaultRecord(collection, activeWorkspaceId);
    setDraft({ collection, item, isNew: true });
  }

  function openEdit(collection: EditableCollection, item: AnyRecord) {
    setDraft({ collection, item: { ...item }, isNew: false });
  }

  function saveDraft() {
    if (!draft) return;
    const nextItem = { ...draft.item, updatedAt: new Date().toISOString() };
    const current = getCollection(state, draft.collection);
    const exists = current.some((item) => item.id === nextItem.id);
    const nextRecords = exists
      ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
      : [nextItem, ...current];
    setState((currentState) => {
      const nextState = setCollection(currentState, draft.collection, nextRecords);
      return draft.isNew
        ? addGeneratedEvent(nextState, draft.collection, nextItem, activeWorkspaceId)
        : nextState;
    });
    setDraft({ ...draft, item: nextItem, isNew: false });
  }

  function deleteDraft() {
    if (!draft) return;
    const current = getCollection(state, draft.collection);
    setState((currentState) =>
      setCollection(
        currentState,
        draft.collection,
        current.filter((item) => item.id !== draft.item.id)
      )
    );
    setDraft(null);
  }

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setOpportunityFilter("ALL");
  }

  function navigateTo(pageId: PageId) {
    setActivePage(pageId);
    setDraft(null);
    resetFilters();
  }

  function runWorkflowManually(workflow: AnyRecord) {
    const now = new Date().toISOString();
    const run = {
      id: createScopedId("workflow-run"),
      organizationId: orgId,
      workspaceId: activeWorkspaceId,
      workflowId: workflow.id,
      status: "COMPLETED" as ActionStatus,
      triggerSourceType: "Manual",
      triggerSourceId: "mission-control",
      input: { workflowType: workflow.workflowType, triggerType: "MANUAL" },
      output: {
        summary: `${getTitle(workflow)} completed through the rule-based workflow engine.`,
        stepsExecuted: state.workflowSteps.filter((step) => step.workflowId === workflow.id).length
      },
      startedAt: now,
      completedAt: now,
      logs: [
        "Manual workflow run created.",
        "Loaded workspace-scoped knowledge context.",
        "Evaluated workflow steps with mock kernel services.",
        "Mission Control updated."
      ]
    };
    setState((currentState) => ({
      ...currentState,
      workflowRuns: [run, ...currentState.workflowRuns]
    }));
  }

  function runAgentManually() {
    const now = new Date().toISOString();
    const agent = state.agents.find(
      (item) => item.workspaceId === activeWorkspaceId && item.status === "LIVE"
    );
    if (!agent) {
      openCreate("agentRuns");
      return;
    }
    const run = runAgent(agent, state);
    setState((currentState) => ({
      ...currentState,
      agentRuns: [run, ...currentState.agentRuns],
      agents: currentState.agents.map((item) =>
        item.id === agent.id ? { ...item, lastRunAt: now, updatedAt: now } : item
      )
    }));
    navigateTo("agents");
  }

  function markActionCompleted(actionId: string) {
    const completedAt = new Date().toISOString();
    setState((currentState) => ({
      ...currentState,
      recommendedActions: currentState.recommendedActions.map((action) =>
        action.id === actionId
          ? { ...action, status: "COMPLETED" as ActionStatus, completedAt, updatedAt: completedAt }
          : action
      )
    }));
  }

  function convertActionToTask(action: AnyRecord) {
    const now = new Date().toISOString();
    const task = {
      id: createScopedId("task"),
      organizationId: "org-apj-labs",
      workspaceId: activeWorkspaceId,
      title: action.title,
      description: action.description ?? action.suggestedAction ?? "",
      source: "Recommended Action",
      url: "https://vidmaker.com",
      status: "NOT_STARTED" as Status,
      priority: action.priority ?? "HIGH",
      owner: action.owner ?? "Growth",
      createdAt: now,
      updatedAt: now
    };
    setState((currentState) => ({
      ...currentState,
      tasks: [task, ...currentState.tasks],
      recommendedActions: currentState.recommendedActions.map((item) =>
        item.id === action.id ? { ...item, status: "IN_PROGRESS" as ActionStatus, updatedAt: now } : item
      )
    }));
  }

  function handleConversion(conversion: string, item: AnyRecord, collection?: EditableCollection) {
    const now = new Date().toISOString();
    if (conversion === "ProcessIntelligence") {
      const result = processIntelligenceRecord(item, {
        workspaceId: activeWorkspaceId,
        organizationId: orgId,
        sourceType: collection ? collectionToSourceType(collection) : String(item.sourceType ?? "Record"),
        now
      });
      setState((currentState) => ({
        ...currentState,
        intelligenceObjects: [
          result.intelligenceObject,
          ...currentState.intelligenceObjects.filter((record) => record.id !== result.intelligenceObject.id)
        ],
        aiRecommendations: [
          result.aiRecommendation,
          ...currentState.aiRecommendations.filter((record) => record.id !== result.aiRecommendation.id)
        ],
        recommendedActions: [
          ...result.recommendedActions,
          ...currentState.recommendedActions.filter(
            (record) => !result.recommendedActions.some((action) => action.id === record.id)
          )
        ]
      }));
      setActivePage("intelligencePipeline");
      setDraft(null);
      resetFilters();
      return;
    }
    if (conversion === "QuestionToContentAsset") {
      const asset = {
        id: createScopedId("content"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        code: `CONTENT-${state.contentAssets.length + 1}`,
        title: getTitle(item),
        description: recordDescription(item),
        source: "Question conversion",
        url: "https://vidmaker.com",
        status: "NOT_STARTED" as Status,
        priority: item.priority ?? "HIGH",
        owner: item.owner ?? "Content",
        contentType: "BLOG",
        intent: item.intent ?? "INFORMATIONAL",
        funnelStage: item.funnelStage ?? "TOFU",
        personaIds: item.personaIds ?? [],
        questionIds: [item.id],
        keywordIds: [],
        entityIds: [],
        campaignIds: [],
        createdAt: now,
        updatedAt: now
      };
      setState((currentState) => ({ ...currentState, contentAssets: [asset as any, ...currentState.contentAssets] }));
    }
    if (conversion === "QuestionToRecommendedAction" || conversion === "AIRecommendationToRecommendedAction") {
      const action = createActionFromSource(item, activeWorkspaceId);
      setState((currentState) => ({ ...currentState, recommendedActions: [action as any, ...currentState.recommendedActions] }));
    }
    if (conversion === "PainPointToFeatureRequest") {
      const feature = {
        id: createScopedId("feature"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        title: getTitle(item),
        description: recordDescription(item),
        source: "Pain point conversion",
        url: "https://vidmaker.com",
        status: "NOT_STARTED" as Status,
        priority: item.priority ?? "HIGH",
        owner: "Product",
        painPointId: item.id,
        personaIds: item.personaIds ?? [],
        createdAt: now,
        updatedAt: now
      };
      setState((currentState) => ({ ...currentState, featureRequests: [feature as any, ...currentState.featureRequests] }));
    }
    if (conversion === "PainPointToContentAsset") {
      handleConversion("QuestionToContentAsset", item, collection);
    }
    if (conversion === "ObservationToInsight") {
      const insight = {
        id: createScopedId("insight"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        title: getTitle(item),
        summary: item.summary ?? recordDescription(item),
        strategicImplication: "Review this observation and decide the growth implication.",
        evidence: item.rawText ?? item.summary ?? "",
        confidenceScore: item.confidenceScore ?? 0.7,
        observationId: item.id,
        createdAt: now,
        updatedAt: now
      };
      setState((currentState) => ({ ...currentState, insights: [insight as any, ...currentState.insights] }));
    }
    if (conversion === "InsightToHypothesis") {
      const hypothesis = {
        id: createScopedId("hypothesis"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        title: getTitle(item),
        statement: item.summary ?? getTitle(item),
        expectedOutcome: item.strategicImplication ?? "",
        relatedMetric: "qualified_growth_signal",
        confidenceScore: item.confidenceScore ?? 0.7,
        status: "RESEARCHING" as Status,
        insightId: item.id,
        createdAt: now,
        updatedAt: now
      };
      setState((currentState) => ({ ...currentState, hypotheses: [hypothesis as any, ...currentState.hypotheses] }));
    }
    if (conversion === "HypothesisToExperiment") {
      const experiment = {
        id: createScopedId("experiment"),
        organizationId: "org-apj-labs",
        workspaceId: activeWorkspaceId,
        title: getTitle(item),
        description: item.statement ?? getTitle(item),
        channel: "Growth",
        hypothesisId: item.id,
        startDate: now,
        endDate: now,
        successMetric: item.relatedMetric ?? "qualified_growth_signal",
        result: "",
        status: "NOT_STARTED" as Status,
        createdAt: now,
        updatedAt: now
      };
      setState((currentState) => ({ ...currentState, experiments: [experiment as any, ...currentState.experiments] }));
    }
    if (conversion === "RecommendedActionToTask") {
      convertActionToTask(item);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fb_0%,#edf2f7_100%)]">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">
                  <Database className="mr-1 h-3 w-3" />
                  Growth Intelligence Platform
                </Badge>
                <Badge tone="green">Observation - Insight - Hypothesis - Experiment - Outcome</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
                VGOS v5.0 Enterprise
              </h1>
              <p className="mt-1 max-w-4xl text-sm text-muted-foreground">
                VidMaker intelligence layer for SEO, AEO, GEO, product, content,
                authority, community, and growth decisions.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Label>Workspace</Label>
              <Select
                value={activeWorkspaceId}
                onChange={(event) => setActiveWorkspaceId(event.target.value)}
              >
                {state.workspaces.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Platform pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pageDefinitions.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-primary/30 bg-primary text-primary-foreground"
                        : "border-transparent hover:border-border hover:bg-muted"
                    )}
                    onClick={() => {
                      setActivePage(item.id);
                      setDraft(null);
                      resetFilters();
                    }}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{item.label}</span>
                      <span
                        className={cn(
                          "block truncate text-xs",
                          active ? "text-primary-foreground/75" : "text-muted-foreground"
                        )}
                      >
                        {item.collection
                          ? `${getCollection(state, item.collection).filter((row) => row.workspaceId === activeWorkspaceId).length} records`
                          : "Command view"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Workspace scope</h2>
            <div className="rounded-md border border-border bg-card p-3 shadow-sm">
              <p className="text-sm font-semibold">{workspace?.name ?? "Workspace"}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Owned by APJ Labs. All intelligence pages are filtered to this
                workspace so the system is tenant-ready from the foundation.
              </p>
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-4">
          {activePage === "missionControl" ? (
            <MissionControl
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              metrics={metrics}
              onCreate={openCreate}
              onEdit={openEdit}
              onNavigate={navigateTo}
              onRunAgent={runAgentManually}
              markActionCompleted={markActionCompleted}
              convertActionToTask={convertActionToTask}
            />
          ) : activePage === "briefing" ? (
            <BriefingPage state={state} activeWorkspaceId={activeWorkspaceId} />
          ) : activePage === "intelligencePipeline" ? (
            <IntelligencePipelinePage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onEdit={openEdit}
            />
          ) : activePage === "opportunityQueue" ? (
            <OpportunityQueuePage
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              opportunityFilter={opportunityFilter}
              setOpportunityFilter={setOpportunityFilter}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "recommendedActions" ? (
            <RecommendedActionsPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              onCreate={openCreate}
              onEdit={openEdit}
              markActionCompleted={markActionCompleted}
              convertActionToTask={convertActionToTask}
            />
          ) : activePage === "intelligenceEngine" ? (
            <EnginePage
              title="Intelligence Engine"
              sections={[
                ["Conversations", "conversations"],
                ["Observations", "observations"],
                ["Insights", "insights"],
                ["Hypotheses", "hypotheses"],
                ["Experiments", "experiments"],
                ["Outcomes", "outcomes"]
              ]}
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "authorityEngine" ? (
            <EnginePage
              title="Authority Engine"
              sections={[
                ["Directory Submissions", "directorySubmissions"],
                ["Backlinks", "backlinks"],
                ["Authority Actions", "recommendedActions"]
              ]}
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "searchEngine" ? (
            <EnginePage
              title="Search Engine"
              sections={[
                ["Questions", "questions"],
                ["Keywords", "keywords"],
                ["Search Actions", "recommendedActions"]
              ]}
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "productEngine" ? (
            <EnginePage
              title="Product Engine"
              sections={[
                ["Pain Points", "painPoints"],
                ["Feature Requests", "featureRequests"],
                ["Product Actions", "recommendedActions"]
              ]}
              state={state}
              activeWorkspaceId={activeWorkspaceId}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "knowledgeGraph" ? (
            <KnowledgeGraphPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "objectives" ? (
            <ObjectivesPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "decisions" ? (
            <DecisionPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              onEdit={openEdit}
            />
          ) : activePage === "knowledge" ? (
            <KnowledgeLayerPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : activePage === "workflows" ? (
            <WorkflowLayerPage
              state={state}
              page={page}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreate={openCreate}
              onEdit={openEdit}
              onRunWorkflow={runWorkflowManually}
            />
          ) : page.collection ? (
            <DataPage
              state={state}
              page={page}
              collection={page.collection}
              activeWorkspaceId={activeWorkspaceId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              onCreate={openCreate}
              onEdit={openEdit}
            />
          ) : null}
        </section>
      </div>

      <EditorPanel
        draft={draft}
        setDraft={setDraft}
        onSave={saveDraft}
        onDelete={deleteDraft}
        onConvert={handleConversion}
        state={state}
      />
    </main>
  );
}

function MissionControl({
  state,
  activeWorkspaceId,
  metrics,
  onCreate,
  onEdit,
  onNavigate,
  onRunAgent,
  markActionCompleted,
  convertActionToTask
}: {
  state: PlatformState;
  activeWorkspaceId: string;
  metrics: ReturnType<typeof getExecutiveMetrics>;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
  onNavigate: (page: PageId) => void;
  onRunAgent: () => void;
  markActionCompleted: (id: string) => void;
  convertActionToTask: (action: AnyRecord) => void;
}) {
  const queue = buildOpportunityQueue(state, activeWorkspaceId);
  const actions = state.recommendedActions
    .filter((item) => item.workspaceId === activeWorkspaceId && item.status !== "COMPLETED")
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  const activeExperiments = state.experiments.filter(
    (item) => item.workspaceId === activeWorkspaceId && item.status === "IN_PROGRESS"
  );
  const contentAttention = state.contentAssets.filter(
    (item) => item.workspaceId === activeWorkspaceId && item.status !== "PUBLISHED"
  );
  const authorityActions = actions.filter((item) =>
    ["SUBMIT_DIRECTORY", "REACH_OUT_FOR_BACKLINK", "ADD_INTERNAL_LINK"].includes(item.actionType)
  );
  const dailyPriorities = selectTopDailyPriorities(state, activeWorkspaceId, 5);
  const weeklyPriorities = selectTopWeeklyPriorities(state, activeWorkspaceId, 5);
  const strategicActions = rankRecommendedActions(state, activeWorkspaceId).slice(0, 5);
  const activePatterns = state.patterns
    .filter((item) => item.workspaceId === activeWorkspaceId && item.status !== "ARCHIVED")
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5);
  const objectiveProgress = summarizeObjectiveProgress(state, activeWorkspaceId).slice(0, 5);
  const topEntities = state.knowledgeObjects
    .filter((item) => item.workspaceId === activeWorkspaceId && item.objectType === "ENTITY")
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5);
  const topTopics = state.knowledgeObjects
    .filter((item) => item.workspaceId === activeWorkspaceId && item.objectType !== "ENTITY")
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5);
  const knowledgeGaps = state.knowledgeObjects
    .filter((item) => item.workspaceId === activeWorkspaceId && item.confidenceScore < 0.8)
    .sort((a, b) => a.confidenceScore - b.confidenceScore)
    .slice(0, 5);
  const recentWorkflowRuns = state.workflowRuns
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);
  const pendingHandoffs = state.agentHandoffs
    .filter((item) => item.workspaceId === activeWorkspaceId && item.status === "PENDING")
    .slice(0, 5);
  const agentRecommendations = state.aiRecommendations
    .filter((item) => item.workspaceId === activeWorkspaceId && item.generatedBy.includes("Agent"))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Active Memories" value={metrics.activeMemories} />
        <MetricCard label="Detected Patterns" value={metrics.detectedPatterns} />
        <MetricCard label="Active Objectives" value={metrics.activeObjectives} />
        <MetricCard label="Agent Runs" value={metrics.agentRuns} />
        <MetricCard label="Reasoning Traces" value={metrics.reasoningTraces} />
        <MetricCard label="High Impact Actions" value={metrics.highImpactActions} />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Knowledge Objects" value={metrics.totalKnowledgeObjects} />
        <MetricCard label="Knowledge Relationships" value={metrics.totalKnowledgeRelationships} />
        <MetricCard label="Active Workflows" value={metrics.activeWorkflows} />
        <MetricCard label="Pending Handoffs" value={metrics.pendingHandoffs} />
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s Priority Briefing</h2>
            <p className="text-sm text-muted-foreground">
              What needs attention across opportunities, actions, experiments,
              authority, and content.
            </p>
          </div>
          <Badge tone="blue">Mission Control</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <BriefingCard title="Top 5 Opportunities" items={queue.slice(0, 5).map((item) => item.title)} />
          <BriefingCard
            title="Processed Intelligence"
            items={state.intelligenceObjects
              .filter((item) => item.workspaceId === activeWorkspaceId)
              .sort((a, b) => b.opportunityScore - a.opportunityScore)
              .slice(0, 5)
              .map((item) => item.summary)}
          />
          <BriefingCard title="Top 5 Recommended Actions" items={actions.slice(0, 5).map((item) => item.title)} />
          <BriefingCard title="Top 5 Strategic Actions" items={strategicActions.map((item) => item.title)} />
          <BriefingCard
            title="High-Opportunity Questions"
            items={state.questions.filter((item) => item.opportunityScore >= 3500).slice(0, 5).map((item) => item.title)}
          />
          <BriefingCard
            title="High-Priority Pain Points"
            items={state.painPoints.filter((item) => ["HIGH", "CRITICAL"].includes(item.priority)).slice(0, 5).map((item) => item.title)}
          />
          <BriefingCard
            title="Pending AI Recommendations"
            items={state.aiRecommendations.filter((item) => item.status !== "PUBLISHED").slice(0, 5).map((item) => item.title)}
          />
          <BriefingCard title="Active Experiments" items={activeExperiments.slice(0, 5).map((item) => item.title)} />
          <BriefingCard title="Directory/Backlink Actions" items={authorityActions.slice(0, 5).map((item) => item.title)} />
          <BriefingCard title="Content Assets Needing Attention" items={contentAttention.slice(0, 5).map((item) => item.title)} />
          <BriefingCard title="Knowledge-Backed Reasoning" items={strategicActions.map((item) => item.reasoningSummary)} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Layer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <FocusRow label="Top entities" value={String(metrics.topEntities)} />
              <FocusRow label="Knowledge gaps" value={String(metrics.knowledgeGaps)} />
            </div>
            <InlineList title="Top Entities" items={topEntities.map((item) => item.title)} />
            <InlineList title="Top Topics" items={topTopics.map((item) => item.title)} />
            <InlineList title="Gaps" items={knowledgeGaps.map((item) => `${item.title} (${Math.round(item.confidenceScore * 100)}%)`)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Layer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <FocusRow label="Recent runs" value={String(metrics.recentWorkflowRuns)} />
              <FocusRow label="Needs approval" value={String(metrics.workflowsWaitingForApproval)} />
            </div>
            <InlineList title="Recent Runs" items={recentWorkflowRuns.map((item) => `${item.workflowId}: ${formatEnum(item.status)}`)} />
            <InlineList
              title="Failed Runs"
              items={state.workflowRuns
                .filter((item) => item.workspaceId === activeWorkspaceId && item.status === "DISMISSED")
                .map((item) => item.workflowId)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Layer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <FocusRow label="Active agents" value={String(metrics.activeAgents)} />
              <FocusRow label="Recent runs" value={String(metrics.agentRuns)} />
            </div>
            <InlineList title="Pending Handoffs" items={pendingHandoffs.map((item) => `${item.fromAgentId} to ${item.toAgentId}`)} />
            <InlineList title="Agent Recommendations" items={agentRecommendations.map((item) => item.title)} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Daily Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyPriorities.map((action) => (
              <RankedActionRow key={action.id} action={action} onEdit={onEdit} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePatterns.map((pattern) => {
              const action = actions.find((item) => item.patternId === pattern.id || item.sourceId === pattern.id);
              return (
                <div key={pattern.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={pattern.trendDirection === "RISING" ? "amber" : "slate"}>
                      {formatEnum(pattern.trendDirection)}
                    </Badge>
                    <Badge tone="blue">{pattern.importanceScore}/100</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{pattern.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {action?.title ?? "No recommended action linked yet."}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyPriorities.map((action) => (
              <RankedActionRow key={action.id} action={action} onEdit={onEdit} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {objectiveProgress.map(({ objective, progress }) => (
              <ObjectiveProgressRow
                key={objective.id}
                objective={objective}
                progress={progress}
                health={calculateObjectiveHealth(objective, state.keyResults)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunityQueueList items={queue.slice(0, 10)} onEdit={onEdit} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FocusRow label="Content target" value="Publish BLOG-004 with proof-first examples" />
              <FocusRow label="Outreach target" value="Submit VidMaker to Futurepedia and Toolify" />
              <FocusRow label="Community target" value="Reply to Product Hunt and LinkedIn URL-to-video threads" />
              <FocusRow label="Experiment target" value="Run product-page-to-video demo distribution test" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" onClick={() => onNavigate("intelligencePipeline")}>
                <ArrowRight className="h-4 w-4" />
                Run Intelligence Pipeline
              </Button>
              <Button variant="outline" onClick={() => onCreate("knowledgeObjects")}>
                <Plus className="h-4 w-4" />
                Create Knowledge Object
              </Button>
              <Button variant="outline" onClick={() => onNavigate("workflows")}>
                <ArrowRight className="h-4 w-4" />
                Run Workflow
              </Button>
              <Button variant="outline" onClick={onRunAgent}>
                <ArrowRight className="h-4 w-4" />
                Run Agent
              </Button>
              <Button variant="outline" onClick={() => onNavigate("briefing")}>
                <ArrowRight className="h-4 w-4" />
                View Briefing
              </Button>
              <Button variant="outline" onClick={() => onCreate("conversations")}>
                <Plus className="h-4 w-4" />
                Add Conversation
              </Button>
              <Button onClick={() => onCreate("directorySubmissions")}>
                <Plus className="h-4 w-4" />
                Add Directory Submission
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actions.slice(0, 3).map((action) => (
                <div key={action.id} className="rounded-md border border-border p-2">
                  <p className="text-xs font-semibold">{action.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => markActionCompleted(action.id)}>
                      Complete
                    </Button>
                    <Button size="sm" onClick={() => convertActionToTask(action)}>
                      Task
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function IntelligencePipelinePage({
  state,
  page,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const items = state.intelligenceObjects
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
  const highOpportunity = items.filter((item) => item.opportunityScore >= 80).length;
  const averageConfidence =
    items.reduce((total, item) => total + item.confidenceScore, 0) / Math.max(items.length, 1);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <CardTitle>{page.label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:w-[520px]">
            <FocusRow label="Processed" value={String(items.length)} />
            <FocusRow label="High Opportunity" value={String(highOpportunity)} />
            <FocusRow label="Avg Confidence" value={`${Math.round(averageConfidence * 100)}%`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search processed intelligence"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {items.map((item) => {
          const actions = state.recommendedActions.filter(
            (action) => action.sourceType === "IntelligenceObject" && action.sourceId === item.id
          );
          const source = findSourceRecord(state, item.sourceType, item.sourceId);

          return (
            <Card key={item.id}>
              <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge tone="blue">{intentLabel(item.detectedIntent)}</Badge>
                    <Badge tone="green">{item.detectedPersona}</Badge>
                    <Badge tone={item.sentiment === "negative" ? "red" : item.sentiment.includes("high") ? "amber" : "slate"}>
                      {item.sentiment}
                    </Badge>
                  </div>
                  <CardTitle>{item.summary}</CardTitle>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Source: {item.sourceType} {source ? `- ${getTitle(source)}` : `- ${item.sourceId}`}
                  </p>
                </div>
                <div className="grid min-w-[260px] grid-cols-2 gap-2">
                  <FocusRow label="Opportunity" value={`${item.opportunityScore}/100`} />
                  <FocusRow label="Confidence" value={`${Math.round(item.confidenceScore * 100)}%`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 xl:grid-cols-3">
                  <PipelineResultGroup label="Entities" values={item.detectedEntities} />
                  <PipelineResultGroup label="Keywords" values={item.detectedKeywords} />
                  <PipelineResultGroup label="Pain points" values={item.detectedPainPoints} />
                </div>

                <div className="rounded-md border border-border bg-muted/35 p-3">
                  <p className="text-xs uppercase text-muted-foreground">Reasoning</p>
                  <p className="mt-1 text-sm leading-6">{item.reasoning}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase text-muted-foreground">Recommended actions</p>
                    <Button variant="outline" size="sm" onClick={() => onEdit("intelligenceObjects", item)}>
                      <Edit3 className="h-4 w-4" />
                      Edit result
                    </Button>
                  </div>
                  <div className="grid gap-2 lg:grid-cols-2">
                    {(actions.length ? actions : state.recommendedActions.filter((action) => action.sourceId === item.sourceId).slice(0, 2)).map(
                      (action) => (
                        <div key={action.id} className="rounded-md border border-border p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={priorityTone(action.priority)}>{formatEnum(action.actionType)}</Badge>
                            <Badge tone={statusTone(action.status)}>{formatEnum(action.status)}</Badge>
                          </div>
                          <p className="mt-2 text-sm font-semibold">{action.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{action.reasoning}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
              No processed intelligence matches this view.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function PipelineResultGroup({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(values.length ? values : ["None detected"]).map((value) => (
          <Badge key={value} tone="slate">
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function DecisionPage({
  state,
  page,
  activeWorkspaceId,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const daily = selectTopDailyPriorities(state, activeWorkspaceId, 5);
  const weekly = selectTopWeeklyPriorities(state, activeWorkspaceId, 8);
  const highestImpact = rankRecommendedActions(state, activeWorkspaceId).slice(0, 10);
  const opportunities = rankOpportunities(state, activeWorkspaceId).slice(0, 8);
  const objectives = summarizeObjectiveProgress(state, activeWorkspaceId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{page.label}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader>
            <CardTitle>Top Daily Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {daily.map((action) => (
              <RankedActionRow key={action.id} action={action} onEdit={onEdit} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranked Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {opportunities.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.sourceType}</p>
                </div>
                <Badge tone={item.score >= 90 ? "red" : "amber"}>{item.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Weekly Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weekly.map((action) => (
              <RankedActionRow key={action.id} action={action} onEdit={onEdit} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Impact Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highestImpact.map((action) => (
              <RankedActionRow key={action.id} action={action} onEdit={onEdit} />
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Objective Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {objectives.map(({ objective, progress }) => (
            <ObjectiveProgressRow
              key={objective.id}
              objective={objective}
              progress={progress}
              health={calculateObjectiveHealth(objective, state.keyResults)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ObjectivesPage({
  state,
  page,
  activeWorkspaceId,
  onCreate,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const objectives = summarizeObjectiveProgress(state, activeWorkspaceId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <CardTitle>{page.label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
          </div>
          <Button onClick={() => onCreate("objectives")}>
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {objectives.map(({ objective, progress }) => {
          const relatedKeyResults = state.keyResults.filter((item) => item.objectiveId === objective.id);
          const actions = state.recommendedActions.filter((item) => item.objectiveId === objective.id).slice(0, 3);
          return (
            <Card key={objective.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge tone={priorityTone(objective.priority)}>{formatEnum(objective.priority)}</Badge>
                    <Badge tone={statusTone(objective.status)}>{formatEnum(objective.status)}</Badge>
                    <Badge tone="blue">{formatEnum(objective.category)}</Badge>
                  </div>
                  <CardTitle>{objective.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{objective.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit("objectives", objective)}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <ObjectiveProgressRow
                  objective={objective}
                  progress={progress}
                  health={calculateObjectiveHealth(objective, state.keyResults)}
                />
                <div className="space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Key results</p>
                  {relatedKeyResults.map((keyResult) => {
                    const krProgress = Math.round(
                      (Math.min(keyResult.currentValue, keyResult.targetValue) / Math.max(keyResult.targetValue, 1)) * 100
                    );
                    return (
                      <div key={keyResult.id} className="rounded-md border border-border p-3">
                        <p className="text-sm font-semibold">{keyResult.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {keyResult.currentValue} / {keyResult.targetValue} {keyResult.metricName}
                        </p>
                        <div className="mt-2 h-2 overflow-hidden rounded-sm bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${Math.max(4, krProgress)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Linked actions</p>
                  {actions.map((action) => (
                    <div key={action.id} className="rounded-md border border-border p-3">
                      <Badge tone={priorityTone(action.priority)}>{formatEnum(action.priority)}</Badge>
                      <p className="mt-2 text-sm font-semibold">{action.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RankedActionRow({
  action,
  onEdit
}: {
  action: RankedAction;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={action.impactScore >= 85 ? "red" : action.impactScore >= 70 ? "amber" : "blue"}>
          Impact {action.impactScore}
        </Badge>
        <Badge tone={priorityTone(action.priority)}>{formatEnum(action.priority)}</Badge>
        <Badge tone={statusTone(action.status)}>{formatEnum(action.status)}</Badge>
      </div>
      <p className="mt-2 text-sm font-semibold">{action.title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {action.linkedObjective?.title ?? "No linked objective"}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{action.reasoningSummary}</p>
      <Button variant="outline" size="sm" className="mt-2" onClick={() => onEdit("recommendedActions", action)}>
        <Edit3 className="h-4 w-4" />
        Open
      </Button>
    </div>
  );
}

function ObjectiveProgressRow({
  objective,
  progress,
  health
}: {
  objective: Objective;
  progress: number;
  health: string;
}) {
  const tone: "green" | "amber" | "red" =
    health === "ON_TRACK" ? "green" : health === "WATCH" ? "amber" : "red";
  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex flex-wrap gap-2">
        <Badge tone={tone}>{health.replace("_", " ")}</Badge>
        <Badge tone={priorityTone(objective.priority)}>{formatEnum(objective.priority)}</Badge>
      </div>
      <p className="mt-2 text-sm font-semibold">{objective.title}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-sm bg-muted">
        <div className="h-full bg-primary" style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{progress}% complete</p>
    </div>
  );
}

function BriefingPage({
  state,
  activeWorkspaceId
}: {
  state: PlatformState;
  activeWorkspaceId: string;
}) {
  const queue = buildOpportunityQueue(state, activeWorkspaceId);
  const running = state.experiments.filter(
    (item) => item.workspaceId === activeWorkspaceId && item.status === "IN_PROGRESS"
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Intelligence Briefing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {state.briefingSections.map((section) => (
            <div key={section.id} className="rounded-md border border-border bg-background p-3">
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{section.summary}</p>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-xs leading-5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        <BriefingCard title="What changed recently" items={state.events.slice(0, 5).map((item) => item.title)} />
        <BriefingCard title="Highest value opportunities" items={queue.slice(0, 5).map((item) => item.title)} />
        <BriefingCard title="Running experiments" items={running.map((item) => item.title)} />
      </div>
    </div>
  );
}

function OpportunityQueuePage({
  state,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  opportunityFilter,
  setOpportunityFilter,
  onEdit
}: {
  state: PlatformState;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: FilterValue<string>;
  setStatusFilter: (value: FilterValue<string>) => void;
  priorityFilter: FilterValue<Priority>;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  opportunityFilter: OpportunityFilter;
  setOpportunityFilter: (value: OpportunityFilter) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const items = buildOpportunityQueue(state, activeWorkspaceId)
    .filter((item) => itemMatchesFilters(item as AnyRecord, searchQuery, statusFilter, priorityFilter))
    .filter((item) => {
      if (opportunityFilter === "HIGH_OPPORTUNITY") return item.opportunityScore >= 3500;
      if (opportunityFilter === "CRITICAL_OPPORTUNITY") return item.opportunityScore >= 5500;
      if (opportunityFilter === "LOW_COMPETITION") return item.summary.toLowerCase().includes("competition");
      if (opportunityFilter === "HIGH_BUSINESS_VALUE") return item.priority === "CRITICAL";
      return true;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <TableFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          hasStatus
          hasPriority
        >
          <Select value={opportunityFilter} onChange={(event) => setOpportunityFilter(event.target.value as OpportunityFilter)}>
            <option value="ALL">All opportunities</option>
            <option value="HIGH_OPPORTUNITY">High Opportunity</option>
            <option value="CRITICAL_OPPORTUNITY">Critical Opportunity</option>
            <option value="LOW_COMPETITION">Low Competition</option>
            <option value="HIGH_BUSINESS_VALUE">High Business Value</option>
          </Select>
        </TableFilters>
        <OpportunityQueueList items={items} onEdit={onEdit} />
      </CardContent>
    </Card>
  );
}

function RecommendedActionsPage({
  state,
  page,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onCreate,
  onEdit,
  markActionCompleted,
  convertActionToTask
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: FilterValue<string>;
  setStatusFilter: (value: FilterValue<string>) => void;
  priorityFilter: FilterValue<Priority>;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
  markActionCompleted: (id: string) => void;
  convertActionToTask: (action: AnyRecord) => void;
}) {
  const items = state.recommendedActions
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => itemMatchesFilters(item as AnyRecord, searchQuery, statusFilter, priorityFilter));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <CardTitle>{page.label}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
        </div>
        <Button onClick={() => onCreate("recommendedActions")}>
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </CardHeader>
      <CardContent>
        <TableFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          hasStatus
          hasPriority
        />
        <div className="grid gap-3">
          {items.map((action) => (
            <div key={action.id} className="rounded-md border border-border bg-background p-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={priorityTone(action.priority)}>{formatEnum(action.priority)}</Badge>
                    <Badge tone={statusTone(action.status as any)}>{formatEnum(action.status)}</Badge>
                    <Badge tone="violet">{formatEnum(action.actionType)}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{action.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{action.reasoning}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Source: {action.sourceType} - Due {formatDate(action.dueDate)} - Owner {action.owner}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const source = findSourceRecord(state, action.sourceType, action.sourceId);
                      onEdit(sourceTypeToCollection(action.sourceType), source ?? action);
                    }}
                  >
                    View source
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => markActionCompleted(action.id)}>
                    Mark completed
                  </Button>
                  <Button size="sm" onClick={() => convertActionToTask(action)}>
                    Convert to task
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EnginePage({
  title,
  sections,
  state,
  activeWorkspaceId,
  onCreate,
  onEdit
}: {
  title: string;
  sections: [string, EditableCollection][];
  state: PlatformState;
  activeWorkspaceId: string;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {sections.map(([sectionTitle, collection]) => {
        const items = getCollection(state, collection)
          .filter((item) => item.workspaceId === activeWorkspaceId)
          .slice(0, 6);
        return (
          <Card key={sectionTitle}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{sectionTitle}</CardTitle>
              <Button size="sm" onClick={() => onCreate(collection)}>
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </CardHeader>
            <CardContent>
              <RecordTable items={items} collection={collection} onEdit={onEdit} showOpportunity={false} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function OpportunityQueueList({
  items,
  onEdit
}: {
  items: OpportunityItem[];
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-md border border-border bg-background p-3">
          <div className="grid gap-3 xl:grid-cols-[56px_minmax(0,1fr)_130px_160px] xl:items-center">
            <div className="text-2xl font-semibold text-muted-foreground">#{index + 1}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="slate">{item.sourceType}</Badge>
                <Badge tone={priorityTone(item.priority)}>{formatEnum(item.priority)}</Badge>
                <Badge tone={statusTone(item.status as any)}>{formatEnum(item.status)}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 max-h-10 overflow-hidden text-xs leading-5 text-muted-foreground">
                {item.summary}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Next: {item.recommendedAction}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Score</p>
              <p className="text-xl font-semibold">{item.opportunityScore}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Due {formatDate(item.dueDate)}</p>
              <p className="text-xs text-muted-foreground">Owner {item.owner}</p>
              <Button size="sm" variant="outline" onClick={() => onEdit(sourceTypeToCollection(item.sourceType), item as unknown as AnyRecord)}>
                Inspect
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getConversionOptions(collection: EditableCollection) {
  const options: Record<string, { label: string; value: string }[]> = {
    questions: [
      { label: "Process Intelligence", value: "ProcessIntelligence" },
      { label: "Create content asset", value: "QuestionToContentAsset" },
      { label: "Create action", value: "QuestionToRecommendedAction" }
    ],
    painPoints: [
      { label: "Process Intelligence", value: "ProcessIntelligence" },
      { label: "Create feature request", value: "PainPointToFeatureRequest" },
      { label: "Create content asset", value: "PainPointToContentAsset" }
    ],
    observations: [
      { label: "Process Intelligence", value: "ProcessIntelligence" },
      { label: "Create insight", value: "ObservationToInsight" }
    ],
    conversations: [{ label: "Process Intelligence", value: "ProcessIntelligence" }],
    insights: [{ label: "Create hypothesis", value: "InsightToHypothesis" }],
    hypotheses: [{ label: "Create experiment", value: "HypothesisToExperiment" }],
    aiRecommendations: [{ label: "Create action", value: "AIRecommendationToRecommendedAction" }],
    recommendedActions: [{ label: "Convert to task", value: "RecommendedActionToTask" }]
  };
  return options[collection] ?? [];
}

function BriefingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {(items.length ? items : ["No urgent items."]).slice(0, 5).map((item) => (
            <li key={item} className="text-xs leading-5 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function InlineList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {(items.length ? items : ["No urgent items."]).slice(0, 5).map((item) => (
          <li key={item} className="text-xs leading-5 text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Dashboard({
  metrics,
  state,
  activeWorkspaceId
}: {
  metrics: ReturnType<typeof getExecutiveMetrics>;
  state: PlatformState;
  activeWorkspaceId: string;
}) {
  const activeExperiments = state.experiments.filter(
    (item) => item.workspaceId === activeWorkspaceId && item.status === "IN_PROGRESS"
  );
  const topRecommendations = state.aiRecommendations
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .slice(0, 4);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Conversations" value={metrics.totalConversations} />
        <MetricCard label="Total Questions" value={metrics.totalQuestions} />
        <MetricCard label="Total Content Assets" value={metrics.totalContentAssets} />
        <MetricCard label="Total Keywords" value={metrics.totalKeywords} />
        <MetricCard label="Total Backlinks" value={metrics.totalBacklinks} />
        <MetricCard label="Directory Submissions" value={metrics.totalDirectorySubmissions} />
        <MetricCard label="AI Recommendations" value={metrics.totalAIRecommendations} />
        <MetricCard label="High-Priority Opportunities" value={metrics.highPriorityOpportunities} />
        <MetricCard label="Processed Intelligence" value={metrics.totalIntelligenceObjects} />
        <MetricCard label="Total Observations" value={metrics.totalObservations} />
        <MetricCard label="Total Insights" value={metrics.totalInsights} />
        <MetricCard label="Total Hypotheses" value={metrics.totalHypotheses} />
        <MetricCard label="Active Experiments" value={metrics.activeExperiments} />
        <MetricCard label="Completed Experiments" value={metrics.completedExperiments} />
        <MetricCard label="Average Confidence Score" value={`${Math.round(metrics.averageConfidence * 100)}%`} />
        <MetricCard label="High Opportunity Questions" value={metrics.highOpportunityQuestions} />
        <MetricCard label="High Opportunity Pain Points" value={metrics.highOpportunityPainPoints} />
        <MetricCard label="AI Recommendations Pending" value={metrics.aiRecommendationsPending} />
        <MetricCard label="Knowledge Graph Nodes" value={metrics.knowledgeGraphNodes} />
        <MetricCard label="Knowledge Graph Edges" value={metrics.knowledgeGraphEdges} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardHeader>
            <CardTitle>Intelligence loop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-5">
              {[
                ["Observation", metrics.totalObservations],
                ["Insight", metrics.totalInsights],
                ["Hypothesis", metrics.totalHypotheses],
                ["Experiment", state.experiments.length],
                ["Outcome", state.outcomes.length]
              ].map(([label, value], index) => (
                <div key={label} className="rounded-md border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{label}</p>
                    {index < 4 ? <ArrowRight className="h-4 w-4 text-muted-foreground" /> : null}
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Active experiments</h2>
          {activeExperiments.map((experiment) => (
            <div key={experiment.id} className="rounded-md border border-border bg-card p-3 shadow-sm">
              <Badge tone={statusTone(experiment.status)}>{formatEnum(experiment.status)}</Badge>
              <p className="mt-2 text-sm font-semibold">{experiment.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{experiment.successMetric}</p>
            </div>
          ))}
          <h2 className="pt-2 text-sm font-semibold">Pending recommendations</h2>
          {topRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="rounded-md border border-border bg-card p-3 shadow-sm">
              <Badge tone={priorityTone(recommendation.priority)}>
                {formatEnum(recommendation.priority)}
              </Badge>
              <p className="mt-2 text-sm font-semibold">{recommendation.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatEnum(recommendation.recommendationType)}
              </p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

function DataPage({
  state,
  page,
  collection,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onCreate,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  collection: CollectionKey;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: FilterValue<string>;
  setStatusFilter: (value: FilterValue<string>) => void;
  priorityFilter: FilterValue<Priority>;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const items = getCollection(state, collection)
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => itemMatchesFilters(item, searchQuery, statusFilter, priorityFilter));
  const hasStatus = items.some((item) => "status" in item);
  const hasPriority = items.some((item) => "priority" in item);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <CardTitle>{page.label}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
        </div>
        <Button onClick={() => onCreate(collection)}>
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </CardHeader>
      <CardContent>
        <TableFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          hasStatus={hasStatus}
          hasPriority={hasPriority}
        />
        <RecordTable
          items={items}
          collection={collection}
          onEdit={onEdit}
          showOpportunity={false}
        />
      </CardContent>
    </Card>
  );
}

function OpportunityPage({
  state,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  opportunityFilter,
  setOpportunityFilter,
  onCreate,
  onEdit
}: {
  state: PlatformState;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: FilterValue<string>;
  setStatusFilter: (value: FilterValue<string>) => void;
  priorityFilter: FilterValue<Priority>;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  opportunityFilter: OpportunityFilter;
  setOpportunityFilter: (value: OpportunityFilter) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const items = getOpportunityItems(state, activeWorkspaceId)
    .filter((item) => itemMatchesFilters(item, searchQuery, statusFilter, priorityFilter))
    .filter((item) => {
      if (opportunityFilter === "HIGH_OPPORTUNITY") return item.opportunityScore >= 3500;
      if (opportunityFilter === "CRITICAL_OPPORTUNITY") return item.opportunityScore >= 5500;
      if (opportunityFilter === "LOW_COMPETITION") return item.competitionScore <= 4;
      if (opportunityFilter === "HIGH_BUSINESS_VALUE") return item.businessValueScore >= 8;
      return true;
    });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <CardTitle>Opportunity Scoring View</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Questions and pain points scored from business value, pain severity,
            trend, authority gap, and competition.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => onCreate("questions")}>
            <Plus className="h-4 w-4" />
            Question
          </Button>
          <Button onClick={() => onCreate("painPoints")}>
            <Plus className="h-4 w-4" />
            Pain point
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TableFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          hasStatus
          hasPriority
        >
          <Select
            value={opportunityFilter}
            onChange={(event) => setOpportunityFilter(event.target.value as OpportunityFilter)}
          >
            <option value="ALL">All opportunities</option>
            <option value="HIGH_OPPORTUNITY">High Opportunity</option>
            <option value="CRITICAL_OPPORTUNITY">Critical Opportunity</option>
            <option value="LOW_COMPETITION">Low Competition</option>
            <option value="HIGH_BUSINESS_VALUE">High Business Value</option>
          </Select>
        </TableFilters>
        <RecordTable
          items={items}
          collection="questions"
          onEdit={(_collection, item) =>
            onEdit(item.opportunityKind === "Question" ? "questions" : "painPoints", item)
          }
          showOpportunity
        />
      </CardContent>
    </Card>
  );
}

function KnowledgeLayerPage({
  state,
  page,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  onCreate,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const [objectTypeFilter, setObjectTypeFilter] = useState<FilterValue<string>>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const relationships = state.knowledgeRelationships.filter((item) => item.workspaceId === activeWorkspaceId);
  const objects = state.knowledgeObjects
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => objectTypeFilter === "ALL" || item.objectType === objectTypeFilter)
    .filter((item) => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.importanceScore - a.importanceScore);
  const selectedObject = objects.find((item) => item.id === selectedId) ?? objects[0];
  const selectedRelationships = selectedObject
    ? relationships.filter((item) => item.fromObjectId === selectedObject.id || item.toObjectId === selectedObject.id)
    : [];
  const relatedObjects = selectedRelationships
    .map((relationship) =>
      state.knowledgeObjects.find((item) =>
        item.id === (relationship.fromObjectId === selectedObject?.id ? relationship.toObjectId : relationship.fromObjectId)
      )
    )
    .filter(Boolean) as AnyRecord[];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <CardTitle>{page.label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onCreate("knowledgeRelationships")}>
              <Plus className="h-4 w-4" />
              Relationship
            </Button>
            <Button onClick={() => onCreate("knowledgeObjects")}>
              <Plus className="h-4 w-4" />
              Object
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 xl:grid-cols-[minmax(240px,1fr)_220px_170px_170px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search knowledge objects"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Select
              value={objectTypeFilter}
              onChange={(event) => setObjectTypeFilter(event.target.value as FilterValue<string>)}
            >
              <option value="ALL">All object types</option>
              {knowledgeObjectTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {formatEnum(type)}
                </option>
              ))}
            </Select>
            <FocusRow label="Objects" value={String(objects.length)} />
            <FocusRow label="Relations" value={String(relationships.length)} />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Objects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {objects.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "w-full rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/45",
                  selectedObject?.id === item.id ? "bg-muted" : "bg-background"
                )}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="violet">{formatEnum(item.objectType)}</Badge>
                  <Badge tone={statusTone(item.status)}>{formatEnum(item.status)}</Badge>
                  <Badge tone={item.importanceScore >= 90 ? "red" : "amber"}>{item.importanceScore}</Badge>
                </div>
                <p className="mt-2 text-sm font-semibold">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.summary}</p>
              </button>
            ))}
            {objects.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                No knowledge objects match this view.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle>{selectedObject?.title ?? "Knowledge Detail"}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedObject?.summary ?? "Select a knowledge object to inspect its context."}
              </p>
            </div>
            {selectedObject ? (
              <Button variant="outline" size="sm" onClick={() => onEdit("knowledgeObjects", selectedObject)}>
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : null}
          </CardHeader>
          {selectedObject ? (
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <FocusRow label="Importance" value={String(selectedObject.importanceScore)} />
                <FocusRow label="Confidence" value={`${Math.round(selectedObject.confidenceScore * 100)}%`} />
                <FocusRow label="Related" value={String(selectedRelationships.length)} />
              </div>

              <div className="rounded-md border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Semantic Search Text</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {selectedObject.searchableText || selectedObject.summary}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <InlineList title="Aliases" items={selectedObject.aliases} />
                <InlineList title="Tags" items={selectedObject.tags} />
              </div>

              <section className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Related Objects</h3>
                  <Button variant="outline" size="sm" onClick={() => onCreate("knowledgeRelationships")}>
                    <Plus className="h-4 w-4" />
                    Create relationship
                  </Button>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {relatedObjects.map((item) => (
                    <button
                      key={item.id}
                      className="rounded-md border border-border bg-background p-3 text-left hover:bg-muted/45"
                      onClick={() => setSelectedId(item.id)}
                    >
                      <Badge tone="violet">{formatEnum(item.objectType)}</Badge>
                      <p className="mt-2 text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.canonicalId}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Relationships</h3>
                {selectedRelationships.map((relationship) => (
                  <button
                    key={relationship.id}
                    className="w-full rounded-md border border-border bg-background p-3 text-left hover:bg-muted/45"
                    onClick={() => onEdit("knowledgeRelationships", relationship)}
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="violet">{formatEnum(relationship.relationshipType)}</Badge>
                      <Badge tone="blue">{relationship.strength.toFixed(2)}</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{relationship.evidence}</p>
                  </button>
                ))}
              </section>
            </CardContent>
          ) : null}
        </Card>
      </section>
    </div>
  );
}

function WorkflowLayerPage({
  state,
  page,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  onCreate,
  onEdit,
  onRunWorkflow
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
  onRunWorkflow: (workflow: AnyRecord) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const workflows = state.workflows
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const selectedWorkflow = workflows.find((item) => item.id === selectedId) ?? workflows[0];
  const steps = selectedWorkflow
    ? state.workflowSteps
        .filter((item) => item.workflowId === selectedWorkflow.id)
        .sort((a, b) => a.order - b.order)
    : [];
  const runs = selectedWorkflow
    ? state.workflowRuns
        .filter((item) => item.workspaceId === activeWorkspaceId && item.workflowId === selectedWorkflow.id)
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <CardTitle>{page.label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onCreate("workflowSteps")}>
              <Plus className="h-4 w-4" />
              Step
            </Button>
            <Button variant="outline" onClick={() => onCreate("workflowRuns")}>
              <Plus className="h-4 w-4" />
              Run
            </Button>
            <Button onClick={() => onCreate("workflows")}>
              <Plus className="h-4 w-4" />
              Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 xl:grid-cols-[minmax(240px,1fr)_170px_170px_170px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search workflows"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <FocusRow label="Workflows" value={String(workflows.length)} />
            <FocusRow label="Steps" value={String(state.workflowSteps.length)} />
            <FocusRow label="Runs" value={String(state.workflowRuns.filter((item) => item.workspaceId === activeWorkspaceId).length)} />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                className={cn(
                  "w-full rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/45",
                  selectedWorkflow?.id === workflow.id ? "bg-muted" : "bg-background"
                )}
                onClick={() => setSelectedId(workflow.id)}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="violet">{formatEnum(workflow.workflowType)}</Badge>
                  <Badge tone={statusTone(workflow.status)}>{formatEnum(workflow.status)}</Badge>
                  <Badge tone="blue">{formatEnum(workflow.triggerType)}</Badge>
                </div>
                <p className="mt-2 text-sm font-semibold">{workflow.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{workflow.description}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle>{selectedWorkflow?.name ?? "Workflow Detail"}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedWorkflow?.description ?? "Select a workflow to inspect steps and runs."}
              </p>
            </div>
            {selectedWorkflow ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit("workflows", selectedWorkflow)}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" onClick={() => onRunWorkflow(selectedWorkflow)}>
                  <ArrowRight className="h-4 w-4" />
                  Run manually
                </Button>
              </div>
            ) : null}
          </CardHeader>
          {selectedWorkflow ? (
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <FocusRow label="Steps" value={String(steps.length)} />
                <FocusRow label="Runs" value={String(runs.length)} />
                <FocusRow label="Trigger" value={formatEnum(selectedWorkflow.triggerType)} />
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Steps</h3>
                {steps.map((step) => (
                  <button
                    key={step.id}
                    className="w-full rounded-md border border-border bg-background p-3 text-left hover:bg-muted/45"
                    onClick={() => onEdit("workflowSteps", step)}
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="blue">Step {step.order}</Badge>
                      <Badge tone="violet">{formatEnum(step.stepType)}</Badge>
                      <Badge tone={statusTone(step.status)}>{formatEnum(step.status)}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{step.name}</p>
                  </button>
                ))}
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Runs and Logs</h3>
                {runs.slice(0, 6).map((run) => (
                  <button
                    key={run.id}
                    className="w-full rounded-md border border-border bg-background p-3 text-left hover:bg-muted/45"
                    onClick={() => onEdit("workflowRuns", run)}
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={statusTone(run.status)}>{formatEnum(run.status)}</Badge>
                      <Badge tone="blue">{formatDate(run.startedAt)}</Badge>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {run.logs.slice(0, 3).map((log) => (
                        <li key={log} className="text-xs leading-5 text-muted-foreground">
                          {log}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </section>
            </CardContent>
          ) : null}
        </Card>
      </section>
    </div>
  );
}

function KnowledgeGraphPage({
  state,
  page,
  activeWorkspaceId,
  searchQuery,
  setSearchQuery,
  onCreate,
  onEdit
}: {
  state: PlatformState;
  page: PageDefinition;
  activeWorkspaceId: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onCreate: (collection: EditableCollection) => void;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
}) {
  const nodes = state.knowledgeNodes
    .filter((item) => item.workspaceId === activeWorkspaceId)
    .filter((item) => itemMatchesFilters(item, searchQuery, "ALL", "ALL"));
  const edges = state.knowledgeEdges.filter((item) => item.workspaceId === activeWorkspaceId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle>{page.label}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onCreate("knowledgeEdges")}>
              <Plus className="h-4 w-4" />
              Edge
            </Button>
            <Button onClick={() => onCreate("knowledgeNodes")}>
              <Plus className="h-4 w-4" />
              Node
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search graph nodes"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>
          <RecordTable
            items={nodes}
            collection="knowledgeNodes"
            onEdit={onEdit}
            showOpportunity={false}
          />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Knowledge edges</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {edges.slice(0, 30).map((edge) => (
            <button
              key={edge.id}
              className="rounded-md border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-muted/50"
              onClick={() => onEdit("knowledgeEdges", edge)}
            >
              <Badge tone="violet">{formatEnum(edge.relationshipType)}</Badge>
              <p className="mt-2 text-sm font-semibold">
                {edge.fromNodeId} - {edge.toNodeId}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Strength {edge.strength.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function RecordTable({
  items,
  collection,
  onEdit,
  showOpportunity
}: {
  items: AnyRecord[];
  collection: EditableCollection;
  onEdit: (collection: EditableCollection, item: AnyRecord) => void;
  showOpportunity: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="w-[30%] px-3 py-2 font-medium">Object</th>
            <th className="w-[28%] px-3 py-2 font-medium">Context</th>
            {showOpportunity ? <th className="w-[10%] px-3 py-2 font-medium">Score</th> : null}
            <th className="w-[10%] px-3 py-2 font-medium">Priority</th>
            <th className="w-[10%] px-3 py-2 font-medium">Status</th>
            <th className="w-[10%] px-3 py-2 font-medium">Updated</th>
            <th className="w-[2%] px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border align-top hover:bg-muted/45">
              <td className="px-3 py-3">
                <p className="truncate font-semibold">{getTitle(item)}</p>
                <p className="mt-1 max-h-10 overflow-hidden text-xs leading-5 text-muted-foreground">
                  {recordDescription(item)}
                </p>
              </td>
              <td className="px-3 py-3">
                <ContextBadges item={item} />
              </td>
              {showOpportunity ? (
                <td className="px-3 py-3">
                  <Badge tone={item.opportunityScore >= 5500 ? "red" : "amber"}>
                    {item.opportunityScore}
                  </Badge>
                </td>
              ) : null}
              <td className="px-3 py-3">
                {"priority" in item ? (
                  <Badge tone={priorityTone(item.priority)}>{formatEnum(item.priority)}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-3 py-3">
                {"status" in item ? (
                  <Badge tone={statusTone(item.status)}>{formatEnum(item.status)}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                {formatDate(String(item.updatedAt ?? item.createdAt ?? new Date().toISOString()))}
              </td>
              <td className="px-3 py-3">
                <Button variant="outline" size="icon" onClick={() => onEdit(collection, item)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
          No records match this view.
        </div>
      ) : null}
    </div>
  );
}

function TableFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  hasStatus,
  hasPriority,
  children
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: FilterValue<string>;
  setStatusFilter: (value: FilterValue<string>) => void;
  priorityFilter: FilterValue<Priority>;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  hasStatus: boolean;
  hasPriority: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mb-3 grid gap-2 xl:grid-cols-[minmax(240px,1fr)_170px_170px_190px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search records"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
      {hasStatus ? (
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as FilterValue<string>)}
        >
          <option value="ALL">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatEnum(status)}
            </option>
          ))}
        </Select>
      ) : (
        <div />
      )}
      {hasPriority ? (
        <Select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as FilterValue<Priority>)}
        >
          <option value="ALL">All priorities</option>
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {formatEnum(priority)}
            </option>
          ))}
        </Select>
      ) : (
        <div />
      )}
      {children ?? (
        <div className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex">
          <Filter className="h-4 w-4" />
          Workspace scoped
        </div>
      )}
    </div>
  );
}

function EditorPanel({
  draft,
  setDraft,
  onSave,
  onDelete,
  onConvert,
  state
}: {
  draft: DraftState;
  setDraft: (draft: DraftState) => void;
  onSave: () => void;
  onDelete: () => void;
  onConvert: (conversion: string, item: AnyRecord, collection: EditableCollection) => void;
  state: PlatformState;
}) {
  if (!draft) return null;

  const fields = getEditorFields(draft.collection, state);

  function updateField(key: string, value: string, kind?: FieldConfig["kind"]) {
    const nextValue =
      kind === "number"
        ? Number(value)
        : kind === "tags"
          ? value
              .split(/[,\n]/)
              .map((item) => item.trim())
              .filter(Boolean)
          : value;
    setDraft({
      ...draft,
      item: {
        ...draft.item,
        [key]: nextValue
      }
    });
  }

  return (
    <div className="fixed inset-y-0 right-0 z-30 flex w-full max-w-xl flex-col border-l border-border bg-card shadow-panel">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{draft.isNew ? "Create" : "Edit"} record</p>
          <p className="truncate text-xs text-muted-foreground">{draft.collection}</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setDraft(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label>{field.label}</Label>
            {field.kind === "textarea" || field.kind === "tags" ? (
              <Textarea
                value={
                  Array.isArray(draft.item[field.key])
                    ? draft.item[field.key].join("\n")
                    : String(draft.item[field.key] ?? "")
                }
                onChange={(event) => updateField(field.key, event.target.value, field.kind)}
              />
            ) : field.kind === "select" ? (
              <Select
                value={String(draft.item[field.key] ?? "")}
                onChange={(event) => updateField(field.key, event.target.value, field.kind)}
              >
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option.includes("_") ? formatEnum(option) : option}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type={field.kind === "number" ? "number" : "text"}
                value={String(draft.item[field.key] ?? "")}
                onChange={(event) => updateField(field.key, event.target.value, field.kind)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border p-4">
        <div className="flex flex-wrap gap-2">
          {getConversionOptions(draft.collection).map((option) => (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              onClick={() => onConvert(option.value, draft.item, draft.collection)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
        <Button onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="danger" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        </div>
      </div>
    </div>
  );
}

function getEditorFields(collection: EditableCollection, state: PlatformState): FieldConfig[] {
  const nodeOptions = state.knowledgeNodes.map((node) => node.id);
  const knowledgeObjectOptions = state.knowledgeObjects.map((object) => object.id);
  const workflowOptions = state.workflows.map((workflow) => workflow.id);
  const memoryOptions = state.memories.map((memory) => memory.id);
  const agentOptions = state.agents.map((agent) => agent.id);
  const commonCore: FieldConfig[] = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", kind: "textarea" },
    { key: "source", label: "Source" },
    { key: "url", label: "URL" },
    { key: "status", label: "Status", kind: "select", options: statusOptions },
    { key: "priority", label: "Priority", kind: "select", options: priorityOptions },
    { key: "owner", label: "Owner" }
  ];

  if (collection === "observations") {
    return [
      { key: "title", label: "Title" },
      { key: "platform", label: "Platform" },
      { key: "sentiment", label: "Sentiment" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "source", label: "Source" },
      { key: "sourceUrl", label: "Source URL" },
      { key: "rawText", label: "Raw Text", kind: "textarea" },
      { key: "summary", label: "Summary", kind: "textarea" }
    ];
  }

  if (collection === "conversations") {
    return commonCore;
  }

  if (collection === "insights") {
    return [
      { key: "title", label: "Title" },
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "strategicImplication", label: "Strategic Implication", kind: "textarea" },
      { key: "evidence", label: "Evidence", kind: "textarea" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" }
    ];
  }

  if (collection === "hypotheses") {
    return [
      { key: "title", label: "Title" },
      { key: "status", label: "Status", kind: "select", options: statusOptions },
      { key: "statement", label: "Statement", kind: "textarea" },
      { key: "expectedOutcome", label: "Expected Outcome", kind: "textarea" },
      { key: "relatedMetric", label: "Related Metric" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" }
    ];
  }

  if (collection === "experiments") {
    return [
      { key: "title", label: "Title" },
      { key: "status", label: "Status", kind: "select", options: statusOptions },
      { key: "channel", label: "Channel" },
      { key: "successMetric", label: "Success Metric" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "result", label: "Result", kind: "textarea" }
    ];
  }

  if (collection === "outcomes") {
    return [
      { key: "title", label: "Title" },
      { key: "metricName", label: "Metric Name" },
      { key: "metricBefore", label: "Metric Before", kind: "number" },
      { key: "metricAfter", label: "Metric After", kind: "number" },
      { key: "resultSummary", label: "Result Summary", kind: "textarea" },
      { key: "learnings", label: "Learnings", kind: "textarea" }
    ];
  }

  if (collection === "personas") {
    return [
      { key: "name", label: "Name" },
      { key: "industry", label: "Industry" },
      { key: "buyingIntent", label: "Buying Intent", kind: "textarea" },
      { key: "primaryPainPoint", label: "Primary Pain Point", kind: "textarea" },
      { key: "contentNeeds", label: "Content Needs", kind: "textarea" },
      { key: "description", label: "Description", kind: "textarea" }
    ];
  }

  if (collection === "knowledgeNodes") {
    return [
      { key: "label", label: "Label" },
      { key: "type", label: "Type" },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "description", label: "Description", kind: "textarea" }
    ];
  }

  if (collection === "knowledgeEdges") {
    return [
      { key: "fromNodeId", label: "From Node", kind: "select", options: nodeOptions },
      { key: "toNodeId", label: "To Node", kind: "select", options: nodeOptions },
      { key: "relationshipType", label: "Relationship", kind: "select", options: relationshipOptions },
      { key: "strength", label: "Strength", kind: "number" },
      { key: "notes", label: "Notes", kind: "textarea" }
    ];
  }

  if (collection === "contentAssets") {
    return [
      { key: "code", label: "Code" },
      ...commonCore,
      { key: "contentType", label: "Content Type" },
      { key: "intent", label: "Intent" },
      { key: "funnelStage", label: "Funnel Stage" }
    ];
  }

  if (collection === "directorySubmissions") {
    return [{ key: "name", label: "Name" }, ...commonCore];
  }

  if (collection === "backlinks") {
    return [
      ...commonCore,
      { key: "targetUrl", label: "Target URL" },
      { key: "directorySubmissionId", label: "Directory Submission ID" }
    ];
  }

  if (collection === "featureRequests" || collection === "tasks") {
    return commonCore;
  }

  if (collection === "keywords") {
    return [
      { key: "name", label: "Name" },
      ...commonCore,
      { key: "intent", label: "Intent" },
      { key: "funnelStage", label: "Funnel Stage" }
    ];
  }

  if (collection === "events") {
    return [
      { key: "title", label: "Title" },
      { key: "eventType", label: "Event Type" },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "severity", label: "Severity" },
      { key: "status", label: "Status" },
      { key: "description", label: "Description", kind: "textarea" }
    ];
  }

  if (collection === "recommendedActions") {
    return [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "actionType", label: "Action Type" },
      { key: "priority", label: "Priority", kind: "select", options: priorityOptions },
      { key: "status", label: "Status", kind: "select", options: ["PENDING", "IN_PROGRESS", "COMPLETED", "DISMISSED"] },
      { key: "dueDate", label: "Due Date" },
      { key: "owner", label: "Owner" },
      { key: "reasoning", label: "Reasoning", kind: "textarea" },
      { key: "expectedImpact", label: "Expected Impact", kind: "textarea" }
    ];
  }

  if (collection === "memories") {
    return [
      { key: "topic", label: "Topic" },
      { key: "entity", label: "Entity" },
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "sourceTypes", label: "Source Types", kind: "tags" },
      { key: "linkedSourceIds", label: "Linked Source IDs", kind: "tags" },
      { key: "firstSeen", label: "First Seen" },
      { key: "lastSeen", label: "Last Seen" },
      { key: "frequency", label: "Frequency", kind: "number" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "importanceScore", label: "Importance Score", kind: "number" },
      { key: "status", label: "Status", kind: "select", options: statusOptions }
    ];
  }

  if (collection === "patterns") {
    return [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", kind: "textarea" },
      {
        key: "patternType",
        label: "Pattern Type",
        kind: "select",
        options: [
          "RECURRING_QUESTION",
          "COMPETITOR_COMPLAINT",
          "CONTENT_GAP",
          "PRODUCT_DEMAND",
          "AUTHORITY_OPPORTUNITY",
          "SEO_OPPORTUNITY",
          "AEO_OPPORTUNITY",
          "GEO_OPPORTUNITY"
        ]
      },
      { key: "relatedEntity", label: "Related Entity" },
      { key: "frequency", label: "Frequency", kind: "number" },
      { key: "trendDirection", label: "Trend Direction", kind: "select", options: ["RISING", "STABLE", "DECLINING"] },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "importanceScore", label: "Importance Score", kind: "number" },
      { key: "status", label: "Status", kind: "select", options: statusOptions }
    ];
  }

  if (collection === "objectives") {
    return [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", kind: "textarea" },
      {
        key: "category",
        label: "Category",
        kind: "select",
        options: ["SEO", "AEO", "GEO", "AUTHORITY", "CONTENT", "PRODUCT", "REVENUE", "COMMUNITY", "BRAND"]
      },
      { key: "priority", label: "Priority", kind: "select", options: priorityOptions },
      { key: "status", label: "Status", kind: "select", options: statusOptions },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" }
    ];
  }

  if (collection === "agents") {
    return [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", kind: "textarea" },
      {
        key: "agentType",
        label: "Agent Type",
        kind: "select",
        options: [
          "CONVERSATION_AGENT",
          "CONTENT_AGENT",
          "SEO_AGENT",
          "AEO_AGENT",
          "GEO_AGENT",
          "AUTHORITY_AGENT",
          "COMPETITOR_AGENT",
          "PRODUCT_AGENT",
          "EXPERIMENT_AGENT"
        ]
      },
      { key: "status", label: "Status", kind: "select", options: statusOptions },
      { key: "mission", label: "Mission", kind: "textarea" },
      { key: "inputSources", label: "Input Sources", kind: "tags" },
      { key: "outputTypes", label: "Output Types", kind: "tags" },
      { key: "parentAgentId", label: "Parent Agent", kind: "select", options: ["", ...agentOptions] },
      { key: "dependsOnAgentIds", label: "Depends On Agents", kind: "tags" },
      { key: "allowedWorkflowIds", label: "Allowed Workflows", kind: "tags" },
      { key: "lastRunAt", label: "Last Run At" }
    ];
  }

  if (collection === "agentRuns") {
    return [
      { key: "agentId", label: "Agent ID" },
      { key: "status", label: "Status", kind: "select", options: ["PENDING", "IN_PROGRESS", "COMPLETED", "DISMISSED"] },
      { key: "inputSummary", label: "Input Summary", kind: "textarea" },
      { key: "outputSummary", label: "Output Summary", kind: "textarea" },
      { key: "recommendationsCreated", label: "Recommendations Created", kind: "number" },
      { key: "actionsCreated", label: "Actions Created", kind: "number" },
      { key: "startedAt", label: "Started At" },
      { key: "completedAt", label: "Completed At" },
      { key: "logs", label: "Logs", kind: "tags" }
    ];
  }

  if (collection === "reasoningTraces") {
    return [
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "inputSummary", label: "Input Summary", kind: "textarea" },
      { key: "reasoningSteps", label: "Reasoning Steps", kind: "tags" },
      { key: "conclusion", label: "Conclusion", kind: "textarea" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "recommendedActionIds", label: "Recommended Action IDs", kind: "tags" }
    ];
  }

  if (collection === "intelligenceObjects") {
    return [
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "detectedIntent", label: "Intent", kind: "select", options: ["INFORMATIONAL", "COMMERCIAL", "TRANSACTIONAL", "NAVIGATIONAL", "COMMUNITY_DISCUSSION"] },
      { key: "detectedPersona", label: "Persona" },
      { key: "detectedEntities", label: "Entities", kind: "tags" },
      { key: "detectedKeywords", label: "Keywords", kind: "tags" },
      { key: "detectedPainPoints", label: "Pain Points", kind: "tags" },
      { key: "sentiment", label: "Sentiment" },
      { key: "opportunityScore", label: "Opportunity Score", kind: "number" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "reasoning", label: "Reasoning", kind: "textarea" }
    ];
  }

  if (collection === "knowledgeObjects") {
    return [
      { key: "canonicalId", label: "Canonical ID" },
      { key: "objectType", label: "Object Type", kind: "select", options: knowledgeObjectTypeOptions },
      { key: "title", label: "Title" },
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "canonicalEntityId", label: "Canonical Entity ID", kind: "select", options: ["", ...knowledgeObjectOptions] },
      { key: "aliases", label: "Aliases", kind: "tags" },
      { key: "tags", label: "Tags", kind: "tags" },
      { key: "searchableText", label: "Searchable Text", kind: "textarea" },
      { key: "embeddingProvider", label: "Embedding Provider" },
      { key: "embeddingModel", label: "Embedding Model" },
      { key: "importanceScore", label: "Importance Score", kind: "number" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "status", label: "Status", kind: "select", options: statusOptions }
    ];
  }

  if (collection === "knowledgeRelationships") {
    return [
      { key: "fromObjectId", label: "From Object", kind: "select", options: knowledgeObjectOptions },
      { key: "toObjectId", label: "To Object", kind: "select", options: knowledgeObjectOptions },
      { key: "relationshipType", label: "Relationship", kind: "select", options: knowledgeRelationshipOptions },
      { key: "strength", label: "Strength", kind: "number" },
      { key: "evidence", label: "Evidence", kind: "textarea" }
    ];
  }

  if (collection === "memorySnapshots") {
    return [
      { key: "memoryId", label: "Memory", kind: "select", options: memoryOptions },
      { key: "period", label: "Period" },
      { key: "summary", label: "Summary", kind: "textarea" },
      { key: "frequency", label: "Frequency", kind: "number" },
      { key: "importanceScore", label: "Importance Score", kind: "number" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "trendDirection", label: "Trend Direction", kind: "select", options: ["RISING", "STABLE", "DECLINING"] },
      { key: "notableSources", label: "Notable Sources", kind: "tags" }
    ];
  }

  if (collection === "workflows") {
    return [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "workflowType", label: "Workflow Type", kind: "select", options: workflowTypeOptions },
      { key: "status", label: "Status", kind: "select", options: statusOptions },
      { key: "triggerType", label: "Trigger Type", kind: "select", options: triggerTypeOptions }
    ];
  }

  if (collection === "workflowSteps") {
    return [
      { key: "workflowId", label: "Workflow", kind: "select", options: workflowOptions },
      { key: "order", label: "Order", kind: "number" },
      { key: "name", label: "Name" },
      { key: "stepType", label: "Step Type", kind: "select", options: workflowStepTypeOptions },
      { key: "status", label: "Status", kind: "select", options: ["PENDING", "IN_PROGRESS", "COMPLETED", "DISMISSED"] }
    ];
  }

  if (collection === "workflowRuns") {
    return [
      { key: "workflowId", label: "Workflow", kind: "select", options: workflowOptions },
      { key: "status", label: "Status", kind: "select", options: ["PENDING", "IN_PROGRESS", "COMPLETED", "DISMISSED"] },
      { key: "triggerSourceType", label: "Trigger Source Type" },
      { key: "triggerSourceId", label: "Trigger Source ID" },
      { key: "startedAt", label: "Started At" },
      { key: "completedAt", label: "Completed At" },
      { key: "logs", label: "Logs", kind: "tags" }
    ];
  }

  if (collection === "agentHandoffs") {
    return [
      { key: "fromAgentId", label: "From Agent", kind: "select", options: agentOptions },
      { key: "toAgentId", label: "To Agent", kind: "select", options: agentOptions },
      { key: "sourceType", label: "Source Type" },
      { key: "sourceId", label: "Source ID" },
      { key: "reason", label: "Reason", kind: "textarea" },
      { key: "status", label: "Status", kind: "select", options: ["PENDING", "IN_PROGRESS", "COMPLETED", "DISMISSED"] },
      { key: "completedAt", label: "Completed At" }
    ];
  }

  if (collection === "aiRecommendations") {
    return [
      ...commonCore,
      { key: "recommendationType", label: "Recommendation Type", kind: "select", options: recommendationOptions },
      { key: "targetEntityType", label: "Target Entity Type" },
      { key: "targetEntityId", label: "Target Entity ID" },
      { key: "suggestedAction", label: "Suggested Action", kind: "textarea" },
      { key: "reasoning", label: "Reasoning", kind: "textarea" },
      { key: "confidenceScore", label: "Confidence Score", kind: "number" },
      { key: "generatedBy", label: "Generated By" }
    ];
  }

  return [
    ...commonCore,
    { key: "searchVolumeEstimate", label: "Search Volume Estimate", kind: "number" },
    { key: "businessValueScore", label: "Business Value Score", kind: "number" },
    { key: "painSeverityScore", label: "Pain Severity Score", kind: "number" },
    { key: "competitionScore", label: "Competition Score", kind: "number" },
    { key: "trendScore", label: "Trend Score", kind: "number" },
    { key: "authorityGapScore", label: "Authority Gap Score", kind: "number" },
    { key: "opportunityScore", label: "Opportunity Score", kind: "number" }
  ];
}

function createDefaultOpportunity(collection: "questions" | "painPoints", activeWorkspaceId: string) {
  const date = new Date().toISOString();
  const item = {
    id: createScopedId(collection),
    organizationId: "org-apj-labs",
    workspaceId: activeWorkspaceId,
    title: collection === "questions" ? "New question opportunity" : "New pain point opportunity",
    description: "",
    source: "Manual",
    url: "https://vidmaker.com",
    status: "RESEARCHING",
    priority: "HIGH",
    owner: "Growth Intelligence",
    searchVolumeEstimate: 0,
    businessValueScore: 7,
    painSeverityScore: 7,
    competitionScore: 4,
    trendScore: 7,
    authorityGapScore: 7,
    opportunityScore: 0,
    createdAt: date,
    updatedAt: date
  };

  return {
    ...item,
    opportunityScore: calculateOpportunityScore(item),
    ...(collection === "questions"
      ? { intent: "INFORMATIONAL", funnelStage: "TOFU", personaIds: [], contentAssetIds: [] }
      : { personaIds: [], featureRequestIds: [] })
  };
}

function ContextBadges({ item }: { item: AnyRecord }) {
  const badges = [
    item.platform ? ["Platform", item.platform, "teal"] : null,
    item.sentiment ? ["Sentiment", item.sentiment, "slate"] : null,
    item.confidenceScore !== undefined ? ["Confidence", `${Math.round(Number(item.confidenceScore) * 100)}%`, "blue"] : null,
    item.recommendationType ? ["Type", formatEnum(item.recommendationType), "violet"] : null,
    item.targetEntityType ? ["Target", item.targetEntityType, "slate"] : null,
    item.relationshipType ? ["Relationship", formatEnum(item.relationshipType), "violet"] : null,
    item.objectType ? ["Object", formatEnum(item.objectType), "violet"] : null,
    item.workflowType ? ["Workflow", formatEnum(item.workflowType), "violet"] : null,
    item.triggerType ? ["Trigger", formatEnum(item.triggerType), "blue"] : null,
    item.stepType ? ["Step", formatEnum(item.stepType), "teal"] : null,
    item.strength !== undefined ? ["Strength", Number(item.strength).toFixed(2), "blue"] : null,
    item.opportunityKind ? ["Kind", item.opportunityKind, "slate"] : null,
    item.businessValueScore !== undefined ? ["Business", item.businessValueScore, "green"] : null,
    item.competitionScore !== undefined ? ["Competition", item.competitionScore, "amber"] : null,
    item.importanceScore !== undefined ? ["Importance", item.importanceScore, "amber"] : null,
    item.frequency !== undefined ? ["Frequency", item.frequency, "teal"] : null,
    item.trendDirection ? ["Trend", formatEnum(item.trendDirection), "blue"] : null,
    item.patternType ? ["Pattern", formatEnum(item.patternType), "violet"] : null,
    item.category ? ["Category", formatEnum(item.category), "green"] : null,
    item.agentType ? ["Agent", formatEnum(item.agentType), "violet"] : null,
    item.industry ? ["Industry", item.industry, "blue"] : null,
    item.channel ? ["Channel", item.channel, "teal"] : null
  ].filter(Boolean) as [string, string | number, "blue" | "teal" | "amber" | "green" | "slate" | "violet"][];

  if (badges.length === 0) {
    return <span className="text-xs text-muted-foreground">Workspace scoped</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.slice(0, 4).map(([label, value, tone]) => (
        <Badge key={`${label}-${value}`} tone={tone}>
          {label}: {value}
        </Badge>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Activity className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
