"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Play,
  Megaphone,
  User,
  FileText,
  ClipboardList,
  Sparkles,
  Mic,
  Check,
  ChevronsUpDown,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { IFlow } from "@/types";
import { saveAgentConfiguration } from "@/features/agent/actions";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import TestFlowDialog from "@/components/TestFlowDialog";

// --- TYPES ---
type ModelOption = {
  value: string;
  label: string;
  description?: string;
};

// --- DEFAULTS ---
const STANDARD_DEFAULTS = {
  greeting: "Hello! How can I assist you today?",
  systemPrompt: "You are a helpful agent",
};

const ROLEPLAY_DEFAULTS = {
  greeting:
    "Are you the new guard? Finally. Someone parked in my spot. Again! What's the point of paying so much for security if you all just walk around? Are you going to do something or just stand there ?",
  traineeName: "Ayush",
  systemPrompt:
    "User the scenario only as defined, use only small 'yes' or 'no' for end_diagnosis",
  feedbackPrompt:
    "# EVALUATION CRITERIA You MUST evaluate the trainee on the following four criteria: 1.  **Communication Skills:** Did they speak clearly? Were they polite but firm? Did they listen actively? 2.  **Problem-Solving:** Did they correctly identify the problem? Did they offer valid solutions? Did they follow procedure? 3.  **Emotional Control:** Did they remain calm and professional? Did they de-escalate the situation, or did they get flustered or argumentative? 4.  **Professionalism:** Did they maintain a professional demeanor? Did they avoid breaking character or getting sidetracked? ",
  summaryPrompt:
    "Provide summary of the session as **What Went Well:** * [Provide 2-3 specific, positive points, referencing the transcript] **Areas for Improvement:** * [Provide 2-3 specific, constructive points. Explain WHAT they could have done differently and WHY] ",
};

const AGENT_CONFIG = {
  providers: [
    { value: "groq", label: "Groq" },
    { value: "openrouter", label: "OpenRouter" },
  ] as const,
  models: {
    groq: [
      {
        value: "llama-3.1-8b-instant",
        label: "Llama 3.1 8B Instant",
        description: "Fast and efficient Llama model",
      },
      {
        value: "llama-3.3-70b-versatile",
        label: "Llama 3.3 70B Versatile",
        description: "High performance Llama model",
      },
      {
        value: "openai/gpt-oss-120b",
        label: "GPT OSS 120B",
        description: "Large scale open source GPT",
      },
      {
        value: "openai/gpt-oss-20b",
        label: "GPT OSS 20B",
        description: "Smaller scale open source GPT",
      },
    ] as ModelOption[],
  },
};

const EMOTION_TTS_OPTIONS = [
  { value: "eleven_v3", label: "ElevenLabs Multilingual v3" },
];

// --- REUSABLE COMPONENTS ---

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

