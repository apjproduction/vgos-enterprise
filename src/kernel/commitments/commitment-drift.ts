import { createScopedId } from "@/lib/vgos-data";
import type {
  CommitmentDriftSignal,
  CommitmentLike,
  CommitmentRiskLevel,
  InstructionResult
} from "@/kernel/commitments/commitment-types";

function nowIso() {
  return new Date().toISOString();
}

function signal(input: {
  commitment: CommitmentLike;
  driftType: CommitmentDriftSignal["driftType"];
  severity: CommitmentRiskLevel;
  description: string;
  originalIntent: string;
  currentState: string;
  evidenceIds?: string[];
  now?: string;
}): CommitmentDriftSignal {
  return {
    id: createScopedId("commitment-drift"),
    commitmentId: input.commitment.id,
    workspaceId: input.commitment.workspaceId,
    driftType: input.driftType,
    severity: input.severity,
    description: input.description,
    originalIntent: input.originalIntent,
    currentState: input.currentState,
    evidenceIds: input.evidenceIds ?? [],
    detectedAt: input.now ?? nowIso()
  };
}

export function detectCommitmentDrift(input: {
  commitment: CommitmentLike;
  validatedStrategy?: string;
  currentState?: string;
  evidenceIds?: string[];
  now?: string;
}): InstructionResult<CommitmentDriftSignal[]> {
  const commitment = input.commitment;
  if (!commitment.id) return { success: false, error: "commitment.id is required." };
  const text = `${commitment.title} ${commitment.description ?? ""}`.toLowerCase();
  const strategy = input.validatedStrategy?.toLowerCase() ?? "";
  const currentState = input.currentState ?? commitment.status ?? "COMMITTED";
  const signals: CommitmentDriftSignal[] = [];

  if (/generic director|all submissions|continue.*director/.test(text) && /niche|ai|video|productivity|pause low-confidence/.test(strategy)) {
    signals.push(signal({
      commitment,
      driftType: "STRATEGIC_DRIFT",
      severity: "HIGH",
      description: "Commitment conflicts with the validated strategy to narrow directory work to niche AI/video/productivity directories.",
      originalIntent: strategy || "Focus on validated niche directory authority.",
      currentState: commitment.title,
      evidenceIds: input.evidenceIds,
      now: input.now
    }));
  }

  if (!commitment.owner || ["VGOS", "TBD", "Unassigned"].includes(commitment.owner)) {
    signals.push(signal({
      commitment,
      driftType: "OWNER_DRIFT",
      severity: "MEDIUM",
      description: "Ownership is unclear, so accountability can drift during execution.",
      originalIntent: "Commitment should have a named accountable owner.",
      currentState,
      evidenceIds: input.evidenceIds,
      now: input.now
    }));
  }

  if (commitment.dueDate && new Date(commitment.dueDate).getTime() < (input.now ? new Date(input.now).getTime() : Date.now()) && commitment.status !== "COMPLETED") {
    signals.push(signal({
      commitment,
      driftType: "DEADLINE_DRIFT",
      severity: "HIGH",
      description: "Commitment due date has passed without completion.",
      originalIntent: `Due by ${commitment.dueDate}.`,
      currentState,
      evidenceIds: input.evidenceIds,
      now: input.now
    }));
  }

  if (!commitment.evidenceIds?.length && /evidence|proof|demo|directory|faq|authority/.test(text)) {
    signals.push(signal({
      commitment,
      driftType: "EVIDENCE_DRIFT",
      severity: "MEDIUM",
      description: "Execution is moving without linked evidence traceability.",
      originalIntent: "Commitment should preserve evidence from the originating decision.",
      currentState,
      evidenceIds: input.evidenceIds,
      now: input.now
    }));
  }

  return {
    success: true,
    data: signals,
    warnings: signals.map((item) => item.description)
  };
}
