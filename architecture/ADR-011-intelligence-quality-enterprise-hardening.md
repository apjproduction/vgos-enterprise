# ADR-011: Intelligence Quality & Enterprise Hardening

## Status

Accepted

## Context

VGOS now has the core growth intelligence architecture: connected signals, normalization, routing, knowledge objects, recommendations, plans, execution, measurement, learning, and mission control. Before adding more domain engines or live external integrations, the platform needs stronger trust controls around intelligence quality, confidence scoring, duplicate risk, auditability, observability, and kernel tests.

## Decision

Add an Intelligence Quality Layer under `src/kernel/quality` and keep quality logic out of React components. The layer provides rule-based scoring for signal quality, recommendation confidence, evidence strength, duplicate detection, opportunity score calibration, missing evidence, and confidence explanations.

Recommendation and action records expose quality fields: `confidenceScore`, `evidenceStrength`, `missingEvidence`, `duplicateRisk`, `qualityScore`, and `confidenceExplanation`. Creation paths run rule-based duplicate checks using title similarity, shared entities, shared keywords, source identity, and canonical IDs. The first implementation deliberately avoids embeddings so the system remains deterministic and testable.

Enterprise hardening adds structured logs, audit log helpers, environment validation, seed audit data, and Mission Control Enterprise Health metrics. Audit events capture mission, plan, execution, recommendation, connector, strategy, and manual-edit changes.

## Consequences

- Mission Control can separate high-confidence, low-confidence, duplicate-risk, and missing-evidence recommendations.
- Kernel services get focused unit tests before live integrations expand the system surface area.
- Optional connector credentials do not crash the app when missing.
- Audit history and structured logs make operator changes and kernel decisions easier to inspect.
- Rule-based duplicate detection is intentionally conservative and can later be augmented by embeddings without changing the calling surfaces.

## Follow-ups

- Persist quality review workflows when production authentication is added.
- Add coverage reporting once the test suite is large enough for a meaningful threshold.
- Add embedding-backed similarity after durable vector storage is available.
