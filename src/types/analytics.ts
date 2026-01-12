export type TeamStatusRow = {
  status: string;
  count: number;
  selfGenCount: number;
  generatedAmount: number;
  projectedAmount: number;
};

export type EmployeeStatusRow = {
  status: string;
  count: number;
  selfGenCount: number;
  generatedAmount: number;
  projectedAmount: number;
};
export type TeamEmployeeAnalytics = {
  id: number;
  name: string;
  selfGenByStatusCounts: Record<string, number>;
  statuses: EmployeeStatusRow[];
  range: { from: string; to: string };
  totals: AnalyticsTotals;
};

export type AnalyticsTotals  = {
    totalLeads: number;
    totalGeneratedAmount: number;
    totalProjectedAmount: number;
    selfGenTrueCount: number;
}

export type TeamLeadAnalyticsResponse = {
  id: number;
  teamName: string;
  teamLead: { name: string };
  teamTotals: AnalyticsTotals;
  teamStatuses: TeamStatusRow[];
  teamSelfGenByStatus: Record<string, number>;
  employees: TeamEmployeeAnalytics[];
  range: { from: string; to: string };
};
