import { useEffect } from "react";
import { format, subDays, subMonths } from "date-fns";
import { toast } from "sonner";
import { FilterType } from "@/components/dashboard/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardData, setFilter } from "@/store/dashboardSlice";

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const { data, status, error, filter } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    const today = new Date();
    let from = format(subDays(today, 7), "yyyy-MM-dd");

    if (filter === "30d") from = format(subDays(today, 30), "yyyy-MM-dd");
    if (filter === "3m") from = format(subMonths(today, 3), "yyyy-MM-dd");

    dispatch(fetchDashboardData({ from, to: format(today, "yyyy-MM-dd") }));
  }, [dispatch, filter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return {
    data,
    loading: status === "loading" || status === "idle",
    filter,
    setFilter: (value: FilterType) => dispatch(setFilter(value)),
  };
};
