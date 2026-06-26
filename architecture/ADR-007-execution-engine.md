# ADR-007: Execution Engine

## Context

VGOS can observe market signals, reason over intelligence, recommend actions, orchestrate workflows, and build plans. The missing layer is execution: turning planned work into owned, trackable execution records with proof, approvals, blockers, and outcomes.

Without a dedicated execution model, VGOS would collapse back into generic tasks and lose the relationship between planning, evidence, measurable results, and future learning.

## Decision

Add an Execution Engine with dedicated execution models and reusable kernel services under `src/kernel/execution/`. Execution items can be created from plans, plan items, recommended actions, workflow runs, objectives, campaigns, and manual mission-control priorities.

Execution is represented by:

- `ExecutionItem` for the owned work being shipped.
- `ExecutionEvidence` for proof such as URLs, screenshots, files, metrics, live backlinks, posts, comments, or demo assets.
- `ExecutionBlocker` for anything preventing progress.
- `ApprovalRequest` for review gates before external-facing work ships.
- `ExecutionResult` for what happened, what moved, and what VGOS should learn.

Mission Control and the execution pages use the kernel services to start, complete, queue, score, and inspect execution work. The event system records execution starts, blockers, approvals, evidence, completions, and results so later memory and recommendation layers can learn from shipped work.

## Consequences

- VGOS now has a bridge from plan to action to proof to result.
- Completion is no longer a status toggle; it can carry evidence, actual impact, metrics, and learning.
- Recommended actions and plan items can be updated when their linked execution item is completed.
- Blockers and approvals become first-class operational intelligence instead of notes inside a task.
- The system remains rule-based and local for now, while preserving clear seams for background jobs and AI providers later.

## Future Considerations

- Add background workers for scheduled execution, reminders, and recurring follow-up.
- Add provider integrations for publishing, screenshots, analytics, and backlink verification.
- Compare predicted outcomes with execution results to improve planning confidence.
- Promote high-signal execution learnings into memory and future recommendations.
- Add role-based approval policies for legal, brand, SEO, founder, and product reviews.
