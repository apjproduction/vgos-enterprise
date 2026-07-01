# VGOS v5.0 Enterprise Architecture

VGOS is moving from a domain-driven tracking app into an Autonomous Intelligence Foundation for VidMaker. The latest capability release adds the Mission Engine as the highest-level business operating layer above Planning, Execution, Measurement, Learning, and Strategy.

Phase Beta added three durable layers:

1. Universal Knowledge Layer: canonical objects and typed relationships across market signals, entities, content, memories, patterns, objectives, actions, and recommendations.
2. Workflow Layer: reusable workflows that turn events or manual triggers into sequenced kernel operations.
3. Agent Coordination Layer: rule-based agents, handoffs, and workflow eligibility so specialized operators can collaborate over the same workspace-scoped context.

The product still runs without external AI keys. Services are rule-based and deterministic for now, with interfaces designed so an embedding provider, LLM classifier, or task runner can be injected later.

The Planning Engine turns objectives, patterns, recommended actions, constraints, dependencies, and team capacity into executable plans with milestones, plan items, predicted outcomes, and health scoring.

The Execution Engine turns plans, plan items, recommended actions, workflow outputs, and mission-control priorities into trackable execution items with owners, statuses, evidence, blockers, approvals, results, and captured learning.

The Measurement & Learning Engine turns execution results and metric movement into measurements, learnings, attributions, and proposed strategy adjustments, closing the loop between shipped work and better future recommendations.

The Mission Engine turns objectives, plans, execution, measurement, learning, and strategy adjustments into business-level missions with health, velocity, risk, confidence, completion, summaries, and recommended changes.

Connected Intelligence prepares VGOS for live external data sources by requiring every provider adapter to pass through connectors, raw signals, normalized signals, events, and kernel routing before creating intelligence, knowledge, mission, measurement, or learning records.

Reflective Cognition strengthens Advisor, Executive Brief, Work Queue, Missions, and recommendations by making assumptions, evidence quality, counter-evidence, tradeoffs, reflections, and confidence recalibration explicit.

## Current Layers

- Data foundation: Prisma models for domain entities, intelligence objects, knowledge objects, relationships, memory snapshots, workflows, workflow runs, handoffs, plans, milestones, plan items, dependencies, constraints, predicted outcomes, resource capacity, execution items, execution evidence, blockers, approvals, results, metrics, measurements, learnings, attributions, strategy adjustments, missions, mission links, mission summaries, connectors, raw signals, normalized signals, and connector sync runs.
- Kernel services: knowledge service, semantic search foundation, memory trend service, workflow engine, agent coordinator, decision engine, planning engine, execution engine, measurement engine, learning engine, attribution engine, strategy feedback engine, mission engine, mission builder, mission health, mission progress, mission summaries, connector registry, connector engine, normalization engine, signal router, connector health, reflective cognition, scheduling, dependency analysis, prediction, resource planning, and scoring utilities.
- Product UI: Mission Control, Missions, Connectors, Signals, Sync Runs, Knowledge, Workflows, Intelligence Pipeline, Memory, Patterns, Objectives, Agents, Reasoning, Decisions, Plans, Executions, Approvals, Blockers, Evidence, Assumptions, Tradeoffs, Reflections, Results, Metrics, Measurements, Learnings, Attributions, Strategy Adjustments, Capabilities, and operational engine pages.
- Tenant boundary: all major records remain scoped by organization and workspace.

## Operating Principle

VGOS should not only store work. It should remember market signals, connect them to entities and objectives, organize them into missions, choose next actions, convert those actions into plans, execute them with proof, and learn from what happened.
