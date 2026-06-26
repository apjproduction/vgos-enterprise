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
      name: "VidMaker Growth OS"
    },
    create: {
      id: workspaceId,
      name: "VidMaker Growth OS",
      slug: "vidmaker-growth-os",
      organizationId: organization.id
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
    questions: [questionA, questionB],
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
          embeddingVector: index < 10 ? [importanceScore / 100, confidenceScore, index / 25] : null,
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
          eventType,
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
        const relation =
          relationField.length > 0
            ? {
                [relationField]: sourceId
              }
            : {};

        return prisma.recommendedAction.upsert({
          where: { id: `action-${String(index + 1).padStart(2, "0")}` },
          update: {
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
  await seedEvents();
  await seedRecommendedActions();
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
