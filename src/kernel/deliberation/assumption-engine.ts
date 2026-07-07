import { createScopedId, orgId } from "@/lib/vgos-data";
import type {
  Assumption,
  AssumptionStatus,
  AssumptionType,
  InstructionResult
} from "@/kernel/deliberation/deliberation-types";

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function inferAssumptionType(statement: string): AssumptionType {
  const lower = statement.toLowerCase();
  if (/seo|directory|market|demand|buyer|traffic/.test(lower)) return "MARKET";
  if (/product hunt|user|customer|buyer|founder/.test(lower)) return "CUSTOMER";
  if (/demo|product|feature|walkthrough|maturity/.test(lower)) return "PRODUCT";
  if (/conversion|content|campaign|roi|growth/.test(lower)) return "GROWTH";
  if (/capacity|calendar|delay|approval|execution/.test(lower)) return "OPERATIONAL";
  if (/strategy|priority|positioning|channel/.test(lower)) return "STRATEGIC";
  return "CUSTOM";
}

export function createAssumption(input: {
  workspaceId: string;
  deliberationId: string;
  statement: string;
  assumptionType?: AssumptionType;
  confidenceScore?: number;
  evidenceIds?: string[];
  status?: AssumptionStatus;
  organizationId?: string;
  now?: string;
}): Assumption {
  const date = input.now ?? nowIso();
  return {
    id: createScopedId("deliberation-assumption"),
    organizationId: input.organizationId ?? orgId,
    workspaceId: input.workspaceId,
    deliberationId: input.deliberationId,
    statement: input.statement,
    assumptionType: input.assumptionType ?? inferAssumptionType(input.statement),
    confidenceScore: clamp01(input.confidenceScore ?? 0.62),
    evidenceIds: input.evidenceIds ?? [],
    status: input.status ?? (input.evidenceIds?.length ? "SUPPORTED" : "UNTESTED"),
    createdAt: date,
    updatedAt: date
  };
}

export function addAssumption(input: Parameters<typeof createAssumption>[0]): InstructionResult<Assumption> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.deliberationId) return { success: false, error: "deliberationId is required." };
  if (!input.statement.trim()) return { success: false, error: "Assumption statement is required." };
  const assumption = createAssumption(input);
  return {
    success: true,
    data: assumption,
    warnings: assumption.evidenceIds.length === 0 ? ["Assumption has no linked evidence."] : undefined
  };
}

export function updateAssumptionStatus(
  assumption: Assumption,
  status: AssumptionStatus,
  evidenceIds: string[] = assumption.evidenceIds
): Assumption {
  return {
    ...assumption,
    status,
    evidenceIds: [...new Set(evidenceIds)],
    confidenceScore:
      status === "VALIDATED"
        ? clamp01(Math.max(assumption.confidenceScore, 0.78))
        : status === "CHALLENGED"
          ? clamp01(Math.min(assumption.confidenceScore, 0.55))
          : status === "INVALIDATED"
            ? clamp01(Math.min(assumption.confidenceScore, 0.3))
            : assumption.confidenceScore,
    updatedAt: nowIso()
  };
}

export function challengeAssumption(
  assumption: Assumption,
  evidenceIds: string[] = assumption.evidenceIds
): InstructionResult<Assumption> {
  return {
    success: true,
    data: updateAssumptionStatus(assumption, "CHALLENGED", evidenceIds),
    warnings: evidenceIds.length === 0 ? ["Challenged assumption has no counter-evidence linked yet."] : undefined
  };
}

export function validateAssumption(
  assumption: Assumption,
  evidenceIds: string[] = assumption.evidenceIds
): InstructionResult<Assumption> {
  if (evidenceIds.length === 0) {
    return {
      success: true,
      data: updateAssumptionStatus(assumption, "SUPPORTED", evidenceIds),
      warnings: ["Assumption is only supported until evidence is linked."]
    };
  }
  return {
    success: true,
    data: updateAssumptionStatus(assumption, "VALIDATED", evidenceIds)
  };
}

export function weakestAssumptions(assumptions: Assumption[]) {
  return [...assumptions].sort((a, b) => {
    const statusPenalty = (item: Assumption) => (item.status === "UNTESTED" ? 0 : item.status === "CHALLENGED" ? 1 : 2);
    return statusPenalty(a) - statusPenalty(b) || a.confidenceScore - b.confidenceScore || a.evidenceIds.length - b.evidenceIds.length;
  });
}
