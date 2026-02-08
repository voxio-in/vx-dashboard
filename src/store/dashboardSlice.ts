import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DashboardData, FilterType } from "@/components/dashboard/types";

export interface DashboardState {
  filter: FilterType;
  data: DashboardData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  { from: string; to: string },
  { rejectValue: string }
>("dashboard/fetchDashboardData", async ({ from, to }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams({ from, to });
    const res = await fetch(`/api/dashboard?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      let message = "Failed to load dashboard data";
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch {
        // Ignore JSON parse errors
      }
      return rejectWithValue(message);
    }

    return (await res.json()) as DashboardData;
  } catch {
    return rejectWithValue("Failed to load dashboard data");
  }
});

const initialState: DashboardState = {
  filter: "7d",
  data: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload;
    },
    resetDashboard(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load dashboard data";
      });
  },
});

export const { setFilter, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
