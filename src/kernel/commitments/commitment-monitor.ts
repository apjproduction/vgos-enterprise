import type {
  CommitmentLike,
  CommitmentMonitoringFrequency,
  CommitmentMonitoringPlan,
  InstructionResult
} from "@/kernel/commitments/commitment-types";

function nowIso() {
  return new Date().toISOString();
}

function inferFrequency(commitment: CommitmentLike): CommitmentMonitoringFrequency {
  const text = `${commitment.title} ${commitment.description ?? ""}`.toLowerCase();
  if (/demo|launch|product hunt|critical/.test(text)) return "TWICE_WEEKLY";
  if (/directory|submission|approval/.test(text)) return "WEEKLY";
  return "WEEKLY";
}

export function createCommitmentMonitoringPlan(input: {
  commitment: CommitmentLike;
  monitoringFrequency?: CommitmentMonitoringFrequency;
  leadingIndicators?: string[];
  laggingIndicators?: string[];
  riskTriggers?: string[];
  reviewCadence?: string;
  owner?: string;
  now?: string;
}): InstructionResult<CommitmentMonitoringPlan> {
  const commitment = input.commitment;
  if (!commitment.id) return { success: false, error: "commitment.id is required." };
  const date = input.now ?? nowIso();
  const text = `${commitment.title} ${commitment.description ?? ""}`.toLowerCase();
  const leadingIndicators = input.leadingIndicators ?? [
    /demo|proof/.test(text) ? "Demo production progress" : "",
    /directory|submission/.test(text) ? "Directory approval movement" : "",
    /faq|content|founder/.test(text) ? "Draft and approval progress" : "",
    "Owner update received"
  ].filter(Boolean);
  const laggingIndicators = input.laggingIndicators ?? [
    /demo|proof/.test(text) ? "Qualified replies or signups influenced by demo proof" : "",
    /directory|submission/.test(text) ? "Qualified referral traffic or backlink approvals" : "",
    /faq|content|founder/.test(text) ? "Search, AEO, or engagement lift" : "",
    "Outcome captured in reflection"
  ].filter(Boolean);

  return {
    success: true,
    data: {
      commitmentId: commitment.id,
      workspaceId: commitment.workspaceId,
      monitoringFrequency: input.monitoringFrequency ?? inferFrequency(commitment),
      leadingIndicators,
      laggingIndicators,
      riskTriggers: input.riskTriggers ?? [
        "Owner update missing",
        "Evidence not linked",
        "Deadline changes without replan",
        "Execution diverges from decision rationale"
      ],
      reviewCadence: input.reviewCadence ?? "Review during Executive Brief until outcome is captured.",
      owner: input.owner ?? commitment.owner ?? "VGOS",
      createdAt: date,
      updatedAt: date
    },
    warnings: leadingIndicators.length && laggingIndicators.length ? undefined : ["Monitoring plan needs clearer indicators."]
  };
}

export function updateCommitmentMonitoringPlan(
  plan: CommitmentMonitoringPlan,
  updates: Partial<Omit<CommitmentMonitoringPlan, "commitmentId" | "workspaceId" | "createdAt">>
): InstructionResult<CommitmentMonitoringPlan> {
  return {
    success: true,
    data: {
      ...plan,
      ...updates,
      updatedAt: updates.updatedAt ?? nowIso()
    }
  };
}
