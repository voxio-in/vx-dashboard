import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useFlowsQuery,
  useCreateFlowMutation,
  useDeleteFlowMutation,
} from "@/hooks/queries/useFlowsQuery";
import { Modal } from "@/components/shared/Modal";

export const Route = createFileRoute("/_dashboard/user/flows")({
  component: UserFlowsPage,
});

function UserFlowsPage() {
  const { data: flows, isLoading } = useFlowsQuery();
  const { mutate: createFlow, isPending } = useCreateFlowMutation();
  const { mutate: deleteFlow } = useDeleteFlowMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createFlow(form, {
      onSuccess: () => {
        setIsOpen(false);
        setForm({ name: "", description: "" });
      },
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Flows</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90"
        >
          + Create Flow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!flows?.length ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No flows yet. Create your first one!
          </div>
        ) : (
          flows.map((flow: any) => (
            <div
              key={flow._id}
              className="p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <div className="flex items-start justify-between mb-2">
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
                <p className="text-muted-foreground text-sm mb-4">
                  {flow.description}
                </p>
              )}
              <button
                onClick={() => deleteFlow(flow._id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Flow"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 rounded-lg border border-white/10 text-muted-foreground text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
