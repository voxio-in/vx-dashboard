import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITTS {
  flowId: mongoose.Types.ObjectId;
  service: "elevenlabs" | "rime" | "deepgram";
  "model-name": string;
  voice_id: string; // underscore — matches old project DB field
  createdAt: Date;
  updatedAt: Date;
}

export interface TTSDocument extends ITTS, Document {}

const TTSSchema = new Schema<TTSDocument>(
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
      enum: ["elevenlabs", "rime", "deepgram"],
      default: "elevenlabs",
    },
    "model-name": {
      type: String,
      required: true,
      default: "eleven_v3",
    },
    voice_id: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "tts",
    strict: false, // matches old project
  },
);

export const TTS: Model<TTSDocument> =
  mongoose.models.TTS || mongoose.model<TTSDocument>("TTS", TTSSchema);
