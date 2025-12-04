"use server";

import connectDB from "@/lib/db";
import STT from "@/features/stt/model";
import Flow from "@/features/flow/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const STTFormSchema = z.object({
  provider: z.enum(["groq", "deepgram"]),
  model: z.string().min(1, "Model is required"),
  language: z.string().min(1, "Language is required"),
  prompt: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  keywords: z.string().optional(),
});

export async function saveSTTConfiguration(flowId: string, rawData: any) {
  try {
    const validation = STTFormSchema.safeParse(rawData);
    if (!validation.success) {
      return { success: false, message: "Invalid data format" };
    }
    const data = validation.data;

    await connectDB();

    const sttPayload = {
      service: data.provider,
      "model-name": data.model,
      language: data.language,
      prompt: data.prompt || "",
      temperature: data.temperature || 0,
      keywords: data.keywords || "",
      channels: 1,
      sample_rate: 16000,
      sample_width: 2,
    };

    console.log(`[Action] Processing Flow ID: ${flowId}`);

    const flow = await Flow.findById(flowId);
    if (!flow) return { success: false, message: "Flow not found" };

    let successMessage = "Configuration saved";

    if (flow.stt_id) {
      console.log(`[Action] Attempting update on STT ID: ${flow.stt_id}`);

      const updatedDoc = await STT.findByIdAndUpdate(flow.stt_id, sttPayload, {
        new: true,
      });

      if (updatedDoc) {
        console.log(`[Action] Update SUCCESS.`);
      } else {
        console.warn(
          `[Action] STT ID ${flow.stt_id} not found in DB. creating new one.`
        );

        const newSTT = await STT.create(sttPayload);
        flow.stt_id = newSTT._id;
        await flow.save();
        successMessage = "Configuration fixed and saved";
      }
    } else {
      console.log(`[Action] Creating NEW STT document.`);
      const newSTT = await STT.create(sttPayload);
      flow.stt_id = newSTT._id;
      await flow.save();
    }

    revalidatePath(`/reseller/flow/${flowId}/stt`);
    revalidatePath(`/reseller/flow/${flowId}`);

    return { success: true, message: successMessage };
  } catch (error: any) {
    console.error("Save STT Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
