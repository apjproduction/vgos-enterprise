import { createScopedId, orgId } from "@/lib/vgos-data";
import type { DecisionOption, DecisionOptionType, DecisionSituation } from "@/kernel/deliberation/deliberation-types";

function nowIso() {
  return new Date().toISOString();
}

function createOption(input: {
  situation: DecisionSituation;
  title: string;
  description: string;
  optionType: DecisionOptionType;
  expectedImpact: number;
  estimatedEffort: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidenceScore: number;
  pros: string[];
  cons: string[];
  assumptions: string[];
  evidence: string[];
}): DecisionOption {
  const date = nowIso();
  return {
    id: createScopedId("decision-option"),
    organizationId: input.situation.organizationId ?? orgId,
    workspaceId: input.situation.workspaceId,
    situationId: input.situation.id,
    title: input.title,
    description: input.description,
    optionType: input.optionType,
    expectedImpact: input.expectedImpact,
    estimatedEffort: input.estimatedEffort,
    riskLevel: input.riskLevel,
    confidenceScore: input.confidenceScore,
    pros: input.pros,
    cons: input.cons,
    assumptions: input.assumptions,
    evidence: input.evidence,
    createdAt: date,
    updatedAt: date
  };
}

export function generateContentOptions(situation: DecisionSituation): DecisionOption[] {
  return [
    createOption({
      situation,
      title: "Publish the content now.",
      description: "Ship the content while demand is active and use follow-up work to add proof.",
      optionType: "CREATE_CONTENT",
      expectedImpact: 78,
      estimatedEffort: 42,
      riskLevel: "HIGH",
      confidenceScore: 0.72,
      pros: ["Captures search and launch momentum.", "Keeps content cadence moving."],
      cons: ["May publish before proof assets are ready.", "Conversion trust may be weaker."],
      assumptions: ["Demand is durable enough to justify publishing now.", "Proof can be added shortly after publication."],
      evidence: ["BLOG-005 supports the authority cluster.", "Product-page-to-video demand is active."]
    }),
    createOption({
      situation,
      title: "Finish the product demo first.",
      description: "Delay publication until a proof asset can support the content and BOFU claims.",
      optionType: "CREATE_DEMO",
      expectedImpact: 86,
      estimatedEffort: 72,
      riskLevel: "MEDIUM",
      confidenceScore: 0.82,
      pros: ["Improves conversion trust.", "Strengthens content with visible proof."],
      cons: ["Delays search momentum.", "Consumes scarce execution capacity."],
      assumptions: ["Proof assets materially improve conversion.", "The content window remains open after demo work."],
      evidence: ["Demo proof needed before BOFU push.", "Product Hunt comments ask for proof."]
    }),
    createOption({
      situation,
      title: "Publish a shorter founder post instead.",
      description: "Use founder-led narrative to keep momentum while the full content and demo mature.",
      optionType: "CREATE_CONTENT",
      expectedImpact: 72,
      estimatedEffort: 36,
      riskLevel: "MEDIUM",
      confidenceScore: 0.78,
      pros: ["Uses founder trust.", "Lower effort than full publication."],
      cons: ["Does not replace the demo.", "Needs founder review capacity."],
      assumptions: ["Founder-led posts outperform company-only content.", "Founder capacity is available this week."],
      evidence: ["Founder posts create better comments."]
    })
  ];
}

export function generateExecutionOptions(situation: DecisionSituation): DecisionOption[] {
  return [
    createOption({
      situation,
      title: "Start the highest-risk execution now.",
      description: "Commit capacity to the execution item that unlocks the most downstream work.",
      optionType: "START_EXECUTION",
      expectedImpact: 84,
      estimatedEffort: 66,
      riskLevel: "MEDIUM",
      confidenceScore: 0.78,
      pros: ["Unblocks dependent work.", "Creates a visible operating decision."],
      cons: ["May crowd out smaller ready tasks."],
      assumptions: ["The blocker is solvable this week.", "Downstream work depends on this execution."],
      evidence: ["Work queue has conflicting high-priority items."]
    }),
    createOption({
      situation,
      title: "Schedule a narrow execution block.",
      description: "Reserve a limited work block and keep the rest of the queue intact.",
      optionType: "START_EXECUTION",
      expectedImpact: 72,
      estimatedEffort: 44,
      riskLevel: "LOW",
      confidenceScore: 0.74,
      pros: ["Controls capacity risk.", "Still moves the decision forward."],
      cons: ["May not fully resolve the blocker."],
      assumptions: ["A partial block is enough to make progress."],
      evidence: ["Estimated workload is constrained."]
    })
  ];
}

export function generateStrategyOptions(situation: DecisionSituation): DecisionOption[] {
  return [
    createOption({
      situation,
      title: "Increase the strategic focus this week.",
      description: "Shift priority toward the option with stronger learning and mission alignment.",
      optionType: "CHANGE_STRATEGY",
      expectedImpact: 82,
      estimatedEffort: 58,
      riskLevel: "MEDIUM",
      confidenceScore: 0.78,
      pros: ["Aligns current capacity with strongest learning.", "Makes the strategy change explicit."],
      cons: ["May slow other channels."],
      assumptions: ["Recent learning is reliable enough to change priority."],
      evidence: ["Reflections and learnings support recalibration."]
    }),
    createOption({
      situation,
      title: "Run a focused experiment first.",
      description: "Test the strategy change before moving the whole operating plan.",
      optionType: "RUN_EXPERIMENT",
      expectedImpact: 68,
      estimatedEffort: 46,
      riskLevel: "LOW",
      confidenceScore: 0.73,
      pros: ["Improves evidence quality.", "Limits downside."],
      cons: ["Slower than direct commitment."],
      assumptions: ["The test can produce a useful signal quickly."],
      evidence: ["Evidence gaps remain in the current decision."]
    })
  ];
}

export function generateDeferOption(situation: DecisionSituation): DecisionOption {
  return createOption({
    situation,
    title: "Defer until stronger evidence is available.",
    description: "Wait for measurement, connector data, or proof readiness before committing.",
    optionType: "DEFER_DECISION",
    expectedImpact: 42,
    estimatedEffort: 12,
    riskLevel: "LOW",
    confidenceScore: 0.62,
    pros: ["Avoids low-evidence commitment.", "Protects capacity."],
    cons: ["May miss momentum.", "Leaves the decision unresolved."],
    assumptions: ["The opportunity remains available after more evidence arrives."],
    evidence: ["Confidence is bounded when evidence is weak."]
  });
}

export function generateDoNothingOption(situation: DecisionSituation): DecisionOption {
  return createOption({
    situation,
    title: "Do nothing today.",
    description: "Make no active change and let current priorities stand.",
    optionType: "DO_NOTHING",
    expectedImpact: 24,
    estimatedEffort: 0,
    riskLevel: "MEDIUM",
    confidenceScore: 0.45,
    pros: ["Consumes no new capacity.", "Avoids premature action."],
    cons: ["Lets blockers and ambiguity persist.", "May waste current demand."],
    assumptions: ["Current operating plan is good enough without intervention."],
    evidence: ["No new commitment is made."]
  });
}

export function generateOptionsForSituation(situation: DecisionSituation): DecisionOption[] {
  const text = `${situation.title} ${situation.description}`.toLowerCase();
  const coreOptions = /blog|content|publish|founder/.test(text)
    ? generateContentOptions(situation)
    : /strategy|channel|directory|pause|increase/.test(text)
      ? generateStrategyOptions(situation)
      : generateExecutionOptions(situation);

  return [...coreOptions, generateDeferOption(situation), generateDoNothingOption(situation)];
}
