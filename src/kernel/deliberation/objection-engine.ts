import { createScopedId, orgId } from "@/lib/vgos-data";
import type {
  InstructionResult,
  Objection,
  ObjectionStatus,
  ObjectionType
} from "@/kernel/deliberation/deliberation-types";
import type { Priority } from "@/lib/vgos-data";

function nowIso() {
  return new Date().toISOString();
}

function inferObjectionType(statement: string): ObjectionType {
  const lower = statement.toLowerCase();
  if (/evidence|proof|validated|confidence/.test(lower)) return "EVIDENCE_GAP";
  if (/risk|trust|maturity|quality/.test(lower)) return "RISK";
  if (/capacity|resource|calendar|delay/.test(lower)) return "RESOURCE";
  if (/timing|window|lag|approval/.test(lower)) return "TIMING";
  if (/alternative|option|compare/.test(lower)) return "OPTION_GAP";
  if (/constraint|blocked|dependency/.test(lower)) return "CONSTRAINT";
  return "CUSTOM";
}

export function raiseObjection(input: {
  workspaceId: string;
  deliberationId: string;
  raisedBy: string;
  statement: string;
  objectionType?: ObjectionType;
  severity?: Priority;
  evidenceIds?: string[];
  organizationId?: string;
  now?: string;
}): InstructionResult<Objection> {
  if (!input.workspaceId) return { success: false, error: "workspaceId is required." };
  if (!input.deliberationId) return { success: false, error: "deliberationId is required." };
  if (!input.statement.trim()) return { success: false, error: "Objection statement is required." };

  const date = input.now ?? nowIso();
  return {
    success: true,
    data: {
      id: createScopedId("deliberation-objection"),
      organizationId: input.organizationId ?? orgId,
      workspaceId: input.workspaceId,
      deliberationId: input.deliberationId,
      raisedBy: input.raisedBy || "VGOS",
      objectionType: input.objectionType ?? inferObjectionType(input.statement),
      statement: input.statement,
      severity: input.severity ?? "HIGH",
      evidenceIds: input.evidenceIds ?? [],
      status: "OPEN",
      resolutionSummary: null,
      createdAt: date,
      updatedAt: date
    },
    warnings: input.evidenceIds?.length ? undefined : ["Objection has no linked evidence yet."]
  };
}

export function resolveObjection(
  objection: Objection,
  status: Exclude<ObjectionStatus, "OPEN">,
  resolutionSummary: string
): InstructionResult<Objection> {
  if (!resolutionSummary.trim()) {
    return { success: false, error: "resolutionSummary is required." };
  }

  return {
    success: true,
    data: {
      ...objection,
      status,
      resolutionSummary,
      updatedAt: nowIso()
    }
  };
}

export function getUnresolvedObjections(objections: Objection[]) {
  return objections.filter((objection) => !["MITIGATED", "REJECTED", "SUPERSEDED"].includes(objection.status));
}

export function highestSeverityObjections(objections: Objection[]) {
  const rank: Record<Priority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return [...objections].sort((a, b) => rank[a.severity] - rank[b.severity]);
}
