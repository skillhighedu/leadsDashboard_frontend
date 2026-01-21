import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
// import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { useProfile } from "@/hooks/useProfile";

export function Navbar() {
  const { user, setUser } = useAuthStore();
  const { profile, loading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const name = profile?.name || "User";
  const role = profile?.role || "";
  // @ts-ignore
  const team = profile?.team?.name || profile?.teamName || "";



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
        user?.isActive
          ? "Deactivated successfully!"
          : "Activated successfully."
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 py-1 flex items-center justify-end">
      
      {/* LEFT — navigation only */}
      {/* <div className="flex items-center">
        <SidebarTrigger />
      </div> */}

      {/* RIGHT — identity + actions */}
      <div className="flex items-center gap-4">

        {/* Identity */}
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-900">
              {profileLoading ? "Loading…" : name}
            </span>
            <span className="text-xs text-gray-500">
              {team ? `${team} • ${role}` : role}
            </span>
          </div>

          {/* Avatar */}
          {/* <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow">
            {profileLoading ? "…" : initials}
          </div> */}
        </div>

        {/* Activation */}
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

        {/* Profile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
