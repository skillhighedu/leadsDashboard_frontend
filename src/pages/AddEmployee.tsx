import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee, editEmployee } from "@/services/employes.services";
import { fetchRoles } from "@/services/role.services";
import { Eye, EyeOff } from "lucide-react";

export default function AddEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingEmployee = location.state?.employee;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleId, setRoleId] = useState<string>("");
  const [roles, setRoles] = useState<
    { id: number; name: string; uuid: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const fetched = await fetchRoles();
        setRoles(fetched);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };

    loadRoles();
  }, []);

  useEffect(() => {
    if (editingEmployee) {
      setEmail(editingEmployee.email);
      setName(editingEmployee.name);
      setRoleId(editingEmployee.roleId.toString());
    }
  }, [editingEmployee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || (!editingEmployee && !password) || !roleId) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email,
        name,
        password,
        roleId,
      };

      if (editingEmployee) {
        await editEmployee(editingEmployee.id, payload);
      } else {
        await createEmployee(payload);
      }

      navigate("/employees");
    } catch (err) {
      console.error("Failed to save employee", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-12">
      <div className="w-full max-w-xl bg-white p-10 border rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold">
          {editingEmployee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          {!editingEmployee && (
            <div className="relative">
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 pr-10"
                required
              />
              <div
                className="absolute inset-y-0 right-3 top-7 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
            </div>
          )}

          <div>
            <Label>Role</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.uuid}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full py-6 text-base font-medium"
            disabled={loading}
          >
            {loading
              ? editingEmployee
                ? "Updating..."
                : "Creating..."
              : editingEmployee
              ? "Update Employee"
              : "Create Employee"}
          </Button>
        </form>
      </div>
    </div>
  );
}
