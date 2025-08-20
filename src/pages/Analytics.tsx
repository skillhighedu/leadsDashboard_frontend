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
import { ChevronDown, ChevronUp, CalendarIcon } from "lucide-react";
import { format, subDays,  } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { handleApiError } from "@/utils/errorHandler";

// --- status colors ---
const statusColors: Record<string, string> = {
  CGFL: "bg-yellow-200 text-yellow-900",
  IN_PROGRESS: "bg-orange-200 text-orange-900",
  COMPLETED: "bg-green-200 text-green-900",
  FULLY_PAID: "bg-green-300 text-green-900",
  REJECTED: "bg-red-200 text-red-900",
  FOLLOW_UP: "bg-purple-100 text-purple-800",
  PAID: "bg-green-100 text-green-800",
  CBL: "bg-cyan-100 text-cyan-800",
  NOT_INTERESTED: "bg-gray-100 text-gray-600",
};

// --- Skeleton Loader ---
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

// --- Overall Summary Card ---
const OverallSummary = ({
  data,
  fromDate,
  toDate,
}: {
  data: LeadAnalyticsResponse;
  fromDate?: Date;
  toDate?: Date;
}) => {
  const formatDate = (date: Date) => format(date, "dd MMM yyyy");

  const renderDateText = () => {
    if (!fromDate || !toDate) return null;

    const isSameDay = fromDate.toDateString() === toDate.toDateString();
    return isSameDay
      ? `Date: ${formatDate(fromDate)}`
      : `From: ${formatDate(fromDate)} - To: ${formatDate(toDate)}`;
  };

  return (
    <Card className="border shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Overall Lead Summary
        </CardTitle>
        {fromDate && toDate && (
          <p className="text-sm text-muted-foreground mt-1">{renderDateText()}</p>
        )}
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

        {data?.fees && (
          <>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Total Generated Revenue
              </span>
              <div className="text-xl font-bold text-green-700">
                ₹{data.fees.totalGenerated}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Total Projected Revenue
              </span>
              <div className="text-xl font-bold text-green-700">
                ₹{data.fees.totalProjected}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// --- Per-Team Analytics ---
const TeamAnalyticsCard = ({ team }: { team: TeamStatusAnalytics }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const otherStatuses = useMemo(
    () =>
      team.statuses.filter(
        (s) => s.status !== "PAID" && (s.count > 0 || s.totalTicketAmount > 0)
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

      <Card className="border border-blue-400/40 shadow-sm bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="py-2">
          <CardTitle className="text-base text-blue-900 font-medium">
            Team Revenue Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 text-sm text-gray-800 space-y-1">
          <div>
            <span className="font-medium text-muted-foreground">Total Generated:</span>{" "}
            ₹{team.totalGenerated.toLocaleString("en-IN")}
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Total Projected:</span>{" "}
            ₹{team.totalProjected.toLocaleString("en-IN")}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {otherStatuses.length > 0 && (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="py-2 flex justify-between items-center">
              <CardTitle className="text-base font-medium text-foreground">
                Other Statuses
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
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
                    <li key={status.status} className="py-2 flex items-center justify-between text-sm">
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
                        <p>₹{status.generatedAmount.toLocaleString("en-IN")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {team.members?.length > 0 && (
          <Card className="border shadow-sm bg-white">
            <CardHeader className="py-2">
              <CardTitle className="text-base font-medium text-foreground">
                Member Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-2">
              {team.members.map((member) => (
                <div key={member.memberId} className="border rounded p-2">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    {member.memberName}
                  </h3>
                  {member.statuses.length === 0 ? (
                    <p className="text-xs text-gray-500">No leads</p>
                  ) : (
                    <ul className="divide-y divide-muted">
                      {member.statuses.map((status) => (
                        <li
                          key={status.status}
                          className="py-1 flex justify-between text-sm"
                        >
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded",
                              statusColors[status.status] || "bg-gray-100 text-gray-800"
                            )}
                          >
                            {status.status.replace(/_/g, " ")}
                          </span>
                          
                          <div className="text-right text-xs">
                            <p>{status.count} leads</p>
                            <p>₹{status.generatedAmount.toLocaleString("en-IN")}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {team.leadOwnerStats && Object.keys(team.leadOwnerStats).length > 0 && (
  <Card className="border shadow-sm bg-white">
    <CardHeader className="py-2">
      <CardTitle className="text-base font-medium text-foreground">
        Lead Owner Stats
      </CardTitle>
    </CardHeader>
    <CardContent className="py-2 space-y-2">
      {Object.entries(team.leadOwnerStats).map(([ownerName, statusMap]) => (
        <div key={ownerName} className="border rounded p-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            {ownerName}
          </h3>
          {Object.entries(statusMap).length === 0 ? (
            <p className="text-xs text-gray-500">No statuses</p>
          ) : (
            <ul className="divide-y divide-muted">
              {Object.entries(statusMap).map(([status, count]) => (
                <li
                  key={status}
                  className="py-1 flex justify-between text-sm"
                >
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      statusColors[status] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {status.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-right">{count} leads</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)}

      </div>
    </section>
  );
};

// --- Main Component ---
export default function Analytics() {
  const today = new Date();
  const [fromDate, setFromDate] = useState<Date>(today);
  const [toDate, setToDate] = useState<Date>(today);
  const [selectedRange, setSelectedRange] = useState<"today" | "yesterday" | "custom">("today");


  const [allTeams, setAllTeams] = useState<TeamStatusAnalytics[]>([]);
  const [allData, setAllData] = useState<LeadAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleRangeFilter = (range: "today" | "yesterday") => {
    const date = range === "today" ? today : subDays(today, 1);
    setSelectedRange(range );
    setFromDate(date);
    setToDate(date);
  };

  const handleRefresh = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      setError(null);
      const filters = { fromDate, toDate };
      const [teamData, overallData] = await Promise.all([
        fetchAllTeamsAnalytics(filters),
        fetchAnalytics(filters),
      ]);
      setAllTeams(teamData);
      setAllData(overallData);
    } catch (err) {
      handleApiError( err);
      setError("Failed to load team analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      handleRefresh();
    }
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
            <Button
              size="sm"
              variant="outline"
              className={selectedRange === "today" ? "bg-red-400 text-white" : ""}
              onClick={() => handleRangeFilter("today")}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={ selectedRange === "yesterday" ? "bg-red-400 text-white" : ""}
              onClick={() => handleRangeFilter("yesterday")}
            >
              Yesterday
            </Button>

            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal min-w-[220px]",
                    !fromDate && "text-muted-foreground", selectedRange === "custom" && "bg-red-400 text-white"
                  )}
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
                    if (range?.from && range?.to) {
                      setFromDate(range.from);
                      setToDate(range.to);
                      setSelectedRange("custom");
                    }
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
            {allData && <OverallSummary data={allData} fromDate={fromDate} toDate={toDate} />}
            {allTeams.map((team) => (
              <TeamAnalyticsCard key={team.teamAssignedId} team={team} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
