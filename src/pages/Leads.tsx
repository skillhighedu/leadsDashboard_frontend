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
import { getLeadStatusesByRole } from "@/utils/get-lead-statuses-by-role";
import {
  deleteLead,
  fetchLeads,
  updateReferredBy,
} from "@/services/leads.services";
import {
  fetchTeamMembers,
  fetchTeams,
  type TeamResponse,
  type TeamMembersResponse,
} from "@/services/team.services";
import {
  assignLeadToTeam,
  assignLeadToTeamMemebers,
  updateLeadState,
} from "@/services/assignLeads.services";
import type { Leads } from "@/types/leads";
import { useAuthStore } from "@/store/AuthStore";
import { Roles } from "@/constants/role.constant";
import {
  addTicketAmount,
  updateUpFrontAmount,
} from "@/services/leads.services";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function LeadsPage() {
  //   const allowedRoles: Roles[] = [Roles.VERTICAL_MANAGER, Roles.EXECUTIVE];
  const [referredByInputs, setReferredByInputs] = useState<
    { id: number; value: string; originalValue: string }[]
  >([]);

  const [leads, setLeads] = useState<Leads[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(() => {
    if (
      user?.role === Roles.VERTICAL_MANAGER ||
      user?.role === Roles.MARKETING_HEAD ||
      user?.role === Roles.LEAD_GEN_MANAGER
    )
      return "NEWLY_GENERATED";
    return "ASSIGNED";
  });
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembersResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [ticketAmounts, setTicketAmounts] = useState<
    { id: number; value: string }[]
  >([]);
  const [upFrontFees, setUpFrontFees] = useState<
    { id: number; value: string }[]
  >([]);

  const [date, setDate] = useState<Date | undefined>(undefined);

  const availableStatuses = getLeadStatusesByRole(
    (user?.role as Roles) ?? Roles.MARKETING_HEAD
  );

  const getLeads = async (
    page: number,
    search: string,
    status: string,
    day?: string
  ) => {
    if (!user?.role) return;
    setLoading(true);
    try {
      const response = await fetchLeads(page, search, status, day);
      setLeads(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formatted = date ? format(date, "yyyy-MM-dd") : undefined;
    getLeads(page, search, statusFilter, formatted);
  }, [user, page, search, statusFilter, date]);

  useEffect(() => {
    const referredData = leads.map((lead) => ({
      id: lead.id,
      value: lead.referredBy ?? "",
      originalValue: lead.referredBy ?? "",
    }));
    setReferredByInputs(referredData);
  }, [leads]);

  const handleReferredByChange = (id: number, value: string) => {
    setReferredByInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleReferredByBlur = async (id: number) => {
    const referred = referredByInputs.find((r) => r.id === id);
    if (!referred) return;

    // ✅ Avoid API call if nothing changed or input is empty
    if (
      referred.value.trim() === (referred.originalValue?.trim() ?? "") ||
      referred.value.trim() === ""
    ) {
      return;
    }

    try {
      const res = await updateReferredBy(id, { referrerEmail: referred.value });

      if (res) {
        toast.success("Referred by updated successfully.");

        // ✅ Update original value locally to avoid re-triggering
        setReferredByInputs((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, originalValue: referred.value } : r
          )
        );

        await getLeads(page, search, statusFilter);
      }
    } catch (error) {
      // toast.error(
      //   error?.response?.data?.message || "Failed to update referred by."
      // );
      console.error("Failed to update referred by:", error);
    }
  };

  const handleAssigntoTeam = async () => {
    if (!selectedTeam || selectedLeads.length === 0) return;
    setAssignLoading(true);
    try {
      const res = await assignLeadToTeam(
        Number(selectedTeam),
        selectedLeads.map(String)
      );
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
      const res = await assignLeadToTeamMemebers(
        Number(selectedTeam),
        selectedLeads.map(String)
      );
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
    setSelectedLeads(
      selectedLeads.length === leads.length ? [] : leads.map((lead) => lead.id)
    );
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // ✅ Handle typing
  const handleTicketChange = (id: number, value: string) => {
    setTicketAmounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  // ✅ Handle typing
  const handleUpFrontChange = (id: number, value: string) => {
    setUpFrontFees((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleTicketBlur = async (id: number) => {
    const ticket = ticketAmounts.find((t) => t.id === id);

    if (!ticket) return;

    const ticketValue = parseFloat(ticket.value);
    if (isNaN(ticketValue) || ticketValue <= 0) return;

    try {
      const response = await addTicketAmount(id.toString(), ticketValue);
      if (response) {
        await getLeads(page, search, statusFilter);
      }
    } catch (err) {
      console.error("Error updating ticket amount:", err);
    }
  };
  const handleUpFrontBlur = async (id: number) => {
    const upFrontFee = upFrontFees.find((t) => t.id === id);

    if (!upFrontFee) return;

    const upFrontFeeValue = parseFloat(upFrontFee.value);
    if (isNaN(upFrontFeeValue) || upFrontFeeValue <= 0) return;

    try {
      const response = await updateUpFrontAmount(
        id.toString(),
        upFrontFeeValue
      );
      if (response) {
        await getLeads(page, search, statusFilter);
      }
    } catch (err) {
      console.error("Error updating ticket amount:", err);
    }
  };

  //Handle state change
  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const response = await updateLeadState(
        Number(leadId),
        newStatus.toUpperCase()
      );
      if (response) {
        await getLeads(page, search, statusFilter);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteLead = async (uuid: string, name: string) => {
    try {
      await deleteLead(uuid);
      toast.success(`Lead ${name} deleted successfully`);
      await getLeads(page, search, statusFilter);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lead");
    }
  };

  const loadTeamData = async (role: string) => {
    try {
      if (
        role === Roles.VERTICAL_MANAGER ||
        role === Roles.MARKETING_HEAD ||
        user?.role === Roles.LEAD_GEN_MANAGER
      ) {
        const teams = await fetchTeams();
        console.log(teams);
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
      <UploadLeadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        refreshLeads={() => getLeads(page, search, statusFilter)}
      />
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
              {user?.role !== Roles.INTERN && user?.role !== Roles.TL_IC && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  Upload Leads
                </Button>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {date ? format(date, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selected) => selected && setDate(selected)}
                    captionLayout="dropdown"
                    showOutsideDays
                    weekStartsOn={1}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="secondary"
                      className="w-1/2"
                      onClick={() => setDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-1/2"
                      onClick={() => setDate(subDays(new Date(), 1))}
                    >
                      Yesterday
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

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
                Assign to{" "}
                {user?.role !== Roles.MARKETING_HEAD ? "Members" : "Teams"} (
                {selectedLeads.length})
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
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s} className="text-sm px-3 py-2">
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
            handleUpFrontBlur={handleUpFrontBlur}
            handleUpFrontChange={handleUpFrontChange}
            setTicketAmounts={setTicketAmounts}
            ticketAmounts={ticketAmounts}
            upFrontFees={upFrontFees} // ✅ new
            setUpFrontFee={setUpFrontFees} // ✅ new
            onStatusChange={handleStatusChange}
            handleDeleteLead={handleDeleteLead}
            canDelete={
              user?.role !== Roles.INTERN && user?.role !== Roles.TL_IC
            }
            referredByInputs={referredByInputs}
            handleReferredByBlur={handleReferredByBlur}
            handleReferredByChange={handleReferredByChange}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <Button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              variant="outline"
            >
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
