import Flow from "@/features/flow/model";
import connectDB from "@/lib/db";
import { IFlow } from "@/types";

// Helper to make Mongoose objects safe for Next.js Client Components
function serializeFlow(flow: any): IFlow {
  return {
    _id: flow._id.toString(),
    name: flow.name,
    api_key: flow.api_key,
    stt_id: flow.stt_id?.toString() || undefined,
    tts_id: flow.tts_id?.toString() || undefined,
    agent_id: flow.agent_id?.toString() || undefined,
    createdAt: flow.createdAt?.toISOString(), // Convert Date to String
  };
}

export async function getFlowById(flowId: string) {
  await connectDB();
  const flow = await Flow.findById(flowId).lean();
  if (!flow) return null;
  return serializeFlow(flow);
}

export async function getUserFlows(flowIds: any[]) {
  await connectDB();
  const flows = await Flow.find({ _id: { $in: flowIds } })
    .sort({ createdAt: -1 })
    .lean();

  return flows.map(serializeFlow);
}
