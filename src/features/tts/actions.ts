"use server";

import connectDB from "@/lib/db";
import TTS from "@/features/tts/model";
import Flow from "@/features/flow/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TTSFormSchema = z
  .object({
    // Commented out "rime" from allowed providers
    provider: z.enum(["elevenlabs", /* "rime", */ "deepgram"]),
    model: z.string().min(1, "Model is required"),
    voiceId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.provider === "elevenlabs" ||
        // @ts-ignore - "rime" is not in the enum anymore, but keeping logic commented or clean
        // data.provider === "rime" ||
        data.provider === "eleven_v3") &&
      (!data.voiceId || data.voiceId.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Voice selection is required for this provider",
        path: ["voiceId"],
      });
    }
  });

export async function saveTTSConfiguration(flowId: string, rawData: any) {
  try {
    // 1. Debug Log: See exactly what the frontend sent
    console.log("[TTS Action] Received Data:", rawData);

    const validation = TTSFormSchema.safeParse(rawData);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid data";
      console.error("[TTS Action] Validation Failed:", errorMessage);
      return { success: false, message: errorMessage };
    }

    const data = validation.data;
    await connectDB();

    // 2. Prepare Payload: Map frontend 'voiceId' -> DB 'voice_id'
    const ttsPayload = {
      service: data.provider,
      "model-name": data.model,
      voice_id: data.voiceId || "", // 🚨 Saving to voice_id
    };

    const flow = await Flow.findById(flowId);
    if (!flow) return { success: false, message: "Flow not found" };

    if (flow.tts_id) {
      // Update existing
      const updated = await TTS.findByIdAndUpdate(flow.tts_id, ttsPayload, {
        new: true,
      });
      if (!updated) {
        // Ghost ID recovery
        const newTTS = await TTS.create(ttsPayload);
        flow.tts_id = newTTS._id;
        await flow.save();
      }
    } else {
      // Create new
      const newTTS = await TTS.create(ttsPayload);
      flow.tts_id = newTTS._id;
      await flow.save();
    }

    revalidatePath(`/reseller/flow/${flowId}/tts`);
    revalidatePath(`/reseller/flow/${flowId}`);

    return { success: true, message: "TTS configuration saved" };
  } catch (error: any) {
    console.error("Save TTS Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
