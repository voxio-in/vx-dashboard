"use server";

import connectDB from "@/lib/db";
import Agent from "@/features/agent/model";
import Flow from "@/features/flow/model";
import { revalidatePath } from "next/cache";

// Default Standard Workflow (Fallback)
const getDefaultAgentStructure = () => ({
  workflow: {
    variables: {
      user_input: { type: "str" },
      llm_response: { type: "str" },
      conversation_history: { type: "list", default: [] },
      speak: { type: "str" },
      node_type: { type: "str" },
    },
    start_node: "greeting",
    nodes: {
      greeting: {
        type: "out",
        parameters: {
          out_dict: { speak: "Hello! How can I assist you today?" },
        },
        next: "ask_for_input",
      },
      ask_for_input: {
        type: "input",
        parameters: { input_variables: { user_input: "str" } },
        next: "transcription",
      },
      transcription: {
        type: "out",
        parameters: { variables: ["user_input"] },
        next: "llm",
      },
      llm: {
        type: "llm",
        parameters: {
          input_variables: {
            user_input: { type: "str" },
          },
          prompt_template: "base_llm",
          system_prompt: "You are a helpful agent",
          service: "groq",
          model: "llama-3.3-70b-versatile",
          history_key: "conversation_history",
          emotion: false,
          emotion_tts: "eleven_v3",
          llm_return_type: {
            speak: { type: "str" },
          },
        },
        next: "response",
      },
      response: {
        type: "out",
        parameters: { variables: ["speak"] },
        next: "ask_for_input",
      },
    },
  },
});

export async function saveAgentConfiguration(flowId: string, rawData: any) {
  console.log("🟢 [Server] Received save request:", { flowId });

  try {
    await connectDB();
    const flow = await Flow.findById(flowId);
    if (!flow) return { success: false, message: "Flow not found" };

    let agent;
    if (flow.agent_id) agent = await Agent.findById(flow.agent_id);

    if (!agent) {
      agent = await Agent.create(getDefaultAgentStructure());
      flow.agent_id = agent._id;
      await flow.save();
    }

    // Get Data
    let rawNodes = agent.get("workflow.nodes") || agent.workflow.nodes;
    let rawVars = agent.get("workflow.variables") || agent.workflow.variables;

    let nodes = JSON.parse(JSON.stringify(rawNodes));
    let variables = JSON.parse(JSON.stringify(rawVars));

    const isRolePlay = !!nodes.feedback && !!nodes.summary;

    // 1. UPDATE COMMON: Main LLM
    if (nodes.llm) {
      // Only update if value is provided
      if (rawData.systemPrompt) {
        nodes.llm.parameters.system_prompt = rawData.systemPrompt;
      }
      nodes.llm.parameters.service = rawData.provider;
      nodes.llm.parameters.model = rawData.model;

      // Update Emotion
      nodes.llm.parameters.emotion = rawData.emotion;
      nodes.llm.parameters.emotion_tts = rawData.emotionModel;
    }

    // 2. UPDATE COMMON: Greeting
    if (nodes.greeting && nodes.greeting.parameters?.out_dict) {
      // Only update if value is provided
      if (rawData.greeting) {
        nodes.greeting.parameters.out_dict.speak = rawData.greeting;
      }
    }

    // 3. UPDATE ROLE PLAY SPECIFIC
    if (isRolePlay) {
      // Update Trainee Name (Only if provided)
      if (variables.trainee_name && rawData.traineeName) {
        variables.trainee_name.default = rawData.traineeName;
      }

      // Update Feedback Node
      if (nodes.feedback) {
        // Only update prompt if provided
        if (rawData.feedbackPrompt) {
          nodes.feedback.parameters.system_prompt = rawData.feedbackPrompt;
        }
        nodes.feedback.parameters.service = rawData.feedbackProvider;
        nodes.feedback.parameters.model = rawData.feedbackModel;

        // Update Feedback Emotion
        nodes.feedback.parameters.emotion = rawData.feedbackEmotion;
        nodes.feedback.parameters.emotion_tts = rawData.feedbackEmotionModel;
      }

      // Update Summary Node
      if (nodes.summary) {
        // Only update prompt if provided
        if (rawData.summaryPrompt) {
          nodes.summary.parameters.system_prompt = rawData.summaryPrompt;
        }
        nodes.summary.parameters.service = rawData.summaryProvider;
        nodes.summary.parameters.model = rawData.summaryModel;

        // Update Summary Emotion
        nodes.summary.parameters.emotion = rawData.summaryEmotion;
        nodes.summary.parameters.emotion_tts = rawData.summaryEmotionModel;
      }
    }

    // Save
    agent.workflow.nodes = nodes;
    agent.workflow.variables = variables;

    agent.markModified("workflow.nodes");
    agent.markModified("workflow.variables");

    await agent.save();

    revalidatePath(`/reseller/flow/${flowId}/agent`);
    revalidatePath(`/reseller/flow/${flowId}`);

    return { success: true, message: "Agent configuration saved" };
  } catch (error: any) {
    console.error("🔴 [Server] Save Agent Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
