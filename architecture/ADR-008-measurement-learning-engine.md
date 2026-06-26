# ADR-008: Measurement & Learning Engine

## Status

Accepted

## Context

VGOS already converts intelligence into plans and execution items, but execution alone does not prove that the strategy worked. VidMaker needs a repeatable way to capture metric movement, learn from outcomes, attribute impact, and feed those lessons back into recommendations and future plans.

## Decision

Add a Measurement & Learning Engine as a first-class kernel capability.

The engine introduces durable models for Metric, Measurement, Learning, Attribution, and StrategyAdjustment. It also adds rule-based services for creating measurements from execution results, generating learnings from measurements or results, inferring attributions, and proposing strategy adjustments.

The product flow becomes:

Execution -> Evidence -> Result -> Measurement -> Learning -> Attribution -> Strategy Adjustment -> Updated Plan -> Better Recommendation

## Consequences

- Mission Control can show whether shipped work is producing measurable movement.
- Plans and predicted outcomes can be compared against actual measurements.
- Learnings become reusable strategy inputs rather than free-text notes.
- Attributions remain transparent and rule-based while VGOS has no external analytics or AI provider.
- Strategy adjustments can be accepted, rejected, or implemented without breaking existing planning and execution flows.

## Future Work

- Connect metrics to real analytics, Search Console, social, and CRM sources.
- Add confidence calibration from historical prediction accuracy.
- Promote accepted strategy adjustments into generated plan updates.
- Let AI providers draft learning summaries and attribution rationales when API keys are available.
