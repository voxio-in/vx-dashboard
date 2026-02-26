import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useUpdateConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { hiddenComponents: string[] }) => {
      const res = await apiClient.put("/config/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });
};
