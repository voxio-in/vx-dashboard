export interface IFlow {
  _id: string;
  name: string;
  api_key: string;
  stt_id?: string;
  tts_id?: string;
  agent_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISTT {
  _id: string;
  service: "groq" | "deepgram";
  "model-name": string;
  language: string;
  prompt?: string;
  temperature?: number;
  keyterms?: string;
  createdAt?: string;
  updatedAt?: string;
}
