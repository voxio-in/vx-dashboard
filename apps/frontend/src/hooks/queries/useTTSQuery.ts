import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

// Shape returned by the controller (already mapped from DB fields)
export interface TTSConfig {
  _id: string;
  flowId: string;
  provider: "elevenlabs" | "rime" | "deepgram";
  model: string;
  voiceId: string;
}

// What the form submits
export interface TTSFormPayload {
  provider: "elevenlabs" | "rime" | "deepgram";
  model: string;
  voiceId: string;
}

export const useTTSQuery = (flowId: string) => {
  return useQuery<TTSConfig>({
    queryKey: ["tts", flowId],
    queryFn: async () => {
      const res = await apiClient.get(`/flows/${flowId}/tts`);
      return res.data.data.tts;
    },
    enabled: !!flowId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateTTSMutation = (flowId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TTSFormPayload) => {
      const res = await apiClient.put(`/flows/${flowId}/tts`, data);
      return res.data.data.tts;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["tts", flowId], updated);
    },
  });
};
