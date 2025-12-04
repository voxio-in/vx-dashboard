import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFlowById } from "@/features/flow/queries";
import { getTTSByFlowId } from "@/features/tts/queries";
import TTSConfigClient from "./TTSConfigClient";
import { IFlow } from "@/types";

export default async function TTSPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Auth Check
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // 2. Fetch Flow Data
  const flow = (await getFlowById(id)) as IFlow | null;
  if (!flow) redirect("/reseller/panel");

  // 3. Security Check
  const userFlows = user.flows || [];
  const isOwner = userFlows.some((f: any) => f.toString() === id);

  if (!isOwner) {
    redirect("/reseller/panel");
  }

  // 4. Fetch Existing TTS Config
  let existingConfig = null;
  if (flow.tts_id) {
    existingConfig = await getTTSByFlowId(flow.tts_id);
  }

  // 5. Render Client Component
  return <TTSConfigClient flow={flow} initialConfig={existingConfig} />;
}
