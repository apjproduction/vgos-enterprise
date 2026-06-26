# ADR-004: Agent Coordination

## Context

VGOS has specialized agents for conversation, content, authority, AEO, and product intelligence. Without coordination, each agent can produce isolated recommendations that do not move through a shared operating system.

## Decision

Extend agents with parent agents, dependencies, handoff rules, and allowed workflows. Add `AgentHandoff` and an agent coordinator service to select eligible agents, create handoffs, run agent-backed workflows, and evaluate outputs.

## Consequences

- Agents can pass context instead of duplicating work.
- Workflow eligibility limits which agents operate on which growth processes.
- Handoffs create a visible queue for Mission Control.

## Future Considerations

- Add approval and escalation rules per agent type.
- Add confidence thresholds before automated action creation.
- Add agent memory so repeated handoff outcomes improve routing.

