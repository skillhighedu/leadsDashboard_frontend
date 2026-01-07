import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import {
  activateStaffLogin,
  deactivateStaffLogin,
} from "@/services/hr.services";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Roles } from "@/constants/role.constant";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/utils/errorHandler";


export function Navbar() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const getUserDisplayName = () => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  const navigate = useNavigate();

  const handleToggleActivation = async () => {
    try {
      setLoading(true);
      const updatedLogin =
        user?.isActive === true
          ? await deactivateStaffLogin()
          : await activateStaffLogin();

      setUser({
        ...user!,
        isActive: updatedLogin.isActive,
      });
      toast.success(
        user?.isActive ? "Deactivated successfully!" : "Activated successfully."
      );
    } catch (error) {
        handleApiError(error)
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3  flex items-center justify-between ">
      {/* Left: Sidebar Trigger + Dashboard Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="text-xl font-bold text-gray-900 select-none cursor-default">
          {getUserDisplayName()} Dashboard
        </span>
      </div>
      {/* Right: User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-gray-500">{user?.role || "User"}</p>
        </div>

         {user?.role !== Roles.ADMIN && (
          user?.isActive ? (
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? "Updating..." : "Deactivate"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deactivate Login</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to deactivate your login?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleToggleActivation}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              size="sm"
              onClick={handleToggleActivation}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Updating..." : "Activate"}
            </Button>
          )
        )}

        <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
          <User className="h-15 w-15" />
        </Button>
      </div>
    </header>
  );
}
