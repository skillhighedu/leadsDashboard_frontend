
export type TeamStatusRow = {
  status: string;
  count: number;
  selfGenCount: number;
};
export type TeamEmployeeAnalytics = {
  id: number;
  name: string;
  selfGenTrueCount: number;
  selfGenByStatus: Record<string, number>;
  statuses: { status: string; count: number }[];
};

export type TeamLeadAnalyticsResponse = {
  id: number;
  teamName: string;
  teamLead: { name: string };
  teamTotals: { totalLeads: number; selfGenLeads: number };
  teamStatuses: TeamStatusRow[];
  teamSelfGenByStatus: Record<string, number>;
  employees: TeamEmployeeAnalytics[];
  range: { from: string; to: string };
}