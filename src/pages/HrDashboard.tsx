import { useEffect, useState } from "react";
import { fetchStaffLogins } from "@/services/hr.services";
import { Calendar } from "@/components/ui/calendar";
import type { staffLoginsRecord } from "@/types/hr";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const HrDashboard = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [staffLogins, setStaffLogins] = useState<staffLoginsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getStaffLogins = async (selectedDate: Date) => {
    try {
      setLoading(true);
      const isoDate = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD
      const response = await fetchStaffLogins(isoDate);
      console.log(response.data)
      setStaffLogins(response.data);
    } catch (error) {
      console.error("Error fetching Staff Logins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) getStaffLogins(date);
  }, [date?.toISOString()]);

  const setQuickDate = (offsetDays: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offsetDays);
    setDate(new Date(newDate.getTime()));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-8 text-center">
        HR Staff Login Dashboard
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Calendar Filter */}
        <Card className="w-full md:w-3/5 md:min-w-[440px] md:max-w-[520px] bg-white dark:bg-zinc-900 shadow-md rounded-xl p-4 flex flex-col items-stretch overflow-hidden">
          <CardHeader className="pb-2 w-full">
            <CardTitle className="text-base text-center w-full">Select Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 w-full p-2 flex flex-col items-stretch">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(new Date(selectedDate.getTime()));
                }
              }}
              className="rounded-xl border p-2 w-full"
              captionLayout="dropdown"
              showOutsideDays={true}
              weekStartsOn={0}
            />
            <div className="flex gap-2 w-full">
              <Button variant="default" className="w-1/2" onClick={() => setQuickDate(0)}>
                Today
              </Button>
              <Button variant="outline" className="w-1/2" onClick={() => setQuickDate(-1)}>
                Yesterday
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Table Section */}
        <Card className="table-card flex-1 bg-white dark:bg-zinc-900 shadow-md rounded-xl space-y-4 p-6 w-full">
          <CardHeader className="px-0 pb-0">
            <CardTitle className="text-lg">
              Staff Logins for:{" "}
              <span className="text-blue-600 font-medium">
                {date.toDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[600px] px-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loading ? (
              <div className="space-y-3 px-4">
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
                <Table className="min-w-[700px] border rounded-md overflow-hidden">
                  <TableHeader className="bg-zinc-100 dark:bg-zinc-800">
                    <TableRow>
                      <TableHead className="px-4 py-2">Name</TableHead>
                      <TableHead className="px-4 py-2">Role</TableHead>
                      <TableHead className="px-4 py-2">Status</TableHead>
                      <TableHead className="px-4 py-2">Login Time</TableHead>
                      <TableHead className="px-4 py-2">Logout Time</TableHead>
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
                          <span
                            className={`font-semibold ${
                              log.dayStatus === "PRESENT"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {log.dayStatus}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {new Date(log.loginTime).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {log.logoutTime
                            ? new Date(log.logoutTime).toLocaleTimeString()
                            : "N/A"}
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
    </div>
  );
};

export default HrDashboard;
