# ADR-006: Planning Engine

## Context

VGOS can observe signals, remember recurring market evidence, detect patterns, reason about opportunities, recommend actions, and orchestrate workflows. The missing capability is execution planning: deciding what should happen next, in what order, why it matters, what depends on what, and what outcome is expected.

## Decision

Add a Planning Engine with dedicated planning models and kernel services. Plans connect objectives, recommendations, patterns, constraints, dependencies, predicted outcomes, and resource capacity. Planning logic lives under `src/kernel/planning/` so React pages remain operational surfaces rather than planning brains.

## Consequences

- VGOS can generate structured execution plans from objectives, recommended actions, and patterns.
- Mission Control can surface active plans, draft plans, blocked items, overdue items, predicted outcomes, resource capacity, and health scores.
- Plan dependencies and constraints explain why certain work must happen first.
- Rule-based predictions keep the system usable without external AI APIs.

## Future Considerations

- Add approval gates for plan activation and externally visible work.
- Add calendar integrations and workload balancing across real team members.
- Add learning loops that compare predicted outcomes with actual outcomes.
- Add AI-assisted plan generation once provider keys are configured.

