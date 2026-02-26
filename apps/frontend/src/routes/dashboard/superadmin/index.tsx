import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/superadmin/")({
  component: SuperAdminDashboard,
});

function SuperAdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        SuperAdmin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Admins", value: "—" },
          { label: "Total Resellers", value: "—" },
          { label: "Total Users", value: "—" },
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
