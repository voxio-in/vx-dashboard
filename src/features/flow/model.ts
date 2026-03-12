import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlow {
  name: string;
  api_key: string;
  stt_id?: mongoose.Types.ObjectId;
  tts_id?: mongoose.Types.ObjectId;
  agent_id?: mongoose.Types.ObjectId;
  faces: any[];
  "max-silence-counter": number;
  sessions?: mongoose.Types.ObjectId[];

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
    "max-silence-counter": {
      type: Number,
      default: 20,
      required: true,
    },
    sessions: {
      type: [Schema.Types.ObjectId],
      ref: "Session",
      default: [],
    },
  },
  { timestamps: true },
);

const Flow: Model<FlowDocument> =
  mongoose.models.Flow || mongoose.model<FlowDocument>("Flow", FlowSchema);

export default Flow;
