# ADR-002: Semantic Search Foundation

## Context

VGOS needs to find similar questions, entities, patterns, and recommendations even before a real embedding provider is configured. The system must remain useful in local development and on workspaces without AI keys.

## Decision

Add semantic search fields to `KnowledgeObject`: searchable text, provider, model, embedding vector, and embedding update timestamp. Implement mock semantic search with token overlap, importance, and confidence scoring.

## Consequences

- The UI can expose semantic-ready objects immediately.
- Services can prepare objects for embeddings without requiring a vector database.
- Future embedding providers can replace the mock scorer behind the same service functions.

## Future Considerations

- Add provider-specific embedding adapters.
- Store vectors in PostgreSQL with pgvector or Supabase vector search.
- Add recency and relationship strength as ranking factors.

