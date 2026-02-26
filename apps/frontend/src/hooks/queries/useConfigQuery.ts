import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useConfigQuery = () => {
  return useQuery({
    queryKey: ["config", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/config/me");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
