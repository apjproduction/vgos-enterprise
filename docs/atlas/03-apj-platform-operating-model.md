# APJ Platform Operating Model

## 1. Platform Thesis

APJ Labs should evolve from a collection of software products into a platform company.

The platform should provide shared identity, organizations, permissions, billing, connectors, agent runtime, intelligence kernel, executive experience patterns, and product-specific applications.

```text
APJ Platform
  ├── Identity Service
  ├── Workspace Service
  ├── Intelligence Service
  ├── Mission Service
  ├── Connector Service
  ├── Agent Runtime
  ├── Executive Experience
  └── Product Applications
```

## 2. Application Model

VGOS should become one application on top of the APJ Platform.

Future apps may include:

- VidMaker Intelligence
- TradeWizAI Intelligence
- DriveMart Intelligence
- Events Intelligence
- APJ Admin
- Partner Portal

## 3. Code Organization Direction

As the codebase matures, APJ Labs should consider a package/application split:

```text
packages/
  kernel/
  identity/
  organizations/
  missions/
  planning/
  execution/
  learning/
  knowledge/
  advisor/
  connectors/
  agents/
  shared-ui/

apps/
  vgos/
  vidmaker/
  tradewizai/
  admin/
```

This should happen carefully and only after current product workflows are stable.

## 4. Bounded Contexts

Future development should be organized around bounded contexts rather than pages:

- Identity
- Organizations
- Intelligence
- Knowledge
- Missions
- Planning
- Execution
- Measurement
- Learning
- Advisor
- Connectors
- Agents
- Experience
- Platform Operations

Each bounded context should own its domain language, service boundaries, tests, events, and capability manifests.

## 5. Capability Lifecycle

Every new capability follows this lifecycle:

```text
Idea
  ↓
Capability Proposal
  ↓
RFC
  ↓
Architecture Review
  ↓
Capability Manifest
  ↓
Implementation
  ↓
Integration Tests
  ↓
Production Rollout
  ↓
Executive Validation
```

No major capability should bypass this lifecycle.

## 6. RFC Standard

Every significant feature should start with an RFC.

Template:

```text
RFC-XXX: Title

Problem
Goals
Non-goals
User personas
Architecture
Data model
API impact
UI impact
Events
Security
Testing
Migration
Risks
Alternatives considered
Acceptance criteria
Success metrics
```

## 7. Connector Philosophy

No connector writes directly to business objects.

Every connector follows this pipeline:

```text
External Source
  ↓
Connector
  ↓
Raw Signal
  ↓
Normalized Signal
  ↓
Event
  ↓
Intelligence Kernel
```

This prevents connector-specific logic from polluting the core product.

## 8. Agent Framework Philosophy

Agents are not chatbots. Agents are operational specialists.

Standard agent lifecycle:

```text
Observe
  ↓
Understand
  ↓
Reason
  ↓
Recommend
  ↓
Execute, with approval where needed
  ↓
Measure
  ↓
Learn
```

Examples:

- Research Agent
- SEO Agent
- Content Agent
- Founder Agent
- Product Agent
- Growth Agent
- Finance Agent
- Strategy Agent

All agents should share context through the Intelligence Kernel.

## 9. Executive Memory

Executive Memory is a core moat.

The platform should remember:

- strategic decisions
- rationale
- approvals
- evidence
- executions
- outcomes
- learnings
- mistakes
- successful playbooks

This institutional memory should improve future recommendations.

## 10. Decision Quality Index

The North Star metric for APJ Labs should be Decision Quality Index.

DQI should eventually combine:

- recommendation accuracy
- prediction accuracy
- mission success
- time saved
- user acceptance rate
- business outcomes
- learning reuse

The goal of every release should be to improve DQI.

## 11. Permanent Workstreams

### Platform Engineering

Owns the Intelligence Kernel, connectors, identity, shared services, security, testing, and infrastructure.

### Product Delivery

Owns VGOS, VidMaker, TradeWizAI, DriveMart, and future product-specific experiences.

### Ecosystem Expansion

Owns multi-product support, shared intelligence, portfolio views, plugin marketplace, and partner APIs.

### Executive Experience

Owns Executive Brief, Advisor, Timeline, Work Queue, Search, accessibility, and the product design system.

## 12. Governance Reviews

### Architecture Review

Required for new domains, schema changes, kernel changes, connector contracts, and agent runtime changes.

### Product Review

Required for user-facing workflow changes. The review must answer which decision the feature improves.

### Quality Review

Required for recommendations, agents, connectors, and measurements. Outputs must be explainable, observable, and testable.

## 13. Platform Roadmap

### Near Term

- Stabilize VGOS v6.0 baseline.
- Replace mock connectors with live GitHub, Search Console, and GA4 connectors.
- Use VGOS to operate VidMaker daily.
- Measure time saved and recommendation adoption.

### Medium Term

- Executive Memory and Decision Intelligence.
- Executive Timeline.
- Weekly CEO Report.
- Monthly Strategy Review.
- Scenario simulation.
- VidMaker integration.

### Long Term

- APJ portfolio view.
- Multi-product intelligence.
- Cross-product learning.
- Agent collaboration.
- Plugin marketplace.
- Public APIs and SDKs.

## 14. Platform Principle

The platform itself is the product. VGOS, VidMaker, TradeWizAI, and future applications are expressions of the platform.

Every improvement to the Intelligence Kernel should make the entire APJ Labs product ecosystem smarter.
