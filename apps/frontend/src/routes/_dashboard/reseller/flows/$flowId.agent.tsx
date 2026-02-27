import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useAgentQuery,
  useSaveAgentMutation,
} from "@/hooks/queries/useAgentQuery";
import { Configurable } from "@/components/shared/Configurable";
import { UI_REGISTRY } from "@vx/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Cpu,
  Megaphone,
  User,
  FileText,
  ClipboardList,
  Sparkles,
  Mic,
  Check,
  ChevronsUpDown,
  Box,
} from "lucide-react";
import { cn } from "@/utils/cn";

export const Route = createFileRoute(
  "/_dashboard/reseller/flows/$flowId/agent" as any,
)({
  component: AgentConfigPage,
});

// ─── TYPES ──────────────────────────────────────────────────
type ModelOption = { value: string; label: string; description?: string };

// ─── DEFAULTS ───────────────────────────────────────────────
const STANDARD_DEFAULTS = {
  greeting: "Hello! How can I assist you today?",
  systemPrompt: "You are a helpful agent",
};

const ROLEPLAY_DEFAULTS = {
  greeting: "Are you the new guard? Finally. Someone parked in my spot. Again!",
  traineeName: "Trainee",
  systemPrompt: "Use the scenario only as defined",
  feedbackPrompt:
    "# EVALUATION CRITERIA\nEvaluate on: Communication, Problem-Solving, Emotional Control, Professionalism.",
  summaryPrompt: "**What Went Well:**\n\n**Areas for Improvement:**",
};

const GROQ_MODELS: ModelOption[] = [
  {
    value: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B Instant",
    description: "Fast and efficient",
  },
  {
    value: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B Versatile",
    description: "High performance",
  },
  {
    value: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
    description: "Large scale",
  },
  {
    value: "openai/gpt-oss-20b",
    label: "GPT OSS 20B",
    description: "Smaller scale",
  },
];

const EMOTION_OPTIONS = [
  { value: "eleven_v3", label: "ElevenLabs Multilingual v3" },
];

// ─── SUB COMPONENTS ─────────────────────────────────────────

