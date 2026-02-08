import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Card } from "../ui/dashboard-components";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  sparklineData?: any[];
  loading?: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-xl bg-gray-200/50", className)} />
);

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  sparklineData,
  loading,
}) => {
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
