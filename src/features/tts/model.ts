import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITTS {
  service: "elevenlabs" | "rime" | "deepgram";
  "model-name": string;
  voice_id?: string; // 🚨 Must match the database field we want
}

export interface TTSDocument extends ITTS, Document {
  createdAt: Date;
  updatedAt: Date;
}

const TTSSchema = new Schema<TTSDocument>(
  {
    service: {
      type: String,
      required: true,
      enum: ["elevenlabs", "rime", "deepgram"],
    },
    "model-name": {
      type: String,
      required: true,
    },
    // 🚨 Explicitly naming this field voice_id
    voice_id: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "tts",
    strict: false, // Allows flexible fields, but our schema defines voice_id
  }
);

// Prevent overwrite error
const TTS: Model<TTSDocument> =
  mongoose.models.TTS || mongoose.model<TTSDocument>("TTS", TTSSchema);

export default TTS;
