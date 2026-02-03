"use server";

import { addDays, format, differenceInDays } from "date-fns";

// Helper to simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getDashboardData(startDate: string, endDate: string) {
  await delay(500); // Simulate network

  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = differenceInDays(end, start) + 1;

  // Generate Chart Data
  const chartData = Array.from({ length: daysDiff }).map((_, i) => {
    const date = addDays(start, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "MMM dd"), // "Nov 15"
      value: Math.floor(Math.random() * 50) + 5, // Random count
    };
  });

  // Calculate Metrics based on the random data
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Mock Interactions Table
  const interactions = [
    {
      id: "1",
      type: "Voice",
      flowName: "Customer Support",
      date: format(end, "MMM dd, HH:mm"),
      duration: "05:00",
      summary: "Refund request",
      status: "Resolved",
    },
    {
      id: "2",
      type: "Chat",
      flowName: "Sales Bot",
      date: format(end, "MMM dd, HH:mm"),
      duration: "02:15",
      summary: "Pricing inquiry",
      status: "Pending",
    },
    {
      id: "3",
      type: "Call",
      flowName: "Booking",
      date: format(addDays(end, -1), "MMM dd, HH:mm"),
      duration: "12:00",
      summary: "Dental appointment",
      status: "Booked",
    },
    {
      id: "4",
      type: "Voice",
      flowName: "Tech Support",
      date: format(addDays(end, -1), "MMM dd, HH:mm"),
      duration: "08:30",
      summary: "Login failure",
      status: "Escalated",
    },
    {
      id: "5",
      type: "Chat",
      flowName: "FAQ",
      date: format(addDays(end, -2), "MMM dd, HH:mm"),
      duration: "01:00",
      summary: "Reset password",
      status: "Resolved",
    },
  ];

  return {
    metrics: {
      total,
      avgDuration: "04:12",
      score: 8.4,
    },
    chartData,
    interactions,
  };
}
