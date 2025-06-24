import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { fetchRoles } from "@/services/role.services"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, PencilIcon, Trash2 } from "lucide-react"

// Define Role and Permission types
type Permission = {
  uploadData: boolean
  createData: boolean
  editData: boolean
  assignData: boolean
  deleteData: boolean
}

type Role = {
  id: number
  name: string
  permissions: Permission
}

export default function Role() {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRoles() // assumes API returns Role[]
        setRoles(response)
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Roles
        </h1>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Role
        </Button>
      </div>

      {/* Roles Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Roles Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Role Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Upload
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Create
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Edit
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Delete
                </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow
                  key={role.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="text-gray-800 dark:text-gray-100 py-4 px-6">
                    {role.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                    {role.permissions.uploadData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                    {role.permissions.createData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                    {role.permissions.editData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                    {role.permissions.deleteData ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 py-4 px-6">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                             
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Dialog
                            
                            >
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
                                    Are you sure you want to delete ? This action
                                    cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                  
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                   
                                  >
                                    Delete
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
  )
}
