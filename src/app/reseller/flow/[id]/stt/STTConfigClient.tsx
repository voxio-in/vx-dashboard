"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Mic,
  Save,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
  Play,
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
import { saveSTTConfiguration } from "@/features/stt/actions";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import TestFlowDialog from "@/components/TestFlowDialog";

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

const STT_CONFIG = {
  providers: [
    { value: "groq", label: "Groq" },
    { value: "deepgram", label: "Deepgram" },
    { value: "assemblyai", label: "AssemblyAI" },
  ] as const,
  models: {
    groq: [
      { value: "whisper-large-v3", label: "Whisper Large V3" },
      { value: "whisper-large-v3-turbo", label: "Whisper Large V3 Turbo" },
    ],
    assemblyai: [{ value: "universal", label: "Universal" }],

    deepgram: [
      { value: "nova-3", label: "Nova 3" },
      // { value: "nova-2", label: "Nova 2" },
    ],
  },
  languages: {
    groq: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "it", label: "Italian" },
      { value: "pt", label: "Portuguese" },
      { value: "ru", label: "Russian" },
      { value: "zh", label: "Chinese" },
      { value: "ja", label: "Japanese" },
      { value: "ko", label: "Korean" },
      { value: "ar", label: "Arabic" },
      { value: "hi", label: "Hindi" },
      { value: "nl", label: "Dutch" },
      { value: "sv", label: "Swedish" },
      { value: "tr", label: "Turkish" },
      { value: "pl", label: "Polish" },
      { value: "uk", label: "Ukrainian" },
      { value: "el", label: "Greek" },
      { value: "he", label: "Hebrew" },
      { value: "vi", label: "Vietnamese" },
      { value: "th", label: "Thai" },
      { value: "cs", label: "Czech" },
      { value: "ro", label: "Romanian" },
      { value: "da", label: "Danish" },
      { value: "no", label: "Norwegian" },
      { value: "hu", label: "Hungarian" },
    ],
    deepgram: [{ value: "multi", label: "Multi-language" }],
    assemblyai: [{ value: "en", label: "English" }],
  },
};

type ProviderType = "groq" | "deepgram" | "assemblyai";

export default function STTConfigClient({
  flow,
  initialConfig,
}: {
  flow: IFlow;
  initialConfig?: any;
}) {
  const router = useRouter();

  const { proceedWithAction } = useUnsavedChangesContext();

  const [provider, setProvider] = useState<ProviderType>(
    (initialConfig?.service as ProviderType) || "assemblyai",
  );
  const [model, setModel] = useState(
    initialConfig?.["model-name"] || "universal",
  );
  const [language, setLanguage] = useState(initialConfig?.language || "en");
  const [prompt, setPrompt] = useState(initialConfig?.prompt || "");
  const [temperature, setTemperature] = useState(
    initialConfig?.temperature || 0,
  );
  const [keyterms, setkeyterms] = useState(initialConfig?.keyterms || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: any;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  const isDirty =
    provider !== (initialConfig?.service || "groq") ||
    model !== (initialConfig?.["model-name"] || "whisper-large-v3") ||
    language !== (initialConfig?.language || "en") ||
    prompt !== (initialConfig?.prompt || "") ||
    temperature !== (initialConfig?.temperature || 0) ||
    keyterms !== (initialConfig?.keyterms || "");

  useUnsavedChanges(isDirty);

  const handleNavigation = (path: string) => {
    proceedWithAction(() => router.push(path));
  };

  const handleProviderChange = (value: string) => {
    const newProvider = value as ProviderType;
    setProvider(newProvider);
    setModel(STT_CONFIG.models[newProvider][0].value);
    setLanguage(newProvider === "deepgram" ? "multi" : "en");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = {
      provider,
      model,
      language: provider === "assemblyai" ? "" : language,
      prompt: provider === "groq" ? prompt : "",
      temperature: provider === "groq" ? temperature : 0,
      keyterms: provider === "deepgram" ? keyterms : "",
    };
    try {
      const result = await saveSTTConfiguration(flow._id, formData);
      if (result.success) {
        setModalState({
          isOpen: true,
          status: "success",
          title: "Configuration Saved",
          message: "Your STT settings have been successfully updated.",
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

  const currentModels = STT_CONFIG.models[provider] || [];
  const currentLanguages = STT_CONFIG.languages[provider] || [];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        status={modalState.status}
        title={modalState.title}
        message={modalState.message}
      />

      {/* Test Flow Dialog Integration */}
      <TestFlowDialog
        isOpen={isTestDialogOpen}
        onClose={() => setIsTestDialogOpen(false)}
        flowId={flow._id}
        apiKey={flow.api_key}
        flowName={flow.name}
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
              <Mic className="h-4 w-4 text-indigo-500" />
              STT
            </span>
          </div>
        </div>

        {/* Test Flow Button */}
        <Button
          onClick={() => setIsTestDialogOpen(true)}
          size="sm"
          className="h-9 gap-2 bg-slate-900 text-white hover:bg-indigo-600 shadow-sm transition-colors font-medium"
        >
          <Play className="h-3.5 w-3.5" />
          Test Flow
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-10 pb-32">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              STT Configuration
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configure your Speech-to-Text provider options.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <LabelWithInfo
                  label="Provider"
                  info="The AI service used to transcribe audio."
                />
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STT_CONFIG.providers.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div
                className={
                  provider === "assemblyai"
                    ? "space-y-6" // If AssemblyAI: Single column
                    : "grid grid-cols-1 md:grid-cols-2 gap-6" // Others: Two columns
                }
              >
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Model"
                    info="The specific model for transcription"
                  />
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentModels.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Only show Language if provider is NOT AssemblyAI */}
                {provider !== "assemblyai" && (
                  <div className="space-y-2">
                    <LabelWithInfo
                      label="Language"
                      info="Primary audio language (in case of multi, it will be multilingual, if forced to a single language, different language audio will be automatically transalated to that audio)"
                    />
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {currentLanguages.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-6" />
              {provider === "groq" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <LabelWithInfo
                      label="System Prompt"
                      info="Context instructions (Optional)."
                    />
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg outline-none resize-none dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <LabelWithInfo
                        label="Temperature"
                        info="Controls randomness."
                      />
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                        {temperature.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              )}
              {provider === "deepgram" && (
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Keyterms"
                    info="Give preference to specific keyterms while transcribing, this feature is usefull in industry specific cases, where you mean to say something else but model understands something else, for example ('knights' , 'nights')"
                  />
                  <input
                    type="text"
                    value={keyterms}
                    onChange={(e) => setkeyterms(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg outline-none dark:text-slate-100"
                  />
                </div>
              )}
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className={`w-full h-12 font-semibold text-base transition-all ${
                  !isDirty
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
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
