import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { fetchTeams, type Team } from "@/services/team.services"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function AddTeam() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTeams = async () => {
      try {
        setLoading(true)
        const data = await fetchTeams()
        setTeams(data)
      } catch (error) {
        toast.error("Failed to fetch teams")
      } finally {
        setLoading(false)
      }
    }

    getTeams()
  }, [])

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
              className="hover:shadow-xl transition border border-border rounded-2xl"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  {team.teamName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Lead:</span>{" "}
                  {team.teamLead?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Members:</span>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {team.employees.map((member) => (
                      <li key={member.id}>
                        <span className="text-foreground">{member.name}</span> –{" "}
                        {member.User[0]?.email ?? "N/A"} (
                        {member.User[0]?.role?.name ?? "N/A"})
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
