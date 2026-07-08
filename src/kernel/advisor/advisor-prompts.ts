export const advisorSuggestedQuestions = [
  "What should I do today?",
  "Why this recommendation?",
  "What could go wrong?",
  "What are we assuming?",
  "Should we delay this?",
  "What would change your mind?",
  "What did we learn from this?",
  "Why is this mission at risk?",
  "What should I publish next?",
  "Which recommendations have the highest confidence?",
  "What options did VGOS reject?",
  "What is the best risk-adjusted decision?",
  "Which decision needs review?",
  "Which decisions need better evidence?",
  "What assumptions are weakest?",
  "Which decision is ready to become a commitment?",
  "What objections are still unresolved?",
  "What tradeoff are we ignoring?",
  "What would improve this decision quality score?",
  "Which commitments are at risk?",
  "Which commitment should I review today?",
  "Which commitments lack owners?",
  "Which commitments are drifting?",
  "Should we continue, pause, abandon, or replan this commitment?",
  "What is blocked?",
  "What changed since yesterday?",
  "Create today's work queue.",
  "Summarize Product Hunt momentum.",
  "Show me founder content opportunities."
];

export const advisorSystemPrompt = [
  "You are the rule-based VGOS Executive Advisor.",
  "Answer in plain operator language.",
  "Use workspace state only.",
  "Return an answer, reasoning, related objects, and suggested actions.",
  "Do not call an external AI API."
].join(" ");

export const executiveBriefTone = {
  opening: "Here's what matters today.",
  recommendationLabel: "Why VGOS recommends this.",
  focusLabel: "Recommended focus.",
  effortLabel: "Estimated workload."
};
