import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Leads } from "@/types/leads";
import { useAuthStore } from "@/store/AuthStore";
// import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LeadStatuses } from "@/constants/status.constant";
import { Roles } from "@/constants/role.constant";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadTableProps {
  leads: Leads[];
  loading: boolean;
  selectedLeads: number[];
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>;
  ticketAmounts: { id: number; value: string }[];
  setTicketAmounts: React.Dispatch<
    React.SetStateAction<{ id: number; value: string }[]>
  >;
  upFrontFees: { id: number; value: string }[];
  setUpFrontFee: React.Dispatch<
    React.SetStateAction<{ id: number; value: string }[]>
  >;
  handleTicketBlur: (id: number) => void;
  handleUpFrontBlur: (id: number) => void;
  handleTicketChange: (id: number, value: string) => void;
  handleUpFrontChange: (id: number, value: string) => void;
  onSelectLead: (id: number) => void;
  onSelectAll: () => void;
  onStatusChange: (leadId: number, newStatus: string) => void;
  handleDeleteLead: (uuid: string, name: string) => void;

  handleUnAssignLead: (uuid: string, name: string) => void;

  canDelete?: boolean;
  referredByInputs: { id: number; value: string }[];

  handleReferredByChange: (id: number, value: string) => void;
  handleReferredByBlur: (id: number) => void;
}

