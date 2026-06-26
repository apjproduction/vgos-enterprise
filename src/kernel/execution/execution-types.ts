import type {
  ApprovalRequest,
  ApprovalStatus,
  ApprovalType,
  BlockerType,
  ConstraintSeverity,
  ExecutionBlocker,
  ExecutionEvidence,
  ExecutionItem,
  ExecutionResult,
  ExecutionStatus,
  ExecutionType,
  EvidenceType,
  PlatformState
} from "@/lib/vgos-data";

export type ExecutionContext = {
  workspaceId: string;
  organizationId?: string;
  now?: string;
};

export type CreateExecutionInput = {
  title: string;
  description?: string;
  executionType?: ExecutionType;
  status?: ExecutionStatus;
  priority?: ExecutionItem["priority"];
  owner?: string;
  dueDate?: string;
  sourceType?: string;
  sourceId?: string;
  planId?: string;
  planItemId?: string;
  recommendedActionId?: string;
  workflowRunId?: string;
  objectiveId?: string;
  campaignId?: string;
  expectedImpact?: string;
  notes?: string;
};

export type ExecutionHealth = {
  score: number;
  ready: number;
  inProgress: number;
  blocked: number;
  needsApproval: number;
  completed: number;
  evidenceCount: number;
  resultCount: number;
  rationale: string;
};

export type AddEvidenceInput = {
  executionItemId: string;
  evidenceType?: EvidenceType;
  title: string;
  url?: string;
  description?: string;
  uploadedAssetUrl?: string;
};

export type AddBlockerInput = {
  executionItemId: string;
  title: string;
  description?: string;
  blockerType?: BlockerType;
  severity?: ConstraintSeverity;
  owner?: string;
};

export type ApprovalInput = {
  executionItemId: string;
  title: string;
  description?: string;
  approvalType?: ApprovalType;
  requestedBy?: string;
  reviewer?: string;
};

export type ExecutionBundle = {
  item: ExecutionItem;
  evidence: ExecutionEvidence[];
  blockers: ExecutionBlocker[];
  approvals: ApprovalRequest[];
  results: ExecutionResult[];
};

export type ExecutionStateSlice = Pick<
  PlatformState,
  "executionItems" | "executionEvidence" | "executionBlockers" | "approvalRequests" | "executionResults"
>;

export type ApprovalDecision = {
  status: ApprovalStatus;
  decisionNotes?: string;
};
