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
import { useAuthStore } from "@/store/AuthStore";
// import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {  LeadStatuses } from "@/constants/status.constant";
import { Roles } from "@/constants/role.constant";
import { Textarea } from "@/components/ui/textarea"; // ✅ NEW: textarea for comments

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
import type { Leads } from "@/types/leads";
// import { LeadDetailsDialog } from "@/features/leads/components/LeadDetailsDialog";

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
  //   handleUpFrontBlur: (id: number) => void;
  handleTicketChange: (id: number, value: string) => void;
  handleUpFrontChange: (id: number, value: string) => void;
  onSelectLead: (id: number) => void;
  onSelectAll: () => void;
  onStatusChange: (leadId: number, newStatus: string) => void;
  onSelfGenChange: (uuid: string, newStatus: boolean) => void;
  handleDeleteLead: (uuid: string, name: string) => void;

  handleUnAssignLead: (uuid: string, name: string) => void;

  canDelete?: boolean;

  referredByInputs: { id: number; value: string }[];
  handleReferredByChange: (id: number, value: string) => void;
  handleReferredByBlur: (id: number) => void;

  // ✅ NEW: comment props (uuid-based)
  commentInputs: { uuid: string; value: string }[];
  handleCommentChange: (uuid: string, value: string) => void;
  handleCommentBlur: (uuid: string) => void;
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
  // handleUpFrontBlur,
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

  // ✅ NEW
  commentInputs,
  handleCommentChange,
  handleCommentBlur,
  onSelfGenChange
}: LeadTableProps) {
  const { user } = useAuthStore();
  const safeLeads = Array.isArray(leads) ? leads : [];
// const [openLead, setOpenLead] = useState<Leads | null>(null);

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
    // Scroll container to keep header visible while body scrolls
    <div className="relative max-h-[70vh] overflow-y-auto rounded-md border">
      <Table className="z-0 w-full border-separate border-spacing-0 text-xs ">
        {/* Sticky header: each TH is sticky with strong z-index and solid bg */}
     <TableHeader className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur border-b border-white/10">
  <TableRow className="sticky top-0 z-40 bg-neutral-900/40">

    {/* Checkbox */}
    <TableHead className="sticky left-0 top-0 z-50 bg-neutral-900/95 text-white">
      {user?.role !== Roles.INTERN && user?.role !== Roles.FRESHER && (
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
        />
      )}
    </TableHead>

    <TableHead className="bg-neutral-900/40 text-white">TimeStamp</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Name</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Email</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Phone</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Whatsapp Number</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Year</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">College</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Branch</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Interested Domain</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Batch</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Had Referred</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Referred By</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Preferred Language</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Owner</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Is SelfGen Lead</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Assigned To Team</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Assigned At</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Assigned To Member</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">UpFront Fee</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Remaining Fee</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Ticket Amount</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Status</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Comment</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Un-Assign</TableHead>
    <TableHead className="bg-neutral-900/40 text-white">Delete</TableHead>

  </TableRow>
</TableHeader>


        <TableBody className=" max-h-[65vh] overflow-y-auto">
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

              const isInternOrTL =
                user?.role === Roles.INTERN ||
                user?.role === Roles.FRESHER ||
                user?.role === Roles.TL_IC ||
                user?.role === Roles.OPSTEAM;
              const isExecutive = user?.role === Roles.EXECUTIVE;
              const isManager = !!user && hasManagerRole(user.role);

              // Who can unassign??
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

              // ✅ NEW: comment value lookup
              const commentValue =
                commentInputs.find((item) => item.uuid === lead.uuid)?.value ??
                "";

              return (
                
              <TableRow
  key={lead.id}
  // onClick={() => setOpenLead(lead)}
  className="cursor-pointer hover:bg-muted/50"
  style={{
    backgroundColor:
      lead.teamAssignedId != null && lead.teamAssigned
        ? lead.teamAssigned.colorCode
        : undefined,
  }}
>

                  {user?.role !== Roles.INTERN &&
                  user?.role !== Roles.FRESHER ? (
                    <TableCell className="sticky left-0 z-20 bg-background">
                      <Checkbox
                       onClick={(e) => e.stopPropagation()}

                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => onSelectLead(lead.id)}
                        disabled={isDisabled}
                      />
                    </TableCell>
                  ) : (
                    <TableCell />
                  )}
                  <TableCell>{lead.timestamp ? lead.timestamp : "-"}</TableCell>
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
                  {/* <TableCell>{!lead?.isSelfGen ? "false" : "true"}</TableCell> */}
                  <TableCell>
                    <select
                        value={String(!!lead.isSelfGen)}
                        onChange={(e) => onSelfGenChange(lead.uuid, e.target.value === "true")}
                        className="border rounded px-2 py-1"
                    >
                        <option value="true">true</option>
                        <option value="false">false</option>
                        
                    </select>
                  </TableCell>
                  
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
                      //   onBlur={() => handleUpFrontBlur(lead.id)}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTicketBlur(lead.id);
                          e.currentTarget.blur();
                        }
                      }}
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

                  {/* ✅ NEW: Comment textarea */}
                  <TableCell>
                    <Textarea
                      className="w-64"
                      placeholder="Add a comment"
                      value={commentValue}
                      onChange={(e) =>
                        handleCommentChange(lead.uuid, e.target.value)
                      }
                      onBlur={() => handleCommentBlur(lead.uuid)}
                    />
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
                            <b>{targetLabel}</b>? This action cannot be undone.
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
      {/* <LeadDetailsDialog
  lead={openLead}
  onClose={() => setOpenLead(null)}
/> */}

    </div>
  );
}
