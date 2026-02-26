import { createContext, useContext, ReactNode } from "react";
import { UIComponentId } from "@vx/shared";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

interface UIConfigContextType {
  hiddenComponents: UIComponentId[];
  sidebarItems: any[];
  isLoading: boolean;
  isHidden: (componentId: UIComponentId) => boolean;
}

const UIConfigContext = createContext<UIConfigContextType | null>(null);

export const UIConfigProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ui-config"],
    queryFn: async () => {
      const res = await apiClient.get("/config/me");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const hiddenComponents: UIComponentId[] = data?.hiddenComponents || [];
  const sidebarItems = data?.sidebarItems || [];

  const isHidden = (componentId: UIComponentId) => {
    return hiddenComponents.includes(componentId);
  };

  return (
    <UIConfigContext.Provider
      value={{
        hiddenComponents,
        sidebarItems,
        isLoading,
        isHidden,
      }}
    >
      {children}
    </UIConfigContext.Provider>
  );
};

export const useUIConfig = () => {
  const ctx = useContext(UIConfigContext);
  if (!ctx) throw new Error("useUIConfig must be used within UIConfigProvider");
  return ctx;
};
