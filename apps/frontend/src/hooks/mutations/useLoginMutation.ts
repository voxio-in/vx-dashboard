import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { LoginInput } from "@vx/shared";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
    },
  });
};
