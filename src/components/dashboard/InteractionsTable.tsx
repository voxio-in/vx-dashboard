import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mic,
  MessageCircle,
  ArrowUpDown,
  Activity,
  Filter,
  ChevronDown,
  X,
  FileText,
  Video,
  Copy,
  Settings,
  MoreVertical,
} from "lucide-react";
import { Card, Button } from "../ui/dashboard-components";
import { cn } from "@/lib/utils";
import { HeaderTooltip } from "./HeaderTooltip";
import { DashboardData, Interaction } from "./types";
import { ALL_COLUMNS, TYPE_FILTERS } from "./constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-xl bg-gray-200/50", className)} />
);

interface InteractionsTableProps {
  data: DashboardData | null;
  loading: boolean;
}

export const InteractionsTable: React.FC<InteractionsTableProps> = ({
  data,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedInteraction, setSelectedInteraction] =
    useState<Interaction | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((col) => col.key),
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Interaction;
    direction: "asc" | "desc";
  } | null>(null);

  const pageSize = 6;
  const totalColumns = visibleColumns.length + 3;

  const formatTimestamp = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCopyTranscription = () => {
    if (!selectedInteraction?.transcription?.length) {
      toast.error("No transcription to copy");
      return;
    }

    const lines = selectedInteraction.transcription.map((item) => {
      const role = item.role?.toLowerCase() || "assistant";
      const roleLabel =
        role === "assistant" || role === "bot" || role === "ai"
          ? "Assistant"
          : "User";
      const timeLabel = formatTimestamp(item.timestamp);
      const prefix = timeLabel ? `[${timeLabel}] ` : "";
      return `${prefix}${roleLabel}: ${item.content || ""}`.trim();
    });

    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => toast.success("Copied transcript to clipboard"))
      .catch(() => toast.error("Failed to copy transcript"));
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const processedData = useMemo(() => {
    if (!data?.interactions) return [];

    let filtered = data.interactions.filter((item: Interaction) => {
      const matchesSearch =
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.flowName.toLowerCase().includes(search.toLowerCase()) ||
        item.startTime.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });

    if (sortConfig) {
      filtered.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortConfig, typeFilter]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSort = (key: keyof Interaction) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleGlobalSort = () => {
    handleSort("startTime");
    toast.success("Sorted by start time");
  };

  const getTypeIcon = (type: string) => {
    const config: any = {
      Voice: { icon: Mic, color: "teal" },
      Chat: { icon: MessageCircle, color: "blue" },
    };
    return config[type] || config.Voice;
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Recent Interactions
            </h2>
            <p className="text-sm text-gray-500">
              {processedData.length} total results
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Column Customizer Dropdown */}
            <div className="relative">
              <Button
                variant={isColumnDropdownOpen ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Columns
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    isColumnDropdownOpen && "rotate-180",
                  )}
                />
              </Button>

              <AnimatePresence>
                {isColumnDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsColumnDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Customize Columns
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Select columns to display
                        </p>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        <div className="p-3 space-y-2">
                          {ALL_COLUMNS.map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={visibleColumns.includes(col.key)}
                                onChange={() => toggleColumn(col.key)}
                                className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                              />
                              <span className="text-sm text-gray-700">
                                {col.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() =>
                            setVisibleColumns(ALL_COLUMNS.map((c) => c.key))
                          }
                          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => setVisibleColumns([])}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search interactions..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-64"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Button
              variant={isFilterOpen ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(isFilterOpen && "bg-gray-200")}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGlobalSort}
              className="gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">
                  Filter by Type:
                </span>
                <div className="flex items-center gap-2">
                  {TYPE_FILTERS.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setTypeFilter(type);
                        setPage(1);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        typeFilter === type
                          ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {type}
                    </button>
                  ))}
                  {typeFilter !== "All" && (
                    <button
                      onClick={() => setTypeFilter("All")}
                      className="ml-2 p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="relative">
            <table className="min-w-full">
              <thead className="bg-gray-50/50 sticky top-0 z-10">
                <tr>
                  {/* Fixed: Type */}
                  <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left w-[72px] min-w-[72px]">
                    <HeaderTooltip content="Communication channel (Voice or Chat)">
                      <div className="flex items-center gap-1.5 cursor-help">
                        <div className="w-8 h-8 rounded-lg transition-all bg-gray-100 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </HeaderTooltip>
                  </th>

                  {/* Fixed: Flow Name */}
                  <th className="sticky left-[72px] z-20 bg-gray-50 px-4 py-3 text-left border-r border-gray-200/60">
                    <HeaderTooltip content="The specific AI agent workflow handling the interaction.">
                      <button
                        onClick={() => handleSort("flowName")}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-teal-600"
                      >
                        <span>Flow Name</span>
                        <ArrowUpDown
                          className={cn(
                            "w-3 h-3 transition-opacity",
                            sortConfig?.key === "flowName"
                              ? "opacity-100"
                              : "opacity-30",
                          )}
                        />
                      </button>
                    </HeaderTooltip>
                  </th>

                  {/* Scrollable columns */}
                  {ALL_COLUMNS.map((col: any) =>
                    visibleColumns.includes(col.key) ? (
                      <th key={col.key} className="px-4 py-3 text-left">
                        <HeaderTooltip content={col.description}>
                          {["transcription", "recording"].includes(col.key) ? (
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-help">
                              {col.label}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSort(col.key)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-teal-600"
                            >
                              <span>{col.label}</span>
                              <ArrowUpDown
                                className={cn(
                                  "w-3 h-3 transition-opacity",
                                  sortConfig?.key === col.key
                                    ? "opacity-100"
                                    : "opacity-30",
                                )}
                              />
                            </button>
                          )}
                        </HeaderTooltip>
                      </th>
                    ) : null,
                  )}

                  {/* Fixed: Actions */}
                  <th className="sticky right-0 z-20 bg-gray-50 px-4 py-3 text-left shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <HeaderTooltip content="Manage this interaction">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-help">
                        Actions
                      </span>
                    </HeaderTooltip>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={totalColumns} className="px-4 py-3">
                        <Skeleton className="h-12 w-full" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={totalColumns}
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          No interactions found
                        </h3>
                        <p className="text-sm text-gray-500">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item: Interaction) => {
                    const { icon: Icon, color } = getTypeIcon(item.type);

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        {/* Type Icon */}
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 px-4 py-3 w-[72px] min-w-[72px]">
                          <div
                            className={cn(
                              "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                              color === "teal"
                                ? "bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/20"
                                : color === "blue"
                                  ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20"
                                  : "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        </td>

                        {/* Flow Name */}
                        <td className="sticky left-[72px] z-10 bg-white group-hover:bg-gray-50 px-4 py-3 border-r border-gray-100">
                          <span className="text-sm font-medium text-gray-900">
                            {item.flowName}
                          </span>
                        </td>

                        {/* Dynamic columns */}
                        {visibleColumns.includes("startTime") && (
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {item.startTime}
                          </td>
                        )}

                        {visibleColumns.includes("endTime") && (
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {item.endTime}
                          </td>
                        )}

                        {visibleColumns.includes("sessionDuration") && (
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {item.sessionDuration}
                          </td>
                        )}

                        {visibleColumns.includes("timeConnected") && (
                          <td className="px-4 py-3 text-sm text-teal-600 font-medium whitespace-nowrap">
                            {item.timeConnected}
                          </td>
                        )}

                        {visibleColumns.includes("totalAiTime") && (
                          <td className="px-4 py-3 text-sm text-purple-600 font-medium whitespace-nowrap">
                            {item.totalAiTime}
                          </td>
                        )}

                        {visibleColumns.includes("totalHumanTime") && (
                          <td className="px-4 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">
                            {item.totalHumanTime}
                          </td>
                        )}

                        {visibleColumns.includes("transcription") && (
                          <td className="px-4 py-3">
                            <button
                              className={cn(
                                "p-1.5 rounded-lg transition-all",
                                item.hasTranscription
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                  : "bg-gray-50 text-gray-300 cursor-not-allowed",
                              )}
                              disabled={!item.hasTranscription}
                              onClick={() =>
                                item.hasTranscription &&
                                setSelectedInteraction(item)
                              }
                              title={
                                item.hasTranscription
                                  ? "View transcription"
                                  : "No transcription available"
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        )}

                        {visibleColumns.includes("recording") && (
                          <td className="px-4 py-3">
                            <button
                              className={cn(
                                "p-1.5 rounded-lg transition-all",
                                item.hasRecording
                                  ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                  : "bg-gray-50 text-gray-300 cursor-not-allowed",
                              )}
                              disabled={!item.hasRecording}
                              title={
                                item.hasRecording
                                  ? "View recording"
                                  : "No recording available"
                              }
                            >
                              <Video className="w-4 h-4" />
                            </button>
                          </td>
                        )}

                        {visibleColumns.includes("timeRatio") && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                                <div
                                  className={cn(
                                    "h-2 rounded-full transition-all",
                                    item.timeRatio >= 80
                                      ? "bg-emerald-500"
                                      : item.timeRatio >= 50
                                        ? "bg-teal-500"
                                        : "bg-orange-500",
                                  )}
                                  style={{ width: `${item.timeRatio}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 min-w-[40px]">
                                {item.timeRatio}%
                              </span>
                            </div>
                          </td>
                        )}

                        {visibleColumns.includes("tokenRatio") && (
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-600">
                              {item.tokenRatio}
                            </span>
                          </td>
                        )}

                        {visibleColumns.includes("aiTokens") && (
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.aiTokens.toLocaleString()}
                            </span>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="sticky right-0 z-10 bg-white group-hover:bg-gray-50 px-4 py-3 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
                              title="More actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!loading && paginatedData.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * pageSize, processedData.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {processedData.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                    page === pageNum
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30"
                      : "hover:bg-gray-100 text-gray-600",
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Transcription Dialog - Chat Style */}
      <Dialog
        open={!!selectedInteraction}
        onOpenChange={(open) => !open && setSelectedInteraction(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Conversation Transcript
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedInteraction?.flowName} •{" "}
                  {selectedInteraction?.startTime}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTranscription}
                className="gap-2"
                disabled={!selectedInteraction?.transcription?.length}
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
            {selectedInteraction?.transcription &&
            selectedInteraction.transcription.length > 0 ? (
              selectedInteraction.transcription.map((item, index) => {
                const role = item.role?.toLowerCase() || "assistant";
                const isAssistant =
                  role === "assistant" || role === "bot" || role === "ai";
                const timeLabel = formatTimestamp(item.timestamp);

                return (
                  <div
                    key={`${role}-${index}`}
                    className={cn(
                      "flex w-full",
                      isAssistant ? "justify-start" : "justify-end",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                        isAssistant
                          ? "bg-white text-gray-800 border border-gray-200"
                          : "bg-gradient-to-br from-teal-500 to-emerald-500 text-white",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                          {isAssistant ? "🤖 Assistant" : "👤 User"}
                        </span>
                        {timeLabel && (
                          <span className="text-[10px] opacity-50">
                            {timeLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {item.content || "—"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">
                  No transcription available for this session.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
