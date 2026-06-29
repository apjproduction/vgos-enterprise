import { createStructuredLog } from "@/lib/observability/logger";

export type PerformanceMeasurement<T> = {
  result: T;
  durationMs: number;
  log: ReturnType<typeof createStructuredLog>;
};

export function startTimer() {
  const startedAt = Date.now();
  return () => Date.now() - startedAt;
}

export function measureOperation<T>(
  action: string,
  operation: () => T,
  metadata?: Record<string, unknown>
): PerformanceMeasurement<T> {
  const stop = startTimer();
  const result = operation();
  const durationMs = stop();

  return {
    result,
    durationMs,
    log: createStructuredLog({
      level: "info",
      action,
      message: `${action} completed in ${durationMs}ms.`,
      metadata: { ...metadata, durationMs }
    })
  };
}

export async function measureAsyncOperation<T>(
  action: string,
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<PerformanceMeasurement<T>> {
  const stop = startTimer();
  const result = await operation();
  const durationMs = stop();

  return {
    result,
    durationMs,
    log: createStructuredLog({
      level: "info",
      action,
      message: `${action} completed in ${durationMs}ms.`,
      metadata: { ...metadata, durationMs }
    })
  };
}
