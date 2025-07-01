import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"

interface UploadLeadDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
}

export function UploadLeadDialog({ open, onOpenChange }: UploadLeadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    domain: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = () => {
    console.log("Submitted lead:", formData)
    // Here you can call your API to create a new lead
    onOpenChange(false)
    setShowForm(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      college: "",
      domain: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) setShowForm(false)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{showForm ? "Create a Lead" : "Upload Leads"}</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-3">
            {["name", "email", "phone", "college", "domain"].map(field => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={(formData as any)[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Back
              </Button>
              <Button onClick={handleFormSubmit}>Submit Lead</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              Upload from Excel File
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  console.log("Excel file selected:", file.name)
                }
              }}
            />
            <Button className="w-full" onClick={() => setShowForm(true)}>
              Create One Lead
            </Button>
            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
