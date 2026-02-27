import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useTTSQuery, useUpdateTTSMutation } from "@/hooks/queries/useTTSQuery";
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
  AudioLines,
  Cpu,
  Mic,
  Globe,
  Save,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
  Keyboard,
  List,
} from "lucide-react";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/_dashboard/reseller/flows/$flowId/tts")({
  component: TTSConfigPage,
});

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

type ProviderType = "elevenlabs"; // rime + deepgram commented out like old project

const ELEVENLABS_MODELS = ["eleven_v3", "eleven_multilingual_v2", "flash"];

// Curated V3 voices — user will expand this list later
const ELEVENLABS_V3_VOICES = [
  {
    voice_id: "TX3LPaxmHKxFdv7VOQHJ",
    name: "Liam",
    tagline: "Energetic, Social Media Creator",
    description: "A young adult with energy and warmth.",
  },
  {
    voice_id: "BIvP0GN1cAtSRTxNHnWS",
    name: "Ellen",
    tagline: "Serious, Direct and Confident",
    description: "Calm female voice with a serious and direct tone.",
  },
  {
    voice_id: "aMSt68OGf4xUZAnLpTU8",
    name: "Juniper",
    tagline: "Grounded and Professional",
    description: "A grounded female professional voice.",
  },
  {
    voice_id: "RILOU7YmBhvwJGDGjNmP",
    name: "Jane",
    tagline: "Professional Audiobook Reader",
    description: "Professional Audiobook Reader with a polished tone.",
  },
  {
    voice_id: "EkK5I93UQWFDigLMpZcX",
    name: "James",
    tagline: "Husky, Engaging and Bold",
    description: "Husky & Engaging - A slightly deep male voice.",
  },
  {
    voice_id: "tnSpp4vdxKPjI9w0GnoV",
    name: "Hope",
    tagline: "Upbeat and Clear",
    description: "A pleasant, upbeat and clear female voice.",
  },
  {
    voice_id: "NNl6r8mD7vthiJatiJt1",
    name: "Bradford",
    tagline: "Expressive and Articulate",
    description: "An adult British Male Storyteller.",
  },
  {
    voice_id: "cgSgspJ2msm6clMCkdW9",
    name: "Jessica",
    tagline: "Playful, Bright, Warm",
    description: "Young and popular, playful American voice.",
  },
  {
    voice_id: "iP95p4xoKVk53GoZ742B",
    name: "Chris",
    tagline: "Charming, Down-to-Earth",
    description: "Natural and real, perfect for conversational content.",
  },
  {
    voice_id: "FGY2WhTYpPnrIDTdsKH5",
    name: "Laura",
    tagline: "Enthusiast, Quirky Attitude",
    description:
      "This young adult female voice delivers an upbeat performance.",
  },
  {
    voice_id: "N2lVS1w4EtoT3dr4eOWO",
    name: "Callum",
    tagline: "Husky Trickster",
    description: "Deceptively gravelly, yet unsettling edge.",
  },
  {
    voice_id: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    tagline: "Seductive and Raspy",
    description: "Sensual and raspy, she's ready to voice your content.",
  },
  {
    voice_id: "BpjGufoPiobT79j2vtj4",
    name: "Priyanka",
    tagline: "Calm, Neutral and Relaxed",
    description: "Late Night Radio host style voice.",
  },
  {
    voice_id: "2zRM7PkgwBPiau2jvVXc",
    name: "Monika Sogam",
    tagline: "Deep and Natural",
    description: "Indian English accent, deep and natural.",
  },
  {
    voice_id: "P1bg08DkjqiVEzOn76yG",
    name: "Viraj",
    tagline: "Rich and Soft",
    description: "Suspenseful and Engaging Narrator.",
  },
  {
    voice_id: "qDuRKMlYmrm8trt5QyBn",
    name: "Taksh",
    tagline: "Calm, Serious and Smooth",
    description: "Powerful & Commanding Voice.",
  },
  // Add more voices here later
];

const FALLBACK_VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ"; // Liam

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

