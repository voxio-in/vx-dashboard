import Agent, { AgentDocument } from "@/features/agent/model";
import connectDB from "@/lib/db";

export async function getAgentByFlowId(agentId?: string) {
  if (!agentId) return null;

  await connectDB();

  const agent = (await Agent.findById(
    agentId
  ).lean()) as unknown as AgentDocument;

  if (
    !agent ||
    !agent.workflow ||
    !agent.workflow.nodes ||
    agent.workflow.nodes.length <= 3
  ) {
    return null;
  }

  const node3 = agent.workflow.nodes[3];
  const params = node3.parameters || {};

  return {
    systemPrompt: params.system_prompt || "",
    provider: params.service || "groq",
    model: params.model || "llama-3.1-8b-instant",
  };
}
