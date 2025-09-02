// components/UploadResultDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useCallback, memo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import type { SkippedLead } from "@/types/leads"

interface UploadResultDialogProps {
  open: boolean
  onClose: () => void
  insertedCount: number
  skippedCount: number
  skippedLeads?: SkippedLead[]
}

function UploadResultDialogComponent({
  open,
  onClose,
  insertedCount,
  skippedCount,
  skippedLeads = []
}: UploadResultDialogProps) {
  const [showSkippedDetails, setShowSkippedDetails] = useState(false)

  const toggleSkippedDetails = useCallback(() => {
    setShowSkippedDetails(prev => !prev)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Summary</DialogTitle>
        </DialogHeader>

        <div className="text-sm space-y-4">
          <div className="text-center space-y-2">
            <p>✅ Inserted Leads: <strong>{insertedCount}</strong></p>
            <p>⚠️ Skipped Leads: <strong>{skippedCount}</strong></p>
          </div>

          {skippedLeads.length > 0 && (
            <div className="border rounded-lg p-4">
              <button
                onClick={toggleSkippedDetails}
                className="flex items-center justify-between w-full text-left font-medium text-red-600 hover:text-red-700"
              >
                <span>View Skipped Leads Details</span>
                {showSkippedDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showSkippedDetails && (
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                  {skippedLeads.map((lead, index) => (
                    <div key={index} className="border-l-4 border-red-200 pl-3 py-2 bg-red-50 rounded">
                      <div className="font-medium text-red-800">
                        {lead.row.name} ({lead.row.email})
                      </div>
                      <div className="text-sm text-gray-600">
                        Phone: {lead.row.phoneNumber}
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        Reason: {lead.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const UploadResultDialog = memo(UploadResultDialogComponent)
