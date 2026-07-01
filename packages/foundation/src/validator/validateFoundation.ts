import type {
  FoundationRegistry,
  FoundationSnapshot,
  FoundationValidationIssue,
  FoundationValidationResult,
} from "../types/foundation";

function requireField(value: unknown, path: string, issues: FoundationValidationIssue[]) {
  if (value === undefined || value === null || value === "") {
    issues.push({ severity: "error", path, message: "Required field is missing." });
  }
}

function detectDuplicateIds(items: { id: string }[], path: string, issues: FoundationValidationIssue[]) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      issues.push({ severity: "error", path, message: `Duplicate id detected: ${item.id}` });
    }
    seen.add(item.id);
  }
}

export function validateRegistry(registry: FoundationRegistry): FoundationValidationResult {
  const issues: FoundationValidationIssue[] = [];

  const groups: Array<[keyof FoundationRegistry, { id: string; name: string; purpose?: string; definition?: string }[]]> = [
    ["products", registry.products],
    ["capabilities", registry.capabilities],
    ["principles", registry.principles],
    ["standards", registry.standards],
    ["playbooks", registry.playbooks],
    ["glossary", registry.glossary],
    ["agents", registry.agents],
  ];

  for (const [groupName, items] of groups) {
    detectDuplicateIds(items, groupName, issues);
    items.forEach((item, index) => {
      requireField(item.id, `${groupName}.${index}.id`, issues);
      requireField(item.name, `${groupName}.${index}.name`, issues);
      if (!("purpose" in item) && !("definition" in item)) {
        issues.push({
          severity: "warning",
          path: `${groupName}.${index}`,
          message: "Item should include either purpose or definition.",
        });
      }
    });
  }

  const capabilityIds = new Set(registry.capabilities.map((capability) => capability.id));
  registry.capabilities.forEach((capability, index) => {
    for (const dependency of capability.dependsOn ?? []) {
      if (!capabilityIds.has(dependency)) {
        issues.push({
          severity: "warning",
          path: `capabilities.${index}.dependsOn`,
          message: `Capability dependency is not registered: ${dependency}`,
        });
      }
    }
  });

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}

export function validateFoundation(snapshot: FoundationSnapshot): FoundationValidationResult {
  const issues: FoundationValidationIssue[] = [];

  requireField(snapshot.manifest.foundation.id, "manifest.foundation.id", issues);
  requireField(snapshot.manifest.foundation.name, "manifest.foundation.name", issues);
  requireField(snapshot.manifest.organization.name, "manifest.organization.name", issues);
  requireField(snapshot.manifest.platform.name, "manifest.platform.name", issues);

  const registryValidation = validateRegistry(snapshot.registry);

  return {
    valid: issues.every((issue) => issue.severity !== "error") && registryValidation.valid,
    issues: [...issues, ...registryValidation.issues],
  };
}
