import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISTT {
  service: "groq" | "deepgram";
  "model-name": string;
  language: string;
  prompt?: string;
  temperature?: number;
  keywords?: string;
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
      enum: ["groq", "deepgram"],
    },
    "model-name": {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    prompt: { type: String, default: "" },
    temperature: { type: Number, default: 0 },
    keywords: { type: String, default: "" },
    // Technical defaults
    channels: { type: Number, default: 1 },
    sample_rate: { type: Number, default: 16000 },
    sample_width: { type: Number, default: 2 },
  },
  {
    timestamps: true,
    collection: "stt",
  }
);

const STT: Model<STTDocument> =
  mongoose.models.STT || mongoose.model<STTDocument>("STT", STTSchema);

export default STT;
