import {
  createScopedId,
  orgId,
  type CollectionKey,
  type Event,
  type Mission,
  type MissionObjective,
  type MissionPlan,
  type MissionType,
  type Objective,
  type PageDefinition,
  type PageId,
  type Plan,
  type PlanItem,
  type PlanItemType,
  type PlanType,
  type Priority,
  type RecommendedAction,
  type Workspace
} from "@/lib/vgos-data";

export type NavigationGroup = {
  label: string;
  pages: PageId[];
};

export type PersonaMode = "Founder" | "Marketing" | "SEO" | "Product" | "Developer";
export type NavigationMode = "operator" | "studio";

export const personaModes: PersonaMode[] = ["Founder", "Marketing", "SEO", "Product", "Developer"];

export const operatorNavigationGroups: NavigationGroup[] = [
  {
    label: "Operator Mode",
    pages: ["executiveBrief", "workQueue", "missions", "plans", "executions", "results", "advisor", "settings"]
  }
];

export const intelligenceStudioNavigationGroups: NavigationGroup[] = [
  {
    label: "Intelligence Studio",
    pages: ["signals", "intelligencePipeline", "knowledge", "memory", "patterns", "reasoning", "assumptions", "evidence", "tradeoffs", "reflections"]
  },
  {
    label: "Connections",
    pages: ["connectors", "syncRuns"]
  },
  {
    label: "System",
    pages: ["missionControl", "capabilities", "auditLogs", "systemHealth", "settings"]
  }
];

export const developerNavigationGroups: NavigationGroup[] = [
  {
    label: "Executive",
    pages: ["executiveBrief", "workQueue", "advisor", "results"]
  },
  {
    label: "Command Center",
    pages: ["missionControl", "briefing", "priorities"]
  },
  {
    label: "Strategy",
    pages: ["missions", "plans", "objectives", "strategyAdjustments"]
  },
  {
    label: "Operations",
    pages: ["executions", "approvals", "blockers", "evidence", "results"]
  },
  {
    label: "Intelligence",
    pages: ["signals", "intelligencePipeline", "knowledge", "memory", "patterns", "reasoning", "assumptions", "evidence", "tradeoffs", "reflections", "learnings"]
  },
  {
    label: "Connections",
    pages: ["connectors", "syncRuns"]
  },
  {
    label: "System",
    pages: ["capabilities", "auditLogs", "systemHealth", "settings"]
  }
];

export const navigationGroups = operatorNavigationGroups;

const personaShortcutMap: Record<PersonaMode, PageId[]> = {
  Founder: ["executiveBrief", "missions", "workQueue", "results", "advisor", "settings"],
  Marketing: ["contentEngine", "approvals", "results", "recommendedActions", "workQueue", "advisor"],
  SEO: ["searchEngine", "opportunityQueue", "contentEngine", "authorityEngine", "results", "advisor"],
  Product: ["productEngine", "blockers", "executions", "results", "signals", "advisor"],
  Developer: ["missionControl", "connectors", "signals", "intelligencePipeline", "capabilities", "systemHealth"]
};

const personaNavigationMap: Partial<Record<PersonaMode, NavigationGroup[]>> = {
  Marketing: [
    {
      label: "Marketing Focus",
      pages: ["executiveBrief", "workQueue", "contentEngine", "approvals", "results", "recommendedActions", "advisor", "settings"]
    }
  ],
  SEO: [
    {
      label: "SEO Focus",
      pages: ["executiveBrief", "workQueue", "searchEngine", "opportunityQueue", "contentEngine", "authorityEngine", "results", "advisor"]
    }
  ],
  Product: [
    {
      label: "Product Focus",
      pages: ["executiveBrief", "workQueue", "productEngine", "blockers", "executions", "signals", "results", "advisor"]
    }
  ]
};

export function getNavigationGroupsForMode(personaMode: PersonaMode, navigationMode: NavigationMode): NavigationGroup[] {
  if (personaMode === "Developer") return developerNavigationGroups;
  if (navigationMode === "studio") return intelligenceStudioNavigationGroups;
  return personaNavigationMap[personaMode] ?? operatorNavigationGroups;
}

