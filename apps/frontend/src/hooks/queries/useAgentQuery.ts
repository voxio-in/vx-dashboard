import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useAgentQuery = (flowId: string) => {
  return useQuery({
    queryKey: ["agent", flowId],
    queryFn: async () => {
      const res = await apiClient.get(`/flows/${flowId}/agent`);
      return res.data.data.agent;
    },
    enabled: !!flowId,
  });
};

export const useSaveAgentMutation = (flowId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post(`/flows/${flowId}/agent`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent", flowId] });
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
};
