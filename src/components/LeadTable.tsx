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

interface LeadTableProps {
  leads: Leads[];
  loading: boolean;
  selectedLeads: number[];
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>;
  ticketAmounts: { id: number; value: string }[];
  setTicketAmounts: React.Dispatch<React.SetStateAction<{ id: number; value: string }[]>>;
  upFrontFees: { id: number; value: string }[];
  setUpFrontFee: React.Dispatch<React.SetStateAction<{ id: number; value: string }[]>>;
  handleTicketBlur: (id: number) => void;
  handleUpFrontBlur:(id: number) => void;
  handleTicketChange: (id: number, value: string) => void;
  handleUpFrontChange: (id: number, value: string) => void;
  onSelectLead: (id: number) => void;
  onSelectAll: () => void;
  onStatusChange: (leadId: number, newStatus: string) => void;
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
    user && user.role === Roles.VERTICAL_MANAGER
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Whatsapp Number</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Had Referred</TableHead>
          <TableHead>Referred By</TableHead>
          <TableHead> Preferred Language</TableHead>

        
          <TableHead>Owner</TableHead>
          <TableHead>Assigned To Team</TableHead>
          <TableHead>Assigned To Member</TableHead>
          <TableHead>UpFront Fee</TableHead>
          <TableHead>Remaining Fee</TableHead>
          <TableHead>Ticket Amount</TableHead>
          <TableHead>Status</TableHead>
          {/* <TableHead>Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
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
            const isDisabled =
              user && user.role !== Roles.VERTICAL_MANAGER
                ? lead.handlerId !== null
                : lead.teamAssignedId !== null;

            const ticketValue =
              ticketAmounts.find((item) => item.id === lead.id)?.value || "";

            const upFrontValue =
              upFrontFees.find((item) => item.id === lead.id)?.value || "";

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
                <TableCell>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => onSelectLead(lead.id)}
                    disabled={isDisabled}
                  />
                </TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.whatsappNumber}</TableCell>
                <TableCell>{lead.college}</TableCell>
                <TableCell>{lead.batch}</TableCell>
                <TableCell>{lead.domain}</TableCell>
                <TableCell>{lead.hadReferred ? "Yes" : "No"}</TableCell>
                <TableCell>{lead.referredBy}</TableCell>
                <TableCell>{lead.preferredLanguage}</TableCell>

                <TableCell>{lead?.owner?.name}</TableCell>
                <TableCell>{lead?.teamAssigned?.teamName ?? "Unassigned"}</TableCell>
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
                    disabled={user?.role === Roles.VERTICAL_MANAGER}
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
                    disabled={user?.role === Roles.VERTICAL_MANAGER}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    disabled={user?.role === Roles.VERTICAL_MANAGER}
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
            <TableCell colSpan={15} className="text-center text-muted-foreground">
              No leads found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