export function getPersonaShortcuts(personaMode: PersonaMode) {
  return personaShortcutMap[personaMode];
}

export function getPersonaEmphasis(personaMode: PersonaMode) {
  const copy: Record<PersonaMode, { title: string; description: string }> = {
    Founder: {
      title: "Executive partner mode",
      description: "Founder mode emphasizes the brief, missions, daily work, results, and advisor."
    },
    Marketing: {
      title: "Marketing operating mode",
      description: "Marketing mode emphasizes campaigns, content, approvals, results, and recommendations."
    },
    SEO: {
      title: "SEO intelligence mode",
      description: "SEO mode emphasizes keywords, AEO/GEO, content clusters, backlinks, and search performance."
    },
    Product: {
      title: "Product signal mode",
      description: "Product mode emphasizes feedback, blockers, feature requests, product signals, and execution results."
    },
    Developer: {
      title: "Developer mode",
      description: "Developer mode exposes technical pages, connectors, signals, pipelines, capabilities, audit logs, and system health."
    }
  };
  return copy[personaMode];
}

export const readOnlyCollections = new Set<CollectionKey>([
  "auditLogs",
  "connectorSyncRuns",
  "events"
]);

export const defaultMissionSelections = [
  "SEO Authority",
  "AEO/GEO Visibility",
  "Product Launch Momentum",
  "Founder Authority",
  "Community Growth",
  "Backlink Authority",
  "Product Feedback Intelligence"
];

export const connectorSetupOptions = [
  "GitHub",
  "Google Search Console",
  "Google Analytics",
  "Product Hunt",
  "LinkedIn",
  "X",
  "Reddit",
  "Manual Import"
];

export type OnboardingAnswers = {
  workspaceName: string;
  companyProductName: string;
  website: string;
  primaryGoal: string;
  productDescription: string;
  targetAudience: string;
  positioning: string;
  competitors: string;
  selectedMissions: string[];
  selectedConnectors: string[];
};

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "workspace";
}

function missionTypeForSelection(selection: string): MissionType {
  if (selection.includes("SEO")) return "SEO";
  if (selection.includes("AEO") || selection.includes("GEO")) return "GEO";
  if (selection.includes("Launch")) return "LAUNCH";
  if (selection.includes("Community")) return "COMMUNITY";
  if (selection.includes("Feedback")) return "PRODUCT";
  if (selection.includes("Backlink") || selection.includes("Founder")) return "AUTHORITY";
  return "GROWTH";
}

function planTypeForSelection(selection: string): PlanType {
  if (selection.includes("SEO")) return "SEO_PLAN";
  if (selection.includes("AEO") || selection.includes("GEO")) return "GEO_PLAN";
  if (selection.includes("Launch")) return "LAUNCH_PLAN";
  if (selection.includes("Community")) return "COMMUNITY_PLAN";
  if (selection.includes("Feedback")) return "PRODUCT_PLAN";
  if (selection.includes("Backlink") || selection.includes("Founder")) return "AUTHORITY_PLAN";
  return "CONTENT_PLAN";
}

function itemTypeForSelection(selection: string): PlanItemType {
  if (selection.includes("Founder")) return "FOUNDER_POST";
  if (selection.includes("Community")) return "COMMUNITY_REPLY";
  if (selection.includes("Backlink")) return "BACKLINK_OUTREACH";
  if (selection.includes("Feedback")) return "PRODUCT_TASK";
  if (selection.includes("Launch")) return "DEMO";
  return "BLOG";
}

