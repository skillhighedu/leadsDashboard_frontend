import { useEffect, useState } from "react";
import { fetchStaffLogins, updateStaffLoginStatus, type WorkStatusType } from "@/services/hr.services";
import { Calendar } from "@/components/ui/calendar";
import type { staffLoginsRecord,  } from "@/types/hr";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";
import { useAuthStore } from "@/store/AuthStore";

const HrDashboard = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [staffLogins, setStaffLogins] = useState<staffLoginsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useAuthStore()

  const getStaffLogins = async (selectedDate: Date) => {
    try {
      setLoading(true);
      const isoDate = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD
      const response = await fetchStaffLogins(isoDate);
      setStaffLogins(response.data);
    } catch (error) {
      handleApiError( error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) getStaffLogins(date);
  }, [date]); // use 'date' directly as dependency

  const setQuickDate = (offset: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset);
    setDate(newDate);
  };

  const handleStatusChange = async (uuid: string, newStatus: WorkStatusType) => {
    try {
      await updateStaffLoginStatus(uuid, newStatus);
      toast.success("Status updated");
      getStaffLogins(date);
    } catch (error) {
        handleApiError(error)
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
          {user?.role} Staff Login Dashboard
        </h1>

        {/* Calendar Popover Filter */}
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
              <Button variant="secondary" className="w-1/2" onClick={() => setQuickDate(0)}>
                Today
              </Button>
              <Button variant="ghost" className="w-1/2" onClick={() => setQuickDate(-1)}>
                Yesterday
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="bg-white dark:bg-zinc-900 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Staff Logins for:{" "}
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
          ) : staffLogins.length === 0 ? (
            <p className="text-center text-gray-400 italic py-6">
              No login records for this date.
            </p>
          ) : (
            <div className="w-full overflow-x-auto px-4">
              <Table className="min-w-[700px] border rounded-md">
                <TableHeader className="bg-zinc-100 dark:bg-zinc-800">
                  <TableRow>
                    <TableHead className="px-4 py-2">Name</TableHead>
                    <TableHead className="px-4 py-2">Role</TableHead>
                    <TableHead className="px-4 py-2">Status</TableHead>
                    <TableHead className="px-4 py-2">Login</TableHead>
                    <TableHead className="px-4 py-2">Logout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffLogins.map((log, idx) => (
                    <TableRow key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                      <TableCell className="px-4 py-2 text-blue-600 font-medium">
                        {log.name}
                      </TableCell>
                      <TableCell className="px-4 py-2">{log.employeeRole}</TableCell>
                      <TableCell className="px-4 py-2">
                        <Select
                          value={log.dayStatus}
                          onValueChange={(value) =>
                            handleStatusChange(log.employeeRecordUuid, value as WorkStatusType)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRESENT">PRESENT</SelectItem>
                            <SelectItem value="FULL">FULL</SelectItem>
                            <SelectItem value="HALF">HALF</SelectItem>
                            <SelectItem value="ABSENT">ABSENT</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {new Date(log.loginTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString() : "N/A"}
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

export default HrDashboard;
