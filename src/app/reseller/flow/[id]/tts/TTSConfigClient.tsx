"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  AudioLines,
  Cpu,
  Mic,
  Save,
  Loader2,
  Info,
  CheckCircle2,
  XCircle,
  Globe,
  Layers,
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
import { saveTTSConfiguration } from "@/features/tts/actions";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import TestFlowDialog from "@/components/TestFlowDialog";

// --- DATA CONSTANTS ---

const LANG_MAP: Record<string, string> = {
  eng: "English",
  spa: "Spanish",
  fra: "French",
  ger: "German",
  hin: "Hindi",
};

const ELEVENLABS_MODELS = [
  "eleven_multilingual_v3",
  "eleven_multilingual_v2",
  "flash",
];

const DEEPGRAM_MODELS = [
  // Aura-2 English
  { value: "aura-2-thalia-en", label: "Thalia (US Female) - Aura 2" },
  { value: "aura-2-andromeda-en", label: "Andromeda (US Female) - Aura 2" },
  { value: "aura-2-helena-en", label: "Helena (US Female) - Aura 2" },
  { value: "aura-2-apollo-en", label: "Apollo (US Male) - Aura 2" },
  { value: "aura-2-arcas-en", label: "Arcas (US Male) - Aura 2" },
  { value: "aura-2-aries-en", label: "Aries (US Male) - Aura 2" },
  { value: "aura-2-amalthea-en", label: "Amalthea (Filipino Female) - Aura 2" },
  { value: "aura-2-asteria-en", label: "Asteria (US Female) - Aura 2" },
  { value: "aura-2-athena-en", label: "Athena (US Female) - Aura 2" },
  { value: "aura-2-atlas-en", label: "Atlas (US Male) - Aura 2" },
  { value: "aura-2-aurora-en", label: "Aurora (US Female) - Aura 2" },
  { value: "aura-2-callista-en", label: "Callista (US Female) - Aura 2" },
  { value: "aura-2-cora-en", label: "Cora (US Female) - Aura 2" },
  { value: "aura-2-cordelia-en", label: "Cordelia (US Female) - Aura 2" },
  { value: "aura-2-delia-en", label: "Delia (US Female) - Aura 2" },
  { value: "aura-2-draco-en", label: "Draco (British Male) - Aura 2" },
  { value: "aura-2-electra-en", label: "Electra (US Female) - Aura 2" },
  { value: "aura-2-harmonia-en", label: "Harmonia (US Female) - Aura 2" },
  { value: "aura-2-hera-en", label: "Hera (US Female) - Aura 2" },
  { value: "aura-2-hermes-en", label: "Hermes (US Male) - Aura 2" },
  { value: "aura-2-hyperion-en", label: "Hyperion (Australian Male) - Aura 2" },
  { value: "aura-2-iris-en", label: "Iris (US Female) - Aura 2" },
  { value: "aura-2-janus-en", label: "Janus (US Female) - Aura 2" },
  { value: "aura-2-juno-en", label: "Juno (US Female) - Aura 2" },
  { value: "aura-2-jupiter-en", label: "Jupiter (US Male) - Aura 2" },
  { value: "aura-2-luna-en", label: "Luna (US Female) - Aura 2" },
  { value: "aura-2-mars-en", label: "Mars (US Male) - Aura 2" },
  { value: "aura-2-minerva-en", label: "Minerva (US Female) - Aura 2" },
  { value: "aura-2-neptune-en", label: "Neptune (US Male) - Aura 2" },
  { value: "aura-2-odysseus-en", label: "Odysseus (US Male) - Aura 2" },
  { value: "aura-2-ophelia-en", label: "Ophelia (US Female) - Aura 2" },
  { value: "aura-2-orion-en", label: "Orion (US Male) - Aura 2" },
  { value: "aura-2-orpheus-en", label: "Orpheus (US Male) - Aura 2" },
  { value: "aura-2-pandora-en", label: "Pandora (British Female) - Aura 2" },
  { value: "aura-2-phoebe-en", label: "Phoebe (US Female) - Aura 2" },
  { value: "aura-2-pluto-en", label: "Pluto (US Male) - Aura 2" },
  { value: "aura-2-saturn-en", label: "Saturn (US Male) - Aura 2" },
  { value: "aura-2-selene-en", label: "Selene (US Female) - Aura 2" },
  { value: "aura-2-theia-en", label: "Theia (Australian Female) - Aura 2" },
  { value: "aura-2-vesta-en", label: "Vesta (US Female) - Aura 2" },
  { value: "aura-2-zeus-en", label: "Zeus (US Male) - Aura 2" },
  // Aura-2 Spanish
  { value: "aura-2-celeste-es", label: "Celeste (Colombian Female) - Aura 2" },
  { value: "aura-2-estrella-es", label: "Estrella (Mexican Female) - Aura 2" },
  { value: "aura-2-nestor-es", label: "Nestor (Peninsular Male) - Aura 2" },
  { value: "aura-2-sirio-es", label: "Sirio (Mexican Male) - Aura 2" },
  { value: "aura-2-carina-es", label: "Carina (Peninsular Female) - Aura 2" },
  { value: "aura-2-alvaro-es", label: "Alvaro (Peninsular Male) - Aura 2" },
  { value: "aura-2-diana-es", label: "Diana (Peninsular Female) - Aura 2" },
  { value: "aura-2-aquila-es", label: "Aquila (LatAm Male) - Aura 2" },
  { value: "aura-2-selena-es", label: "Selena (LatAm Female) - Aura 2" },
  { value: "aura-2-javier-es", label: "Javier (Mexican Male) - Aura 2" },
  // Aura 1 (Legacy)
  { value: "aura-asteria-en", label: "Asteria (US Female) - Aura 1" },
  { value: "aura-luna-en", label: "Luna (US Female) - Aura 1" },
  { value: "aura-stella-en", label: "Stella (US Female) - Aura 1" },
  { value: "aura-athena-en", label: "Athena (British Female) - Aura 1" },
  { value: "aura-hera-en", label: "Hera (US Female) - Aura 1" },
  { value: "aura-orion-en", label: "Orion (US Male) - Aura 1" },
  { value: "aura-arcas-en", label: "Arcas (US Male) - Aura 1" },
  { value: "aura-perseus-en", label: "Perseus (US Male) - Aura 1" },
  { value: "aura-angus-en", label: "Angus (Irish Male) - Aura 1" },
  { value: "aura-orpheus-en", label: "Orpheus (US Male) - Aura 1" },
  { value: "aura-helios-en", label: "Helios (British Male) - Aura 1" },
  { value: "aura-zeus-en", label: "Zeus (US Male) - Aura 1" },
];

