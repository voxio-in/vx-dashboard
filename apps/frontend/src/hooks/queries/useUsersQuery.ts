import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data.data.users;
    },
  });
};
