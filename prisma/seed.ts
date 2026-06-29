import {
  ActionStatus,
  ActionType,
  ContentType,
  EventSeverity,
  EventStatus,
  EventType,
  FunnelStage,
  Intent,
  KnowledgeObjectType,
  KnowledgeRelationshipType,
  ObjectiveCategory,
  PatternType,
  PrismaClient,
  Priority,
  RecommendationType,
  RelationshipType,
  Status,
  TrendDirection,
  AgentType,
  TriggerType,
  WorkflowStepType,
  WorkflowType
} from "@prisma/client";

const prisma = new PrismaClient();

const PlanType = {
  SEO_PLAN: "SEO_PLAN",
  AEO_PLAN: "AEO_PLAN",
  GEO_PLAN: "GEO_PLAN",
  AUTHORITY_PLAN: "AUTHORITY_PLAN",
  CONTENT_PLAN: "CONTENT_PLAN",
  PRODUCT_PLAN: "PRODUCT_PLAN",
  LAUNCH_PLAN: "LAUNCH_PLAN",
  COMMUNITY_PLAN: "COMMUNITY_PLAN",
  REVENUE_PLAN: "REVENUE_PLAN",
  EXPERIMENT_PLAN: "EXPERIMENT_PLAN"
} as const;

const PlanStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
} as const;

const PlanItemType = {
  BLOG: "BLOG",
  FOUNDER_POST: "FOUNDER_POST",
  COMPANY_POST: "COMPANY_POST",
  X_THREAD: "X_THREAD",
  PINTEREST_PIN: "PINTEREST_PIN",
  DIRECTORY_SUBMISSION: "DIRECTORY_SUBMISSION",
  BACKLINK_OUTREACH: "BACKLINK_OUTREACH",
  COMMUNITY_REPLY: "COMMUNITY_REPLY",
  DEMO: "DEMO",
  FAQ: "FAQ",
  LANDING_PAGE_UPDATE: "LANDING_PAGE_UPDATE",
  EXPERIMENT: "EXPERIMENT",
  PRODUCT_TASK: "PRODUCT_TASK",
  INTERNAL_LINK: "INTERNAL_LINK",
  NEWSLETTER: "NEWSLETTER",
  YOUTUBE_SCRIPT: "YOUTUBE_SCRIPT"
} as const;

const PlanItemStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  BLOCKED: "BLOCKED",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
} as const;

const PlanDependencyType = {
  BLOCKS: "BLOCKS",
  REQUIRES: "REQUIRES",
  SUPPORTS: "SUPPORTS",
  SEQUENCED_BEFORE: "SEQUENCED_BEFORE",
  SHOULD_FOLLOW: "SHOULD_FOLLOW"
} as const;

const PlanConstraintType = {
  TIME: "TIME",
  BUDGET: "BUDGET",
  CONTENT_NOT_READY: "CONTENT_NOT_READY",
  DESIGN_NOT_READY: "DESIGN_NOT_READY",
  PRODUCT_NOT_READY: "PRODUCT_NOT_READY",
  DATA_NOT_AVAILABLE: "DATA_NOT_AVAILABLE",
  RESOURCE_LIMITED: "RESOURCE_LIMITED",
  APPROVAL_REQUIRED: "APPROVAL_REQUIRED"
} as const;

const ConstraintSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const;

const PlanningEventType = {
  PLAN_CREATED: "PLAN_CREATED",
  PLAN_ACTIVATED: "PLAN_ACTIVATED",
  PLAN_COMPLETED: "PLAN_COMPLETED",
  PLAN_ITEM_COMPLETED: "PLAN_ITEM_COMPLETED",
  PLAN_ITEM_BLOCKED: "PLAN_ITEM_BLOCKED",
  MILESTONE_COMPLETED: "MILESTONE_COMPLETED",
  CONSTRAINT_ADDED: "CONSTRAINT_ADDED",
  OUTCOME_PREDICTED: "OUTCOME_PREDICTED",
  CAPABILITY_REGISTERED: "CAPABILITY_REGISTERED"
} as const;

const ExecutionType = {
  BLOG_PUBLISH: "BLOG_PUBLISH",
  FOUNDER_POST: "FOUNDER_POST",
  COMPANY_POST: "COMPANY_POST",
  X_POST: "X_POST",
  X_THREAD: "X_THREAD",
  PINTEREST_PIN: "PINTEREST_PIN",
  DIRECTORY_SUBMISSION: "DIRECTORY_SUBMISSION",
  BACKLINK_OUTREACH: "BACKLINK_OUTREACH",
  COMMUNITY_REPLY: "COMMUNITY_REPLY",
  DEMO_CREATION: "DEMO_CREATION",
  FAQ_UPDATE: "FAQ_UPDATE",
  LANDING_PAGE_UPDATE: "LANDING_PAGE_UPDATE",
  INTERNAL_LINK_UPDATE: "INTERNAL_LINK_UPDATE",
  NEWSLETTER_SEND: "NEWSLETTER_SEND",
  YOUTUBE_SCRIPT: "YOUTUBE_SCRIPT",
  PRODUCT_TASK: "PRODUCT_TASK",
  EXPERIMENT_RUN: "EXPERIMENT_RUN",
  MANUAL_ACTION: "MANUAL_ACTION"
} as const;

const ExecutionStatus = {
  QUEUED: "QUEUED",
  READY: "READY",
  IN_PROGRESS: "IN_PROGRESS",
  BLOCKED: "BLOCKED",
  NEEDS_APPROVAL: "NEEDS_APPROVAL",
  APPROVED: "APPROVED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
} as const;

const EvidenceType = {
  URL: "URL",
  SCREENSHOT: "SCREENSHOT",
  FILE: "FILE",
  NOTE: "NOTE",
  METRIC: "METRIC",
  SOCIAL_POST: "SOCIAL_POST",
  DIRECTORY_CONFIRMATION: "DIRECTORY_CONFIRMATION",
  BACKLINK_LIVE: "BACKLINK_LIVE",
  BLOG_LIVE: "BLOG_LIVE",
  COMMENT_REPLY: "COMMENT_REPLY",
  DEMO_ASSET: "DEMO_ASSET"
} as const;

const BlockerType = {
  MISSING_CONTENT: "MISSING_CONTENT",
  MISSING_GRAPHIC: "MISSING_GRAPHIC",
  MISSING_APPROVAL: "MISSING_APPROVAL",
  MISSING_ACCESS: "MISSING_ACCESS",
  TECHNICAL_ISSUE: "TECHNICAL_ISSUE",
  WAITING_ON_EXTERNAL_SITE: "WAITING_ON_EXTERNAL_SITE",
  NEEDS_REVIEW: "NEEDS_REVIEW",
  LOW_CONFIDENCE: "LOW_CONFIDENCE",
  RESOURCE_LIMIT: "RESOURCE_LIMIT",
  OTHER: "OTHER"
} as const;

const BlockerStatus = {
  OPEN: "OPEN",
  IN_REVIEW: "IN_REVIEW",
  RESOLVED: "RESOLVED",
  IGNORED: "IGNORED"
} as const;

const ApprovalType = {
  CONTENT_APPROVAL: "CONTENT_APPROVAL",
  BRAND_APPROVAL: "BRAND_APPROVAL",
  SEO_APPROVAL: "SEO_APPROVAL",
  PRODUCT_APPROVAL: "PRODUCT_APPROVAL",
  LEGAL_APPROVAL: "LEGAL_APPROVAL",
  FOUNDER_APPROVAL: "FOUNDER_APPROVAL",
  PUBLISHING_APPROVAL: "PUBLISHING_APPROVAL"
} as const;

const ApprovalStatus = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  CANCELLED: "CANCELLED"
} as const;

const ExecutionResultType = {
  COMPLETED: "COMPLETED",
  PARTIAL_SUCCESS: "PARTIAL_SUCCESS",
  FAILED: "FAILED",
  LEARNING_CAPTURED: "LEARNING_CAPTURED",
  METRIC_IMPROVED: "METRIC_IMPROVED",
  NO_IMPACT: "NO_IMPACT",
  FOLLOW_UP_REQUIRED: "FOLLOW_UP_REQUIRED"
} as const;

const ExecutionEventType = {
  EXECUTION_STARTED: "EXECUTION_STARTED",
  EXECUTION_COMPLETED: "EXECUTION_COMPLETED",
  EXECUTION_BLOCKED: "EXECUTION_BLOCKED",
  EXECUTION_FAILED: "EXECUTION_FAILED",
  APPROVAL_REQUESTED: "APPROVAL_REQUESTED",
  APPROVAL_APPROVED: "APPROVAL_APPROVED",
  APPROVAL_REJECTED: "APPROVAL_REJECTED",
  EVIDENCE_ADDED: "EVIDENCE_ADDED",
  EXECUTION_RESULT_CREATED: "EXECUTION_RESULT_CREATED"
} as const;

const MetricType = {
  TRAFFIC: "TRAFFIC",
  SIGNUPS: "SIGNUPS",
  CONVERSIONS: "CONVERSIONS",
  BACKLINKS: "BACKLINKS",
  REFERRING_DOMAINS: "REFERRING_DOMAINS",
  AI_MENTIONS: "AI_MENTIONS",
  SEARCH_IMPRESSIONS: "SEARCH_IMPRESSIONS",
  SEARCH_CLICKS: "SEARCH_CLICKS",
  SOCIAL_IMPRESSIONS: "SOCIAL_IMPRESSIONS",
  SOCIAL_ENGAGEMENT: "SOCIAL_ENGAGEMENT",
  COMMUNITY_REPLIES: "COMMUNITY_REPLIES",
  DIRECTORY_APPROVALS: "DIRECTORY_APPROVALS",
  CONTENT_PUBLISHED: "CONTENT_PUBLISHED",
  EXPERIMENT_RESULT: "EXPERIMENT_RESULT",
  REVENUE: "REVENUE",
  AUTHORITY_SCORE: "AUTHORITY_SCORE",
  CUSTOM: "CUSTOM"
} as const;

const MetricStatus = {
  HEALTHY: "HEALTHY",
  WATCH: "WATCH",
  IMPROVING: "IMPROVING",
  DECLINING: "DECLINING",
  STALLED: "STALLED",
  ARCHIVED: "ARCHIVED"
} as const;

const LearningType = {
  CONTENT_PERFORMANCE: "CONTENT_PERFORMANCE",
  CHANNEL_PERFORMANCE: "CHANNEL_PERFORMANCE",
  SEO_IMPACT: "SEO_IMPACT",
  AEO_IMPACT: "AEO_IMPACT",
  GEO_IMPACT: "GEO_IMPACT",
  AUTHORITY_IMPACT: "AUTHORITY_IMPACT",
  COMMUNITY_SIGNAL: "COMMUNITY_SIGNAL",
  PRODUCT_SIGNAL: "PRODUCT_SIGNAL",
  EXECUTION_FAILURE: "EXECUTION_FAILURE",
  STRATEGY_UPDATE: "STRATEGY_UPDATE",
  EXPERIMENT_LEARNING: "EXPERIMENT_LEARNING",
  CUSTOMER_LANGUAGE: "CUSTOMER_LANGUAGE",
  CUSTOM: "CUSTOM"
} as const;

const AttributionType = {
  INFLUENCED: "INFLUENCED",
  CAUSED: "CAUSED",
  CORRELATED: "CORRELATED",
  SUPPORTED: "SUPPORTED",
  CONTRADICTED: "CONTRADICTED",
  UNKNOWN: "UNKNOWN"
} as const;

const StrategyAdjustmentType = {
  INCREASE_FOCUS: "INCREASE_FOCUS",
  DECREASE_FOCUS: "DECREASE_FOCUS",
  PAUSE_STRATEGY: "PAUSE_STRATEGY",
  CREATE_NEW_PLAN: "CREATE_NEW_PLAN",
  UPDATE_POSITIONING: "UPDATE_POSITIONING",
  UPDATE_CONTENT_CLUSTER: "UPDATE_CONTENT_CLUSTER",
  UPDATE_KEYWORD_TARGET: "UPDATE_KEYWORD_TARGET",
  UPDATE_PERSONA_PRIORITY: "UPDATE_PERSONA_PRIORITY",
  UPDATE_CHANNEL_PRIORITY: "UPDATE_CHANNEL_PRIORITY",
  CREATE_EXPERIMENT: "CREATE_EXPERIMENT",
  CREATE_FEATURE_REQUEST: "CREATE_FEATURE_REQUEST"
} as const;

const StrategyAdjustmentStatus = {
  PROPOSED: "PROPOSED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  IMPLEMENTED: "IMPLEMENTED",
  ARCHIVED: "ARCHIVED"
} as const;

const MeasurementEventType = {
  METRIC_CREATED: "METRIC_CREATED",
  METRIC_UPDATED: "METRIC_UPDATED",
  MEASUREMENT_CREATED: "MEASUREMENT_CREATED",
  LEARNING_CREATED: "LEARNING_CREATED",
  ATTRIBUTION_CREATED: "ATTRIBUTION_CREATED",
  STRATEGY_ADJUSTMENT_PROPOSED: "STRATEGY_ADJUSTMENT_PROPOSED",
  STRATEGY_ADJUSTMENT_ACCEPTED: "STRATEGY_ADJUSTMENT_ACCEPTED",
  STRATEGY_ADJUSTMENT_REJECTED: "STRATEGY_ADJUSTMENT_REJECTED",
  STRATEGY_ADJUSTMENT_IMPLEMENTED: "STRATEGY_ADJUSTMENT_IMPLEMENTED"
} as const;

const MissionType = {
  AUTHORITY: "AUTHORITY",
  SEO: "SEO",
  AEO: "AEO",
  GEO: "GEO",
  CONTENT: "CONTENT",
  COMMUNITY: "COMMUNITY",
  PRODUCT: "PRODUCT",
  LAUNCH: "LAUNCH",
  GROWTH: "GROWTH",
  REVENUE: "REVENUE",
  CUSTOM: "CUSTOM"
} as const;

const MissionStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  BLOCKED: "BLOCKED",
  AT_RISK: "AT_RISK",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
} as const;

const MissionEventType = {
  MISSION_CREATED: "MISSION_CREATED",
  MISSION_STARTED: "MISSION_STARTED",
  MISSION_COMPLETED: "MISSION_COMPLETED",
  MISSION_BLOCKED: "MISSION_BLOCKED",
  MISSION_AT_RISK: "MISSION_AT_RISK",
  MISSION_UPDATED: "MISSION_UPDATED",
  MISSION_SUMMARY_GENERATED: "MISSION_SUMMARY_GENERATED",
  MISSION_RECOMMENDATION_CREATED: "MISSION_RECOMMENDATION_CREATED",
  MISSION_HEALTH_CHANGED: "MISSION_HEALTH_CHANGED",
  MISSION_PROGRESS_UPDATED: "MISSION_PROGRESS_UPDATED"
} as const;

const ConnectorType = {
  GOOGLE_SEARCH_CONSOLE: "GOOGLE_SEARCH_CONSOLE",
  GOOGLE_ANALYTICS: "GOOGLE_ANALYTICS",
  GITHUB: "GITHUB",
  PRODUCT_HUNT: "PRODUCT_HUNT",
  REDDIT: "REDDIT",
  LINKEDIN: "LINKEDIN",
  X: "X",
  YOUTUBE: "YOUTUBE",
  NEWSLETTER: "NEWSLETTER",
  CMS: "CMS",
  MANUAL_IMPORT: "MANUAL_IMPORT",
  CUSTOM: "CUSTOM"
} as const;

const ConnectorStatus = {
  DRAFT: "DRAFT",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
  PAUSED: "PAUSED",
  MOCK: "MOCK"
} as const;

const AuthType = {
  NONE: "NONE",
  API_KEY: "API_KEY",
  OAUTH: "OAUTH",
  WEBHOOK: "WEBHOOK",
  MANUAL: "MANUAL"
} as const;

const RawSignalStatus = {
  RECEIVED: "RECEIVED",
  NORMALIZED: "NORMALIZED",
  ROUTED: "ROUTED",
  FAILED: "FAILED",
  IGNORED: "IGNORED"
} as const;

const SignalType = {
  SEARCH_QUERY: "SEARCH_QUERY",
  TRAFFIC_CHANGE: "TRAFFIC_CHANGE",
  REFERRAL_TRAFFIC: "REFERRAL_TRAFFIC",
  SOCIAL_POST: "SOCIAL_POST",
  SOCIAL_COMMENT: "SOCIAL_COMMENT",
  COMMUNITY_THREAD: "COMMUNITY_THREAD",
  COMMUNITY_REPLY: "COMMUNITY_REPLY",
  PRODUCT_HUNT_COMMENT: "PRODUCT_HUNT_COMMENT",
  GITHUB_ISSUE: "GITHUB_ISSUE",
  GITHUB_RELEASE: "GITHUB_RELEASE",
  NEWSLETTER_METRIC: "NEWSLETTER_METRIC",
  CMS_ARTICLE: "CMS_ARTICLE",
  DIRECTORY_STATUS: "DIRECTORY_STATUS",
  BACKLINK_FOUND: "BACKLINK_FOUND",
  CUSTOM_SIGNAL: "CUSTOM_SIGNAL"
} as const;

const SyncStatus = {
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED"
} as const;

const ConnectedIntelligenceEventType = {
  CONNECTOR_CREATED: "CONNECTOR_CREATED",
  CONNECTOR_CONNECTED: "CONNECTOR_CONNECTED",
  CONNECTOR_SYNC_STARTED: "CONNECTOR_SYNC_STARTED",
  CONNECTOR_SYNC_COMPLETED: "CONNECTOR_SYNC_COMPLETED",
  CONNECTOR_SYNC_FAILED: "CONNECTOR_SYNC_FAILED",
  RAW_SIGNAL_RECEIVED: "RAW_SIGNAL_RECEIVED",
  SIGNAL_NORMALIZED: "SIGNAL_NORMALIZED",
  SIGNAL_ROUTED: "SIGNAL_ROUTED",
  SIGNAL_FAILED: "SIGNAL_FAILED",
  CONNECTOR_HEALTH_CHANGED: "CONNECTOR_HEALTH_CHANGED"
} as const;

const orgId = "org-apj-labs";
const workspaceId = "workspace-vidmaker-growth-os";

const tenant = {
  organizationId: orgId,
  workspaceId
};

const score = (
  businessValueScore: number,
  painSeverityScore: number,
  trendScore: number,
  authorityGapScore: number,
  competitionScore: number
) =>
  businessValueScore * painSeverityScore * trendScore * authorityGapScore -
  competitionScore;

const dateFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function seedFoundation() {
  const organization = await prisma.organization.upsert({
    where: { slug: "apj-labs" },
    update: {
      name: "APJ Labs",
      website: "https://apjlabs.com",
      description:
        "APJ Labs operates growth intelligence systems for product-led teams."
    },
    create: {
      id: orgId,
      name: "APJ Labs",
      slug: "apj-labs",
      website: "https://apjlabs.com",
      description:
        "APJ Labs operates growth intelligence systems for product-led teams."
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: "vidmaker-growth-os"
      }
    },
    update: {
      name: "VidMaker Growth OS",
      companyProductName: "VidMaker",
      website: "https://vidmaker.com",
      timezone: "America/Los_Angeles",
      defaultOwner: "Tom Promise",
      productDescription:
        "VidMaker turns source material such as product pages, launch pages, and scripts into governed video workflows.",
      targetAudience:
        "Founders, growth operators, ecommerce teams, SaaS marketers, creators, and agencies that need repeatable video production.",
      positioning:
        "Video Production Intelligence for teams that need source-aware, ready-to-post video workflows.",
      competitorNames: ["InVideo", "Runway", "Synthesia", "Pictory", "Canva"],
      weeklyCapacity: 24,
      defaultMissionPriority: "HIGH",
      contentCadence: "3 proof-led assets per week",
      approvalRequirements: ["Founder approval", "Brand approval", "SEO approval"],
      onboardingCompleted: true,
      onboardingCompletedAt: dateFromNow(-6)
    },
    create: {
      id: workspaceId,
      name: "VidMaker Growth OS",
      slug: "vidmaker-growth-os",
      organizationId: organization.id,
      companyProductName: "VidMaker",
      website: "https://vidmaker.com",
      timezone: "America/Los_Angeles",
      defaultOwner: "Tom Promise",
      productDescription:
        "VidMaker turns source material such as product pages, launch pages, and scripts into governed video workflows.",
      targetAudience:
        "Founders, growth operators, ecommerce teams, SaaS marketers, creators, and agencies that need repeatable video production.",
      positioning:
        "Video Production Intelligence for teams that need source-aware, ready-to-post video workflows.",
      competitorNames: ["InVideo", "Runway", "Synthesia", "Pictory", "Canva"],
      weeklyCapacity: 24,
      defaultMissionPriority: "HIGH",
      contentCadence: "3 proof-led assets per week",
      approvalRequirements: ["Founder approval", "Brand approval", "SEO approval"],
      onboardingCompleted: true,
      onboardingCompletedAt: dateFromNow(-6)
    }
  });

  return { organization, workspace };
}

async function seedPersonas() {
  const personas = [
    {
      id: "persona-creator",
      name: "Creator",
      industry: "Creator Economy",
      buyingIntent: "Wants faster idea-to-video workflows",
      primaryPainPoint:
        "Creators need to turn source material into finished videos without losing voice or quality.",
      contentNeeds:
        "How-to guides, templates, short demos, and proof that output quality is publishable."
    },
    {
      id: "persona-agency",
      name: "Agency",
      industry: "Marketing Services",
      buyingIntent: "Needs scalable client video production",
      primaryPainPoint:
        "Agencies need repeatable production systems across many clients, brands, and approval workflows.",
      contentNeeds:
        "Workflow comparisons, ROI proof, client delivery examples, and repeatable campaign playbooks."
    },
    {
      id: "persona-educator",
      name: "Educator",
      industry: "Education",
      buyingIntent: "Needs lessons and explainers from existing curriculum",
      primaryPainPoint:
        "Educators need to transform dense material into clear video lessons quickly.",
      contentNeeds:
        "Lesson examples, accessibility guidance, transcript workflows, and explainer templates."
    },
    {
      id: "persona-ecommerce-brand",
      name: "Ecommerce Brand",
      industry: "Ecommerce",
      buyingIntent: "Needs product pages converted into product videos",
      primaryPainPoint:
        "Brands need coherent video assets from product pages, reviews, and launch materials.",
      contentNeeds:
        "Product-page-to-video demos, paid social examples, PDP conversion content, and comparison guides."
    },
    {
      id: "persona-saas-team",
      name: "SaaS Team",
      industry: "SaaS",
      buyingIntent: "Needs feature and onboarding videos at product speed",
      primaryPainPoint:
        "SaaS teams struggle to keep launch, onboarding, and help videos current.",
      contentNeeds:
        "Feature launch workflows, help-center-to-video content, onboarding examples, and internal process guides."
    },
    {
      id: "persona-enterprise-marketing-team",
      name: "Enterprise Marketing Team",
      industry: "Enterprise Marketing",
      buyingIntent: "Needs governed video production intelligence",
      primaryPainPoint:
        "Enterprise teams need brand-safe, auditable workflows across teams and channels.",
      contentNeeds:
        "Governance content, approval workflow examples, security-facing materials, and executive proof."
    },
    {
      id: "persona-affiliate-marketer",
      name: "Affiliate Marketer",
      industry: "Affiliate Marketing",
      buyingIntent: "Needs landing-page and review content turned into videos",
      primaryPainPoint:
        "Affiliate marketers need fast content variants that preserve offer accuracy and trust.",
      contentNeeds:
        "Review-to-video workflows, comparison content, affiliate disclosure guidance, and channel variants."
    }
  ];

  return Promise.all(
    personas.map((persona) =>
      prisma.persona.upsert({
        where: {
          workspaceId_name: {
            workspaceId,
            name: persona.name
          }
        },
        update: {
          description: `${persona.name} persona for VidMaker growth intelligence.`,
          industry: persona.industry,
          buyingIntent: persona.buyingIntent,
          primaryPainPoint: persona.primaryPainPoint,
          contentNeeds: persona.contentNeeds
        },
        create: {
          ...tenant,
          ...persona,
          description: `${persona.name} persona for VidMaker growth intelligence.`
        }
      })
    )
  );
}

async function seedEntities() {
  const entities = [
    ["VidMaker", "Brand", ["VidMaker AI"], ["VidMaker"], "https://vidmaker.com", 100],
    ["VidMaker Labs", "Organization", ["APJ VidMaker"], ["VidMaker Research"], "https://vidmaker.com/labs", 84],
    ["Video Production Intelligence", "Category", ["VPI"], ["AI video operations"], "https://vidmaker.com/video-production-intelligence", 98],
    ["Purpose-Specific AI", "Concept", ["Purpose specific AI"], ["workflow-specific AI"], "https://vidmaker.com/purpose-specific-ai", 92],
    ["Purpose Engines", "Concept", ["Purpose Engine"], ["video purpose engine"], "https://vidmaker.com/purpose-engines", 90],
    ["AI Video Production", "Category", ["AI video creation"], ["AI video workflow"], "https://vidmaker.com/ai-video-production", 88],
    ["Video Workflow Automation", "Workflow", ["video automation"], ["video ops automation"], "https://vidmaker.com/video-workflow-automation", 86],
    ["Product Page to Video", "Use Case", ["PDP to video"], ["URL to video"], "https://vidmaker.com/product-page-to-video", 94],
    ["Blog to Video", "Use Case", ["article to video"], ["blog repurposing"], "https://vidmaker.com/blog-to-video", 80],
    ["4K Video Production", "Capability", ["4K video"], ["high-resolution video production"], "https://vidmaker.com/4k-video-production", 72]
  ] as const;

  return Promise.all(
    entities.map(([name, type, aliases, synonyms, canonicalUrl, importanceScore]) =>
      prisma.entity.upsert({
        where: {
          workspaceId_name: {
            workspaceId,
            name
          }
        },
        update: {
          type,
          aliases: [...aliases],
          synonyms: [...synonyms],
          canonicalUrl,
          importanceScore,
          entityOwner: "GEO Strategy",
          notes: `${name} is part of the VidMaker entity graph.`
        },
        create: {
          ...tenant,
          name,
          description: `${name} is tracked as a first-class entity for VidMaker GEO, AEO, content, and authority work.`,
          source: "Sprint 3 entity foundation",
          url: canonicalUrl,
          status: Status.RESEARCHING,
          priority: importanceScore >= 90 ? Priority.CRITICAL : Priority.HIGH,
          owner: "GEO Strategy",
          type,
          aliases: [...aliases],
          synonyms: [...synonyms],
          canonicalUrl,
          importanceScore,
          entityOwner: "GEO Strategy",
          notes: `${name} is part of the VidMaker entity graph.`
        }
      })
    )
  );
}

