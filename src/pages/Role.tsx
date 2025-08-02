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
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { fetchRoles, deleteRole } from "@/services/role.services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, PencilIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


type Permission = {
  uploadData: boolean;
  createData: boolean;
  editData: boolean;
  assignData: boolean;
  deleteData: boolean;
};

type Role = {
  id: number;
  name: string;
  uuid: string;
  permissions: Permission;
};

export default function Role() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const getRoles = async () => {
    try {
      const response = await fetchRoles();
      console.log(response);
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleDeleteRole = async (uuid: string) => {
    try {
      setLoadingId(uuid);
      await deleteRole(uuid);
      await getRoles(); // Refresh roles list
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
    
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Roles
        </h1>
        <Link to="/create-role">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Role
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Roles Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Create</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Assign</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    {role.permissions?.uploadData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell>
                    {role.permissions?.createData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell>
                    {role.permissions?.editData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell>
                    {role.permissions?.deleteData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell>
                    {role.permissions?.assignData? "✅" : "❌"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate("/create-role", { state: { role } })
                        }
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
                              Are you sure you want to delete <b>{role.name}</b>
                              ? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteRole(role.uuid)}
                              disabled={loadingId === role.uuid}
                            >
                              {loadingId === role.uuid
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
