import { createScopedId, orgId, type ApprovalRequest, type ExecutionItem } from "@/lib/vgos-data";
import type { ApprovalDecision, ApprovalInput, ExecutionContext } from "@/kernel/execution/execution-types";

function nowFrom(context?: Partial<ExecutionContext>) {
  return context?.now ?? new Date().toISOString();
}

export function requestApproval(input: ApprovalInput, context: ExecutionContext): ApprovalRequest {
  const now = nowFrom(context);
  return {
    id: createScopedId("approval-request"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    executionItemId: input.executionItemId,
    title: input.title,
    description: input.description ?? input.title,
    approvalType: input.approvalType ?? "CONTENT_APPROVAL",
    status: "REQUESTED",
    requestedBy: input.requestedBy ?? "Growth",
    reviewer: input.reviewer ?? "Approver",
    requestedAt: now,
    reviewedAt: undefined,
    decisionNotes: undefined,
    createdAt: now,
    updatedAt: now
  };
}

function decideApproval(request: ApprovalRequest, decision: ApprovalDecision): ApprovalRequest {
  const now = new Date().toISOString();
  return {
    ...request,
    status: decision.status,
    reviewedAt: now,
    decisionNotes: decision.decisionNotes,
    updatedAt: now
  };
}

export function approveExecution(item: ExecutionItem, request: ApprovalRequest) {
  return {
    item: { ...item, status: "APPROVED" as const, updatedAt: new Date().toISOString() },
    approval: decideApproval(request, { status: "APPROVED", decisionNotes: "Approved for execution." })
  };
}

export function rejectExecution(item: ExecutionItem, request: ApprovalRequest, decisionNotes = "Rejected.") {
  return {
    item: { ...item, status: "NEEDS_APPROVAL" as const, updatedAt: new Date().toISOString() },
    approval: decideApproval(request, { status: "REJECTED", decisionNotes })
  };
}

export function requestChanges(item: ExecutionItem, request: ApprovalRequest, decisionNotes = "Changes requested.") {
  return {
    item: { ...item, status: "NEEDS_APPROVAL" as const, updatedAt: new Date().toISOString() },
    approval: decideApproval(request, { status: "CHANGES_REQUESTED", decisionNotes })
  };
}

export function getPendingApprovals(approvals: ApprovalRequest[]) {
  return approvals.filter((approval) => approval.status === "REQUESTED" || approval.status === "CHANGES_REQUESTED");
}

export function getApprovalHistory(approvals: ApprovalRequest[], executionItemId: string) {
  return approvals
    .filter((approval) => approval.executionItemId === executionItemId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}