async function seedMarketObjects(personas: Awaited<ReturnType<typeof seedPersonas>>) {
  const communities = await Promise.all(
    ["Reddit", "LinkedIn", "X", "Product Hunt", "Hacker News", "Indie Hackers", "YouTube"].map(
      (name) =>
        prisma.community.upsert({
          where: {
            workspaceId_name: {
              workspaceId,
              name
            }
          },
          update: {
            description: `${name} is monitored for market signals, objections, questions, and product feedback.`
          },
          create: {
            ...tenant,
            name,
            description: `${name} is monitored for market signals, objections, questions, and product feedback.`,
            source: "Community intelligence map",
            url: `https://www.google.com/search?q=${encodeURIComponent(name + " AI video production")}`,
            status: Status.LIVE,
            priority: Priority.HIGH,
            owner: "Community Intelligence"
          }
        })
    )
  );

  const competitors = await Promise.all(
    ["Synthesia", "HeyGen", "InVideo", "VEED", "Pictory", "Descript", "Canva"].map(
      (name) =>
        prisma.competitor.upsert({
          where: {
            workspaceId_name: {
              workspaceId,
              name
            }
          },
          update: {
            description: `${name} is monitored for positioning, complaints, SEO motion, and workflow gaps.`
          },
          create: {
            ...tenant,
            name,
            description: `${name} is monitored for positioning, complaints, SEO motion, and workflow gaps.`,
            source: "Competitor intelligence watchlist",
            url: `https://www.google.com/search?q=${encodeURIComponent(name + " AI video")}`,
            status: Status.RESEARCHING,
            priority: Priority.HIGH,
            owner: "Competitive Intelligence"
          }
        })
    )
  );

  const keywords = await Promise.all(
    [
      ["Video Production Intelligence", Intent.INFORMATIONAL, FunnelStage.TOFU, Priority.CRITICAL],
      ["Purpose-Specific AI", Intent.INFORMATIONAL, FunnelStage.TOFU, Priority.HIGH],
      ["AI video production", Intent.COMMERCIAL, FunnelStage.MOFU, Priority.CRITICAL],
      ["video workflow automation", Intent.COMMERCIAL, FunnelStage.MOFU, Priority.HIGH],
      ["product page to video", Intent.TRANSACTIONAL, FunnelStage.BOFU, Priority.CRITICAL]
    ].map(([name, intent, funnelStage, priority]) =>
      prisma.keyword.upsert({
        where: {
          workspaceId_name: {
            workspaceId,
            name: String(name)
          }
        },
        update: {
          intent: intent as Intent,
          funnelStage: funnelStage as FunnelStage,
          priority: priority as Priority
        },
        create: {
          ...tenant,
          name: String(name),
          description: `${name} is a VidMaker keyword tracked for opportunity scoring and content planning.`,
          source: "VidMaker keyword strategy",
          url: `https://www.google.com/search?q=${encodeURIComponent(String(name))}`,
          status: Status.RESEARCHING,
          priority: priority as Priority,
          owner: "SEO Strategy",
          intent: intent as Intent,
          funnelStage: funnelStage as FunnelStage
        }
      })
    )
  );

  const reddit = communities.find((community) => community.name === "Reddit");
  const productHunt = communities.find((community) => community.name === "Product Hunt");
  const synthesia = competitors.find((competitor) => competitor.name === "Synthesia");
  const canva = competitors.find((competitor) => competitor.name === "Canva");
  const ecommerce = personas.find((persona) => persona.name === "Ecommerce Brand");
  const saas = personas.find((persona) => persona.name === "SaaS Team");
  const agency = personas.find((persona) => persona.name === "Agency");
  const educator = personas.find((persona) => persona.name === "Educator");

  const conversation = await prisma.conversation.upsert({
    where: { id: "conversation-url-to-video-demand" },
    update: {
      priority: Priority.CRITICAL,
      status: Status.RESEARCHING
    },
    create: {
      ...tenant,
      id: "conversation-url-to-video-demand",
      title: "URL-to-video demand is appearing across launch channels",
      description:
        "Product Hunt, LinkedIn, Reddit, and X comments repeatedly ask whether VidMaker can transform URLs and product pages into coherent finished videos.",
      source: "Product Hunt + LinkedIn + Reddit + X",
      url: "https://vidmaker.com",
      status: Status.RESEARCHING,
      priority: Priority.CRITICAL,
      owner: "Community Intelligence",
      communityId: productHunt?.id ?? reddit?.id
    }
  });

  const questionA = await prisma.question.upsert({
    where: { id: "question-product-page-to-video" },
    update: {
      opportunityScore: score(9, 9, 8, 9, 4)
    },
    create: {
      ...tenant,
      id: "question-product-page-to-video",
      title: "How do you turn a product page into a video?",
      description:
        "High-intent AEO question tied to URL-to-video and product-page-to-video workflows.",
      source: "Conversation Intelligence",
      url: "https://vidmaker.com/product-page-to-video",
      status: Status.RESEARCHING,
      priority: Priority.CRITICAL,
      owner: "AEO Strategy",
      intent: Intent.TRANSACTIONAL,
      funnelStage: FunnelStage.BOFU,
      searchVolumeEstimate: 900,
      businessValueScore: 9,
      painSeverityScore: 9,
      competitionScore: 4,
      trendScore: 8,
      authorityGapScore: 9,
      opportunityScore: score(9, 9, 8, 9, 4),
      conversationId: conversation.id,
      personas: {
        connect: [ecommerce, saas, agency].filter(Boolean).map((persona) => ({
          id: persona!.id
        }))
      }
    }
  });

  const questionB = await prisma.question.upsert({
    where: { id: "question-video-production-intelligence" },
    update: {
      opportunityScore: score(8, 7, 8, 10, 3)
    },
    create: {
      ...tenant,
      id: "question-video-production-intelligence",
      title: "What is Video Production Intelligence?",
      description:
        "Category-definition question for answer engines and VidMaker-owned language.",
      source: "GEO Entity Tracker",
      url: "https://vidmaker.com/video-production-intelligence",
      status: Status.RESEARCHING,
      priority: Priority.CRITICAL,
      owner: "GEO Strategy",
      intent: Intent.INFORMATIONAL,
      funnelStage: FunnelStage.TOFU,
      searchVolumeEstimate: 260,
      businessValueScore: 8,
      painSeverityScore: 7,
      competitionScore: 3,
      trendScore: 8,
      authorityGapScore: 10,
      opportunityScore: score(8, 7, 8, 10, 3),
      conversationId: conversation.id,
      personas: {
        connect: [saas, agency].filter(Boolean).map((persona) => ({ id: persona!.id }))
      }
    }
  });

  const questionC = await prisma.question.upsert({
    where: { id: "question-purpose-specific-ai" },
    update: {
      opportunityScore: score(8, 7, 8, 9, 4)
    },
    create: {
      ...tenant,
      id: "question-purpose-specific-ai",
      title: "What is Purpose-Specific AI?",
      description:
        "Category-definition question that explains how VidMaker differs from generic AI video generators.",
      source: "AEO Question Bank",
      url: "https://vidmaker.com/purpose-specific-ai",
      status: Status.RESEARCHING,
      priority: Priority.HIGH,
      owner: "AEO Strategy",
      intent: Intent.INFORMATIONAL,
      funnelStage: FunnelStage.TOFU,
      searchVolumeEstimate: 320,
      businessValueScore: 8,
      painSeverityScore: 7,
      competitionScore: 4,
      trendScore: 8,
      authorityGapScore: 9,
      opportunityScore: score(8, 7, 8, 9, 4),
      conversationId: conversation.id,
      personas: {
        connect: [saas, agency, educator].filter(Boolean).map((persona) => ({ id: persona!.id }))
      }
    }
  });

  const painPointA = await prisma.painPoint.upsert({
    where: { id: "painpoint-output-coherence-proof" },
    update: {
      opportunityScore: score(9, 10, 8, 8, 4)
    },
    create: {
      ...tenant,
      id: "painpoint-output-coherence-proof",
      title: "Users want proof that URL-to-video output is coherent",
      description:
        "Prospects are interested in URL-to-video, but they need proof that the finished video is coherent, brand-safe, and useful without heavy cleanup.",
      source: "Product Hunt and LinkedIn comments",
      url: "https://vidmaker.com",
      status: Status.RESEARCHING,
      priority: Priority.CRITICAL,
      owner: "Product Intelligence",
      searchVolumeEstimate: 700,
      businessValueScore: 9,
      painSeverityScore: 10,
      competitionScore: 4,
      trendScore: 8,
      authorityGapScore: 8,
      opportunityScore: score(9, 10, 8, 8, 4),
      conversationId: conversation.id,
      competitorId: synthesia?.id,
      personas: {
        connect: [ecommerce, saas, agency].filter(Boolean).map((persona) => ({
          id: persona!.id
        }))
      }
    }
  });

  const painPointB = await prisma.painPoint.upsert({
    where: { id: "painpoint-template-first-workflow" },
    update: {
      opportunityScore: score(7, 7, 7, 7, 5)
    },
    create: {
      ...tenant,
      id: "painpoint-template-first-workflow",
      title: "Template-first tools do not understand campaign purpose",
      description:
        "Template-first video workflows help teams start quickly but do not translate source URLs into campaign-specific video logic.",
      source: "Competitor positioning audit",
      url: "https://www.google.com/search?q=Canva+video+templates+AI",
      status: Status.RESEARCHING,
      priority: Priority.HIGH,
      owner: "Product Intelligence",
      searchVolumeEstimate: 420,
      businessValueScore: 7,
      painSeverityScore: 7,
      competitionScore: 5,
      trendScore: 7,
      authorityGapScore: 7,
      opportunityScore: score(7, 7, 7, 7, 5),
      conversationId: conversation.id,
      competitorId: canva?.id,
      personas: {
        connect: [agency, ecommerce].filter(Boolean).map((persona) => ({
          id: persona!.id
        }))
      }
    }
  });

  const featureRequest = await prisma.featureRequest.upsert({
    where: { id: "feature-url-to-video-proof-mode" },
    update: {},
    create: {
      ...tenant,
      id: "feature-url-to-video-proof-mode",
      title: "URL-to-video proof mode",
      description:
        "Generate a coherent product-page-to-video demo with traceable source sections, scene logic, and before/after proof.",
      source: "Pain point synthesis",
      url: "https://vidmaker.com",
      status: Status.NOT_STARTED,
      priority: Priority.CRITICAL,
      owner: "Product",
      painPointId: painPointA.id,
      personas: {
        connect: [ecommerce, saas].filter(Boolean).map((persona) => ({ id: persona!.id }))
      }
    }
  });

  const campaign = await prisma.campaign.upsert({
    where: {
      workspaceId_name: {
        workspaceId,
        name: "Product Page to Video Proof Sprint"
      }
    },
    update: {},
    create: {
      ...tenant,
      id: "campaign-product-page-to-video-proof",
      name: "Product Page to Video Proof Sprint",
      description:
        "Sprint to publish URL-to-video demos, answer-engine content, and social proof across VidMaker growth channels.",
      source: "Weekly Sprint Planner",
      url: "https://vidmaker.com",
      status: Status.IN_PROGRESS,
      priority: Priority.CRITICAL,
      owner: "Growth",
      personas: {
        connect: [ecommerce, saas, agency].filter(Boolean).map((persona) => ({
          id: persona!.id
        }))
      }
    }
  });

  type ContentAssetSeed = [
    string,
    string,
    string,
    string | null,
    string[]
  ];

  const contentAssetSeeds: ContentAssetSeed[] = [
    [
      "content-blog-002",
      "BLOG-002",
      "What Is Video Production Intelligence?",
      questionB.id,
      ["Video Production Intelligence", "AI video production"]
    ],
    [
      "content-blog-003",
      "BLOG-003",
      "Purpose-Specific AI for Video Teams",
      questionB.id,
      ["Purpose-Specific AI", "video workflow automation"]
    ],
    [
      "content-blog-004",
      "BLOG-004",
      "How to Turn a Product Page Into a Video",
      questionA.id,
      ["product page to video", "AI video production"]
    ]
  ];

  const contentAssets = await Promise.all(
    contentAssetSeeds.map(async ([id, code, title, questionId, keywordNames]) => {
      const asset = await prisma.contentAsset.upsert({
        where: { id },
        update: {
          title,
          status: Status.IN_PROGRESS
        },
        create: {
          ...tenant,
          id,
          code,
          title,
          description: `${title} is a Sprint 3 content asset connected to answer demand, keywords, entities, and campaign execution.`,
          source: "Content Engine",
          url: `https://vidmaker.com/blog/${String(code).toLowerCase()}`,
          status: Status.IN_PROGRESS,
          priority: code === "BLOG-003" ? Priority.HIGH : Priority.CRITICAL,
          owner: "Content",
          contentType: ContentType.BLOG,
          intent: code === "BLOG-004" ? Intent.TRANSACTIONAL : Intent.INFORMATIONAL,
          funnelStage: code === "BLOG-004" ? FunnelStage.BOFU : FunnelStage.TOFU,
          personas: {
            connect: [ecommerce, saas, agency].filter(Boolean).map((persona) => ({
              id: persona!.id
            }))
          }
        }
      });

      await prisma.questionContentAsset.upsert({
        where: {
          questionId_contentAssetId: {
            questionId: String(questionId),
            contentAssetId: asset.id
          }
        },
        update: {},
        create: {
          questionId: String(questionId),
          contentAssetId: asset.id
        }
      });

      await prisma.campaignContentAsset.upsert({
        where: {
          campaignId_contentAssetId: {
            campaignId: campaign.id,
            contentAssetId: asset.id
          }
        },
        update: {},
        create: {
          campaignId: campaign.id,
          contentAssetId: asset.id
        }
      });

      for (const keywordName of keywordNames as string[]) {
        const keyword = keywords.find((entry) => entry.name === keywordName);
        if (!keyword) continue;
        await prisma.contentAssetKeyword.upsert({
          where: {
            contentAssetId_keywordId: {
              contentAssetId: asset.id,
              keywordId: keyword.id
            }
          },
          update: {},
          create: {
            contentAssetId: asset.id,
            keywordId: keyword.id,
            primary: keywordName === keywordNames[0]
          }
        });
      }

      return asset;
    })
  );

  await Promise.all(
    [
      ["task-demo-examples", "Create three product-page-to-video demo examples"],
      ["task-blog-proof", "Publish BLOG-004 with proof clips"],
      ["task-community-reply", "Reply to Product Hunt URL-to-video comments"]
    ].map(([id, title], index) =>
      prisma.task.upsert({
        where: { id },
        update: {
          title
        },
        create: {
          ...tenant,
          id,
          title,
          description: `${title} as part of the Product Page to Video Proof Sprint.`,
          source: "Weekly Sprint Planner",
          url: "https://vidmaker.com",
          status: Status.IN_PROGRESS,
          priority: index === 0 ? Priority.CRITICAL : Priority.HIGH,
          owner: index === 2 ? "Community Intelligence" : "Growth",
          dueAt: dateFromNow(index + 3),
          campaignId: campaign.id
        }
      })
    )
  );

  const directory = await prisma.directorySubmission.upsert({
    where: {
      workspaceId_name: {
        workspaceId,
        name: "AI Video Tools Directory"
      }
    },
    update: {},
    create: {
      ...tenant,
      id: "directory-ai-video-tools",
      name: "AI Video Tools Directory",
      description:
        "Authority-building directory submission for VidMaker and product-page-to-video workflows.",
      source: "Authority & Backlink Engine",
      url: "https://example.com/ai-video-tools",
      status: Status.SUBMITTED,
      priority: Priority.HIGH,
      owner: "Authority"
    }
  });

  await prisma.backlink.upsert({
    where: { id: "backlink-ai-video-tools-directory" },
    update: {},
    create: {
      ...tenant,
      id: "backlink-ai-video-tools-directory",
      title: "VidMaker listing backlink",
      description: "Backlink expected from the AI Video Tools Directory after moderation approval.",
      source: "AI Video Tools Directory",
      url: "https://example.com/ai-video-tools/vidmaker",
      targetUrl: "https://vidmaker.com",
      status: Status.SUBMITTED,
      priority: Priority.HIGH,
      owner: "Authority",
      directorySubmissionId: directory.id
    }
  });

  return {
    communities,
    competitors,
    keywords,
    conversation,
    questions: [questionA, questionB, questionC],
    painPoints: [painPointA, painPointB],
    featureRequest,
    campaign,
    contentAssets
  };
}

async function seedIntelligence() {
  const observationData = [
    [
      "observation-url-product-comments",
      "Several Product Hunt and LinkedIn comments focused on whether VidMaker can transform URLs and product pages into coherent finished videos.",
      "Product Hunt",
      "positive"
    ],
    ["observation-proof-quality", "LinkedIn commenters asked for proof clips before trusting URL-to-video claims.", "LinkedIn", "neutral"],
    ["observation-reddit-cleanup", "Reddit discussions complain that AI video tools still require too much manual cleanup.", "Reddit", "negative"],
    ["observation-x-demo-demand", "X posts around AI video launches get more engagement when demos show source-to-output flow.", "X", "positive"],
    ["observation-youtube-workflow", "YouTube creators search for repeatable production systems, not one-off generation prompts.", "YouTube", "positive"],
    ["observation-directory-positioning", "AI directories describe most tools as generators, leaving room for workflow intelligence positioning.", "Directories", "neutral"],
    ["observation-competitor-template", "Competitor reviews praise templates but criticize lack of source understanding.", "Competitor Reviews", "negative"],
    ["observation-hn-skepticism", "Hacker News discussions are skeptical of AI video unless the tool proves control and coherence.", "Hacker News", "neutral"],
    ["observation-indie-hackers-use-case", "Indie Hackers threads mention landing pages and launch pages as reusable video inputs.", "Indie Hackers", "positive"],
    ["observation-product-hunt-comments", "Product Hunt comments ask whether VidMaker can preserve product accuracy when generating videos.", "Product Hunt", "neutral"]
  ];

  const observations = await Promise.all(
    observationData.map(([id, rawText, platform, sentiment], index) =>
      prisma.observation.upsert({
        where: { id },
        update: {
          rawText,
          summary: rawText
        },
        create: {
          ...tenant,
          id,
          title: rawText.slice(0, 82),
          source: platform,
          sourceUrl: "https://vidmaker.com",
          rawText,
          summary: rawText,
          platform,
          sentiment,
          confidenceScore: 0.72 + index * 0.02
        }
      })
    )
  );

  const insightData = [
    [
      "insight-url-to-video-trust",
      "Users are highly interested in URL-to-video and product-page-to-video workflows, but they want proof of output quality and coherence.",
      "VidMaker should make quality proof central to BOFU content and onboarding.",
      observations[0].id
    ],
    [
      "insight-workflow-positioning",
      "Workflow intelligence is a stronger wedge than generic AI video generation.",
      "Position around Video Production Intelligence and governed production workflows.",
      observations[4].id
    ],
    [
      "insight-cleanup-objection",
      "Manual cleanup is the clearest objection against AI video tools.",
      "Product and content should show source traceability, review controls, and editable output logic.",
      observations[2].id
    ],
    [
      "insight-demo-led-conversion",
      "Demo-led distribution earns more trust than abstract feature claims.",
      "Campaigns should publish source-to-output examples across community and owned channels.",
      observations[3].id
    ],
    [
      "insight-directory-category-gap",
      "Directories under-describe workflow intelligence, creating an authority gap.",
      "Directory submissions should introduce VidMaker as a Video Production Intelligence system.",
      observations[5].id
    ]
  ];

  const insights = await Promise.all(
    insightData.map(([id, summary, strategicImplication, observationId], index) =>
      prisma.insight.upsert({
        where: { id },
        update: {
          summary,
          strategicImplication
        },
        create: {
          ...tenant,
          id,
          title: summary,
          summary,
          strategicImplication,
          evidence: `Supported by observation ${observationId}.`,
          confidenceScore: 0.78 + index * 0.03,
          observationId
        }
      })
    )
  );

  const hypothesisData = [
    [
      "hypothesis-product-page-demo-trust",
      "Publishing product-page-to-video demos will increase trust and improve trial conversion.",
      "Trial conversion improves when visitors see coherent outputs from real source pages.",
      "trial_conversion_rate",
      insights[0].id
    ],
    [
      "hypothesis-category-definition",
      "Defining Video Production Intelligence will improve AEO/GEO recall for VidMaker.",
      "Answer engines and searchers associate VidMaker with the category.",
      "branded_category_mentions",
      insights[1].id
    ],
    [
      "hypothesis-cleanup-proof",
      "Showing editable source traceability will reduce manual cleanup objections.",
      "Demo viewers understand how VidMaker preserves control.",
      "demo_completion_rate",
      insights[2].id
    ],
    [
      "hypothesis-community-replies",
      "Helpful community replies with demos will create qualified traffic.",
      "Community traffic and assisted signups increase from targeted threads.",
      "community_assisted_trials",
      insights[3].id
    ],
    [
      "hypothesis-directory-language",
      "Directory listings that introduce workflow intelligence will produce better authority signals.",
      "Directory backlinks and mentions reinforce the right category language.",
      "qualified_backlinks",
      insights[4].id
    ]
  ];

  const hypotheses = await Promise.all(
    hypothesisData.map(([id, statement, expectedOutcome, relatedMetric, insightId], index) =>
      prisma.hypothesis.upsert({
        where: { id },
        update: {
          statement,
          expectedOutcome
        },
        create: {
          ...tenant,
          id,
          title: statement,
          statement,
          expectedOutcome,
          relatedMetric,
          confidenceScore: 0.7 + index * 0.04,
          status: Status.RESEARCHING,
          insightId
        }
      })
    )
  );

  const experimentData = [
    [
      "experiment-product-page-demo-series",
      "Create and publish 3 product-page-to-video examples across LinkedIn, X, Product Hunt update, and VidMaker blog.",
      "LinkedIn, X, Product Hunt, Blog",
      hypotheses[0].id
    ],
    ["experiment-vpi-definition", "Publish category definition package for Video Production Intelligence.", "Blog + FAQ", hypotheses[1].id],
    ["experiment-source-traceability-demo", "Add source traceability section to demo videos and landing pages.", "Landing Page", hypotheses[2].id],
    ["experiment-community-reply-sprint", "Reply to 20 relevant community conversations with useful examples.", "Community", hypotheses[3].id],
    ["experiment-directory-category-copy", "Submit directory listings with workflow-intelligence positioning.", "Directories", hypotheses[4].id]
  ];

  const experiments = await Promise.all(
    experimentData.map(([id, description, channel, hypothesisId], index) =>
      prisma.experiment.upsert({
        where: { id },
        update: {
          description,
          channel
        },
        create: {
          ...tenant,
          id,
          title: description,
          description,
          channel,
          hypothesisId,
          startDate: dateFromNow(index),
          endDate: dateFromNow(index + 14),
          successMetric: index === 0 ? "trial_conversion_rate" : "qualified_signal_count",
          result: index === 0 ? null : "Pending",
          status: index === 0 ? Status.IN_PROGRESS : Status.NOT_STARTED
        }
      })
    )
  );

  await prisma.outcome.upsert({
    where: { id: "outcome-product-page-demo-series" },
    update: {
      resultSummary: "",
      learnings: ""
    },
    create: {
      ...tenant,
      id: "outcome-product-page-demo-series",
      title: "Pending outcome for product-page-to-video demo series",
      experimentId: experiments[0].id,
      metricName: "trial_conversion_rate",
      metricBefore: null,
      metricAfter: null,
      resultSummary: "",
      learnings: ""
    }
  });

  return { observations, insights, hypotheses, experiments };
}

async function seedKnowledgeGraph() {
  const nodeLabels = [
    ["node-vidmaker", "VidMaker", "Entity", "entity-vidmaker"],
    ["node-vpi", "Video Production Intelligence", "Entity", "entity-video-production-intelligence"],
    ["node-purpose-ai", "Purpose-Specific AI", "Entity", "entity-purpose-specific-ai"],
    ["node-purpose-engines", "Purpose Engines", "Entity", "entity-purpose-engines"],
    ["node-ai-video-production", "AI Video Production", "Entity", "entity-ai-video-production"],
    ["node-product-page-to-video", "Product Page to Video", "Entity", "entity-product-page-to-video"],
    ["node-blog-to-video", "Blog to Video", "Entity", "entity-blog-to-video"],
    ["node-url-demand", "URL-to-video demand", "Observation", "observation-url-product-comments"],
    ["node-output-proof", "Output coherence proof", "PainPoint", "painpoint-output-coherence-proof"],
    ["node-question-pdp", "How do you turn a product page into a video?", "Question", "question-product-page-to-video"],
    ["node-question-vpi", "What is Video Production Intelligence?", "Question", "question-video-production-intelligence"],
    ["node-blog-002", "BLOG-002", "ContentAsset", "content-blog-002"],
    ["node-blog-003", "BLOG-003", "ContentAsset", "content-blog-003"],
    ["node-blog-004", "BLOG-004", "ContentAsset", "content-blog-004"],
    ["node-keyword-vpi", "Video Production Intelligence keyword", "Keyword", "keyword-video-production-intelligence"],
    ["node-keyword-pdp", "Product page to video keyword", "Keyword", "keyword-product-page-to-video"],
    ["node-competitor-synthesia", "Synthesia", "Competitor", "competitor-synthesia"],
    ["node-competitor-canva", "Canva", "Competitor", "competitor-canva"],
    ["node-feature-proof-mode", "URL-to-video proof mode", "FeatureRequest", "feature-url-to-video-proof-mode"],
    ["node-campaign-proof", "Product Page to Video Proof Sprint", "Campaign", "campaign-product-page-to-video-proof"]
  ];

  const nodes = await Promise.all(
    nodeLabels.map(([id, label, type, sourceId]) =>
      prisma.knowledgeNode.upsert({
        where: { id },
        update: {
          label,
          type,
          sourceId
        },
        create: {
          ...tenant,
          id,
          label,
          type,
          description: `${label} is represented in the VidMaker growth intelligence graph.`,
          sourceType: type,
          sourceId
        }
      })
    )
  );

  const edgePairs = [
    ["node-question-pdp", "node-blog-004", RelationshipType.ANSWERS],
    ["node-question-vpi", "node-blog-002", RelationshipType.ANSWERS],
    ["node-purpose-ai", "node-blog-003", RelationshipType.SUPPORTS],
    ["node-vpi", "node-blog-002", RelationshipType.SUPPORTS],
    ["node-url-demand", "node-question-pdp", RelationshipType.GENERATED_FROM],
    ["node-output-proof", "node-feature-proof-mode", RelationshipType.INSPIRES],
    ["node-blog-004", "node-keyword-pdp", RelationshipType.TARGETS],
    ["node-blog-002", "node-keyword-vpi", RelationshipType.TARGETS],
    ["node-vidmaker", "node-vpi", RelationshipType.MENTIONS],
    ["node-vidmaker", "node-purpose-engines", RelationshipType.MENTIONS],
    ["node-purpose-engines", "node-product-page-to-video", RelationshipType.RELATED_TO],
    ["node-ai-video-production", "node-vpi", RelationshipType.RELATED_TO],
    ["node-competitor-synthesia", "node-output-proof", RelationshipType.MENTIONS],
    ["node-competitor-canva", "node-output-proof", RelationshipType.MENTIONS],
    ["node-blog-003", "node-purpose-ai", RelationshipType.LINKS_TO],
    ["node-blog-004", "node-product-page-to-video", RelationshipType.LINKS_TO],
    ["node-campaign-proof", "node-blog-004", RelationshipType.SUPPORTS],
    ["node-campaign-proof", "node-feature-proof-mode", RelationshipType.SUPPORTS],
    ["node-blog-to-video", "node-product-page-to-video", RelationshipType.RELATED_TO],
    ["node-product-page-to-video", "node-keyword-pdp", RelationshipType.TARGETS],
    ["node-vpi", "node-keyword-vpi", RelationshipType.TARGETS],
    ["node-vidmaker", "node-competitor-synthesia", RelationshipType.COMPETES_WITH],
    ["node-vidmaker", "node-competitor-canva", RelationshipType.COMPETES_WITH],
    ["node-url-demand", "node-output-proof", RelationshipType.SUPPORTS],
    ["node-question-pdp", "node-feature-proof-mode", RelationshipType.INSPIRES],
    ["node-question-vpi", "node-vpi", RelationshipType.MENTIONS],
    ["node-blog-002", "node-blog-003", RelationshipType.LINKS_TO],
    ["node-blog-003", "node-blog-004", RelationshipType.LINKS_TO],
    ["node-purpose-ai", "node-purpose-engines", RelationshipType.RELATED_TO],
    ["node-output-proof", "node-blog-004", RelationshipType.SUPPORTS]
  ];

  await Promise.all(
    edgePairs.map(([fromNodeId, toNodeId, relationshipType], index) =>
      prisma.knowledgeEdge.upsert({
        where: { id: `edge-${String(index + 1).padStart(2, "0")}` },
        update: {
          fromNodeId: String(fromNodeId),
          toNodeId: String(toNodeId),
          relationshipType: relationshipType as RelationshipType
        },
        create: {
          ...tenant,
          id: `edge-${String(index + 1).padStart(2, "0")}`,
          fromNodeId: String(fromNodeId),
          toNodeId: String(toNodeId),
          relationshipType: relationshipType as RelationshipType,
          strength: 0.52 + index * 0.01,
          notes: `Sprint 3 graph edge ${index + 1}.`
        }
      })
    )
  );

  return nodes;
}

