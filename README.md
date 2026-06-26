# VGOS v5.0 Enterprise

VidMaker Growth Intelligence Platform for SEO, AEO, GEO, content planning, community intelligence, authority, competitors, product feedback, and growth experimentation.

## Phase Alpha Scope

VGOS now includes an Intelligence Kernel under `src/kernel/`. The kernel is the shared reasoning foundation for memory, patterns, objectives, agents, decisions, events, scoring, and recommendations.

## Phase Beta Scope

VGOS now includes an Autonomous Intelligence Foundation:

- Universal Knowledge Layer with `KnowledgeObject`, `KnowledgeRelationship`, and semantic-search-ready fields
- Memory trend snapshots with `MemorySnapshot`
- Workflow orchestration with `Workflow`, `WorkflowStep`, and `WorkflowRun`
- Agent coordination with hierarchy fields, workflow permissions, and `AgentHandoff`
- Dedicated `/knowledge` and `/workflows` pages
- Mission Control sections for Knowledge, Workflow, Agent, and Decision layers
- Architecture docs in `architecture/`

The Phase Beta services live under `src/kernel/knowledge/`, `src/kernel/workflows/`, and `src/kernel/agents/`. They are mock-AI/rule-based for now and designed for real AI providers, embeddings, workflow queues, and approval gates later.

Seed data now includes 25 knowledge objects, 40 knowledge relationships, 5 memory snapshots, 5 workflows, 20 workflow steps, 10 workflow runs, and 10 agent handoffs.

Phase Alpha adds:

- `Memory`
- `Pattern`
- `ReasoningTrace`
- `Objective`
- `KeyResult`
- `Agent`
- `AgentRun`
- Kernel services for memory, pattern detection, reasoning, goals, agents, decisions, events, scoring, and recommendations
- Mission Control kernel cards, daily priorities, active patterns, and objective progress
- Direct pages at `/memory`, `/patterns`, `/objectives`, `/agents`, `/reasoning`, and `/decisions`

## Sprint 5 Scope

VGOS now includes an Intelligence Pipeline that processes raw market signals into:

- Intent classification
- Persona detection
- Entity and keyword recognition
- Pain point extraction
- Opportunity scores
- AI recommendations
- Recommended growth actions

The new pipeline is rule-based for local development and designed so a real AI provider can be plugged in later. Open it from the sidebar or `/intelligence-pipeline`.

## Sprint 4 Scope

VGOS now acts as an action-oriented Growth Mission Control system. The default
landing page is Mission Control, with:

- Today's Priority Briefing
- Unified Opportunity Queue
- Weekly Focus
- Quick Actions
- Recommended Actions with completion and task conversion
- Rule-based Intelligence Briefing at `/briefing`

Sprint 4 adds:

- `Event`
- `RecommendedAction`
- Event enums for event type, severity, and status
- Action enums for action type and status
- A reusable opportunity scoring service

Sprint 5 adds:

- `IntelligenceObject`
- Reusable services in `src/lib/intelligence-pipeline.ts`
- `Process Intelligence` conversion on observations, conversations, questions, and pain points

Opportunity items normalize questions, pain points, conversations, content
assets, directory submissions, backlinks, AI recommendations, and experiments
into one ranked queue.

## Sprint 3 Foundation

VGOS now models a learning loop:

```text
Observation -> Insight -> Hypothesis -> Experiment -> Outcome
```

This turns market signals from Reddit, LinkedIn, X, Product Hunt, YouTube, directories, and competitors into decisions across content, SEO, AEO, GEO, product, and growth.

## Stack

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui-style local components
- Prisma
- PostgreSQL or Supabase

## Enterprise Foundation

The Prisma schema includes tenant-ready `Organization` and `Workspace` models. Seed data creates:

- Organization: `APJ Labs`
- Workspace: `VidMaker Growth OS`

Workspace-scoped models include conversations, questions, pain points, content assets, campaigns, tasks, competitors, communities, directory submissions, backlinks, personas, intelligence records, knowledge graph records, and AI recommendations.

## Intelligence Models

Sprint 3 adds:

- `Persona`
- `Observation`
- `Insight`
- `Hypothesis`
- `Experiment`
- `Outcome`
- `KnowledgeNode`
- `KnowledgeEdge`

It also expands:

- `Question` and `PainPoint` with opportunity scoring fields
- `Entity` with aliases, synonyms, canonical URL, importance score, ownership, and notes
- `AIRecommendation` with recommendation type, target metadata, suggested action, reasoning, confidence, generated-by, and accept/reject timestamps

## UI Pages

The app navigation emphasizes:

- Mission Control
- Intelligence Briefing
- Intelligence Pipeline
- Memory
- Patterns
- Objectives
- Agents
- Reasoning
- Decisions
- Opportunity Queue
- Recommended Actions
- Intelligence Engine
- Content Engine
- Authority Engine
- Search Engine
- Product Engine
- Knowledge Graph

Pages use a shared table/editor pattern with create, edit, delete, search,
filters, status, priority where relevant, workspace scoping, and conversion
actions where relevant.

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add a database connection:

   ```bash
   cp .env.example .env
   ```

3. Create the database tables:

   ```bash
   npx prisma migrate dev --name phase-alpha-intelligence-kernel
   ```

4. Seed VidMaker intelligence data:

   ```bash
   npm run db:seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

The dashboard also ships with local seed data so it can render immediately in the browser once the app dependencies are installed.