function TTSConfigPage() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();

  const { data: config, isLoading } = useTTSQuery(flowId);
  const { mutate: updateTTS, isPending: isSaving } =
    useUpdateTTSMutation(flowId);

  // ─── STATE ────────────────────────────────────────────────────
  const [provider, setProvider] = useState<ProviderType>("elevenlabs");
  const [model, setModel] = useState(ELEVENLABS_MODELS[0]);
  const [voiceId, setVoiceId] = useState("");

  // Hybrid toggle: dropdown list vs manual input — mirrors old project exactly
  const [isManualInput, setIsManualInput] = useState(false);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  // ─── HYDRATE FROM API ─────────────────────────────────────────
  useEffect(() => {
    if (!config) return;

    const savedProvider = (config.provider as ProviderType) || "elevenlabs";
    const savedModel = ELEVENLABS_MODELS.includes(config.model)
      ? config.model
      : ELEVENLABS_MODELS[0];
    const savedVoice = config.voiceId || "";

    setProvider(savedProvider);
    setModel(savedModel);
    setVoiceId(savedVoice);

    // If saved voice is not in our curated list → start in manual mode
    if (savedVoice) {
      const inList = ELEVENLABS_V3_VOICES.some(
        (v) => v.voice_id === savedVoice,
      );
      setIsManualInput(!inList);
    }
  }, [config]);

  // ─── DIRTY + VALID — mirrors old project ─────────────────────
  const isDirty =
    provider !== (config?.provider || "elevenlabs") ||
    model !== (config?.model || "eleven_v3") ||
    voiceId !== (config?.voiceId || "");

  const isValid = useMemo(() => voiceId.trim().length > 0, [voiceId]);

  // ─── HANDLERS ─────────────────────────────────────────────────
  const handleProviderChange = (val: string) => {
    setProvider(val as ProviderType);
    setModel(ELEVENLABS_MODELS[0]);
    setVoiceId("");
    setIsManualInput(false);
  };

  const handleModelChange = (val: string) => {
    setModel(val);
    // When switching away from eleven_v3, clear voice and go manual
    if (val !== "eleven_v3") {
      setVoiceId("");
      setIsManualInput(true);
    }
  };

  const handleToggleInput = () => {
    const goingManual = !isManualInput;
    setIsManualInput(goingManual);
    if (goingManual) {
      setVoiceId("");
    } else {
      // Going back to list — clear if not in list
      const inList = ELEVENLABS_V3_VOICES.some((v) => v.voice_id === voiceId);
      if (!inList) setVoiceId("");
    }
  };

  const handleSave = () => {
    updateTTS(
      { provider, model, voiceId },
      {
        onSuccess: () =>
          setModal({
            isOpen: true,
            status: "success",
            title: "Configuration Saved",
            message: "TTS settings have been updated.",
          }),
        onError: () =>
          setModal({
            isOpen: true,
            status: "error",
            title: "Save Failed",
            message: "Could not save TTS configuration.",
          }),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-72 w-full rounded-xl" />
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
          <AudioLines className="h-4 w-4 text-orange-500" />
          TTS Configuration
        </span>
      </div>

      {/* ─── HEADING ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">TTS Options</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose your Text-to-Speech Provider, Model, and Voice.
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-8">
          {/* ─── PROVIDER ─────────────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.TTS_SERVICE_MODEL}>
            <div className="space-y-6">
              {/* Provider */}
              <div className="space-y-2">
                <LabelWithInfo label="Provider (service)" info="TTS Provider" />
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <Select value={provider} onValueChange={handleProviderChange}>
                    <SelectTrigger className="pl-9 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      {/* rime and deepgram commented out — matches old project */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <LabelWithInfo
                  label="Model Name"
                  info="The model for Voice synthesis."
                />
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <Select value={model} onValueChange={handleModelChange}>
                    <SelectTrigger className="pl-9 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ELEVENLABS_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Configurable>

          {/* ─── VOICE ─────────────────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.TTS_VOICE}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <LabelWithInfo
                  label="Voice"
                  info={
                    model === "eleven_v3"
                      ? "Select a curated V3 voice or enter a custom Voice ID."
                      : "Enter your ElevenLabs Voice ID string."
                  }
                />

                {/* Toggle only shown for eleven_v3 — mirrors old project */}
                {model === "eleven_v3" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleInput}
                    className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10 gap-1.5"
                  >
                    {isManualInput ? (
                      <>
                        <List className="h-3.5 w-3.5" />
                        Select from List
                      </>
                    ) : (
                      <>
                        <Keyboard className="h-3.5 w-3.5" />
                        Enter Custom ID
                      </>
                    )}
                  </Button>
                )}
              </div>

              {model === "eleven_v3" && !isManualInput ? (
                // ── DROPDOWN LIST (eleven_v3 only) ───────────────
                <div className="relative">
                  <Mic className="absolute left-3 top-4 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <Select value={voiceId} onValueChange={setVoiceId}>
                    <SelectTrigger className="h-auto min-h-[3rem] py-2 pl-9 text-left">
                      <SelectValue placeholder="Select a V3 voice..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {ELEVENLABS_V3_VOICES.map((voice) => (
                        <SelectItem
                          key={voice.voice_id}
                          value={voice.voice_id}
                          className="py-3 border-b border-border last:border-0 cursor-pointer"
                        >
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className="font-semibold text-sm">
                              {voice.name} — {voice.tagline}
                            </span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {voice.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                // ── MANUAL INPUT (non-v3 models OR manual toggle) ─
                <div className="relative">
                  <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                    className="w-full pl-9 pr-4 h-12 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring outline-none transition text-sm"
                  />
                </div>
              )}
            </div>
          </Configurable>

          {/* ─── SAVE ─────────────────────────────────────────── */}
          <Configurable componentId={UI_REGISTRY.TTS_SAVE_BUTTON}>
            <div className="pt-4 border-t grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  navigate({ to: `/reseller/flows/${flowId}` as any })
                }
                className="h-12 font-semibold text-base"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving || !isDirty || !isValid}
                className={cn(
                  "h-12 font-semibold text-base transition-all",
                  !isDirty || !isValid
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
