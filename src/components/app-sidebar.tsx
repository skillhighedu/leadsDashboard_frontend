import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  UserCog,
  LogOut,
  BarChart3,
  Briefcase,
  UserCheck,
  ClipboardList,
  Menu,
} from "lucide-react"
import { useAuthStore } from "@/store/AuthStore"
import { Roles } from "@/constants/role.constant"
import { SidebarNavItem } from "@/components/SidebarNavItem"

type NavItem = {
  label: string
  path: string
  icon: any
}

export function AppSidebar() {
  const { logout, user } = useAuthStore()
  const { setOpen } = useSidebar()
  const close = () => setOpen(false)

  const nav: Record<string, NavItem[]> = {
    [Roles.ADMIN]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/adminAnalytics", icon: BarChart3 },
      { label: "Roles", path: "/roles", icon: UserCog },
      { label: "Employees", path: "/employees", icon: Users },
      { label: "All Leads", path: "/allLeads", icon: Briefcase },
      { label: "Teams", path: "/teams", icon: UserCheck },
      { label: "Staff Logins", path: "/staff-logins", icon: ClipboardList },
      { label: "Leave Dashboard", path: "/leave-dashboard", icon: ClipboardList },
    ],

    [Roles.INTERN]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/team-analytics", icon: BarChart3 },
      { label: "Assigned Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.FRESHER]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/team-analytics", icon: BarChart3 },
      { label: "Assigned Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.TL_IC]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Team Analytics", path: "/team-analytics", icon: BarChart3 },
      { label: "Assigned Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.LEAD_GEN_MANAGER]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      { label: "All Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.VERTICAL_MANAGER]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      { label: "All Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.MARKETING_HEAD]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      { label: "All Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.EXECUTIVE]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Team Analytics", path: "/team-analytics", icon: BarChart3 },
      { label: "All Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],

    [Roles.HR]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Staff Logins", path: "/staff-logins", icon: Users },
      { label: "Leave Requests", path: "/leave-application", icon: ClipboardList },
      { label: "Leave Dashboard", path: "/leave-dashboard", icon: BarChart3 },
    ],

    [Roles.OPSTEAM]: [
      { label: "Home", path: "/", icon: Home },
      { label: "Analytics", path: "/ops-analytics", icon: BarChart3 },
      { label: "Leads", path: "/allLeads", icon: Briefcase },
      { label: "Leave", path: "/leave-application", icon: ClipboardList },
    ],
  }

  const items = nav[user?.role || ""] || []

  return (
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader className="px-3 py-4 flex justify-between">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup className="space-y-1">
          {items.map((item) => (
            <SidebarNavItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              onClick={close}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t">
        <Button
          variant="ghost"
          onClick={() => logout()}
          disabled={user?.isActive}
          className="w-full justify-start gap-3 text-red-600"
        >
          <LogOut className="h-4 w-4" />
         
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
