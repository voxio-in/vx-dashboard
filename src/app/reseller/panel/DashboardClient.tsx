"use client";

import { Settings, Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IFlow } from "@/types";

export default function DashboardClient({
  initialFlows,
}: {
  initialFlows: IFlow[];
}) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfigure = (flowId: string) => {
    router.push(`/reseller/flow/${flowId}`);
  };

  return (
    <>
      <header className="h-20 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center px-10 justify-between sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Flows
        </h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform">
          + Create New Flow
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto space-y-4 pb-20">
          <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Flow Name</div>
            <div className="col-span-3">API Key</div>
            <div className="col-span-5 text-right">Actions</div>
          </div>

          {initialFlows.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-slate-500">
                No flows found. Create one to get started.
              </p>
            </div>
          )}

          {initialFlows.map((flow) => (
            <div
              key={flow._id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 grid grid-cols-12 items-center gap-4 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="col-span-4 font-bold text-slate-900 dark:text-slate-100 text-base">
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
                  size="sm"
                  onClick={() => handleConfigure(flow._id)}
                  className="h-9 gap-2 font-medium border-slate-200 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configure Flow
                </Button>
                <Button
                  size="sm"
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
    </>
  );
}
