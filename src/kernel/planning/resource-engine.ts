import type { PlanItem, ResourceCapacity } from "@/lib/vgos-data";
import type { CapacityAllocation } from "@/kernel/planning/planning-types";

export function getAvailableCapacity(capacities: ResourceCapacity[], owner?: string) {
  const filtered = owner ? capacities.filter((capacity) => capacity.owner === owner) : capacities;
  return filtered.reduce((total, capacity) => total + capacity.weeklyHours, 0);
}

export function allocatePlanItems(items: PlanItem[], capacities: ResourceCapacity[]): CapacityAllocation[] {
  return capacities.map((capacity) => {
    const assigned = items.filter((item) => item.owner === capacity.owner || item.owner === capacity.focusArea);
    const allocatedEffort = assigned.reduce((total, item) => total + item.estimatedEffortScore, 0);
    return {
      owner: capacity.owner,
      weeklyHours: capacity.weeklyHours,
      allocatedEffort,
      remainingHours: capacity.weeklyHours - allocatedEffort,
      overloaded: allocatedEffort > capacity.weeklyHours,
      items: assigned
    };
  });
}

export function detectOverload(items: PlanItem[], capacities: ResourceCapacity[]) {
  return allocatePlanItems(items, capacities).filter((allocation) => allocation.overloaded);
}

export function suggestRescheduling(items: PlanItem[], capacities: ResourceCapacity[]) {
  const overloadedOwners = new Set(detectOverload(items, capacities).map((allocation) => allocation.owner));
  return items.map((item) => {
    if (!overloadedOwners.has(item.owner)) return item;
    const dueDate = new Date(item.dueDate);
    dueDate.setDate(dueDate.getDate() + 7);
    return {
      ...item,
      dueDate: dueDate.toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

