import type {
  FoundationAgent,
  FoundationCapability,
  FoundationGlossaryTerm,
  FoundationPlaybook,
  FoundationPrinciple,
  FoundationProduct,
  FoundationRegistry,
  FoundationStandard,
} from "../types/foundation";

export function createEmptyRegistry(): FoundationRegistry {
  return {
    products: [],
    capabilities: [],
    principles: [],
    standards: [],
    playbooks: [],
    glossary: [],
    agents: [],
  };
}

export function normalizeRegistry(input: Partial<FoundationRegistry>): FoundationRegistry {
  return {
    products: input.products ?? [],
    capabilities: input.capabilities ?? [],
    principles: input.principles ?? [],
    standards: input.standards ?? [],
    playbooks: input.playbooks ?? [],
    glossary: input.glossary ?? [],
    agents: input.agents ?? [],
  };
}

export function getRegistryItems(registry: FoundationRegistry) {
  return [
    ...registry.products.map((item) => ({ ...item, type: "products" as const })),
    ...registry.capabilities.map((item) => ({ ...item, type: "capabilities" as const })),
    ...registry.principles.map((item) => ({ ...item, type: "principles" as const })),
    ...registry.standards.map((item) => ({ ...item, type: "standards" as const })),
    ...registry.playbooks.map((item) => ({ ...item, type: "playbooks" as const })),
    ...registry.glossary.map((item) => ({ ...item, type: "glossary" as const })),
    ...registry.agents.map((item) => ({ ...item, type: "agents" as const })),
  ];
}

export function findProduct(registry: FoundationRegistry, id: string): FoundationProduct | undefined {
  return registry.products.find((item) => item.id === id);
}

export function findCapability(registry: FoundationRegistry, id: string): FoundationCapability | undefined {
  return registry.capabilities.find((item) => item.id === id);
}

export function findPrinciple(registry: FoundationRegistry, id: string): FoundationPrinciple | undefined {
  return registry.principles.find((item) => item.id === id);
}

export function findStandard(registry: FoundationRegistry, id: string): FoundationStandard | undefined {
  return registry.standards.find((item) => item.id === id);
}

export function findPlaybook(registry: FoundationRegistry, id: string): FoundationPlaybook | undefined {
  return registry.playbooks.find((item) => item.id === id);
}

export function findGlossaryTerm(registry: FoundationRegistry, id: string): FoundationGlossaryTerm | undefined {
  return registry.glossary.find((item) => item.id === id);
}

export function findAgent(registry: FoundationRegistry, id: string): FoundationAgent | undefined {
  return registry.agents.find((item) => item.id === id);
}
