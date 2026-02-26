import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { Role } from "@vx/shared";

export const Route = createFileRoute("/_dashboard/reseller/")({
  component: ResellerDashboard,
});

function ResellerDashboard() {
  const { data: users } = useUsersQuery();
  const myUsers = users?.filter((u: any) => u.role === Role.USER).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Reseller Dashboard</h1>
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 max-w-xs">
        <p className="text-muted-foreground text-sm">My Users</p>
        <p className="text-3xl font-bold text-white mt-2">{myUsers}</p>
      </div>
    </div>
  );
}
