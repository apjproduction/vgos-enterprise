export type CapabilityStatus = "ACTIVE" | "BETA" | "PLANNED" | "PAUSED";

export type CapabilityDefinition = {
  id: string;
  name: string;
  description: string;
  version: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  eventsConsumed: string[];
  eventsProduced: string[];
  status: CapabilityStatus;
};

