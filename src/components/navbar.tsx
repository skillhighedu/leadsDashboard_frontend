import { Button } from "@/components/ui/button";
import {  User } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  const { user } = useAuthStore();

  const getUserDisplayName = () => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
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
          <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
          <p className="text-xs text-gray-500">{user?.role || "User"}</p>
        </div>
        <Button variant="ghost" size="icon" >
          <User className="h-15 w-15" />
        </Button>
      </div>
    </header>
  );
} 