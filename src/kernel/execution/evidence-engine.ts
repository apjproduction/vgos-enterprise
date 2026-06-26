import { createScopedId, orgId, type ExecutionEvidence, type ExecutionItem } from "@/lib/vgos-data";
import type { AddEvidenceInput, ExecutionContext } from "@/kernel/execution/execution-types";

function nowFrom(context?: Partial<ExecutionContext>) {
  return context?.now ?? new Date().toISOString();
}

export function addEvidence(input: AddEvidenceInput, context: ExecutionContext): ExecutionEvidence {
  const now = nowFrom(context);
  return {
    id: createScopedId("execution-evidence"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    executionItemId: input.executionItemId,
    evidenceType: input.evidenceType ?? "NOTE",
    title: input.title,
    url: input.url,
    description: input.description ?? input.title,
    uploadedAssetUrl: input.uploadedAssetUrl,
    capturedAt: now,
    createdAt: now,
    updatedAt: now
  };
}

export function getEvidenceForExecution(evidence: ExecutionEvidence[], executionItemId: string) {
  return evidence
    .filter((item) => item.executionItemId === executionItemId)
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
}

export function validateCompletionEvidence(item: ExecutionItem, evidence: ExecutionEvidence[]) {
  const linkedEvidence = getEvidenceForExecution(evidence, item.id);
  const hasUrl = linkedEvidence.some((record) => record.url || record.evidenceType === "URL");
  const hasProofType = linkedEvidence.some((record) =>
    ["BLOG_LIVE", "SOCIAL_POST", "DIRECTORY_CONFIRMATION", "BACKLINK_LIVE", "COMMENT_REPLY", "DEMO_ASSET", "METRIC"].includes(record.evidenceType)
  );
  return {
    valid: linkedEvidence.length > 0 && (hasUrl || hasProofType),
    evidenceCount: linkedEvidence.length,
    reason:
      linkedEvidence.length === 0
        ? "No evidence has been attached."
        : hasUrl || hasProofType
          ? "Completion evidence is sufficient."
          : "Evidence exists but needs a URL or proof-specific evidence type."
  };
}

export function createEvidenceFromUrl(executionItemId: string, url: string, context: ExecutionContext) {
  return addEvidence(
    {
      executionItemId,
      evidenceType: "URL",
      title: "Execution URL evidence",
      url,
      description: `URL evidence captured for ${executionItemId}.`
    },
    context
  );
}

export function createMetricEvidence(
  executionItemId: string,
  metricName: string,
  metricValue: number,
  context: ExecutionContext
) {
  return addEvidence(
    {
      executionItemId,
      evidenceType: "METRIC",
      title: `${metricName}: ${metricValue}`,
      description: `Metric evidence captured for ${metricName}.`
    },
    context
  );
}
