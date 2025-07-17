import { useEffect, useState, useMemo } from "react";
import {
  fetchAllTeamsAnalytics,
  fetchAnalytics,
  type TeamStatusAnalytics,
  type LeadAnalyticsResponse,
} from "@/services/analytics.services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";


// Status colors
const statusColors: Record<string, string> = {
  ASSIGNED: "bg-yellow-200 text-yellow-900",
  IN_PROGRESS: "bg-orange-200 text-orange-900",
  COMPLETED: "bg-green-200 text-green-900",
  REJECTED: "bg-red-200 text-red-900",
  PENDING: "bg-blue-100 text-blue-800",
  FOLLOW_UP: "bg-purple-100 text-purple-800",
  PAID: "bg-green-100 text-green-800",
  CBL: "bg-cyan-100 text-cyan-800",
  NOT_INTERESTED: "bg-gray-100 text-gray-600",
};

// Skeleton loader
const SkeletonCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <Card key={i} className="border shadow-sm">
          <CardHeader className="py-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="h-3 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Overall summary card
const OverallSummary = ({ data }: { data: LeadAnalyticsResponse }) => {
  return (
    <Card className="border shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Overall Lead Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.leadStatusCounts.map((item) => (
          <div key={item.status} className="space-y-1">
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded",
                statusColors[item.status] || "bg-gray-100 text-gray-800"
              )}
            >
              {item.status.replace(/_/g, " ")}
            </span>
            <div className="text-xl font-bold text-foreground">{item.count}</div>
          </div>
        ))}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
          <div className="text-xl font-bold text-green-700">
            ₹{data.revenue.total.toLocaleString("en-IN")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Per-team analytics card
const TeamAnalyticsCard = ({ team }: { team: TeamStatusAnalytics }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const pendingStatus = useMemo(
    () => team.statuses.find((s) => s.status === "PENDING"),
    [team.statuses]
  );

  const otherStatuses = useMemo(
    () =>
      team.statuses.filter(
        (s) => s.status !== "PENDING" && (s.count > 0 || s.totalTicketAmount > 0)
      ),
    [team.statuses]
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{team.teamName}</h2>
        <Badge variant="outline" className="text-xs">
          Team Lead: {team.teamLeadName}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pending card */}
        {pendingStatus && (pendingStatus.count > 0 || pendingStatus.totalTicketAmount > 0) && (
          <Card className="border border-blue-400/40 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="py-2">
              <CardTitle className="text-base text-blue-900 font-medium flex items-center justify-between">
                Pending Leads
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingStatus.count} leads
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-1">
              <p className="text-gray-700 text-sm">
                <span className="font-medium text-muted-foreground">Generated:</span>{" "}
                ₹{pendingStatus.generatedAmount.toLocaleString("en-IN")}
              </p>
              {pendingStatus.projectedAmount !== undefined && (
                <p className="text-gray-700 text-sm">
                  <span className="font-medium text-muted-foreground">Projected:</span>{" "}
                  ₹{pendingStatus.projectedAmount.toLocaleString("en-IN")}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Other statuses */}
        {otherStatuses.length > 0 && (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="py-2 flex justify-between items-center">
              <CardTitle className="text-base font-medium text-foreground">
                Other Statuses
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-gray-700 mb-2">
                Total: {otherStatuses.reduce((sum, s) => sum + s.count, 0)} leads
              </p>
              {isExpanded && (
                <ul className="divide-y divide-muted">
                  {otherStatuses.map((status) => (
                    <li
                      key={status.status}
                      className="py-2 flex items-center justify-between text-sm"
                    >
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          statusColors[status.status] || "bg-gray-200 text-gray-800"
                        )}
                      >
                        {status.status.replace(/_/g, " ")}
                      </span>
                      <div className="text-right space-y-0.5 text-xs text-gray-700">
                        <p>{status.count} leads</p>
                        <p>₹{status.totalTicketAmount.toLocaleString("en-IN")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};



export default function Home() {
  const [allTeams, setAllTeams] = useState<TeamStatusAnalytics[]>([]);
  const [allData, setAllData] = useState<LeadAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleRangeFilter = (range: "today" | "yesterday") => {
    const today = new Date();
    if (range === "today") {
      setFromDate(today);
      setToDate(today);
    } else {
      const yday = subDays(today, 1);
      setFromDate(yday);
      setToDate(yday);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      setError(null);

  const filters = {
  fromDate: fromDate ?? new Date(),
  toDate: toDate ?? new Date(),
};
      const [teamData, overallData] = await Promise.all([
        fetchAllTeamsAnalytics(filters),
        fetchAnalytics(filters),
      ]);

      setAllTeams(Array.isArray(teamData) ? teamData : [teamData]);
      setAllData(overallData);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load team analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, [fromDate, toDate]);

  return (
    <div className="min-h-screen bg-muted/40 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto sticky top-0 z-10 bg-muted/40 backdrop-blur-sm py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Team Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time insights into team performance and revenue metrics
            </p>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <Button size="sm" variant="outline" onClick={() => handleRangeFilter("today")}>
              Today
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleRangeFilter("yesterday")}>
              Yesterday
            </Button>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("justify-start text-left font-normal min-w-[220px]", !fromDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate && toDate
                    ? `${format(fromDate, "dd MMM")} - ${format(toDate, "dd MMM")}`
                    : "Pick date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{ from: fromDate, to: toDate }}
                  onSelect={(range) => {
                    setFromDate(range?.from);
                    setToDate(range?.to);
                  }}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={handleRefresh} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 mt-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
            <Button variant="link" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            {allData && <OverallSummary data={allData} />}
            {allTeams.map((team) => (
              <TeamAnalyticsCard key={team.teamAssignedId} team={team} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
