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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRef, useState, useCallback } from "react";
import { uploadLeadsFile, createLead } from "@/services/leads.services";
import { UploadResultDialog } from "@/components/ui/UploadResultDailog";
import type { CreateLeadInput, UploadLeadsResponse } from "@/types/leads";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";
import { useAuthStore } from "@/store/AuthStore";

interface UploadLeadDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  refreshLeads: () => void;
}

/* ------------------ helpers ------------------ */

const getEmptyForm = (): CreateLeadInput => ({
  name: "",
  email: "",
  timestamp: "",
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
  preferredLanguage: "",
});

export function UploadLeadDialog({
  open,
  onOpenChange,
  refreshLeads,
}: UploadLeadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuthStore();

  const [uploadResult, setUploadResult] =
    useState<UploadLeadsResponse | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const [formData, setFormData] = useState<CreateLeadInput>(getEmptyForm());

  /* ------------------ reset logic ------------------ */

  const resetForm = useCallback(() => {
    setFormData(getEmptyForm());
    setShowForm(false);
  }, []);

  /* ------------------ handlers ------------------ */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFormSubmit = async () => {
    const requiredFields: (keyof CreateLeadInput)[] = [
      "name",
      "email",
      "timestamp",
      "phoneNumber",
      "whatsappNumber",
      "college",
      "domain",
      "branch",
      "graduationYear",
      "upFrontFee",
      "remainingFee",
      "batch",
      "preferredLanguage",
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
      resetForm();
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadLeadsFile(file);
      setUploadResult(result);
      setShowResultDialog(true);
      refreshLeads();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  const closeDialogs = useCallback(() => {
    setShowResultDialog(false);
    resetForm();
    onOpenChange(false);
  }, [onOpenChange, resetForm]);

  /* ------------------ render ------------------ */

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) resetForm(); // 🔥 KEY FIX
          onOpenChange(val);
        }}
      >
        <DialogContent key={showForm ? "form" : "upload"}>
          <DialogHeader>
            <DialogTitle>
              {showForm ? "Create a New Lead" : "Upload Leads"}
            </DialogTitle>
          </DialogHeader>

          {showForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "name", label: "Full Name" },
                  { id: "timestamp", label: "Time Stamp" },
                  { id: "email", label: "Email Address" },
                  { id: "phoneNumber", label: "Phone Number" },
                  { id: "whatsappNumber", label: "WhatsApp Number" },
                  { id: "graduationYear", label: "Graduation Year" },
                  { id: "branch", label: "Branch" },
                  { id: "domain", label: "Domain" },
                  { id: "batch", label: "Batch" },
                  { id: "preferredLanguage", label: "Preferred Language" },
                  { id: "college", label: "College Name" },
                ].map(({ id, label }) => (
                  <div key={id} className="space-y-1">
                    <Label htmlFor={id}>{label}</Label>

                    {id === "graduationYear" ? (
                      <Select
                        value={formData.graduationYear}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            graduationYear: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "1st YEAR",
                            "2nd YEAR",
                            "3rd YEAR",
                            "4th YEAR",
                            "GRADUATED",
                          ].map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={id}
                        name={id}
                        value={String(
                          formData[id as keyof CreateLeadInput] ?? ""
                        )}
                        onChange={handleInputChange}
                      />
                    )}
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
                <Button variant="outline" onClick={resetForm}>
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
                disabled={!user?.permissions?.uploadData}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Uploading..." : "Upload from Excel File"}
              </Button>

              <input
                type="file"
                accept=".xlsx,.xls"
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
          skippedLeads={uploadResult.skippedLeads}
        />
      )}
    </>
  );
}
