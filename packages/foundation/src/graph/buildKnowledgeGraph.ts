import type { FoundationKnowledgeGraph, FoundationRegistry } from "../types/foundation";

export function buildKnowledgeGraph(registry: FoundationRegistry): FoundationKnowledgeGraph {
  const nodes: FoundationKnowledgeGraph["nodes"] = [];
  const edges: FoundationKnowledgeGraph["edges"] = [];

  for (const product of registry.products) {
    nodes.push({ id: product.id, label: product.name, type: "products" });
    for (const consumed of product.consumes ?? []) {
      edges.push({ from: product.id, to: consumed, relationship: "consumes" });
    }
    for (const produced of product.produces ?? []) {
      edges.push({ from: product.id, to: produced, relationship: "produces" });
    }
  }

  for (const capability of registry.capabilities) {
    nodes.push({ id: capability.id, label: capability.name, type: "capabilities" });
    for (const dependency of capability.dependsOn ?? []) {
      edges.push({ from: capability.id, to: dependency, relationship: "depends_on" });
    }
    for (const input of capability.inputs ?? []) {
      edges.push({ from: capability.id, to: input, relationship: "consumes" });
    }
    for (const output of capability.outputs ?? []) {
      edges.push({ from: capability.id, to: output, relationship: "produces" });
    }
  }

  for (const principle of registry.principles) {
    nodes.push({ id: principle.id, label: principle.name, type: "principles" });
    for (const target of principle.appliesTo ?? []) {
      edges.push({ from: principle.id, to: target, relationship: "applies_to" });
    }
  }

  for (const standard of registry.standards) {
    nodes.push({ id: standard.id, label: standard.name, type: "standards" });
    edges.push({ from: standard.id, to: standard.owner, relationship: "owned_by" });
  }

  for (const playbook of registry.playbooks) {
    nodes.push({ id: playbook.id, label: playbook.name, type: "playbooks" });
    edges.push({ from: playbook.id, to: playbook.owner, relationship: "owned_by" });
  }

  for (const term of registry.glossary) {
    nodes.push({ id: term.id, label: term.name, type: "glossary" });
    for (const related of term.related ?? []) {
      edges.push({ from: term.id, to: related, relationship: "related_to" });
    }
  }

  for (const agent of registry.agents) {
    nodes.push({ id: agent.id, label: agent.name, type: "agents" });
    for (const consumed of agent.consumes ?? []) {
      edges.push({ from: agent.id, to: consumed, relationship: "consumes" });
    }
    for (const produced of agent.produces ?? []) {
      edges.push({ from: agent.id, to: produced, relationship: "produces" });
    }
  }

  return { nodes, edges };
}
