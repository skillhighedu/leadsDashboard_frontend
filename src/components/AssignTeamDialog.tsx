// components/AssignTeamDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { useStore } from "@/context/useStore" 

interface Team {
  id: string
  name: string
}

interface AssignTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLeadsCount: number
  selectedTeam: string
  setSelectedTeam: (id: string) => void
  onAssign: () => void
  loading: boolean
  teams: Team[]
  teamsLoading: boolean
}


export function AssignTeamDialog({
  open,
  onOpenChange,
  selectedLeadsCount,
  selectedTeam,
  setSelectedTeam,
  onAssign,
  loading,
  teams,
  teamsLoading,
}: AssignTeamDialogProps)
  
 {
const {user} = useStore()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Leads to {user?.role !== "leadManager"? "Member": "team"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Assign {selectedLeadsCount} selected lead{selectedLeadsCount > 1 ? "s" : ""} to a team
          </p>
          <Select value={selectedTeam} onValueChange={setSelectedTeam} disabled={teamsLoading}>
            <SelectTrigger>
              <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select a team"} />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAssign} disabled={loading || !selectedTeam || teamsLoading}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


