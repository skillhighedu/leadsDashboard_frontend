import { Button } from "@/components/ui/button";
import { Bell, Settings, User, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  const { user, logout } = useAuthStore();

  const getUserDisplayName = () => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden lg:block">
          <h1 className="text-mg font-semibold text-gray-800">{getUserDisplayName()} Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button> */}

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500">{user?.role || "User"}</p>
          </div>
          {/* User Menu Button */}
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
} 