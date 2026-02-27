import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

// Matches old project's ISTT exactly
export interface STTConfig {
  _id: string;
  flowId: string;
  service: "groq" | "deepgram" | "assemblyai";
  "model-name": string;
  language?: string | null;
  prompt?: string | null;
  temperature?: number | null;
  keyterms?: string | null;
  channels: number;
  sample_rate: number;
  sample_width: number;
}

// What the form submits — mirrors old project's saveSTTConfiguration payload
export interface STTFormPayload {
  provider: "groq" | "deepgram" | "assemblyai";
  model: string;
  language?: string;
  prompt?: string;
  temperature?: number;
  keyterms?: string;
}

export const useSTTQuery = (flowId: string) => {
  return useQuery<STTConfig>({
    queryKey: ["stt", flowId],
    queryFn: async () => {
      const res = await apiClient.get(`/flows/${flowId}/stt`);
      return res.data.data.stt;
    },
    enabled: !!flowId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSTTMutation = (flowId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: STTFormPayload) => {
      const res = await apiClient.put(`/flows/${flowId}/stt`, data);
      return res.data.data.stt;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["stt", flowId], updated);
    },
  });
};
