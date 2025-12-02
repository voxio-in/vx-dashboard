import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define Interfaces for type safety
export interface IFlow {
  name: string;
  api_key: string;
  stt_id?: mongoose.Types.ObjectId; // Reference to STT collection
  tts_id?: mongoose.Types.ObjectId; // Reference to TTS collection
  agent_id?: mongoose.Types.ObjectId; // Reference to Agent collection
  faces: any[]; // Array based on your screenshot
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowDocument extends IFlow, Document {}

// 2. Define the Schema
const FlowSchema = new Schema<FlowDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // This matches your screenshot exactly
    api_key: {
      type: String,
      required: true,
    },
    // FUTURE PROOFING: References to other collections
    stt_id: {
      type: Schema.Types.ObjectId,
      ref: "STT", // This string MUST match your STT model name
      required: false,
    },
    tts_id: {
      type: Schema.Types.ObjectId,
      ref: "TTS", // This string MUST match your TTS model name
      required: false,
    },
    agent_id: {
      type: Schema.Types.ObjectId,
      ref: "Agent", // This string MUST match your Agent model name
      required: false,
    },
  },
  { timestamps: true }
);

// 3. Export the Model
// We check mongoose.models first to prevent "OverwriteModelError" in Next.js hot-reloading
const Flow: Model<FlowDocument> =
  mongoose.models.Flow || mongoose.model<FlowDocument>("Flow", FlowSchema);

export default Flow;
