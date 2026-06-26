# ADR-005: Mission Control Layering

## Context

Mission Control was already showing executive metrics, opportunities, recommendations, experiments, patterns, objectives, and quick actions. Phase Beta adds knowledge, workflow, agent, and decision layers that need to be visible without turning the page into another passive dashboard.

## Decision

Update Mission Control to summarize four operational layers: Knowledge, Workflow, Agent, and Decision. Quick actions now jump into intelligence processing, knowledge creation, workflow execution, agent runs, and briefings.

## Consequences

- Operators can see where the system knows enough, where confidence is weak, and what needs execution.
- Workflows and handoffs are surfaced as operational queues.
- Strategic actions remain grounded in objective and pattern-backed reasoning.

## Future Considerations

- Add daily briefing generation from knowledge context.
- Add approvals directly inside Mission Control.
- Add objective-linked workflow recommendations.

