import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/utils/errorHandler";

import { fetchTeamsAnalytics } from "@/services/analytics.services";
import type { TeamLeadAnalyticsResponse } from "@/types/analytics";

const statusColors: Record<string, string> = {
  FOLLOW_UP: "bg-purple-100 text-purple-800",
  PAID: "bg-emerald-100 text-emerald-800",
  FULLY_PAID: "bg-green-300 text-green-800",
  NOT_INTERESTED: "bg-gray-100 text-gray-700",
  CBL: "bg-cyan-100 text-cyan-800",
  DNP: "bg-red-100 text-red-800",
  NEWLY_GENERATED: "bg-blue-100 text-blue-800",
  UNKNOWN: "bg-gray-100 text-gray-700",
};

export default function TeamAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectedRange, setSelectedRange] = useState<"today" | "yesterday" | "custom" | "month">("month");

  const [data, setData] = useState<TeamLeadAnalyticsResponse | null>(null);

  const today = new Date();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = fromDate && toDate ? { fromDate, toDate } : undefined;
      const res = await fetchTeamsAnalytics(filters);
      setData(res);
    } catch (err) {
      handleApiError(err);
      setError("Failed to load team analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const handleDateQuickPick = (range: "today" | "yesterday") => {
    const date = range === "today" ? today : subDays(today, 1);
    setSelectedRange(range);
    setFromDate(date);
    setToDate(date);
  };

  const handleMonthDefault = () => {
    setSelectedRange("month");
    setFromDate(undefined);
    setToDate(undefined);
  };

  // ✅ same style as SelfAnalytics: read from API response range
  const renderDateInfo = () => {
    if (!data?.range) return null;
    return (
      <p className="text-sm text-muted-foreground">
        Showing data from: {data.range.from} to {data.range.to}
      </p>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-muted/40 py-4 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold">Team Analytics</h1>
          <p className="text-sm text-muted-foreground">Team performance summary</p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className={selectedRange === "month" ? "bg-red-400 text-white" : "bg-white"}
            onClick={handleMonthDefault}
          >
            This Month
          </Button>

          <Button
            size="sm"
            variant="outline"
            className={selectedRange === "today" ? "bg-red-400 text-white" : "bg-white"}
            onClick={() => handleDateQuickPick("today")}
          >
            Today
          </Button>

          <Button
            size="sm"
            variant="outline"
            className={selectedRange === "yesterday" ? "bg-red-400 text-white" : "bg-white"}
            onClick={() => handleDateQuickPick("yesterday")}
          >
            Yesterday
          </Button>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "min-w-[220px] justify-start",
                  !fromDate && "text-muted-foreground",
                  selectedRange === "custom" && "bg-red-400 text-white"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate && toDate
                  ? `${format(fromDate, "dd MMM")} - ${format(toDate, "dd MMM")}`
                  : "Pick date range"}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{ from: fromDate, to: toDate }}
                onSelect={(range) => {
                  setFromDate(range?.from);
                  setToDate(range?.to);
                  setSelectedRange("custom");
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button size="sm" variant="default" onClick={loadData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !data ? (
        <p className="text-muted-foreground">No data</p>
      ) : (
        <div className="space-y-6">
          {/* ✅ Team Summary + SelfGen */}
          <Card className="bg-muted/50 border border-muted-foreground/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {data.teamName} <Badge variant="outline">Lead: {data.teamLead?.name}</Badge>
              </CardTitle>
              {renderDateInfo()}
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                  <span className="text-muted-foreground">Total Leads</span>
                  <span className="font-semibold">{data.teamTotals.totalLeads}</span>
                </div>
                <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                  <span className="text-muted-foreground">SelfGen Leads</span>
                  <span className="font-semibold">{data.teamTotals.selfGenLeads}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Team status (count + selfgenCount) */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Team Status Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">Count + SelfGenCount</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.teamStatuses.map((s) => (
                  <div
                    key={s.status}
                    className={cn(
                      "p-3 rounded-md flex flex-col gap-2 border",
                      statusColors[s.status] || "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{s.status.replace(/_/g, " ")}</span>
                      <Badge variant="outline">Count: {s.count}</Badge>
                    </div>

                    <div className="text-xs bg-white rounded p-2 flex justify-between">
                      <span className="text-muted-foreground">SelfGen</span>
                      <span className="font-semibold">{s.selfGenCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ✅ Employee cards (show selfgen) */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Employee Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">Status counts + SelfGen totals</p>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.employees.map((emp) => (
                <Card key={emp.id} className="bg-muted/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{emp.name}</div>
                    <Badge variant="outline">SelfGen: {emp.selfGenTrueCount}</Badge>
                  </div>

                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {emp.statuses.map((s) => (
                      <li key={s.status} className="flex justify-between">
                        <span>{s.status.replace(/_/g, " ")}</span>
                        <span>{s.count}</span>
                      </li>
                    ))}
                  </ul>

                  {/* optional: SelfGen by status */}
                  {Object.keys(emp.selfGenByStatus).length > 0 && (
                    <div className="mt-3 text-xs">
                      <div className="font-medium mb-1">SelfGen by Status</div>
                      <ul className="space-y-1 text-muted-foreground">
                        {Object.entries(emp.selfGenByStatus).map(([st, cnt]) => (
                          <li key={st} className="flex justify-between">
                            <span>{st.replace(/_/g, " ")}</span>
                            <span>{cnt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
