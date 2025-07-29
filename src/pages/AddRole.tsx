import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createRole, editRole } from "@/services/role.services"

const validRoles = [
  "administrator",
  "verticalManager",
  "leadManager",
  "bdm",
  "experiencedIntern",
  "hr",
  "OpsTeam",
  "marketingHead",
  "leadGenerationManager",
  "tl-ic"
] as const

const defaultPermissions = {
  uploadData: false,
  createData: false,
  editData: false,
  assignData: false,
  deleteData: false,
}

export default function AddRole() {
  const location = useLocation()
  const navigate = useNavigate()
  const editingRole = location.state?.role

  const [roleName, setRoleName] = useState("")
  const [permissions, setPermissions] = useState(defaultPermissions)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Pre-fill form if editing
  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.name)
      setPermissions(editingRole.permissions)
    }
  }, [editingRole])

  const handleCheckboxChange = (key: keyof typeof defaultPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validRoles.includes(roleName as any)) {
      setError("Please enter a valid role name.")
      return
    }

    setError("")
    const payload = {
      name: roleName,
      permissions,
    }

    try {
      setLoading(true)
      if (editingRole) {
        await editRole(editingRole.uuid, payload)
      } else {
        await createRole(payload)
      }

      navigate("/roles")
    } catch (err) {
      console.error("Failed to save role", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center py-12">
      <div className="w-full max-w-xl bg-white p-10 border rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold">{editingRole ? "Edit Role" : "Add Role"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              placeholder="e.g. administrator"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="mt-2"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <Label className="mb-2 block">Permissions</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(defaultPermissions).map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={permissions[key as keyof typeof defaultPermissions]}
                    onCheckedChange={() =>
                      handleCheckboxChange(key as keyof typeof defaultPermissions)
                    }
                  />
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-base py-6 text-white font-medium"
            disabled={loading}
          >
            {loading ? (editingRole ? "Updating..." : "Creating...") : editingRole ? "Update Role" : "Create Role"}
          </Button>
        </form>
      </div>
    </div>
  )
}
