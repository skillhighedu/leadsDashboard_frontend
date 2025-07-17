import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { submitLeaveApplication, fetchMyLeaveApplications } from "@/services/leave.services";
import type { LeaveResponse } from "@/types/leaveApplication";

export default function LeaveApplication() {
  const [showForm, setShowForm] = useState(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState("Full Day");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [fetching, setFetching] = useState(true);

  const resetForm = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setLeaveType("Full Day");
    setReason("");
  };

  const getMyLeaves = async () => {
    try {
      setFetching(true);
      const data = await fetchMyLeaveApplications();
      setLeaves(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch leave history.");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await submitLeaveApplication({
        fromDate,
        toDate,
        leaveType,
        reason,
      });
      toast.success("Leave request submitted successfully.");
      resetForm();
      setShowForm(false);
      getMyLeaves(); // Refresh data after submission
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit leave.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyLeaves();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Top header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Leave Management
        </h2>
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Write Leave Application
        </Button>
      </div>

      {/* Leave Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <div className="text-right mb-4">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Close
            </Button>
          </div>
          <h3 className="text-xl font-medium mb-6 text-gray-700">
            New Leave Application
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                From Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                To Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Leave Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Day">Full Day</SelectItem>
                <SelectItem value="HALF DAY">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Reason
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type your reason for leave..."
            />
          </div>

          <div className="text-right">
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </div>
        </div>
      )}

      {/* Submitted Applications */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h3 className="text-lg font-semibold mb-4">My Leave Applications</h3>
        {fetching ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : leaves.length === 0 ? (
          <p className="text-gray-500 italic">No leave applications found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.uuid}>
                  <TableCell>{format(new Date(leave.fromDate), "PPP")}</TableCell>
                  <TableCell>{format(new Date(leave.toDate), "PPP")}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell
                    className={`font-medium ${
                      leave.status === "APPROVED"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
