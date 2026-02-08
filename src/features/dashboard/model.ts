import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITranscriptionItem {
  role: string;
  content: string;
  timestamp?: Date;
}

export interface ISession {
  sessionId?: string;
  flow_id?: mongoose.Types.ObjectId;
  recordingUrl?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  type: "voice" | "chat" | "call" | "avatar" | "glass";
  totalConnectedTime?: number;
  totalAiTime?: number;
  totalHumanTime?: number;
  timeRatio?: number;
  transcription: ITranscriptionItem[];
  humanTokens?: number;
  aiTokens?: number;
  totkenRatio?: number;
}

export interface SessionDocument extends ISession, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<SessionDocument>(
  {
    sessionId: {
      type: String,
      index: true,
    },
    flow_id: {
      type: Schema.Types.ObjectId,
      ref: "Flow",
      required: false,
      index: true,
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      enum: ["voice", "chat", "call", "avatar", "glass"],
      required: true,
    },
    totalConnectedTime: {
      type: Number,
      default: 0,
    },
    totalAiTime: {
      type: Number,
      default: 0,
    },
    totalHumanTime: {
      type: Number,
      default: 0,
    },
    timeRatio: {
      type: Number,
      default: 0,
    },
    transcription: [
      {
        role: { type: String },
        content: { type: String },
        timestamp: { type: Date },
      },
    ],
    humanTokens: {
      type: Number,
      default: 0,
    },
    aiTokens: {
      type: Number,
      default: 0,
    },
    totkenRatio: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Session: Model<SessionDocument> =
  mongoose.models.Session ||
  mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;
