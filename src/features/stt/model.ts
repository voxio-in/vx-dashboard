import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISTT {
  service: "groq" | "deepgram" | "assemblyai";
  "model-name": string;
  language?: string | null;
  prompt?: string | null;
  temperature?: number | null | 0;
  keyterms?: string | null;
  channels: number;
  sample_rate: number;
  sample_width: number;
}

export interface STTDocument extends ISTT, Document {
  createdAt: Date;
  updatedAt: Date;
}

const STTSchema = new Schema<STTDocument>(
  {
    service: {
      type: String,
      required: true,
      enum: ["groq", "deepgram", "assemblyai"],
    },
    "model-name": {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: false,
    },
    prompt: { type: String, default: "" },
    temperature: { type: Number, default: 0 },
    keyterms: { type: String, default: "" },
    // Technical defaults
    channels: { type: Number, default: 1 },
    sample_rate: { type: Number, default: 16000 },
    sample_width: { type: Number, default: 2 },
  },
  {
    timestamps: true,
    collection: "stt",
  },
);

const STT: Model<STTDocument> =
  mongoose.models.STT || mongoose.model<STTDocument>("STT", STTSchema);

export default STT;
