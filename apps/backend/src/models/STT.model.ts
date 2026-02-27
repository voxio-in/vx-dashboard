import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISTT {
  flowId: mongoose.Types.ObjectId;
  service: "groq" | "deepgram" | "assemblyai";
  "model-name": string;
  language?: string | null;
  prompt?: string | null;
  temperature?: number | null;
  keyterms?: string | null;
  channels: number;
  sample_rate: number;
  sample_width: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface STTDocument extends ISTT, Document {}

const STTSchema = new Schema<STTDocument>(
  {
    flowId: {
      type: Schema.Types.ObjectId,
      ref: "Flow",
      required: true,
      unique: true,
    },
    service: {
      type: String,
      required: true,
      enum: ["groq", "deepgram", "assemblyai"],
      default: "assemblyai",
    },
    "model-name": {
      type: String,
      required: true,
      default: "universal",
    },
    language: { type: String, default: "en" },
    prompt: { type: String, default: "" },
    temperature: { type: Number, default: 0 },
    keyterms: { type: String, default: "" },
    channels: { type: Number, default: 1 },
    sample_rate: { type: Number, default: 16000 },
    sample_width: { type: Number, default: 2 },
  },
  { timestamps: true, collection: "stt" },
);

export const STT: Model<STTDocument> =
  mongoose.models.STT || mongoose.model<STTDocument>("STT", STTSchema);