async function seedRecommendations() {
  const recommendations = [
    [RecommendationType.BLOG_IDEA, "ContentAsset", "content-blog-004", "Add proof-first examples to BLOG-004"],
    [RecommendationType.FOUNDER_POST, "Insight", "insight-url-to-video-trust", "Publish founder narrative about coherent URL-to-video workflows"],
    [RecommendationType.COMPANY_POST, "Campaign", "campaign-product-page-to-video-proof", "Announce the proof sprint with source-to-output demos"],
    [RecommendationType.X_THREAD, "Question", "question-product-page-to-video", "Turn the product-page-to-video workflow into an X thread"],
    [RecommendationType.PINTEREST_PIN, "ContentAsset", "content-blog-004", "Create visual pin for product-page-to-video use cases"],
    [RecommendationType.FAQ, "Question", "question-video-production-intelligence", "Add FAQ answer blocks for Video Production Intelligence"],
    [RecommendationType.LANDING_PAGE, "Entity", "entity-product-page-to-video", "Create product-page-to-video landing page"],
    [RecommendationType.FEATURE_REQUEST, "PainPoint", "painpoint-output-coherence-proof", "Prioritize URL-to-video proof mode"],
    [RecommendationType.DIRECTORY_SUBMISSION, "DirectorySubmission", "directory-ai-video-tools", "Submit VidMaker with workflow-intelligence positioning"],
    [RecommendationType.BACKLINK_OUTREACH, "ContentAsset", "content-blog-002", "Pitch Video Production Intelligence definition to AI workflow newsletters"]
  ];

  await Promise.all(
    recommendations.map(([recommendationType, targetEntityType, targetEntityId, title], index) =>
      prisma.aIRecommendation.upsert({
        where: { id: `ai-rec-${String(index + 1).padStart(2, "0")}` },
        update: {
          title: String(title),
          recommendationType: recommendationType as RecommendationType,
          targetEntityType: String(targetEntityType),
          targetEntityId: String(targetEntityId)
        },
        create: {
          ...tenant,
          id: `ai-rec-${String(index + 1).padStart(2, "0")}`,
          title: String(title),
          description: `${title} is a Sprint 3 recommendation generated from intelligence signals.`,
          source: "AI Recommendation Engine",
          url: "https://vidmaker.com",
          owner: "Growth Intelligence",
          recommendationType: recommendationType as RecommendationType,
          targetEntityType: String(targetEntityType),
          targetEntityId: String(targetEntityId),
          suggestedAction: String(title),
          reasoning:
            "Market observations, opportunity scores, and knowledge graph relationships indicate this action can improve VidMaker growth intelligence outcomes.",
          confidenceScore: 0.74 + index * 0.02,
          priority: index < 4 ? Priority.CRITICAL : Priority.HIGH,
          status: Status.RESEARCHING,
          generatedBy: "VGOS Intelligence Engine"
        }
      })
    )
  );
}

async function seedIntelligenceObjects() {
  const objects = [
    {
      id: "intelligence-product-page-to-video-demo",
      sourceType: "Question",
      sourceId: "question-product-page-to-video",
      summary: "Can VidMaker take a product page URL and turn it into a ready-to-post video?",
      detectedEntities: ["VidMaker", "Product Page to Video"],
      detectedKeywords: ["product page URL", "product page to video", "ready-to-post video"],
      detectedIntent: Intent.COMMERCIAL,
      detectedPersona: "Ecommerce Brand",
      detectedPainPoints: ["Need automated product video creation"],
      sentiment: "curious/high-intent",
      opportunityScore: 92,
      confidenceScore: 0.91,
      reasoning:
        "Commercial Investigation: ecommerce teams want proof that VidMaker can transform a product page URL into a finished product video. The highest-value next action is to create a product-page-to-video demo."
    },
    {
      id: "intelligence-manual-cleanup-objection",
      sourceType: "Observation",
      sourceId: "observation-reddit-cleanup",
      summary: "Reddit discussions complain that AI video tools still require too much manual cleanup.",
      detectedEntities: ["VidMaker"],
      detectedKeywords: ["AI video production", "video workflow automation"],
      detectedIntent: Intent.COMMUNITY_DISCUSSION,
      detectedPersona: "Creator",
      detectedPainPoints: ["AI video output requires too much manual cleanup"],
      sentiment: "negative",
      opportunityScore: 78,
      confidenceScore: 0.84,
      reasoning:
        "Community discussion shows a recurring cleanup objection that VidMaker can answer with workflow automation proof and source traceability."
    },
    {
      id: "intelligence-video-production-intelligence-definition",
      sourceType: "Question",
      sourceId: "question-video-production-intelligence",
      summary: "What is Video Production Intelligence?",
      detectedEntities: ["VidMaker", "Video Production Intelligence", "Purpose-Specific AI"],
      detectedKeywords: ["Video Production Intelligence", "Purpose-Specific AI", "AI video production"],
      detectedIntent: Intent.INFORMATIONAL,
      detectedPersona: "SaaS Team",
      detectedPainPoints: ["Need clearer VidMaker answer, proof, or workflow guidance"],
      sentiment: "neutral",
      opportunityScore: 84,
      confidenceScore: 0.88,
      reasoning:
        "Informational category-definition demand gives VidMaker a chance to own entity language across SEO, AEO, and GEO surfaces."
    }
  ];

  await Promise.all(
    objects.map((object) =>
      prisma.intelligenceObject.upsert({
        where: { id: object.id },
        update: {
          sourceType: object.sourceType,
          sourceId: object.sourceId,
          summary: object.summary,
          detectedEntities: object.detectedEntities,
          detectedKeywords: object.detectedKeywords,
          detectedIntent: object.detectedIntent,
          detectedPersona: object.detectedPersona,
          detectedPainPoints: object.detectedPainPoints,
          sentiment: object.sentiment,
          opportunityScore: object.opportunityScore,
          confidenceScore: object.confidenceScore,
          reasoning: object.reasoning
        },
        create: {
          ...tenant,
          ...object
        }
      })
    )
  );
}

async function seedKernel() {
  const memoryData = [
    ["memory-product-page-to-video-demand", "Product-page-to-video demand", "Product Page to Video", "Prospects repeatedly ask whether VidMaker can transform product pages and URLs into finished videos.", ["Observation", "Question"], ["observation-url-product-comments", "question-product-page-to-video"], 8, 0.92, 96],
    ["memory-video-production-intelligence", "Video Production Intelligence category ownership", "Video Production Intelligence", "VidMaker should remember that category ownership is a recurring SEO, AEO, and GEO opportunity.", ["Entity", "Question", "ContentAsset"], ["entity-video-production-intelligence", "question-video-production-intelligence", "content-blog-002"], 7, 0.9, 94],
    ["memory-purpose-specific-ai", "Purpose-Specific AI curiosity", "Purpose-Specific AI", "Users and answer engines need a sharper distinction between purpose-specific AI and generic generation.", ["Question", "ContentAsset"], ["question-purpose-specific-ai", "content-blog-003"], 5, 0.84, 86],
    ["memory-product-hunt-feedback", "Product Hunt launch feedback", "Product Hunt", "Launch comments ask for concrete examples and product proof after seeing VidMaker positioning.", ["Observation", "Community"], ["observation-product-hunt-comments"], 6, 0.83, 88],
    ["memory-real-product-demos", "Need for real product demos", "Product Page to Video", "The strongest trust signal is a demo that shows source material becoming a finished ready-to-post video.", ["Observation", "Pattern"], ["observation-proof-quality"], 9, 0.91, 97],
    ["memory-generic-ai-video-complaints", "Generic AI video output complaints", "AI Video Production", "Communities complain that generic AI video output needs too much cleanup and lacks coherent workflow logic.", ["Observation", "PainPoint"], ["observation-reddit-cleanup", "painpoint-output-coherence-proof"], 7, 0.86, 89],
    ["memory-ecommerce-automation", "Ecommerce brands needing product video automation", "Ecommerce Brand", "Ecommerce teams want product videos created from existing product pages without manual production loops.", ["Question", "Persona"], ["question-product-page-to-video", "persona-ecommerce-brand"], 6, 0.88, 92],
    ["memory-directory-authority", "Directory authority gap", "Authority", "Directory submissions are needed to reinforce VidMaker across AI tool, video production, and workflow-intelligence surfaces.", ["DirectorySubmission", "Backlink"], ["directory-ai-video-tools", "backlink-ai-video-tools-directory"], 4, 0.78, 81],
    ["memory-4k-quality-proof", "4K quality proof concern", "4K Video Production", "Audience skepticism exists around claims like 4K unless proof and output control are shown clearly.", ["Observation", "Competitor"], ["observation-hn-skepticism"], 3, 0.72, 74],
    ["memory-workflow-positioning", "Workflow positioning resonance", "Video Workflow Automation", "Audience responds better to workflow positioning than one-off text-to-video generation claims.", ["Insight", "ContentAsset"], ["insight-workflow-positioning", "content-blog-003"], 5, 0.82, 84]
  ] as const;
  await Promise.all(
    memoryData.map(([id, topic, entity, summary, sourceTypes, linkedSourceIds, frequency, confidenceScore, importanceScore], index) =>
      prisma.memory.upsert({
        where: { id },
        update: {
          topic,
          entity,
          summary,
          sourceTypes: [...sourceTypes],
          linkedSourceIds: [...linkedSourceIds],
          frequency,
          confidenceScore,
          importanceScore,
          status: Status.RESEARCHING,
          lastSeen: dateFromNow(-index)
        },
        create: {
          ...tenant,
          id,
          topic,
          entity,
          summary,
          sourceTypes: [...sourceTypes],
          linkedSourceIds: [...linkedSourceIds],
          firstSeen: dateFromNow(-14 - index),
          lastSeen: dateFromNow(-index),
          frequency,
          confidenceScore,
          importanceScore,
          status: Status.RESEARCHING
        }
      })
    )
  );

  const patternData = [
    ["pattern-product-page-examples", "Users ask for example outputs after seeing launch announcement.", PatternType.RECURRING_QUESTION, "Product Page to Video", TrendDirection.RISING, 8, 0.91, 96],
    ["pattern-generic-tool-complaints", "Repeated concern about generic AI video tools needing cleanup.", PatternType.COMPETITOR_COMPLAINT, "AI Video Production", TrendDirection.RISING, 7, 0.87, 90],
    ["pattern-own-vpi", "Opportunity to own Video Production Intelligence.", PatternType.GEO_OPPORTUNITY, "Video Production Intelligence", TrendDirection.RISING, 6, 0.9, 95],
    ["pattern-product-hunt-demo-gap", "Need for demo content after Product Hunt launch.", PatternType.CONTENT_GAP, "Product Hunt", TrendDirection.RISING, 6, 0.84, 88],
    ["pattern-workflow-positioning", "Audience responds well to workflow positioning.", PatternType.PRODUCT_DEMAND, "Video Workflow Automation", TrendDirection.STABLE, 5, 0.82, 84],
    ["pattern-directory-authority", "Directory submissions are needed for authority and AI visibility.", PatternType.AUTHORITY_OPPORTUNITY, "Authority", TrendDirection.RISING, 4, 0.78, 82],
    ["pattern-aeo-purpose-ai", "Purpose-Specific AI needs answer-ready FAQ coverage.", PatternType.AEO_OPPORTUNITY, "Purpose-Specific AI", TrendDirection.STABLE, 4, 0.8, 80],
    ["pattern-4k-proof", "Concern exists around 4K quality versus 4K label.", PatternType.PRODUCT_DEMAND, "4K Video Production", TrendDirection.STABLE, 3, 0.72, 73]
  ] as const;

  await Promise.all(
    patternData.map(([id, title, patternType, relatedEntity, trendDirection, frequency, confidenceScore, importanceScore]) =>
      prisma.pattern.upsert({
        where: { id },
        update: {
          title,
          description: title,
          patternType,
          relatedEntity,
          evidence: { memoryIds: memoryData.slice(0, Math.min(3, frequency)).map((memory) => memory[0]) },
          frequency,
          trendDirection,
          confidenceScore,
          importanceScore,
          status: Status.RESEARCHING
        },
        create: {
          ...tenant,
          id,
          title,
          description: title,
          patternType,
          relatedEntity,
          evidence: { memoryIds: memoryData.slice(0, Math.min(3, frequency)).map((memory) => memory[0]) },
          frequency,
          trendDirection,
          confidenceScore,
          importanceScore,
          status: Status.RESEARCHING
        }
      })
    )
  );

  const objectiveData = [
    ["objective-own-vpi", "Own Video Production Intelligence category.", "Establish VidMaker as the authority for Video Production Intelligence.", ObjectiveCategory.GEO, Priority.CRITICAL],
    ["objective-authority", "Increase external authority through directories and backlinks.", "Submit VidMaker to authority surfaces and convert listings into backlinks.", ObjectiveCategory.AUTHORITY, Priority.HIGH],
    ["objective-product-hunt", "Convert Product Hunt launch interest into demos, content, and signups.", "Turn launch comments into proof assets and conversion paths.", ObjectiveCategory.REVENUE, Priority.CRITICAL],
    ["objective-aeo-geo", "Build AEO/GEO visibility around Purpose-Specific AI and product-page-to-video.", "Create answer-ready assets for core VidMaker entities and use cases.", ObjectiveCategory.AEO, Priority.HIGH],
    ["objective-demo-assets", "Create 3 demo assets from real product pages.", "Use real product pages to prove VidMaker output quality and workflow intelligence.", ObjectiveCategory.CONTENT, Priority.CRITICAL]
  ] as const;

  await Promise.all(
    objectiveData.map(([id, title, description, category, priority], index) =>
      prisma.objective.upsert({
        where: { id },
        update: {
          title,
          description,
          category,
          priority,
          status: Status.IN_PROGRESS,
          startDate: dateFromNow(-7),
          endDate: dateFromNow(23 + index)
        },
        create: {
          ...tenant,
          id,
          title,
          description,
          category,
          priority,
          status: Status.IN_PROGRESS,
          startDate: dateFromNow(-7),
          endDate: dateFromNow(23 + index)
        }
      })
    )
  );

  const keyResults = [
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
  ] as const;

  await Promise.all(
    keyResults.map(([id, title, metricName, targetValue, currentValue, objectiveId]) =>
      prisma.keyResult.upsert({
        where: { id },
        update: {
          title,
          metricName,
          targetValue,
          currentValue,
          status: currentValue >= targetValue ? Status.LIVE : Status.IN_PROGRESS
        },
        create: {
          id,
          objectiveId,
          title,
          metricName,
          targetValue,
          currentValue,
          status: currentValue >= targetValue ? Status.LIVE : Status.IN_PROGRESS
        }
      })
    )
  );

  const agentData = [
    ["agent-conversation", "Conversation Agent", AgentType.CONVERSATION_AGENT, "Convert comments, questions, and community threads into memories, patterns, and actions.", ["Conversation", "Observation"], ["Memory", "Pattern", "RecommendedAction"]],
    ["agent-content", "Content Agent", AgentType.CONTENT_AGENT, "Find content gaps and propose answer-ready content assets.", ["Question", "Pattern", "Keyword"], ["AIRecommendation", "RecommendedAction"]],
    ["agent-authority", "Authority Agent", AgentType.AUTHORITY_AGENT, "Find directory, backlink, and authority-building actions.", ["DirectorySubmission", "Backlink", "Pattern"], ["RecommendedAction", "Event"]],
    ["agent-aeo", "AEO Agent", AgentType.AEO_AGENT, "Turn recurring questions into FAQ, answer blocks, and entity coverage.", ["Question", "Entity", "Memory"], ["AIRecommendation", "ReasoningTrace"]],
    ["agent-product", "Product Agent", AgentType.PRODUCT_AGENT, "Convert pain patterns into feature requests and product proof actions.", ["PainPoint", "Pattern", "Competitor"], ["FeatureRequest", "RecommendedAction"]]
  ] as const;

  await Promise.all(
    agentData.map(([id, name, agentType, mission, inputSources, outputTypes], index) =>
      prisma.agent.upsert({
        where: { id },
        update: {
          name,
          description: `${name} is part of the VGOS Intelligence Kernel.`,
          agentType,
          status: Status.LIVE,
          mission,
          inputSources: [...inputSources],
          outputTypes: [...outputTypes],
          lastRunAt: dateFromNow(-index)
        },
        create: {
          ...tenant,
          id,
          name,
          description: `${name} is part of the VGOS Intelligence Kernel.`,
          agentType,
          status: Status.LIVE,
          mission,
          inputSources: [...inputSources],
          outputTypes: [...outputTypes],
          lastRunAt: dateFromNow(-index)
        }
      })
    )
  );

  await Promise.all(
    agentData.map(([agentId, name], index) =>
      prisma.agentRun.upsert({
        where: { id: `agent-run-${String(index + 1).padStart(2, "0")}` },
        update: {
          status: index === 0 ? ActionStatus.IN_PROGRESS : ActionStatus.COMPLETED,
          inputSummary: `${name} reviewed VidMaker kernel signals.`,
          outputSummary: `${name} produced rule-based memory, pattern, reasoning, and action outputs.`,
          recommendationsCreated: index + 1,
          actionsCreated: index + 2,
          completedAt: index === 0 ? null : dateFromNow(-index)
        },
        create: {
          ...tenant,
          id: `agent-run-${String(index + 1).padStart(2, "0")}`,
          agentId,
          status: index === 0 ? ActionStatus.IN_PROGRESS : ActionStatus.COMPLETED,
          inputSummary: `${name} reviewed VidMaker kernel signals.`,
          outputSummary: `${name} produced rule-based memory, pattern, reasoning, and action outputs.`,
          recommendationsCreated: index + 1,
          actionsCreated: index + 2,
          startedAt: dateFromNow(-index - 1),
          completedAt: index === 0 ? null : dateFromNow(-index),
          logs: [
            "Loaded workspace-scoped signals.",
            "Matched signals to memory and pattern rules.",
            "Produced recommendations and reasoning traces."
          ]
        }
      })
    )
  );

  const reasoningSteps = [
    "Multiple comments reference product pages and URLs.",
    "Product page to video is a commercial use case.",
    "Product proof would increase trust.",
    "A demo can support SEO, Product Hunt, LinkedIn, and Pinterest."
  ];

  await Promise.all(
    Array.from({ length: 10 }, (_, index) =>
      prisma.reasoningTrace.upsert({
        where: { id: `reasoning-trace-${String(index + 1).padStart(2, "0")}` },
        update: {
          sourceType: index < 5 ? "Pattern" : "Memory",
          sourceId: index < 5 ? patternData[index % patternData.length][0] : memoryData[index % memoryData.length][0],
          inputSummary:
            index === 0
              ? "Several launch comments ask whether VidMaker can transform product pages into finished videos."
              : `Kernel trace ${index + 1} explains a VidMaker growth decision.`,
          reasoningSteps,
          conclusion:
            index === 0
              ? "Create a product-page-to-video demo and publish it across channels."
              : "Prioritize the highest-confidence action tied to recurring VidMaker demand.",
          confidenceScore: Number((0.78 + index * 0.015).toFixed(2)),
          recommendedActionIds: [`kernel-action-${String((index % 15) + 1).padStart(2, "0")}`]
        },
        create: {
          ...tenant,
          id: `reasoning-trace-${String(index + 1).padStart(2, "0")}`,
          sourceType: index < 5 ? "Pattern" : "Memory",
          sourceId: index < 5 ? patternData[index % patternData.length][0] : memoryData[index % memoryData.length][0],
          inputSummary:
            index === 0
              ? "Several launch comments ask whether VidMaker can transform product pages into finished videos."
              : `Kernel trace ${index + 1} explains a VidMaker growth decision.`,
          reasoningSteps,
          conclusion:
            index === 0
              ? "Create a product-page-to-video demo and publish it across channels."
              : "Prioritize the highest-confidence action tied to recurring VidMaker demand.",
          confidenceScore: Number((0.78 + index * 0.015).toFixed(2)),
          recommendedActionIds: [`kernel-action-${String((index % 15) + 1).padStart(2, "0")}`]
        }
      })
    )
  );

  const kernelActions = [
    [ActionType.CREATE_DEMO, "Create product-page-to-video demo from a real ecommerce page.", "objective-demo-assets", "pattern-product-page-examples", Priority.CRITICAL],
    [ActionType.WRITE_BLOG, "Publish Video Production Intelligence category article.", "objective-own-vpi", "pattern-own-vpi", Priority.CRITICAL],
    [ActionType.CREATE_FAQ, "Create FAQ block for Purpose-Specific AI and product-page-to-video.", "objective-aeo-geo", "pattern-aeo-purpose-ai", Priority.HIGH],
    [ActionType.SUBMIT_DIRECTORY, "Submit VidMaker to five AI video directories this week.", "objective-authority", "pattern-directory-authority", Priority.HIGH],
    [ActionType.ADD_INTERNAL_LINK, "Link BLOG-002, BLOG-003, and BLOG-004 into one authority cluster.", "objective-own-vpi", "pattern-own-vpi", Priority.HIGH],
    [ActionType.CREATE_X_THREAD, "Turn the product-page demo into an X thread.", "objective-product-hunt", "pattern-product-hunt-demo-gap", Priority.HIGH],
    [ActionType.CREATE_PINTEREST_PIN, "Create Pinterest pin from product-page-to-video workflow.", "objective-product-hunt", "pattern-product-page-examples", Priority.MEDIUM],
    [ActionType.REPLY_TO_COMMUNITY, "Reply to Product Hunt example requests with demo proof.", "objective-product-hunt", "pattern-product-hunt-demo-gap", Priority.CRITICAL],
    [ActionType.UPDATE_LANDING_PAGE, "Add source-to-output proof to product-page-to-video landing page.", "objective-demo-assets", "pattern-product-page-examples", Priority.CRITICAL],
    [ActionType.CREATE_COMPANY_POST, "Publish LinkedIn company post on workflow intelligence.", "objective-own-vpi", "pattern-workflow-positioning", Priority.HIGH],
    [ActionType.CREATE_FOUNDER_POST, "Publish founder post contrasting VidMaker with simple text-to-video tools.", "objective-own-vpi", "pattern-generic-tool-complaints", Priority.HIGH],
    [ActionType.REACH_OUT_FOR_BACKLINK, "Pitch Video Production Intelligence definition to AI workflow newsletters.", "objective-authority", "pattern-directory-authority", Priority.HIGH],
    [ActionType.CREATE_DEMO, "Create 4K proof clip showing quality and control.", "objective-demo-assets", "pattern-4k-proof", Priority.HIGH],
    [ActionType.WRITE_BLOG, "Write comparison article on workflow AI versus generic AI video generators.", "objective-aeo-geo", "pattern-generic-tool-complaints", Priority.HIGH],
    [ActionType.FOLLOW_UP, "Review kernel priority list and assign owners for the week.", "objective-product-hunt", "pattern-product-page-examples", Priority.HIGH]
  ] as const;

  await Promise.all(
    kernelActions.map(([actionType, title, objectiveId, patternId, priority], index) =>
      prisma.recommendedAction.upsert({
        where: { id: `kernel-action-${String(index + 1).padStart(2, "0")}` },
        update: {
          title,
          description: title,
          sourceType: "Pattern",
          sourceId: patternId,
          actionType,
          priority,
          status: index < 8 ? ActionStatus.PENDING : ActionStatus.IN_PROGRESS,
          objectiveId,
          patternId
        },
        create: {
          ...tenant,
          id: `kernel-action-${String(index + 1).padStart(2, "0")}`,
          title,
          description: title,
          sourceType: "Pattern",
          sourceId: patternId,
          actionType,
          priority,
          status: index < 8 ? ActionStatus.PENDING : ActionStatus.IN_PROGRESS,
          dueDate: dateFromNow((index % 7) + 1),
          owner: index % 3 === 0 ? "Growth" : index % 3 === 1 ? "Content" : "Authority",
          reasoning: "Selected by the VGOS Intelligence Kernel from memory, pattern, objective, and confidence signals.",
          expectedImpact: "Improves category ownership, proof, authority, AEO/GEO visibility, or launch conversion.",
          objectiveId,
          patternId
        }
      })
    )
  );

  const kernelEvents = [
    EventType.MEMORY_CREATED,
    EventType.MEMORY_CREATED,
    EventType.MEMORY_UPDATED,
    EventType.PATTERN_DETECTED,
    EventType.PATTERN_DETECTED,
    EventType.REASONING_TRACE_CREATED,
    EventType.OBJECTIVE_CREATED,
    EventType.OBJECTIVE_CREATED,
    EventType.KEY_RESULT_UPDATED,
    EventType.KEY_RESULT_UPDATED,
    EventType.AGENT_RUN_STARTED,
    EventType.AGENT_RUN_COMPLETED,
    EventType.AGENT_RUN_COMPLETED,
    EventType.HIGH_IMPACT_ACTION_SELECTED,
    EventType.HIGH_IMPACT_ACTION_SELECTED,
    EventType.MEMORY_UPDATED,
    EventType.PATTERN_DETECTED,
    EventType.REASONING_TRACE_CREATED,
    EventType.AGENT_RUN_STARTED,
    EventType.AGENT_RUN_COMPLETED
  ];

  await Promise.all(
    kernelEvents.map((eventType, index) =>
      prisma.event.upsert({
        where: { id: `kernel-event-${String(index + 1).padStart(2, "0")}` },
        update: {
          eventType,
          title: `Kernel event ${index + 1}: ${eventType}`,
          description: `VGOS Intelligence Kernel produced ${eventType} for VidMaker.`,
          status: index < 4 ? EventStatus.PENDING : EventStatus.PROCESSED
        },
        create: {
          ...tenant,
          id: `kernel-event-${String(index + 1).padStart(2, "0")}`,
          eventType,
          sourceType: index % 3 === 0 ? "Memory" : index % 3 === 1 ? "Pattern" : "AgentRun",
          sourceId:
            index % 3 === 0
              ? memoryData[index % memoryData.length][0]
              : index % 3 === 1
                ? patternData[index % patternData.length][0]
                : `agent-run-${String((index % 5) + 1).padStart(2, "0")}`,
          title: `Kernel event ${index + 1}: ${eventType}`,
          description: `VGOS Intelligence Kernel produced ${eventType} for VidMaker.`,
          metadata: { phase: "alpha", generatedBy: "kernel-seed" },
          severity: index < 5 || eventType === EventType.HIGH_IMPACT_ACTION_SELECTED ? EventSeverity.CRITICAL : EventSeverity.HIGH,
          status: index < 4 ? EventStatus.PENDING : EventStatus.PROCESSED,
          processedAt: index < 4 ? undefined : dateFromNow(-index)
        }
      })
    )
  );
}

