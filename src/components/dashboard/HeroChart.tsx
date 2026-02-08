import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Badge } from "../ui/dashboard-components";
import { cn } from "@/lib/utils";
import { DashboardData } from "./types";

interface HeroChartProps {
  data: DashboardData | null;
  loading: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-xl bg-gray-200/50", className)} />
);

export const HeroChart: React.FC<HeroChartProps> = ({ data, loading }) => {
  if (loading) return <Skeleton className="h-full w-full" />;

  const chartData = data?.chartData ?? [];

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
          <AreaChart data={chartData}>
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
