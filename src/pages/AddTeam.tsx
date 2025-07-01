import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchExecutives, createTeam } from "@/services/team.services"
import { Loader2 } from "lucide-react"

interface Employee {
  id: number
  name: string
}

export default function AddTeam() {
  const [teamName, setTeamName] = useState("")
  const [teamLeadId, setTeamLeadId] = useState<number | null>(null)
  const [colorCode, setColorCode] = useState<string >("#000000")

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const getExecutives = async () => {
      try {
        setLoading(true)
        const response = await fetchExecutives()
        setEmployees(response)
      } catch (error) {
        console.error("Failed to fetch executives", error)
      } finally {
        setLoading(false)
      }
    }

    getExecutives()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName || !teamLeadId) {
      alert("Please fill all fields")
      return
    }

    const payload = {
      teamName,
      teamLeadId,
      colorCode
    }

    try {
      setCreating(true)
      await createTeam(payload)
      alert("Team created successfully!")
      setTeamName("")
      setTeamLeadId(null)
    } catch (error) {
      console.error("Failed to create team", error)
      alert("Failed to create team")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Create New Team</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Team Name */}
        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
       <div className="space-y-2">
  <Label htmlFor="colorCode">Team Color</Label>
  <div className="flex items-center gap-3">
    <input
      type="color"
      id="colorCode"
      value={colorCode}
      onChange={(e) => setColorCode(e.target.value)}
      className="w-10 h-10 rounded border border-gray-300 p-0"
    />
    <span className="text-sm text-gray-600">{colorCode}</span>
  </div>
</div>

        {/* Team Lead Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="teamLead">Team Lead</Label>
          {loading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading executives...
            </div>
          ) : (
            <Select
              onValueChange={(value) => setTeamLeadId(Number(value))}
              value={teamLeadId?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={creating}>
          {creating ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            "Create Team"
          )}
        </Button>
      </form>
    </div>
  )
}
