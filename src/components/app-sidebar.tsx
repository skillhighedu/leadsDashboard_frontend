import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  HomeIcon, 
  UsersIcon, 
  UserCogIcon, 
  LogOutIcon ,
 Users 

} from "lucide-react"
import {useAuthStore} from '@/context/authStore'
import { useStore } from "@/context/useStore"
export function AppSidebar() {
  const {logout} = useAuthStore()
  const {user} = useStore()
  console.log("User Role:", user?.role)
  return (
    <Sidebar className="w-[250px] min-h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
      <SidebarHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="text-primary">DashBoard</span>
        </h2>
      </SidebarHeader>

      <SidebarContent className="py-4">
  {
    user?.role?.toLowerCase() === 'administrator' && (
            <><SidebarGroup>
              <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
            </SidebarGroup><SidebarGroup>
                <Link to="/roles" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                  >
                    <UserCogIcon className="mr-2 h-5 w-5" />
                    Roles
                  </Button>
                </Link>
              </SidebarGroup><SidebarGroup>
                <Link to="/employees" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                  >
                    <UsersIcon className="mr-2 h-5 w-5" />
                    Employees
                  </Button>
                </Link>
                </SidebarGroup><SidebarGroup>
                <Link to="/teams" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Teams
                  </Button>
                </Link>
              </SidebarGroup></>
    )
  }
       {user?.role?.toLowerCase() === 'intern' && (
  <SidebarGroup>
    <Link to="/assigned_leads" className="block">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
      >
        <UsersIcon className="mr-2 h-5 w-5" />
        Assigned Leads
      </Button>
    </Link>
  </SidebarGroup>
)}

      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="ghost" 
          onClick={()=>logout()}
          className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-r-full"
        >
          <LogOutIcon className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}