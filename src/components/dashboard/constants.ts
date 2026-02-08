export const ALL_COLUMNS = [
  {
    key: "startTime",
    label: "Start Time",
    fixed: false,
    description: "The date and time when the interaction began.",
  },
  {
    key: "endTime",
    label: "End Time",
    fixed: false,
    description: "The timestamp when the session ended.",
  },
  {
    key: "sessionDuration",
    label: "Duration",

    fixed: false,
    description: "Total elapsed time of the session from start to finish.",
  },
  {
    key: "timeConnected",
    label: "Connected",
    fixed: false,
    description: "Time spent actively connected to a human or AI agent.",
  },
  {
    key: "totalAiTime",
    label: "AI Time",
    fixed: false,
    description: "Duration where the AI was speaking or processing.",
  },
  {
    key: "totalHumanTime",
    label: "Human",
    fixed: false,
    description: "Duration where the human participant was speaking.",
  },
  {
    key: "transcription",
    label: "Trans.",
    fixed: false,
    description: "Availability of the text transcript for this session.",
  },
  {
    key: "recording",
    label: "Rec.",
    fixed: false,
    description: "Availability of the audio recording.",
  },
  {
    key: "timeRatio",
    label: "Ratio %",
    fixed: false,
    description:
      "Percentage of total session time spent in active conversation.",
  },
  {
    key: "tokenRatio",
    label: "Tokens",
    fixed: false,
    description: "Efficiency score based on tokens used vs duration.",
  },
  {
    key: "aiTokens",
    label: "AI Tok.",
    fixed: false,
    description: "Total LLM tokens consumed by the AI during this session.",
  },
];

export const TYPE_FILTERS = ["All", "Voice", "Chat"] as const;

export const FLOW_NAMES = [
  "Customer Support",
  "Sales Bot",
  "Booking Assistant",
  "Tech Support",
  "FAQ Handler",
  "Lead Qualification",
  "Appointment Scheduler",
  "Order Status",
];
