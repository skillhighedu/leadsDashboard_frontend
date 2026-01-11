import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TeamEmployeeAnalytics } from "@/types/analytics";
import { Badge } from "lucide-react";
import { useMemo, useState } from "react";

type EmployeeAnalyticsCardProps = {
  emp: TeamEmployeeAnalytics;
  statusColors: Record<string, string>;
  prettyStatus: (s: string) => string;
};

export function EmployeeAnalyticsCard({
  emp,
  statusColors,
  prettyStatus,
}: EmployeeAnalyticsCardProps) {
  const [open, setOpen] = useState(false);

  const totals = emp.totals ?? {
    totalLeads: 0,
    totalGeneratedAmount: 0,
    totalProjectedAmount: 0,
    selfGenTrueCount: 0,
  };

  const topStatuses = useMemo(() => {
    return [...(emp.statuses ?? [])]
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 6);
  }, [emp.statuses]);

  const sortedSelfGenByStatus = useMemo(() => {
    const obj = emp.selfGenByStatusCounts ?? {};
    return Object.entries(obj).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  }, [emp.selfGenByStatusCounts]);

  return (
    <Card className="border bg-muted/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm truncate">{emp.name}</h3>
            <Badge fontVariant="outline" className="text-[11px]">
              SelfGen: {totals.selfGenTrueCount}
            </Badge>
          </div>

          <p className="text-[12px] text-muted-foreground mt-1">
            {emp.range?.from} → {emp.range?.to}
          </p>
        </div>

        <Button
          size="sm"
          variant={open ? "secondary" : "outline"}
          className="shrink-0"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide details" : "View details"}
        </Button>
      </div>

      {/* Totals Strip */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-md border p-2">
            <div className="text-[11px] text-muted-foreground">Generated</div>
            <div className="text-sm font-semibold">₹ {totals.totalGeneratedAmount}</div>
          </div>

          <div className="bg-white rounded-md border p-2">
            <div className="text-[11px] text-muted-foreground">Projected</div>
            <div className="text-sm font-semibold">₹ {totals.totalProjectedAmount}</div>
          </div>

          <div className="bg-white rounded-md border p-2">
            <div className="text-[11px] text-muted-foreground">Leads</div>
            <div className="text-sm font-semibold">{totals.totalLeads}</div>
          </div>
        </div>
      </div>

      {/* Top Status Chips */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[12px] font-medium">Top statuses</div>
          <span className="text-[11px] text-muted-foreground">
            Showing {Math.min(topStatuses.length, 6)} / {(emp.statuses ?? []).length}
          </span>
        </div>

        {topStatuses.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">No status data</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topStatuses.map((s) => (
              <span
                key={s.status}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px]",
                  statusColors[s.status] || "bg-gray-50"
                )}
              >
                <span className="font-medium">{prettyStatus(s.status)}</span>
                <span className="bg-white/70 rounded-full px-2 py-0.5 font-semibold">
                  {s.count}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {open && (
        <div className="border-t bg-white/50 p-4 space-y-4">
          {/* Full Status List */}
          <div>
            <div className="text-[12px] font-medium mb-2">Full status breakdown</div>

            <div className="space-y-2">
              {(emp.statuses ?? []).map((s) => (
                <div
                  key={s.status}
                  className={cn(
                    "rounded-md border p-3",
                    statusColors[s.status] || "bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {prettyStatus(s.status)}
                    </div>
                    <Badge fontVariant="outline" className="text-[11px]">
                      Count: {s.count}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-white rounded-md border p-2">
                      <div className="text-[11px] text-muted-foreground">SelfGen</div>
                      <div className="text-sm font-semibold">{s.selfGenCount}</div>
                    </div>

                    <div className="bg-white rounded-md border p-2">
                      <div className="text-[11px] text-muted-foreground">Generated</div>
                      <div className="text-sm font-semibold">₹ {s.generatedAmount}</div>
                    </div>

                    <div className="bg-white rounded-md border p-2">
                      <div className="text-[11px] text-muted-foreground">Projected</div>
                      <div className="text-sm font-semibold">₹ {s.projectedAmount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SelfGen By Status (compact grid) */}
          <div>
            <div className="text-[12px] font-medium mb-2">SelfGen by status</div>

            {sortedSelfGenByStatus.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {sortedSelfGenByStatus.map(([st, cnt]) => (
                  <div
                    key={st}
                    className="bg-white rounded-md border p-2 flex items-center justify-between"
                  >
                    <span className="text-[12px] text-muted-foreground">
                      {prettyStatus(st)}
                    </span>
                    <span className="text-sm font-semibold">{cnt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-muted-foreground">
                No selfgen-by-status data
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}