async function seedBetaFoundation() {
  const knowledgeObjects = [
    ["ko-vidmaker", "KO-VIDMAKER", KnowledgeObjectType.ENTITY, "VidMaker", "VidMaker is the Growth Intelligence and video production platform being operated in VGOS.", "Entity", "entity-vidmaker", ["VidMaker AI"], ["brand", "platform"], 100, 0.98],
    ["ko-video-production-intelligence", "KO-VIDEO-PRODUCTION-INTELLIGENCE", KnowledgeObjectType.ENTITY, "Video Production Intelligence", "VidMaker category language for production-aware AI video workflows.", "Entity", "entity-video-production-intelligence", ["VPI"], ["category", "geo"], 98, 0.94],
    ["ko-purpose-specific-ai", "KO-PURPOSE-SPECIFIC-AI", KnowledgeObjectType.ENTITY, "Purpose-Specific AI", "A concept explaining why workflow-specific AI outperforms generic generation.", "Entity", "entity-purpose-specific-ai", ["workflow-specific AI"], ["category", "aeo"], 92, 0.9],
    ["ko-blog-002", "KO-BLOG-002", KnowledgeObjectType.CONTENT_ASSET, "BLOG-002", "What Is Video Production Intelligence?", "ContentAsset", "content-blog-002", ["Video Production Intelligence article"], ["blog", "seo"], 88, 0.84],
    ["ko-blog-003", "KO-BLOG-003", KnowledgeObjectType.CONTENT_ASSET, "BLOG-003", "Purpose-Specific AI for Video Teams.", "ContentAsset", "content-blog-003", ["Purpose-Specific AI article"], ["blog", "aeo"], 84, 0.82],
    ["ko-blog-004", "KO-BLOG-004", KnowledgeObjectType.CONTENT_ASSET, "BLOG-004", "How to Turn a Product Page Into a Video.", "ContentAsset", "content-blog-004", ["Product Page to Video blog"], ["blog", "bofu"], 96, 0.9],
    ["ko-blog-005", "KO-BLOG-005", KnowledgeObjectType.CONTENT_ASSET, "BLOG-005", "Why generic AI video tools still need cleanup.", "ContentAsset", "content-blog-005", ["Generic AI video complaints article"], ["blog", "comparison"], 86, 0.78],
    ["ko-product-page-to-video", "KO-PRODUCT-PAGE-TO-VIDEO", KnowledgeObjectType.ENTITY, "Product Page to Video", "VidMaker use case for turning product pages into ready-to-post videos.", "Entity", "entity-product-page-to-video", ["PDP to video", "URL to video"], ["use-case", "ecommerce"], 97, 0.93],
    ["ko-product-hunt-launch", "KO-PRODUCT-HUNT-LAUNCH", KnowledgeObjectType.PRODUCT_SIGNAL, "Product Hunt Launch", "Launch feedback and comments from Product Hunt.", "Observation", "observation-product-hunt-comments", ["PH launch"], ["community", "launch"], 89, 0.82],
    ["ko-generic-ai-video-complaints", "KO-GENERIC-AI-VIDEO-COMPLAINTS", KnowledgeObjectType.PATTERN, "Generic AI Video Complaints", "Recurring complaints about cleanup and weak source understanding.", "Pattern", "pattern-02", ["cleanup complaints"], ["competitor", "pain"], 90, 0.87],
    ["ko-ecommerce-brand", "KO-ECOMMERCE-BRAND", KnowledgeObjectType.PERSONA, "Ecommerce Brand", "Persona needing automated product video creation from product pages.", "Persona", "persona-ecommerce-brand", ["commerce team"], ["persona"], 91, 0.88],
    ["ko-agency", "KO-AGENCY", KnowledgeObjectType.PERSONA, "Agency", "Persona needing scalable client video production.", "Persona", "persona-agency", ["marketing agency"], ["persona"], 78, 0.78],
    ["ko-creator", "KO-CREATOR", KnowledgeObjectType.PERSONA, "Creator", "Persona needing faster idea-to-video workflows.", "Persona", "persona-creator", ["content creator"], ["persona"], 75, 0.76],
    ["ko-question-product-page", "KO-QUESTION-PRODUCT-PAGE", KnowledgeObjectType.QUESTION, "How do you turn a product page into a video?", "High-intent AEO question tied to product-page-to-video workflows.", "Question", "question-product-page-to-video", ["PDP video question"], ["question", "aeo"], 94, 0.89],
    ["ko-question-vpi", "KO-QUESTION-VPI", KnowledgeObjectType.QUESTION, "What is Video Production Intelligence?", "Category-definition question for answer engines.", "Question", "question-video-production-intelligence", ["VPI question"], ["question", "geo"], 93, 0.91],
    ["ko-keyword-vpi", "KO-KEYWORD-VPI", KnowledgeObjectType.KEYWORD, "Video Production Intelligence keyword", "Tracked keyword for category ownership.", "Keyword", "keyword-video-production-intelligence", ["VPI keyword"], ["keyword", "seo"], 82, 0.8],
    ["ko-keyword-product-page", "KO-KEYWORD-PRODUCT-PAGE", KnowledgeObjectType.KEYWORD, "product page to video keyword", "Tracked keyword for product-page-to-video demand.", "Keyword", "keyword-product-page-to-video", ["PDP video keyword"], ["keyword", "bofu"], 91, 0.86],
    ["ko-directory-strategy", "KO-DIRECTORY-STRATEGY", KnowledgeObjectType.DIRECTORY, "Directory submission strategy", "Authority plan for VidMaker AI tool directories.", "DirectorySubmission", "directory-ai-video-tools", ["directory strategy"], ["authority"], 80, 0.76],
    ["ko-backlink-directory", "KO-BACKLINK-DIRECTORY", KnowledgeObjectType.BACKLINK, "AI Video Tools backlink", "Backlink opportunity from AI video tools directory.", "Backlink", "backlink-ai-video-tools-directory", ["directory backlink"], ["authority"], 72, 0.72],
    ["ko-memory-product-page", "KO-MEMORY-PRODUCT-PAGE", KnowledgeObjectType.MEMORY, "Product-page-to-video demand memory", "Recurring memory for product-page-to-video demand.", "Memory", "memory-product-page-to-video-demand", ["product-page memory"], ["memory"], 95, 0.91],
    ["ko-pattern-examples", "KO-PATTERN-EXAMPLES", KnowledgeObjectType.PATTERN, "Users ask for example outputs", "Pattern showing demo requests after launch.", "Pattern", "pattern-product-page-examples", ["example output pattern"], ["pattern"], 94, 0.9],
    ["ko-objective-own-vpi", "KO-OBJECTIVE-OWN-VPI", KnowledgeObjectType.OBJECTIVE, "Own Video Production Intelligence category", "Objective to establish VidMaker as category authority.", "Objective", "objective-own-vpi", ["VPI objective"], ["objective"], 96, 0.88],
    ["ko-feature-proof-mode", "KO-FEATURE-PROOF-MODE", KnowledgeObjectType.FEATURE_REQUEST, "URL-to-video proof mode", "Feature request for traceable source-to-output proof.", "FeatureRequest", "feature-url-to-video-proof-mode", ["proof mode"], ["product"], 90, 0.84],
    ["ko-campaign-proof-sprint", "KO-CAMPAIGN-PROOF-SPRINT", KnowledgeObjectType.CAMPAIGN, "Product Page to Video Proof Sprint", "Campaign to publish demos and proof-led content.", "Campaign", "campaign-product-page-to-video-proof", ["proof sprint"], ["campaign"], 92, 0.86],
    ["ko-experiment-demo-series", "KO-EXPERIMENT-DEMO-SERIES", KnowledgeObjectType.EXPERIMENT, "Product-page demo series experiment", "Experiment testing demo distribution and trial conversion.", "Experiment", "experiment-product-page-demo-series", ["demo experiment"], ["experiment"], 78, 0.74]
  ] as const;

  await Promise.all(
    knowledgeObjects.map(([id, canonicalId, objectType, title, summary, sourceType, sourceId, aliases, tags, importanceScore, confidenceScore], index) =>
      prisma.knowledgeObject.upsert({
        where: { id },
        update: {
          canonicalId,
          objectType,
          title,
          summary,
          description: summary,
          sourceType,
          sourceId,
          canonicalEntityId: objectType === KnowledgeObjectType.ENTITY ? id : null,
          aliases: [...aliases],
          tags: [...tags],
          metadata: { phase: "beta", seedIndex: index },
          searchableText: `${title} ${summary} ${aliases.join(" ")} ${tags.join(" ")}`,
          embeddingProvider: index < 10 ? "mock" : null,
          embeddingModel: index < 10 ? "keyword-similarity-v0" : null,
          embeddingVector: index < 10 ? [importanceScore / 100, confidenceScore, index / 25] : undefined,
          embeddingUpdatedAt: index < 10 ? dateFromNow(0) : null,
          importanceScore,
          confidenceScore,
          status: Status.RESEARCHING
        },
        create: {
          ...tenant,
          id,
          canonicalId,
          objectType,
          title,
          summary,
          description: summary,
          sourceType,
          sourceId,
          canonicalEntityId: objectType === KnowledgeObjectType.ENTITY ? id : null,
          aliases: [...aliases],
          tags: [...tags],
          metadata: { phase: "beta", seedIndex: index },
          searchableText: `${title} ${summary} ${aliases.join(" ")} ${tags.join(" ")}`,
          embeddingProvider: index < 10 ? "mock" : null,
          embeddingModel: index < 10 ? "keyword-similarity-v0" : null,
          embeddingVector: index < 10 ? [importanceScore / 100, confidenceScore, index / 25] : undefined,
          embeddingUpdatedAt: index < 10 ? dateFromNow(0) : null,
          importanceScore,
          confidenceScore,
          status: Status.RESEARCHING
        }
      })
    )
  );

  const relationshipSeeds = [
    ["ko-vidmaker", "ko-video-production-intelligence", KnowledgeRelationshipType.DEFINES],
    ["ko-purpose-specific-ai", "ko-video-production-intelligence", KnowledgeRelationshipType.SUPPORTS],
    ["ko-blog-004", "ko-question-vpi", KnowledgeRelationshipType.ANSWERS],
    ["ko-product-hunt-launch", "ko-vidmaker", KnowledgeRelationshipType.GENERATED_FROM],
    ["ko-product-page-to-video", "ko-ecommerce-brand", KnowledgeRelationshipType.SUPPORTS],
    ["ko-generic-ai-video-complaints", "ko-blog-005", KnowledgeRelationshipType.INSPIRES]
  ] as const;
  const allRelationSeeds = Array.from({ length: 40 }, (_, index) => {
    const fixed = relationshipSeeds[index];
    if (fixed) return fixed;
    const from = knowledgeObjects[index % knowledgeObjects.length][0];
    const to = knowledgeObjects[(index + 3) % knowledgeObjects.length][0];
    const types = [
      KnowledgeRelationshipType.RELATED_TO,
      KnowledgeRelationshipType.SUPPORTS,
      KnowledgeRelationshipType.LINKS_TO,
      KnowledgeRelationshipType.TARGETS,
      KnowledgeRelationshipType.MENTIONS,
      KnowledgeRelationshipType.IMPROVES,
      KnowledgeRelationshipType.VALIDATES
    ];
    return [from, to, types[index % types.length]] as const;
  });

  await Promise.all(
    allRelationSeeds.map(([fromObjectId, toObjectId, relationshipType], index) =>
      prisma.knowledgeRelationship.upsert({
        where: { id: `knowledge-rel-${String(index + 1).padStart(2, "0")}` },
        update: {
          fromObjectId,
          toObjectId,
          relationshipType,
          strength: Number((0.52 + (index % 10) * 0.04).toFixed(2)),
          evidence: `Seeded Phase Beta relationship ${index + 1}.`,
          metadata: { phase: "beta" }
        },
        create: {
          ...tenant,
          id: `knowledge-rel-${String(index + 1).padStart(2, "0")}`,
          fromObjectId,
          toObjectId,
          relationshipType,
          strength: Number((0.52 + (index % 10) * 0.04).toFixed(2)),
          evidence: `Seeded Phase Beta relationship ${index + 1}.`,
          metadata: { phase: "beta" }
        }
      })
    )
  );

  const snapshots = [
    ["memory-product-page-to-video-demand", "June 2026", "Product-page-to-video demand increased after Product Hunt launch.", 8, 96, 0.92, TrendDirection.RISING],
    ["memory-real-product-demos", "June 2026", "More users asked for real examples and ready-to-post output proof.", 9, 97, 0.91, TrendDirection.RISING],
    ["memory-generic-ai-video-complaints", "June 2026", "Generic AI video complaints continued around cleanup and source understanding.", 7, 89, 0.86, TrendDirection.STABLE],
    ["memory-purpose-specific-ai", "June 2026", "Purpose-Specific AI curiosity remained steady around category education.", 5, 86, 0.84, TrendDirection.STABLE],
    ["memory-directory-authority", "June 2026", "Directory authority became more important for AI visibility.", 4, 81, 0.78, TrendDirection.RISING]
  ] as const;

  await Promise.all(
    snapshots.map(([memoryId, period, summary, frequency, importanceScore, confidenceScore, trendDirection], index) =>
      prisma.memorySnapshot.upsert({
        where: { id: `memory-snapshot-${String(index + 1).padStart(2, "0")}` },
        update: {
          memoryId,
          period,
          summary,
          frequency,
          importanceScore,
          confidenceScore,
          trendDirection,
          notableSources: ["Product Hunt", "LinkedIn", "Reddit"]
        },
        create: {
          ...tenant,
          id: `memory-snapshot-${String(index + 1).padStart(2, "0")}`,
          memoryId,
          period,
          summary,
          frequency,
          importanceScore,
          confidenceScore,
          trendDirection,
          notableSources: ["Product Hunt", "LinkedIn", "Reddit"]
        }
      })
    )
  );

  const workflowSeeds = [
    ["workflow-product-hunt-demo", "Product Hunt Comment to Demo Content Recommendation", WorkflowType.PRODUCT_HUNT_TO_DEMO_CONTENT, TriggerType.EVENT],
    ["workflow-question-aeo", "Question to AEO Blog Asset", WorkflowType.QUESTION_TO_AEO_ASSET, TriggerType.MANUAL],
    ["workflow-pain-feature", "Pain Point to Feature Request", WorkflowType.PAIN_POINT_TO_FEATURE_REQUEST, TriggerType.EVENT],
    ["workflow-competitor-content", "Competitor Complaint to Comparison Content", WorkflowType.COMPETITOR_COMPLAINT_TO_CONTENT, TriggerType.AGENT],
    ["workflow-memory-pattern", "Memory to Pattern Detection", WorkflowType.MEMORY_TO_PATTERN, TriggerType.SCHEDULED]
  ] as const;

  await Promise.all(
    workflowSeeds.map(([id, name, workflowType, triggerType]) =>
      prisma.workflow.upsert({
        where: { id },
        update: {
          name,
          description: `${name} orchestrates Beta kernel outputs for VidMaker.`,
          workflowType,
          status: Status.LIVE,
          triggerType,
          triggerConfig: { mode: triggerType }
        },
        create: {
          ...tenant,
          id,
          name,
          description: `${name} orchestrates Beta kernel outputs for VidMaker.`,
          workflowType,
          status: Status.LIVE,
          triggerType,
          triggerConfig: { mode: triggerType }
        }
      })
    )
  );

  const stepTypes = [
    WorkflowStepType.CLASSIFY,
    WorkflowStepType.EXTRACT_ENTITIES,
    WorkflowStepType.CREATE_MEMORY,
    WorkflowStepType.DETECT_PATTERN,
    WorkflowStepType.CREATE_REASONING_TRACE,
    WorkflowStepType.CREATE_RECOMMENDATION,
    WorkflowStepType.CREATE_ACTION,
    WorkflowStepType.LINK_KNOWLEDGE_OBJECTS,
    WorkflowStepType.NOTIFY_MISSION_CONTROL
  ];

  await Promise.all(
    Array.from({ length: 20 }, (_, index) => {
      const workflowId = workflowSeeds[index % workflowSeeds.length][0];
      return prisma.workflowStep.upsert({
        where: { id: `workflow-step-${String(index + 1).padStart(2, "0")}` },
        update: {
          workflowId,
          order: (index % 4) + 1,
          name: `${stepTypes[index % stepTypes.length]} step`,
          stepType: stepTypes[index % stepTypes.length],
          config: { phase: "beta", order: (index % 4) + 1 },
          status: ActionStatus.PENDING
        },
        create: {
          id: `workflow-step-${String(index + 1).padStart(2, "0")}`,
          workflowId,
          order: (index % 4) + 1,
          name: `${stepTypes[index % stepTypes.length]} step`,
          stepType: stepTypes[index % stepTypes.length],
          config: { phase: "beta", order: (index % 4) + 1 },
          status: ActionStatus.PENDING
        }
      });
    })
  );

  await Promise.all(
    Array.from({ length: 10 }, (_, index) => {
      const workflowId = workflowSeeds[index % workflowSeeds.length][0];
      return prisma.workflowRun.upsert({
        where: { id: `workflow-run-${String(index + 1).padStart(2, "0")}` },
        update: {
          workflowId,
          status: index === 2 ? ActionStatus.PENDING : index === 3 ? ActionStatus.IN_PROGRESS : ActionStatus.COMPLETED,
          output: { recommendationsCreated: index + 1, actionsCreated: index + 2 },
          logs: ["Workflow loaded trigger.", "Kernel services executed.", "Mission Control notified."]
        },
        create: {
          ...tenant,
          id: `workflow-run-${String(index + 1).padStart(2, "0")}`,
          workflowId,
          status: index === 2 ? ActionStatus.PENDING : index === 3 ? ActionStatus.IN_PROGRESS : ActionStatus.COMPLETED,
          triggerSourceType: index % 2 === 0 ? "Event" : "Manual",
          triggerSourceId: index % 2 === 0 ? `kernel-event-${String((index % 20) + 1).padStart(2, "0")}` : "manual-run",
          input: { phase: "beta", source: "seed" },
          output: { recommendationsCreated: index + 1, actionsCreated: index + 2 },
          startedAt: dateFromNow(-index),
          completedAt: index === 3 ? null : dateFromNow(-index + 1),
          logs: ["Workflow loaded trigger.", "Kernel services executed.", "Mission Control notified."]
        }
      });
    })
  );

  const agentIds = ["agent-conversation", "agent-content", "agent-authority", "agent-aeo", "agent-product"];
  await Promise.all(
    agentIds.map((id, index) =>
      prisma.agent.update({
        where: { id },
        data: {
          parentAgentId: index === 0 ? null : "agent-conversation",
          dependsOnAgentIds: index === 0 ? [] : ["agent-conversation"],
          handoffRules: { handoffWhen: index === 2 ? "content_needs_backlinks" : "output_created" },
          allowedWorkflowIds: workflowSeeds.map((workflow) => workflow[0]).slice(0, 3)
        }
      })
    )
  );

  await Promise.all(
    Array.from({ length: 10 }, (_, index) => {
      const fromAgentId = agentIds[index % agentIds.length];
      const toAgentId = agentIds[(index + 1) % agentIds.length];
      return prisma.agentHandoff.upsert({
        where: { id: `agent-handoff-${String(index + 1).padStart(2, "0")}` },
        update: {
          fromAgentId,
          toAgentId,
          reason: "Conversation signal produced a downstream action opportunity.",
          status: index < 4 ? ActionStatus.PENDING : ActionStatus.COMPLETED,
          completedAt: index < 4 ? null : dateFromNow(-index)
        },
        create: {
          ...tenant,
          id: `agent-handoff-${String(index + 1).padStart(2, "0")}`,
          fromAgentId,
          toAgentId,
          sourceType: index % 2 === 0 ? "Question" : "Pattern",
          sourceId: index % 2 === 0 ? "question-product-page-to-video" : "pattern-product-page-examples",
          reason: "Conversation signal produced a downstream action opportunity.",
          status: index < 4 ? ActionStatus.PENDING : ActionStatus.COMPLETED,
          completedAt: index < 4 ? null : dateFromNow(-index)
        }
      });
    })
  );
}

