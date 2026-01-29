import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITranscriptionItem {
  role: string;
  content: string;
  timestamp?: number;
}

export interface ISession {
  flow_id: mongoose.Types.ObjectId;
  recordingUrl?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  type: "voice" | "chat" | "call" | "avatar" | "glass";
  tokensUsed?: number | null;
  transcription: ITranscriptionItem[];
  summary?: string;
  timeConnected?: number;
}

export interface SessionDocument extends ISession, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<SessionDocument>(
  {
    flow_id: {
      type: Schema.Types.ObjectId,
      ref: "Flow",
      required: true,
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
    },
    type: {
      type: String,
      enum: ["voice", "chat", "call", "avatar", "glass"],
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: null,
    },
    transcription: [
      {
        role: { type: String },
        content: { type: String },
        timestamp: { type: Number },
      },
    ],
    summary: {
      type: String,
      default: "",
    },
    timeConnected: {
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
