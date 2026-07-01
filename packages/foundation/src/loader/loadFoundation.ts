import type { FoundationManifest, FoundationRegistry, FoundationSnapshot } from "../types/foundation";
import { normalizeRegistry } from "../registry/registry";

export interface LoadFoundationInput {
  manifest: FoundationManifest;
  registry: Partial<FoundationRegistry>;
}

export function loadFoundation(input: LoadFoundationInput): FoundationSnapshot {
  return {
    manifest: input.manifest,
    registry: normalizeRegistry(input.registry),
  };
}
