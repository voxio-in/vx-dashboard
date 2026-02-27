import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

/** GET /flows/:id — single flow */
export const useFlowQuery = (id: string) => {
  return useQuery({
    queryKey: ["flow", id],
    queryFn: async () => {
      const res = await apiClient.get(`/flows/${id}`);
      return res.data.data.flow;
    },
    enabled: !!id,
  });
};

/** PATCH /flows/:id/silence */
export const useUpdateSilenceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      maxSilenceCounter,
    }: {
      id: string;
      maxSilenceCounter: number;
    }) => {
      const res = await apiClient.patch(`/flows/${id}/silence`, {
        maxSilenceCounter,
      });
      return res.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
      queryClient.invalidateQueries({ queryKey: ["flow", id] });
    },
  });
};

/** PUT /flows/:id  — rename only */
export const useRenameFlowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await apiClient.put(`/flows/${id}`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flows"] });
    },
  });
};
