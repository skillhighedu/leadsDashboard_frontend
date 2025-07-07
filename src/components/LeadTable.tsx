// components/LeadTable.tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Leads } from "@/types/leads"
import { useAuthStore } from "@/store/AuthStore"
import { Button } from "./ui/button"
import { Input } from "./ui/input"


interface LeadTableProps {
  leads: Leads[]
  loading: boolean
  selectedLeads: number[]
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>
  onSelectLead: (id: number) => void
  onSelectAll: () => void
}


export function LeadTable({ leads, loading, selectedLeads, onSelectLead, onSelectAll }: LeadTableProps) {
    console.log(leads)
  const safeLeads = Array.isArray(leads) ? leads : [];
  const UnassignedLeads = safeLeads.filter(lead => lead.teamAssignedId == null)
  const selectedSet = new Set(selectedLeads);
  const {user} = useAuthStore();

  const allSelected = UnassignedLeads.length > 0 &&
    UnassignedLeads.every(lead => selectedSet.has(lead.id));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Assigned To Team</TableHead>
          <TableHead>Assigned To Member</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Ticket Amount</TableHead>


        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          [...Array(10)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(9)].map((_, j) => (
                <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
              ))}
            </TableRow>
          ))
        ) : safeLeads.length ? (
          safeLeads.map(lead => (
            <TableRow
              key={lead.id}
              className="hover:bg-muted/50"
              style={{ backgroundColor: lead.teamAssignedId != null && lead.teamAssigned ? lead.teamAssigned.colorCode : undefined }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={() => onSelectLead(lead.id)}
                  disabled={user && user.role !== "leadManager"? lead.handlerId !== null: lead.teamAssignedId !== null }
                />
              </TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phoneNumber}</TableCell>
              <TableCell>{lead.college}</TableCell>
              <TableCell>{lead.batch}</TableCell>
              <TableCell>{lead.domain}</TableCell>
               
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${lead.status === "new"
                  ? "bg-blue-100 text-blue-800"
                  : lead.status === "contacted"
                    ? "bg-yellow-100 text-yellow-800"
                    : lead.status === "qualified"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {lead.status}
                </span>
              </TableCell>
              <TableCell>{lead?.owner?.name}</TableCell>
              <TableCell>{lead?.teamAssigned?.teamName ?? "Unassigned"}</TableCell>
              <TableCell>{lead.assignedTo?.name ? lead.assignedTo.name : "-"}</TableCell>
              <TableCell><Button variant="outline">Edit</Button></TableCell>
              <TableCell><Input></Input></TableCell>
            </TableRow>
        
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-muted-foreground">No leads found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
