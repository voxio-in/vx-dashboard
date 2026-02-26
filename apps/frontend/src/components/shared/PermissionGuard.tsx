import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

interface Props {
  requiredRole: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  requiredRole,
  children,
  fallback = null,
}: Props) => {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  const hasPermission =
    ROLE_LEVEL[user.role as Role] >= ROLE_LEVEL[requiredRole];

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
