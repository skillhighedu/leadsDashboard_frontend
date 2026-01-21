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
  unAssginLead,
  updateReferredBy,
  addComment,
  selfGenStatus,
  deleteManyLeads, // ✅ NEW: import addComment service
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
  unAssignTeamLeads,
  unAssignTeamMemberLeads,
  updateLeadState,
} from "@/services/assignLeads.services";
import type { Leads } from "@/types/leads";
import { useAuthStore } from "@/store/AuthStore";
import { Roles } from "@/constants/role.constant";
import { addTicketAmount } from "@/services/leads.services";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { handleApiError } from "@/utils/errorHandler";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { BulkActionsDropdown } from "@/features/leads/components/Actions";

export default function LeadsPage() {
  //   const allowedRoles: Roles[] = [Roles.VERTICAL_MANAGER, Roles.EXECUTIVE];
  const [referredByInputs, setReferredByInputs] = useState<
    { id: number; value: string; originalValue: string }[]
  >([]);

  // ✅ NEW: comment inputs tracked by uuid
  const [commentInputs, setCommentInputs] = useState<
    { uuid: string; value: string; originalValue: string }[]
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
  const debouncedSearch = useDebouncedValue(search, 500);

  const [statusFilter, setStatusFilter] = useState(() => {
    if (
      user?.role === Roles.VERTICAL_MANAGER ||
      user?.role === Roles.MARKETING_HEAD ||
      user?.role === Roles.LEAD_GEN_MANAGER ||
      user?.role === Roles.ADMIN
    )
      return "NEWLY_GENERATED";
    else if (
      user?.role === Roles.FRESHER ||
      user?.role === Roles.EXECUTIVE ||
      user?.role === Roles.INTERN ||
      user?.role === Roles.TL_IC
    ) {
      return "ALL";
    }
    //   return "NEWLY_GENERATED";
    return user?.role === Roles.OPSTEAM ? "PAID" : "CGFL";
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
    (user?.role as Roles) ?? Roles.MARKETING_HEAD,
  );

  const getLeads = async (
    page: number,
    search: string,
    status: string,
    day?: string,
  ) => {
    if (!user?.role) return;
    setLoading(true);
    try {
      const response = await fetchLeads(page, search, status, day);
      setLeads(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formatted = date ? format(date, "yyyy-MM-dd") : undefined;
    getLeads(page, debouncedSearch, statusFilter, formatted);
  }, [user, page, debouncedSearch, statusFilter, date]);

  useEffect(() => {
    const referredData = leads.map((lead) => ({
      id: lead.id,
      value: lead.referredBy ?? "",
      originalValue: lead.referredBy ?? "",
    }));
    setReferredByInputs(referredData);

    // ✅ NEW: initialize comment inputs per lead (by uuid)
    const commentData = leads.map((lead) => ({
      uuid: lead.uuid,
      value: lead.comment ?? "",
      originalValue: lead.comment ?? "",
    }));
    setCommentInputs(commentData);
  }, [leads]);

  const handleReferredByChange = (id: number, value: string) => {
    setReferredByInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
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
            r.id === id ? { ...r, originalValue: referred.value } : r,
          ),
        );

        await getLeads(page, search, statusFilter);
      }
    } catch (error) {
      // toast.error(
      //   error?.response?.data?.message || "Failed to update referred by."
      // );
      handleApiError(error);
    }
  };

  // ✅ NEW: comment handlers
  const handleCommentChange = (uuid: string, value: string) => {
    setCommentInputs((prev) =>
      prev.map((item) => (item.uuid === uuid ? { ...item, value } : item)),
    );
  };

  const handleCommentBlur = async (uuid: string) => {
    const item = commentInputs.find((c) => c.uuid === uuid);
    if (!item) return;

    // If no change, skip
    if ((item.value ?? "") === (item.originalValue ?? "")) return;

    try {
      const res = await addComment(uuid, item.value ?? "");
      if (res) {
        toast.success("Comment updated.");
        // sync original to current value to prevent re-trigger
        setCommentInputs((prev) =>
          prev.map((c) =>
            c.uuid === uuid ? { ...c, originalValue: item.value ?? "" } : c,
          ),
        );
        await getLeads(page, search, statusFilter);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleAssigntoTeam = async () => {
    if (!selectedTeam || selectedLeads.length === 0) return;
    setAssignLoading(true);
    try {
      const res = await assignLeadToTeam(
        Number(selectedTeam),
        selectedLeads.map(String),
      );
      if (res) {
        const data = await fetchLeads(page, search, statusFilter);
        setLeads(data.data);
        setSelectedLeads([]);
        setSelectedTeam("");
        setIsAssignDialogOpen(false);
      }
    } catch (err) {
      handleApiError(err);
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
        selectedLeads.map(String),
      );
      if (res) {
        const data = await fetchLeads(page, search, statusFilter);
        setLeads(data.data);
        setSelectedLeads([]);
        setSelectedTeam("");
        setIsAssignDialogOpen(false);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === leads.length ? [] : leads.map((lead) => lead.id),
    );
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  // ✅ Handle typing
  const handleTicketChange = (id: number, value: string) => {
    setTicketAmounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  // ✅ Handle typing
  const handleUpFrontChange = (id: number, value: string) => {
    setUpFrontFees((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const handleTicketBlur = async (id: number) => {
    const ticket = ticketAmounts.find((t) => t.id === id);
    const upFrontFee = upFrontFees.find((t) => t.id === id);

    if (!ticket || !upFrontFee) return;

    const ticketValue = parseFloat(ticket.value);
    const upFrontValue = parseFloat(upFrontFee.value);

    if (isNaN(ticketValue) || ticketValue < 0) return;

    try {
      const response = await addTicketAmount(
        id.toString(),
        upFrontValue,
        ticketValue,
      );
      if (response) {
        await getLeads(page, search, statusFilter);
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  //   const handleUpFrontBlur = async (id: number) => {
  //     const upFrontFee = upFrontFees.find((t) => t.id === id);

  //     if (!upFrontFee) return;

  //     const upFrontFeeValue = parseFloat(upFrontFee.value);
  //     if (isNaN(upFrontFeeValue) || upFrontFeeValue <= 0) return;

  //     try {
  //       const response = await updateUpFrontAmount(
  //         id.toString(),
  //         upFrontFeeValue
  //       );
  //       if (response) {
  //         await getLeads(page, search, statusFilter);
  //       }
  //     } catch (err) {
  //       handleApiError(err);
  //     }
  //   };

  const toTitle = (s: string) =>
    s
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/(^|\s)\w/g, (m) => m.toUpperCase());

  //Handle state change
  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const res = await updateLeadState(leadId, newStatus.toUpperCase());

      if (!res) return;

      toast.success(`Status updated to ${toTitle(newStatus)}`);

      // If the new status doesn't belong to current filter → remove locally
      if (statusFilter !== "ALL" && statusFilter !== newStatus) {
        setLeads((curr) => curr.filter((l) => l.id !== leadId));
        return;
      }

      // Otherwise update the row locally
      setLeads((curr) =>
        curr.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
      );

      // Now refresh the page data to stay in sync
      await getLeads(
        page,
        search,
        statusFilter,
        date ? format(date, "yyyy-MM-dd") : undefined,
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteLead = async (uuid: string, name: string) => {
    try {
      await deleteLead(uuid);
      toast.success(`Lead ${name} deleted successfully`);
      await getLeads(page, search, statusFilter);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDeleteManyLeads = async (leadIds: number[]) => {
    try {
      await deleteManyLeads(leadIds);
      setSelectedLeads([])
        await getLeads(page, search, statusFilter);
          
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleUnAssignLead = async (uuid: string, name: string) => {
    try {
      await unAssginLead(uuid);
      toast.success(`Lead ${name} un-Assigned successfully`);
      await getLeads(page, search, statusFilter);
    } catch (err) {
      handleApiError(err);
    }
  };


  const handleUnAssignTeamLeads = async (leadIds:number[]) => {
    try {
      await unAssignTeamLeads(leadIds);
      await getLeads(page, debouncedSearch, statusFilter, );
    } catch (err) {
      handleApiError(err);
    }
  };
  const handleUnAssignTeamMembersLeads = async (leadIds:number[]) => {
    try {
      await unAssignTeamMemberLeads(leadIds);
      await getLeads(page, debouncedSearch, statusFilter, );
    } catch (err) {
      handleApiError(err);
    }
  };

  const hanadleIsSelfGen = async (uuid: string, newStatus: boolean) => {
    const prevLeads = leads;

    setLeads((curr) =>
      curr.map((l) => (l.uuid === uuid ? { ...l, isSelfGen: newStatus } : l)),
    );
    try {
      await selfGenStatus(uuid, newStatus);
      await getLeads(
        page,
        search,
        statusFilter,
        date ? format(date, "yyyy-MM-dd") : undefined,
      );
    } catch (error) {
      setLeads(prevLeads);
      handleApiError(error);
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
        setTeams(teams);
      } else if (role === Roles.EXECUTIVE) {
        const response = await fetchTeamMembers(); // hypothetical
        setTeamMembers(response); // define this state
      }
    } catch (err) {
      handleApiError(err);
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
    <div className="p-1">
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

      <Card className="rounded-none ">
        <CardContent>
          {/* ================= HEADER ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            {/* LEFT SIDE */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:max-w-xs h-9"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              <Button
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
                disabled={
                  !user?.permissions?.uploadData &&
                  !user?.permissions?.createData
                }
              >
                Upload
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {date ? format(date, "dd MMM") : "Date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    captionLayout="dropdown"
                    showOutsideDays
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setDate(subDays(new Date(), 1))}
                    >
                      Yesterday
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((s) => (
                    <SelectItem
                      className="text-xs cursor-pointer"
                      key={s}
                      value={s}
                    >
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                // disabled={
                //   !selectedLeads.length ||
                //   teamsLoading ||
                //   !user?.permissions?.assignData
                // }
                onClick={() => setIsAssignDialogOpen(true)}
              >
                Assign to{" "}
                {user?.role !== Roles.MARKETING_HEAD ? "Members" : "Teams"} (
                {selectedLeads.length})
              </Button>

              <BulkActionsDropdown
                selectedCount={selectedLeads.length}
                canAssign={!!user?.permissions?.assignData}
                canDelete={!!user?.permissions?.deleteData}
                onClear={() => setSelectedLeads([])}
                onUnassignTeamLeads={() => handleUnAssignTeamLeads(selectedLeads)}
                onUnassignTeamMemberLeads={() => handleUnAssignTeamMembersLeads(selectedLeads)}
                    onDeleteAll={() => handleDeleteManyLeads(selectedLeads)}
                // onDeleteAll={() => setIsDeleteAllDialogOpen(true)} 
              />
            </div>
          </div>

          {/* ================= NOTE ================= */}
          {/* {(user?.role === Roles.LEAD_MANAGER ||
      user?.role === Roles.EXECUTIVE ||
      user?.role === Roles.INTERN ||
      user?.role === Roles.FRESHER ||
      user?.role === Roles.TL_IC) && (
      <div className="mb-4 p-3 text-sm bg-blue-50 border border-blue-200 rounded-lg">
        Leads must be assigned before ticket or upfront fees update.
      </div>
    )} */}

          {/* ================= TABLE ================= */}
          <LeadTable
            leads={leads}
            loading={loading}
            selectedLeads={selectedLeads}
            setSelectedLeads={setSelectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            handleTicketBlur={handleTicketBlur}
            handleTicketChange={handleTicketChange}
            handleUpFrontChange={handleUpFrontChange}
            setTicketAmounts={setTicketAmounts}
            ticketAmounts={ticketAmounts}
            upFrontFees={upFrontFees}
            setUpFrontFee={setUpFrontFees}
            onStatusChange={handleStatusChange}
            handleDeleteLead={handleDeleteLead}
            handleUnAssignLead={handleUnAssignLead}
            canDelete={user?.permissions?.deleteData}
            referredByInputs={referredByInputs}
            handleReferredByBlur={handleReferredByBlur}
            handleReferredByChange={handleReferredByChange}
            commentInputs={commentInputs}
            handleCommentChange={handleCommentChange}
            handleCommentBlur={handleCommentBlur}
            onSelfGenChange={hanadleIsSelfGen}
          />

          {/* ================= PAGINATION ================= */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            <div className="flex items-center gap-2 text-sm">
              Page {page} of {totalPages}
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  if (p >= 1 && p <= totalPages) setPage(p);
                }}
                className="w-16 h-8 text-center"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
