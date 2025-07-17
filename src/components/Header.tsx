import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"
import { Bell, Menu, LogOut } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="w-full border-b bg-background px-4 py-2 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 md:hidden" />
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
