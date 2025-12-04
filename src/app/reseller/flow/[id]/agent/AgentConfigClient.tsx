"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Bot,
  Save,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Box,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IFlow } from "@/types";
import { saveAgentConfiguration } from "@/features/agent/actions";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const LabelWithInfo = ({ label, info }: { label: string; info: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help transition-opacity hover:opacity-70">
            <Info className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-slate-800 text-white border-slate-700 shadow-xl z-50">
          <p className="text-xs leading-relaxed">{info}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

function StatusModal({
  isOpen,
  onClose,
  status,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error" | null;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
              status === "success"
                ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
          <Button
            onClick={onClose}
            className={`w-full mt-4 h-11 text-base font-semibold ${
              status === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {status === "success" ? "Continue" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const AGENT_CONFIG = {
  providers: [{ value: "groq", label: "Groq" }] as const,
  models: {
    groq: [
      { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
      { value: "llama-3.1-70b-versatile", label: "Llama 3.1 70B Versatile" },
      { value: "openai/gpt-oss-120b", label: "GPT OSS 120B" },
      { value: "openai/gpt-oss-20b", label: "GPT OSS 20B" },
    ],
  },
};

export default function AgentConfigClient({
  flow,
  initialConfig,
}: {
  flow: IFlow;
  initialConfig?: any;
}) {
  const router = useRouter();

  const { proceedWithAction } = useUnsavedChangesContext();

  const [systemPrompt, setSystemPrompt] = useState(
    initialConfig?.systemPrompt || ""
  );
  const [provider, setProvider] = useState<string>(
    initialConfig?.provider || "groq"
  );
  const [model, setModel] = useState<string>(
    initialConfig?.model || "llama-3.1-8b-instant"
  );

  const [isSaving, setIsSaving] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  const isDirty =
    systemPrompt !== (initialConfig?.systemPrompt || "") ||
    provider !== (initialConfig?.provider || "groq") ||
    model !== (initialConfig?.model || "llama-3.1-8b-instant");

  useUnsavedChanges(isDirty);

  const handleNavigation = (path: string) => {
    proceedWithAction(() => {
      router.push(path);
    });
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    if (value === "groq") {
      setModel(AGENT_CONFIG.models.groq[0].value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = { systemPrompt, provider, model };

    try {
      const result = await saveAgentConfiguration(flow._id, formData);
      if (result.success) {
        setModalState({
          isOpen: true,
          status: "success",
          title: "Agent Updated",
          message: "Agent LLM settings have been saved successfully.",
        });
        router.refresh();
      } else {
        setModalState({
          isOpen: true,
          status: "error",
          title: "Save Failed",
          message: result.message || "Error saving.",
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        status: "error",
        title: "Connection Error",
        message: "Could not reach server.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentModels =
    AGENT_CONFIG.models[provider as keyof typeof AGENT_CONFIG.models] || [];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        status={modalState.status}
        title={modalState.title}
        message={modalState.message}
      />

      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center px-8 justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation(`/reseller/flow/${flow._id}`)}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 text-lg">
            <button
              onClick={() => handleNavigation("/reseller/panel")}
              className="font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              My Flows
            </button>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <button
              onClick={() => handleNavigation(`/reseller/flow/${flow._id}`)}
              className="font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {flow.name}
            </button>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bot className="h-4 w-4 text-indigo-500" />
              Agent
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-10 pb-32">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              Agent Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configure the AI Persona, Provider, and Model.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <LabelWithInfo
                  label="System Prompt"
                  info="System prompt for the llm, use this to make llm behave how you want it to"
                />
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 h-5 w-5 text-slate-400 pointer-events-none" />
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={6}
                    placeholder="You are a helpful assistant..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <LabelWithInfo label="Provider" info="Model provider" />
                  <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                    <Select
                      value={provider}
                      onValueChange={handleProviderChange}
                    >
                      <SelectTrigger className="w-full h-12 pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AGENT_CONFIG.providers.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <LabelWithInfo label="Model" info="Specific AI model" />
                  <div className="relative">
                    <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="w-full h-12 pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentModels.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className={`w-full h-12 font-semibold text-base transition-all ${
                  !isDirty
                    ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving
                  ? "Saving..."
                  : isDirty
                  ? "Save Configuration"
                  : "No Changes to Save"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
