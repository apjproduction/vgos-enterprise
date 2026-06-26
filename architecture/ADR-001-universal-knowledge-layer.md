# ADR-001: Universal Knowledge Layer

## Context

VGOS already tracks conversations, questions, pain points, content, keywords, entities, communities, competitors, backlinks, recommendations, and kernel artifacts. Treating each module as a separate island limits reasoning and makes cross-module intelligence brittle.

## Decision

Introduce `KnowledgeObject` and `KnowledgeRelationship` as canonical, workspace-scoped records. Every important source object can be represented in the knowledge layer with a stable canonical ID, type, source reference, aliases, tags, metadata, confidence, and importance.

## Consequences

- VGOS can connect a question to a content asset, objective, entity, memory, and recommendation through typed relationships.
- Mission Control can summarize knowledge coverage and gaps from one graph-like layer.
- The app avoids returning to a generic record model because each source domain model still exists separately.

## Future Considerations

- Add graph traversal queries for multi-hop reasoning.
- Add relationship provenance from agent runs and workflow steps.
- Add role-based controls for editing canonical objects.