async function seedPlanningEngine() {
  const planningPrisma = prisma as PrismaClient & Record<
    | "plan"
    | "milestone"
    | "planItem"
    | "planDependency"
    | "planConstraint"
    | "predictedOutcome"
    | "resourceCapacity",
    { upsert: (args: any) => Promise<unknown> }
  >;

  const planSeeds = [
    ["plan-vpi-authority", "30-Day Video Production Intelligence Authority Plan", "Build authority around Video Production Intelligence with proof-led content, internal links, and distribution.", PlanType.AUTHORITY_PLAN, PlanStatus.ACTIVE, "objective-own-vpi", 0, 30, "Growth", "VidMaker becomes more visible as the Video Production Intelligence category owner.", 0.84],
    ["plan-product-hunt-follow-up", "Product Hunt Follow-Up Plan", "Convert launch attention into demos, replies, founder posts, and learning loops.", PlanType.LAUNCH_PLAN, PlanStatus.ACTIVE, "objective-product-hunt", 0, 14, "Community Intelligence", "Launch demand turns into qualified product-page-to-video proof and signups.", 0.82],
    ["plan-directory-submission", "Directory Submission Plan", "Submit and monitor VidMaker across priority AI video and workflow directories.", PlanType.AUTHORITY_PLAN, PlanStatus.DRAFT, "objective-authority", 1, 21, "Authority", "VidMaker earns directory approvals, backlinks, and AI visibility signals.", 0.78],
    ["plan-blog-004-010-content", "BLOG-004 to BLOG-010 Content Plan", "Publish the next content cluster around product-page-to-video, Purpose-Specific AI, and workflow automation.", PlanType.CONTENT_PLAN, PlanStatus.ACTIVE, "objective-aeo-geo", 0, 35, "Content", "VidMaker publishes a connected authority cluster with answer-ready assets.", 0.8],
    ["plan-aeo-geo-visibility", "AEO/GEO Visibility Plan", "Create answer coverage and entity relationships for AEO and GEO visibility.", PlanType.AEO_PLAN, PlanStatus.DRAFT, "objective-aeo-geo", 2, 28, "Search Strategy", "VidMaker answers more AEO questions and strengthens entity association.", 0.76]
  ] as const;

  await Promise.all(
    planSeeds.map(([id, title, description, planType, status, objectiveId, startOffset, endOffset, owner, expectedOutcome, confidenceScore]) =>
      planningPrisma.plan.upsert({
        where: { id },
        update: {
          title,
          description,
          planType,
          status,
          objectiveId,
          startDate: dateFromNow(startOffset),
          endDate: dateFromNow(endOffset),
          owner,
          expectedOutcome,
          confidenceScore
        },
        create: {
          ...tenant,
          id,
          title,
          description,
          planType,
          status,
          objectiveId,
          startDate: dateFromNow(startOffset),
          endDate: dateFromNow(endOffset),
          owner,
          expectedOutcome,
          confidenceScore
        }
      })
    )
  );

  const milestoneSeeds = [
    ["milestone-publish-blog-004", "plan-blog-004-010-content", "Publish BLOG-004", "Publish product-page-to-video proof article.", 4, PlanItemStatus.IN_PROGRESS, Priority.CRITICAL, "Content", "Creates the core proof asset.", 1],
    ["milestone-publish-blog-005", "plan-blog-004-010-content", "Publish BLOG-005", "Publish comparison article on generic AI video cleanup.", 9, PlanItemStatus.NOT_STARTED, Priority.HIGH, "Content", "Captures competitor dissatisfaction.", 2],
    ["milestone-submit-10-directories", "plan-directory-submission", "Submit 10 directories", "Submit VidMaker to priority AI tool directories.", 12, PlanItemStatus.NOT_STARTED, Priority.HIGH, "Authority", "Builds referring domain and AI visibility momentum.", 1],
    ["milestone-create-product-demo", "plan-product-hunt-follow-up", "Create product-page-to-video demo", "Create demo showing product page URL to ready-to-post video.", 3, PlanItemStatus.IN_PROGRESS, Priority.CRITICAL, "Growth", "Provides proof for launch follow-up.", 1],
    ["milestone-add-internal-links", "plan-vpi-authority", "Add internal links between BLOG-002, BLOG-003, BLOG-004", "Connect the Video Production Intelligence content cluster.", 7, PlanItemStatus.NOT_STARTED, Priority.HIGH, "SEO Strategy", "Strengthens authority cluster.", 2],
    ["milestone-publish-10-pins", "plan-product-hunt-follow-up", "Publish 10 Pinterest pins", "Turn proof snippets into Pinterest assets.", 11, PlanItemStatus.NOT_STARTED, Priority.MEDIUM, "Content", "Expands visual distribution.", 3],
    ["milestone-founder-authority", "plan-vpi-authority", "Create founder authority post", "Publish founder post on Purpose-Specific AI and Video Production Intelligence.", 5, PlanItemStatus.NOT_STARTED, Priority.HIGH, "Tom Promise", "Builds category narrative.", 1],
    ["milestone-aeo-faq", "plan-aeo-geo-visibility", "Create AEO FAQ set", "Publish FAQ answers for product-page-to-video and VPI questions.", 10, PlanItemStatus.NOT_STARTED, Priority.HIGH, "Search Strategy", "Improves answer engine readiness.", 1],
    ["milestone-geo-entities", "plan-aeo-geo-visibility", "Strengthen GEO entity coverage", "Connect VidMaker, Purpose-Specific AI, and Product Page to Video entities.", 16, PlanItemStatus.NOT_STARTED, Priority.HIGH, "Search Strategy", "Improves entity confidence.", 2],
    ["milestone-blog-010", "plan-blog-004-010-content", "Publish BLOG-010", "Complete the BLOG-004 to BLOG-010 cluster.", 32, PlanItemStatus.NOT_STARTED, Priority.MEDIUM, "Content", "Completes the authority cluster.", 5]
  ] as const;

  await Promise.all(
    milestoneSeeds.map(([id, planId, title, description, dueOffset, status, priority, owner, expectedImpact, order]) =>
      planningPrisma.milestone.upsert({
        where: { id },
        update: {
          planId,
          title,
          description,
          dueDate: dateFromNow(dueOffset),
          status,
          priority,
          owner,
          expectedImpact,
          order
        },
        create: {
          ...tenant,
          id,
          planId,
          title,
          description,
          dueDate: dateFromNow(dueOffset),
          status,
          priority,
          owner,
          expectedImpact,
          order
        }
      })
    )
  );

  const planItemSeeds = [
    ["plan-vpi-authority", "milestone-founder-authority", "Draft founder authority post", PlanItemType.FOUNDER_POST, "RecommendedAction", "action-24", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Tom Promise", 88, 4, 2],
    ["plan-vpi-authority", "milestone-founder-authority", "Publish founder authority post", PlanItemType.FOUNDER_POST, "RecommendedAction", "kernel-action-11", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Tom Promise", 92, 3, 5],
    ["plan-vpi-authority", "milestone-add-internal-links", "Audit BLOG-002 internal links", PlanItemType.INTERNAL_LINK, "ContentAsset", "content-blog-002", Priority.HIGH, PlanItemStatus.NOT_STARTED, "SEO Strategy", 78, 2, 6],
    ["plan-vpi-authority", "milestone-add-internal-links", "Audit BLOG-003 internal links", PlanItemType.INTERNAL_LINK, "ContentAsset", "content-blog-003", Priority.HIGH, PlanItemStatus.NOT_STARTED, "SEO Strategy", 76, 2, 6],
    ["plan-vpi-authority", "milestone-add-internal-links", "Add links into BLOG-004", PlanItemType.INTERNAL_LINK, "ContentAsset", "content-blog-004", Priority.HIGH, PlanItemStatus.BLOCKED, "SEO Strategy", 86, 2, 8],
    ["plan-vpi-authority", "milestone-add-internal-links", "Update VPI landing page references", PlanItemType.LANDING_PAGE_UPDATE, "Entity", "entity-video-production-intelligence", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Growth", 84, 4, 10],
    ["plan-vpi-authority", "milestone-founder-authority", "Create category definition FAQ", PlanItemType.FAQ, "Question", "question-video-production-intelligence", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 82, 3, 11],
    ["plan-vpi-authority", "milestone-add-internal-links", "Publish VPI newsletter section", PlanItemType.NEWSLETTER, "ContentAsset", "content-blog-002", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 68, 3, 14],
    ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Script product-page-to-video demo", PlanItemType.DEMO, "Question", "question-product-page-to-video", Priority.CRITICAL, PlanItemStatus.IN_PROGRESS, "Growth", 96, 5, 1],
    ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Record product-page-to-video demo", PlanItemType.DEMO, "RecommendedAction", "action-01", Priority.CRITICAL, PlanItemStatus.BLOCKED, "Growth", 98, 6, 3],
    ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Create demo landing page section", PlanItemType.LANDING_PAGE_UPDATE, "Entity", "entity-product-page-to-video", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Growth", 86, 4, 5],
    ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 1", PlanItemType.PINTEREST_PIN, "ContentAsset", "content-blog-004", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Design System", 55, 1, 6],
    ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 2", PlanItemType.PINTEREST_PIN, "ContentAsset", "content-blog-004", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Design System", 55, 1, 7],
    ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Create Pinterest proof pin 3", PlanItemType.PINTEREST_PIN, "ContentAsset", "content-blog-004", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Design System", 55, 1, 8],
    ["plan-product-hunt-follow-up", "milestone-publish-10-pins", "Reply to top Product Hunt comments", PlanItemType.COMMUNITY_REPLY, "Observation", "observation-01", Priority.CRITICAL, PlanItemStatus.NOT_STARTED, "Community Intelligence", 92, 3, 4],
    ["plan-product-hunt-follow-up", "milestone-create-product-demo", "Publish X thread from demo", PlanItemType.X_THREAD, "RecommendedAction", "action-07", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Content", 78, 3, 6],
    ["plan-directory-submission", "milestone-submit-10-directories", "Finalize directory category copy", PlanItemType.DIRECTORY_SUBMISSION, "DirectorySubmission", "directory-ai-video-tools", Priority.HIGH, PlanItemStatus.IN_PROGRESS, "Authority", 82, 3, 2],
    ["plan-directory-submission", "milestone-submit-10-directories", "Submit Futurepedia listing", PlanItemType.DIRECTORY_SUBMISSION, "DirectorySubmission", "directory-ai-video-tools", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Authority", 84, 2, 5],
    ["plan-directory-submission", "milestone-submit-10-directories", "Submit Toolify listing", PlanItemType.DIRECTORY_SUBMISSION, "DirectorySubmission", "directory-ai-video-tools", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Authority", 84, 2, 6],
    ["plan-directory-submission", "milestone-submit-10-directories", "Submit There's An AI For That listing", PlanItemType.DIRECTORY_SUBMISSION, "DirectorySubmission", "directory-ai-video-tools", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Authority", 80, 2, 7],
    ["plan-directory-submission", "milestone-submit-10-directories", "Follow up on AI Video Tools backlink", PlanItemType.BACKLINK_OUTREACH, "Backlink", "backlink-ai-video-tools-directory", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Authority", 76, 2, 9],
    ["plan-directory-submission", "milestone-submit-10-directories", "Track directory approvals", PlanItemType.BACKLINK_OUTREACH, "DirectorySubmission", "directory-ai-video-tools", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Authority", 66, 2, 13],
    ["plan-blog-004-010-content", "milestone-publish-blog-004", "Finish BLOG-004 draft", PlanItemType.BLOG, "ContentAsset", "content-blog-004", Priority.CRITICAL, PlanItemStatus.IN_PROGRESS, "Content", 96, 5, 2],
    ["plan-blog-004-010-content", "milestone-publish-blog-004", "Add BLOG-004 proof examples", PlanItemType.BLOG, "AIRecommendation", "ai-rec-01", Priority.CRITICAL, PlanItemStatus.BLOCKED, "Content", 94, 4, 3],
    ["plan-blog-004-010-content", "milestone-publish-blog-004", "Publish BLOG-004", PlanItemType.BLOG, "RecommendedAction", "action-03", Priority.CRITICAL, PlanItemStatus.NOT_STARTED, "Content", 98, 2, 4],
    ["plan-blog-004-010-content", "milestone-publish-blog-005", "Outline BLOG-005", PlanItemType.BLOG, "Pattern", "pattern-02", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Content", 84, 3, 7],
    ["plan-blog-004-010-content", "milestone-publish-blog-005", "Publish BLOG-005", PlanItemType.BLOG, "ContentAsset", "content-blog-005", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Content", 88, 4, 9],
    ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-006 brief", PlanItemType.BLOG, "Keyword", "keyword-ai-video-production", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Content", 74, 3, 12],
    ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-007 brief", PlanItemType.BLOG, "Keyword", "keyword-video-workflow-automation", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Content", 74, 3, 15],
    ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-008 brief", PlanItemType.BLOG, "Entity", "entity-purpose-specific-ai", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 70, 3, 18],
    ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-009 brief", PlanItemType.BLOG, "Entity", "entity-purpose-engines", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 68, 3, 22],
    ["plan-blog-004-010-content", "milestone-blog-010", "Create BLOG-010 brief", PlanItemType.BLOG, "Question", "question-purpose-specific-ai", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 66, 3, 28],
    ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer product-page-to-video FAQ", PlanItemType.FAQ, "Question", "question-product-page-to-video", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 86, 2, 5],
    ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer VPI FAQ", PlanItemType.FAQ, "Question", "question-video-production-intelligence", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 88, 2, 6],
    ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Answer Purpose-Specific AI FAQ", PlanItemType.FAQ, "Question", "question-purpose-specific-ai", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 82, 2, 8],
    ["plan-aeo-geo-visibility", "milestone-geo-entities", "Update VidMaker entity page", PlanItemType.LANDING_PAGE_UPDATE, "Entity", "entity-vidmaker", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 78, 3, 12],
    ["plan-aeo-geo-visibility", "milestone-geo-entities", "Update Product Page to Video entity page", PlanItemType.LANDING_PAGE_UPDATE, "Entity", "entity-product-page-to-video", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 80, 3, 14],
    ["plan-aeo-geo-visibility", "milestone-geo-entities", "Create company post on Purpose Engines", PlanItemType.COMPANY_POST, "Entity", "entity-purpose-engines", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 64, 2, 15],
    ["plan-aeo-geo-visibility", "milestone-aeo-faq", "Create YouTube script from FAQ set", PlanItemType.YOUTUBE_SCRIPT, "Question", "question-video-production-intelligence", Priority.MEDIUM, PlanItemStatus.NOT_STARTED, "Content", 62, 4, 19],
    ["plan-aeo-geo-visibility", "milestone-geo-entities", "Run answer coverage experiment", PlanItemType.EXPERIMENT, "Objective", "objective-aeo-geo", Priority.HIGH, PlanItemStatus.NOT_STARTED, "Search Strategy", 82, 5, 22]
  ] as const;

  await Promise.all(
    planItemSeeds.map(([planId, milestoneId, title, itemType, sourceType, sourceId, priority, status, owner, estimatedImpactScore, estimatedEffortScore, dueOffset], index) =>
      planningPrisma.planItem.upsert({
        where: { id: `plan-item-${String(index + 1).padStart(2, "0")}` },
        update: {
          planId,
          milestoneId,
          title,
          description: title,
          itemType,
          sourceType,
          sourceId,
          priority,
          status,
          owner,
          dueDate: dateFromNow(dueOffset),
          estimatedImpactScore,
          estimatedEffortScore
        },
        create: {
          ...tenant,
          id: `plan-item-${String(index + 1).padStart(2, "0")}`,
          planId,
          milestoneId,
          title,
          description: title,
          itemType,
          sourceType,
          sourceId,
          priority,
          status,
          owner,
          dueDate: dateFromNow(dueOffset),
          estimatedImpactScore,
          estimatedEffortScore
        }
      })
    )
  );

  const dependencySeeds = [
    ["plan-vpi-authority", "plan-item-25", "plan-item-05", PlanDependencyType.SEQUENCED_BEFORE, "BLOG-004 should be published before internal links point to it."],
    ["plan-product-hunt-follow-up", "plan-item-10", "plan-item-16", PlanDependencyType.BLOCKS, "Product page demo should be created before demo promotion."],
    ["plan-directory-submission", "plan-item-17", "plan-item-18", PlanDependencyType.REQUIRES, "Directory copy should be finalized before directory submissions."],
    ["plan-directory-submission", "plan-item-17", "plan-item-19", PlanDependencyType.REQUIRES, "Directory copy should be finalized before Toolify submission."],
    ["plan-blog-004-010-content", "plan-item-24", "plan-item-25", PlanDependencyType.BLOCKS, "Proof examples are required before BLOG-004 publishing."],
    ["plan-blog-004-010-content", "plan-item-25", "plan-item-27", PlanDependencyType.SHOULD_FOLLOW, "BLOG-005 should follow the product-page-to-video proof article."],
    ["plan-aeo-geo-visibility", "plan-item-34", "plan-item-40", PlanDependencyType.SUPPORTS, "VPI FAQ coverage supports the answer coverage experiment."],
    ["plan-product-hunt-follow-up", "plan-item-10", "plan-item-15", PlanDependencyType.BLOCKS, "Community replies should include the demo proof link."]
  ] as const;

  await Promise.all(
    dependencySeeds.map(([planId, fromItemId, toItemId, dependencyType, reason], index) =>
      planningPrisma.planDependency.upsert({
        where: { id: `plan-dependency-${String(index + 1).padStart(2, "0")}` },
        update: { planId, fromItemId, toItemId, dependencyType, reason },
        create: {
          ...tenant,
          id: `plan-dependency-${String(index + 1).padStart(2, "0")}`,
          planId,
          fromItemId,
          toItemId,
          dependencyType,
          reason
        }
      })
    )
  );

  const constraintSeeds = [
    ["plan-product-hunt-follow-up", "Product demo not ready", "Product-page-to-video demo needs final proof assets before promotion.", PlanConstraintType.PRODUCT_NOT_READY, ConstraintSeverity.CRITICAL],
    ["plan-vpi-authority", "Limited founder time", "Founder publishing capacity is capped this week.", PlanConstraintType.RESOURCE_LIMITED, ConstraintSeverity.HIGH],
    ["plan-blog-004-010-content", "Need graphics for BLOG-004", "BLOG-004 requires diagrams and proof visuals.", PlanConstraintType.DESIGN_NOT_READY, ConstraintSeverity.HIGH],
    ["plan-blog-004-010-content", "Need proof examples for product-page-to-video", "Article requires source-to-output proof examples.", PlanConstraintType.CONTENT_NOT_READY, ConstraintSeverity.CRITICAL],
    ["plan-directory-submission", "Directory approvals may lag", "Submission review time may delay backlink outcomes.", PlanConstraintType.APPROVAL_REQUIRED, ConstraintSeverity.MEDIUM]
  ] as const;

  await Promise.all(
    constraintSeeds.map(([planId, title, description, constraintType, severity], index) =>
      planningPrisma.planConstraint.upsert({
        where: { id: `plan-constraint-${String(index + 1).padStart(2, "0")}` },
        update: { planId, title, description, constraintType, severity },
        create: {
          ...tenant,
          id: `plan-constraint-${String(index + 1).padStart(2, "0")}`,
          planId,
          title,
          description,
          constraintType,
          severity
        }
      })
    )
  );

  const predictedOutcomeSeeds = [
    ["plan-directory-submission", "directory approvals", 10, 0.78, "+10 directory submissions are likely if copy is finalized this week."],
    ["plan-directory-submission", "potential backlinks", 5, 0.7, "+5 potential backlinks from approved listings and follow-ups."],
    ["plan-blog-004-010-content", "authority articles", 4, 0.74, "+4 authority articles from the BLOG-004 to BLOG-010 cluster."],
    ["plan-product-hunt-follow-up", "social content assets", 20, 0.72, "+20 social content assets from demo clips, Pinterest pins, and X threads."],
    ["plan-product-hunt-follow-up", "product demo assets", 3, 0.8, "+3 product demo assets from product-page-to-video proof work."],
    ["plan-aeo-geo-visibility", "AEO questions answered", 10, 0.76, "+10 AEO questions answered through FAQ and landing page updates."],
    ["plan-vpi-authority", "AI mentions", 6, 0.64, "Improved entity clarity should lift AI mentions over time."],
    ["plan-product-hunt-follow-up", "signups", 25, 0.58, "Demo-led follow-up should create a modest signup lift."]
  ] as const;

  await Promise.all(
    predictedOutcomeSeeds.map(([planId, metricName, predictedValue, confidenceScore, rationale], index) =>
      planningPrisma.predictedOutcome.upsert({
        where: { id: `predicted-outcome-${String(index + 1).padStart(2, "0")}` },
        update: { planId, metricName, predictedValue, confidenceScore, rationale },
        create: {
          ...tenant,
          id: `predicted-outcome-${String(index + 1).padStart(2, "0")}`,
          planId,
          metricName,
          predictedValue,
          confidenceScore,
          rationale
        }
      })
    )
  );

  const resourceSeeds = [
    ["Tom Promise", "Founder", 20, "Strategy and publishing", "Protect founder time for authority posts, launch follow-up, and final approvals."],
    ["Content System", "AI-assisted", 40, "Content production", "Drafts, outlines, FAQs, newsletters, scripts, and social repurposing."],
    ["Design System", "AI-assisted", 15, "Graphics and carousel assets", "Pinterest pins, article graphics, proof visuals, and social carousels."]
  ] as const;

  await Promise.all(
    resourceSeeds.map(([owner, role, weeklyHours, focusArea, notes], index) =>
      planningPrisma.resourceCapacity.upsert({
        where: { id: `resource-capacity-${String(index + 1).padStart(2, "0")}` },
        update: { owner, role, weeklyHours, focusArea, notes },
        create: {
          ...tenant,
          id: `resource-capacity-${String(index + 1).padStart(2, "0")}`,
          owner,
          role,
          weeklyHours,
          focusArea,
          notes
        }
      })
    )
  );

  const planEvents = [
    [PlanningEventType.PLAN_CREATED, "Plan", "plan-vpi-authority", "Planning Engine created the VPI authority plan.", EventSeverity.HIGH],
    [PlanningEventType.PLAN_ACTIVATED, "Plan", "plan-vpi-authority", "VPI authority plan activated.", EventSeverity.HIGH],
    [PlanningEventType.PLAN_ITEM_BLOCKED, "PlanItem", "plan-item-10", "Product-page-to-video demo recording is blocked.", EventSeverity.CRITICAL],
    [PlanningEventType.CONSTRAINT_ADDED, "PlanConstraint", "plan-constraint-01", "Product demo readiness constraint added.", EventSeverity.CRITICAL],
    [PlanningEventType.OUTCOME_PREDICTED, "PredictedOutcome", "predicted-outcome-01", "Directory approval outcome predicted.", EventSeverity.MEDIUM],
    [PlanningEventType.CAPABILITY_REGISTERED, "Capability", "planning-engine", "Planning Engine capability registered.", EventSeverity.MEDIUM]
  ] as const;

  await Promise.all(
    planEvents.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `planning-event-${String(index + 1).padStart(2, "0")}` },
        update: { eventType: eventType as any, sourceType, sourceId, title, severity },
        create: {
          ...tenant,
          id: `planning-event-${String(index + 1).padStart(2, "0")}`,
          eventType: eventType as any,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: { capability: "planning-engine" },
          severity,
          status: EventStatus.PROCESSED,
          processedAt: new Date()
        }
      })
    )
  );
}

async function seedEvents() {
  const events = [
    [EventType.OBSERVATION_CREATED, "Observation", "observation-url-product-comments", "Product Hunt comment asked whether VidMaker can turn product pages into ready-to-post videos.", EventSeverity.CRITICAL],
    [EventType.OBSERVATION_CREATED, "Observation", "observation-proof-quality", "LinkedIn proof-quality observation captured.", EventSeverity.HIGH],
    [EventType.OBSERVATION_CREATED, "Observation", "observation-reddit-cleanup", "Reddit manual-cleanup objection captured.", EventSeverity.HIGH],
    [EventType.QUESTION_CREATED, "Question", "question-product-page-to-video", "Product-page-to-video question created from community demand.", EventSeverity.CRITICAL],
    [EventType.QUESTION_CREATED, "Question", "question-video-production-intelligence", "Video Production Intelligence category question created.", EventSeverity.HIGH],
    [EventType.PAIN_POINT_CREATED, "PainPoint", "painpoint-output-coherence-proof", "Output coherence proof pain point created.", EventSeverity.CRITICAL],
    [EventType.PAIN_POINT_CREATED, "PainPoint", "painpoint-template-first-workflow", "Template-first workflow pain point created.", EventSeverity.HIGH],
    [EventType.CONTENT_ASSET_CREATED, "ContentAsset", "content-blog-002", "BLOG-002 content asset created.", EventSeverity.HIGH],
    [EventType.CONTENT_ASSET_CREATED, "ContentAsset", "content-blog-003", "BLOG-003 content asset created.", EventSeverity.HIGH],
    [EventType.CONTENT_ASSET_CREATED, "ContentAsset", "content-blog-004", "BLOG-004 content asset created.", EventSeverity.CRITICAL],
    [EventType.AI_RECOMMENDATION_CREATED, "AIRecommendation", "ai-rec-01", "AI recommendation created for BLOG-004 proof examples.", EventSeverity.CRITICAL],
    [EventType.AI_RECOMMENDATION_CREATED, "AIRecommendation", "ai-rec-08", "AI recommendation created for URL-to-video proof mode.", EventSeverity.HIGH],
    [EventType.EXPERIMENT_STARTED, "Experiment", "experiment-product-page-demo-series", "Product-page-to-video demo experiment started.", EventSeverity.CRITICAL],
    [EventType.EXPERIMENT_STARTED, "Experiment", "experiment-community-reply-sprint", "Community reply experiment queued.", EventSeverity.HIGH],
    [EventType.EXPERIMENT_COMPLETED, "Experiment", "experiment-directory-category-copy", "Directory category copy experiment completed placeholder created.", EventSeverity.MEDIUM],
    [EventType.DIRECTORY_SUBMITTED, "DirectorySubmission", "directory-ai-video-tools", "AI Video Tools directory submission created.", EventSeverity.HIGH],
    [EventType.BACKLINK_LIVE, "Backlink", "backlink-ai-video-tools-directory", "Directory backlink moved into monitoring.", EventSeverity.MEDIUM],
    [EventType.COMPETITOR_MENTIONED, "Competitor", "competitor-synthesia", "Synthesia mentioned in output-coherence complaints.", EventSeverity.HIGH],
    [EventType.HIGH_OPPORTUNITY_DETECTED, "Question", "question-product-page-to-video", "High opportunity detected for product-page-to-video question.", EventSeverity.CRITICAL],
    [EventType.HIGH_OPPORTUNITY_DETECTED, "PainPoint", "painpoint-output-coherence-proof", "High opportunity detected for output coherence pain point.", EventSeverity.CRITICAL]
  ] as const;

  await Promise.all(
    events.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `event-${String(index + 1).padStart(2, "0")}` },
        update: {
          title,
          eventType: eventType as any,
          severity
        },
        create: {
          id: `event-${String(index + 1).padStart(2, "0")}`,
          organizationId: orgId,
          workspaceId,
          eventType,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: {
            sprint: 4,
            generatedBy: "seed",
            sourceType,
            sourceId
          },
          severity,
          status: index < 6 ? EventStatus.PENDING : EventStatus.PROCESSED,
          processedAt: index < 6 ? null : new Date()
        }
      })
    )
  );
}

async function seedRecommendedActions() {
  const synthesia = await prisma.competitor.findUnique({
    where: {
      workspaceId_name: {
        workspaceId,
        name: "Synthesia"
      }
    },
    select: {
      id: true
    }
  });

  const actions = [
    [
      ActionType.CREATE_DEMO,
      "IntelligenceObject",
      "intelligence-product-page-to-video-demo",
      "Create product-page-to-video demo showing a product page URL becoming a ready-to-post video.",
      Priority.CRITICAL,
      ""
    ],
    [ActionType.CREATE_DEMO, "Question", "question-product-page-to-video", "Create a product-page-to-video demo and publish it across LinkedIn, X, Product Hunt update, and blog.", Priority.CRITICAL, "questionId"],
    [ActionType.WRITE_BLOG, "ContentAsset", "content-blog-004", "Publish BLOG-004: What Is Video Production Intelligence?", Priority.CRITICAL, "contentAssetId"],
    [ActionType.ADD_INTERNAL_LINK, "ContentAsset", "content-blog-004", "Add internal links from BLOG-002 and BLOG-003 to BLOG-004.", Priority.HIGH, "contentAssetId"],
    [ActionType.SUBMIT_DIRECTORY, "DirectorySubmission", "directory-ai-video-tools", "Submit VidMaker to Futurepedia and Toolify.", Priority.HIGH, "directorySubmissionId"],
    [ActionType.CREATE_FAQ, "Question", "question-video-production-intelligence", "Create FAQ section explaining Purpose-Specific AI.", Priority.HIGH, "questionId"],
    [ActionType.CREATE_X_THREAD, "Question", "question-product-page-to-video", "Turn the product-page-to-video workflow into a short X thread.", Priority.HIGH, "questionId"],
    [ActionType.CREATE_FOUNDER_POST, "Insight", "insight-url-to-video-trust", "Publish founder post on why URL-to-video needs proof, not prompts.", Priority.HIGH, ""],
    [ActionType.CREATE_COMPANY_POST, "Campaign", "campaign-product-page-to-video-proof", "Announce the Product Page to Video Proof Sprint on LinkedIn.", Priority.HIGH, ""],
    [ActionType.CREATE_PINTEREST_PIN, "ContentAsset", "content-blog-004", "Create a Pinterest visual for product-page-to-video use cases.", Priority.MEDIUM, "contentAssetId"],
    [ActionType.REACH_OUT_FOR_BACKLINK, "Backlink", "backlink-ai-video-tools-directory", "Follow up on AI Video Tools backlink approval.", Priority.HIGH, "backlinkId"],
    [ActionType.REPLY_TO_COMMUNITY, "Observation", "observation-url-product-comments", "Reply to Product Hunt comments with the strongest demo example.", Priority.CRITICAL, "observationId"],
    [ActionType.CREATE_EXPERIMENT, "Hypothesis", "hypothesis-product-page-demo-trust", "Create experiment from product-page demo trust hypothesis.", Priority.CRITICAL, ""],
    [ActionType.UPDATE_LANDING_PAGE, "Entity", "entity-product-page-to-video", "Update product-page-to-video landing page with source-to-output proof.", Priority.HIGH, ""],
    [ActionType.REVIEW_COMPETITOR, "Competitor", "competitor-synthesia", "Review Synthesia complaints around output coherence.", Priority.HIGH, "competitorId"],
    [ActionType.FOLLOW_UP, "Experiment", "experiment-product-page-demo-series", "Check first week signal from demo distribution experiment.", Priority.HIGH, "experimentId"],
    [ActionType.WRITE_BLOG, "Question", "question-purpose-specific-ai", "Draft Purpose-Specific AI comparison article.", Priority.HIGH, "questionId"],
    [ActionType.ADD_INTERNAL_LINK, "ContentAsset", "content-blog-002", "Link BLOG-002 to Product Page to Video and Purpose Engines entities.", Priority.MEDIUM, "contentAssetId"],
    [ActionType.REPLY_TO_COMMUNITY, "PainPoint", "painpoint-output-coherence-proof", "Answer community objections about coherent output quality.", Priority.CRITICAL, "painPointId"],
    [ActionType.REACH_OUT_FOR_BACKLINK, "ContentAsset", "content-blog-002", "Pitch Video Production Intelligence definition to AI workflow newsletters.", Priority.HIGH, "contentAssetId"],
    [ActionType.FOLLOW_UP, "AIRecommendation", "ai-rec-08", "Convert proof-mode AI recommendation into product task.", Priority.HIGH, "aiRecommendationId"]
  ] as const;

  await Promise.all(
    actions.map(
      ([actionType, sourceType, sourceId, title, priority, relationField], index) => {
        const relationSourceId = relationField === "competitorId" ? synthesia?.id : sourceId;
        const relation =
          relationField.length > 0 && relationSourceId
            ? {
                [relationField]: relationSourceId
              }
            : {};

        return prisma.recommendedAction.upsert({
          where: { id: `action-${String(index + 1).padStart(2, "0")}` },
          update: {
            ...relation,
            title,
            actionType,
            priority
          },
          create: {
            ...relation,
            id: `action-${String(index + 1).padStart(2, "0")}`,
            organizationId: orgId,
            workspaceId,
            title,
            description: title,
            sourceType,
            sourceId,
            actionType,
            priority,
            status: index < 12 ? ActionStatus.PENDING : ActionStatus.IN_PROGRESS,
            dueDate: dateFromNow((index % 7) + 1),
            owner: index % 3 === 0 ? "Growth" : index % 3 === 1 ? "Content" : "Authority",
            reasoning:
              "VGOS detected this as a high-value next move from opportunity scores, events, and intelligence graph context.",
            expectedImpact:
              "Improves VidMaker proof, authority, answer coverage, community engagement, or experiment velocity."
          } as any
        });
      }
    )
  );
}

