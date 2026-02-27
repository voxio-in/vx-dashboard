import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { useFlowQuery } from "@/hooks/mutations/useFlowMutations";
import { useUpdateSilenceMutation } from "@/hooks/mutations/useFlowMutations";
import { Configurable } from "@/components/shared/Configurable";
import { UI_REGISTRY } from "@vx/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mic,
  Bot,
  AudioLines,
  Hash,
  ChevronRight,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";

export const Route = createFileRoute("/_dashboard/reseller/flows/$flowId")({
  component: FlowConfigPage,
});

// ─── SILENCE COUNTER ─────────────────────────────────────────────────────────
function SilenceCounter({
  flowId,
  initial,
}: {
  flowId: string;
  initial: number;
}) {
  const [value, setValue] = useState((initial || 20) * 32);
  const { mutate: updateSilence, isPending } = useUpdateSilenceMutation();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  const persist = useCallback(
    (ms: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateSilence({ id: flowId, maxSilenceCounter: Math.floor(ms / 32) });
      }, 400);
    },
    [flowId, updateSilence],
  );

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    persist(value);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, persist]);

  const step = (delta: number) =>
    setValue((prev) => Math.min(32000, Math.max(0, prev + delta)));

  return (
    <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border shrink-0">
      <Button
        variant="outline"
        size="icon"
        onClick={() => step(-32)}
        className="h-9 w-9 hover:text-red-500 transition-colors"
        disabled={value <= 0}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="w-[4.5rem] text-center font-mono text-lg font-bold relative">
        {isPending && (
          <Loader2 className="absolute -top-1 -right-1 h-3 w-3 animate-spin text-muted-foreground" />
        )}
        {value}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => step(32)}
        className="h-9 w-9 hover:text-green-500 transition-colors"
        disabled={value >= 32000}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── NAV CARD ─────────────────────────────────────────────────────────────────
function NavCard({
  label,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  to,
}: {
  label: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate({ to: to as any })}
      className="group bg-card border border-border rounded-xl p-6 flex items-center gap-5 cursor-pointer transition-all hover:border-primary/40 hover:shadow-md hover:scale-[1.01]"
    >
      <div
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
          iconBg,
          iconColor,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold">{label}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function FlowConfigPage() {
  const { flowId } = Route.useParams();
  const navigate = useNavigate();
  const { data: flow, isLoading } = useFlowQuery(flowId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-64" />
        <div className="space-y-3 mt-6">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!flow) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate({ to: "/reseller/flows" as any })}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          My Flows
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold truncate max-w-[200px]">
          {flow.name}
        </span>
      </div>

      {/* HEADING */}
      <div>
        <h1 className="text-2xl font-bold">Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the components of{" "}
          <span className="font-semibold text-primary">{flow.name}</span>.
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-3">
        <Configurable componentId={UI_REGISTRY.FLOW_STT_CARD}>
          <NavCard
            label="STT — Speech to Text"
            subtitle="Customize how AI understands you"
            icon={Mic}
            iconBg="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
            to={`/reseller/flows/${flowId}/stt`}
          />
        </Configurable>

        <Configurable componentId={UI_REGISTRY.FLOW_AGENT_CARD}>
          <NavCard
            label="Agent"
            subtitle="System prompt, LLM model, and response logic"
            icon={Bot}
            iconBg="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
            to={`/reseller/flows/${flowId}/agent`}
          />
        </Configurable>

        <Configurable componentId={UI_REGISTRY.FLOW_TTS_CARD}>
          <NavCard
            label="TTS — Text to Speech"
            subtitle="Customize how you want to listen to AI"
            icon={AudioLines}
            iconBg="bg-orange-100 dark:bg-orange-900/20"
            iconColor="text-orange-600 dark:text-orange-400"
            to={`/reseller/flows/${flowId}/tts`}
          />
        </Configurable>

        {/* SILENCE — not a nav card, inline control */}
        <Configurable componentId={UI_REGISTRY.FLOW_SILENCE_CARD}>
          <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-5 hover:border-pink-400/50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0 mt-0.5">
              <Hash className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold">Release Time</h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                How long (ms) the system waits after the user stops speaking
                before processing — prevents premature bot responses.
              </p>
            </div>
            <SilenceCounter
              flowId={flowId}
              initial={flow["max-silence-counter"] ?? 20}
            />
          </div>
        </Configurable>
      </div>
    </div>
  );
}
