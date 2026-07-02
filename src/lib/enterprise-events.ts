export type EnterpriseEventType =
  | "GITHUB_COMMIT_CREATED"
  | "GITHUB_PULL_REQUEST_OPENED"
  | "GITHUB_PULL_REQUEST_MERGED"
  | "VERCEL_DEPLOYMENT_CREATED"
  | "VERCEL_DEPLOYMENT_SUCCEEDED"
  | "VERCEL_DEPLOYMENT_FAILED"
  | "FOUNDER_REFLECTION_SUBMITTED"
  | "MISSION_UPDATED"
  | "DECISION_ACCEPTED"
  | "DECISION_POSTPONED"
  | "CONTENT_PUBLISHED"
  | "PRODUCT_DEMO_COMPLETED"
  | "CUSTOMER_FEEDBACK_RECEIVED";

export type EnterpriseEventSource =
  | "GITHUB"
  | "VERCEL"
  | "FOUNDER_OS"
  | "MISSION_CONTROL"
  | "DECISION_CENTER"
  | "CONTENT"
  | "PRODUCT"
  | "CUSTOMER";

export type EnterpriseEventSeverity = "INFO" | "POSITIVE" | "WARNING" | "CRITICAL";

export type EnterpriseEvent = {
  id: string;
  enterpriseId: string;
  productId: string | null;
  type: EnterpriseEventType;
  source: EnterpriseEventSource;
  severity: EnterpriseEventSeverity;
  title: string;
  summary: string;
  occurredAt: string;
  payload: Record<string, unknown>;
};

export function getDemoEnterpriseEvents(): EnterpriseEvent[] {
  const events: EnterpriseEvent[] = [
    {
      id: "evt-founder-os-alpha-2-implemented",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "GITHUB_COMMIT_CREATED",
      source: "GITHUB",
      severity: "POSITIVE",
      title: "Founder OS Alpha.2 was completed.",
      summary:
        "Founder OS gained the EnterpriseState foundation and kept the daily founder workspace stable.",
      occurredAt: "2026-07-01T20:45:00.000Z",
      payload: {
        repository: "apj-labs/vgos-enterprise",
        branch: "main",
        capability: "Enterprise State Foundation",
        release: "Founder OS Alpha.2"
      }
    },
    {
      id: "evt-vercel-deployment-succeeded-founder-os",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "VERCEL_DEPLOYMENT_SUCCEEDED",
      source: "VERCEL",
      severity: "POSITIVE",
      title: "Vercel deployment succeeded.",
      summary:
        "The current Founder OS build deployed cleanly, improving confidence in the operating surface.",
      occurredAt: "2026-07-01T21:05:00.000Z",
      payload: {
        environment: "production",
        project: "vgos-enterprise",
        status: "READY"
      }
    },
    {
      id: "evt-vidmaker-product-demo-pending",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "MISSION_UPDATED",
      source: "MISSION_CONTROL",
      severity: "WARNING",
      title: "Product demo remains pending.",
      summary:
        "VidMaker still needs the product-page-to-video proof asset before broader launch promotion.",
      occurredAt: "2026-07-02T09:15:00.000Z",
      payload: {
        mission: "Product Page to Video Proof",
        demoStatus: "PENDING",
        proofAssetRisk: true
      }
    },
    {
      id: "evt-founder-publishing-inactive",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "FOUNDER_REFLECTION_SUBMITTED",
      source: "CONTENT",
      severity: "WARNING",
      title: "Founder publishing remains inactive.",
      summary:
        "The founder channel has been quiet for several days, reducing compounding launch momentum.",
      occurredAt: "2026-07-02T09:25:00.000Z",
      payload: {
        channel: "Founder LinkedIn",
        inactiveDays: 4,
        lastPublishedAt: "2026-06-28T16:00:00.000Z"
      }
    },
    {
      id: "evt-vidmaker-launch-readiness-improved",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "MISSION_UPDATED",
      source: "MISSION_CONTROL",
      severity: "POSITIVE",
      title: "VidMaker launch readiness improved.",
      summary:
        "The launch path is clearer after proof-first priorities and Founder OS state were aligned.",
      occurredAt: "2026-07-02T10:10:00.000Z",
      payload: {
        mission: "VidMaker Launch Readiness",
        readinessTrend: "IMPROVING",
        readinessScore: 72
      }
    },
    {
      id: "evt-decision-proof-before-promotion",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "DECISION_ACCEPTED",
      source: "DECISION_CENTER",
      severity: "POSITIVE",
      title: "Decision accepted: proof before promotion.",
      summary:
        "VidMaker should finish visible proof before expanding Product Hunt, founder, or launch promotion.",
      occurredAt: "2026-07-02T10:35:00.000Z",
      payload: {
        decision: "Proof before promotion",
        acceptedOption: "Complete product demo before broad promotion",
        confidence: 0.86
      }
    },
    {
      id: "evt-reflection-restart-publishing",
      enterpriseId: "workspace-apj-labs",
      productId: "vidmaker",
      type: "FOUNDER_REFLECTION_SUBMITTED",
      source: "FOUNDER_OS",
      severity: "INFO",
      title: "Reflection submitted: Founder OS should help restart publishing.",
      summary:
        "Founder OS needs to turn product proof into a simple publishing rhythm instead of another planning surface.",
      occurredAt: "2026-07-02T10:50:00.000Z",
      payload: {
        reflectionTheme: "Restart founder publishing",
        requestedSupport: "Convert proof progress into founder-led content"
      }
    }
  ];

  return events.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt));
}
