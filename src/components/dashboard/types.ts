export type FilterType = "7d" | "30d" | "3m" | "custom";

export interface Interaction {
  id: string;
  type: string;
  flowName: string;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  timeConnected: string;
  totalAiTime: string;
  totalHumanTime: string;
  hasTranscription: boolean;
  hasRecording: boolean;
  timeRatio: number;
  tokenRatio: number;
  aiTokens: number;
}

export interface DashboardMetrics {
  total: number;
  avgDuration: string;
  score: number;
  activeUsers: number;
  successRate: number;
  avgResponse: string;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  value: number;
  sessions: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  chartData: ChartDataPoint[];
  interactions: Interaction[];
}
