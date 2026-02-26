import { useQuery } from "@tanstack/react-query";
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
