import { Response } from "express";
import { STT } from "../models/STT.model";
import { Flow } from "../models/Flow.model";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middleware/auth.middleware";

async function assertOwnership(
  req: AuthRequest,
  res: Response,
  flowId: string,
): Promise<boolean> {
  const flow = await Flow.findOne({ _id: flowId, ownerId: req.user._id });
  if (!flow) {
    res
      .status(404)
      .json({ success: false, message: "Flow not found or access denied" });
    return false;
  }
  return true;
}

/** GET /api/v1/flows/:flowId/stt */
export const getSTT = catchAsync(async (req: AuthRequest, res: Response) => {
  const flowId = req.params.flowId as string;

  if (!(await assertOwnership(req, res, flowId))) return;

  let stt = await STT.findOne({ flowId });

  // Lazily create default config on first access
  if (!stt) {
    stt = await STT.create({
      flowId,
      service: "assemblyai",
      "model-name": "universal",
      language: "en",
      prompt: "",
      temperature: 0,
      keyterms: "",
      channels: 1,
      sample_rate: 16000,
      sample_width: 2,
    });
  }

  res.status(200).json({ success: true, data: { stt } });
});

/** PUT /api/v1/flows/:flowId/stt */
export const updateSTT = catchAsync(async (req: AuthRequest, res: Response) => {
  const flowId = req.params.flowId as string;

  if (!(await assertOwnership(req, res, flowId))) return;

  const { provider, model, language, prompt, temperature, keyterms } = req.body;

  // Mirror old project: provider-specific field handling
  const sttPayload: Record<string, any> = {
    service: provider,
    "model-name": model,
    channels: 1,
    sample_rate: 16000,
    sample_width: 2,
  };

  if (provider === "groq") {
    sttPayload.language = language;
    sttPayload.prompt = prompt || "";
    sttPayload.temperature = temperature ?? 0;
    sttPayload.keyterms = "";
  } else if (provider === "deepgram") {
    sttPayload.language = language; // "multi" for deepgram
    sttPayload.keyterms = keyterms || "";
    sttPayload.prompt = "";
    sttPayload.temperature = 0;
  } else if (provider === "assemblyai") {
    sttPayload.language = ""; // assemblyai ignores language
    sttPayload.prompt = "";
    sttPayload.temperature = 0;
    sttPayload.keyterms = "";
  }

  const stt = await STT.findOneAndUpdate({ flowId }, sttPayload, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: { stt } });
});
