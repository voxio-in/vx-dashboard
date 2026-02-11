import { NextResponse } from "next/server";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Session from "@/features/dashboard/model";
import Flow from "@/features/flow/model";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const safeNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const totalMinutes = safeSeconds / 60;

  if (totalMinutes < 1) return "1 min";

  if (totalMinutes < 60) {
    const mins = Math.round(totalMinutes);
    return `${mins} min`;
  }

  if (totalMinutes < 1440) {
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    return `${hours} hrs`;
  }

  if (totalMinutes < 43200) {
    const days = Math.round((totalMinutes / 1440) * 10) / 10;
    return `${days} days`;
  }

  if (totalMinutes < 525600) {
    const months = Math.round((totalMinutes / 43200) * 10) / 10;
    return `${months} months`;
  }

  const years = Math.round((totalMinutes / 525600) * 10) / 10;
  return `${years} years`;
};

const titleCase = (value: string) => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const isObjectIdLike = (value: string) => /^[a-fA-F0-9]{24}$/.test(value);

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "string") {
    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) return direct;

    const trimmed = value.replace(/(\.\d{3})\d+/, "$1");
    const normalized = new Date(trimmed);
    if (!Number.isNaN(normalized.getTime())) return normalized;

    if (!/([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)) {
      const withZ = new Date(`${trimmed}Z`);
      if (!Number.isNaN(withZ.getTime())) return withZ;
    }
  }
  return null;
};

const getDateOrFallback = (value: any, fallback: Date | null) => {
  const parsed = parseDate(value);
  return parsed ?? fallback;
};

const getSessionStart = (session: any) =>
  getDateOrFallback(
    session.startTime,
    getDateOrFallback(session.createdAt, null),
  );

const getSessionEnd = (session: any) =>
  getDateOrFallback(session.endTime, null);

const filterSessionsByDate = (sessions: any[], start: Date, end: Date) =>
  sessions.filter((session: any) => {
    const sessionStart = getSessionStart(session);
    return sessionStart ? sessionStart >= start && sessionStart <= end : false;
  });

const roundTo1 = (value: number) => Math.round(value * 10) / 10;

const calculateChange = (current: number, previous: number) => {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return roundTo1(((current - previous) / previous) * 100);
};