export function createOnboardingArtifacts(answers: OnboardingAnswers, workspaceId: string) {
  const now = new Date().toISOString();
  const selectedMissions = answers.selectedMissions.length
    ? answers.selectedMissions
    : defaultMissionSelections.slice(0, 3);
  const primaryMission = selectedMissions[0] ?? "Growth Foundation";
  const priority: Priority = "HIGH";
  const objectiveId = createScopedId("objective-onboarding");
  const missionId = createScopedId("mission-onboarding");
  const planId = createScopedId("plan-onboarding");
  const productName = answers.companyProductName || answers.workspaceName || "Workspace";
  const workspacePatch: Partial<Workspace> = {
    name: answers.workspaceName || `${productName} Growth OS`,
    slug: slugify(answers.workspaceName || `${productName} Growth OS`),
    companyProductName: productName,
    website: answers.website,
    defaultOwner: "Tom Promise",
    productDescription: answers.productDescription,
    targetAudience: answers.targetAudience,
    positioning: answers.positioning,
    competitors: answers.competitors
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
    weeklyCapacity: 20,
    defaultMissionPriority: priority,
    contentCadence: "2 proof assets and 1 learning review per week",
    approvalRequirements: ["Founder approval", "Brand approval"],
    onboardingCompleted: true,
    onboardingCompletedAt: now
  };

  const base = {
    organizationId: orgId,
    workspaceId,
    createdAt: now,
    updatedAt: now
  };

  const objective: Objective = {
    id: objectiveId,
    title: `${productName} growth foundation`,
    description: answers.primaryGoal || `Build a repeatable growth operating rhythm for ${productName}.`,
    category: "BRAND",
    priority,
    status: "IN_PROGRESS",
    startDate: now,
    endDate: addDays(45),
    ...base
  };

  const mission: Mission = {
    id: missionId,
    title: primaryMission,
    description:
      answers.primaryGoal ||
      `Use ${primaryMission.toLowerCase()} to create the first measurable growth loop for ${productName}.`,
    missionType: missionTypeForSelection(primaryMission),
    owner: "Tom Promise",
    priority,
    status: "ACTIVE",
    healthScore: 72,
    confidenceScore: 0.78,
    velocityScore: 58,
    completionScore: 8,
    riskScore: 24,
    startDate: now,
    targetDate: addDays(45),
    notes: `Created from onboarding. Selected missions: ${selectedMissions.join(", ")}.`,
    ...base
  };

  const plan: Plan = {
    id: planId,
    title: `${productName} first operating plan`,
    description: "Initial plan generated from onboarding context, selected missions, and connector readiness.",
    planType: planTypeForSelection(primaryMission),
    status: "ACTIVE",
    objectiveId,
    startDate: now,
    endDate: addDays(21),
    owner: "Tom Promise",
    expectedOutcome: answers.primaryGoal || `Create a working operating plan for ${productName}.`,
    confidenceScore: 0.76,
    ...base
  };

  const planItems: PlanItem[] = selectedMissions.slice(0, 5).map((selection, index) => ({
    id: createScopedId("plan-item-onboarding"),
    planId,
    title: `Stand up ${selection}`,
    description: `Create the first measurable work item for ${selection.toLowerCase()}.`,
    itemType: itemTypeForSelection(selection),
    priority: index < 2 ? "HIGH" : "MEDIUM",
    status: index === 0 ? "IN_PROGRESS" : "NOT_STARTED",
    owner: "Tom Promise",
    dueDate: addDays(index + 3),
    estimatedImpactScore: 82 - index * 4,
    estimatedEffortScore: 38 + index * 6,
    ...base
  }));

  const recommendedActions: RecommendedAction[] = [
    {
      id: createScopedId("recommended-action-onboarding"),
      title: "Create the first proof asset",
      description: `Show how ${productName} delivers the primary outcome from onboarding.`,
      sourceType: "Onboarding",
      sourceId: missionId,
      actionType: "CREATE_DEMO",
      priority: "HIGH",
      status: "PENDING",
      dueDate: addDays(2),
      owner: "Tom Promise",
      reasoning: "A concrete proof asset makes the first mission easier to execute and approve.",
      expectedImpact: "Clearer positioning, faster approvals, and stronger launch follow-up.",
      confidenceScore: 0.84,
      qualityScore: 82,
      evidenceStrength: 70,
      missingEvidence: ["Live asset URL"],
      duplicateRisk: 0.12,
      confidenceExplanation: "Generated from onboarding goal, positioning, and selected missions.",
      objectiveId,
      ...base
    },
    {
      id: createScopedId("recommended-action-onboarding"),
      title: "Connect the highest-signal source",
      description: `Prepare ${answers.selectedConnectors[0] ?? "Manual Import"} as the first operational signal source.`,
      sourceType: "Onboarding",
      sourceId: missionId,
      actionType: "FOLLOW_UP",
      priority: "MEDIUM",
      status: "PENDING",
      dueDate: addDays(4),
      owner: "Tom Promise",
      reasoning: "VGOS needs one dependable signal stream before expanding connector coverage.",
      expectedImpact: "Better daily priorities and less manual context entry.",
      confidenceScore: 0.78,
      qualityScore: 76,
      evidenceStrength: 64,
      missingEvidence: ["Connector verification"],
      duplicateRisk: 0.18,
      confidenceExplanation: "Based on connector choices and mock/live readiness.",
      objectiveId,
      ...base
    },
    {
      id: createScopedId("recommended-action-onboarding"),
      title: "Define approval rules for first launch work",
      description: "Set the approval path for content, claims, brand language, and launch assets.",
      sourceType: "Onboarding",
      sourceId: missionId,
      actionType: "FOLLOW_UP",
      priority: "MEDIUM",
      status: "PENDING",
      dueDate: addDays(5),
      owner: "Tom Promise",
      reasoning: "Approval clarity prevents daily execution from stalling after the first plan is generated.",
      expectedImpact: "Fewer blocked execution items and cleaner audit history.",
      confidenceScore: 0.8,
      qualityScore: 78,
      evidenceStrength: 68,
      missingEvidence: [],
      duplicateRisk: 0.1,
      confidenceExplanation: "Based on production readiness controls and executive operating needs.",
      objectiveId,
      ...base
    }
  ];

  const missionObjectives: MissionObjective[] = [
    {
      id: createScopedId("mission-objective-onboarding"),
      missionId,
      objectiveId,
      workspaceId,
      weight: 1,
      createdAt: now
    }
  ];

  const missionPlans: MissionPlan[] = [
    {
      id: createScopedId("mission-plan-onboarding"),
      missionId,
      planId,
      workspaceId,
      weight: 1,
      createdAt: now
    }
  ];

  const events: Event[] = [
    {
      id: createScopedId("event-onboarding"),
      organizationId: orgId,
      workspaceId,
      eventType: "MISSION_CREATED",
      sourceType: "Onboarding",
      sourceId: missionId,
      title: `${primaryMission} created from onboarding`,
      description: answers.primaryGoal || mission.description,
      metadata: {
        selectedMissions,
        selectedConnectors: answers.selectedConnectors,
        generatedBy: "production-ux-onboarding"
      },
      severity: "HIGH",
      status: "PENDING",
      createdAt: now
    }
  ];

  return {
    workspacePatch,
    objective,
    mission,
    plan,
    planItems,
    recommendedActions,
    missionObjectives,
    missionPlans,
    events
  };
}

