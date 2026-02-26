import { ReactNode } from "react";
import { useUIConfig } from "@/contexts/UIConfigContext";
import { UIComponentId } from "@vx/shared";

interface Props {
  componentId: UIComponentId;
  children: ReactNode;
}

export const Configurable = ({ componentId, children }: Props) => {
  const { isHidden } = useUIConfig();

  if (isHidden(componentId)) return null;

  return <>{children}</>;
};
