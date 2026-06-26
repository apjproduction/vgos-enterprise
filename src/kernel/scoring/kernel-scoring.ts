import type { Priority } from "@/lib/vgos-data";

const priorityWeight: Record<Priority, number> = {
  CRITICAL: 30,
  HIGH: 22,
  MEDIUM: 12,
  LOW: 4
};

export function normalizeScore(value: number, max = 100) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

export function scorePriority(priority?: Priority) {
  return priorityWeight[priority ?? "MEDIUM"];
}

export function scoreUrgency(dueDate?: string) {
  if (!dueDate) return 8;
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
  if (days <= 1) return 24;
  if (days <= 3) return 18;
  if (days <= 7) return 12;
  return 6;
}

export function scoreStatus(status?: string) {
  if (status === "PENDING") return 12;
  if (status === "IN_PROGRESS") return 8;
  if (status === "COMPLETED" || status === "ARCHIVED" || status === "DISMISSED") return -40;
  return 6;
}