const LabelWithInfo = ({ label, info }: { label: string; info: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <label className="text-sm font-semibold">{label}</label>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
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
      <Icon className="absolute top-3 left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring outline-none transition resize-none text-sm"
      />
    </div>
  </div>
);

const ModelSelector = ({
  provider,
  setProvider,
  model,
  setModel,
  openRouterModels,
}: {
  provider: string;
  setProvider: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  openRouterModels: ModelOption[];
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const models = provider === "openrouter" ? openRouterModels : GROQ_MODELS;
  const filtered = models.filter((m) =>
    m.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = models.find((m) => m.value === model);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Provider */}
      <div className="space-y-2">
        <LabelWithInfo label="Provider" info="Model provider" />
        <div className="relative">
          <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={provider}
            onValueChange={(v) => {
              setProvider(v);
              setModel(
                v === "groq"
                  ? GROQ_MODELS[0].value
                  : openRouterModels[0]?.value || "",
              );
              setSearch("");
            }}
          >
            <SelectTrigger className="pl-9 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groq">Groq</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Model searchable */}
      <div className="space-y-2 relative">
        <LabelWithInfo
          label="Model"
          info={selected?.description || "AI model"}
        />
        <div className="relative">
          <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full h-10 pl-9 pr-3 flex items-center justify-between border border-input bg-background rounded-md text-sm hover:bg-accent transition-colors"
          >
            <span className="truncate">
              {selected?.label || "Select model..."}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
          </button>
          {open && (
            <div className="absolute z-50 top-11 left-0 right-0 bg-background border rounded-md shadow-lg p-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 mb-2 text-sm"
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {filtered.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => {
                      setModel(item.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent",
                      model === item.value && "bg-accent font-medium",
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 ml-2 shrink-0",
                        model === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  setProvider: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  openRouterModels: ModelOption[];
  emotionEnabled: boolean;
  setEmotionEnabled: (v: boolean) => void;
  emotionModel: string;
  setEmotionModel: (v: string) => void;
}) => (
  <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
    {/* Provider + Model */}
    <Configurable componentId={UI_REGISTRY.AGENT_PROVIDER_MODEL}>
      <ModelSelector
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        openRouterModels={openRouterModels}
      />
    </Configurable>

    {/* Emotion Toggle */}
    <Configurable componentId={UI_REGISTRY.AGENT_EMOTION_TOGGLE}>
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={`emotion-${provider}`}
            checked={emotionEnabled}
            onChange={(e) => setEmotionEnabled(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded"
          />
          <label
            htmlFor={`emotion-${provider}`}
            className="text-sm font-semibold cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Enable Emotion
          </label>
        </div>
        {emotionEnabled && (
          <div>
            <LabelWithInfo
              label="Emotion TTS Model"
              info="TTS model for emotional output"
            />
            <div className="relative">
              <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <Select value={emotionModel} onValueChange={setEmotionModel}>
                <SelectTrigger className="pl-9 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMOTION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </Configurable>
  </div>
);

const StatusDialog = ({
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
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-center">{title}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center",
            status === "success"
              ? "bg-green-100 text-green-600 dark:bg-green-900/20"
              : "bg-red-100 text-red-600 dark:bg-red-900/20",
          )}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <XCircle className="h-8 w-8" />
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center">{message}</p>
        <Button
          onClick={onClose}
          className={cn(
            "w-full",
            status === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700",
          )}
        >
          {status === "success" ? "Continue" : "Close"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// ─── MAIN PAGE ───────────────────────────────────────────────
function AgentConfigPage() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();
  const { data: initialConfig, isLoading } = useAgentQuery(flowId);
  const { mutate: saveAgent, isPending: isSaving } =
    useSaveAgentMutation(flowId);

  const isRolePlay = initialConfig?.isRolePlay || false;
  const defaults = isRolePlay ? ROLEPLAY_DEFAULTS : STANDARD_DEFAULTS;

  // ─── STATE ──────────────────────────────────────────────
  const [greeting, setGreeting] = useState("");
  const [traineeName, setTraineeName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState("llama-3.1-8b-instant");
  const [emotion, setEmotion] = useState(false);
  const [emotionModel, setEmotionModel] = useState("eleven_v3");

  const [feedbackPrompt, setFeedbackPrompt] = useState("");
  const [feedbackProvider, setFeedbackProvider] = useState("groq");
  const [feedbackModel, setFeedbackModel] = useState("llama-3.3-70b-versatile");
  const [feedbackEmotion, setFeedbackEmotion] = useState(false);
  const [feedbackEmotionModel, setFeedbackEmotionModel] = useState("eleven_v3");

  const [summaryPrompt, setSummaryPrompt] = useState("");
  const [summaryProvider, setSummaryProvider] = useState("groq");
  const [summaryModel, setSummaryModel] = useState("llama-3.3-70b-versatile");
  const [summaryEmotion, setSummaryEmotion] = useState(false);
  const [summaryEmotionModel, setSummaryEmotionModel] = useState("eleven_v3");

  const [openRouterModels, setOpenRouterModels] = useState<ModelOption[]>([]);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  // ─── POPULATE FROM API ──────────────────────────────────
  useEffect(() => {
    if (!initialConfig) return;
    setGreeting(initialConfig.greeting || defaults.greeting);
    setSystemPrompt(initialConfig.systemPrompt || defaults.systemPrompt);
    setProvider(initialConfig.provider || "groq");
    setModel(initialConfig.model || "llama-3.1-8b-instant");
    setEmotion(initialConfig.emotion || false);
    setEmotionModel(initialConfig.emotionModel || "eleven_v3");

    if (isRolePlay) {
      setTraineeName(
        initialConfig.traineeName || (defaults as any).traineeName || "",
      );
      setFeedbackPrompt(
        initialConfig.feedbackPrompt || (defaults as any).feedbackPrompt || "",
      );
      setFeedbackProvider(initialConfig.feedbackProvider || "groq");
      setFeedbackModel(
        initialConfig.feedbackModel || "llama-3.3-70b-versatile",
      );
      setFeedbackEmotion(initialConfig.feedbackEmotion || false);
      setFeedbackEmotionModel(
        initialConfig.feedbackEmotionModel || "eleven_v3",
      );
      setSummaryPrompt(
        initialConfig.summaryPrompt || (defaults as any).summaryPrompt || "",
      );
      setSummaryProvider(initialConfig.summaryProvider || "groq");
      setSummaryModel(initialConfig.summaryModel || "llama-3.3-70b-versatile");
      setSummaryEmotion(initialConfig.summaryEmotion || false);
      setSummaryEmotionModel(initialConfig.summaryEmotionModel || "eleven_v3");
    }
  }, [initialConfig]);

  // ─── FETCH OPENROUTER MODELS ────────────────────────────
  useEffect(() => {
    fetch("https://openrouter.ai/api/v1/models")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          const mapped: ModelOption[] = data.data.map((m: any) => ({
            value: m.id,
            label: m.name,
            description: m.description || "No description",
          }));
          mapped.sort((a, b) => a.label.localeCompare(b.label));
          setOpenRouterModels(mapped);
        }
      })
      .catch(console.error);
  }, []);

  // ─── SAVE ────────────────────────────────────────────────
  const handleSave = () => {
    saveAgent(
      {
        greeting: greeting || defaults.greeting,
        systemPrompt: systemPrompt || defaults.systemPrompt,
        provider,
        model,
        emotion,
        emotionModel,
        traineeName: isRolePlay ? traineeName : undefined,
        feedbackPrompt: isRolePlay ? feedbackPrompt : undefined,
        feedbackProvider,
        feedbackModel,
        feedbackEmotion,
        feedbackEmotionModel,
        summaryPrompt: isRolePlay ? summaryPrompt : undefined,
        summaryProvider,
        summaryModel,
        summaryEmotion,
        summaryEmotionModel,
      },
      {
        onSuccess: () =>
          setModal({
            isOpen: true,
            status: "success",
            title: "Agent Updated",
            message: "Configuration saved successfully.",
          }),
        onError: () =>
          setModal({
            isOpen: true,
            status: "error",
            title: "Save Failed",
            message: "Could not save configuration.",
          }),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <StatusDialog
        isOpen={modal.isOpen}
        onClose={() => setModal((m) => ({ ...m, isOpen: false }))}
        status={modal.status}
        title={modal.title}
        message={modal.message}
      />

      {/* ─── BREADCRUMB ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate({ to: "/reseller/flows" as any })}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          My Flows
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold flex items-center gap-1">
          <Bot className="h-4 w-4 text-primary" />
          Agent Config
        </span>
        {isRolePlay && (
          <Badge variant="secondary" className="ml-1">
            Role Play
          </Badge>
        )}
      </div>

      {/* ─── HEADING ────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">Agent Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isRolePlay
            ? "Configure Role Play scenario, Feedback, and Summary logic."
            : "Configure the AI Persona and Model settings."}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-8">
          {/* ─── TRAINEE NAME (Role Play only) ─────────── */}
          {isRolePlay && (
            <Configurable componentId={UI_REGISTRY.AGENT_TRAINEE_NAME}>
              <div className="space-y-2">
                <LabelWithInfo
                  label="Trainee Name"
                  info="Default name of the person being trained."
                />
                <div className="relative">
                  <User className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={traineeName}
                    onChange={(e) => setTraineeName(e.target.value)}
                    placeholder="Enter trainee name"
                    className="pl-9 h-10"
                  />
                </div>
              </div>
            </Configurable>
          )}

          {/* ─── GREETING ───────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.AGENT_GREETING}>
            <PromptBox
              label="Greeting Message"
              info="First message the agent speaks when the call starts."
              value={greeting}
              onChange={setGreeting}
              rows={2}
              icon={Megaphone}
              placeholder="Enter greeting message"
            />
          </Configurable>

          <div className="border-t" />

          {/* ─── MAIN AGENT ─────────────────────────────── */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Main Agent Logic
            </h3>

            <Configurable componentId={UI_REGISTRY.AGENT_SYSTEM_PROMPT}>
              <PromptBox
                label="System Prompt"
                info="Instructions for the main conversational agent."
                value={systemPrompt}
                onChange={setSystemPrompt}
                rows={6}
                icon={MessageSquare}
                placeholder="Enter system prompt"
              />
            </Configurable>

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

          {/* ─── FEEDBACK & SUMMARY (Role Play only) ────── */}
          {isRolePlay && (
            <Configurable componentId={UI_REGISTRY.AGENT_ROLEPLAY_SECTION}>
              <div className="space-y-8">
                <div className="border-t" />

                {/* Feedback */}
                <Configurable componentId={UI_REGISTRY.AGENT_FEEDBACK_SECTION}>
                  <div className="space-y-6">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                      Feedback Logic
                    </h3>
                    <Configurable
                      componentId={UI_REGISTRY.AGENT_FEEDBACK_PROMPT}
                    >
                      <PromptBox
                        label="Feedback System Prompt"
                        info="Instructions for generating the post-call evaluation."
                        value={feedbackPrompt}
                        onChange={setFeedbackPrompt}
                        rows={6}
                        icon={MessageSquare}
                        placeholder="Enter feedback prompt"
                      />
                    </Configurable>
                    <Configurable
                      componentId={UI_REGISTRY.AGENT_FEEDBACK_MODEL}
                    >
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
                    </Configurable>
                  </div>
                </Configurable>

                <div className="border-t" />

                {/* Summary */}
                <Configurable componentId={UI_REGISTRY.AGENT_SUMMARY_SECTION}>
                  <div className="space-y-6">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      Summary Logic
                    </h3>
                    <Configurable
                      componentId={UI_REGISTRY.AGENT_SUMMARY_PROMPT}
                    >
                      <PromptBox
                        label="Summary System Prompt"
                        info="Instructions for generating the session summary."
                        value={summaryPrompt}
                        onChange={setSummaryPrompt}
                        rows={6}
                        icon={MessageSquare}
                        placeholder="Enter summary prompt"
                      />
                    </Configurable>
                    <Configurable componentId={UI_REGISTRY.AGENT_SUMMARY_MODEL}>
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
                    </Configurable>
                  </div>
                </Configurable>
              </div>
            </Configurable>
          )}

          {/* ─── SAVE BUTTON ────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.AGENT_SAVE_BUTTON}>
            <div className="pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-12 text-base font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </Configurable>
        </CardContent>
      </Card>
    </div>
  );
}
