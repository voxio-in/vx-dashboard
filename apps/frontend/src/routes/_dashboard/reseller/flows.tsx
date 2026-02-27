import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  useFlowsQuery,
  useCreateFlowMutation,
  useDeleteFlowMutation,
} from "@/hooks/queries/useFlowsQuery";
import { Configurable } from "@/components/shared/Configurable";
import { UI_REGISTRY } from "@vx/shared";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Bot, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_dashboard/reseller/flows")({
  component: ResellerFlowsPage,
});

function ResellerFlowsPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Flows</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and configure your AI flows
          </p>
        </div>
        <Configurable componentId={UI_REGISTRY.FLOW_CREATE_BUTTON}>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Flow
          </Button>
        </Configurable>
      </div>

      <Configurable componentId={UI_REGISTRY.FLOW_LIST}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : !flows?.length ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              No flows yet. Create your first one!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flows.map((flow: any) => (
              <Card
                key={flow._id}
                className="hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{flow.name}</CardTitle>
                    <Configurable componentId={UI_REGISTRY.FLOW_STATUS_BADGE}>
                      <Badge
                        variant={
                          flow.status === "active"
                            ? "default"
                            : flow.status === "draft"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {flow.status}
                      </Badge>
                    </Configurable>
                  </div>
                  {flow.description && (
                    <p className="text-sm text-muted-foreground">
                      {flow.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {/* Agent Config Link */}
                    <Link
                      to={`/reseller/flows/${flow._id}/agent` as any}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Bot className="h-4 w-4" />
                      Configure Agent
                    </Link>
                    <Configurable componentId={UI_REGISTRY.FLOW_DELETE_BUTTON}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteFlow(flow._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Configurable>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Configurable>

      {/* Create Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Flow"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="My Flow"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Optional description"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
