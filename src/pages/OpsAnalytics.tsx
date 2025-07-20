import { useEffect, useState } from "react";
import { fetchOpsAnalytics,type OpsAnalyticsResponse } from "@/services/analytics.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  PAID: "bg-emerald-100 text-emerald-800",
};

const OpsAnalytics = () => {
  const [analytics, setAnalytics] = useState<OpsAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loadData = async () => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const data = await fetchOpsAnalytics({ fromDate, toDate });
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
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
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4 sticky top-0 bg-muted/40 py-4 z-10 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold">Ops Analytics</h1>
          <p className="text-sm text-muted-foreground">Lead status and revenue summary</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" onClick={() => handleQuickPick("today")}>
            Today
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickPick("yesterday")}>
            Yesterday
          </Button>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("min-w-[220px] justify-start", !fromDate && "text-muted-foreground")}
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
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={loadData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">₹ {analytics.revenue.total.toLocaleString()}</p>
            </CardContent>
          </Card>

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
