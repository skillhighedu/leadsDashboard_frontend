import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { uploadLeadsFile, createLead } from "@/services/leads.services";
import { UploadResultDialog } from "@/components/ui/UploadResultDailog";
import type { CreateLeadInput } from "@/types/leads";
import { toast } from "sonner";

interface UploadLeadDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  refreshLeads: () => void;
}

export function UploadLeadDialog({
  open,
  onOpenChange,
  refreshLeads,
}: UploadLeadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [uploadResult, setUploadResult] = useState<{
    insertedLeadsCount: number;
    skippedLeadsCount: number;
  } | null>(null);

  const [showResultDialog, setShowResultDialog] = useState(false);

  const [formData, setFormData] = useState<CreateLeadInput>({
    name: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    college: "",
    domain: "",
    branch: "",
    graduationYear: "",
    hadReferred: false,
    upFrontFee: 0,
    remainingFee: 0,
    batch: "",
    preferredLanguage: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFormSubmit = async (): Promise<void> => {
    const requiredFields: (keyof CreateLeadInput)[] = [
      "name",
      "email",
      "phoneNumber",
      "whatsappNumber",
      "college",
      "domain",
      "branch",
      "graduationYear",
      "upFrontFee",
      "remainingFee",
      "batch",
      "preferredLanguage"
    ];

    for (const field of requiredFields) {
      const value = formData[field];
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (typeof value === "number" && isNaN(value))
      ) {
        toast.error(`Please enter a valid ${field}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      await createLead(formData);
      refreshLeads();
      toast.success("Lead created successfully!");
      onOpenChange(false);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        whatsappNumber: "",
        college: "",
        domain: "",
        branch: "",
        graduationYear: "",
        hadReferred: false,
        upFrontFee: 0,
        remainingFee: 0,
        batch: "",
        preferredLanguage: ""
      });
    } catch (error) {
      console.error("Create Lead Error:", error);
      toast.error("Failed to create lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (file: File): Promise<void> => {
    setUploading(true);
    try {
      const result = await uploadLeadsFile(file);
      setUploadResult(result);
      setShowResultDialog(true);
      refreshLeads();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const closeDialogs = (): void => {
    setShowResultDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          onOpenChange(val);
          if (!val) setShowForm(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showForm ? "Create a New Lead" : "Upload Leads"}
            </DialogTitle>
          </DialogHeader>

          {showForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { id: "name", label: "Full Name" },
                  { id: "email", label: "Email Address" },
                  { id: "phoneNumber", label: "Phone Number" },
                  { id: "whatsappNumber", label: "WhatsApp Number" },
                  { id: "college", label: "College Name" },
                  { id: "domain", label: "Domain" },
                  { id: "branch", label: "Branch" },
                  { id: "graduationYear", label: "Graduation Year" },
                  { id: "preferredLanguage", label: "Preferred Language" },
                  { id: "batch", label: "Batch" },
                  { id: "upFrontFee", label: "Upfront Fee (₹)" },
                  { id: "remainingFee", label: "Remaining Fee (₹)" },
                ] as const).map(({ id, label }) => (
                  <div key={id} className="space-y-1">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      name={id}
                      type={["upFrontFee", "remainingFee"].includes(id) ? "number" : "text"}
                      value={formData[id as keyof CreateLeadInput]?.toString() || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hadReferred"
                  name="hadReferred"
                  checked={formData.hadReferred}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="hadReferred">Had Referred?</Label>
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Back
                </Button>
                <Button onClick={handleFormSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Lead"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Uploading..." : "Upload from Excel File"}
              </Button>
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
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

      {uploadResult && (
        <UploadResultDialog
          open={showResultDialog}
          onClose={closeDialogs}
          insertedCount={uploadResult.insertedLeadsCount}
          skippedCount={uploadResult.skippedLeadsCount}
        />
      )}
    </>
  );
}
