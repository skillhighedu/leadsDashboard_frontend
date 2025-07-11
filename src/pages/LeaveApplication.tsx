import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeaveApplication() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState("FULL_DAY");
  const [reason, setReason] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Leave Application</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* From Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">From Date</label>
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
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">To Date</label>
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
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Leave Type */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">Leave Type</label>
        <Select value={leaveType} onValueChange={setLeaveType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Leave Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FULL_DAY">Full Day</SelectItem>
            <SelectItem value="FIRST_HALF">First Half</SelectItem>
            <SelectItem value="SECOND_HALF">Second Half</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reason */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">Reason</label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Type your reason for leave..."
        />
      </div>

      {/* Submit */}
      <div className="text-right">
        <Button>Submit Leave Request</Button>
      </div>
    </div>
  );
}
