import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFlowById } from "@/features/flow/queries";
import { getSTTByFlowId } from "@/features/stt/queries";
import STTConfigClient from "./STTConfigClient";
import { IFlow } from "@/types";

export default async function STTPage({
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
  if (!isOwner) redirect("/reseller/panel");

  let existingConfig = null;
  if (flow.stt_id) {
    existingConfig = await getSTTByFlowId(flow.stt_id);
  }

  return <STTConfigClient flow={flow} initialConfig={existingConfig} />;
}
