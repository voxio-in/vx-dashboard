import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

export const Route = createFileRoute("/dashboard/reseller")({
  component: ResellerGuard,
});

function ResellerGuard() {
  const { user } = useAuth();

  if (!user || ROLE_LEVEL[user.role as Role] < ROLE_LEVEL[Role.RESELLER]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400">Access denied. Reseller only.</p>
      </div>
    );
  }

  return <Outlet />;
}