export function getPageIntro(page: PageDefinition) {
  const byPage: Partial<Record<PageId, { whyItMatters: string; nextActionLabel?: string }>> = {
    missionControl: {
      whyItMatters: "System Mission Control keeps the technical operating surface available under Intelligence Studio."
    },
    onboarding: {
      whyItMatters: "VGOS uses onboarding answers to seed the workspace context, first mission, first plan, and recommended actions.",
      nextActionLabel: "Generate First Plan"
    },
    priorities: {
      whyItMatters: "VGOS ranks mission, execution, and recommendation signals so the operator can focus capacity on the highest-impact work."
    },
    systemHealth: {
      whyItMatters: "VGOS separates diagnostics from daily command work so connector health, errors, quality risk, and readiness gaps stay visible."
    },
    settings: {
      whyItMatters: "VGOS applies workspace and product context to mission generation, prioritization, approvals, connector setup, and future persistence."
    }
  };
  const fallback = page.collection
    ? `VGOS uses ${page.label.toLowerCase()} records as workspace-scoped operating context for missions, plans, executions, and recommendations.`
    : "VGOS uses this view to organize workspace context and keep daily operations clear.";
  return {
    title: page.label,
    description: page.description,
    whyItMatters: byPage[page.id]?.whyItMatters ?? fallback,
    nextActionLabel: byPage[page.id]?.nextActionLabel
  };
}

