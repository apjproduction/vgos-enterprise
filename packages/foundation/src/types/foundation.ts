export type FoundationStatus = "draft" | "planned" | "active" | "production-alpha" | "foundation-mvp" | "live-product";

export type FoundationDomain =
  | "Foundation"
  | "Platform"
  | "Intelligence"
  | "Experience"
  | "Products"
  | "Operations"
  | "Developer Experience"
  | string;

export interface FoundationManifest {
  foundation: {
    id: string;
    name: string;
    version: string;
    status: string;
    owner: string;
    updated?: string;
    purpose: string;
  };
  organization: {
    name: string;
    category: string;
    mission: string;
    vision: string;
    operating_principle: string;
  };
  platform: {
    name: string;
    thesis: string;
    domains: string[];
  };
  source_of_truth: {
    rule: string;
    documents: string[];
  };
  future_runtime?: {
    package: string;
    planned_capabilities: string[];
  };
}

export interface FoundationProduct {
  id: string;
  name: string;
  fullName?: string;
  category: string;
  status: FoundationStatus | string;
  owner: string;
  purpose: string;
  primaryUsers?: string[];
  consumes?: string[];
  produces?: string[];
  northStarMetric?: string;
}

export interface FoundationCapability {
  id: string;
  name: string;
  domain: FoundationDomain;
  status: FoundationStatus | string;
  version: string;
  purpose: string;
  owner: string;
  inputs?: string[];
  outputs?: string[];
  dependsOn?: string[];
}

export interface FoundationPrinciple {
  id: string;
  name: string;
  category: string;
  priority: "P0" | "P1" | "P2" | string;
  statement: string;
  appliesTo?: string[];
}

export interface FoundationStandard {
  id: string;
  name: string;
  domain: FoundationDomain;
  status: FoundationStatus | string;
  owner: string;
  purpose: string;
  requiredFor?: string[];
}

export interface FoundationPlaybook {
  id: string;
  name: string;
  domain: FoundationDomain;
  status: FoundationStatus | string;
  owner: string;
  purpose: string;
  triggers?: string[];
  outputs?: string[];
}

export interface FoundationGlossaryTerm {
  id: string;
  name: string;
  category: string;
  definition: string;
  related?: string[];
}

export interface FoundationAgent {
  id: string;
  name: string;
  domain: FoundationDomain;
  status: FoundationStatus | string;
  purpose: string;
  consumes?: string[];
  produces?: string[];
}

export interface FoundationRegistry {
  products: FoundationProduct[];
  capabilities: FoundationCapability[];
  principles: FoundationPrinciple[];
  standards: FoundationStandard[];
  playbooks: FoundationPlaybook[];
  glossary: FoundationGlossaryTerm[];
  agents: FoundationAgent[];
}

export interface FoundationSnapshot {
  manifest: FoundationManifest;
  registry: FoundationRegistry;
}

export interface FoundationValidationIssue {
  severity: "error" | "warning";
  path: string;
  message: string;
}

export interface FoundationValidationResult {
  valid: boolean;
  issues: FoundationValidationIssue[];
}

export interface FoundationSearchResult {
  id: string;
  type: keyof FoundationRegistry;
  name: string;
  summary: string;
  score: number;
}

export interface FoundationGraphNode {
  id: string;
  label: string;
  type: keyof FoundationRegistry | "manifest";
}

export interface FoundationGraphEdge {
  from: string;
  to: string;
  relationship: "depends_on" | "consumes" | "produces" | "related_to" | "applies_to" | "owned_by";
}

export interface FoundationKnowledgeGraph {
  nodes: FoundationGraphNode[];
  edges: FoundationGraphEdge[];
}
