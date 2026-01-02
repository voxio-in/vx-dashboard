import Agent from "@/features/agent/model";
import connectDB from "@/lib/db";

export async function getAgentByFlowId(agentId?: string) {
  if (!agentId) return null;

  try {
    await connectDB();

    const agent = await Agent.findById(agentId);

    if (!agent || !agent.workflow) return null;

    // Handle Mongoose Map vs Object
    const rawNodes = agent.get("workflow.nodes") || agent.workflow.nodes;
    const rawVars = agent.get("workflow.variables") || agent.workflow.variables;

    const nodes = JSON.parse(JSON.stringify(rawNodes || {}));
    const variables = JSON.parse(JSON.stringify(rawVars || {}));

    console.log("🔵 [Queries] Node keys:", Object.keys(nodes));

    // 1. Identify Workflow Type
    const isRolePlay = !!nodes.feedback && !!nodes.summary;

    // 2. Extract Common Fields (Main LLM & Greeting)
    const llmNode = nodes.llm;
    const greetingNode = nodes.greeting;

    if (!llmNode || llmNode.type !== "llm") {
      return null;
    }

    const mainParams = llmNode.parameters || {};

    // Greeting
    let greetingText = "";
    if (greetingNode && greetingNode.type === "out") {
      greetingText = greetingNode.parameters?.out_dict?.speak || "";
    }

    // 3. Extract Role Play Specific Fields
    let traineeName = "";

    // Feedback defaults
    let feedbackPrompt = "";
    let feedbackProvider = "groq";
    let feedbackModel = "llama-3.3-70b-versatile";
    let feedbackEmotion = false;
    let feedbackEmotionModel = "eleven_v3";

    // Summary defaults
    let summaryPrompt = "";
    let summaryProvider = "groq";
    let summaryModel = "llama-3.3-70b-versatile";
    let summaryEmotion = false;
    let summaryEmotionModel = "eleven_v3";

    if (isRolePlay) {
      traineeName = variables?.trainee_name?.default || "";

      // Feedback
      const fbParams = nodes.feedback?.parameters || {};
      feedbackPrompt = fbParams.system_prompt || "";
      feedbackProvider = fbParams.service || "groq";
      feedbackModel = fbParams.model || "llama-3.3-70b-versatile";
      feedbackEmotion = fbParams.emotion || false;
      feedbackEmotionModel =
        fbParams.emotion_tts || "eleven_v3";

      // Summary
      const sumParams = nodes.summary?.parameters || {};
      summaryPrompt = sumParams.system_prompt || "";
      summaryProvider = sumParams.service || "groq";
      summaryModel = sumParams.model || "llama-3.3-70b-versatile";
      summaryEmotion = sumParams.emotion || false;
      summaryEmotionModel =
        sumParams.emotion_tts || "eleven_v3";
    }

    return {
      isRolePlay,
      greeting: greetingText,
      // Main LLM Config
      systemPrompt: mainParams.system_prompt || "",
      provider: mainParams.service || "groq",
      model: mainParams.model || "llama-3.3-70b-versatile",
      emotion: mainParams.emotion || false,
      emotionModel: mainParams.emotion_tts || "eleven_v3",
      // Role Play Configs
      traineeName,
      feedbackPrompt,
      feedbackProvider,
      feedbackModel,
      feedbackEmotion,
      feedbackEmotionModel,
      summaryPrompt,
      summaryProvider,
      summaryModel,
      summaryEmotion,
      summaryEmotionModel,
    };
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}
