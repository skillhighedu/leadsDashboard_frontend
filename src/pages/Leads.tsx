/* File: pages/LeadsPage.tsx */
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { UploadLeadDialog } from "@/components/UploadLeadDialog"
import { AssignTeamDialog } from "@/components/AssignTeamDialog"
import { LeadTable } from "@/components/LeadTable"

import { fetchLeads } from "@/services/leads.services"
import { fetchTeamLeads, fetchTeams, type Team } from "@/services/team.services"
import { assignLeadToTeam } from "@/services/assignLeads.services"
import type { Leads } from "@/types/leads"
import { useAuthStore } from "@/store/AuthStore"
import { Roles } from "@/contants/role.constant"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Leads[]>([])
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const { user} = useAuthStore()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])
  const [selectedTeam, setSelectedTeam] = useState("")
  const [assignLoading, setAssignLoading] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(true)


  
  useEffect(() => {
    const getLeads = async () => {
      setLoading(true)
      try {
        if(user && user.role === Roles.LEAD_MANAGER) {
          const data = await fetchLeads(page)
          setLeads(data.data)
          setTotalPages(data.meta.totalPages)
        } else {
          const data = await fetchTeamLeads()
          setLeads(data.data)
          setTotalPages(data.meta.totalPages)
        }
      } catch (err: unknown) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getLeads()
  }, [user, page, statusFilter])

  useEffect(() => {
    const getTeams = async () => {
      setTeamsLoading(true)
      try {
        const data = await fetchTeams()
        setTeams(data.map((team: Team) => ({
          id: String(team.id),
          name: team.teamName ?? ""
        })))
      } catch (err: unknown) {
        console.error(err)
      } finally {
        setTeamsLoading(false)
      }
    }
    getTeams()
  }, [])

  const filteredLeads = useMemo(() => {
    return leads && leads.filter(lead => Object.values(lead).join(" ").toLowerCase().includes(search.toLowerCase()))
  }, [leads, search])

  const handleAssign = async () => {
    if (!selectedTeam || selectedLeads.length === 0) return
    setAssignLoading(true)
    try {
      const res = await assignLeadToTeam(Number(selectedTeam), selectedLeads.map(String))
      if (res) {
        await fetchLeads()
        setLeads(prev =>
          prev.map(lead =>
            selectedLeads.includes(lead.id) ? { ...lead, teamId: Number(selectedTeam) } : lead
          )
        )
        setSelectedLeads([])
        setSelectedTeam("")
        setIsAssignDialogOpen(false)
      }
    } catch (err: unknown) {
      console.log(err)
    } finally {
      setAssignLoading(false)
    }
  }

  const handleSelectAll = () => {
    setSelectedLeads(selectedLeads.length === filteredLeads.length ? [] : filteredLeads.map(lead => lead.id))
  }
  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    )
  }
  return (
    <div className="p-3">
      <UploadLeadDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
      <AssignTeamDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}                // <-- Add this
        selectedLeadsCount={selectedLeads.length}        // <-- And this
        onAssign={handleAssign}
        loading={assignLoading}
        teams={teams}
        teamsLoading={teamsLoading}
      />

      <Card className="p-4">
        <CardContent>
          <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <h2 className="text-xl font-semibold">All Leads</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsUploadDialogOpen(true)}>Upload Leads</Button>
              <Button variant="outline" disabled={!selectedLeads.length} onClick={() => setSelectedLeads([])}>
                Clear Selection
              </Button>
              <Button disabled={!selectedLeads.length || teamsLoading} onClick={() => setIsAssignDialogOpen(true)}>
                Assgin to {user?.role !=="leadManager"?"Members":"Teams"} ({selectedLeads.length})
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {['all', 'new', 'contacted', 'qualified', 'lost'].map(s => (
                  <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <LeadTable
            leads={filteredLeads}
            loading={loading}
            selectedLeads={selectedLeads}
            setSelectedLeads={setSelectedLeads}
            onSelectLead={handleSelectLead}      // <-- Add this
            onSelectAll={handleSelectAll}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <Button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} variant="outline">Previous</Button>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value)
                  if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
                }}
                className="w-20"
              />
            </div>
            <Button disabled={page === totalPages || loading} onClick={() => setPage(page + 1)} variant="outline">Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}