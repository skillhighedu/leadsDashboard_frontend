import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, Settings } from "lucide-react"
import { Link } from "react-router-dom"

export function AppSidebar() {
  return (
    <Sidebar className="w-[250px] min-h-screen bg-gray-100 dark:bg-gray-900">
      <SidebarHeader>
        <h2 className="text-xl font-semibold px-4 py-2">Dashboard</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="Main">
          <Button variant="default" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </SidebarGroup>

        <SidebarGroup title="Settings">
          <Link to="/home">
          <Button  variant="default" className="w-full justify-start ">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
          </Link>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <p className="text-xs text-muted-foreground">© 2025 Your Company</p>
      </SidebarFooter>
    </Sidebar>
  )
}
