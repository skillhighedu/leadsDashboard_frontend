"use client";

import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/utils/errorHandler";

import {
  fetchTeamsAdminAnalyticsSummary,
  fetchTeamsAdminAnalyticsDetails,
} from "@/services/analytics.services";

import type {
  AdminAnalyticsSummaryResponse,
  StatusRow,
  TeamLeadAnalyticsResponse,
} from "@/types/analytics";

import { EmployeeAnalyticsCard } from "./EmployeeAnalyticsCard";

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

const prettyStatus = (s: string) => String(s || "UNKNOWN").replace(/_/g, " ");

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [selectedRange, setSelectedRange] = useState<
    "today" | "yesterday" | "custom" | "month"
  >("month");

  const [summary, setSummary] = useState<AdminAnalyticsSummaryResponse | null>(
    null
  );

  // details state (shown BELOW teams list)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamLeadAnalyticsResponse | null>(
    null
  );

  const today = new Date();

  const filters = useMemo(() => {
    return fromDate && toDate ? { fromDate, toDate } : undefined;
  }, [fromDate, toDate]);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTeamsAdminAnalyticsSummary(filters);
      setSummary(res);
    } catch (err) {
      handleApiError(err);
      setError("Failed to load admin analytics.");
    } finally {
      setLoading(false);
    }
  };

  const loadTeamDetails = async (teamId: number) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const res = await fetchTeamsAdminAnalyticsDetails(teamId, filters);
      setSelectedTeamId(teamId);
      setTeamDetails(res);
    } catch (err) {
      handleApiError(err);
      setError("Failed to load team details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Initial + filters change
  useEffect(() => {
    loadSummary();
    // if details open -> refetch for same team
    if (selectedTeamId) loadTeamDetails(selectedTeamId);
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

  const renderDateInfo = (range?: { from: string; to: string }) => {
    if (!range) return null;
    return (
      <p className="text-sm text-muted-foreground">
        Showing data from: {range.from} to {range.to}
      </p>
    );
  };

  // -------------------------
  // Summary Cards
  // -------------------------
  const renderSummaryTotalsCard = () => {
    if (!summary) return null;

    return (
      <Card className="bg-muted/50 border border-muted-foreground/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Admin Analytics
            <Badge variant="outline">All Teams</Badge>
          </CardTitle>
          {renderDateInfo(summary.range)}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
              <span className="text-muted-foreground">Generated</span>
              <span className="font-semibold">
                ₹ {summary.totals.totalGeneratedAmount}
              </span>
            </div>

            <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
              <span className="text-muted-foreground">Projected</span>
              <span className="font-semibold">
                ₹ {summary.totals.totalProjectedAmount}
              </span>
            </div>

            <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
              <span className="text-muted-foreground">SelfGen Leads</span>
              <span className="font-semibold">
                {summary.totals.selfGenTrueCount}
              </span>
            </div>

            <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
              <span className="text-muted-foreground">Total Leads</span>
              <span className="font-semibold">{summary.totals.totalLeads}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSummaryStatusBreakdown = () => {
    if (!summary) return null;

    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Overall Status Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Count + SelfGenCount + Amounts (across all teams)
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {!summary.statuses?.length ? (
            <p className="text-muted-foreground text-sm">No status data.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {summary.statuses.map((s: StatusRow) => (
                <div
                  key={s.status}
                  className={cn(
                    "p-3 rounded-md flex flex-col gap-2 border",
                    statusColors[s.status] || "bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{prettyStatus(s.status)}</span>
                    <Badge variant="outline">Count: {s.count}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white rounded p-2">
                      <div className="text-muted-foreground">SelfGen</div>
                      <div className="font-semibold">{s.selfGenCount}</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-muted-foreground">Generated</div>
                      <div className="font-semibold">₹ {s.generatedAmount}</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-muted-foreground">Projected</div>
                      <div className="font-semibold">₹ {s.projectedAmount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // -------------------------
  // Teams list (with toggle details)
  // -------------------------
  const handleToggleTeamDetails = async (teamId: number) => {
    // if same team is open -> hide
    if (selectedTeamId === teamId) {
      setSelectedTeamId(null);
      setTeamDetails(null);
      return;
    }
    // else open new team details
    await loadTeamDetails(teamId);
    // scroll into details area for nice UX
    setTimeout(() => {
      document.getElementById("team-details-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const renderTeamsList = () => {
    if (!summary) return null;

    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Teams Summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            Totals per team. Click <b>View Details</b> to expand team analytics below.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {!summary.teams?.length ? (
            <p className="text-muted-foreground text-sm">No teams found.</p>
          ) : (
            summary.teams.map((t) => {
              const isOpen = selectedTeamId === t.id;

              return (
                <div
                  key={t.id}
                  className="rounded-md border bg-white shadow-sm p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-base">{t.teamName}</div>
                      <div className="text-xs text-muted-foreground">
                        Lead: {t.teamLead?.name ?? "Unknown"}
                      </div>
                    </div>

                    <Badge variant="outline" className="shrink-0">
                      Team #{t.id}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="bg-muted/30 rounded p-2">
                      <div className="text-muted-foreground text-xs">Generated</div>
                      <div className="font-semibold">
                        ₹ {t.teamTotals.totalGeneratedAmount}
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded p-2">
                      <div className="text-muted-foreground text-xs">Projected</div>
                      <div className="font-semibold">
                        ₹ {t.teamTotals.totalProjectedAmount}
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded p-2">
                      <div className="text-muted-foreground text-xs">SelfGen</div>
                      <div className="font-semibold">{t.teamTotals.selfGenTrueCount}</div>
                    </div>

                    <div className="bg-muted/30 rounded p-2">
                      <div className="text-muted-foreground text-xs">Total Leads</div>
                      <div className="font-semibold">{t.teamTotals.totalLeads}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isOpen ? "default" : "outline"}
                      onClick={() => handleToggleTeamDetails(t.id)}
                      disabled={detailsLoading && selectedTeamId !== t.id}
                    >
                      {isOpen ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    );
  };

  // -------------------------
  // Details section (renders below teams)
  // -------------------------
  const renderTeamDetailsSection = () => {
    if (!selectedTeamId) return null;

    return (
      <div id="team-details-section" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Team Details {teamDetails?.teamName ? `- ${teamDetails.teamName}` : ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              Deep dive into team + employee breakdown.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTeamId(null);
              setTeamDetails(null);
            }}
          >
            Hide Details
          </Button>
        </div>

        {detailsLoading ? (
          <p>Loading team details...</p>
        ) : !teamDetails ? (
          <p className="text-muted-foreground">No details found.</p>
        ) : (
          <div className="space-y-6">
            {/* Team Summary card */}
            <Card className="bg-muted/50 border border-muted-foreground/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {teamDetails.teamName}
                  <Badge variant="outline">
                    Lead: {teamDetails.teamLead?.name ?? "Unknown"}
                  </Badge>
                  <Badge variant="outline">Team #{teamDetails.id}</Badge>
                </CardTitle>
                {renderDateInfo(teamDetails.range)}
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                    <span className="text-muted-foreground">Generated</span>
                    <span className="font-semibold">
                      ₹ {teamDetails.teamTotals.totalGeneratedAmount}
                    </span>
                  </div>

                  <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                    <span className="text-muted-foreground">Projected</span>
                    <span className="font-semibold">
                      ₹ {teamDetails.teamTotals.totalProjectedAmount}
                    </span>
                  </div>

                  <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                    <span className="text-muted-foreground">SelfGen Leads</span>
                    <span className="font-semibold">
                      {teamDetails.teamTotals.selfGenTrueCount}
                    </span>
                  </div>

                  <div className="flex justify-between bg-white rounded-md p-3 shadow-sm">
                    <span className="text-muted-foreground">Total Leads</span>
                    <span className="font-semibold">{teamDetails.teamTotals.totalLeads}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Status Breakdown */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Team Status Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Count + SelfGenCount + Amounts
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamDetails.teamStatuses.map((s) => (
                    <div
                      key={s.status}
                      className={cn(
                        "p-3 rounded-md flex flex-col gap-2 border",
                        statusColors[s.status] || "bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{prettyStatus(s.status)}</span>
                        <Badge variant="outline">Count: {s.count}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded p-2">
                          <div className="text-muted-foreground">SelfGen</div>
                          <div className="font-semibold">{s.selfGenCount}</div>
                        </div>
                        <div className="bg-white rounded p-2">
                          <div className="text-muted-foreground">Generated</div>
                          <div className="font-semibold">₹ {s.generatedAmount}</div>
                        </div>
                        <div className="bg-white rounded p-2">
                          <div className="text-muted-foreground">Projected</div>
                          <div className="font-semibold">₹ {s.projectedAmount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employee Breakdown */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Employee Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Quick summary per member. Expand for full status + selfgen breakdown.
                </p>
              </CardHeader>

              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {teamDetails.employees.map((emp) => (
                  <EmployeeAnalyticsCard
                    key={emp.id}
                    emp={emp}
                    statusColors={statusColors}
                    prettyStatus={prettyStatus}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-muted/40 py-4 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold">Admin Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Overall performance + team-wise totals
          </p>
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

          <Button
            size="sm"
            variant="default"
            onClick={() => {
              loadSummary();
              if (selectedTeamId) loadTeamDetails(selectedTeamId);
            }}
            disabled={loading || detailsLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !summary ? (
        <p className="text-muted-foreground">No data</p>
      ) : (
        <div className="space-y-6">
          {renderSummaryTotalsCard()}
          {renderSummaryStatusBreakdown()}
          {renderTeamsList()}
          {renderTeamDetailsSection()}
        </div>
      )}
    </div>
  );
}