async function seedExecutionEngine() {
  const executionPrisma = prisma as PrismaClient & Record<
    | "executionItem"
    | "executionEvidence"
    | "executionBlocker"
    | "approvalRequest"
    | "executionResult",
    { upsert: (args: any) => Promise<unknown> }
  >;

  const executionItemSeeds = [
    ["execution-blog-004-publish", "Publish BLOG-004: What Is Video Production Intelligence?", ExecutionType.BLOG_PUBLISH, ExecutionStatus.NEEDS_APPROVAL, Priority.CRITICAL, "Content", "plan-blog-004-010-content", "plan-item-25", "action-03", "ContentAsset", "content-blog-004", "objective-aeo-geo"],
    ["execution-blog-004-internal-links", "Add internal links from BLOG-002 and BLOG-003 to BLOG-004", ExecutionType.INTERNAL_LINK_UPDATE, ExecutionStatus.READY, Priority.HIGH, "SEO Strategy", "plan-vpi-authority", "plan-item-05", "action-04", "ContentAsset", "content-blog-004", "objective-own-vpi"],
    ["execution-product-page-demo", "Create product-page-to-video demo", ExecutionType.DEMO_CREATION, ExecutionStatus.BLOCKED, Priority.CRITICAL, "Growth", "plan-product-hunt-follow-up", "plan-item-10", "action-02", "Question", "question-product-page-to-video", "objective-product-hunt"],
    ["execution-futurepedia-submit", "Submit VidMaker to Futurepedia", ExecutionType.DIRECTORY_SUBMISSION, ExecutionStatus.READY, Priority.HIGH, "Authority", "plan-directory-submission", "plan-item-18", "action-05", "DirectorySubmission", "directory-ai-video-tools", "objective-authority"],
    ["execution-toolify-submit", "Submit VidMaker to Toolify", ExecutionType.DIRECTORY_SUBMISSION, ExecutionStatus.QUEUED, Priority.HIGH, "Authority", "plan-directory-submission", "plan-item-19", "action-05", "DirectorySubmission", "directory-ai-video-tools", "objective-authority"],
    ["execution-founder-boundaries", "Publish founder post about automation boundaries", ExecutionType.FOUNDER_POST, ExecutionStatus.NEEDS_APPROVAL, Priority.HIGH, "Tom Promise", "plan-vpi-authority", "plan-item-01", "action-08", "Insight", "insight-url-to-video-trust", "objective-own-vpi"],
    ["execution-pinterest-blog-004", "Publish Pinterest Pin for BLOG-004", ExecutionType.PINTEREST_PIN, ExecutionStatus.BLOCKED, Priority.MEDIUM, "Design System", "plan-product-hunt-follow-up", "plan-item-12", "action-10", "ContentAsset", "content-blog-004", "objective-product-hunt"],
    ["execution-product-hunt-reply", "Reply to Product Hunt comment asking for product-page demo", ExecutionType.COMMUNITY_REPLY, ExecutionStatus.READY, Priority.CRITICAL, "Community Intelligence", "plan-product-hunt-follow-up", "plan-item-15", "action-12", "Observation", "observation-url-product-comments", "objective-product-hunt"],
    ["execution-purpose-specific-faq", "Create FAQ for Purpose-Specific AI", ExecutionType.FAQ_UPDATE, ExecutionStatus.READY, Priority.HIGH, "Search Strategy", "plan-aeo-geo-visibility", "plan-item-35", "action-06", "Question", "question-purpose-specific-ai", "objective-aeo-geo"],
    ["execution-vpi-landing-section", "Update VidMaker landing page with Video Production Intelligence section", ExecutionType.LANDING_PAGE_UPDATE, ExecutionStatus.BLOCKED, Priority.HIGH, "Growth", "plan-vpi-authority", "plan-item-06", "action-14", "Entity", "entity-video-production-intelligence", "objective-own-vpi"],
    ["execution-ph-proof-screenshot", "Add Product Hunt launch proof screenshot", ExecutionType.MANUAL_ACTION, ExecutionStatus.READY, Priority.HIGH, "Community Intelligence", "plan-product-hunt-follow-up", "plan-item-15", "action-12", "Observation", "observation-product-hunt-comments", "objective-product-hunt"],
    ["execution-directory-copy-bank", "Create directory submission copy bank", ExecutionType.DIRECTORY_SUBMISSION, ExecutionStatus.COMPLETED, Priority.HIGH, "Authority", "plan-directory-submission", "plan-item-17", "action-05", "DirectorySubmission", "directory-ai-video-tools", "objective-authority"],
    ["execution-company-linkedin-blog-004", "Publish company LinkedIn post for BLOG-004", ExecutionType.COMPANY_POST, ExecutionStatus.NEEDS_APPROVAL, Priority.HIGH, "Content", "plan-blog-004-010-content", "plan-item-25", "action-09", "Campaign", "campaign-product-page-to-video-proof", "objective-aeo-geo"],
    ["execution-x-thread-blog-004", "Create X thread from BLOG-004", ExecutionType.X_THREAD, ExecutionStatus.QUEUED, Priority.HIGH, "Content", "plan-product-hunt-follow-up", "plan-item-16", "action-07", "ContentAsset", "content-blog-004", "objective-product-hunt"],
    ["execution-4k-proof-asset", "Create demo proof asset for 4K quality", ExecutionType.DEMO_CREATION, ExecutionStatus.BLOCKED, Priority.HIGH, "Growth", "plan-product-hunt-follow-up", "plan-item-10", "action-21", "AIRecommendation", "ai-rec-08", "objective-demo-assets"],
    ["execution-blog-005-outline", "Outline BLOG-005 competitor cleanup article", ExecutionType.BLOG_PUBLISH, ExecutionStatus.QUEUED, Priority.HIGH, "Content", "plan-blog-004-010-content", "plan-item-26", "action-17", "Pattern", "pattern-02", "objective-aeo-geo"],
    ["execution-vpi-newsletter", "Send newsletter section on Video Production Intelligence", ExecutionType.NEWSLETTER_SEND, ExecutionStatus.QUEUED, Priority.MEDIUM, "Content", "plan-vpi-authority", "plan-item-08", "action-18", "ContentAsset", "content-blog-002", "objective-own-vpi"],
    ["execution-vpi-faq", "Answer VPI FAQ", ExecutionType.FAQ_UPDATE, ExecutionStatus.READY, Priority.HIGH, "Search Strategy", "plan-aeo-geo-visibility", "plan-item-34", "action-06", "Question", "question-video-production-intelligence", "objective-aeo-geo"],
    ["execution-product-page-entity", "Update Product Page to Video entity page", ExecutionType.LANDING_PAGE_UPDATE, ExecutionStatus.QUEUED, Priority.HIGH, "Search Strategy", "plan-aeo-geo-visibility", "plan-item-38", "action-14", "Entity", "entity-product-page-to-video", "objective-aeo-geo"],
    ["execution-purpose-engines-company-post", "Create company post on Purpose Engines", ExecutionType.COMPANY_POST, ExecutionStatus.QUEUED, Priority.MEDIUM, "Content", "plan-aeo-geo-visibility", "plan-item-39", "action-09", "Entity", "entity-purpose-engines", "objective-aeo-geo"],
    ["execution-faq-youtube-script", "Create YouTube script from FAQ set", ExecutionType.YOUTUBE_SCRIPT, ExecutionStatus.QUEUED, Priority.MEDIUM, "Content", "plan-aeo-geo-visibility", "plan-item-39", "action-06", "Question", "question-video-production-intelligence", "objective-aeo-geo"],
    ["execution-answer-coverage-experiment", "Run answer coverage experiment", ExecutionType.EXPERIMENT_RUN, ExecutionStatus.READY, Priority.HIGH, "Search Strategy", "plan-aeo-geo-visibility", "plan-item-40", "action-13", "Objective", "objective-aeo-geo", "objective-aeo-geo"],
    ["execution-ai-video-tools-backlink", "Follow up on AI Video Tools backlink", ExecutionType.BACKLINK_OUTREACH, ExecutionStatus.READY, Priority.HIGH, "Authority", "plan-directory-submission", "plan-item-21", "action-11", "Backlink", "backlink-ai-video-tools-directory", "objective-authority"],
    ["execution-pinterest-proof-pin-2", "Create Pinterest proof pin 2", ExecutionType.PINTEREST_PIN, ExecutionStatus.QUEUED, Priority.MEDIUM, "Design System", "plan-product-hunt-follow-up", "plan-item-13", "action-10", "ContentAsset", "content-blog-004", "objective-product-hunt"],
    ["execution-founder-vpi-post", "Publish founder authority post on Video Production Intelligence", ExecutionType.FOUNDER_POST, ExecutionStatus.IN_PROGRESS, Priority.HIGH, "Tom Promise", "plan-vpi-authority", "plan-item-02", "action-08", "RecommendedAction", "kernel-action-11", "objective-own-vpi"]
  ] as const;
  const executionStartedStatuses = [
    ExecutionStatus.IN_PROGRESS,
    ExecutionStatus.BLOCKED,
    ExecutionStatus.NEEDS_APPROVAL
  ] as readonly string[];

  await Promise.all(
    executionItemSeeds.map(([id, title, executionType, status, priority, owner, planId, planItemId, recommendedActionId, sourceType, sourceId, objectiveId], index) =>
      executionPrisma.executionItem.upsert({
        where: { id },
        update: {
          title,
          executionType,
          status,
          priority,
          owner,
          sourceType,
          sourceId,
          planId,
          planItemId,
          recommendedActionId,
          objectiveId,
          dueDate: dateFromNow((index % 9) + 1),
          startedAt: executionStartedStatuses.includes(status) ? dateFromNow(-((index % 4) + 1)) : null,
          completedAt: status === ExecutionStatus.COMPLETED ? dateFromNow(-1) : null
        },
        create: {
          ...tenant,
          id,
          title,
          description: `${title} for VidMaker execution tracking.`,
          executionType,
          status,
          priority,
          owner,
          dueDate: dateFromNow((index % 9) + 1),
          startedAt: executionStartedStatuses.includes(status) ? dateFromNow(-((index % 4) + 1)) : null,
          completedAt: status === ExecutionStatus.COMPLETED ? dateFromNow(-1) : null,
          sourceType,
          sourceId,
          planId,
          planItemId,
          recommendedActionId,
          objectiveId,
          expectedImpact: "Move a planned VidMaker growth action into shipped proof, authority, distribution, or learning.",
          actualImpact: status === ExecutionStatus.COMPLETED ? "Execution completed and learning captured." : "",
          notes: ""
        } as any
      })
    )
  );

  const evidenceSeeds = [
    ["execution-blog-004-publish", "BLOG-004 draft note", EvidenceType.NOTE, "", "Draft includes Video Production Intelligence positioning and proof placeholders."],
    ["execution-product-page-demo", "Product-page-to-video demo placeholder", EvidenceType.DEMO_ASSET, "https://vidmaker.com/product-page-to-video", "Placeholder URL for product-page-to-video proof asset."],
    ["execution-product-hunt-reply", "Product Hunt URL", EvidenceType.URL, "https://www.producthunt.com", "Source thread for launch comments and demo requests."],
    ["execution-company-linkedin-blog-004", "LinkedIn launch post URL", EvidenceType.SOCIAL_POST, "https://www.linkedin.com/company/vidmaker", "Placeholder for LinkedIn company post proof."],
    ["execution-futurepedia-submit", "Futurepedia submission placeholder", EvidenceType.DIRECTORY_CONFIRMATION, "https://www.futurepedia.io", "Directory submission confirmation placeholder."],
    ["execution-toolify-submit", "Toolify submission placeholder", EvidenceType.DIRECTORY_CONFIRMATION, "https://www.toolify.ai", "Directory submission confirmation placeholder."],
    ["execution-blog-004-internal-links", "Internal link completion note", EvidenceType.NOTE, "", "BLOG-002 and BLOG-003 internal link targets identified."],
    ["execution-pinterest-blog-004", "Pinterest image brief", EvidenceType.FILE, "", "Image requirements captured for BLOG-004 pin."],
    ["execution-ph-proof-screenshot", "Product Hunt proof screenshot placeholder", EvidenceType.SCREENSHOT, "", "Screenshot slot for launch proof."],
    ["execution-directory-copy-bank", "Directory copy bank note", EvidenceType.NOTE, "", "Copy bank emphasizes VPI and product-page-to-video proof."],
    ["execution-x-thread-blog-004", "X thread draft note", EvidenceType.NOTE, "", "Thread structure drafted from BLOG-004 outline."],
    ["execution-4k-proof-asset", "4K proof requirement", EvidenceType.NOTE, "", "Proof example must show quality and control."],
    ["execution-vpi-faq", "FAQ answer draft", EvidenceType.NOTE, "", "Draft answer defines Video Production Intelligence."],
    ["execution-ai-video-tools-backlink", "AI Video Tools backlink monitor", EvidenceType.BACKLINK_LIVE, "https://example.com/ai-video-tools", "Backlink monitoring placeholder."],
    ["execution-answer-coverage-experiment", "Answer coverage metric baseline", EvidenceType.METRIC, "", "Baseline answer coverage score captured before experiment."]
  ] as const;

  await Promise.all(
    evidenceSeeds.map(([executionItemId, title, evidenceType, url, description], index) =>
      executionPrisma.executionEvidence.upsert({
        where: { id: `execution-evidence-${String(index + 1).padStart(2, "0")}` },
        update: { executionItemId, title, evidenceType, url: url || null, description },
        create: {
          ...tenant,
          id: `execution-evidence-${String(index + 1).padStart(2, "0")}`,
          executionItemId,
          evidenceType,
          title,
          url: url || null,
          description,
          uploadedAssetUrl: null,
          capturedAt: dateFromNow(-(index % 5))
        } as any
      })
    )
  );

  const blockerSeeds = [
    ["execution-product-page-demo", "Product-page demo graphic not ready", BlockerType.MISSING_GRAPHIC, ConstraintSeverity.CRITICAL, "Design System"],
    ["execution-directory-copy-bank", "Directory copy needs review", BlockerType.NEEDS_REVIEW, ConstraintSeverity.HIGH, "Authority"],
    ["execution-blog-004-publish", "BLOG-004 needs final CTA", BlockerType.MISSING_CONTENT, ConstraintSeverity.HIGH, "Content"],
    ["execution-pinterest-blog-004", "Pinterest image needed", BlockerType.MISSING_GRAPHIC, ConstraintSeverity.MEDIUM, "Design System"],
    ["execution-product-hunt-reply", "Product Hunt comment response pending", BlockerType.NEEDS_REVIEW, ConstraintSeverity.HIGH, "Community Intelligence"],
    ["execution-vpi-landing-section", "Landing page proof section needs design", BlockerType.MISSING_GRAPHIC, ConstraintSeverity.HIGH, "Growth"],
    ["execution-4k-proof-asset", "4K proof example needed", BlockerType.MISSING_CONTENT, ConstraintSeverity.HIGH, "Growth"],
    ["execution-founder-boundaries", "Founder post needs final review", BlockerType.MISSING_APPROVAL, ConstraintSeverity.HIGH, "Tom Promise"]
  ] as const;

  await Promise.all(
    blockerSeeds.map(([executionItemId, title, blockerType, severity, owner], index) =>
      executionPrisma.executionBlocker.upsert({
        where: { id: `execution-blocker-${String(index + 1).padStart(2, "0")}` },
        update: { executionItemId, title, blockerType, severity, owner },
        create: {
          ...tenant,
          id: `execution-blocker-${String(index + 1).padStart(2, "0")}`,
          executionItemId,
          title,
          description: `${title} before this execution can be completed.`,
          blockerType,
          severity,
          status: index === 1 ? BlockerStatus.IN_REVIEW : BlockerStatus.OPEN,
          owner,
          resolvedAt: null
        } as any
      })
    )
  );

  const approvalSeeds = [
    ["execution-blog-004-publish", "Founder approval for BLOG-004", ApprovalType.FOUNDER_APPROVAL, ApprovalStatus.REQUESTED, "Content", "Tom Promise"],
    ["execution-product-page-demo", "Brand approval for product-page demo", ApprovalType.BRAND_APPROVAL, ApprovalStatus.CHANGES_REQUESTED, "Growth", "Brand"],
    ["execution-blog-004-internal-links", "SEO approval for internal links", ApprovalType.SEO_APPROVAL, ApprovalStatus.REQUESTED, "SEO Strategy", "SEO Lead"],
    ["execution-company-linkedin-blog-004", "Publishing approval for LinkedIn company post", ApprovalType.PUBLISHING_APPROVAL, ApprovalStatus.REQUESTED, "Content", "Growth"],
    ["execution-product-page-demo", "Product approval for URL-to-video proof messaging", ApprovalType.PRODUCT_APPROVAL, ApprovalStatus.REQUESTED, "Growth", "Product"],
    ["execution-founder-boundaries", "Founder post final approval", ApprovalType.FOUNDER_APPROVAL, ApprovalStatus.REQUESTED, "Content", "Tom Promise"],
    ["execution-vpi-landing-section", "Brand approval for VPI landing section", ApprovalType.BRAND_APPROVAL, ApprovalStatus.REQUESTED, "Growth", "Brand"],
    ["execution-purpose-specific-faq", "Content approval for Purpose-Specific AI FAQ", ApprovalType.CONTENT_APPROVAL, ApprovalStatus.APPROVED, "Search Strategy", "Content"]
  ] as const;

  await Promise.all(
    approvalSeeds.map(([executionItemId, title, approvalType, status, requestedBy, reviewer], index) =>
      executionPrisma.approvalRequest.upsert({
        where: { id: `approval-request-${String(index + 1).padStart(2, "0")}` },
        update: { executionItemId, title, approvalType, status, requestedBy, reviewer },
        create: {
          ...tenant,
          id: `approval-request-${String(index + 1).padStart(2, "0")}`,
          executionItemId,
          title,
          description: `${title} is required before publication or distribution.`,
          approvalType,
          status,
          requestedBy,
          reviewer,
          requestedAt: dateFromNow(-((index % 4) + 1)),
          reviewedAt: status === ApprovalStatus.APPROVED || status === ApprovalStatus.CHANGES_REQUESTED ? dateFromNow(-(index % 2)) : null,
          decisionNotes: status === ApprovalStatus.CHANGES_REQUESTED ? "Clarify proof claim before publishing." : null
        } as any
      })
    )
  );

  const resultSeeds = [
    ["execution-company-linkedin-blog-004", ExecutionResultType.COMPLETED, "LinkedIn carousel published", "engagement_rate", 0, 0, 72, "LinkedIn proof-led posts should include source-to-output visuals."],
    ["execution-product-hunt-reply", ExecutionResultType.COMPLETED, "Product Hunt launch announcement published", "comment_replies", 0, 3, 78, "Community replies perform better when linked to a concrete demo."],
    ["execution-x-thread-blog-004", ExecutionResultType.LEARNING_CAPTURED, "Company X account created", "followers", 0, 12, 55, "X should be used for demo-thread distribution after proof assets are ready."],
    ["execution-blog-004-internal-links", ExecutionResultType.COMPLETED, "BLOG-003 published and linked into the VPI cluster", "internal_links", 0, 4, 80, "Cluster linking strengthens VPI category ownership."],
    ["execution-futurepedia-submit", ExecutionResultType.FOLLOW_UP_REQUIRED, "Directory submission wave pending", "submissions", 0, 2, 65, "Directory submissions need review-ready copy bank before batching."]
  ] as const;

  await Promise.all(
    resultSeeds.map(([executionItemId, resultType, summary, metricName, metricBefore, metricAfter, impactScore, learning], index) =>
      executionPrisma.executionResult.upsert({
        where: { id: `execution-result-${String(index + 1).padStart(2, "0")}` },
        update: { executionItemId, resultType, summary, metricName, metricBefore, metricAfter, impactScore, learning },
        create: {
          ...tenant,
          id: `execution-result-${String(index + 1).padStart(2, "0")}`,
          executionItemId,
          resultType,
          summary,
          metricName,
          metricBefore,
          metricAfter,
          impactScore,
          learning
        } as any
      })
    )
  );

  const executionEvents = [
    [ExecutionEventType.EXECUTION_STARTED, "ExecutionItem", "execution-founder-vpi-post", "Founder VPI post execution started.", EventSeverity.HIGH],
    [ExecutionEventType.EXECUTION_BLOCKED, "ExecutionItem", "execution-product-page-demo", "Product-page demo execution is blocked.", EventSeverity.CRITICAL],
    [ExecutionEventType.APPROVAL_REQUESTED, "ApprovalRequest", "approval-request-01", "Founder approval requested for BLOG-004.", EventSeverity.HIGH],
    [ExecutionEventType.EVIDENCE_ADDED, "ExecutionEvidence", "execution-evidence-03", "Product Hunt URL evidence added.", EventSeverity.MEDIUM],
    [ExecutionEventType.EXECUTION_RESULT_CREATED, "ExecutionResult", "execution-result-01", "Execution result created for LinkedIn carousel.", EventSeverity.MEDIUM]
  ] as const;

  await Promise.all(
    executionEvents.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `execution-event-${String(index + 1).padStart(2, "0")}` },
        update: { eventType: eventType as any, sourceType, sourceId, title, severity },
        create: {
          ...tenant,
          id: `execution-event-${String(index + 1).padStart(2, "0")}`,
          eventType: eventType as any,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: { capability: "execution-engine" },
          severity,
          status: EventStatus.PROCESSED,
          processedAt: new Date()
        }
      })
    )
  );
}

