import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlow {
  name: string;
  api_key: string;
  stt_id?: mongoose.Types.ObjectId;
  tts_id?: mongoose.Types.ObjectId;
  agent_id?: mongoose.Types.ObjectId;
  faces: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowDocument extends IFlow, Document {}

const FlowSchema = new Schema<FlowDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    api_key: {
      type: String,
      required: true,
    },
    stt_id: {
      type: Schema.Types.ObjectId,
      ref: "STT",
      required: false,
    },
    tts_id: {
      type: Schema.Types.ObjectId,
      ref: "TTS",
      required: false,
    },
    agent_id: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: false,
    },
  },
  { timestamps: true }
);

const Flow: Model<FlowDocument> =
  mongoose.models.Flow || mongoose.model<FlowDocument>("Flow", FlowSchema);

export default Flow;
