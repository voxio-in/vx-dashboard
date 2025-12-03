"use client";

import {
  ArrowLeft,
  Play,
  ChevronRight,
  Mic,
  BrainCircuit,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IFlow } from "@/types";

export default function FlowConfigClient({ flow }: { flow: IFlow }) {
  const router = useRouter();

  if (!flow) return null;

  return (
    <>
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center px-8 justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/reseller/panel">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-lg">
            <Link
              href="/reseller/panel"
              className="font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              My Flows
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {flow.name}
            </span>
          </div>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm">
          <Play className="h-4 w-4" />
          Test Flow
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              Configuration
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage the components of{" "}
              <span className="font-semibold text-indigo-600">{flow.name}</span>
              .
            </p>
          </div>

          <div
            onClick={() => router.push(`/reseller/flow/${flow._id}/stt`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
              <Mic className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                STT
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {flow.stt_id ? "Configured" : "Not configured"} • Speech to Text
                provider settings
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600" />
          </div>

          <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer">
            <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                LLM
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Not configured • Model selection & prompts
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600" />
          </div>

          <div
            onClick={() => router.push(`/reseller/flow/${flow._id}/agent`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="h-14 w-14 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
              <Bot className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Agents
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Not configured • Agent behaviors & tools
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-600" />
          </div>
        </div>
      </main>
    </>
  );
}
