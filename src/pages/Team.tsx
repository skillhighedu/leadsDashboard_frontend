import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { fetchTeams, type TeamResponse, deleteTeam, type DeleteTeamResponse, addMemberToTeam, removeMemberFromTeam, type TeamMemberResponse } from "@/services/team.services"
import { fetchEmployes, type Employee } from "@/services/employes.services"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

export default function AddTeam() {
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<{ [teamId: number]: string }>({})
  const [addingMemberId, setAddingMemberId] = useState<number | null>(null)
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  console.log(selectedEmployee)
  useEffect(() => {
    const getTeams = async () => {
      try {
        setLoading(true)
        const data = await fetchTeams()
        setTeams(data)
        console.log('Fetched teams:', data)
      } catch (e) {
        console.error('Failed to fetch teams', e)
        toast.error("Failed to fetch teams")
        setTeams([])
      } finally {
        setLoading(false)
      }
    }
    const getEmployees = async () => {
      try {
        const data = await fetchEmployes()
        setEmployees(Array.isArray(data) ? data : [])
        console.log('Fetched employees:', data)
      } catch (e) {
        console.error('Failed to fetch employees', e)
        toast.error("Failed to fetch employees")
        setEmployees([])
      }
    }
    getTeams()
    getEmployees()
  }, [])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const res: DeleteTeamResponse = await deleteTeam(id)
      setTeams((prev) => prev.filter((team) => team.id !== id))
      toast.success(res.message)
    } catch {
      toast.error("Failed to delete team")
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddMember = async (teamId: number) => {
    const employeeId = selectedEmployee[teamId]
    if (!employeeId || employeeId === "") return toast.error("Select an employee to add")
    setAddingMemberId(teamId)
    try {
      const res: TeamMemberResponse = await addMemberToTeam(teamId, { employeeId: Number(employeeId) })
      const emp = employees.find(e => e.id === Number(employeeId));
      if (emp) {
        const newMember = {
          id: emp.id,
          uuid: emp.uuid,
          name: emp.name,
          User: [
            {
              email: emp.email,
              role: { name: emp.roleName }
            }
          ]
        };
        setTeams(prev => prev.map(team => team.id === teamId ? { ...team, employees: [...team.employees, newMember] } : team))
      }
      toast.success(res.message)
      setSelectedEmployee(prev => ({ ...prev, [teamId]: "" }))
    } catch {
      toast.error("Failed to add member")
    } finally {
      setAddingMemberId(null)
    }
  }

  const handleRemoveMember = async (teamId: number, employeeId: number) => {
    setRemovingMemberId(employeeId)
    try {
      const res: TeamMemberResponse = await removeMemberFromTeam(teamId, { employeeId })
      setTeams(prev => prev.map(team => team.id === teamId ? { ...team, employees: team.employees.filter(e => e.id !== employeeId) } : team))
      toast.success(res.message)
    } catch {
      toast.error("Failed to remove member")
    } finally {
      setRemovingMemberId(null)
    }
  }

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
        <p className="text-muted-foreground">No teams found. Create your first team!</p>
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
                  {team.teamLeadId}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Members:</span>
                  <ul className="mt-1 list-disc list-inside space-y-1 flex flex-col gap-1">
                    {team.employees.map((member) => (
                      <li key={member.id} className="flex flex-wrap items-center gap-2 break-words max-w-full">
                        <span className="text-foreground break-words">{member.name}</span> – <span className="break-all">{member.User[0]?.email ?? "N/A"}</span> (<span className="break-words">{member.User[0]?.role?.name ?? "N/A"}</span>)
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleRemoveMember(team.id, member.id)}
                          disabled={removingMemberId === member.id || member.id === team.teamLeadId}
                        >
                          {removingMemberId === member.id ? "Removing..." : "Remove"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                  <div className="w-full max-w-[180px]">
                    <Select
                      value={selectedEmployee[team.id]}
                      onValueChange={val => setSelectedEmployee(prev => ({ ...prev, [team.id]: val }))}
                    >
                      <SelectTrigger className="w-full">Select Employee</SelectTrigger>
                      <SelectContent>
                        {employees
                          .filter(e => !team.employees.some(m => m.id === e.id) && e.id !== team.teamLeadId)
                          .map(e => (
                            <SelectItem key={e.id} value={String(e.id)}>
                              {e.name} ({e.email})
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
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(team.id)}
                  disabled={deletingId === team.id}
                >
                  {deletingId === team.id ? "Deleting..." : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
