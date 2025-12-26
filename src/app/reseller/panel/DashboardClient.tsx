"use client";

import {
  Settings,
  Play,
  Copy,
  Check,
  Loader2,
  Search,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IFlow } from "@/types";
import { createFlow, deleteFlow } from "@/features/flow/actions";
import TestFlowDialog from "@/components/TestFlowDialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardClient({
  initialFlows,
}: {
  initialFlows: IFlow[];
}) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  // NEW: Checkbox state
  const [isRolePlaying, setIsRolePlaying] = useState(false);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [deleteFlowData, setDeleteFlowData] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- STATE FOR TESTING FLOW ---
  const [testFlowData, setTestFlowData] = useState<{
    id: string;
    apiKey: string;
    name: string;
  } | null>(null);

  const filteredFlows = useMemo(() => {
    if (!searchQuery) return initialFlows;
    return initialFlows.filter((flow) =>
      flow.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialFlows, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfigure = (flowId: string) => {
    router.push(`/reseller/flow/${flowId}`);
  };

  const handleTestFlow = (flow: IFlow) => {
    setTestFlowData({
      id: flow._id,
      apiKey: flow.api_key,
      name: flow.name,
    });
  };

  const handleCreateFlow = (redirect: boolean) => {
    if (!newFlowName.trim()) {
      setError("Flow name is required");
      return;
    }
    setError("");

    startTransition(async () => {
      // Pass isRolePlaying flag
      const result = await createFlow(newFlowName, isRolePlaying);

      if (result.success && result.flowId) {
        setIsCreateDialogOpen(false);
        setNewFlowName("");
        setIsRolePlaying(false);

        if (redirect) {
          router.push(`/reseller/flow/${result.flowId}`);
        }
      } else {
        setError(result.message || "Failed to create flow");
      }
    });
  };

  const handleDeleteFlow = async () => {
    if (!deleteFlowData) return;
    setIsDeleting(true);
    try {
      await deleteFlow(deleteFlowData.id);
      setDeleteFlowData(null);
      router.refresh();
    } catch (e) {
      console.error("Failed to delete", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <TestFlowDialog
        isOpen={!!testFlowData}
        onClose={() => setTestFlowData(null)}
        flowId={testFlowData?.id || ""}
        apiKey={testFlowData?.apiKey || ""}
        flowName={testFlowData?.name || ""}
      />

      <header className="h-20 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            My Flows
          </h1>

          <div className="relative w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search flows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setNewFlowName("");
              setIsRolePlaying(false);
              setError("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100 dark:shadow-none hover:scale-105 transition-transform">
              + Create New Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Flow</DialogTitle>
              <DialogDescription>Give your new flow a name.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="name"
                    value={newFlowName}
                    onChange={(e) => {
                      setNewFlowName(e.target.value);
                      setError("");
                    }}
                    autoFocus
                    className={
                      error ? "border-red-500 focus-visible:ring-red-500" : ""
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFlow(false);
                    }}
                  />
                  {error && (
                    <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              {/* ROLE PLAY CHECKBOX */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="roleplay"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                    checked={isRolePlaying}
                    onChange={(e) => setIsRolePlaying(e.target.checked)}
                  />
                  <Label
                    htmlFor="roleplay"
                    className="text-sm font-normal text-slate-500 cursor-pointer select-none hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
                  >
                    Enable Role Playing Agent (Optional)
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleCreateFlow(false)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                onClick={() => handleCreateFlow(true)}
                disabled={isPending}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Save & Configure
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-4 pb-20">
          <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Flow Name</div>
            <div className="col-span-3">API Key</div>
            <div className="col-span-5 text-right">Actions</div>
          </div>

          {initialFlows.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50">
              <p className="text-slate-500">
                No flows found. Create one to get started.
              </p>
            </div>
          )}

          {initialFlows.length > 0 && filteredFlows.length === 0 && (
            <div className="text-center py-20 rounded-xl">
              <p className="text-slate-500">
                No flows found matching{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="text-indigo-600 mt-2"
              >
                Clear Search
              </Button>
            </div>
          )}

          {filteredFlows.map((flow) => (
            <div
              key={flow._id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 grid grid-cols-12 items-center gap-4 shadow-sm hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="col-span-4 font-bold text-slate-900 dark:text-slate-100 text-base truncate pr-4">
                {flow.name}
              </div>

              <div className="col-span-3">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2 w-fit">
                  <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {flow.api_key?.slice(0, 4)}...
                  </span>
                  <button
                    onClick={() => handleCopy(flow.api_key, flow._id)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {copiedId === flow._id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-5 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:border-red-900"
                  onClick={() =>
                    setDeleteFlowData({ id: flow._id, name: flow.name })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfigure(flow._id)}
                  className="h-9 gap-2 font-medium border-slate-200 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configure Flow
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleTestFlow(flow)}
                  className="h-9 gap-2 bg-slate-900 text-white hover:bg-indigo-600 shadow-sm transition-colors font-medium"
                >
                  <Play className="h-3.5 w-3.5" />
                  Test Flow
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog
        open={!!deleteFlowData}
        onOpenChange={(open) => !open && setDeleteFlowData(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">Delete Flow?</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                "{deleteFlowData?.name}"
              </span>
              ?
              <br />
              <span className="block mt-2 text-red-600/80 dark:text-red-400">
                This action cannot be undone. All configurations will be
                permanently removed.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteFlowData(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFlow}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Flow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
