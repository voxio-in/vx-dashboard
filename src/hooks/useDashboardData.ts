import { useState, useEffect } from "react";
import {
  format,
  subDays,
  subMonths,
  addDays,
  differenceInDays,
} from "date-fns";
import { toast } from "sonner";
import { FilterType, DashboardData } from "@/components/dashboard/types";
import { FLOW_NAMES } from "@/components/dashboard/constants";

// Mock Data Generator
const getDashboardData = async (
  startDate: string,
  endDate: string,
): Promise<DashboardData> => {
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

    return {
      id: `id-${i}`,
      type: i % 2 === 0 ? "Voice" : "Chat",
      flowName: FLOW_NAMES[i % FLOW_NAMES.length],
      startTime: format(startTime, "MMM dd, HH:mm"),
      endTime: format(endTime, "MMM dd, HH:mm"),
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

export const useDashboardData = () => {
  const [filter, setFilter] = useState<FilterType>("7d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [filter]);

  return { data, loading, filter, setFilter };
};
