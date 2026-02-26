import { createFileRoute } from "@tanstack/react-router";
import { useFlowsQuery } from "@/hooks/queries/useFlowsQuery";

export const Route = createFileRoute("/_dashboard/user/flows")({
  component: UserFlowsPage,
});

function UserFlowsPage() {
  const { data: flows, isLoading } = useFlowsQuery();

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Flows</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!flows?.length ? (
          <p className="text-muted-foreground">No flows yet</p>
        ) : (
          flows.map((flow: any) => (
            <div
              key={flow._id}
              className="p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{flow.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    flow.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : flow.status === "draft"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {flow.status}
                </span>
              </div>
              {flow.description && (
                <p className="text-muted-foreground text-sm">
                  {flow.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
