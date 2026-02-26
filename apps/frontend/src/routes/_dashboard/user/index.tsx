import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_dashboard/user/")({
  component: UserDashboard,
});

function UserDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user?.name}</p>
    </div>
  );
}
