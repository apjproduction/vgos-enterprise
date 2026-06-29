import type { QualityBand, SignalQualityInput, SignalQualityResult } from "@/kernel/quality/quality-types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function bandFor(score: number): QualityBand {
  if (score >= 85) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 45) return "MEDIUM";
  return "LOW";
}

export function calculateSignalQuality(signal: SignalQualityInput): SignalQualityResult {
  const warnings: string[] = [];
  const summaryLength = String(signal.summary ?? signal.description ?? "").trim().length;
  const titleLength = String(signal.title ?? signal.name ?? "").trim().length;
  const confidence = signal.confidenceScore ?? 0.7;
  const hasSource = Boolean(signal.source || signal.sourceType || signal.platform);
  const hasUrl = Boolean(signal.url || signal.sourceUrl);
  const hasPayload = Boolean(signal.rawPayload || signal.metadata);

  if (titleLength < 8) warnings.push("Short title");
  if (summaryLength < 30) warnings.push("Thin summary");
  if (!hasSource) warnings.push("Missing source");
  if (!hasUrl) warnings.push("Missing source URL");
  if (!hasPayload) warnings.push("Missing payload metadata");
  if (confidence < 0.55) warnings.push("Low source confidence");
  if (signal.status === "FAILED") warnings.push("Signal failed before routing");

  const score = clampScore(
    30 +
      Math.min(18, titleLength / 4) +
      Math.min(20, summaryLength / 12) +
      confidence * 22 +
      (hasSource ? 8 : 0) +
      (hasUrl ? 6 : 0) +
      (hasPayload ? 6 : 0) -
      (signal.status === "FAILED" ? 20 : 0)
  );

  return {
    score,
    band: bandFor(score),
    warnings,
    explanation:
      warnings.length > 0
        ? `Signal quality is ${score}/100 because ${warnings.join(", ").toLowerCase()} needs review.`
        : `Signal quality is ${score}/100 with source, summary, confidence, and payload context present.`
  };
}
