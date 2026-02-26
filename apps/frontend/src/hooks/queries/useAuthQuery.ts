import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/auth/me");
      return res.data.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