const RIME_MODELS = ["mist", "mistv2", "arcana"];
const RIME_VOICES: Record<string, Record<string, string[]>> = {
  mist: {
    eng: [
      "abbie",
      "alexis",
      "allison",
      "ally",
      "alona",
      "alpine",
      "amber",
      "ana",
      "antoine",
      "armon",
      "bayou",
      "benjamin",
      "blaze",
      "blossom",
      "boulder",
      "breeze",
      "brenda",
      "brittany",
      "brook",
      "carol",
      "cedar",
      "colin",
      "courtney",
      "cove",
      "creek",
      "dew",
      "elena",
      "elliot",
      "ember",
      "eva",
      "falcon",
      "fjord",
      "flower",
      "frank",
      "gabriela",
      "geoff",
      "gerald",
      "glacier",
      "granite",
      "grove",
      "gulch",
      "gypsum",
      "hank",
      "hawk",
      "helen",
      "hera",
      "iris",
      "ironwood",
      "jen",
      "joe",
      "joy",
      "juan",
      "jungle",
      "kendra",
      "kendrick",
      "kenneth",
      "kevin",
      "kris",
      "lagoon",
      "linda",
      "loquat",
      "lotus",
      "madison",
      "marge",
      "marina",
      "marissa",
      "marsh",
      "marta",
      "maya",
      "mesa",
      "moon",
      "moraine",
      "nicholas",
      "nyles",
      "peak",
      "pearl",
      "petal",
      "phil",
      "rain",
      "rainforest",
      "reba",
      "rex",
      "rick",
      "ritu",
      "river",
      "rob",
      "rodney",
      "rohan",
      "rosco",
      "samantha",
      "sandy",
      "selena",
      "seth",
      "sharon",
      "spore",
      "stan",
      "steppe",
      "stone",
      "storm",
      "stream",
      "summit",
      "talon",
      "tamra",
      "tanya",
      "thunder",
      "tibur",
      "tj",
      "tundra",
      "tyler",
      "violet",
      "viv",
      "wildflower",
      "willow",
      "wolf",
      "yadira",
      "zest",
      "zion",
    ],
  },
  mistv2: {
    eng: [
      "abbie",
      "allison",
      "ally",
      "alona",
      "alpine",
      "amber",
      "ana",
      "antoine",
      "armon",
      "astra",
      "bayou",
      "blaze",
      "blossom",
      "boulder",
      "breeze",
      "brenda",
      "brittany",
      "brook",
      "carol",
      "cedar",
      "colin",
      "courtney",
      "cove",
      "cove_extra",
      "creek",
      "dew",
      "elena",
      "elliot",
      "ember",
      "eucalyptus",
      "eva",
      "falcon",
      "fjord",
      "flower",
      "geoff",
      "gerald",
      "glacier",
      "granite",
      "grove",
      "gulch",
      "gypsum",
      "hank",
      "hawk",
      "helen",
      "hera",
      "iris",
      "ironwood",
      "jen",
      "joe",
      "jose",
      "joy",
      "juan",
      "jungle",
      "karst",
      "kendra",
      "kendrick",
      "kenneth",
      "kevin",
      "kris",
      "lagoon",
      "linda",
      "loquat",
      "lotus",
      "madison",
      "marge",
      "mari",
      "marina",
      "marissa",
      "marlu",
      "marsh",
      "marta",
      "maya",
      "mesa",
      "mesa_extra",
      "moon",
      "moraine",
      "nicholas",
      "nyles",
      "pablo",
      "peak",
      "pearl",
      "petal",
      "phil",
      "rain",
      "rainforest",
      "reba",
      "rex",
      "rick",
      "ritu",
      "river",
      "rob",
      "rodney",
      "rohan",
      "rosco",
      "runton",
      "samantha",
      "sandy",
      "selena",
      "seth",
      "sharon",
      "spore",
      "stan",
      "steppe",
      "stone",
      "storm",
      "stream",
      "summit",
      "talon",
      "tamra",
      "tanya",
      "thunder",
      "tibur",
      "tj",
      "tundra",
      "tyler",
      "violet",
      "viv",
      "wildflower",
      "willow",
      "wolf",
      "yadira",
      "zest",
      "zion",
    ],
    spa: [
      "diego",
      "dolores",
      "isa",
      "jose",
      "lucia",
      "mari",
      "mateo",
      "pablo",
      "sofia",
    ],
    fra: ["alois", "juliette", "marguerite", "simone"],
    ger: ["amalia", "frieda", "karolina", "klaus", "maximilian"],
  },
  arcana: {
    eng: [
      "ahmed_mohamed",
      "albion",
      "andersen_johan",
      "anderson_emily",
      "anderson_jake",
      "anderson_james",
      "anderson_kevin",
      "andromeda",
      "arcade",
      "astra",
      "atrium",
      "bauer_felix",
      "bennett_emily",
      "bennett_ryan",
      "biondi_paul",
      "bond",
      "brooks_jordan",
      "brown_alex",
      "brown_joshua",
      "brown_madison",
      "brown_matthew",
      "brown_steven",
      "bruno_katie",
      "carter_colin",
      "celeste",
      "chatterjee_rini",
      "chen_david",
      "chen_mei",
      "clark_tyler",
      "cohen_emily",
      "cohen_jared",
      "collins_emily",
      "cooper_logan",
      "cupola",
      "das_sourav",
      "davies_james",
      "dela_cristina",
      "diallo_amara",
      "dubois_emma",
      "duncan_colin",
      "duval_pierre",
      "eliphas",
      "estelle",
      "esther",
      "eucalyptus",
      "evans_jason",
      "fern",
      "fernandez_carlos",
      "goldberg_ryan",
      "gomez_daniela",
      "gomez_diego",
      "gomez_isabel",
      "gomez_isabella",
      "gomez_javon",
      "gomez_miguel",
      "gonzalez_maya",
      "gonzalez_michael",
      "gonzalez_ryan",
      "grayson_avery",
      "hanson_ryan",
      "harris_luke",
      "harris_lynette",
      "harrison_brianna",
      "harrison_joey",
      "harrison_mary",
      "hassan_omar",
      "henderson_brittney",
      "hernandez_juanita",
      "holliday_jewel",
      "iyer_arun",
      "jensen_mikkel",
      "johnny_jackson",
      "johnson_angela",
      "johnson_asha",
      "johnson_avery",
      "johnson_brianna",
      "johnson_cynthia",
      "johnson_elijah",
      "johnson_james",
      "johnson_joshua",
      "johnson_latisha",
      "johnson_lisa",
      "johnson_madison",
      "johnson_malachi",
      "johnson_marcel",
      "johnson_mary",
      "johnson_matthew",
      "johnson_melissa",
      "johnson_monique",
      "johnson_nia",
      "johnson_tasha",
      "johnson_tia",
      "johnson_walter",
      "kelly_aoife",
      "kelly_jennifer",
      "kelly_john",
      "kelly_maureen",
      "khan_fatima",
      "khan_umar",
      "kim_ashley",
      "kim_daniel",
      "kim_sunny",
      "kima",
      "lee_sarah",
      "levi_david",
      "levine_emily",
      "levine_joshua",
      "levy_hannah",
      "li_xiao",
      "lintel",
      "luna",
      "lyra",
      "maguire_jason",
      "malik_ahmad",
      "marinelli_giulia",
      "marlu",
      "martinez_amber",
      "martinez_ana",
      "martinez_dylan",
      "martinez_jaime",
      "martinez_leticia",
      "martinez_rosa",
      "martinez_ryan",
      "masonry",
      "mbunda_james",
      "mccarthy_james",
      "mccarthy_teresa",
      "mcdowell_peter",
      "mckinley_robert",
      "mendoza_alonzo",
      "mendoza_jesus",
      "mendoza_luz",
      "merritt_jimmy",
      "miller_cameron",
      "miller_judy",
      "miller_kelsey",
      "miller_lisa",
      "miller_logan",
      "miyamoto_akari",
      "montgomery_elise",
      "montgomery_emily",
      "morgan_brianna",
      "morgan_charles",
      "morris_colin",
      "morris_james",
      "morris_leticia",
      "morris_melvin",
      "morton_daine",
      "moss",
      "moyo_david",
      "murphy_colin",
      "murphy_emily",
      "murphy_grace",
      "murphy_hannah",
      "murphy_liam",
      "murphy_nolan",
      "neal_colin",
      "novak_emily",
      "nowak_joanna",
      "nowak_michal",
      "oculus",
      "olsson_erik",
      "orion",
      "parapet",
      "park_minseo",
      "park_sumin",
      "patel_amit",
      "patel_asha",
      "pham_daniel",
      "pilaster",
      "pola",
      "ramirez_maya",
      "ramos_raul",
      "reddy_arjun",
      "reddy_sunil",
      "ricci_giulia",
      "ricci_lorenzo",
      "rodrigues_miguel",
      "rodriguez_carla",
      "rodriguez_carlos",
      "rodriguez_eduardo",
      "rodriguez_isabela",
      "rodriguez_miguel",
      "rossi_matteo",
      "santos_angelica",
      "schmidt_joshua",
      "schmidt_julia",
      "schmidt_sophie",
      "schneider_eric",
      "schneider_jack",
      "sharma_amit",
      "silva_ana",
      "singh_anjali",
      "sirius",
      "smith_heather",
      "smith_lisa",
      "smith_michael",
      "smith_mike",
      "stucco",
      "tauro",
      "thalassa",
      "thomas_sarah",
      "thompson_kevin",
      "torres_miguel",
      "tran_david",
      "tran_jessica",
      "tran_tu",
      "transom",
      "truss",
      "tupou_leilani",
      "ursa",
      "vashti",
      "vespera",
      "walnut",
      "wang_mei",
      "watson_emily",
      "williams_anna",
      "williams_brian",
      "williams_darnell",
      "williams_jennifer",
      "williams_jordan",
      "williams_ryan",
      "williams_terence",
      "williams_tiffany",
      "wilson_emma",
      "wong_kenny",
      "wright_cooper",
      "wright_jason",
      "wright_julianne",
      "wright_michael",
      "zhang_mei",
    ],
    spa: ["eris", "lark", "nova", "pola", "seraphina", "sirius", "ursa"],
    ger: [
      "bergmann_katharina",
      "lorelei",
      "rosenfeld_steffi",
      "runa",
      "sigurd",
    ],
    fra: [
      "destin",
      "livet_aurelie",
      "morel_marianne",
      "serrin_joseph",
      "solstice",
    ],
    hin: ["aarohi", "avni", "taru", "vyom"],
  },
};

