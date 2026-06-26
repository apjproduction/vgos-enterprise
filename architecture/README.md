# VGOS v5.0 Enterprise Architecture

VGOS is moving from a domain-driven tracking app into an Autonomous Intelligence Foundation for VidMaker. The latest capability release adds the Execution Engine on top of Planning Engine orchestration.

Phase Beta added three durable layers:

1. Universal Knowledge Layer: canonical objects and typed relationships across market signals, entities, content, memories, patterns, objectives, actions, and recommendations.
2. Workflow Layer: reusable workflows that turn events or manual triggers into sequenced kernel operations.
3. Agent Coordination Layer: rule-based agents, handoffs, and workflow eligibility so specialized operators can collaborate over the same workspace-scoped context.

The product still runs without external AI keys. Services are rule-based and deterministic for now, with interfaces designed so an embedding provider, LLM classifier, or task runner can be injected later.

The Planning Engine turns objectives, patterns, recommended actions, constraints, dependencies, and team capacity into executable plans with milestones, plan items, predicted outcomes, and health scoring.

The Execution Engine turns plans, plan items, recommended actions, workflow outputs, and mission-control priorities into trackable execution items with owners, statuses, evidence, blockers, approvals, results, and captured learning.

## Current Layers

- Data foundation: Prisma models for domain entities, intelligence objects, knowledge objects, relationships, memory snapshots, workflows, workflow runs, handoffs, plans, milestones, plan items, dependencies, constraints, predicted outcomes, resource capacity, execution items, execution evidence, blockers, approvals, and results.
- Kernel services: knowledge service, semantic search foundation, memory trend service, workflow engine, agent coordinator, decision engine, planning engine, execution engine, scheduling, dependency analysis, prediction, resource planning, and scoring utilities.
- Product UI: Mission Control, Knowledge, Workflows, Intelligence Pipeline, Memory, Patterns, Objectives, Agents, Reasoning, Decisions, Plans, Executions, Approvals, Blockers, Evidence, Results, Capabilities, and operational engine pages.
- Tenant boundary: all major records remain scoped by organization and workspace.

## Operating Principle

VGOS should not only store work. It should remember market signals, connect them to entities and objectives, choose next actions, convert those actions into plans, execute them with proof, and learn from what happened.
