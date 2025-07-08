import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, PencilIcon, ChartLineIcon, Trash2 } from "lucide-react";
import { deleteEmployee, fetchEmployes, type Employee } from "@/services/employes.services";
import { Link } from "react-router-dom";
export default function Employee() {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchEmployes();
        setEmployeeData(response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employeeData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" ||
      employee.roleName.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleDelete = async(uuid: string) => {
    await deleteEmployee(uuid)
    setEmployeeData(employeeData.filter((employee) => employee.uuid !== uuid));
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <main className="flex-1 p-8">
      <div className="container mx-auto max-w-8xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Employees
          </h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              aria-label="Search employees"
            />
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              aria-label="Filter by role"
            >
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/add_employee">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Employee Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100 py-4 px-6 text-left">
                      Name
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100 py-4 px-6 text-left">
                      Email
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100 py-4 px-6 text-left">
                      Role
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100 py-4 px-6 text-left">
                      Performance
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100 py-4 px-6 text-left">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell className="text-gray-800 dark:text-gray-100 py-4 px-6">
                          {employee.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                          {employee.email}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                          {employee.roleName}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                          <Button
                            variant="outline"
                            size="sm"
                            aria-label={`View analytics for ${employee.name}`}
                          >
                            <ChartLineIcon className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`Edit ${employee.name}`}
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Dialog
                              open={
                                deleteDialogOpen &&
                                employeeToDelete === employee.id
                              }
                              onOpenChange={(open) => {
                                setDeleteDialogOpen(open);
                                if (open) setEmployeeToDelete(employee.id);
                                else setEmployeeToDelete(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  aria-label={`Delete ${employee.name}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete{" "}
                                    {employee.name}? This action cannot be
                                    undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(employee.uuid)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow >
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        No employees found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
