"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  Mic,
  Bot,
  AudioLines,
  Plus,
  Minus,
  Hash,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IFlow } from "@/types";
import TestFlowDialog from "@/components/TestFlowDialog";
import { updateFlowSilence } from "@/features/flow/actions";

export default function FlowConfigClient({ flow }: { flow: IFlow }) {
  const router = useRouter();
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [tickerValue, setTickerValue] = useState(
    (flow["max-silence-counter"] || 20) * 32,
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    const timeoutId = setTimeout(async () => {
      const backendValue = Math.floor(tickerValue / 32);
      await updateFlowSilence(flow._id, backendValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [tickerValue, flow._id]);

  if (!flow) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Test Flow Dialog Integration */}
      <TestFlowDialog
        isOpen={isTestDialogOpen}
        onClose={() => setIsTestDialogOpen(false)}
        flowId={flow._id}
        apiKey={flow.api_key}
        flowName={flow.name}
      />

      {/* HEADER */}
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
        <Button
          onClick={() => setIsTestDialogOpen(true)}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
        >
          <Play className="h-4 w-4" />
          Test Flow
        </Button>
      </header>

      {/* CONTENT */}
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

          {/* 1. STT CARD */}
          <div
            onClick={() => router.push(`/reseller/flow/${flow._id}/stt`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
              <Mic className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  STT (Speech To Text)
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Customize How AI Understands You
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600" />
          </div>

          {/* 2. AGENTS CARD */}
          <div
            onClick={() => router.push(`/reseller/flow/${flow._id}/agent`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
              <Bot className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Agent
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Customize What AI Responds (System Prompt, LLM Models)
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600" />
          </div>

          {/* 3. TTS CARD */}
          <div
            onClick={() => router.push(`/reseller/flow/${flow._id}/tts`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
          >
            <div className="h-14 w-14 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
              <AudioLines className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  TTS (Text To Speech)
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Customize How You Want To Listen To AI
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-600" />
          </div>
          <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-6 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-xl transition-all">
            <div className="h-14 w-14 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0 group-hover:scale-110 transition-transform">
              <Hash className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Release Time
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Defines the duration (in milliseconds) the system waits after
                detecting that the user has stopped speaking to ensure the user
                has completed their statement. This prevents the system from
                prematurely processing incomplete input, which could result in
                multiple bot responses to a single user utterance.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTickerValue((prev) => Math.max(0, prev - 32))}
                className="h-10 w-10 rounded-md border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-red-500 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="w-20 text-center font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                {tickerValue}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTickerValue((prev) => Math.min(32000, prev + 32))
                }
                className="h-10 w-10 rounded-md border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-green-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
