import { useEffect, useState } from "react";
import { fetchOpsAnalytics, type OpsAnalyticsResponse } from "@/services/analytics.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format,  subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/utils/errorHandler";

const statusColors: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-emerald-800",
  FULLY_PAID: "bg-green-300 text-green-900",
};

const OpsAnalytics = () => {
  const [analytics, setAnalytics] = useState<OpsAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<"today" | "yesterday" | "custom">("today");

  const loadData = async () => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const data = await fetchOpsAnalytics({ fromDate, toDate });
      setAnalytics(data);
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fromDate, toDate]);

  const handleQuickPick = (range: "today" | "yesterday") => {
    const today = new Date();
    const selected = range === "today" ? today : subDays(today, 1);
    setFromDate(selected);
    setToDate(selected);
    setSelectedRange(range);
  };

  const isTodaySelected = selectedRange === "today";
  const isYesterdaySelected = selectedRange === "yesterday";

   const renderDateInfo = () => {
    if (!fromDate || !toDate) return null;

    const isSameDay = fromDate.toDateString() === toDate.toDateString();
    return (
      <p className="text-sm text-muted-foreground">
        {isSameDay
          ? `Showing data for: ${format(fromDate, "dd MMM yyyy")}`
          : `Showing data from: ${format(fromDate, "dd MMM yyyy")} to ${format(toDate, "dd MMM yyyy")}`}
      </p>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4 sticky top-0 bg-muted/40 py-4 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold">Ops Analytics</h1>
          <p className="text-sm text-muted-foreground">Lead status and revenue summary</p>
          {renderDateInfo()}
        </div>
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            className={isTodaySelected ? "bg-red-400 text-white" : "bg-white"}
            onClick={() => handleQuickPick("today")}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={isYesterdaySelected ? "bg-red-400 text-white" : "bg-white"}
            onClick={() => handleQuickPick("yesterday")}
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
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          

          {analytics.leadStatusCounts.map((s) => (
            <Card key={s.status} className={statusColors[s.status] || "bg-gray-100 text-gray-800"}>
              <CardHeader>
                <CardTitle>{s.status.replace(/_/g, " ")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{s.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default OpsAnalytics;
