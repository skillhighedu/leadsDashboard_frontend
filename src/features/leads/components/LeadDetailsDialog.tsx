import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Leads } from "@/types/leads"

interface Props {
  lead: Leads | null
  onClose: () => void
}

export function LeadDetailsDialog({ lead, onClose }: Props) {
  if (!lead) return null

  function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      <Input value={value || "—"} readOnly />
    </div>
  )
}


  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className=" max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead.name} — Lead Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* Identity */}
          <Field label="Full Name" value={lead.name} />
          <Field label="Email" value={lead.email} />
          <Field label="Phone Number" value={lead.phoneNumber} />
          <Field label="WhatsApp Number" value={lead.whatsappNumber} />
          <Field label="UUID" value={lead.uuid} />

          {/* Academic */}
          <Field label="College" value={lead.college} />
          <Field label="Branch" value={lead.branch} />
          <Field label="Graduation Year" value={lead.graduationYear} />
          <Field label="Domain" value={lead.domain} />
          <Field label="Preferred Language" value={lead.preferredLanguage} />
          <Field label="Batch" value={lead.batch} />

          {/* Sales */}
          <Field label="Status" value={lead.status} />
          <Field label="Ticket Amount" value={lead.ticketAmount?.toString()} />
          <Field label="Upfront Fee" value={lead.upFrontFee.toString()} />
          <Field label="Remaining Fee" value={lead.remainingFee.toString()} />
          <Field label="Self Generated" value={lead.isSelfGen ? "Yes" : "No"} />
          <Field label="Had Referred" value={lead.hadReferred ? "Yes" : "No"} />
          <Field label="Referred By" value={lead.referredBy} />
          <Field label="Reason" value={lead.reason} />

          {/* Ownership */}
          <Field label="Owner" value={lead.owner?.name} />
          <Field label="Handler" value={lead.handler?.name} />
          <Field label="Team" value={lead.teamAssigned?.teamName} />
          <Field label="Team Color" value={lead.teamAssigned?.colorCode} />
          <Field label="Assigned At" value={lead.assignedAt} />

          {/* Meta */}
          <Field label="Lead ID" value={lead.id.toString()} />
          <Field label="Created At" value={lead.createdAt} />
          <Field label="Updated At" value={lead.updatedAt} />
          <Field label="Timestamp" value={lead.timestamp} />

          {/* Comment */}
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground">Comment</label>
            <Textarea value={lead.comment || ""} readOnly />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
