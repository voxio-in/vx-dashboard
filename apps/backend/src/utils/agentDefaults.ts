export const getDefaultAgentStructure = () => ({
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
          input_variables: { user_input: { type: "str" } },
          prompt_template: "base_llm",
          system_prompt: "You are a helpful agent",
          service: "groq",
          model: "llama-3.3-70b-versatile",
          history_key: "conversation_history",
          emotion: false,
          emotion_tts: "eleven_v3",
          llm_return_type: { speak: { type: "str" } },
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
