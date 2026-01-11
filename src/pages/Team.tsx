// Updated AddTeam Component with Better UI/UX
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  fetchTeams,
  type TeamResponse,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  fetchInterns,
  type InternsResponse,
  editTeam,
  fetchExecutives,
} from "@/services/team.services";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { handleApiError } from "@/utils/errorHandler";


export default function AddTeam() {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [interns, setInterns] = useState<InternsResponse[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<{ [teamId: number]: string }>({});
  const [executives, setExecutives] = useState<InternsResponse[]>([]);
  const [addingMemberId, setAddingMemberId] = useState<number | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamResponse | null>(null);
  const [editForm, setEditForm] = useState({
    teamName: "",
    colorCode: "",
    teamLeadId: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [teamsData, internsData, execsData] = await Promise.all([
          fetchTeams(),
          fetchInterns(),
          fetchExecutives(),
        ]);
        setTeams(teamsData);
        setInterns(internsData);
        setExecutives(execsData);
      } catch (err) {
        handleApiError(err)
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await deleteTeam(id);
      setTeams((prev) => prev.filter((team) => team.id !== id));
      
      toast.success(res.message);
    } catch {
      toast.error("Failed to delete team");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddMember = async (teamId: number) => {
    const internId = selectedIntern[teamId];
    if (!internId) return toast.error("Select an intern to add");
    setAddingMemberId(teamId);
    try {
      const res = await addMemberToTeam(teamId, { employeeId: Number(internId) });
      toast.success(res.message);
      setSelectedIntern((prev) => ({ ...prev, [teamId]: "" }));
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch {
      toast.error("Failed to add member");
    } finally {
      setAddingMemberId(null);
    }
  };

  const handleRemoveMember = async (teamId: number, employeeId: number) => {
    setRemovingMemberId(employeeId);
    try {
      const res = await removeMemberFromTeam(teamId, { employeeId });
      toast.success(res.message);
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleOpenEdit = (team: TeamResponse) => {
    setEditingTeam(team);
    setEditForm({
      teamName: team.teamName,
      colorCode: team.colorCode,
      teamLeadId: team.teamLeadId,
    });
  };

  const handleEditSubmit = async () => {
    if (!editingTeam) return;
    try {
      await editTeam(editingTeam.id, {
        teamName: editForm.teamName,
        colorCode: editForm.colorCode,
        teamLeadId: editForm.teamLeadId,
      });
      toast.success("Team updated successfully");
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
      setEditingTeam(null);
    } catch {
      toast.error("Failed to update team");
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h2>
        <Button asChild className="px-5 py-2 text-base">
          <a href="/create_team">+ Create Team</a>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <p className="text-muted-foreground text-center text-lg">No teams found. Create your first team!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 ls-4 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="rounded-2xl border hover:shadow-lg">
              <div className="h-2 rounded-t-2xl" style={{ backgroundColor: team.colorCode || "#ccc" }} />
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{team.teamName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Lead:</span> {team.teamLead.name || "Unassigned"}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Members:</span>
                  <ul className="mt-2 space-y-2">
                    {team.employees.map((member) => (
                      <li key={member.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-foreground">{member.name}</span> –
                          <span className="ml-1 text-xs">{member.User[0]?.email || "N/A"}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={removingMemberId === member.id || member.id === team.teamLeadId}
                          onClick={() => handleRemoveMember(team.id, member.id)}
                        >
                          {removingMemberId === member.id ? "Removing..." : "Remove"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={selectedIntern[team.id]}
                    onValueChange={(val) => setSelectedIntern((prev) => ({ ...prev, [team.id]: val }))}
                  >
                    <SelectTrigger>
                      {selectedIntern[team.id]
                        ? interns.find((i) => String(i.id) === selectedIntern[team.id])?.name || "Select Intern"
                        : "Select Intern"}
                    </SelectTrigger>
                    <SelectContent>
                      {interns
                        .filter((i) =>
                          !team.employees.some((m) => m.id === i.id) && i.id !== team.teamLeadId
                        )
                        .map((intern) => (
                          <SelectItem key={intern.id} value={String(intern.id)}>
                            {intern.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="secondary"
                    onClick={() => handleAddMember(team.id)}
                    disabled={addingMemberId === team.id}
                  >
                    {addingMemberId === team.id ? "Adding..." : "Add Member"}
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === team.id ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Team</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {team.teamName}?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() =>setDeletingId(null)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(team.id)}
                          disabled={deletingId === team.id}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editingTeam?.id === team.id} onOpenChange={(o) => !o && setEditingTeam(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleOpenEdit(team)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Team</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Label>Team Name</Label>
                        <Input
                          value={editForm.teamName}
                          onChange={(e) => setEditForm((f) => ({ ...f, teamName: e.target.value }))}
                        />
                        <Label>Color</Label>
                        <Input
                          type="color"
                          className="w-12 h-12 p-0 rounded"
                          value={editForm.colorCode}
                          onChange={(e) => setEditForm((f) => ({ ...f, colorCode: e.target.value }))}
                        />
                        <Label>Team Lead</Label>
                        <Select
                          value={String(editForm.teamLeadId)}
                          onValueChange={(val) => setEditForm((f) => ({ ...f, teamLeadId: Number(val) }))}
                        >
                          <SelectTrigger>
                            {executives.find((i) => i.id === editForm.teamLeadId)?.name || "Select Team Lead"}
                          </SelectTrigger>
                          <SelectContent>
                            {executives.map((exec) => (
                              <SelectItem key={exec.id} value={String(exec.id)}>
                                {exec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTeam(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditSubmit}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
