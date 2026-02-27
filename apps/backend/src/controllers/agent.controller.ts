import { Response } from "express";
import { Agent } from "../models/Agent.model";
import { Flow } from "../models/Flow.model";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";
import { getDefaultAgentStructure } from "../utils/agentDefaults";

export const getAgentByFlowId = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { flowId } = req.params;

    const flow = await Flow.findById(flowId);
    if (!flow)
      return res
        .status(404)
        .json({ success: false, message: "Flow not found" });

    if (!flow.agent_id) {
      return res.status(200).json({ success: true, data: { agent: null } });
    }

    const agent = await Agent.findById(flow.agent_id);
    if (!agent || !agent.workflow) {
      return res.status(200).json({ success: true, data: { agent: null } });
    }

    const rawNodes = agent.get("workflow.nodes") || agent.workflow.nodes;
    const rawVars = agent.get("workflow.variables") || agent.workflow.variables;

    const nodes = JSON.parse(JSON.stringify(rawNodes || {}));
    const variables = JSON.parse(JSON.stringify(rawVars || {}));

    const isRolePlay = !!nodes.feedback && !!nodes.summary;
    const llmNode = nodes.llm;
    const greetingNode = nodes.greeting;

    if (!llmNode || llmNode.type !== "llm") {
      return res.status(200).json({ success: true, data: { agent: null } });
    }

    const mainParams = llmNode.parameters || {};
    let greetingText = "";
    if (greetingNode?.type === "out") {
      greetingText = greetingNode.parameters?.out_dict?.speak || "";
    }

    let traineeName = "";
    let feedbackPrompt = "",
      feedbackProvider = "groq",
      feedbackModel = "llama-3.3-70b-versatile";
    let feedbackEmotion = false,
      feedbackEmotionModel = "eleven_v3";
    let summaryPrompt = "",
      summaryProvider = "groq",
      summaryModel = "llama-3.3-70b-versatile";
    let summaryEmotion = false,
      summaryEmotionModel = "eleven_v3";

    if (isRolePlay) {
      traineeName = variables?.trainee_name?.default || "";

      const fbParams = nodes.feedback?.parameters || {};
      feedbackPrompt = fbParams.system_prompt || "";
      feedbackProvider = fbParams.service || "groq";
      feedbackModel = fbParams.model || "llama-3.3-70b-versatile";
      feedbackEmotion = fbParams.emotion || false;
      feedbackEmotionModel = fbParams.emotion_tts || "eleven_v3";

      const sumParams = nodes.summary?.parameters || {};
      summaryPrompt = sumParams.system_prompt || "";
      summaryProvider = sumParams.service || "groq";
      summaryModel = sumParams.model || "llama-3.3-70b-versatile";
      summaryEmotion = sumParams.emotion || false;
      summaryEmotionModel = sumParams.emotion_tts || "eleven_v3";
    }

    res.status(200).json({
      success: true,
      data: {
        agent: {
          isRolePlay,
          greeting: greetingText,
          systemPrompt: mainParams.system_prompt || "",
          provider: mainParams.service || "groq",
          model: mainParams.model || "llama-3.3-70b-versatile",
          emotion: mainParams.emotion || false,
          emotionModel: mainParams.emotion_tts || "eleven_v3",
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
        },
      },
    });
  },
);

export const saveAgentConfiguration = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { flowId } = req.params;
    const rawData = req.body;

    const flow = await Flow.findById(flowId);
    if (!flow)
      return res
        .status(404)
        .json({ success: false, message: "Flow not found" });

    let agent = flow.agent_id ? await Agent.findById(flow.agent_id) : null;

    if (!agent) {
      agent = await Agent.create(getDefaultAgentStructure());
      flow.agent_id = agent._id;
      await flow.save();
    }

    let nodes = JSON.parse(
      JSON.stringify(agent.get("workflow.nodes") || agent.workflow.nodes),
    );
    let variables = JSON.parse(
      JSON.stringify(
        agent.get("workflow.variables") || agent.workflow.variables,
      ),
    );

    const isRolePlay = !!nodes.feedback && !!nodes.summary;

    if (nodes.llm) {
      if (rawData.systemPrompt)
        nodes.llm.parameters.system_prompt = rawData.systemPrompt;
      nodes.llm.parameters.service = rawData.provider;
      nodes.llm.parameters.model = rawData.model;
      nodes.llm.parameters.emotion = rawData.emotion;
      nodes.llm.parameters.emotion_tts = rawData.emotionModel;
    }

    if (nodes.greeting?.parameters?.out_dict && rawData.greeting) {
      nodes.greeting.parameters.out_dict.speak = rawData.greeting;
    }

    if (isRolePlay) {
      if (variables.trainee_name && rawData.traineeName) {
        variables.trainee_name.default = rawData.traineeName;
      }
      if (nodes.feedback) {
        if (rawData.feedbackPrompt)
          nodes.feedback.parameters.system_prompt = rawData.feedbackPrompt;
        nodes.feedback.parameters.service = rawData.feedbackProvider;
        nodes.feedback.parameters.model = rawData.feedbackModel;
        nodes.feedback.parameters.emotion = rawData.feedbackEmotion;
        nodes.feedback.parameters.emotion_tts = rawData.feedbackEmotionModel;
      }
      if (nodes.summary) {
        if (rawData.summaryPrompt)
          nodes.summary.parameters.system_prompt = rawData.summaryPrompt;
        nodes.summary.parameters.service = rawData.summaryProvider;
        nodes.summary.parameters.model = rawData.summaryModel;
        nodes.summary.parameters.emotion = rawData.summaryEmotion;
        nodes.summary.parameters.emotion_tts = rawData.summaryEmotionModel;
      }
    }

    agent.workflow.nodes = nodes;
    agent.workflow.variables = variables;
    agent.markModified("workflow.nodes");
    agent.markModified("workflow.variables");
    await agent.save();

    res
      .status(200)
      .json({ success: true, message: "Agent configuration saved" });
  },
);