export function getEmptyStateCopy(collection: CollectionKey, label?: string) {
  const copy: Partial<Record<CollectionKey, { title: string; description: string; actionLabel: string; secondaryText: string }>> = {
    missions: {
      title: "No missions yet.",
      description: "Create your first mission to tell VGOS what strategic outcome to drive.",
      actionLabel: "Create Mission",
      secondaryText: "Missions connect objectives, plans, executions, measurement, and learning."
    },
    connectors: {
      title: "No connectors added yet.",
      description: "Add a connector to bring live signals into VGOS.",
      actionLabel: "Add Connector",
      secondaryText: "Mock connectors are fine while the workspace is being configured."
    },
    executionItems: {
      title: "No execution items yet.",
      description: "Convert a plan item or recommendation into an execution item.",
      actionLabel: "Create Execution",
      secondaryText: "Executions track owners, due dates, approvals, evidence, blockers, and results."
    },
    approvalRequests: {
      title: "No approval requests yet.",
      description: "Request approval when work needs founder, brand, product, SEO, or publishing review.",
      actionLabel: "Request Approval",
      secondaryText: "Approvals make daily execution safer before work ships."
    },
    executionBlockers: {
      title: "No blockers yet.",
      description: "Create a blocker when work cannot proceed because a dependency, approval, asset, or resource is missing.",
      actionLabel: "Add Blocker",
      secondaryText: "Blockers help VGOS separate stalled work from ready work."
    },
    recommendedActions: {
      title: "No recommendations yet.",
      description: "Create or generate recommendations so VGOS has suggested next actions to rank.",
      actionLabel: "Create Recommendation",
      secondaryText: "Recommendations can become plan items, execution items, or tasks."
    },
    assumptions: {
      title: "No assumptions yet.",
      description: "Add assumptions when a recommendation depends on something VGOS should test.",
      actionLabel: "Create Assumption",
      secondaryText: "Assumptions make uncertainty explicit before confidence rises."
    },
    evidenceAssessments: {
      title: "No evidence assessments yet.",
      description: "Assess evidence when a recommendation needs source quality, recency, or relevance reviewed.",
      actionLabel: "Assess Evidence",
      secondaryText: "Evidence quality should explain why VGOS trusts a recommendation."
    },
    tradeoffAnalyses: {
      title: "No tradeoffs yet.",
      description: "Compare options when a decision has meaningful opportunity cost or sequencing risk.",
      actionLabel: "Create Tradeoff",
      secondaryText: "Tradeoffs help VGOS explain what it is choosing against."
    },
    reflections: {
      title: "No reflections yet.",
      description: "Create reflections after work ships, measurement arrives, or a learning changes future judgment.",
      actionLabel: "Create Reflection",
      secondaryText: "Reflections recalibrate future recommendations."
    },
    plans: {
      title: "No plans yet.",
      description: "Create a plan to sequence objectives, recommendations, constraints, and expected outcomes.",
      actionLabel: "Create Plan",
      secondaryText: "Plans become the bridge between strategy and execution."
    },
    auditLogs: {
      title: "No audit events yet.",
      description: "Audit logs appear as VGOS records manual edits, generated changes, and operational activity.",
      actionLabel: "Review System Health",
      secondaryText: "Audit records are read-only operating evidence."
    }
  };

  return (
    copy[collection] ?? {
      title: `No ${label?.toLowerCase() ?? "records"} yet.`,
      description: `Create the first ${label?.toLowerCase() ?? "record"} when this workspace has useful operating context to track.`,
      actionLabel: "Create Record",
      secondaryText: "Each record stays scoped to the active workspace."
    }
  );
}
