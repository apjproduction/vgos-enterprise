import { FounderShell } from "@/components/founder/founder-shell";
import { getFounderWorkspaceData } from "@/lib/founder-os";

export default function FounderRoute() {
  return <FounderShell data={getFounderWorkspaceData()} />;
}
