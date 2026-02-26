import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

export const Route = createFileRoute("/_dashboard/superadmin")({
  component: SuperAdminGuard,
});

function SuperAdminGuard() {
  const { user } = useAuth();

  if (!user || ROLE_LEVEL[user.role as Role] < ROLE_LEVEL[Role.SUPERADMIN]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400">Access denied. SuperAdmin only.</p>
      </div>
    );
  }

  return <Outlet />;
}
