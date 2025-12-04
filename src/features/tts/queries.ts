import TTS, { TTSDocument } from "@/features/tts/model";
import connectDB from "@/lib/db";

export async function getTTSByFlowId(ttsId?: string) {
  if (!ttsId) return null;

  await connectDB();

  const tts = (await TTS.findById(ttsId).lean()) as unknown as TTSDocument;

  if (!tts) return null;

  return {
    provider: tts.service,
    model: tts["model-name"],
    // 🚨 Read from DB 'voice_id', fallback to old 'voice' field if migrating, or empty
    // @ts-ignore (handling legacy data)
    voiceId: tts.voice_id || tts.voice || "",
  };
}
