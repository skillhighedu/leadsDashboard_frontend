import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { fetchTeams } from "@/services/team.services"

interface Team {
  id: string
  teamName: string
}

export default function AddTeam() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const getTeams = async () => {
      try {
        setLoading(true)
        const response = await fetchTeams()
        setTeams(response.map((team: any) => ({
          ...team,
          id: String(team.id),
        })))
      } catch (err) {
        console.error("Failed to fetch teams", err)
      } finally {
        setLoading(false)
      }
    }

    getTeams()
  }, [])

  const toggleDropdown = (teamId: string) => {
    setOpenDropdown(openDropdown === teamId ? null : teamId)
  }

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Teams
        </h2>
        <Link to="/create_team">
          <Button className="text-base px-4 py-2">
            + Create Team
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading teams...</p>
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
              <CardContent>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full text-base"
                    onClick={() => toggleDropdown(team.id)}
                  >
                    Team Members
                  </Button>
                  {openDropdown === team.id && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg">
                      <ul className="py-1">
                        <li>
                          <Link
                            to={`/team/${team.id}/members`}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            View Members
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/team/${team.id}/add-member`}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Add Member
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/team/${team.id}/roles`}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Manage Roles
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}