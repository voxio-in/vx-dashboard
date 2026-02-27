import { Response } from "express";
import { TTS } from "../models/TTS.model";
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

/** GET /api/v1/flows/:flowId/tts */
export const getTTS = catchAsync(async (req: AuthRequest, res: Response) => {
  const flowId = req.params.flowId as string;

  if (!(await assertOwnership(req, res, flowId))) return;

  let tts = await TTS.findOne({ flowId });

  // Lazily create default config on first access
  if (!tts) {
    tts = await TTS.create({
      flowId,
      service: "elevenlabs",
      "model-name": "eleven_v3",
      voice_id: "",
    });
  }

  // Return in the shape the frontend expects:
  // frontend uses: provider, model, voiceId
  // DB stores:     service,  model-name, voice_id
  res.status(200).json({
    success: true,
    data: {
      tts: {
        _id: tts._id,
        flowId: tts.flowId,
        provider: tts.service,
        model: tts["model-name"],
        voiceId: tts.voice_id || "",
      },
    },
  });
});

/** PUT /api/v1/flows/:flowId/tts */
export const updateTTS = catchAsync(async (req: AuthRequest, res: Response) => {
  const flowId = req.params.flowId as string;

  if (!(await assertOwnership(req, res, flowId))) return;

  const { provider, model, voiceId } = req.body;

  // Map frontend fields → DB fields (mirrors old saveTTSConfiguration)
  const ttsPayload = {
    service: provider,
    "model-name": model,
    voice_id: voiceId || "",
  };

  const tts = await TTS.findOneAndUpdate({ flowId }, ttsPayload, {
    new: true,
    upsert: true,
    strict: false,
  });

  res.status(200).json({
    success: true,
    data: {
      tts: {
        _id: tts._id,
        flowId: tts.flowId,
        provider: tts.service,
        model: tts["model-name"],
        voiceId: tts.voice_id || "",
      },
    },
  });
});
