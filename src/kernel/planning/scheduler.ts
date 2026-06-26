import type { PlanItem, ResourceCapacity } from "@/lib/vgos-data";

function addDays(base: string | Date, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function assignDueDates(items: PlanItem[], startDate: string, spacingDays = 2) {
  return items.map((item, index) => ({
    ...item,
    dueDate: addDays(startDate, index * spacingDays),
    updatedAt: new Date().toISOString()
  }));
}

export function schedulePlanItems(items: PlanItem[], startDate: string, capacities: ResourceCapacity[] = []) {
  const sorted = [...items].sort((a, b) => b.estimatedImpactScore - a.estimatedImpactScore);
  const capacityByOwner = new Map(capacities.map((capacity) => [capacity.owner, capacity.weeklyHours]));
  const ownerLoad = new Map<string, number>();

  return sorted.map((item, index) => {
    const capacity = capacityByOwner.get(item.owner) ?? 20;
    const currentLoad = ownerLoad.get(item.owner) ?? 0;
    const weekOffset = currentLoad + item.estimatedEffortScore > capacity ? 7 : 0;
    ownerLoad.set(item.owner, weekOffset > 0 ? item.estimatedEffortScore : currentLoad + item.estimatedEffortScore);
    return {
      ...item,
      dueDate: addDays(startDate, index * 2 + weekOffset),
      updatedAt: new Date().toISOString()
    };
  });
}

export function detectScheduleConflicts(items: PlanItem[]) {
  const byOwnerDate = new Map<string, PlanItem[]>();
  items.forEach((item) => {
    const key = `${item.owner}:${new Date(item.dueDate).toISOString().slice(0, 10)}`;
    byOwnerDate.set(key, [...(byOwnerDate.get(key) ?? []), item]);
  });
  return [...byOwnerDate.values()].filter((group) => group.length > 2);
}

export function rebalanceSchedule(items: PlanItem[], capacities: ResourceCapacity[] = []) {
  const conflicts = detectScheduleConflicts(items).flat();
  const conflictIds = new Set(conflicts.map((item) => item.id));
  return items.map((item, index) => {
    if (!conflictIds.has(item.id)) return item;
    const ownerCapacity = capacities.find((capacity) => capacity.owner === item.owner)?.weeklyHours ?? 20;
    const delay = item.estimatedEffortScore > ownerCapacity / 5 ? 4 : 2;
    return {
      ...item,
      dueDate: addDays(item.dueDate, delay + index),
      updatedAt: new Date().toISOString()
    };
  });
}

