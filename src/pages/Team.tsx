import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  fetchTeams,
  type TeamResponse,
  deleteTeam,
  type DeleteTeamResponse,
  addMemberToTeam,
  removeMemberFromTeam,
  type TeamMemberResponse,
  fetchInterns,
  type InternsResponse,
  editTeam,
  fetchExecutives,
} from "@/services/team.services";
// import { fetchEmployes, type Employee } from "@/services/employes.services"
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

export default function AddTeam() {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [interns, setInterns] = useState<InternsResponse[]>([]);
  //   const [employees, setEmployees] = useState<Employee[]>([])
  //   const [selectedEmployee, setSelectedEmployee] = useState<{
  //     [teamId: number]: string;
  //   }>({});
  const [selectedIntern, setSelectedIntern] = useState<{
    [teamId: number]: string;
  }>({});

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
    const getTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchTeams();
        setTeams(data);
      } catch (e) {
        console.error("Failed to fetch teams", e);
        toast.error("Failed to fetch teams");
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    const getExecutives = async () => {
      try {
        setLoading(true);
        const data = await fetchExecutives();
        console.log(data);
        setExecutives(data);
      } catch (e) {
        console.error("Failed to fetch executives", e);
        toast.error("Failed to fetch executives");
        setExecutives([]);
      } finally {
        setLoading(false);
      }
    };

    const getInterns = async () => {
      try {
        setLoading(true);
        const data = await fetchInterns();
        setInterns(data);
      } catch (e) {
        console.error("Failed to fetch teams", e);
        toast.error("Failed to fetch teams");
        setInterns([]);
      } finally {
        setLoading(false);
      }
    };

    getExecutives();
    getInterns();
    getTeams();
    // getEmployees()
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res: DeleteTeamResponse = await deleteTeam(id);
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
    if (!internId || internId === "")
      return toast.error("Select an intern to add");
    setAddingMemberId(teamId);

    try {
      const res: TeamMemberResponse = await addMemberToTeam(teamId, {
        employeeId: Number(internId),
      });

      toast.success(res.message);
      setSelectedIntern((prev) => ({ ...prev, [teamId]: "" }));

      // ✅ Refresh teams so the new member appears
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
      const res: TeamMemberResponse = await removeMemberFromTeam(teamId, {
        employeeId,
      });
      //   setTeams(prev => prev.map(team => team.id === teamId ? { ...team, employees: team.employees.filter(e => e.id !== employeeId) } : team))
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
        colerCode: editForm.colorCode,
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
    <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Teams
        </h2>
        <Button asChild className="text-base px-4 py-2">
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
        <p className="text-muted-foreground">
          No teams found. Create your first team!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-xl transition border border-border rounded-2xl max-w-xs w-full"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground break-words">
                  {team.teamName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 break-words overflow-x-auto">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Lead:</span>{" "}
                  {team.teamLead.name ?? "No lead assigined"}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Members:
                  </span>
                  <ul className="mt-1 list-disc list-inside space-y-1 flex flex-col gap-1">
                    {team.employees.map((member) => (
                      <li
                        key={member.id}
                        className="flex flex-wrap items-center gap-2 break-words max-w-full"
                      >
                        <span className="text-foreground break-words">
                          {member.name}
                        </span>{" "}
                        –{" "}
                        <span className="break-all">
                          {member.User[0]?.email ?? "N/A"}
                        </span>{" "}
                        (
                        <span className="break-words">
                          {member.User[0]?.role?.name ?? "N/A"}
                        </span>
                        )
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleRemoveMember(team.id, member.id)}
                          disabled={
                            removingMemberId === member.id ||
                            member.id === team.teamLeadId
                          }
                        >
                          {removingMemberId === member.id
                            ? "Removing..."
                            : "Remove"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                  <div className="w-full max-w-[180px]">
                    <Select
                      value={selectedIntern[team.id]}
                      onValueChange={(val) =>
                        setSelectedIntern((prev) => ({
                          ...prev,
                          [team.id]: val,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        {selectedIntern[team.id]
                          ? interns.find(
                              (i) => String(i.id) === selectedIntern[team.id]
                            )?.name ?? "Select Intern"
                          : "Select Intern"}
                      </SelectTrigger>

                      <SelectContent>
                        {interns
                          .filter(
                            (intern) =>
                              !team.employees.some((m) => m.id === intern.id) &&
                              intern.id !== team.teamLeadId
                          )
                          .map((intern) => (
                            <SelectItem
                              key={intern.id}
                              value={String(intern.id)}
                            >
                              {intern.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleAddMember(team.id)}
                    disabled={addingMemberId === team.id}
                    className="w-full sm:w-auto"
                  >
                    {addingMemberId === team.id ? "Adding..." : "Add Member"}
                  </Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingId === team.id ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete <b>{team.teamName}</b>?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(team.id)}
                        disabled={deletingId === team.id}
                      >
                        {deletingId === team.id ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={editingTeam?.id === team.id}
                  onOpenChange={(open) => !open && setEditingTeam(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEdit(team)}
                    >
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
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            teamName: e.target.value,
                          }))
                        }
                      />
                      <Label>Color Code</Label>
                      <Input
                        type="color"
                        value={editForm.colorCode}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            colorCode: e.target.value,
                          }))
                        }
                        className="w-10 h-10 rounded border border-gray-300 p-0"
                      />
                      <Label>Team Lead</Label>
                      <Select
                        value={String(editForm.teamLeadId)}
                        onValueChange={(val) =>
                          setEditForm((f) => ({
                            ...f,
                            teamLeadId: Number(val),
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          {executives.find((i) => i.id === editForm.teamLeadId)
                            ?.name ?? "Select Team Lead"}
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
                      <Button
                        variant="outline"
                        onClick={() => setEditingTeam(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleEditSubmit}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
