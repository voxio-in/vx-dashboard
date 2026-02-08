"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  format,
  subDays,
  subMonths,
  addDays,
  differenceInDays,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Clock,
  Smile,
  Search,
  ChevronLeft,
  ChevronRight,
  Mic,
  MessageCircle,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  ChevronDown,
  X,
  FileText,
  Video,
  Settings,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data Generator
const getDashboardData = async (startDate: string, endDate: string) => {
  await new Promise((res) => setTimeout(res, 1000));

  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = differenceInDays(end, start) + 1;

  const chartData = Array.from({ length: daysDiff }).map((_, i) => {
    const date = addDays(start, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "MMM dd"),
      value: Math.floor(Math.random() * 50) + 10,
      sessions: Math.floor(Math.random() * 30) + 5,
    };
  });

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const avgSession = Math.floor(
    chartData.reduce((acc, curr) => acc + curr.sessions, 0) / chartData.length,
  );

  const interactions = Array.from({ length: 45 }).map((_, i) => {
    const startTime = subDays(end, i % 10);
    const sessionSeconds = Math.floor(Math.random() * 900) + 60;
    const connectedSeconds = Math.floor(
      sessionSeconds * (0.6 + Math.random() * 0.35),
    );
    const endTime = addDays(startTime, 0);
    endTime.setSeconds(startTime.getSeconds() + sessionSeconds);

    const sessionMinutes = Math.ceil(sessionSeconds / 60);
    const connectedMinutes = Math.ceil(connectedSeconds / 60);

    const aiSeconds = Math.floor(
      connectedSeconds * (0.55 + Math.random() * 0.25),
    );
    const humanSeconds = connectedSeconds - aiSeconds;
    const aiMinutes = Math.ceil(aiSeconds / 60);
    const humanMinutes = Math.ceil(humanSeconds / 60);

    const flowNames = [
      "Customer Support",
      "Sales Bot",
      "Booking Assistant",
      "Tech Support",
      "FAQ Handler",
      "Lead Qualification",
      "Appointment Scheduler",
      "Order Status",
    ];

    return {
      id: `id-${i}`,
      type: i % 2 === 0 ? "Voice" : "Chat",
      flowName: flowNames[i % flowNames.length],
      startTime: format(startTime, "MMM dd, HH:mm"),
      endTime: format(endTime, "HH:mm"),
      sessionDuration: `${sessionMinutes} min`,
      timeConnected: `${connectedMinutes} min`,
      totalAiTime: `${aiMinutes} min`,
      totalHumanTime: `${humanMinutes} min`,
      hasTranscription: i % 3 !== 0,
      hasRecording: i % 2 === 0,
      timeRatio: Math.round((connectedSeconds / sessionSeconds) * 100),
      tokenRatio: Math.floor(Math.random() * 500) + 100,
      aiTokens: Math.floor(Math.random() * 2000) + 500,
    };
  });

  return {
    metrics: {
      total,
      avgDuration: "04:12",
      score: 8.4,
      activeUsers: avgSession,
      successRate: 92,
      avgResponse: "1.2s",
    },
    chartData,
    interactions,
  };
};

type FilterType = "7d" | "30d" | "3m" | "custom";
type Interaction = {
  id: string;
  type: string;
  flowName: string;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  timeConnected: string;
  totalAiTime: string;
  totalHumanTime: string;
  hasTranscription: boolean;
  hasRecording: boolean;
  timeRatio: number;
  tokenRatio: number;
  aiTokens: number;
};

interface CardProps {
  className?: string;
  children: React.ReactNode;
  gradient?: boolean;
}

const Card = ({ className, children, gradient = false }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={cn(
      "rounded-2xl border bg-white shadow-sm transition-all",
      gradient
        ? "border-transparent bg-gradient-to-br from-teal-500 to-emerald-500 text-white"
        : "border-gray-200/60",
      className,
    )}
  >
    {children}
  </motion.div>
);

