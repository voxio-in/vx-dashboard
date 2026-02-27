import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSTTQuery, useUpdateSTTMutation } from "@/hooks/queries/useSTTQuery";
import { Configurable } from "@/components/shared/Configurable";
import { UI_REGISTRY } from "@vx/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Mic,
  Save,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/_dashboard/reseller/flows/$flowId/stt")({
  component: STTConfigPage,
});

// ─── STATIC CONFIG — mirrors old STT_CONFIG exactly ──────────────────────────

type ProviderType = "groq" | "deepgram" | "assemblyai";

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
    deepgram: [{ value: "nova-3", label: "Nova 3" }],
  } as Record<ProviderType, { value: string; label: string }[]>,

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
  } as Record<ProviderType, { value: string; label: string }[]>,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

function STTConfigPage() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();

  const { data: config, isLoading } = useSTTQuery(flowId);
  const { mutate: updateSTT, isPending: isSaving } =
    useUpdateSTTMutation(flowId);

  // ─── STATE ────────────────────────────────────────────────────
  const [provider, setProvider] = useState<ProviderType>("assemblyai");
  const [model, setModel] = useState("universal");
  const [language, setLanguage] = useState("en");
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [keyterms, setKeyterms] = useState("");

  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  // ─── HYDRATE FROM API ─────────────────────────────────────────
  useEffect(() => {
    if (!config) return;
    const svc = (config.service as ProviderType) || "assemblyai";
    setProvider(svc);
    setModel(config["model-name"] || STT_CONFIG.models[svc][0].value);
    setLanguage(config.language || "en");
    setPrompt(config.prompt || "");
    setTemperature(config.temperature ?? 0);
    setKeyterms(config.keyterms || "");
  }, [config]);

  // ─── DIRTY CHECK — mirrors old isDirty exactly ────────────────
  const isDirty =
    provider !== (config?.service || "assemblyai") ||
    model !== (config?.["model-name"] || "universal") ||
    language !== (config?.language || "en") ||
    prompt !== (config?.prompt || "") ||
    temperature !== (config?.temperature ?? 0) ||
    keyterms !== (config?.keyterms || "");

  // ─── HANDLERS ─────────────────────────────────────────────────
  const handleProviderChange = (value: string) => {
    const newProvider = value as ProviderType;
    setProvider(newProvider);
    setModel(STT_CONFIG.models[newProvider][0].value);
    setLanguage(newProvider === "deepgram" ? "multi" : "en");
  };

  const handleSave = () => {
    updateSTT(
      {
        provider,
        model,
        language: provider === "assemblyai" ? "" : language,
        prompt: provider === "groq" ? prompt : "",
        temperature: provider === "groq" ? temperature : 0,
        keyterms: provider === "deepgram" ? keyterms : "",
      },
      {
        onSuccess: () =>
          setModal({
            isOpen: true,
            status: "success",
            title: "Configuration Saved",
            message: "Your STT settings have been successfully updated.",
          }),
        onError: () =>
          setModal({
            isOpen: true,
            status: "error",
            title: "Save Failed",
            message: "Could not save STT configuration.",
          }),
      },
    );
  };

  const currentModels = STT_CONFIG.models[provider] || [];
  const currentLanguages = STT_CONFIG.languages[provider] || [];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <StatusDialog
        isOpen={modal.isOpen}
        onClose={() => setModal((m) => ({ ...m, isOpen: false }))}
        status={modal.status}
        title={modal.title}
        message={modal.message}
      />

      {/* ─── BREADCRUMB ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate({ to: `/reseller/flows/${flowId}` as any })}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Flow Config
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold flex items-center gap-1">
          <Mic className="h-4 w-4 text-blue-500" />
          STT Configuration
        </span>
      </div>

      {/* ─── HEADING ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">STT Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure your Speech-to-Text provider options.
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-8">
          {/* ─── PROVIDER ─────────────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.STT_SERVICE_MODEL}>
            <div className="space-y-6">
              {/* Provider dropdown */}
              <div className="space-y-2">
                <LabelWithInfo
                  label="Provider"
                  info="The AI service used to transcribe audio."
                />
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger className="h-12">
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

              {/* Model + Language — single col for assemblyai, two cols for others */}
              <div
                className={
                  provider === "assemblyai"
                    ? "space-y-6"
                    : "grid grid-cols-1 md:grid-cols-2 gap-6"
                }
              >
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Model"
                    info="The specific model for transcription."
                  />
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-12">
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

                {/* Language — hidden for assemblyai */}
                {provider !== "assemblyai" && (
                  <Configurable componentId={UI_REGISTRY.STT_LANGUAGE}>
                    <div className="space-y-2">
                      <LabelWithInfo
                        label="Language"
                        info="Primary audio language. Multi means multilingual; forcing a single language will auto-translate other languages to it."
                      />
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="h-12">
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
                  </Configurable>
                )}
              </div>
            </div>
          </Configurable>

          <div className="h-px bg-border" />

          {/* ─── GROQ-ONLY: Prompt + Temperature ─────────────── */}
          {provider === "groq" && (
            <div className="space-y-6">
              <Configurable componentId={UI_REGISTRY.STT_PROMPT}>
                <div className="space-y-2">
                  <LabelWithInfo
                    label="System Prompt"
                    info="Context instructions (Optional)."
                  />
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-input bg-background rounded-lg outline-none resize-none text-sm focus:ring-2 focus:ring-ring transition"
                  />
                </div>
              </Configurable>

              <Configurable componentId={UI_REGISTRY.STT_TEMPERATURE}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <LabelWithInfo
                      label="Temperature"
                      info="Controls randomness in transcription."
                    />
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {temperature.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </Configurable>
            </div>
          )}

          {/* ─── DEEPGRAM-ONLY: Keyterms ──────────────────────── */}
          {provider === "deepgram" && (
            <Configurable componentId={UI_REGISTRY.STT_KEYTERMS}>
              <div className="space-y-2">
                <LabelWithInfo
                  label="Keyterms"
                  info="Give preference to specific keyterms while transcribing. Useful for industry-specific cases where the model confuses similar-sounding words (e.g. 'knights' vs 'nights')."
                />
                <input
                  type="text"
                  value={keyterms}
                  onChange={(e) => setKeyterms(e.target.value)}
                  className="w-full px-4 py-3 border border-input bg-background rounded-lg outline-none text-sm focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </Configurable>
          )}

          {/* ─── SAVE ─────────────────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.STT_SAVE_BUTTON}>
            <div className="pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className={cn(
                  "w-full h-12 text-base font-semibold transition-all",
                  !isDirty
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "",
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isDirty ? "Save Configuration" : "No Changes to Save"}
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
