# VGOS v5.0 Enterprise Architecture

VGOS is moving from a domain-driven tracking app into an Autonomous Intelligence Foundation for VidMaker. Phase Beta adds three durable layers:

1. Universal Knowledge Layer: canonical objects and typed relationships across market signals, entities, content, memories, patterns, objectives, actions, and recommendations.
2. Workflow Layer: reusable workflows that turn events or manual triggers into sequenced kernel operations.
3. Agent Coordination Layer: rule-based agents, handoffs, and workflow eligibility so specialized operators can collaborate over the same workspace-scoped context.

The product still runs without external AI keys. Services are rule-based and deterministic for now, with interfaces designed so an embedding provider, LLM classifier, or task runner can be injected later.

## Current Layers

- Data foundation: Prisma models for domain entities, intelligence objects, knowledge objects, relationships, memory snapshots, workflows, workflow runs, and handoffs.
- Kernel services: knowledge service, semantic search foundation, memory trend service, workflow engine, agent coordinator, decision engine, and scoring utilities.
- Product UI: Mission Control, Knowledge, Workflows, Intelligence Pipeline, Memory, Patterns, Objectives, Agents, Reasoning, Decisions, and operational engine pages.
- Tenant boundary: all major records remain scoped by organization and workspace.

## Operating Principle

VGOS should not only store work. It should remember market signals, connect them to entities and objectives, choose next actions, and explain why those actions matter.