const PromptBox = ({
  label,
  info,
  value,
  onChange,
  rows = 4,
  icon: Icon,
  placeholder,
}: {
  label: string;
  info: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  icon: any;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <LabelWithInfo label={label} info={info} />
    <div className="relative">
      <Icon className="absolute top-3 left-3 h-5 w-5 text-slate-400 pointer-events-none" />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none dark:text-slate-100 placeholder:text-slate-400"
      />
    </div>
  </div>
);

const ProviderModelSelector = ({
  provider,
  setProvider,
  model,
  setModel,
  openRouterModels,
  emotionEnabled,
  setEmotionEnabled,
  emotionModel,
  setEmotionModel,
}: {
  provider: string;
  setProvider: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  openRouterModels: ModelOption[];
  emotionEnabled: boolean;
  setEmotionEnabled: (val: boolean) => void;
  emotionModel: string;
  setEmotionModel: (val: string) => void;
}) => {
  // Model Search State
  const [modelOpen, setModelOpen] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState("");

  const handleProviderChange = (value: string) => {
    setProvider(value);

    // Reset to the first model of the new provider
    if (value === "groq") {
      setModel(AGENT_CONFIG.models.groq[0].value);
    } else if (value === "openrouter" && openRouterModels.length > 0) {
      setModel(openRouterModels[0].value);
    }
    // Reset search when provider changes
    setModelSearchTerm("");
  };

  const currentModels =
    provider === "openrouter"
      ? openRouterModels
      : AGENT_CONFIG.models.groq || [];

  // Find currently selected model to show its description in the tooltip and label on button
  const selectedModelData = currentModels.find((m) => m.value === model);
  const infoText = selectedModelData?.description || "Specific AI model";

  // Filter models based on search term
  const filteredModels = currentModels.filter((m) =>
    m.label.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-6">
      {/* Provider & Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROVIDER - STANDARD SELECT (No Search) */}
        <div className="space-y-2">
          <LabelWithInfo label="Provider" info="Model provider" />
          <div className="relative">
            <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
            <Select value={provider} onValueChange={handleProviderChange}>
              {/* Added pl-12 to align symmetrically with Model selector */}
              <SelectTrigger className="w-full h-11 pl-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
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

        {/* MODEL - CUSTOM SEARCHABLE DROPDOWN */}
        <div className="space-y-2">
          <LabelWithInfo label="Model" info={infoText} />
          <div className="relative">
            {/* Icon is placed absolute. */}
            <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />

            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost" // Use ghost to strip default variant borders
                  role="combobox"
                  aria-expanded={modelOpen}
                  disabled={
                    provider === "openrouter" && currentModels.length === 0
                  }
                  // Manually applied border classes to match Provider box exactly
                  // Added !pl-12 to strictly prevent icon overlap
                  className="w-full h-11 !pl-12 justify-between bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-normal text-sm hover:bg-white hover:text-slate-900 text-left rounded-md shadow-sm"
                >
                  <span className="truncate flex-1 text-left">
                    {provider === "openrouter" && currentModels.length === 0
                      ? "Loading..."
                      : selectedModelData?.label || "Select model..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                align="start"
              >
                {/* Search Input */}
                <div className="mb-2">
                  <Input
                    placeholder="Search model..."
                    value={modelSearchTerm}
                    onChange={(e) => setModelSearchTerm(e.target.value)}
                    className="h-9 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                {/* List Items */}
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {filteredModels.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-500">
                      {currentModels.length === 0
                        ? "No models available"
                        : "No matching models"}
                    </div>
                  ) : (
                    filteredModels.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => {
                          setModel(item.value);
                          setModelOpen(false);
                          setModelSearchTerm("");
                        }}
                        className={cn(
                          "flex items-center justify-between px-2 py-2 text-sm rounded-md cursor-pointer transition-colors",
                          "hover:bg-slate-100 dark:hover:bg-slate-800",
                          model === item.value
                            ? "bg-slate-100 dark:bg-slate-800 font-medium"
                            : ""
                        )}
                      >
                        <span className="truncate flex-1">{item.label}</span>
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4 shrink-0",
                            model === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Emotion Checkbox & Dropdown */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emotion-checkbox"
              checked={emotionEnabled}
              onChange={(e) => setEmotionEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="emotion-checkbox"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Enable Emotion
            </label>
          </div>

          {emotionEnabled && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <LabelWithInfo
                label="Emotion TTS Model"
                info="Select the Text-to-Speech model capable of emotional output."
              />
              <div className="relative">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                <Select value={emotionModel} onValueChange={setEmotionModel}>
                  <SelectTrigger className="w-full h-11 pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOTION_TTS_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

export default function AgentConfigClient({
  flow,
  initialConfig,
}: {
  flow: IFlow;
  initialConfig?: any;
}) {
  const router = useRouter();
  const { proceedWithAction } = useUnsavedChangesContext();

  const isRolePlay = initialConfig?.isRolePlay || false;
  const currentDefaults = isRolePlay ? ROLEPLAY_DEFAULTS : STANDARD_DEFAULTS;

  // --- STATE INITIALIZATION ---

  const [greeting, setGreeting] = useState(
    initialConfig?.greeting || currentDefaults.greeting
  );

  const [traineeName, setTraineeName] = useState(
    initialConfig?.traineeName ||
      (isRolePlay ? (currentDefaults as any).traineeName : "")
  );

  // --- MAIN LLM STATES ---
  const [systemPrompt, setSystemPrompt] = useState(
    initialConfig?.systemPrompt || currentDefaults.systemPrompt
  );
  const [provider, setProvider] = useState<string>(
    initialConfig?.provider || "groq"
  );
  const [model, setModel] = useState<string>(
    initialConfig?.model || "llama-3.1-8b-instant"
  );
  const [emotion, setEmotion] = useState<boolean>(
    initialConfig?.emotion || false
  );
  const [emotionModel, setEmotionModel] = useState<string>(
    initialConfig?.emotionModel || "eleven_v3"
  );

  // --- FEEDBACK STATES ---
  const [feedbackPrompt, setFeedbackPrompt] = useState(
    initialConfig?.feedbackPrompt ||
      (isRolePlay ? (currentDefaults as any).feedbackPrompt : "")
  );
  const [feedbackProvider, setFeedbackProvider] = useState<string>(
    initialConfig?.feedbackProvider || "groq"
  );
  const [feedbackModel, setFeedbackModel] = useState<string>(
    initialConfig?.feedbackModel || "llama-3.3-70b-versatile"
  );
  const [feedbackEmotion, setFeedbackEmotion] = useState<boolean>(
    initialConfig?.feedbackEmotion || false
  );
  const [feedbackEmotionModel, setFeedbackEmotionModel] = useState<string>(
    initialConfig?.feedbackEmotionModel || "eleven_v3"
  );

  // --- SUMMARY STATES ---
  const [summaryPrompt, setSummaryPrompt] = useState(
    initialConfig?.summaryPrompt ||
      (isRolePlay ? (currentDefaults as any).summaryPrompt : "")
  );
  const [summaryProvider, setSummaryProvider] = useState<string>(
    initialConfig?.summaryProvider || "groq"
  );
  const [summaryModel, setSummaryModel] = useState<string>(
    initialConfig?.summaryModel || "llama-3.3-70b-versatile"
  );
  const [summaryEmotion, setSummaryEmotion] = useState<boolean>(
    initialConfig?.summaryEmotion || false
  );
  const [summaryEmotionModel, setSummaryEmotionModel] = useState<string>(
    initialConfig?.summaryEmotionModel || "eleven_v3"
  );

  // --- OPENROUTER STATE & EFFECT ---
  const [openRouterModels, setOpenRouterModels] = useState<ModelOption[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/models");
        const data = await res.json();
        if (data?.data) {
          const mapped = data.data.map((m: any) => ({
            value: m.id,
            label: m.name,
            description: m.description || "No description available",
          }));
          mapped.sort((a: ModelOption, b: ModelOption) =>
            a.label.localeCompare(b.label)
          );
          setOpenRouterModels(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch openrouter models", err);
      }
    };

    fetchModels();
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  // --- DIRTY CHECK ---
  const isDirty =
    greeting !== (initialConfig?.greeting || currentDefaults.greeting) ||
    systemPrompt !==
      (initialConfig?.systemPrompt || currentDefaults.systemPrompt) ||
    provider !== (initialConfig?.provider || "groq") ||
    model !== (initialConfig?.model || "llama-3.1-8b-instant") ||
    emotion !== (initialConfig?.emotion || false) ||
    emotionModel !==
      (initialConfig?.emotionModel || "eleven_v3") ||
    (isRolePlay &&
      (traineeName !==
        (initialConfig?.traineeName || (currentDefaults as any).traineeName) ||
        feedbackPrompt !==
          (initialConfig?.feedbackPrompt ||
            (currentDefaults as any).feedbackPrompt) ||
        feedbackProvider !== (initialConfig?.feedbackProvider || "groq") ||
        feedbackModel !==
          (initialConfig?.feedbackModel || "llama-3.3-70b-versatile") ||
        feedbackEmotion !== (initialConfig?.feedbackEmotion || false) ||
        feedbackEmotionModel !==
          (initialConfig?.feedbackEmotionModel ||
            "eleven_v3") ||
        summaryPrompt !==
          (initialConfig?.summaryPrompt ||
            (currentDefaults as any).summaryPrompt) ||
        summaryProvider !== (initialConfig?.summaryProvider || "groq") ||
        summaryModel !==
          (initialConfig?.summaryModel || "llama-3.3-70b-versatile") ||
        summaryEmotion !== (initialConfig?.summaryEmotion || false) ||
        summaryEmotionModel !==
          (initialConfig?.summaryEmotionModel ||
            "eleven_v3")));

  useUnsavedChanges(isDirty);

  const handleNavigation = (path: string) => {
    proceedWithAction(() => {
      router.push(path);
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    const finalGreeting = greeting || currentDefaults.greeting;
    const finalSystemPrompt = systemPrompt || currentDefaults.systemPrompt;

    const finalTraineeName = isRolePlay
      ? traineeName || (currentDefaults as any).traineeName
      : undefined;
    const finalFeedbackPrompt = isRolePlay
      ? feedbackPrompt || (currentDefaults as any).feedbackPrompt
      : undefined;
    const finalSummaryPrompt = isRolePlay
      ? summaryPrompt || (currentDefaults as any).summaryPrompt
      : undefined;

    const formData = {
      greeting: finalGreeting,
      systemPrompt: finalSystemPrompt,
      provider,
      model,
      emotion,
      emotionModel,
      traineeName: finalTraineeName,
      feedbackPrompt: finalFeedbackPrompt,
      feedbackProvider,
      feedbackModel,
      feedbackEmotion,
      feedbackEmotionModel,
      summaryPrompt: finalSummaryPrompt,
      summaryProvider,
      summaryModel,
      summaryEmotion,
      summaryEmotionModel,
    };

    try {
      const result = await saveAgentConfiguration(flow._id, formData);
      if (result.success) {
        setModalState({
          isOpen: true,
          status: "success",
          title: "Agent Updated",
          message: "Configuration saved successfully.",
        });

        if (!greeting) setGreeting(currentDefaults.greeting);
        if (!systemPrompt) setSystemPrompt(currentDefaults.systemPrompt);
        if (isRolePlay) {
          if (!traineeName)
            setTraineeName((currentDefaults as any).traineeName);
          if (!feedbackPrompt)
            setFeedbackPrompt((currentDefaults as any).feedbackPrompt);
          if (!summaryPrompt)
            setSummaryPrompt((currentDefaults as any).summaryPrompt);
        }

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
      console.error("🔴 [Client] Error:", error);
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

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        status={modalState.status}
        title={modalState.title}
        message={modalState.message}
      />

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
              <Bot className="h-4 w-4 text-indigo-500" />
              Agent
            </span>
          </div>
        </div>

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
              Agent Configuration
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {isRolePlay
                ? "Configure the Role Play scenario, Feedback, and Summary logic."
                : "Configure the AI Persona and Model settings."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <div className="space-y-8">
              {/* 1. TRAINEE NAME */}
              {isRolePlay && (
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Trainee Name"
                    info="The default name of the person being trained."
                  />
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-5 w-5 text-slate-400 pointer-events-none" />
                    <Input
                      value={traineeName}
                      onChange={(e) => setTraineeName(e.target.value)}
                      placeholder="Enter trainee name"
                      className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* 2. GREETING */}
              <PromptBox
                label="Greeting Message"
                info="The first message the agent speaks when the call starts."
                value={greeting}
                onChange={setGreeting}
                rows={2}
                icon={Megaphone}
                placeholder="Enter greeting message"
              />

              <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />

              {/* 3. MAIN AGENT LOGIC */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-indigo-500" />
                  Main Agent Logic
                </h3>

                <PromptBox
                  label="System Prompt"
                  info="Instructions for the main conversational agent."
                  value={systemPrompt}
                  onChange={setSystemPrompt}
                  rows={6}
                  icon={MessageSquare}
                  placeholder="Enter system prompt"
                />

                <ProviderModelSelector
                  provider={provider}
                  setProvider={setProvider}
                  model={model}
                  setModel={setModel}
                  openRouterModels={openRouterModels}
                  emotionEnabled={emotion}
                  setEmotionEnabled={setEmotion}
                  emotionModel={emotionModel}
                  setEmotionModel={setEmotionModel}
                />
              </div>

              {/* 4. FEEDBACK & SUMMARY */}
              {isRolePlay && (
                <>
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />

                  <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-purple-500" />
                        Feedback Logic
                      </h3>
                      <PromptBox
                        label="Feedback System Prompt"
                        info="Instructions for generating the post-call evaluation."
                        value={feedbackPrompt}
                        onChange={setFeedbackPrompt}
                        rows={6}
                        icon={MessageSquare}
                        placeholder="Enter feedback prompt"
                      />
                      <ProviderModelSelector
                        provider={feedbackProvider}
                        setProvider={setFeedbackProvider}
                        model={feedbackModel}
                        setModel={setFeedbackModel}
                        openRouterModels={openRouterModels}
                        emotionEnabled={feedbackEmotion}
                        setEmotionEnabled={setFeedbackEmotion}
                        emotionModel={feedbackEmotionModel}
                        setEmotionModel={setFeedbackEmotionModel}
                      />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        Summary Logic
                      </h3>
                      <PromptBox
                        label="Summary System Prompt"
                        info="Instructions for generating the session summary."
                        value={summaryPrompt}
                        onChange={setSummaryPrompt}
                        rows={6}
                        icon={MessageSquare}
                        placeholder="Enter summary prompt"
                      />
                      <ProviderModelSelector
                        provider={summaryProvider}
                        setProvider={setSummaryProvider}
                        model={summaryModel}
                        setModel={setSummaryModel}
                        openRouterModels={openRouterModels}
                        emotionEnabled={summaryEmotion}
                        setEmotionEnabled={setSummaryEmotion}
                        emotionModel={summaryEmotionModel}
                        setEmotionModel={setSummaryEmotionModel}
                      />
                    </div>
                  </div>
                </>
              )}
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
