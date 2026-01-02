import { useMemo, useState } from "react";
import TeamAnalyticsPage from "./TeamAnalytics";
import SelfAnalyticsPage from "./SelfAnalyticsPage";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { canViewSelfAnalytics, canViewTeamAnalytics } from "@/utils/analyticsRoleGate";
import { useAuthStore } from "@/store/AuthStore";
import { toRoleType } from "@/utils/roleGuard";
 // ✅ use your real auth hook

export default function AnalyticsHub() {
  const { user } = useAuthStore(); // user.role should match your Roles constant values
  const rawRole = user?.role  ;
  const role = useMemo(() => toRoleType(rawRole), [rawRole]);
  const showTeam = useMemo(() => canViewTeamAnalytics(role), [role]);
  const showSelf = useMemo(() => canViewSelfAnalytics(role), [role]);

  // Default tab:
  // - BDM: Team first (so they see org view)
  // - Intern/Fresher: only self
  const defaultTab = showTeam ? "team" : "self";
  const [tab, setTab] = useState<"team" | "self">(defaultTab);

  if (!showTeam && !showSelf) {
    return <div className="p-6 text-red-600">You don’t have access to analytics.</div>;
  }

  return (
    <div className="space-y-4">
      {(showTeam && showSelf) && (
        <div className="flex gap-2 px-6 pt-6">
          <Button
            size="sm"
            variant="outline"
            className={cn(tab === "team" ? "bg-red-400 text-white" : "bg-white")}
            onClick={() => setTab("team")}
          >
            Team Analytics
          </Button>

          <Button
            size="sm"
            variant="outline"
            className={cn(tab === "self" ? "bg-red-400 text-white" : "bg-white")}
            onClick={() => setTab("self")}
          >
            My Analytics
          </Button>
        </div>
      )}

      {/* Render */}
      {tab === "team" && showTeam ? <TeamAnalyticsPage /> : <SelfAnalyticsPage />}
    </div>
  );
}