interface ButtonProps {
  className?: string;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  className,
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50",
        variants[variant],
        size === "sm" ? "px-3 py-2 text-xs" : "px-6 py-3 text-sm",
        className,
      )}
    >
      {children}
    </motion.button>
  );
};

const Badge = ({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant: string;
  className?: string;
}) => {
  const styles: any = {
    teal: "bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/20",
    blue: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20",
    orange: "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20",
    red: "bg-red-500/10 text-red-600 ring-1 ring-red-500/20",
    green: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
    gray: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[variant] || styles.gray,
        className,
      )}
    >
      {children}
    </span>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-xl bg-gray-200/50", className)} />
);

// ----------------------------------------------------------------------------
// Header Tooltip Component
// ----------------------------------------------------------------------------
const HeaderTooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center gap-1.5"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl z-50 border border-gray-700/50"
            style={{ marginLeft: "-10px" }}
          >
            <div className="font-medium leading-relaxed">{content}</div>
            <div className="absolute left-4 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  sparklineData,
  loading,
}: any) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all group cursor-pointer overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                  {change && (
                    <span
                      className={cn(
                        "text-xs font-semibold flex items-center gap-1",
                        trend === "up" ? "text-emerald-600" : "text-red-600",
                      )}
                    >
                      {trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {change}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 group-hover:from-teal-500/20 group-hover:to-emerald-500/20 transition-all">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
        </div>

        {sparklineData && !loading && (
          <div className="h-12 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

const HeroChart = ({ data, loading }: any) => {
  if (loading) return <Skeleton className="h-full w-full" />;

  return (
    <Card className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Interaction Volume
          </h2>
          <p className="text-sm text-gray-500">
            Real-time activity across all channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="green" className="gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.chartData}>
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
              cursor={{
                stroke: "#14b8a6",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#heroGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-xs font-medium text-gray-600">
            Total Sessions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-gray-600">Active Now</span>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// INTERACTIVE TABLE
// ============================================================================

// Updated columns with Descriptions
const ALL_COLUMNS = [
  {
    key: "startTime",
    label: "Start Time",
    fixed: false,
    description: "The date and time when the interaction began.",
  },
  {
    key: "endTime",
    label: "End Time",
    fixed: false,
    description: "The timestamp when the session ended.",
  },
  {
    key: "sessionDuration",
    label: "Duration",
    fixed: false,
    description: "Total elapsed time of the session from start to finish.",
  },
  {
    key: "timeConnected",
    label: "Connected",
    fixed: false,
    description: "Time spent actively connected to a human or AI agent.",
  },
  {
    key: "totalAiTime",
    label: "AI Time",
    fixed: false,
    description: "Duration where the AI was speaking or processing.",
  },
  {
    key: "totalHumanTime",
    label: "Human",
    fixed: false,
    description: "Duration where the human participant was speaking.",
  },
  {
    key: "transcription",
    label: "Trans.",
    fixed: false,
    description: "Availability of the text transcript for this session.",
  },
  {
    key: "recording",
    label: "Rec.",
    fixed: false,
    description: "Availability of the audio recording.",
  },
  {
    key: "timeRatio",
    label: "Ratio %",
    fixed: false,
    description:
      "Percentage of total session time spent in active conversation.",
  },
  {
    key: "tokenRatio",
    label: "Tokens",
    fixed: false,
    description: "Efficiency score based on tokens used vs duration.",
  },
  {
    key: "aiTokens",
    label: "AI Tok.",
    fixed: false,
    description: "Total LLM tokens consumed by the AI during this session.",
  },
];

const InteractionsTable = ({ data, loading }: any) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((col) => col.key),
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Interaction;
    direction: "asc" | "desc";
  } | null>(null);

  const pageSize = 6;

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
                        <div className="p-2 space-y-1">
                          {ALL_COLUMNS.map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
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

            <Button variant="primary" size="sm" onClick={handleGlobalSort}>
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
                  {["All", "Voice", "Chat"].map((type) => (
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

      {/* Table with horizontal scroll */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="relative">
            <table className="min-w-full">
              <thead className="bg-gray-50/50 sticky top-0 z-10">
                <tr>
                  {/* Fixed: Type (Width Fixed to 72px) */}
                  <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left w-[72px] min-w-[72px]">
                    <HeaderTooltip content="Communication channel (Voice or Chat)">
                      <div className="flex items-center gap-1.5 cursor-help">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg transition-all bg-gray-100 flex items-center justify-center",
                          )}
                        >
                          <Activity className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </HeaderTooltip>
                  </th>

                  {/* Fixed: Flow Name (Positioned exactly at 72px) with Border instead of Shadow */}
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

                  {/* Scrollable columns - Loop through ALL_COLUMNS based on visibility */}
                  {ALL_COLUMNS.map((col: any) =>
                    visibleColumns.includes(col.key) ? (
                      <th key={col.key} className="px-4 py-3 text-left">
                        <HeaderTooltip content={col.description}>
                          {["transcription", "recording"].includes(col.key) ? (
                            // Non-sortable headers
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-help">
                              {col.label}
                            </span>
                          ) : (
                            // Sortable headers
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
                      <td
                        colSpan={13 + (visibleColumns.length > 0 ? 1 : 0)}
                        className="px-4 py-3"
                      >
                        <Skeleton className="h-12 w-full" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13 + (visibleColumns.length > 0 ? 1 : 0)}
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
                        {/* Fixed: Type Icon */}
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

                        {/* Fixed: Flow Name */}
                        <td className="sticky left-[72px] z-10 bg-white group-hover:bg-gray-50 px-4 py-3 border-r border-gray-100">
                          <span className="text-sm font-medium text-gray-900">
                            {item.flowName}
                          </span>
                        </td>

                        {/* Scrollable columns */}
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

                        {/* Fixed: Actions */}
                        <td className="sticky right-0 z-10 bg-white group-hover:bg-gray-50 px-4 py-3 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-all"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
    </Card>
  );
};

export default function ModernDashboard() {
  const [filter, setFilter] = useState<FilterType>("7d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const today = new Date();
      let from = format(subDays(today, 7), "yyyy-MM-dd");

      if (filter === "30d") from = format(subDays(today, 30), "yyyy-MM-dd");
      if (filter === "3m") from = format(subMonths(today, 3), "yyyy-MM-dd");

      try {
        const res = await getDashboardData(from, format(today, "yyyy-MM-dd"));
        setData(res);
      } catch (e) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filter]);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      <main className="w-full overflow-y-auto bg-gray-50/50">
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Last updated: {format(new Date(), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                {(["7d", "30d", "3m"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all relative",
                      filter === f
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-900",
                    )}
                  >
                    {filter === f && (
                      <motion.div
                        layoutId="filter-pill"
                        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-lg shadow-teal-500/30"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">
                      {f === "7d"
                        ? "7 Days"
                        : f === "30d"
                          ? "30 Days"
                          : "3 Months"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Total Interactions"
                  value={loading ? "..." : data?.metrics.total}
                  change="+12.5%"
                  trend="up"
                  icon={Activity}
                  sparklineData={data?.chartData.slice(-7)}
                  loading={loading}
                />
                <MetricCard
                  title="Avg Duration"
                  value={loading ? "..." : data?.metrics.avgDuration}
                  change="-5s"
                  trend="down"
                  icon={Clock}
                  sparklineData={data?.chartData.slice(-7)}
                  loading={loading}
                />
                <MetricCard
                  title="Satisfaction Score"
                  value={loading ? "..." : data?.metrics.score}
                  change="+0.2"
                  trend="up"
                  icon={Smile}
                  sparklineData={data?.chartData.slice(-7)}
                  loading={loading}
                />
              </div>

              <div className="w-full">
                <HeroChart data={data} loading={loading} />
              </div>

              <div className="w-full">
                <InteractionsTable data={data} loading={loading} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
