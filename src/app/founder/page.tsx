import { FounderShell } from "@/components/founder/founder-shell";
import { getEnterpriseState } from "@/lib/enterprise-state";
import { mapEnterpriseStateToFounderWorkspace } from "@/lib/founder-os";

export default function FounderRoute() {
  const enterpriseState = getEnterpriseState();
  const workspaceData = mapEnterpriseStateToFounderWorkspace(enterpriseState);

  return <FounderShell data={workspaceData} />;
}
