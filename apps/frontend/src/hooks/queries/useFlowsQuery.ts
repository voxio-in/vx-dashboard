import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useFlowsQuery = () => {
  return useQuery({
    queryKey: ["flows"],
    queryFn: async () => {
      const res = await apiClient.get("/flows");
      return res.data.data.flows;
    },
  });
};

export const useCreateFlowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiClient.post("/flows", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flows"] }),
  });
};

export const useDeleteFlowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/flows/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flows"] }),
  });
};
