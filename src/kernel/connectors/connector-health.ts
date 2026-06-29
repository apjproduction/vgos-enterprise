import type { ConnectorHealth, ConnectorHealthInput } from "@/kernel/connectors/connector-types";

export function getConnectorHealth({ connector, recentRuns }: ConnectorHealthInput): ConnectorHealth {
  const reasons: string[] = [];
  let score = 100;

  if (connector.status === "ERROR") {
    score -= 40;
    reasons.push("Connector is in error state.");
  }
  if (connector.status === "DISCONNECTED" || connector.status === "PAUSED") {
    score -= 25;
    reasons.push(`Connector is ${connector.status.toLowerCase()}.`);
  }
  if (!connector.lastSyncAt) {
    score -= 20;
    reasons.push("Connector has not synced yet.");
  } else {
    const daysSinceSync = (Date.now() - new Date(connector.lastSyncAt).getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceSync > 7) {
      score -= 18;
      reasons.push("Last sync is older than seven days.");
    }
  }

  const failedRuns = recentRuns.filter((run) => run.status === "FAILED").length;
  const fetched = recentRuns.reduce((total, run) => total + run.recordsFetched, 0);
  const routed = recentRuns.reduce((total, run) => total + run.recordsRouted, 0);
  if (failedRuns > 0) {
    score -= failedRuns * 12;
    reasons.push(`${failedRuns} recent sync failure${failedRuns === 1 ? "" : "s"}.`);
  }
  if (fetched > 0 && routed / Math.max(fetched, 1) < 0.5) {
    score -= 15;
    reasons.push("Less than half of fetched records were routed.");
  }
  if (!connector.config || Object.keys(connector.config).length === 0) {
    score -= 15;
    reasons.push("Connector config is incomplete.");
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: finalScore,
    status: finalScore < 45 ? "ERROR" : connector.status,
    reasons: reasons.length ? reasons : ["Connector is healthy."]
  };
}
