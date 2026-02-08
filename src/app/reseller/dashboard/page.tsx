"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { Clock, Smile, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Dashboard components
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeroChart } from "@/components/dashboard/HeroChart";
import { InteractionsTable } from "@/components/dashboard/InteractionsTable";

// Hook from src/hooks (global hooks folder)
import { useDashboardData } from "@/hooks/useDashboardData";

// Types

export default function DashboardPage() {
  const { data, loading, filter, setFilter } = useDashboardData();

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      <main className="w-full overflow-y-auto bg-gray-50/50">
        {/* Header */}
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

            {/* Filter Pills */}
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

        {/* Main Content */}
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
              {/* Metric Cards */}
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

              {/* Hero Chart */}
              <div className="w-full">
                <HeroChart data={data} loading={loading} />
              </div>

              {/* Interactions Table */}
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
