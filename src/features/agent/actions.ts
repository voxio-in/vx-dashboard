"use server";

import connectDB from "@/lib/db";
import Agent from "@/features/agent/model";
import Flow from "@/features/flow/model";
import { revalidatePath } from "next/cache";

export async function saveAgentConfiguration(flowId: string, rawData: any) {
  try {
    await connectDB();
    console.log(`[Agent Action] Processing Flow ID: ${flowId}`);

    const flow = await Flow.findById(flowId);
    if (!flow) return { success: false, message: "Flow not found" };

    let agent;

    if (flow.agent_id) {
      agent = await Agent.findById(flow.agent_id);
    }

    if (!agent) {
      console.log(`[Agent Action] Creating new Agent structure...`);
      agent = await Agent.create({
        workflow: {
          nodes: [{}, {}, {}, { type: "llm", name: "llm", parameters: {} }],
        },
      });
      flow.agent_id = agent._id;
      await flow.save();
    }

    if (!agent.workflow) agent.workflow = { nodes: [] };
    if (!agent.workflow.nodes) agent.workflow.nodes = [];
    while (agent.workflow.nodes.length <= 3) {
      agent.workflow.nodes.push({});
    }

    const targetNode = agent.workflow.nodes[3];
    if (!targetNode.parameters) targetNode.parameters = {};

    targetNode.parameters.system_prompt = rawData.systemPrompt;
    targetNode.parameters.service = rawData.provider;
    targetNode.parameters.model = rawData.model;

    agent.markModified("workflow.nodes");

    await agent.save();
    console.log(`[Agent Action] Saved: ${rawData.model} / ${rawData.provider}`);

    revalidatePath(`/reseller/flow/${flowId}/agent`);
    revalidatePath(`/reseller/flow/${flowId}`);

    return { success: true, message: "Agent configuration saved" };
  } catch (error: any) {
    console.error("Save Agent Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
