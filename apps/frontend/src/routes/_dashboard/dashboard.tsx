import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-muted-foreground">
        Logged in as <span className="text-white">{user?.name}</span> · Role:{" "}
        <span className="text-white uppercase">{user?.role}</span>
      </p>
    </div>
  );
}
