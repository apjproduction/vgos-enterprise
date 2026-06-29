# ADR-012: Production UX and Operational Readiness

## Status

Accepted

## Context

VGOS has strong workspace-scoped intelligence, mission, planning, execution, connector, and quality layers. The v5.4 change focuses on making that architecture usable by a founder or operator every day. It does not add another intelligence engine.

## Decision

Mission Control is now a daily operating view with seven primary sections: today's priorities, active missions, what changed, what needs approval, what is blocked, VGOS recommendations, and connected intelligence status. Dense diagnostics move to the System Health page.

Navigation is grouped by Command Center, Strategy, Operations, Intelligence, Connections, and System. New production pages include onboarding, settings, priorities, system health, and audit logs.

Reusable UI states were added for page intros, empty states, loading, errors, confirmation, status, priority, and health. Destructive deletes now require confirmation.

Workspace context now has optional production-readiness fields for onboarding completion, product context, operating preferences, and connector placeholders.

## Current Persistence Mode

The app still primarily runs from seeded/in-memory workspace state in the React shell. Prisma schema and seed data are maintained so the same fields have a database-backed target, but client mutations currently update local state.

## Production Persistence Plan

Move client mutations behind workspace-scoped API routes. Each route should validate the current user and workspace, persist with Prisma, and emit audit events for create, update, status transition, and destructive actions.

Recommended API route groups:

- `/api/workspaces/[workspaceId]/settings`
- `/api/workspaces/[workspaceId]/onboarding`
- `/api/workspaces/[workspaceId]/missions`
- `/api/workspaces/[workspaceId]/plans`
- `/api/workspaces/[workspaceId]/executions`
- `/api/workspaces/[workspaceId]/approvals`
- `/api/workspaces/[workspaceId]/connectors`
- `/api/workspaces/[workspaceId]/audit-logs`

## Authentication Readiness

`src/lib/auth/` contains a placeholder current user, Tom Promise, with Owner role for VidMaker Growth OS. Future Auth.js or Clerk integration should replace the placeholder session without changing the app's workspace-scoped UI contracts.

## Consequences

Operators get a calmer daily workflow while diagnostics remain available. The schema changes are minimal and optional. The next production step is moving local state actions to audited API routes backed by Prisma.
