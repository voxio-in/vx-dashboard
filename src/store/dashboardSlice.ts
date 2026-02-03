import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FilterType = "7d" | "30d" | "3m" | "custom";

export interface DateRange {
  from: string; // ISO Date String YYYY-MM-DD
  to: string; // ISO Date String YYYY-MM-DD
}

export interface ChartDataPoint {
  date: string; // YYYY-MM-DD
  count: number;
  label: string; // Mon, Tue, Nov 15, etc.
}

export interface Interaction {
  id: string;
  type: string;
  flowName: string;
  startTime: string;
  endTime: string;
  duration: string;
  hasRecording: boolean;
  hasTranscript: boolean;
  summary: string;
  tags: string[];
}

interface DashboardState {
  filterType: FilterType;
  customDateRange: DateRange; // Used if filterType is 'custom'
  chartData: ChartDataPoint[];
  interactions: Interaction[];
  metrics: {
    total: number;
    avgDuration: string;
    score: number | string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
}

/* --- INITIAL STATE --- */
// Helper to get default dates (Last 7 days)
const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

const initialState: DashboardState = {
  filterType: "7d",
  customDateRange: {
    from: sevenDaysAgo.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  },
  chartData: [],
  interactions: [],
  metrics: { total: 0, avgDuration: "00:00", score: "N/A" },
  status: "idle",
};

/* --- SLICE --- */
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilterType(state, action: PayloadAction<FilterType>) {
      state.filterType = action.payload;
      state.status = "idle"; // Reset status to trigger re-fetch
    },
    setCustomDateRange(state, action: PayloadAction<DateRange>) {
      state.customDateRange = action.payload;
      state.filterType = "custom";
      state.status = "idle";
    },
    setDashboardData(state, action: PayloadAction<any>) {
      state.chartData = action.payload.chartData;
      state.interactions = action.payload.interactions;
      state.metrics = action.payload.metrics;
      state.status = "succeeded";
    },
    setLoading(state) {
      state.status = "loading";
    },
    setError(state) {
      state.status = "failed";
    },
  },
});

export const {
  setFilterType,
  setCustomDateRange,
  setDashboardData,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