async function seedMeasurementLearningEngine() {
  const measurementPrisma = prisma as PrismaClient & Record<
    "metric" | "measurement" | "learning" | "attribution" | "strategyAdjustment",
    { upsert: (args: any) => Promise<unknown> }
  >;

  const metricSeeds = [
    ["metric-organic-traffic", "Organic traffic", "Sessions from organic search to VidMaker owned pages.", MetricType.TRAFFIC, "Search Console", "sessions", 1480, 1325, 2200, MetricStatus.IMPROVING, "SEO Strategy"],
    ["metric-search-impressions", "Search impressions", "Total search impressions for VidMaker growth and product pages.", MetricType.SEARCH_IMPRESSIONS, "Search Console", "impressions", 41200, 36800, 60000, MetricStatus.IMPROVING, "SEO Strategy"],
    ["metric-search-clicks", "Search clicks", "Search clicks from target queries and entity pages.", MetricType.SEARCH_CLICKS, "Search Console", "clicks", 910, 820, 1600, MetricStatus.IMPROVING, "SEO Strategy"],
    ["metric-product-hunt-referrals", "Product Hunt referrals", "Referral sessions from Product Hunt launch and follow-up work.", MetricType.TRAFFIC, "Analytics", "sessions", 264, 98, 500, MetricStatus.IMPROVING, "Community Intelligence"],
    ["metric-linkedin-impressions", "LinkedIn impressions", "Impressions from founder and company LinkedIn posts.", MetricType.SOCIAL_IMPRESSIONS, "LinkedIn", "impressions", 18400, 9100, 25000, MetricStatus.IMPROVING, "Content"],
    ["metric-x-impressions", "X impressions", "Impressions from X launch announcements and threads.", MetricType.SOCIAL_IMPRESSIONS, "X", "impressions", 4200, 900, 12000, MetricStatus.WATCH, "Content"],
    ["metric-pinterest-impressions", "Pinterest impressions", "Impressions from Pinterest proof pins and article pins.", MetricType.SOCIAL_IMPRESSIONS, "Pinterest", "impressions", 1300, 420, 5000, MetricStatus.WATCH, "Design System"],
    ["metric-backlinks", "Backlinks", "Live backlinks from directories, newsletters, and authority outreach.", MetricType.BACKLINKS, "Authority Tracker", "links", 7, 4, 25, MetricStatus.IMPROVING, "Authority"],
    ["metric-referring-domains", "Referring domains", "Unique referring domains pointing to VidMaker.", MetricType.REFERRING_DOMAINS, "Authority Tracker", "domains", 5, 3, 18, MetricStatus.IMPROVING, "Authority"],
    ["metric-directory-submissions", "Directory submissions", "Submitted directory listings for VidMaker.", MetricType.DIRECTORY_APPROVALS, "Directory Tracker", "submissions", 12, 3, 25, MetricStatus.IMPROVING, "Authority"],
    ["metric-directory-approvals", "Directory approvals", "Approved directory listings that can produce authority signals.", MetricType.DIRECTORY_APPROVALS, "Directory Tracker", "approvals", 2, 0, 10, MetricStatus.WATCH, "Authority"],
    ["metric-blog-posts-published", "Blog posts published", "Published blog and FAQ assets from the content engine.", MetricType.CONTENT_PUBLISHED, "Content Engine", "posts", 4, 2, 10, MetricStatus.IMPROVING, "Content"],
    ["metric-community-replies", "Community replies", "Helpful replies shipped to Product Hunt, Reddit, LinkedIn, X, and forums.", MetricType.COMMUNITY_REPLIES, "Community Intelligence", "replies", 18, 6, 40, MetricStatus.IMPROVING, "Community Intelligence"],
    ["metric-qualified-signups", "Qualified signups", "Signups with commercial or product workflow intent.", MetricType.SIGNUPS, "Analytics", "signups", 31, 18, 75, MetricStatus.IMPROVING, "Growth"],
    ["metric-ai-mentions", "AI mentions", "Answer-engine and AI surface mentions of VidMaker and Video Production Intelligence.", MetricType.AI_MENTIONS, "AEO/GEO Tracker", "mentions", 9, 4, 30, MetricStatus.WATCH, "Search Strategy"]
  ] as const;

  await Promise.all(
    metricSeeds.map(([id, name, description, metricType, source, unit, currentValue, previousValue, targetValue, status, owner]) =>
      measurementPrisma.metric.upsert({
        where: { id },
        update: {
          name,
          description,
          metricType,
          source,
          unit,
          currentValue,
          previousValue,
          targetValue,
          status,
          owner
        },
        create: {
          ...tenant,
          id,
          name,
          description,
          metricType,
          source,
          unit,
          currentValue,
          previousValue,
          targetValue,
          status,
          owner
        } as any
      })
    )
  );

  const measurementSeeds = [
    ["metric-search-impressions", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "execution-result-01", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 41200, 36800, "BLOG-004 category definition lifted impressions."],
    ["metric-search-clicks", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "execution-result-02", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 910, 820, "Search clicks improved after category article updates."],
    ["metric-blog-posts-published", "ContentAsset", "content-blog-004", "execution-blog-004-publish", "execution-result-03", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 4, 3, "BLOG-004 moved content output forward."],
    ["metric-linkedin-impressions", "Campaign", "campaign-product-page-to-video-proof", "execution-company-linkedin-blog-004", "execution-result-04", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 18400, 9100, "LinkedIn carousel outperformed plain company post."],
    ["metric-product-hunt-referrals", "Observation", "observation-product-hunt-comments", "execution-product-hunt-reply", "execution-result-05", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 264, 98, "Product Hunt follow-up produced qualified referral traffic."],
    ["metric-community-replies", "Observation", "observation-url-product-comments", "execution-product-hunt-reply", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 18, 6, "Community replies increased conversation quality."],
    ["metric-qualified-signups", "Campaign", "campaign-product-page-to-video-proof", "execution-product-hunt-reply", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 31, 18, "Demo-linked replies produced higher-intent signups."],
    ["metric-x-impressions", "ContentAsset", "content-blog-004", "execution-x-thread-blog-004", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 4200, 900, "X launch announcement created early distribution."],
    ["metric-pinterest-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-blog-004", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 1300, 420, "Pinterest pin drafts need stronger proof visuals."],
    ["metric-directory-submissions", "DirectorySubmission", "directory-ai-video-tools", "execution-futurepedia-submit", "", "plan-directory-submission", "objective-authority", "", 12, 3, "Directory submission volume increased after copy bank."],
    ["metric-directory-approvals", "DirectorySubmission", "directory-ai-video-tools", "execution-futurepedia-submit", "", "plan-directory-submission", "objective-authority", "", 2, 0, "Approvals lag submission volume."],
    ["metric-backlinks", "Backlink", "backlink-ai-video-tools-directory", "execution-ai-video-tools-backlink", "", "plan-directory-submission", "objective-authority", "", 7, 4, "Backlink count is improving but slower than predicted."],
    ["metric-referring-domains", "Backlink", "backlink-ai-video-tools-directory", "execution-ai-video-tools-backlink", "", "plan-directory-submission", "objective-authority", "", 5, 3, "Directory work added referring-domain diversity."],
    ["metric-ai-mentions", "Entity", "entity-video-production-intelligence", "execution-vpi-landing-section", "", "plan-vpi-authority", "objective-own-vpi", "", 9, 4, "Entity clarity improved answer-engine mentions."],
    ["metric-organic-traffic", "ContentAsset", "content-blog-002", "execution-vpi-newsletter", "", "plan-vpi-authority", "objective-own-vpi", "", 1480, 1325, "VPI cluster is lifting organic traffic."],
    ["metric-search-impressions", "Question", "question-video-production-intelligence", "execution-vpi-faq", "", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 41200, 37100, "FAQ coverage supports answer-ready visibility."],
    ["metric-ai-mentions", "Question", "question-purpose-specific-ai", "execution-purpose-specific-faq", "", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 9, 5, "Purpose-Specific AI FAQ improved entity language."],
    ["metric-linkedin-impressions", "Insight", "insight-url-to-video-trust", "execution-founder-boundaries", "", "plan-vpi-authority", "objective-own-vpi", "", 18400, 11200, "Founder framing attracts stronger qualitative comments."],
    ["metric-linkedin-impressions", "Campaign", "campaign-product-page-to-video-proof", "execution-company-linkedin-blog-004", "", "plan-blog-004-010-content", "objective-aeo-geo", "campaign-product-page-to-video-proof", 18400, 12600, "LinkedIn engagement signal is tracked through launch post reach for now."],
    ["metric-community-replies", "PainPoint", "painpoint-output-coherence-proof", "execution-4k-proof-asset", "", "plan-product-hunt-follow-up", "objective-demo-assets", "", 18, 10, "4K proof comments show skepticism needs evidence."],
    ["metric-qualified-signups", "Question", "question-product-page-to-video", "execution-product-page-demo", "", "plan-product-hunt-follow-up", "objective-demo-assets", "campaign-product-page-to-video-proof", 31, 20, "Product-page demo intent remains commercial."],
    ["metric-search-clicks", "Entity", "entity-product-page-to-video", "execution-product-page-entity", "", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 910, 840, "Product Page to Video entity page improved clicks."],
    ["metric-blog-posts-published", "Question", "question-purpose-specific-ai", "execution-blog-005-outline", "", "plan-blog-004-010-content", "objective-aeo-geo", "", 4, 3, "BLOG-005 outline supports the authority cluster."],
    ["metric-directory-submissions", "DirectorySubmission", "directory-ai-video-tools", "execution-toolify-submit", "", "plan-directory-submission", "objective-authority", "", 12, 8, "Toolify submission increased directory coverage."],
    ["metric-backlinks", "DirectorySubmission", "directory-ai-video-tools", "execution-directory-copy-bank", "", "plan-directory-submission", "objective-authority", "", 7, 4, "Copy bank should improve backlink conversion."],
    ["metric-x-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-proof-pin-2", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 4200, 2100, "Cross-channel repurposing is increasing reach."],
    ["metric-pinterest-impressions", "ContentAsset", "content-blog-004", "execution-pinterest-proof-pin-2", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 1300, 700, "Second proof pin improved Pinterest visibility."],
    ["metric-ai-mentions", "Entity", "entity-purpose-engines", "execution-purpose-engines-company-post", "", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 9, 6, "Purpose Engines language should be reinforced."],
    ["metric-search-impressions", "Experiment", "experiment-product-page-demo-series", "execution-answer-coverage-experiment", "", "plan-aeo-geo-visibility", "objective-aeo-geo", "", 41200, 38800, "Answer coverage experiment improved impressions modestly."],
    ["metric-qualified-signups", "Experiment", "experiment-product-page-demo-series", "execution-answer-coverage-experiment", "", "plan-product-hunt-follow-up", "objective-product-hunt", "campaign-product-page-to-video-proof", 31, 24, "Demo-led answer coverage improved signup quality."]
  ] as const;

  await Promise.all(
    measurementSeeds.map(([metricId, sourceType, sourceId, executionItemId, executionResultId, planId, objectiveId, campaignId, value, previousValue, notes], index) => {
      const changeValue = Number(value) - Number(previousValue);
      const changePercent = Number(previousValue) === 0 ? null : Math.round((changeValue / Number(previousValue)) * 10000) / 100;
      return measurementPrisma.measurement.upsert({
        where: { id: `measurement-${String(index + 1).padStart(2, "0")}` },
        update: {
          metricId,
          sourceType,
          sourceId,
          executionItemId,
          executionResultId: executionResultId || null,
          planId,
          objectiveId,
          campaignId: campaignId || null,
          value,
          previousValue,
          changeValue,
          changePercent,
          notes
        },
        create: {
          ...tenant,
          id: `measurement-${String(index + 1).padStart(2, "0")}`,
          metricId,
          sourceType,
          sourceId,
          executionItemId,
          executionResultId: executionResultId || null,
          planId,
          objectiveId,
          campaignId: campaignId || null,
          measuredAt: dateFromNow(-(index % 10)),
          value,
          previousValue,
          changeValue,
          changePercent,
          notes
        } as any
      });
    })
  );

  const learningSeeds = [
    ["Launch carousel beat text-only company post", "Launch carousel generated stronger LinkedIn engagement than a text-only company post.", LearningType.CHANNEL_PERFORMANCE, 0.89, "Measurement", "measurement-04", "metric-linkedin-impressions", "execution-company-linkedin-blog-004", "plan-blog-004-010-content", "objective-aeo-geo", "Prioritize proof-led carousel formats for launch and category posts.", true],
    ["Product-page-to-video is commercial intent", "Product-page-to-video questions indicate high commercial investigation intent.", LearningType.CUSTOMER_LANGUAGE, 0.93, "Question", "question-product-page-to-video", "metric-qualified-signups", "execution-product-page-demo", "plan-product-hunt-follow-up", "objective-demo-assets", "Future recommendations should treat product-page-to-video as BOFU proof demand.", true],
    ["Directory approvals lag submissions", "Directory submissions require longer approval windows than the plan predicted.", LearningType.AUTHORITY_IMPACT, 0.82, "Measurement", "measurement-11", "metric-directory-approvals", "execution-futurepedia-submit", "plan-directory-submission", "objective-authority", "Authority plans should extend timelines and increase follow-up volume.", true],
    ["Category definition supports AEO/GEO", "Category-definition content supports answer-engine and generative-engine positioning.", LearningType.AEO_IMPACT, 0.86, "ContentAsset", "content-blog-004", "metric-ai-mentions", "execution-vpi-landing-section", "plan-vpi-authority", "objective-own-vpi", "Keep building answer-ready sections around Video Production Intelligence.", true],
    ["Founder posts create better comments", "Founder posts generate better qualitative comments than company posts.", LearningType.CHANNEL_PERFORMANCE, 0.81, "Insight", "insight-url-to-video-trust", "metric-linkedin-impressions", "execution-founder-boundaries", "plan-vpi-authority", "objective-own-vpi", "Increase founder-led narrative posts around proof, trust, and workflow intelligence.", true],
    ["Demo proof needed before BOFU push", "Demo proof is needed before pushing BOFU conversion posts harder.", LearningType.PRODUCT_SIGNAL, 0.9, "PainPoint", "painpoint-output-coherence-proof", "metric-qualified-signups", "execution-product-page-demo", "plan-product-hunt-follow-up", "objective-demo-assets", "Require proof assets before aggressive conversion messaging.", true],
    ["Community replies work with concrete demos", "Community replies perform best when paired with a concrete source-to-output demo.", LearningType.COMMUNITY_SIGNAL, 0.88, "Observation", "observation-product-hunt-comments", "metric-community-replies", "execution-product-hunt-reply", "plan-product-hunt-follow-up", "objective-product-hunt", "Recommend reply-to-community actions only when proof links are ready.", true],
    ["AEO FAQ blocks improve coverage", "Answer-ready FAQ sections improved search impressions and AI mentions.", LearningType.AEO_IMPACT, 0.84, "Measurement", "measurement-16", "metric-search-impressions", "execution-vpi-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "Create more FAQ sections around Purpose-Specific AI, VPI, and product-page workflows.", true],
    ["Pinterest needs stronger visuals", "Pinterest visibility improves only when pins carry concrete workflow proof.", LearningType.CONTENT_PERFORMANCE, 0.73, "Measurement", "measurement-27", "metric-pinterest-impressions", "execution-pinterest-proof-pin-2", "plan-product-hunt-follow-up", "objective-product-hunt", "Delay Pinterest pushes until proof visuals are ready.", true],
    ["Backlink work needs copy bank", "Directory and backlink outreach performed better after reusable copy was prepared.", LearningType.AUTHORITY_IMPACT, 0.8, "ExecutionResult", "execution-result-05", "metric-backlinks", "execution-directory-copy-bank", "plan-directory-submission", "objective-authority", "Create copy banks before scaling authority submissions.", true],
    ["X is useful after proof assets", "X distribution should follow proof asset readiness, not precede it.", LearningType.CHANNEL_PERFORMANCE, 0.76, "ExecutionResult", "execution-result-03", "metric-x-impressions", "execution-x-thread-blog-004", "plan-product-hunt-follow-up", "objective-product-hunt", "Sequence X threads after demos and screenshots are ready.", true],
    ["Entity pages need proof sections", "Entity pages earn better search clicks when proof sections are explicit.", LearningType.SEO_IMPACT, 0.79, "Measurement", "measurement-22", "metric-search-clicks", "execution-product-page-entity", "plan-aeo-geo-visibility", "objective-aeo-geo", "Update entity landing pages with proof-first examples.", true],
    ["4K quality claims require evidence", "4K quality comments show that claims without proof create skepticism.", LearningType.PRODUCT_SIGNAL, 0.77, "Observation", "observation-hn-skepticism", "metric-community-replies", "execution-4k-proof-asset", "plan-product-hunt-follow-up", "objective-demo-assets", "Avoid quality claims until demo evidence is visible.", true],
    ["Purpose-Specific AI needs repetition", "Purpose-Specific AI language is promising but needs repeated answer-ready reinforcement.", LearningType.GEO_IMPACT, 0.74, "Question", "question-purpose-specific-ai", "metric-ai-mentions", "execution-purpose-specific-faq", "plan-aeo-geo-visibility", "objective-aeo-geo", "Recommend more cluster content around purpose-specific AI.", true],
    ["Internal links strengthen VPI cluster", "Cluster linking between BLOG-002, BLOG-003, and BLOG-004 strengthened category ownership.", LearningType.SEO_IMPACT, 0.83, "ExecutionResult", "execution-result-04", "metric-organic-traffic", "execution-blog-004-internal-links", "plan-vpi-authority", "objective-own-vpi", "Future content recommendations should include internal-link actions by default.", true]
  ] as const;

  await Promise.all(
    learningSeeds.map(([title, summary, learningType, confidenceScore, sourceType, sourceId, metricId, executionItemId, planId, objectiveId, recommendationImpact, shouldInformFuturePlans], index) =>
      measurementPrisma.learning.upsert({
        where: { id: `learning-${String(index + 1).padStart(2, "0")}` },
        update: {
          title,
          summary,
          learningType,
          confidenceScore,
          sourceType,
          sourceId,
          metricId,
          executionItemId,
          planId,
          objectiveId,
          recommendationImpact,
          shouldInformFuturePlans
        },
        create: {
          ...tenant,
          id: `learning-${String(index + 1).padStart(2, "0")}`,
          title,
          summary,
          learningType,
          confidenceScore,
          sourceType,
          sourceId,
          metricId,
          executionItemId,
          planId,
          objectiveId,
          recommendationImpact,
          shouldInformFuturePlans
        } as any
      })
    )
  );

  const attributionSeeds = [
    ["ExecutionItem", "execution-product-hunt-reply", "Metric", "metric-product-hunt-referrals", AttributionType.INFLUENCED, 0.82, "Product Hunt launch replies influenced referral traffic."],
    ["ExecutionItem", "execution-company-linkedin-blog-004", "Metric", "metric-linkedin-impressions", AttributionType.INFLUENCED, 0.86, "LinkedIn carousel influenced profile visits and post impressions."],
    ["ContentAsset", "content-blog-004", "Metric", "metric-ai-mentions", AttributionType.SUPPORTED, 0.78, "BLOG-004 supported category authority and AI mentions."],
    ["DirectorySubmission", "directory-ai-video-tools", "Metric", "metric-backlinks", AttributionType.SUPPORTED, 0.74, "Directory submissions supported backlink acquisition."],
    ["ExecutionItem", "execution-product-hunt-reply", "Metric", "metric-community-replies", AttributionType.CAUSED, 0.88, "Community replies directly increased conversation quality."],
    ["ExecutionItem", "execution-product-page-demo", "Metric", "metric-qualified-signups", AttributionType.INFLUENCED, 0.81, "Product-page demo reduced skepticism and influenced qualified signups."],
    ["ExecutionItem", "execution-blog-004-internal-links", "Metric", "metric-organic-traffic", AttributionType.SUPPORTED, 0.79, "Internal links supported organic traffic growth."],
    ["ExecutionItem", "execution-vpi-faq", "Metric", "metric-search-impressions", AttributionType.SUPPORTED, 0.76, "VPI FAQ supported answer-ready search visibility."],
    ["ExecutionItem", "execution-founder-boundaries", "Metric", "metric-linkedin-impressions", AttributionType.CORRELATED, 0.69, "Founder post timing correlated with higher LinkedIn engagement."],
    ["ExecutionItem", "execution-futurepedia-submit", "Metric", "metric-directory-approvals", AttributionType.INFLUENCED, 0.72, "Futurepedia submission influenced approval volume but with lag."],
    ["ExecutionItem", "execution-ai-video-tools-backlink", "Metric", "metric-referring-domains", AttributionType.SUPPORTED, 0.74, "Backlink follow-up supported referring-domain growth."],
    ["ExecutionItem", "execution-pinterest-proof-pin-2", "Metric", "metric-pinterest-impressions", AttributionType.INFLUENCED, 0.7, "Proof pin influenced Pinterest impressions."],
    ["Question", "question-product-page-to-video", "Metric", "metric-qualified-signups", AttributionType.CORRELATED, 0.67, "Commercial question demand correlates with qualified signup lift."],
    ["Entity", "entity-video-production-intelligence", "Metric", "metric-ai-mentions", AttributionType.SUPPORTED, 0.75, "VPI entity clarity supported answer-engine mentions."],
    ["ExecutionItem", "execution-directory-copy-bank", "Metric", "metric-backlinks", AttributionType.INFLUENCED, 0.73, "Directory copy bank influenced backlink conversion readiness."]
  ] as const;

  await Promise.all(
    attributionSeeds.map(([sourceType, sourceId, targetType, targetId, attributionType, confidenceScore, evidence], index) =>
      measurementPrisma.attribution.upsert({
        where: { id: `attribution-${String(index + 1).padStart(2, "0")}` },
        update: { sourceType, sourceId, targetType, targetId, attributionType, confidenceScore, evidence },
        create: {
          ...tenant,
          id: `attribution-${String(index + 1).padStart(2, "0")}`,
          sourceType,
          sourceId,
          targetType,
          targetId,
          attributionType,
          confidenceScore,
          evidence
        } as any
      })
    )
  );

  const adjustmentSeeds = [
    ["Increase product-page-to-video demo content", "Increase focus on product-page-to-video demo content across launch and BOFU assets.", StrategyAdjustmentType.INCREASE_FOCUS, "learning-02", "objective-demo-assets", "plan-product-hunt-follow-up", StrategyAdjustmentStatus.PROPOSED, Priority.CRITICAL, "Commercial-intent questions and signup movement point to demo-led demand."],
    ["Increase founder-led posts", "Increase founder-led posts around proof, quality, and workflow intelligence.", StrategyAdjustmentType.INCREASE_FOCUS, "learning-05", "objective-own-vpi", "plan-vpi-authority", StrategyAdjustmentStatus.PROPOSED, Priority.HIGH, "Founder posts generated better qualitative comments than company-only posts."],
    ["Create more answer-ready FAQ sections", "Create more FAQ sections for Purpose-Specific AI, VPI, and product-page workflows.", StrategyAdjustmentType.UPDATE_CONTENT_CLUSTER, "learning-08", "objective-aeo-geo", "plan-aeo-geo-visibility", StrategyAdjustmentStatus.ACCEPTED, Priority.HIGH, "AEO FAQ blocks improved search impressions and AI mentions."],
    ["Pause Pinterest until proof visuals improve", "Pause low-proof Pinterest pins until concrete workflow visuals are ready.", StrategyAdjustmentType.PAUSE_STRATEGY, "learning-09", "objective-product-hunt", "plan-product-hunt-follow-up", StrategyAdjustmentStatus.PROPOSED, Priority.MEDIUM, "Pinterest visibility depends on stronger proof visuals."],
    ["Update product-page-to-video positioning", "Position product-page-to-video as a commercial investigation and ecommerce workflow proof motion.", StrategyAdjustmentType.UPDATE_POSITIONING, "learning-02", "objective-demo-assets", "plan-product-hunt-follow-up", StrategyAdjustmentStatus.ACCEPTED, Priority.CRITICAL, "Customer language shows product-page-to-video is BOFU demand."],
    ["Prioritize evidence before BOFU posts", "Prioritize demo evidence before BOFU conversion posts and community replies.", StrategyAdjustmentType.UPDATE_CHANNEL_PRIORITY, "learning-06", "objective-demo-assets", "plan-product-hunt-follow-up", StrategyAdjustmentStatus.PROPOSED, Priority.CRITICAL, "Conversion recommendations should wait for visible proof assets."],
    ["Extend authority timeline", "Extend authority plan timeline and add follow-up volume.", StrategyAdjustmentType.CREATE_NEW_PLAN, "learning-03", "objective-authority", "plan-directory-submission", StrategyAdjustmentStatus.PROPOSED, Priority.HIGH, "Actual directory approvals are lower than predicted backlinks."],
    ["Add internal links by default", "Add internal-link tasks to every new authority article plan.", StrategyAdjustmentType.UPDATE_CONTENT_CLUSTER, "learning-15", "objective-own-vpi", "plan-vpi-authority", StrategyAdjustmentStatus.IMPLEMENTED, Priority.HIGH, "Internal links strengthened the VPI cluster."],
    ["Create proof-quality experiment", "Create an experiment testing proof-first versus claim-first demo sections.", StrategyAdjustmentType.CREATE_EXPERIMENT, "learning-13", "objective-demo-assets", "plan-product-hunt-follow-up", StrategyAdjustmentStatus.PROPOSED, Priority.HIGH, "Quality claims require evidence to reduce skepticism."],
    ["Increase purpose-specific AI cluster work", "Increase content and entity reinforcement around Purpose-Specific AI and Purpose Engines.", StrategyAdjustmentType.UPDATE_KEYWORD_TARGET, "learning-14", "objective-aeo-geo", "plan-aeo-geo-visibility", StrategyAdjustmentStatus.PROPOSED, Priority.HIGH, "Purpose-Specific AI language needs repetition to show up in AI surfaces."]
  ] as const;

  await Promise.all(
    adjustmentSeeds.map(([title, description, adjustmentType, sourceLearningId, objectiveId, planId, status, priority, reasoning], index) =>
      measurementPrisma.strategyAdjustment.upsert({
        where: { id: `strategy-adjustment-${String(index + 1).padStart(2, "0")}` },
        update: { title, description, adjustmentType, sourceLearningId, objectiveId, planId, status, priority, reasoning },
        create: {
          ...tenant,
          id: `strategy-adjustment-${String(index + 1).padStart(2, "0")}`,
          title,
          description,
          adjustmentType,
          sourceLearningId,
          objectiveId,
          planId,
          status,
          priority,
          reasoning
        } as any
      })
    )
  );

  const measurementEvents = [
    [MeasurementEventType.METRIC_CREATED, "Metric", "metric-qualified-signups", "Qualified signups metric created.", EventSeverity.HIGH],
    [MeasurementEventType.MEASUREMENT_CREATED, "Measurement", "measurement-07", "Qualified signup movement measured from demo-linked replies.", EventSeverity.HIGH],
    [MeasurementEventType.LEARNING_CREATED, "Learning", "learning-02", "Product-page-to-video commercial-intent learning created.", EventSeverity.CRITICAL],
    [MeasurementEventType.ATTRIBUTION_CREATED, "Attribution", "attribution-06", "Product-page demo attribution created.", EventSeverity.HIGH],
    [MeasurementEventType.STRATEGY_ADJUSTMENT_PROPOSED, "StrategyAdjustment", "strategy-adjustment-01", "Product-page demo content focus proposed.", EventSeverity.CRITICAL]
  ] as const;

  await Promise.all(
    measurementEvents.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `measurement-event-${String(index + 1).padStart(2, "0")}` },
        update: { eventType: eventType as any, sourceType, sourceId, title, severity },
        create: {
          ...tenant,
          id: `measurement-event-${String(index + 1).padStart(2, "0")}`,
          eventType: eventType as any,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: { capability: "measurement-learning-engine" },
          severity,
          status: EventStatus.PROCESSED,
          processedAt: new Date()
        }
      })
    )
  );
}

async function seedMissionEngine() {
  const missionPrisma = prisma as PrismaClient & Record<
    | "mission"
    | "missionObjective"
    | "missionPlan"
    | "missionExecution"
    | "missionLearning"
    | "missionMetric"
    | "missionSummary",
    { upsert: (args: any) => Promise<unknown> }
  >;

  const missionSeeds = [
    ["mission-own-vpi", "Own Video Production Intelligence", "Make Video Production Intelligence the category language that VidMaker owns across AI search, founder content, and proof-led assets.", MissionType.GEO, "Tom Promise", Priority.CRITICAL, MissionStatus.ACTIVE, 91, 0.88, 82, 63, 18, -28, 24, "Primary enterprise category ownership mission."],
    ["mission-product-hunt-momentum", "Product Hunt Momentum", "Turn launch attention into community replies, demo proof, qualified signups, and follow-up content.", MissionType.LAUNCH, "Community Intelligence", Priority.CRITICAL, MissionStatus.ACTIVE, 84, 0.82, 76, 58, 24, -14, 18, "Launch momentum mission connected to demo and community proof."],
    ["mission-purpose-specific-ai", "Purpose-Specific AI Awareness", "Build awareness around Purpose-Specific AI and Purpose Engines as differentiated VidMaker language.", MissionType.AEO, "Search Strategy", Priority.HIGH, MissionStatus.ACTIVE, 78, 0.76, 64, 42, 28, -21, 35, "AEO and GEO language reinforcement mission."],
    ["mission-ai-search-visibility", "AI Search Visibility", "Increase VidMaker visibility in answer engines, AI mentions, search impressions, and entity-aware content.", MissionType.GEO, "SEO Strategy", Priority.CRITICAL, MissionStatus.ACTIVE, 86, 0.84, 71, 54, 21, -35, 42, "Search and AI surface visibility mission."],
    ["mission-founder-authority", "Founder Authority", "Use founder-led narratives to build trust, authority, and differentiated language around VidMaker.", MissionType.AUTHORITY, "Tom Promise", Priority.HIGH, MissionStatus.ACTIVE, 80, 0.81, 68, 47, 22, -18, 28, "Founder brand and authority mission."],
    ["mission-product-page-to-video", "Product Page to Video Category", "Establish product-page-to-video as a commercial category through demos, landing pages, content, and community replies.", MissionType.PRODUCT, "Growth", Priority.CRITICAL, MissionStatus.AT_RISK, 73, 0.79, 61, 39, 34, -10, 30, "Product category mission with proof-asset dependency risk."]
  ] as const;

  await Promise.all(
    missionSeeds.map(([id, title, description, missionType, owner, priority, status, healthScore, confidenceScore, velocityScore, completionScore, riskScore, startOffset, targetOffset, notes]) =>
      missionPrisma.mission.upsert({
        where: { id },
        update: {
          title,
          description,
          missionType,
          owner,
          priority,
          status,
          healthScore,
          confidenceScore,
          velocityScore,
          completionScore,
          riskScore,
          startDate: dateFromNow(startOffset),
          targetDate: dateFromNow(targetOffset),
          completedDate: null,
          notes
        },
        create: {
          ...tenant,
          id,
          title,
          description,
          missionType,
          owner,
          priority,
          status,
          healthScore,
          confidenceScore,
          velocityScore,
          completionScore,
          riskScore,
          startDate: dateFromNow(startOffset),
          targetDate: dateFromNow(targetOffset),
          completedDate: null,
          notes
        } as any
      })
    )
  );

  const missionObjectives = [
    ["mission-own-vpi", "objective-own-vpi", 1],
    ["mission-own-vpi", "objective-aeo-geo", 0.8],
    ["mission-product-hunt-momentum", "objective-product-hunt", 1],
    ["mission-product-hunt-momentum", "objective-demo-assets", 0.9],
    ["mission-purpose-specific-ai", "objective-aeo-geo", 1],
    ["mission-ai-search-visibility", "objective-aeo-geo", 1],
    ["mission-ai-search-visibility", "objective-own-vpi", 0.7],
    ["mission-founder-authority", "objective-own-vpi", 1],
    ["mission-product-page-to-video", "objective-demo-assets", 1],
    ["mission-product-page-to-video", "objective-product-hunt", 0.8]
  ] as const;

  await Promise.all(
    missionObjectives.map(([missionId, objectiveId, weight], index) =>
      missionPrisma.missionObjective.upsert({
        where: { missionId_objectiveId: { missionId, objectiveId } },
        update: { weight, workspaceId },
        create: {
          id: `mission-objective-${String(index + 1).padStart(2, "0")}`,
          missionId,
          objectiveId,
          workspaceId,
          weight
        } as any
      })
    )
  );

  const missionPlans = [
    ["mission-own-vpi", "plan-vpi-authority", 1],
    ["mission-own-vpi", "plan-blog-004-010-content", 0.8],
    ["mission-product-hunt-momentum", "plan-product-hunt-follow-up", 1],
    ["mission-purpose-specific-ai", "plan-aeo-geo-visibility", 1],
    ["mission-ai-search-visibility", "plan-aeo-geo-visibility", 1],
    ["mission-ai-search-visibility", "plan-vpi-authority", 0.7],
    ["mission-founder-authority", "plan-vpi-authority", 1],
    ["mission-product-page-to-video", "plan-product-hunt-follow-up", 1],
    ["mission-product-page-to-video", "plan-aeo-geo-visibility", 0.6],
    ["mission-product-hunt-momentum", "plan-directory-submission", 0.4]
  ] as const;

  await Promise.all(
    missionPlans.map(([missionId, planId, weight], index) =>
      missionPrisma.missionPlan.upsert({
        where: { missionId_planId: { missionId, planId } },
        update: { weight, workspaceId },
        create: {
          id: `mission-plan-${String(index + 1).padStart(2, "0")}`,
          missionId,
          planId,
          workspaceId,
          weight
        } as any
      })
    )
  );

  const missionExecutions = [
    ["mission-own-vpi", "execution-blog-004-internal-links", 0.9],
    ["mission-own-vpi", "execution-vpi-landing-section", 1],
    ["mission-product-hunt-momentum", "execution-product-hunt-reply", 1],
    ["mission-product-hunt-momentum", "execution-ph-proof-screenshot", 0.8],
    ["mission-purpose-specific-ai", "execution-purpose-specific-faq", 1],
    ["mission-purpose-specific-ai", "execution-purpose-engines-company-post", 0.7],
    ["mission-ai-search-visibility", "execution-answer-coverage-experiment", 1],
    ["mission-founder-authority", "execution-founder-boundaries", 1],
    ["mission-founder-authority", "execution-founder-vpi-post", 0.9],
    ["mission-product-page-to-video", "execution-product-page-demo", 1],
    ["mission-product-page-to-video", "execution-product-page-entity", 0.9],
    ["mission-product-page-to-video", "execution-4k-proof-asset", 0.8]
  ] as const;

  await Promise.all(
    missionExecutions.map(([missionId, executionItemId, importance], index) =>
      missionPrisma.missionExecution.upsert({
        where: { missionId_executionItemId: { missionId, executionItemId } },
        update: { importance, workspaceId },
        create: {
          id: `mission-execution-${String(index + 1).padStart(2, "0")}`,
          missionId,
          executionItemId,
          workspaceId,
          importance
        } as any
      })
    )
  );

  const missionLearnings = [
    ["mission-own-vpi", "learning-15", 0.83],
    ["mission-own-vpi", "learning-04", 0.86],
    ["mission-product-hunt-momentum", "learning-07", 0.88],
    ["mission-product-hunt-momentum", "learning-02", 0.93],
    ["mission-purpose-specific-ai", "learning-14", 0.74],
    ["mission-ai-search-visibility", "learning-08", 0.84],
    ["mission-ai-search-visibility", "learning-12", 0.79],
    ["mission-founder-authority", "learning-05", 0.81],
    ["mission-product-page-to-video", "learning-06", 0.9],
    ["mission-product-page-to-video", "learning-02", 0.93],
    ["mission-product-page-to-video", "learning-13", 0.77]
  ] as const;

  await Promise.all(
    missionLearnings.map(([missionId, learningId, confidence], index) =>
      missionPrisma.missionLearning.upsert({
        where: { missionId_learningId: { missionId, learningId } },
        update: { confidence, workspaceId },
        create: {
          id: `mission-learning-${String(index + 1).padStart(2, "0")}`,
          missionId,
          learningId,
          workspaceId,
          confidence
        } as any
      })
    )
  );

  const missionMetrics = [
    ["mission-own-vpi", "metric-ai-mentions", 1],
    ["mission-own-vpi", "metric-organic-traffic", 0.8],
    ["mission-product-hunt-momentum", "metric-product-hunt-referrals", 1],
    ["mission-product-hunt-momentum", "metric-community-replies", 0.8],
    ["mission-purpose-specific-ai", "metric-ai-mentions", 1],
    ["mission-ai-search-visibility", "metric-search-impressions", 1],
    ["mission-ai-search-visibility", "metric-search-clicks", 0.8],
    ["mission-founder-authority", "metric-linkedin-impressions", 1],
    ["mission-product-page-to-video", "metric-qualified-signups", 1],
    ["mission-product-page-to-video", "metric-search-clicks", 0.7],
    ["mission-product-page-to-video", "metric-community-replies", 0.7],
    ["mission-founder-authority", "metric-ai-mentions", 0.5]
  ] as const;

  await Promise.all(
    missionMetrics.map(([missionId, metricId, weight], index) =>
      missionPrisma.missionMetric.upsert({
        where: { missionId_metricId: { missionId, metricId } },
        update: { weight, workspaceId },
        create: {
          id: `mission-metric-${String(index + 1).padStart(2, "0")}`,
          missionId,
          metricId,
          workspaceId,
          weight
        } as any
      })
    )
  );

  const missionSummaries = [
    ["mission-own-vpi", "Video Production Intelligence is healthy and should keep compounding through founder authority, internal links, and answer-ready entity pages.", "Health is high because search, AI mentions, and cluster learning are moving together.", 0.88],
    ["mission-product-hunt-momentum", "Product Hunt momentum remains strong, but demo proof needs to stay visible in every reply and follow-up asset.", "Community reply and referral measurements show positive movement tied to proof-led engagement.", 0.82],
    ["mission-purpose-specific-ai", "Purpose-Specific AI awareness needs repetition through FAQ, company posts, and entity-backed content.", "Learning confidence is moderate because the language is promising but still early in AI surfaces.", 0.74],
    ["mission-ai-search-visibility", "AI Search Visibility is progressing through FAQ coverage, entity pages, and answer coverage experiments.", "Search impressions and AI mentions support continued investment.", 0.84],
    ["mission-founder-authority", "Founder Authority should increase because founder posts generate stronger qualitative comments.", "Founder-led content has positive channel learning and supports category ownership.", 0.81],
    ["mission-product-page-to-video", "Product Page to Video is strategically critical but at risk until demo assets are complete.", "Commercial intent is high, but proof-quality blockers increase execution risk.", 0.79]
  ] as const;

  await Promise.all(
    missionSummaries.map(([missionId, summary, reasoning, confidence], index) =>
      missionPrisma.missionSummary.upsert({
        where: { id: `mission-summary-${String(index + 1).padStart(2, "0")}` },
        update: { missionId, workspaceId, summary, reasoning, confidence, generatedAt: dateFromNow(-(index % 3)) },
        create: {
          id: `mission-summary-${String(index + 1).padStart(2, "0")}`,
          missionId,
          workspaceId,
          summary,
          reasoning,
          generatedAt: dateFromNow(-(index % 3)),
          confidence
        } as any
      })
    )
  );

  const missionEvents = [
    [MissionEventType.MISSION_CREATED, "Mission", "mission-own-vpi", "Own Video Production Intelligence mission created.", EventSeverity.CRITICAL],
    [MissionEventType.MISSION_STARTED, "Mission", "mission-product-hunt-momentum", "Product Hunt Momentum mission started.", EventSeverity.CRITICAL],
    [MissionEventType.MISSION_SUMMARY_GENERATED, "MissionSummary", "mission-summary-01", "Mission summary generated for Video Production Intelligence.", EventSeverity.HIGH],
    [MissionEventType.MISSION_HEALTH_CHANGED, "Mission", "mission-product-page-to-video", "Product Page to Video mission moved to at-risk.", EventSeverity.CRITICAL],
    [MissionEventType.MISSION_RECOMMENDATION_CREATED, "Mission", "mission-founder-authority", "Founder Authority mission recommendation created.", EventSeverity.HIGH],
    [MissionEventType.MISSION_PROGRESS_UPDATED, "Mission", "mission-ai-search-visibility", "AI Search Visibility mission progress updated.", EventSeverity.HIGH]
  ] as const;

  await Promise.all(
    missionEvents.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `mission-event-${String(index + 1).padStart(2, "0")}` },
        update: { eventType: eventType as any, sourceType, sourceId, title, severity },
        create: {
          ...tenant,
          id: `mission-event-${String(index + 1).padStart(2, "0")}`,
          eventType: eventType as any,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: { capability: "mission-engine" },
          severity,
          status: EventStatus.PROCESSED,
          processedAt: new Date()
        }
      })
    )
  );
}

