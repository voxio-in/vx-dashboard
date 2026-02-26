import { createFileRoute } from "@tanstack/react-router";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { Role } from "@vx/shared";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: users } = useUsersQuery();

  const resellers =
    users?.filter((u: any) => u.role === Role.RESELLER).length || 0;
  const totalUsers =
    users?.filter((u: any) => u.role === Role.USER).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "My Resellers", value: resellers },
          { label: "Total Users", value: totalUsers },
        ].map((card) => (
          <div
            key={card.label}
            className="p-6 rounded-xl border border-white/10 bg-white/5"
          >
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
