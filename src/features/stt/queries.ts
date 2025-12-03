import STT, { STTDocument } from "@/features/stt/model";
import connectDB from "@/lib/db";

export async function getSTTByFlowId(sttId?: string) {
  if (!sttId) return null;

  await connectDB();

  const stt = (await STT.findById(sttId).lean()) as unknown as STTDocument;

  if (!stt) return null;

  return {
    ...stt,
    _id: stt._id.toString(),
    temperature: stt.temperature ? Number(stt.temperature.toString()) : 0,

    createdAt: stt.createdAt?.toISOString(),
    updatedAt: stt.updatedAt?.toISOString(),
  };
}
