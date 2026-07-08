import { createScopedId } from "@/lib/vgos-data";
import type {
  CommitmentEscalation,
  CommitmentEscalationStatus,
  CommitmentEscalationType,
  CommitmentRiskLevel,
  CommitmentRiskProfile,
  InstructionResult
} from "@/kernel/commitments/commitment-types";

function nowIso() {
  return new Date().toISOString();
}

function escalationTypeFromRisk(profile: CommitmentRiskProfile): CommitmentEscalationType {
  if (profile.ownershipRisk >= 0.7) return "OWNER";
  if (profile.evidenceRisk >= 0.7) return "EVIDENCE";
  if (profile.dependencyRisk >= 0.7) return "BLOCKER";
  if (profile.driftRisk >= 0.7) return "DRIFT";
  if (profile.deadlineRisk >= 0.65) return "DEADLINE";
  if (profile.riskLevel === "CRITICAL") return "QUALITY";
  return "CUSTOM";
}

function recipientForType(type: CommitmentEscalationType) {
  if (type === "OWNER") return "Founder/Product";
  if (type === "EVIDENCE") return "Growth Intelligence";
  if (type === "BLOCKER") return "Execution Owner";
  if (type === "DRIFT") return "Strategy Owner";
  if (type === "DEADLINE") return "Operating Lead";
  return "VGOS Owner";
}

export function createCommitmentEscalation(input: {
  commitmentId: string;
  workspaceId: string;
  reason: string;
  severity?: CommitmentRiskLevel;
  escalationType?: CommitmentEscalationType;
  recommendedRecipient?: string;
  riskProfile?: CommitmentRiskProfile;
  now?: string;
}): InstructionResult<CommitmentEscalation> {
  if (!input.commitmentId) return { success: false, error: "commitmentId is required." };
  if (!input.reason.trim()) return { success: false, error: "Escalation reason is required." };
  const type = input.escalationType ?? (input.riskProfile ? escalationTypeFromRisk(input.riskProfile) : "CUSTOM");
  const date = input.now ?? nowIso();

  return {
    success: true,
    data: {
      id: createScopedId("commitment-escalation"),
      commitmentId: input.commitmentId,
      workspaceId: input.workspaceId,
      escalationType: type,
      reason: input.reason,
      severity: input.severity ?? input.riskProfile?.riskLevel ?? "HIGH",
      recommendedRecipient: input.recommendedRecipient ?? recipientForType(type),
      status: "OPEN",
      createdAt: date,
      resolvedAt: null
    }
  };
}

export function resolveCommitmentEscalation(
  escalation: CommitmentEscalation,
  status: Exclude<CommitmentEscalationStatus, "OPEN"> = "RESOLVED",
  resolvedAt = nowIso()
): InstructionResult<CommitmentEscalation> {
  return {
    success: true,
    data: {
      ...escalation,
      status,
      resolvedAt: status === "RESOLVED" ? resolvedAt : escalation.resolvedAt ?? null
    }
  };
}
