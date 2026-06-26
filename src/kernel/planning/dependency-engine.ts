import {
  createScopedId,
  orgId,
  type PlanDependency,
  type PlanDependencyType,
  type PlanItem
} from "@/lib/vgos-data";
import type { PlanningContext } from "@/kernel/planning/planning-types";

export function createDependency(
  input: {
    planId: string;
    fromItemId: string;
    toItemId: string;
    dependencyType?: PlanDependencyType;
    reason: string;
  },
  context: PlanningContext
): PlanDependency {
  const now = context.now ?? new Date().toISOString();
  return {
    id: createScopedId("plan-dependency"),
    organizationId: context.organizationId ?? orgId,
    workspaceId: context.workspaceId,
    planId: input.planId,
    fromItemId: input.fromItemId,
    toItemId: input.toItemId,
    dependencyType: input.dependencyType ?? "SEQUENCED_BEFORE",
    reason: input.reason,
    createdAt: now,
    updatedAt: now
  };
}

export function detectBlockedItems(items: PlanItem[], dependencies: PlanDependency[]) {
  return items.filter((item) => {
    if (item.status === "BLOCKED") return true;
    const incoming = dependencies.filter((dependency) => dependency.toItemId === item.id);
    return incoming.some((dependency) => {
      const prerequisite = items.find((candidate) => candidate.id === dependency.fromItemId);
      return prerequisite && prerequisite.status !== "COMPLETED";
    });
  });
}

export function suggestDependencies(items: PlanItem[], context: PlanningContext) {
  const dependencies: PlanDependency[] = [];
  const demos = items.filter((item) => item.itemType === "DEMO");
  const promotions = items.filter((item) => ["X_THREAD", "PINTEREST_PIN", "COMMUNITY_REPLY"].includes(item.itemType));
  demos.forEach((demo) => {
    promotions.forEach((promotion) => {
      if (demo.planId === promotion.planId) {
        dependencies.push(
          createDependency(
            {
              planId: demo.planId,
              fromItemId: demo.id,
              toItemId: promotion.id,
              dependencyType: "BLOCKS",
              reason: "Demo proof should exist before promotion."
            },
            context
          )
        );
      }
    });
  });

  const blogs = items.filter((item) => item.itemType === "BLOG");
  const links = items.filter((item) => item.itemType === "INTERNAL_LINK");
  blogs.forEach((blog) => {
    links.forEach((link) => {
      if (blog.planId === link.planId) {
        dependencies.push(
          createDependency(
            {
              planId: blog.planId,
              fromItemId: blog.id,
              toItemId: link.id,
              dependencyType: "SEQUENCED_BEFORE",
              reason: "Content should be published before internal links point to it."
            },
            context
          )
        );
      }
    });
  });

  return dependencies;
}

export function getCriticalPath(items: PlanItem[], dependencies: PlanDependency[]) {
  const dependencyWeight = new Map<string, number>();
  dependencies.forEach((dependency) => {
    dependencyWeight.set(dependency.fromItemId, (dependencyWeight.get(dependency.fromItemId) ?? 0) + 1);
    dependencyWeight.set(dependency.toItemId, (dependencyWeight.get(dependency.toItemId) ?? 0) + 1);
  });
  return [...items].sort((a, b) => {
    const dependencyDelta = (dependencyWeight.get(b.id) ?? 0) - (dependencyWeight.get(a.id) ?? 0);
    if (dependencyDelta !== 0) return dependencyDelta;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

