import type { KernelResult } from "@/kernel/quality/quality-types";
import { logError } from "@/lib/observability/logger";

export type TrackedError = {
  message: string;
  action: string;
  entityType?: string;
  entityId?: string;
  workspaceId?: string;
  metadata?: Record<string, unknown>;
};

export function ok<T>(data: T, warnings: string[] = []): KernelResult<T> {
  return { success: true, data, warnings };
}

export function fail<T = never>(error: string, warnings: string[] = []): KernelResult<T> {
  return { success: false, error, warnings };
}

export function trackError(input: TrackedError) {
  return logError({
    workspaceId: input.workspaceId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    message: input.message,
    metadata: input.metadata
  });
}

export function withKernelResult<T>(
  action: string,
  operation: () => T,
  context: Omit<TrackedError, "action" | "message"> = {}
): KernelResult<T> {
  try {
    return ok(operation());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    trackError({ ...context, action, message });
    return fail(message);
  }
}
export async function withAsyncKernelResult<T>(
  action: string,
  operation: () => Promise<T>,
  context: Omit<TrackedError, "action" | "message"> = {}
): Promise<KernelResult<T>> {
  try {
    return ok(await operation());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    trackError({ ...context, action, message });
    return fail(message);
  }
}

