import { useEffect, useState } from "react";
import { fetchTeamsAnalytics, type RawTeamAnalytics } from "@/services/analytics.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  ASSIGNED: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PENDING: "bg-blue-100 text-blue-800",
  FOLLOW_UP: "bg-purple-100 text-purple-800",
  PAID: "bg-emerald-100 text-emerald-800",
  CBL: "bg-cyan-100 text-cyan-800",
  NOT_INTERESTED: "bg-gray-100 text-gray-700",
};

const AnalyticsPage = () => {
  const [teams, setTeams] = useState<RawTeamAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        fromDate: fromDate ?? new Date(),
        toDate: toDate ?? new Date(),
      };
      const data = await fetchTeamsAnalytics(filters);
      console.log(data)
      const normalizedTeams = Array.isArray(data) ? data : [data];
      setTeams(normalizedTeams);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fromDate, toDate]);

  const handleDateQuickPick = (range: "today" | "yesterday") => {
    const today = new Date();
    const selected = range === "today" ? today : subDays(today, 1);
    setFromDate(selected);
    setToDate(selected);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-muted/40 py-4 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold">Full Team Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Breakdown of all teams and employee statuses
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Button size="sm" variant="outline" onClick={() => handleDateQuickPick("today")}>Today</Button>
          <Button size="sm" variant="outline" onClick={() => handleDateQuickPick("yesterday")}>Yesterday</Button>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("min-w-[220px] justify-start", !fromDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate && toDate ? `${format(fromDate, "dd MMM")} - ${format(toDate, "dd MMM")}` : "Pick date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{ from: fromDate, to: toDate }}
                onSelect={(range) => {
                  setFromDate(range?.from);
                  setToDate(range?.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={loadData} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-8">
          {teams.map((team) => (
            <Card key={team.id} className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span>{team.teamName}</span>
                  <Badge variant="outline" className="text-xs mt-2 sm:mt-0">
                    Lead Executive: {team.teamLead?.name ?? "N/A"}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <section>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Team Status</h3>
                  {Array.isArray(team.teamStatuses) && team.teamStatuses.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                      {team.teamStatuses.map((s) => (
                        <li
                          key={s.status}
                          className={cn(
                            "p-2 rounded-md flex justify-between items-center",
                            statusColors[s.status] || "bg-gray-100 text-gray-800"
                          )}
                        >
                          <span>{s.status.replace(/_/g, " ")}</span>
                          <span>{s.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">No team-level status available</p>
                  )}
                </section>

                <section>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    Employee Status Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {team.employees.map((emp) => (
                      <Card key={emp.id} className="bg-muted/30 p-3">
                        <div className="font-medium text-sm mb-1">{emp.name}</div>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {emp.statuses.map((s) => (
                            <li key={s.status} className="flex justify-between">
                              <span>{s.status.replace(/_/g, " ")}</span>
                              <span>{s.count}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;