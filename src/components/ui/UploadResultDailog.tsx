// components/UploadResultDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UploadResultDialogProps {
  open: boolean
  onClose: () => void
  insertedCount: number
  skippedCount: number
}

export function UploadResultDialog({
  open,
  onClose,
  insertedCount,
  skippedCount
}: UploadResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Summary</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-center space-y-2">
          <p>✅ Inserted Leads: <strong>{insertedCount}</strong></p>
          <p>⚠️ Skipped Leads: <strong>{skippedCount}</strong></p>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
