import { NextResponse } from "next/server";
import {
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

  const mins = Math.ceil(safeSeconds / 60);

  if (mins === 0) return "1 min";
  return `${mins} min`;
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
        avgDuration: "0s",
        score: 0,
        activeUsers: 0,
        successRate: 0,
        avgResponse: "0s",
      },
      chartData: emptyChart,
      interactions: [],
    });
  }

  let sessions = await Session.find({
    _id: { $in: sessionObjectIds },
    startTime: { $gte: fromDate, $lte: toDate },
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

  const filteredSessions = sessions.filter((session: any) => {
    const start = getDateOrFallback(
      session.startTime,
      getDateOrFallback(session.createdAt, null),
    );
    if (!start) return false;
    return start >= fromDate && start <= toDate;
  });

  const counts = new Map<string, number>();
  const interactions = filteredSessions
    .map((session: any) => {
      const start = getDateOrFallback(
        session.startTime,
        getDateOrFallback(session.createdAt, null),
      );
      const end = getDateOrFallback(session.endTime, null);

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

  const total = interactions.length;
  const totalDurationSeconds = filteredSessions.reduce(
    (acc: number, session: any) => {
      const start = getDateOrFallback(
        session.startTime,
        getDateOrFallback(session.createdAt, null),
      );
      const end = getDateOrFallback(session.endTime, null);
      if (!start || !end) return acc;
      const diff = Math.max(
        0,
        Math.round((end.getTime() - start.getTime()) / 1000),
      );
      return acc + diff;
    },
    0,
  );

  const avgDurationSeconds =
    total > 0 ? Math.round(totalDurationSeconds / total) : 0;
  const avgTimeRatio =
    total > 0
      ? Math.round(
          interactions.reduce((acc, item) => acc + item.timeRatio, 0) / total,
        )
      : 0;

  const uniqueFlows = new Set(
    interactions
      .map((item) => item.flowName)
      .filter((name) => name && name !== "Unknown"),
  ).size;

  const successRate =
    total > 0
      ? Math.round(
          (interactions.filter((item) => item.hasTranscription).length /
            total) *
            100,
        )
      : 0;

  const score = total > 0 ? Math.round((avgTimeRatio / 10) * 10) / 10 : 0;

  return NextResponse.json({
    metrics: {
      total,
      avgDuration: formatDuration(avgDurationSeconds),
      score,
      activeUsers: uniqueFlows,
      successRate,
      avgResponse: "0s",
    },
    chartData,
    interactions,
  });
}
