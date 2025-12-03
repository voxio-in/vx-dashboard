import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFlowById } from "@/features/flow/queries";
import { getAgentByFlowId } from "@/features/agent/queries";
import AgentConfigClient from "./AgentConfigClient";
import { IFlow } from "@/types";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const flow = (await getFlowById(id)) as IFlow | null;
  if (!flow) redirect("/reseller/panel");

  const userFlows = user.flows || [];
  const isOwner = userFlows.some((f: any) => f.toString() === id);

  if (!isOwner) {
    redirect("/reseller/panel");
  }

  let existingConfig = null;
  if (flow.agent_id) {
    existingConfig = await getAgentByFlowId(flow.agent_id.toString());
  }

  return <AgentConfigClient flow={flow} initialConfig={existingConfig} />;
}
