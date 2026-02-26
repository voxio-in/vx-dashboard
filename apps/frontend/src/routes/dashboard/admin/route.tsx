import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminGuard,
});

function AdminGuard() {
  const { user } = useAuth();

  if (!user || ROLE_LEVEL[user.role as Role] < ROLE_LEVEL[Role.ADMIN]) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400">Access denied. Admin only.</p>
      </div>
    );
  }

  return <Outlet />;
}
