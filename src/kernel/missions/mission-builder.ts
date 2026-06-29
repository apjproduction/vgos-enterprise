import { createMission } from "@/kernel/missions/mission-engine";
import type { MissionBuilderResult, MissionContext, MissionInput } from "@/kernel/missions/mission-types";
import type { MissionType, Objective, Plan } from "@/lib/vgos-data";

function buildMission(input: MissionInput, context: MissionContext, recommendations: MissionBuilderResult["recommendedActions"]): MissionBuilderResult {
  return {
    mission: createMission(input, context),
    objectives: [],
    plans: [],
    recommendedActions: recommendations
  };
}

export function createAuthorityMission(context: MissionContext, title = "Authority Mission") {
  return buildMission(
    {
      title,
      description: "Build durable authority through category content, directories, backlinks, and founder proof.",
      missionType: "AUTHORITY",
      owner: "Authority",
      priority: "HIGH"
    },
    context,
    [
      {
        id: "mission-builder-authority-action",
        title: "Prioritize authority proof",
        action: "Link category content to directory and backlink execution.",
        priority: "HIGH",
        reasoning: "Authority missions need proof and distribution connected to one measurable loop."
      }
    ]
  );
}

export function createProductLaunchMission(context: MissionContext, title = "Product Launch Mission") {
  return buildMission(
    {
      title,
      description: "Coordinate launch proof, community response, demos, and measurement.",
      missionType: "LAUNCH",
      owner: "Growth",
      priority: "CRITICAL"
    },
    context,
    [
      {
        id: "mission-builder-launch-action",
        title: "Create launch proof loop",
        action: "Pair community replies with one demo and one measured conversion path.",
        priority: "CRITICAL",
        reasoning: "Launch attention decays unless it becomes proof, response, and measurement."
      }
    ]
  );
}

export function createContentMission(context: MissionContext, title = "Content Mission") {
  return buildMission(
    {
      title,
      description: "Ship a connected content cluster with internal links, answer coverage, and measurement.",
      missionType: "CONTENT",
      owner: "Content",
      priority: "HIGH"
    },
    context,
    []
  );
}

export function createCommunityMission(context: MissionContext, title = "Community Mission") {
  return buildMission(
    {
      title,
      description: "Turn recurring community signals into replies, assets, and product feedback.",
      missionType: "COMMUNITY",
      owner: "Community",
      priority: "HIGH"
    },
    context,
    []
  );
}

export function createAEOmission(context: MissionContext, title = "AEO Mission") {
  return buildMission(
    {
      title,
      description: "Increase answer-engine coverage with question-led pages, FAQ blocks, and entity clarity.",
      missionType: "AEO",
      owner: "Search",
      priority: "HIGH"
    },
    context,
    []
  );
}

export function createMissionFromObjective(objective: Objective, context: MissionContext) {
  const result = createContentMission(context, `${objective.title} mission`);
  const missionType: MissionType =
    objective.category === "BRAND" ? "GROWTH" : objective.category === "REVENUE" ? "REVENUE" : objective.category;
  return {
    ...result,
    mission: {
      ...result.mission,
      description: objective.description,
      missionType,
      priority: objective.priority,
      owner: "Growth",
      status: "ACTIVE" as const
    },
    objectives: [objective.id]
  };
}

export function createMissionFromPlans(plans: Plan[], context: MissionContext) {
  const primary = plans[0];
  const result = createContentMission(context, primary ? `${primary.title} mission` : "Plan-backed mission");
  return {
    ...result,
    mission: {
      ...result.mission,
      description: primary?.description ?? "Mission generated from selected execution plans.",
      owner: primary?.owner ?? result.mission.owner,
      status: "ACTIVE" as const
    },
    plans: plans.map((plan) => plan.id)
  };
}