const summarizeSessions = (
  sessions: any[],
  sessionToFlowName: Map<string, string>,
) => {
  const total = sessions.length;
  let totalDurationSeconds = 0;
  let totalConnectedSeconds = 0;
  let totalTimeRatio = 0;
  let transcriptCount = 0;
  const flowNames = new Set<string>();

  for (const session of sessions) {
    const start = getSessionStart(session);
    const end = getSessionEnd(session);
    const durationSeconds =
      start && end
        ? Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000))
        : 0;

    totalDurationSeconds += durationSeconds;

    const connectedSeconds = safeNumber(session.totalConnectedTime);
    totalConnectedSeconds += connectedSeconds;

    const timeRatio =
      durationSeconds > 0
        ? Math.min(
            100,
            Math.max(0, Math.round((connectedSeconds / durationSeconds) * 100)),
          )
        : 0;
    totalTimeRatio += timeRatio;

    if (
      Array.isArray(session.transcription) &&
      session.transcription.length > 0
    ) {
      transcriptCount += 1;
    }

    const flowName = sessionToFlowName.get(session._id.toString()) || "Unknown";
    if (flowName && flowName !== "Unknown") {
      flowNames.add(flowName);
    }
  }

  const avgDurationSeconds =
    total > 0 ? Math.round(totalDurationSeconds / total) : 0;
  const avgTimeRatio = total > 0 ? Math.round(totalTimeRatio / total) : 0;
  const successRate =
    total > 0 ? Math.round((transcriptCount / total) * 100) : 0;
  const score = total > 0 ? Math.round((avgTimeRatio / 10) * 10) / 10 : 0;

  return {
    total,
    totalDurationSeconds,
    totalConnectedSeconds,
    avgDurationSeconds,
    avgTimeRatio,
    successRate,
    score,
    activeUsers: flowNames.size,
  };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const today = new Date();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromRaw = fromParam ? new Date(fromParam) : subDays(today, 7);
  const toRaw = toParam ? new Date(toParam) : today;

  if (Number.isNaN(fromRaw.getTime()) || Number.isNaN(toRaw.getTime())) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const fromDate = startOfDay(fromRaw);
  const toDate = endOfDay(toRaw);

  const rangeDays = differenceInCalendarDays(toDate, fromDate) + 1;
  const previousFromDate = startOfDay(subDays(fromDate, rangeDays));
  const previousToDate = endOfDay(subDays(fromDate, 1));

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const flowIds = (user.flows || []).map((id: any) => id.toString());
  const flows = await Flow.find({ _id: { $in: flowIds } })
    .select({ name: 1, sessions: 1 })
    .lean();

  const sessionRefs = flows.flatMap((flow: any) =>
    Array.isArray(flow.sessions)
      ? flow.sessions.map((id: any) => id.toString())
      : [],
  );

  const sessionObjectIds = sessionRefs
    .filter(isObjectIdLike)
    .map((id) => new mongoose.Types.ObjectId(id));

  const days = eachDayOfInterval({ start: fromDate, end: toDate });

  if (sessionObjectIds.length === 0) {
    const emptyChart = days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      label: format(day, "MMM dd"),
      value: 0,
      sessions: 0,
    }));

    return NextResponse.json({
      metrics: {
        total: 0,
        avgDuration: "0 min",
        score: 0,
        activeUsers: 0,
        successRate: 0,
        avgResponse: "0s",
        totalSessionDuration: "0 min",
        totalConnectedDuration: "0 min",
      },
      metricChanges: {
        total: 0,
        avgDuration: 0,
        totalSessionDuration: 0,
        totalConnectedDuration: 0,
      },
      chartData: emptyChart,
      interactions: [],
    });
  }

  let sessions = await Session.find({
    _id: { $in: sessionObjectIds },
    startTime: { $gte: previousFromDate, $lte: toDate },
  }).lean();

  if (sessions.length === 0) {
    sessions = await Session.find({
      _id: { $in: sessionObjectIds },
    }).lean();
  }

  const sessionToFlowName = new Map<string, string>();
  for (const flow of flows) {
    if (!Array.isArray(flow.sessions)) continue;
    for (const sid of flow.sessions) {
      const key = sid.toString();
      if (!sessionToFlowName.has(key)) {
        sessionToFlowName.set(key, flow.name);
      }
    }
  }

  const currentSessions = filterSessionsByDate(sessions, fromDate, toDate);
  const previousSessions = filterSessionsByDate(
    sessions,
    previousFromDate,
    previousToDate,
  );

  const counts = new Map<string, number>();
  const interactions = currentSessions
    .map((session: any) => {
      const start = getSessionStart(session);
      const end = getSessionEnd(session);

      const startKey = start ? format(start, "yyyy-MM-dd") : null;
      if (startKey) {
        counts.set(startKey, (counts.get(startKey) || 0) + 1);
      }

      const durationSeconds =
        start && end
          ? Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000))
          : 0;

      const connectedSeconds = safeNumber(session.totalConnectedTime);
      const aiSeconds = safeNumber(session.totalAiTime);
      const humanSeconds = safeNumber(session.totalHumanTime);

      const timeRatio =
        durationSeconds > 0
          ? Math.min(
              100,
              Math.max(
                0,
                Math.round((connectedSeconds / durationSeconds) * 100),
              ),
            )
          : 0;

      const tokenRatioRaw =
        typeof session.tokenRatio === "number"
          ? session.tokenRatio
          : typeof session.totkenRatio === "number"
            ? session.totkenRatio
            : 0;
      const tokenRatio = Math.round(tokenRatioRaw * 1000) / 1000;

      return {
        id: session._id.toString(),
        type: titleCase(session.type || "voice"),
        flowName: sessionToFlowName.get(session._id.toString()) || "Unknown",
        startTime: start ? format(start, "MMM dd, HH:mm") : "—",
        endTime: end ? format(end, "MMM dd, HH:mm") : "—",
        sessionDuration: formatDuration(durationSeconds),
        timeConnected: formatDuration(connectedSeconds),
        totalAiTime: formatDuration(aiSeconds),
        totalHumanTime: formatDuration(humanSeconds),
        hasTranscription:
          Array.isArray(session.transcription) &&
          session.transcription.length > 0,
        hasRecording: Boolean(session.recordingUrl),
        timeRatio,
        tokenRatio,
        humanTokens: safeNumber(session.humanTokens),
        aiTokens: safeNumber(session.aiTokens),
        transcription: Array.isArray(session.transcription)
          ? session.transcription.map((item: any) => {
              const transcriptTime = parseDate(item?.timestamp);
              return {
                role: item?.role || "assistant",
                content: item?.content || "",
                timestamp: transcriptTime
                  ? transcriptTime.toISOString()
                  : undefined,
              };
            })
          : [],
        _sort: start ? start.getTime() : 0,
      };
    })
    .sort((a, b) => b._sort - a._sort)
    .map(({ _sort, ...rest }) => rest);

  const chartData = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const count = counts.get(key) || 0;
    return {
      date: key,
      label: format(day, "MMM dd"),
      value: count,
      sessions: count,
    };
  });

  const currentSummary = summarizeSessions(currentSessions, sessionToFlowName);
  const previousSummary = summarizeSessions(
    previousSessions,
    sessionToFlowName,
  );
  const metricChanges = {
    total: calculateChange(currentSummary.total, previousSummary.total),
    avgDuration: calculateChange(
      currentSummary.avgDurationSeconds,
      previousSummary.avgDurationSeconds,
    ),
    totalSessionDuration: calculateChange(
      currentSummary.totalDurationSeconds,
      previousSummary.totalDurationSeconds,
    ),
    totalConnectedDuration: calculateChange(
      currentSummary.totalConnectedSeconds,
      previousSummary.totalConnectedSeconds,
    ),
  };

  return NextResponse.json({
    metrics: {
      total: currentSummary.total,
      avgDuration: formatDuration(currentSummary.avgDurationSeconds),
      score: currentSummary.score,
      activeUsers: currentSummary.activeUsers,
      successRate: currentSummary.successRate,
      avgResponse: "0s",
      totalSessionDuration: formatDuration(currentSummary.totalDurationSeconds),
      totalConnectedDuration: formatDuration(
        currentSummary.totalConnectedSeconds,
      ),
    },
    metricChanges,
    chartData,
    interactions,
  });
}
