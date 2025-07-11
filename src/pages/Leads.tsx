import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UploadLeadDialog } from "@/components/UploadLeadDialog";
import { AssignTeamDialog } from "@/components/AssignTeamDialog";
import { LeadTable } from "@/components/LeadTable";
import { LeadStatuses } from "@/contants/status.constant";
import { fetchLeads } from "@/services/leads.services";
import { fetchTeamMembers, fetchTeams, type TeamResponse, type TeamMembersResponse } from "@/services/team.services";
import { assignLeadToTeam, assignLeadToTeamMemebers, updateLeadState } from "@/services/assignLeads.services";
import type { Leads } from "@/types/leads";
import { useAuthStore } from "@/store/AuthStore";
import { Roles } from "@/contants/role.constant";
import { addTicketAmount } from "@/services/leads.services";


export default function LeadsPage() {
  const [leads, setLeads] = useState<Leads[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("NEWLY_GENERATED");
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembersResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [ticketAmounts, setTicketAmounts] = useState<{ id: number; value: string }[]>([]);

const getLeads = async (
  page: number,
  search: string,
  status: string
) => {
  if (!user?.role) return;
  setLoading(true);
  try {
    const response = await fetchLeads(page, search, status);
    setLeads(response.data);
    setTotalPages(response.meta.totalPages);
  } catch (error) {
    console.error("Error fetching leads:", error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  getLeads(page, search, statusFilter);
}, [user, page, search, statusFilter]);

  const handleAssigntoTeam = async () => {
    if (!selectedTeam || selectedLeads.length === 0) return;
    setAssignLoading(true);
    try {
      const res = await assignLeadToTeam(Number(selectedTeam), selectedLeads.map(String));
      if (res) {
        const data = await fetchLeads(page, search, statusFilter);
        setLeads(data.data);
        setSelectedLeads([]);
        setSelectedTeam("");
        setIsAssignDialogOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssigntoTeamMember = async () => {
    if (!selectedTeam || selectedLeads.length === 0) return;
    setAssignLoading(true);
    try {
      const res = await assignLeadToTeamMemebers(Number(selectedTeam), selectedLeads.map(String));
      if (res) {
        const data = await fetchLeads(page, search, statusFilter);
        setLeads(data.data);
        setSelectedLeads([]);
        setSelectedTeam("");
        setIsAssignDialogOpen(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedLeads(selectedLeads.length === leads.length ? [] : leads.map((lead) => lead.id));
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  // ✅ Handle typing
  const handleTicketChange = (id: number, value: string) => {
    setTicketAmounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  // ✅ Handle blur API call
  const handleTicketBlur = async (id: number) => {
    const current = ticketAmounts.find((t) => t.id === id);
    if (!current) return;

    const amount = parseFloat(current.value);
    if (isNaN(amount)) return;

    try {
      const response = await addTicketAmount(id.toString(), amount);
      if (response) {
       await getLeads(page, search, statusFilter);
      }
    } catch (err) {
      console.error("Error updating ticketAmount", err);
    }
  };

  //Handle state change
const handleStatusChange = async (leadId: number, newStatus: string) => {
  try {
    const response = await updateLeadState(Number(leadId), newStatus.toUpperCase());
    if (response) {
      await getLeads(page, search, statusFilter);
    }
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};

  const loadTeamData = async (role: string) => {
    try {
      if (role === Roles.LEAD_MANAGER) {
        const teams = await fetchTeams();
        console.log(teams)
        setTeams(teams);
      } else if (role === Roles.EXECUTIVE) {
        const response = await fetchTeamMembers(); // hypothetical
        setTeamMembers(response); // define this state
      }
    } catch (err) {
      console.error("Failed to load team data", err);
    } finally {
      setTeamsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      loadTeamData(user.role);
    }
  }, [user?.role]);


  return (
    <div className="p-3">
      <UploadLeadDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
      <AssignTeamDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedLeadsCount={selectedLeads.length}
        onAssign={handleAssigntoTeam}
        onAssignToMember={handleAssigntoTeamMember}

        loading={assignLoading}
        teams={teams}
        teamMembers={teamMembers}
        teamsLoading={teamsLoading}

      />

      <Card className="p-4">
        <CardContent>
          <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <h2 className="text-xl font-semibold">All Leads</h2>
            <div className="flex flex-wrap gap-2">
              {user?.role !== Roles.INTERN && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  Upload Leads
                </Button>
              )}

              <Button
                variant="outline"
                disabled={!selectedLeads.length}
                onClick={() => setSelectedLeads([])}
              >
                Clear Selection
              </Button>
              <Button
                disabled={!selectedLeads.length || teamsLoading}
                onClick={() => setIsAssignDialogOpen(true)}
              >
                Assign to {user?.role !== Roles.LEAD_MANAGER ? "Members" : "Teams"} ({selectedLeads.length})
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="min-w-[220px] w-fit px-2 py-1">
                {LeadStatuses.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-sm px-3 py-2"
                  >
                    {s
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
          </div>

          <LeadTable
            leads={leads}
            loading={loading}
            selectedLeads={selectedLeads}
            setSelectedLeads={setSelectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            handleTicketBlur={handleTicketBlur}
            handleTicketChange={handleTicketChange}
            setTicketAmounts={setTicketAmounts}
            ticketAmounts={ticketAmounts}

            onStatusChange={handleStatusChange}

          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <Button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} variant="outline">
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value);
                  if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
                }}
                className="w-20"
              />
            </div>
            <Button
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