async function seedConnectedIntelligence() {
  const connectedPrisma = prisma as PrismaClient & Record<
    "connector" | "rawSignal" | "normalizedSignal" | "connectorSyncRun",
    { upsert: (args: any) => Promise<unknown> }
  >;

  const connectorSeeds = [
    ["connector-gsc", "Google Search Console Mock Connector", ConnectorType.GOOGLE_SEARCH_CONSOLE, ConnectorStatus.MOCK, "Google", AuthType.NONE, "Search query and answer visibility signals.", 89, 1],
    ["connector-ga", "Google Analytics Mock Connector", ConnectorType.GOOGLE_ANALYTICS, ConnectorStatus.MOCK, "Google", AuthType.NONE, "Traffic, referral, and conversion movement signals.", 84, 2],
    ["connector-github", "GitHub Mock Connector", ConnectorType.GITHUB, ConnectorStatus.MOCK, "GitHub", AuthType.NONE, "Release, issue, and workflow change signals.", 82, 3],
    ["connector-product-hunt", "Product Hunt Mock Connector", ConnectorType.PRODUCT_HUNT, ConnectorStatus.MOCK, "Product Hunt", AuthType.NONE, "Launch comments, referrals, and proof requests.", 87, 1],
    ["connector-reddit", "Reddit Mock Connector", ConnectorType.REDDIT, ConnectorStatus.MOCK, "Reddit", AuthType.NONE, "Community threads and objections from AI video discussions.", 74, 4],
    ["connector-linkedin", "LinkedIn Mock Connector", ConnectorType.LINKEDIN, ConnectorStatus.MOCK, "LinkedIn", AuthType.NONE, "Founder, company, and comment intelligence.", 81, 2],
    ["connector-x", "X Mock Connector", ConnectorType.X, ConnectorStatus.MOCK, "X", AuthType.NONE, "Thread, reply, and category-language signals.", 76, 5],
    ["connector-youtube", "YouTube Mock Connector", ConnectorType.YOUTUBE, ConnectorStatus.MOCK, "YouTube", AuthType.NONE, "Video script, comment, and watch-interest signals.", 71, 6],
    ["connector-newsletter", "Newsletter Mock Connector", ConnectorType.NEWSLETTER, ConnectorStatus.MOCK, "Newsletter", AuthType.NONE, "Newsletter opens, clicks, and subscriber intent.", 86, 2],
    ["connector-cms", "CMS Mock Connector", ConnectorType.CMS, ConnectorStatus.MOCK, "VidMaker CMS", AuthType.NONE, "Published content and article metadata.", 90, 1],
    ["connector-manual-import", "Manual Import Connector", ConnectorType.MANUAL_IMPORT, ConnectorStatus.CONNECTED, "Manual", AuthType.MANUAL, "CSV and hand-entered market intelligence imports.", 79, 7]
  ] as const;

  await Promise.all(
    connectorSeeds.map(([id, name, connectorType, status, provider, authType, description, healthScore, lastSyncOffset], index) =>
      connectedPrisma.connector.upsert({
        where: { id },
        update: {
          name,
          connectorType,
          status,
          provider,
          description,
          authType,
          config: { mode: "mock", kernelFirst: true, requiredConfigComplete: true },
          lastSyncAt: dateFromNow(-lastSyncOffset),
          nextSyncAt: dateFromNow(index < 4 ? 1 : 7),
          healthScore
        },
        create: {
          ...tenant,
          id,
          name,
          connectorType,
          status,
          provider,
          description,
          authType,
          config: { mode: "mock", kernelFirst: true, requiredConfigComplete: true },
          lastSyncAt: dateFromNow(-lastSyncOffset),
          nextSyncAt: dateFromNow(index < 4 ? 1 : 7),
          healthScore
        } as any
      })
    )
  );

  const signalSeeds = [
    ["gsc-01", "connector-gsc", SignalType.SEARCH_QUERY, "what is video production intelligence", "Search query asking for the Video Production Intelligence category.", "https://search.google.com/search-console", "Google Search", "Search Console", Priority.CRITICAL, 0.91],
    ["gsc-02", "connector-gsc", SignalType.SEARCH_QUERY, "product page to video", "Commercial search query for product page to video workflows.", "https://search.google.com/search-console", "Google Search", "Search Console", Priority.CRITICAL, 0.9],
    ["gsc-03", "connector-gsc", SignalType.SEARCH_QUERY, "purpose specific ai video tool", "Search query connecting Purpose-Specific AI to video production.", "https://search.google.com/search-console", "Google Search", "Search Console", Priority.HIGH, 0.84],
    ["ga-01", "connector-ga", SignalType.REFERRAL_TRAFFIC, "Product Hunt referral traffic increased", "Google Analytics referral signal from Product Hunt launch traffic.", "https://analytics.google.com", "Google Analytics", "GA4", Priority.HIGH, 0.86],
    ["ga-02", "connector-ga", SignalType.TRAFFIC_CHANGE, "BLOG-004 organic traffic lift", "Traffic change after BLOG-004 internal links were added.", "https://analytics.google.com", "Google Analytics", "GA4", Priority.HIGH, 0.82],
    ["ga-03", "connector-ga", SignalType.REFERRAL_TRAFFIC, "AI directory referral visit", "Referral traffic from an AI tools directory listing.", "https://analytics.google.com", "Google Analytics", "GA4", Priority.MEDIUM, 0.76],
    ["github-01", "connector-github", SignalType.GITHUB_RELEASE, "VidMaker generation workflow release", "GitHub release shipped improvements to VidMaker generation workflow orchestration.", "https://github.com/apjproduction/vgos-enterprise/releases", "APJ Production", "GitHub", Priority.HIGH, 0.88],
    ["github-02", "connector-github", SignalType.GITHUB_ISSUE, "Output coherence issue tagged", "GitHub issue tagged around source-to-scene coherence.", "https://github.com/apjproduction/vgos-enterprise/issues", "Product Team", "GitHub", Priority.HIGH, 0.8],
    ["ph-01", "connector-product-hunt", SignalType.PRODUCT_HUNT_COMMENT, "URL-to-video example requested", "Product Hunt comment asks for a URL-to-video example from a product page.", "https://producthunt.com/posts/vidmaker", "Launch visitor", "Product Hunt", Priority.CRITICAL, 0.93],
    ["ph-02", "connector-product-hunt", SignalType.PRODUCT_HUNT_COMMENT, "Asked about ready-to-post output", "Product Hunt commenter asks whether VidMaker creates ready-to-post videos.", "https://producthunt.com/posts/vidmaker", "Ecommerce operator", "Product Hunt", Priority.HIGH, 0.86],
    ["ph-03", "connector-product-hunt", SignalType.REFERRAL_TRAFFIC, "Product Hunt referral conversion", "Referral signal shows launch visitors reaching the product page to video page.", "https://producthunt.com/posts/vidmaker", "Product Hunt", "Product Hunt", Priority.HIGH, 0.81],
    ["reddit-01", "connector-reddit", SignalType.COMMUNITY_THREAD, "Generic AI video tools feel templated", "Reddit thread complains that generic AI video tools feel templated and hard to control.", "https://reddit.com/r/aivideo", "Reddit user", "Reddit", Priority.HIGH, 0.84],
    ["reddit-02", "connector-reddit", SignalType.COMMUNITY_REPLY, "Need source-aware editing", "Community reply asks for source-aware editing instead of prompt-only generation.", "https://reddit.com/r/aivideo", "Creator", "Reddit", Priority.HIGH, 0.79],
    ["reddit-03", "connector-reddit", SignalType.COMMUNITY_THREAD, "AI product video workflow discussion", "Community thread discusses automating product video creation from store pages.", "https://reddit.com/r/ecommerce", "Ecommerce founder", "Reddit", Priority.CRITICAL, 0.87],
    ["linkedin-01", "connector-linkedin", SignalType.SOCIAL_COMMENT, "Purpose-Specific AI language resonated", "LinkedIn comment says Purpose-Specific AI is clearer than generic AI positioning.", "https://linkedin.com/company/vidmaker", "Marketing lead", "LinkedIn", Priority.HIGH, 0.85],
    ["linkedin-02", "connector-linkedin", SignalType.SOCIAL_POST, "Founder post on Video Production Intelligence", "Founder post introduces Video Production Intelligence and Purpose Engines.", "https://linkedin.com/in/founder", "Founder", "LinkedIn", Priority.HIGH, 0.82],
    ["linkedin-03", "connector-linkedin", SignalType.SOCIAL_COMMENT, "Asked for enterprise workflow controls", "LinkedIn comment asks whether VidMaker supports enterprise review workflows.", "https://linkedin.com/company/vidmaker", "Enterprise marketer", "LinkedIn", Priority.MEDIUM, 0.75],
    ["x-01", "connector-x", SignalType.SOCIAL_COMMENT, "X reply asks for product URL demo", "X reply asks to see a product URL become a short social video.", "https://x.com/vidmaker", "Creator", "X", Priority.HIGH, 0.8],
    ["x-02", "connector-x", SignalType.SOCIAL_POST, "X thread about product page to video", "X thread summarizes the product-page-to-video workflow.", "https://x.com/vidmaker/status/1", "VidMaker", "X", Priority.MEDIUM, 0.72],
    ["youtube-01", "connector-youtube", SignalType.SOCIAL_COMMENT, "YouTube comment asks about 4K proof", "YouTube viewer asks whether VidMaker output can support 4K product proof.", "https://youtube.com/watch?v=vidmaker", "Video marketer", "YouTube", Priority.HIGH, 0.78],
    ["youtube-02", "connector-youtube", SignalType.CUSTOM_SIGNAL, "YouTube script topic suggested", "YouTube audience signal suggests a script on AI video workflow automation.", "https://youtube.com/@vidmaker", "Creator audience", "YouTube", Priority.MEDIUM, 0.7],
    ["newsletter-01", "connector-newsletter", SignalType.NEWSLETTER_METRIC, "Newsletter click on BLOG-004", "Newsletter audience clicked the BLOG-004 Video Production Intelligence article.", "https://vidmaker.com/blog/video-production-intelligence", "Newsletter", "Email", Priority.HIGH, 0.86],
    ["newsletter-02", "connector-newsletter", SignalType.NEWSLETTER_METRIC, "Purpose-Specific AI click cluster", "Newsletter clicks clustered around Purpose-Specific AI explanation links.", "https://vidmaker.com/blog/purpose-specific-ai", "Newsletter", "Email", Priority.HIGH, 0.8],
    ["cms-01", "connector-cms", SignalType.CMS_ARTICLE, "BLOG-004 published", "CMS article published for BLOG-004: What Is Video Production Intelligence?", "https://vidmaker.com/blog/video-production-intelligence", "VidMaker CMS", "CMS", Priority.CRITICAL, 0.94],
    ["cms-02", "connector-cms", SignalType.CMS_ARTICLE, "Product page to video landing update", "CMS page update adds source-to-output proof for product page to video.", "https://vidmaker.com/product-page-to-video", "VidMaker CMS", "CMS", Priority.HIGH, 0.84],
    ["manual-01", "connector-manual-import", SignalType.BACKLINK_FOUND, "Backlink found from AI directory", "Manual import found a backlink from an AI video tools directory.", "https://example.com/ai-video-tools/vidmaker", "Authority", "Manual Import", Priority.HIGH, 0.83],
    ["manual-02", "connector-manual-import", SignalType.DIRECTORY_STATUS, "Futurepedia submission moved to review", "Manual status update shows Futurepedia submission in review.", "https://futurepedia.io", "Authority", "Manual Import", Priority.MEDIUM, 0.72],
    ["manual-03", "connector-manual-import", SignalType.CUSTOM_SIGNAL, "Sales note requests ecommerce demo", "Manual import from sales notes requests a product-page-to-video ecommerce demo.", "https://vidmaker.com", "Sales", "Manual Import", Priority.CRITICAL, 0.88],
    ["gsc-04", "connector-gsc", SignalType.SEARCH_QUERY, "ai video production workflow automation", "Search query around AI video production workflow automation.", "https://search.google.com/search-console", "Google Search", "Search Console", Priority.HIGH, 0.82],
    ["ga-04", "connector-ga", SignalType.TRAFFIC_CHANGE, "Landing page scroll depth improved", "Analytics signal shows better scroll depth on product-page-to-video page.", "https://analytics.google.com", "Google Analytics", "GA4", Priority.MEDIUM, 0.73]
  ] as const;

  await Promise.all(
    signalSeeds.map(([externalId, connectorId, signalType, title, summary, sourceUrl, author, platform, priority, confidenceScore], index) =>
      connectedPrisma.rawSignal.upsert({
        where: { id: `raw-signal-${String(index + 1).padStart(2, "0")}` },
        update: {
          connectorId,
          source: platform,
          sourceType: signalType,
          externalId,
          rawPayload: { externalId, title, body: summary, url: sourceUrl, author, platform, priority, confidenceScore },
          receivedAt: dateFromNow(-(index % 12)),
          processedAt: dateFromNow(-(index % 12)),
          status: RawSignalStatus.ROUTED,
          error: null
        },
        create: {
          ...tenant,
          id: `raw-signal-${String(index + 1).padStart(2, "0")}`,
          connectorId,
          source: platform,
          sourceType: signalType,
          externalId,
          rawPayload: { externalId, title, body: summary, url: sourceUrl, author, platform, priority, confidenceScore },
          receivedAt: dateFromNow(-(index % 12)),
          processedAt: dateFromNow(-(index % 12)),
          status: RawSignalStatus.ROUTED
        } as any
      })
    )
  );

  await Promise.all(
    signalSeeds.map(([externalId, connectorId, signalType, title, summary, sourceUrl, author, platform, priority, confidenceScore], index) =>
      connectedPrisma.normalizedSignal.upsert({
        where: { id: `normalized-signal-${String(index + 1).padStart(2, "0")}` },
        update: {
          rawSignalId: `raw-signal-${String(index + 1).padStart(2, "0")}`,
          connectorId,
          signalType,
          title,
          summary,
          sourceUrl,
          author,
          platform,
          occurredAt: dateFromNow(-(index % 12)),
          confidenceScore,
          priority,
          metadata: { externalId, routed: true, kernelPath: "Connector -> RawSignal -> NormalizedSignal -> Event -> Intelligence Pipeline" }
        },
        create: {
          ...tenant,
          id: `normalized-signal-${String(index + 1).padStart(2, "0")}`,
          rawSignalId: `raw-signal-${String(index + 1).padStart(2, "0")}`,
          connectorId,
          signalType,
          title,
          summary,
          sourceUrl,
          author,
          platform,
          occurredAt: dateFromNow(-(index % 12)),
          confidenceScore,
          priority,
          metadata: { externalId, routed: true, kernelPath: "Connector -> RawSignal -> NormalizedSignal -> Event -> Intelligence Pipeline" }
        } as any
      })
    )
  );

  await Promise.all(
    Array.from({ length: 15 }, (_, index) => {
      const connector = connectorSeeds[index % connectorSeeds.length];
      const failed = index === 6 || index === 13;
      const partial = index === 9;
      const id = `connector-sync-run-${String(index + 1).padStart(2, "0")}`;
      return connectedPrisma.connectorSyncRun.upsert({
        where: { id },
        update: {
          connectorId: connector[0],
          status: failed ? SyncStatus.FAILED : partial ? SyncStatus.PARTIAL : SyncStatus.COMPLETED,
          startedAt: dateFromNow(-(index + 1)),
          completedAt: failed ? null : dateFromNow(-(index + 1)),
          recordsFetched: failed ? 0 : 3 + (index % 5),
          recordsNormalized: failed ? 0 : 3 + (index % 4),
          recordsRouted: failed ? 0 : 2 + (index % 4),
          error: failed ? "Mock connector timeout while reading provider payload." : null,
          logs: { connector: connector[1], mode: "mock", kernelFirst: true }
        },
        create: {
          ...tenant,
          id,
          connectorId: connector[0],
          status: failed ? SyncStatus.FAILED : partial ? SyncStatus.PARTIAL : SyncStatus.COMPLETED,
          startedAt: dateFromNow(-(index + 1)),
          completedAt: failed ? null : dateFromNow(-(index + 1)),
          recordsFetched: failed ? 0 : 3 + (index % 5),
          recordsNormalized: failed ? 0 : 3 + (index % 4),
          recordsRouted: failed ? 0 : 2 + (index % 4),
          error: failed ? "Mock connector timeout while reading provider payload." : null,
          logs: { connector: connector[1], mode: "mock", kernelFirst: true }
        } as any
      });
    })
  );

  const connectorEvents = [
    [ConnectedIntelligenceEventType.CONNECTOR_CREATED, "Connector", "connector-gsc", "Google Search Console mock connector registered.", EventSeverity.HIGH],
    [ConnectedIntelligenceEventType.CONNECTOR_CONNECTED, "Connector", "connector-manual-import", "Manual import connector connected.", EventSeverity.MEDIUM],
    [ConnectedIntelligenceEventType.CONNECTOR_SYNC_COMPLETED, "ConnectorSyncRun", "connector-sync-run-01", "Google Search Console mock sync completed.", EventSeverity.HIGH],
    [ConnectedIntelligenceEventType.RAW_SIGNAL_RECEIVED, "RawSignal", "raw-signal-01", "Raw search query signal received.", EventSeverity.HIGH],
    [ConnectedIntelligenceEventType.SIGNAL_NORMALIZED, "NormalizedSignal", "normalized-signal-01", "Search query normalized into intelligence signal.", EventSeverity.HIGH],
    [ConnectedIntelligenceEventType.SIGNAL_ROUTED, "NormalizedSignal", "normalized-signal-09", "Product Hunt comment routed to intelligence.", EventSeverity.CRITICAL],
    [ConnectedIntelligenceEventType.CONNECTOR_SYNC_FAILED, "ConnectorSyncRun", "connector-sync-run-07", "X connector mock sync failed.", EventSeverity.HIGH],
    [ConnectedIntelligenceEventType.CONNECTOR_HEALTH_CHANGED, "Connector", "connector-reddit", "Reddit connector health changed after partial community sync.", EventSeverity.MEDIUM]
  ] as const;

  await Promise.all(
    connectorEvents.map(([eventType, sourceType, sourceId, title, severity], index) =>
      prisma.event.upsert({
        where: { id: `connected-intelligence-event-${String(index + 1).padStart(2, "0")}` },
        update: { eventType: eventType as any, sourceType, sourceId, title, severity },
        create: {
          ...tenant,
          id: `connected-intelligence-event-${String(index + 1).padStart(2, "0")}`,
          eventType: eventType as any,
          sourceType,
          sourceId,
          title,
          description: title,
          metadata: { capability: "connected-intelligence" },
          severity,
          status: EventStatus.PROCESSED,
          processedAt: new Date()
        }
      })
    )
  );
}


async function seedIntelligenceQualityHardening() {
  const highTitles = [
    "Product-page-to-video demo recommendation",
    "BLOG-004 authority recommendation",
    "Directory submission recommendation",
    "Product Hunt follow-up recommendation",
    "Founder post recommendation",
    "Purpose-Specific AI FAQ recommendation",
    "Product-page-to-video X thread recommendation",
    "VPI backlink outreach recommendation",
    "BLOG-004 internal-link authority recommendation",
    "Workflow intelligence company post recommendation"
  ];
  const lowTitles = [
    "Low-evidence Pinterest proof pin recommendation",
    "Low-confidence proof-mode feature request",
    "Thin comparison article recommendation",
    "Unverified community reply recommendation",
    "Low-authority directory submission recommendation",
    "Founder post without recent evidence recommendation",
    "Landing-page claim update missing proof",
    "Duplicate X thread recommendation",
    "FAQ block missing source citation",
    "Newsletter outreach without target list"
  ];
  const types = [
    RecommendationType.LANDING_PAGE,
    RecommendationType.BLOG_IDEA,
    RecommendationType.DIRECTORY_SUBMISSION,
    RecommendationType.COMMUNITY_REPLY,
    RecommendationType.FOUNDER_POST,
    RecommendationType.FAQ,
    RecommendationType.X_THREAD,
    RecommendationType.BACKLINK_OUTREACH,
    RecommendationType.INTERNAL_LINK,
    RecommendationType.COMPANY_POST
  ];
  const targets = [
    ["IntelligenceObject", "intelligence-product-page-to-video-demo"],
    ["ContentAsset", "content-blog-004"],
    ["DirectorySubmission", "directory-ai-video-tools"],
    ["Observation", "observation-product-hunt-comments"],
    ["Insight", "insight-url-to-video-trust"]
  ] as const;
  const recSeeds = [
    ...highTitles.map((title, index) => ({ title, high: true, index })),
    ...lowTitles.map((title, index) => ({ title, high: false, index }))
  ];

  await Promise.all(
    recSeeds.map(({ title, high, index }, seedIndex) => {
      const [targetEntityType, targetEntityId] = targets[index % targets.length];
      const id = `quality-rec-${high ? "high" : "low"}-${String(index + 1).padStart(2, "0")}`;
      const confidenceScore = high ? Number((0.86 + index * 0.01).toFixed(2)) : Number((0.42 + index * 0.015).toFixed(2));
      const evidenceStrength = high ? Number((0.82 + index * 0.01).toFixed(2)) : Number((0.24 + index * 0.02).toFixed(2));
      const missingEvidence = high ? [] : index % 2 === 0 ? ["Source URL or citation", "Detailed reasoning"] : ["Source record link", "Expected impact"];
      const duplicateRisk = index < 4 ? Number(((high ? 0.56 : 0.62) + index * 0.02).toFixed(2)) : high ? 0.12 : 0.22;
      const qualityScore = high ? 90 + (index % 6) : 44 + (index % 8);
      const confidenceExplanation = `${title} is ${high ? "high" : "low"} confidence with ${Math.round(evidenceStrength * 100)}% evidence strength.`;
      return prisma.aIRecommendation.upsert({
        where: { id },
        update: { title, confidenceScore, qualityScore, evidenceStrength, missingEvidence, duplicateRisk, confidenceExplanation, reviewedAt: dateFromNow(-(seedIndex % 5)), reviewedBy: high ? "VGOS Quality Layer" : "Needs Evidence Review" },
        create: {
          ...tenant,
          id,
          title,
          description: `${title} seeded for VGOS v5.3 intelligence quality review.`,
          source: "VGOS Quality Layer",
          url: "https://vidmaker.com",
          owner: "Growth Intelligence",
          recommendationType: types[index],
          targetEntityType,
          targetEntityId,
          suggestedAction: title,
          reasoning: "Seeded to exercise confidence scoring, evidence strength, duplicate risk, and missing evidence review surfaces.",
          confidenceScore,
          qualityScore,
          evidenceStrength,
          missingEvidence,
          duplicateRisk,
          confidenceExplanation,
          reviewedAt: dateFromNow(-(seedIndex % 5)),
          reviewedBy: high ? "VGOS Quality Layer" : "Needs Evidence Review",
          priority: index < 3 ? Priority.CRITICAL : Priority.HIGH,
          status: Status.RESEARCHING,
          generatedBy: "VGOS Quality Layer"
        }
      });
    })
  );

  await Promise.all(Array.from({ length: 21 }, (_, index) => {
    const missingEvidence = index % 5 === 0 ? ["Recent performance evidence"] : [];
    return prisma.recommendedAction.updateMany({
      where: { id: `action-${String(index + 1).padStart(2, "0")}` },
      data: {
        confidenceScore: Number((0.7 + Math.min(index, 12) * 0.015).toFixed(2)),
        qualityScore: index < 10 ? 88 - index : index % 8 === 0 ? 58 : 72,
        evidenceStrength: Number((0.55 + (index % 6) * 0.05).toFixed(2)),
        missingEvidence,
        duplicateRisk: index < 8 ? Number((0.52 + index * 0.02).toFixed(2)) : 0.16,
        confidenceExplanation: missingEvidence.length ? "Action needs more evidence before enterprise execution." : "Action has enough evidence for Mission Control review.",
        reviewedAt: dateFromNow(-(index % 6)),
        reviewedBy: index < 5 ? "Mission Control" : "VGOS Quality Layer"
      }
    });
  }));

  const auditSeeds = [
    ["MISSION_CHANGED", "Mission", "mission-product-page-to-video-proof", "Growth Lead"],
    ["PLAN_CHANGED", "Plan", "plan-product-page-demo-sprint", "Planning Engine"],
    ["EXECUTION_CHANGED", "ExecutionItem", "execution-product-page-demo", "Execution Engine"],
    ["MEASUREMENT_CREATED", "Measurement", "measurement-demo-signups-week-1", "Measurement Engine"],
    ["RECOMMENDATION_REVIEWED", "AIRecommendation", "ai-rec-01", "Growth Intelligence Lead"],
    ["RECOMMENDATION_CREATED", "AIRecommendation", "quality-rec-high-01", "VGOS Quality Layer"],
    ["RECOMMENDATION_CREATED", "AIRecommendation", "quality-rec-low-01", "VGOS Quality Layer"],
    ["DUPLICATE_RISK_FLAGGED", "RecommendedAction", "action-01", "VGOS Quality Layer"],
    ["MISSING_EVIDENCE_FLAGGED", "RecommendedAction", "action-07", "VGOS Quality Layer"],
    ["CONNECTOR_STATUS_CHANGED", "Connector", "connector-gsc", "Connector Engine"],
    ["SIGNAL_NORMALIZED", "NormalizedSignal", "normalized-signal-01", "Normalization Engine"],
    ["SIGNAL_ROUTED", "NormalizedSignal", "normalized-signal-09", "Signal Router"],
    ["INTELLIGENCE_PROCESSED", "IntelligenceObject", "intelligence-product-page-to-video-demo", "Intelligence Pipeline"],
    ["KNOWLEDGE_OBJECT_CREATED", "KnowledgeObject", "knowledge-product-page-to-video", "Knowledge Layer"],
    ["STRATEGY_ADJUSTMENT_ACCEPTED", "StrategyAdjustment", "strategy-adjustment-05", "Growth Lead"],
    ["STRATEGY_ADJUSTMENT_REJECTED", "StrategyAdjustment", "strategy-adjustment-04", "Growth Lead"],
    ["MISSION_HEALTH_CALCULATED", "Mission", "mission-product-page-to-video-proof", "Mission Engine"],
    ["MANUAL_EDIT", "ContentAsset", "content-blog-004", "Content Lead"],
    ["MANUAL_EDIT", "DirectorySubmission", "directory-ai-video-tools", "Authority Lead"],
    ["RECOMMENDATION_REVIEWED", "RecommendedAction", "action-03", "Mission Control"]
  ] as const;

  await Promise.all(auditSeeds.map(([action, entityType, entityId, actor], index) =>
    prisma.auditLog.upsert({
      where: { id: `audit-log-${String(index + 1).padStart(2, "0")}` },
      update: { actor, action, entityType, entityId, metadata: { release: "v5.3", surface: index < 6 ? "Mission Control" : "Quality Layer" } },
      create: {
        id: `audit-log-${String(index + 1).padStart(2, "0")}`,
        workspaceId,
        actor,
        action,
        entityType,
        entityId,
        before: index % 4 === 0 ? { status: "RESEARCHING" } : undefined,
        after: { status: index % 5 === 0 ? "IN_PROGRESS" : "REVIEWED" },
        metadata: { release: "v5.3", surface: index < 6 ? "Mission Control" : "Quality Layer", summary: `${action} recorded for ${entityType}.` },
        createdAt: dateFromNow(-index)
      }
    })
  ));
}
async function main() {
  await seedFoundation();
  const personas = await seedPersonas();
  await seedEntities();
  await seedMarketObjects(personas);
  await seedIntelligence();
  await seedKnowledgeGraph();
  await seedRecommendations();
  await seedIntelligenceObjects();
  await seedKernel();
  await seedBetaFoundation();
  await seedPlanningEngine();
  await seedEvents();
  await seedRecommendedActions();
  await seedExecutionEngine();
  await seedMeasurementLearningEngine();
  await seedMissionEngine();
  await seedConnectedIntelligence();
  await seedIntelligenceQualityHardening();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
