# ADR-003: Workflow Engine

## Context

The Intelligence Pipeline creates structured outputs, but VGOS also needs repeatable execution paths such as question-to-content, pain-point-to-feature-request, memory-to-pattern, and directory-to-backlink.

## Decision

Introduce `Workflow`, `WorkflowStep`, and `WorkflowRun`. Workflows are workspace-scoped, triggerable manually or by events, and record run logs. The first implementation is deterministic and rule-based.

## Consequences

- Mission Control can distinguish passive intelligence from operational execution.
- Workflow runs provide a durable audit trail for recommended actions.
- Step types create a stable contract for future AI, queue, and approval integrations.

## Future Considerations

- Add approval steps for external publishing and outreach.
- Add retries, failure categories, and run-level diagnostics.
- Run workflows asynchronously through a background job processor.

