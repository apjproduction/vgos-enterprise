import {
  createScopedId,
  orgId,
  type Plan,
  type PlanItem,
  type PredictedOutcome
} from "@/lib/vgos-data";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function estimateImpact(item: Partial<PlanItem> & Record<string, unknown>) {
  const priorityBoost = item.priority === "CRITICAL" ? 30 : item.priority === "HIGH" ? 22 : item.priority === "MEDIUM" ? 14 : 8;
  const typeBoost = ["DEMO", "BLOG", "DIRECTORY_SUBMISSION", "FAQ", "LANDING_PAGE_UPDATE"].includes(String(item.itemType))
    ? 24
    : 16;
  const sourceBoost = item.sourceType ? 10 : 4;
  return clamp(priorityBoost + typeBoost + sourceBoost + 24);
}

export function estimateEffort(item: Partial<PlanItem> & Record<string, unknown>) {
  const heavyTypes = ["DEMO", "BLOG", "YOUTUBE_SCRIPT", "LANDING_PAGE_UPDATE", "EXPERIMENT"];
  const mediumTypes = ["FOUNDER_POST", "COMPANY_POST", "DIRECTORY_SUBMISSION", "NEWSLETTER"];
  if (heavyTypes.includes(String(item.itemType))) return 5;
  if (mediumTypes.includes(String(item.itemType))) return 3;
  return 2;
}

export function calculateConfidence(input: {
  plan?: Partial<Plan>;
  items?: PlanItem[];
  constraints?: unknown[];
}) {
  const base = input.plan?.confidenceScore ?? 0.72;
  const itemBoost = Math.min((input.items?.length ?? 0) * 0.006, 0.12);
  const constraintPenalty = Math.min((input.constraints?.length ?? 0) * 0.035, 0.2);
  return Number(Math.max(0.35, Math.min(0.95, base + itemBoost - constraintPenalty)).toFixed(2));
}

export function predictPlanOutcomes(
  plan: Plan,
  items: PlanItem[],
  organizationId = orgId
): PredictedOutcome[] {
  const blogCount = items.filter((item) => item.itemType === "BLOG").length;
  const directoryCount = items.filter((item) => item.itemType === "DIRECTORY_SUBMISSION").length;
  const socialCount = items.filter((item) =>
    ["FOUNDER_POST", "COMPANY_POST", "X_THREAD", "PINTEREST_PIN", "NEWSLETTER", "YOUTUBE_SCRIPT"].includes(item.itemType)
  ).length;
  const demoCount = items.filter((item) => item.itemType === "DEMO").length;
  const faqCount = items.filter((item) => item.itemType === "FAQ").length;
  const confidenceScore = calculateConfidence({ plan, items });
  const now = new Date().toISOString();

  return [
    ["content assets published", blogCount + socialCount + faqCount, "Content and answer assets are counted from scheduled plan items."],
    ["directory approvals", Math.ceil(directoryCount * 0.7), "Directory approvals use a conservative rule-based conversion estimate."],
    ["potential backlinks", Math.ceil(directoryCount * 0.5), "Backlink potential follows directory and outreach volume."],
    ["product demo assets", demoCount, "Demo assets are counted directly from demo plan items."],
    ["AEO questions answered", faqCount * 2, "Each FAQ item is expected to answer roughly two adjacent questions."]
  ]
    .filter(([, predictedValue]) => Number(predictedValue) > 0)
    .map(([metricName, predictedValue, rationale], index) => ({
      id: createScopedId("predicted-outcome"),
      organizationId,
      workspaceId: plan.workspaceId,
      planId: plan.id,
      metricName: String(metricName),
      predictedValue: Number(predictedValue),
      confidenceScore: Number(Math.max(0.4, confidenceScore - index * 0.03).toFixed(2)),
      rationale: String(rationale),
      createdAt: now,
      updatedAt: now
    }));
}

