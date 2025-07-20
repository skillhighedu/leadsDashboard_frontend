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
  DialogClose,
} from "@/components/ui/dialog";

import { PlusIcon, PencilIcon, Trash2 } from "lucide-react";

import {
  deleteEmployee,
  editEmployee,
  EmploymentStatus,
  fetchEmployes,
  updateEmployeeStatus,
  type Employee,
} from "@/services/employes.services";
import { Link } from "react-router-dom";
import type { RoleInfo } from "@/services/team.services";
import { fetchRoles } from "@/services/role.services";

import { toast } from "sonner";

export default function Employee() {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [roles, setRoles] = useState<RoleInfo[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    roleId: string;
    password: string;
  }>({
    name: "",
    email: "",
    roleId: "",
    password: "",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRoles();

        setRoles(response);
      } catch (error) {
        console.error("Error fetching roles:", error);
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

  const handleDelete = async (uuid: string) => {
    await deleteEmployee(uuid);
    setEmployeeData(employeeData.filter((employee) => employee.uuid !== uuid));
  };

  const handleEditSubmit = async () => {
    if (!employeeToEdit) return;

    try {
      await editEmployee(employeeToEdit.uuid, {
        name: editForm.name,
        email: editForm.email,
        roleId: editForm.roleId,
        ...(editForm.password.trim() ? { password: editForm.password } : {}),
      });

      const updated = await fetchEmployes();
      setEmployeeData(updated);
      setEditDialogOpen(false);
      setEmployeeToEdit(null);
    } catch (error) {
      console.error("Edit failed", error);
    }
  };
  const handleStatusChange = async (
    employeeId: string,
    newStatus: EmploymentStatus
  ) => {
    try {
      await updateEmployeeStatus(employeeId, newStatus);
      toast.success("Employment status updated");

      const updated = await fetchEmployes();
      setEmployeeData(updated);
    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update status");
    }
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee.uuid}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.roleName}</TableCell>
                        <TableCell>
                          <Select
                            value={employee.employmentStatus}
                            onValueChange={async (value) =>
                              handleStatusChange(
                                employee.uuid,
                                value as EmploymentStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      employee.employmentStatus ===
                                      EmploymentStatus.IS_WORKING
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  ></span>
                                  <span>
                                    {employee.employmentStatus ===
                                    EmploymentStatus.IS_WORKING
                                      ? "Working"
                                      : "Not Working"}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value={EmploymentStatus.IS_WORKING}>
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-green-500" />
                                  Working
                                </div>
                              </SelectItem>
                              <SelectItem value={EmploymentStatus.NOT_WORKING}>
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-red-500" />
                                  Not Working
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEmployeeToEdit(employee);
                                const matchingRole = roles.find(
                                  (r) =>
                                    r.name.toLowerCase() ===
                                    employee.roleName.toLowerCase()
                                );
                                setEditForm({
                                  name: employee.name,
                                  email: employee.email,
                                  roleId: matchingRole?.uuid || "",
                                  password: "",
                                });
                                setEditDialogOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                                    <b>{employee.name}</b>? This action cannot
                                    be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={async () => {
                                        await handleDelete(employee.uuid);
                                        toast.success(
                                          `Employee ${employee.name} deleted successfully`
                                        );
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
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

      {employeeToEdit && (
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => setEditDialogOpen(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update name, role or password
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <Input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Role</label>
                <Select
                  value={editForm.roleId}
                  onValueChange={(val) =>
                    setEditForm((prev) => ({ ...prev, roleId: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.uuid} value={role.uuid}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">New Password</label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
