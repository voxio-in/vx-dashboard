import Agent, { AgentDocument } from "@/features/agent/model";
import connectDB from "@/lib/db";

export async function getAgentByFlowId(agentId?: string) {
  if (!agentId) return null;

  try {
    await connectDB();

    const agent = await Agent.findById(agentId);

    if (!agent || !agent.workflow) return null;

    let rawNodes = agent.get("workflow.nodes") || agent.workflow.nodes;
    let nodes = JSON.parse(JSON.stringify(rawNodes || {}));

    console.log("🔵 [Queries] Node keys:", Object.keys(nodes));

    const llmNode = nodes.llm;

    if (!llmNode || llmNode.type !== "llm") {
      console.log("🔴 [Queries] LLM node not found");
      return null;
    }

    const params = llmNode.parameters || {};

    return {
      systemPrompt: params.system_prompt || "",
      provider: params.service || "groq",
      model: params.model || "llama-3.3-70b-versatile",
    };
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}
