"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import {
  LogOut,
  Workflow,
  BarChart3,
  Settings,
  Play,
  Copy,
  Check,
  Loader2,
  X,
  Mic,
  BrainCircuit,
  Bot,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FlowData {
  _id: string;
  name: string;
  api_key: string;
  stt_id?: string;
  tts_id?: string;
  agent_id?: string;
}

// 2. Mock Data
const MOCK_FLOWS: FlowData[] = [
  {
    _id: "flow_abc12345",
    name: "Customer Support Agent",
    api_key: "vox_live_sk_8923489238492834",
    stt_id: "stt_001",
    tts_id: "tts_001",
    agent_id: "agent_001",
  },
  {
    _id: "flow_def67890",
    name: "Inbound Sales Bot",
    api_key: "vox_test_sk_7723489238491122",
    stt_id: "stt_002",
    tts_id: "tts_002",
    agent_id: "agent_002",
  },
  {
    _id: "flow_ghi11223",
    name: "Appointment Scheduler",
    api_key: "vox_live_sk_9988776655443322",
    stt_id: "stt_003",
    tts_id: "tts_003",
    agent_id: "agent_003",
  },
];

export default function ResellerPanel() {
  const { logout, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Data State
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<FlowData | null>(null);

  // 3. Fetch Data
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
      return;
    }

    const loadMockData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFlows(MOCK_FLOWS);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user || !isAuthLoading) {
      loadMockData();
    }
  }, [user, isAuthLoading, router]);

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openConfiguration = (flow: FlowData) => {
    setSelectedFlow(flow);
  };

  const closeConfiguration = () => {
    setSelectedFlow(null);
  };

  if (isAuthLoading || loadingData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading Flows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-20">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 mb-6">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-xl tracking-tight">Analytics</h2>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2">
            Dashboard
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <Button
            variant="secondary"
            className="w-full justify-start gap-3 h-12 text-sm font-semibold 
                       bg-indigo-50 text-indigo-900 hover:bg-indigo-100 
                       dark:bg-indigo-900/20 dark:text-indigo-200
                       transition-all duration-200 hover:scale-[1.02] origin-left"
          >
            <Workflow className="h-5 w-5" />
            <span>Flows</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-sm font-semibold
                       text-slate-700 hover:text-slate-950 hover:bg-slate-100 
                       dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800
                       transition-all duration-200 hover:scale-[1.02] origin-left"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-sm font-bold
                       text-slate-700 hover:text-red-600 hover:bg-red-50 
                       dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20
                       transition-all duration-200"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />

        <header className="h-20 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center px-10 justify-between z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Flows
            </h1>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform font-semibold">
            + Create New Flow
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 z-10">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-4">Flow Name</div>
              <div className="col-span-3">API Key</div>
              <div className="col-span-5 text-right">Actions</div>
            </div>

            {flows.length > 0 ? (
              flows.map((flow) => (
                <div
                  key={flow._id}
                  className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 
                             p-5 grid grid-cols-12 items-center gap-4 shadow-sm
                             hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-200 dark:hover:border-indigo-800
                             transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-1"
                >
                  <div className="col-span-4">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {flow.name || "Unnamed Flow"}
                    </h3>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2 w-fit group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors">
                      <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 select-all">
                        {flow.api_key
                          ? `${flow.api_key.slice(0, 4)}...`
                          : "No Key"}
                      </span>
                      <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
                      <button
                        onClick={() => handleCopy(flow.api_key, flow._id)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Copy Key"
                      >
                        {copiedId === flow._id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-5 flex justify-end gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfiguration(flow)}
                      className="h-9 gap-2 font-medium border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
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
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Workflow className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  No Flows Found
                </h3>
                <p className="text-slate-500">
                  Create your first flow to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ======================= */}
      {/* CONFIGURATION MODAL     */}
      {/* ======================= */}
      {selectedFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 
                       flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  {/* ID Removed */}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedFlow.name || "Configure Flow"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold">
                  <Play className="h-4 w-4" />
                  Test Flow
                </Button>
                <button
                  onClick={closeConfiguration}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Stacked List */}
            <div className="p-8 bg-slate-50/30 dark:bg-slate-950/30 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4">
                {/* Option 1: STT */}
                <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-5 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      STT
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Configure Speech to Text provider and settings
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>

                {/* Option 2: LLM */}
                <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-5 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      LLM
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Set up Model, Prompt, and Temperature
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
                </div>

                {/* Option 3: Agents */}
                <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-5 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-12 w-12 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Agents
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Define Behavior, Tools, and Functions
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