// --- COMPONENTS ---
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

type ProviderType = "elevenlabs" | "rime" | "deepgram";

export default function TTSConfigClient({
  flow,
  initialConfig,
}: {
  flow: IFlow;
  initialConfig?: any;
}) {
  const router = useRouter();
  const { proceedWithAction } = useUnsavedChangesContext();

  const [provider, setProvider] = useState<ProviderType>(
    (initialConfig?.provider as ProviderType) || "elevenlabs"
  );
  const [model, setModel] = useState<string>(
    initialConfig?.model || "eleven_multilingual_v3"
  );
  const [voiceId, setVoiceId] = useState<string>(initialConfig?.voiceId || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "success" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, status: null, title: "", message: "" });

  const isDirty =
    provider !== (initialConfig?.provider || "elevenlabs") ||
    model !== (initialConfig?.model || "eleven_multilingual_v3") ||
    voiceId !== (initialConfig?.voiceId || "");

  useUnsavedChanges(isDirty);

  // --- VALIDATION: Is the current state valid? ---
  const isValid = useMemo(() => {
    if (provider === "deepgram") return true; // Deepgram doesn't need voiceId
    // ElevenLabs and Rime need voiceId
    return voiceId && voiceId.trim().length > 0;
  }, [provider, voiceId]);

  const availableRimeVoices = useMemo(() => {
    if (provider !== "rime") return [];
    const modelVoices = RIME_VOICES[model];
    if (!modelVoices) return [];

    const options: { value: string; label: string; key: string }[] = [];
    Object.entries(modelVoices).forEach(([lang, list]) => {
      const displayLang = LANG_MAP[lang] || lang;
      list.forEach((v, index) => {
        options.push({
          value: v,
          label: `${displayLang} - ${v}`,
          key: `${lang}-${v}-${index}`,
        });
      });
    });
    return options;
  }, [provider, model]);

  const handleNavigation = (path: string) => {
    proceedWithAction(() => {
      router.push(path);
    });
  };

  const handleProviderChange = (newProvider: string) => {
    const p = newProvider as ProviderType;
    setProvider(p);

    if (p === "elevenlabs") {
      setModel(ELEVENLABS_MODELS[0]);
      setVoiceId("");
    } else if (p === "deepgram") {
      setModel(DEEPGRAM_MODELS[0].value);
      setVoiceId("");
    } else if (p === "rime") {
      setModel(RIME_MODELS[0]);
      setVoiceId("");
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (provider === "rime") {
      setVoiceId("");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = {
      provider,
      model,
      voiceId,
    };

    try {
      const result = await saveTTSConfiguration(flow._id, formData);

      if (result.success) {
        setModalState({
          isOpen: true,
          status: "success",
          title: "Configuration Saved",
          message: "TTS settings have been updated.",
        });
        router.refresh();
      } else {
        setModalState({
          isOpen: true,
          status: "error",
          title: "Save Failed",
          message: result.message || "Could not save configuration.",
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

      {/* HEADER */}
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
              <AudioLines className="h-4 w-4 text-indigo-500" />
              TTS
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-10 pb-32">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              TTS Options
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Choose your Text-to-Speech Provider, Model, and Voice.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* 1. PROVIDER */}
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Provider (service)"
                    info="TTS Provider"
                  />
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                    <Select
                      value={provider}
                      onValueChange={handleProviderChange}
                    >
                      <SelectTrigger className="w-full h-12 pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="rime">Rime</SelectItem>
                        <SelectItem value="deepgram">Deepgram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 2. MODEL */}
                <div className="space-y-2">
                  <LabelWithInfo
                    label="Model Name"
                    info="The model for Voice"
                  />
                  <div className="relative">
                    <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                    <Select value={model} onValueChange={handleModelChange}>
                      <SelectTrigger className="w-full h-12 pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {provider === "elevenlabs" &&
                          ELEVENLABS_MODELS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}

                        {provider === "rime" &&
                          RIME_MODELS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}

                        {provider === "deepgram" &&
                          DEEPGRAM_MODELS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    {provider === "deepgram" &&
                      "For Deepgram, the Model selection determines the Voice."}
                  </p>
                </div>

                {/* 3. VOICE ID (Conditional) */}
                {provider !== "deepgram" && (
                  <div className="space-y-2">
                    <LabelWithInfo
                      label="Voice"
                      info={
                        provider === "elevenlabs"
                          ? "Enter your ElevenLabs Voice ID string."
                          : "Select a specific voice for the chosen Rime model."
                      }
                    />

                    {provider === "elevenlabs" && (
                      <div className="relative">
                        <input
                          type="text"
                          value={voiceId}
                          onChange={(e) => setVoiceId(e.target.value)}
                          placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                          className="w-full px-4 h-12 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition dark:text-slate-100"
                        />
                      </div>
                    )}

                    {provider === "rime" && (
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
                        <Select value={voiceId} onValueChange={setVoiceId}>
                          <SelectTrigger className="w-full h-12 pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700">
                            <SelectValue placeholder="Select a Rime voice" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {availableRimeVoices.map((v) => (
                              <SelectItem key={v.key} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleNavigation(`/reseller/flow/${flow._id}`)}
                className="w-full h-12 font-semibold text-base border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                // 🚨 Disable if saving OR no changes OR invalid state
                disabled={isSaving || !isDirty || !isValid}
                className={`w-full h-12 font-semibold text-base transition-all ${
                  !isDirty || !isValid
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
