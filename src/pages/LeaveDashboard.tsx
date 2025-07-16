import { useEffect, useState } from "react";
import { fetchLeaveApplications, updateLeaveStatus } from "@/services/leave.services";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeaveResponse } from "@/types/leaveApplication";
import type { LeaveStatus } from "@/types/hr";
import { toast } from "sonner";

const LeaveDashboard = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [leaveData, setLeaveData] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const getLeaves = async (selectedDate: Date) => {
    try {
      setLoading(true);
      const isoDate = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD
      const { data } = await fetchLeaveApplications(isoDate);
      setLeaveData(data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async(uuid: string, newStatus: LeaveStatus ) => {
    try {
        await updateLeaveStatus(uuid, {status: newStatus });
        toast.success(`Status updated to ${newStatus}`);
        getLeaves(date);
    } catch (error) {
         toast.error("Failed to update status");
    console.error(error);
    }
  }

  const dateString = date.toDateString();
  useEffect(() => {
    if (date) getLeaves(date);
  }, [date, dateString]);

  const setQuickDate = (offset: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setDate(newDate);

  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
          HR Leave Applications Dashboard
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {date.toDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selected) => selected && setDate(selected)}
              captionLayout="dropdown"
              showOutsideDays
              weekStartsOn={0}
            />
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                className="w-1/2"
                onClick={() => setQuickDate(0)}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                className="w-1/2"
                onClick={() => setQuickDate(-1)}
              >
                Yesterday
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="bg-white dark:bg-zinc-900 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Leave Applications for:{" "}
            <span className="text-blue-600">{date.toDateString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto px-0 max-h-[600px]">
          {loading ? (
            <div className="space-y-3 px-4 py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : leaveData.length === 0 ? (
            <p className="text-center text-gray-400 italic py-6">
              No leave applications for this date.
            </p>
          ) : (
            <div className="w-full overflow-x-auto px-4">
              <Table className="min-w-[700px] border rounded-md">
                <TableHeader className="bg-zinc-100 dark:bg-zinc-800">
                  
                  <TableRow>
                    <TableHead className="px-4 py-2">Name</TableHead>
                    <TableHead className="px-4 py-2">Role</TableHead>
                    <TableHead className="px-4 py-2">Leave Type</TableHead>
                    <TableHead className="px-4 py-2">From</TableHead>
                    <TableHead className="px-4 py-2">To</TableHead>
                    <TableHead className="px-4 py-2">Reason</TableHead>
                    <TableHead className="px-4 py-2">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveData.map((leave) => (
                    <TableRow
                      key={leave.uuid}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <TableCell className="px-4 py-2 text-blue-600 font-medium">
                        {leave.name}
                      </TableCell>
                      <TableCell className="px-4 py-2">{leave.role}</TableCell>
                      <TableCell className="px-4 py-2">
                        {leave.leaveType}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {new Date(leave.toDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {leave.reason}
                      </TableCell>
                      <TableCell className="px-4 py-2">
  <select
    value={leave.status}
    onChange={(e) =>
      handleStatusChange(leave.uuid, e.target.value as LeaveStatus)
    }
    className={`text-sm rounded-md px-2 py-1 border focus:outline-none ${
      leave.status === "APPROVED"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    <option value="PENDING">Pending</option>
    <option value="APPROVED">Approved</option>
  </select>
</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveDashboard;
