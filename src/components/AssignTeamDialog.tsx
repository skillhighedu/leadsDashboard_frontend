// components/AssignTeamDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/AuthStore";
import type { TeamMembersResponse, TeamResponse } from "@/services/team.services";
import { Roles } from "@/constants/role.constant";

interface AssignTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeadsCount: number;
  selectedTeam: string;
  setSelectedTeam: (id: string) => void;
  onAssign: () => void;
  onAssignToMember: () => void;
  loading: boolean;
  teams: TeamResponse[];
  teamMembers: TeamMembersResponse[];
  teamsLoading: boolean;
}

export function AssignTeamDialog({
  open,
  onOpenChange,
  selectedLeadsCount,
  selectedTeam,
  setSelectedTeam,
  onAssign,
  onAssignToMember,
  loading,
  teams,
  teamMembers,
  teamsLoading,
}: AssignTeamDialogProps) {
  const { user } = useAuthStore();
  const isExecutive = user?.role === Roles.EXECUTIVE;
  const isLeadManager = user?.role === Roles.LEAD_MANAGER;

  const handleAssign = () => {
    isExecutive ? onAssignToMember() : onAssign();
  };

  const getPlaceholder = () => {
    if (teamsLoading) return "Loading options...";
    return isExecutive ? "Select a team member" : "Select a team";
  };

  const isAssignDisabled = loading || !selectedTeam || teamsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Assign Leads to {isExecutive ? "Team Member" : "Team"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            You are about to assign <strong>{selectedLeadsCount}</strong>{" "}
            lead{selectedLeadsCount !== 1 && "s"}.
          </p>

          <Select value={selectedTeam} onValueChange={setSelectedTeam} disabled={teamsLoading}>
            <SelectTrigger>
              <SelectValue placeholder={getPlaceholder()} />
            </SelectTrigger>
            <SelectContent>
              {teamsLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Loading...</div>
              ) : isExecutive ? (
                teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                      
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No members available</div>
                )
              ) : (
              teams.map((team) => (
  <SelectItem key={team.id} value={team.id.toString()}>
    <div className="flex items-center gap-2 cursor-pointer">
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: team.colorCode || "#d1d5db" }} 
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{team.teamName}</span>
        <span className="text-xs text-muted-foreground">
          {team.employees.length} member{team.employees.length !== 1 && "s"}
        </span>
      </div>
    </div>
  </SelectItem>
))

              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isAssignDisabled}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
