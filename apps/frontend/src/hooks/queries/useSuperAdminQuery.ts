import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useGlobalConfigQuery = () => {
  return useQuery({
    queryKey: ["superadmin", "config"],
    queryFn: async () => {
      const res = await apiClient.get("/superadmin/config");
      return res.data.data.config;
    },
  });
};

export const useUpdateRoleConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      role,
      hiddenComponents,
    }: {
      role: string;
      hiddenComponents: string[];
    }) => {
      const res = await apiClient.put(`/superadmin/config/role/${role}`, {
        hiddenComponents,
      });
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["superadmin", "config"] }),
  });
};