export function LeadTable({
  leads,
  loading,
  selectedLeads,
  setSelectedLeads,
  ticketAmounts,
  setTicketAmounts,
  upFrontFees,
  setUpFrontFee,
  handleTicketBlur,
  handleUpFrontBlur,
  handleTicketChange,
  handleUpFrontChange,
  onSelectLead,
  onStatusChange,
  handleDeleteLead,
  handleUnAssignLead,
  canDelete,
  referredByInputs,
  handleReferredByChange,
  handleReferredByBlur,
}: LeadTableProps) {
  const { user } = useAuthStore();
  const safeLeads = Array.isArray(leads) ? leads : [];

  useEffect(() => {
    const initialTickets = safeLeads.map((lead) => ({
      id: lead.id,
      value: lead.ticketAmount?.toString() || "",
    }));
    setTicketAmounts(initialTickets);

    const initialUpFront = safeLeads.map((lead) => ({
      id: lead.id,
      value: lead.upFrontFee?.toString() || "",
    }));
    setUpFrontFee(initialUpFront);
  }, [leads]);

  const selectableLeads = safeLeads.filter((lead) =>
    (user && user.role === Roles.VERTICAL_MANAGER) ||
    user?.role === Roles.MARKETING_HEAD ||
    user?.role === Roles.LEAD_GEN_MANAGER
      ? lead.teamAssignedId === null
      : lead.handlerId === null
  );

  const selectedSet = new Set(selectedLeads);
  const allSelected =
    selectableLeads.length > 0 &&
    selectableLeads.every((lead) => selectedSet.has(lead.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(selectableLeads.map((lead) => lead.id));
    }
  };

  return (
    <Table className="z-0">
      <TableHeader >
        <TableRow  >
          <TableHead className="left-0  z-10 sticky bg-background">
            {user?.role !== Roles.INTERN && (
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
            )}
          </TableHead>
          <TableHead >Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Whatsapp Number</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Interested Domain</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Had Referred</TableHead>
          <TableHead>Referred By</TableHead>
          <TableHead> Preferred Language</TableHead>

          <TableHead>Owner</TableHead>
          <TableHead>Assigned To Team</TableHead>
          <TableHead>Assigned At</TableHead>
          <TableHead>Assigned To Member</TableHead>
          <TableHead>UpFront Fee</TableHead>
          <TableHead>Remaining Fee</TableHead>
          <TableHead>Ticket Amount</TableHead>
          <TableHead>Status</TableHead>
          {/* <TableHead>Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody >
        {loading ? (
          [...Array(10)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(13)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : safeLeads.length ? (
          safeLeads.map((lead) => {
            const MANAGER_ROLES = [
              Roles.LEAD_GEN_MANAGER,
              Roles.MARKETING_HEAD,
              Roles.VERTICAL_MANAGER,
            ] as const;

            type ManagerRole = (typeof MANAGER_ROLES)[number];

            const hasManagerRole = (role: string): role is ManagerRole =>
              (MANAGER_ROLES as readonly string[]).includes(role);

            const isDisabled =
              user && !hasManagerRole(user.role)
                ? lead.handlerId !== null
                : lead.teamAssignedId !== null;

            const ticketValue =
              ticketAmounts.find((item) => item.id === lead.id)?.value || "";

            const upFrontValue =
              upFrontFees.find((item) => item.id === lead.id)?.value || "";

            // Remove this function definition. The actual handleDeleteLead is passed as a prop to LeadTable and should not be redefined here.

            const isInternOrTL =
              user?.role === Roles.INTERN ||
              user?.role === Roles.TL_IC ||
              user?.role === Roles.OPSTEAM;
            const isExecutive = user?.role === Roles.EXECUTIVE;
            const isManager = !!user && hasManagerRole(user.role);

            // Who can unassign?
            // - Managers: only if team is assigned
            // - Executive: only if handler is assigned (team may be null)
            // - Intern/TL_IC: never
            const canUnassign = isManager
              ? lead.teamAssignedId !== null
              : isExecutive
              ? lead.handlerId !== null
              : false;

            const isUnassignDisabled = isInternOrTL || !canUnassign;
            const targetLabel =
              user?.role === Roles.EXECUTIVE
                ? lead.handler?.name ?? "handler"
                : lead.teamAssigned?.teamName ?? "team";
            return (
              <TableRow
                key={lead.id}
                className="hover:bg-muted/50"
                style={{
                  backgroundColor:
                    lead.teamAssignedId != null && lead.teamAssigned
                      ? lead.teamAssigned.colorCode
                      : undefined,
                }}
              >
                {user?.role !== Roles.INTERN ? (
                  <TableCell className=" sticky left-0 z-10 bg-background ">
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => onSelectLead(lead.id)}
                      disabled={isDisabled}
                    />
                  </TableCell>
                ) : (
                  <TableCell />
                )}
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.whatsappNumber}</TableCell>
                <TableCell>{lead.graduationYear}</TableCell>

                <TableCell>{lead.college}</TableCell>
                <TableCell>{lead.branch}</TableCell>
                <TableCell>{lead.domain}</TableCell>
                <TableCell>{lead.batch}</TableCell>
                <TableCell>{lead.hadReferred ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Input
                    className="w-32"
                    placeholder="Enter email"
                    type="email"
                    value={
                      referredByInputs.find((item) => item.id === lead.id)
                        ?.value ?? ""
                    }
                    onChange={(e) =>
                      handleReferredByChange(lead.id, e.target.value)
                    }
                    onBlur={() => handleReferredByBlur(lead.id)}
                  />
                </TableCell>

                <TableCell>{lead.preferredLanguage}</TableCell>

                <TableCell>{lead?.owner?.name}</TableCell>
                <TableCell>
                  {lead?.teamAssigned?.teamName?.trim() || ""}
                </TableCell>
                <TableCell>
                  {lead.assignedAt
                    ? new Date(lead.assignedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{lead.handler?.name || "-"}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-24"
                    value={upFrontValue}
                    onChange={(e) =>
                      handleUpFrontChange(lead.id, e.target.value)
                    }
                    onBlur={() => handleUpFrontBlur(lead.id)}
                    disabled={
                      user?.role === Roles.VERTICAL_MANAGER ||
                      user?.role === Roles.MARKETING_HEAD ||
                      user?.role === Roles.LEAD_GEN_MANAGER
                    }
                  />
                </TableCell>
                <TableCell>{lead.remainingFee}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-24"
                    value={ticketValue}
                    onChange={(e) =>
                      handleTicketChange(lead.id, e.target.value)
                    }
                    onBlur={() => handleTicketBlur(lead.id)}
                    disabled={
                      user?.role === Roles.VERTICAL_MANAGER ||
                      user?.role === Roles.MARKETING_HEAD ||
                      user?.role === Roles.LEAD_GEN_MANAGER
                    }
                  />
                </TableCell>
                <TableCell>
                  <Select
                    disabled={
                      user?.role === Roles.VERTICAL_MANAGER ||
                      user?.role === Roles.MARKETING_HEAD ||
                      user?.role === Roles.LEAD_GEN_MANAGER
                    }
                    value={lead.status}
                    onValueChange={(value) => onStatusChange(lead.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LeadStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={isUnassignDisabled}
                      >
                        UnAssign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm Un-Assign</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to un-Assign{" "}
                          <b>
                            {targetLabel}
                          </b>
                          ? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleUnAssignLead(lead.uuid, lead.name)
                            }
                            disabled={isUnassignDisabled}
                          >
                            Un-Assign
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={!canDelete || lead.teamAssignedId !== null}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete <b>{lead.name}</b>?
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteLead(lead.uuid, lead.name)
                            }
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                {/* <TableCell>
                  <Button
                    variant="outline"
                    disabled={
                      lead.ownerId !== undefined &&
                      lead.ownerId !== null &&
                      lead.ownerId !== lead.handlerId
                    }
                  >
                    Delete
                  </Button>
                </TableCell> */}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={15}
              className="text-center text-muted-foreground"
            >
              No leads found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
