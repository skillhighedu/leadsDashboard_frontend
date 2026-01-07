import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  UserCogIcon,
  LogOutIcon,
  Users,
  Menu,
  ChartNoAxesColumnIncreasingIcon
} from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import { Roles } from "@/constants/role.constant";
import Logo from "@/assets/favicon.png";
export function AppSidebar() {
  const { logout } = useAuthStore();
  const { user } = useAuthStore();

  return (
    <Sidebar className="w-[200px] min-h-screen flex-shrink-0 flex-grow-0 bg-white  border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
      <SidebarHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-20 h-20 object-contain" />
            <span className="text-primary text-2xl tracking-wide">CRM</span>
          </h2>

          <SidebarTrigger className="lg:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {user?.role?.toLowerCase() === Roles.ADMIN.toLowerCase() && (
          <>
            <SidebarGroup>
              <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
            </SidebarGroup>
             <SidebarGroup>
              <Link to="/analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            </SidebarGroup>
            <SidebarGroup>
              <Link to="/roles" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <UserCogIcon className="mr-2 h-5 w-5" />
                  Roles
                </Button>
              </Link>
            </SidebarGroup>
            <SidebarGroup>
              <Link to="/employees" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <UsersIcon className="mr-2 h-5 w-5" />
                  Employees
                </Button>
              </Link>
            </SidebarGroup>

            <SidebarGroup>
              <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                All Leads
              </Button>
            </Link>
            </SidebarGroup>


            <SidebarGroup>
              <Link to="/teams" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Teams
                </Button>
              </Link>
            </SidebarGroup>
            <Link to="/staff-logins" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Staff logins
              </Button>
            </Link>
              <Link to="/leave-dashboard" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Dashboard
              </Button>
            </Link>
          </>
        )}
        {user?.role?.toLowerCase() === Roles.INTERN.toLowerCase()  && (
          <SidebarGroup>
            <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link to="/team-analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Analytics
             
                </Button>
              </Link>
              
  
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Assigned Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Application
              </Button>
            </Link>
          </SidebarGroup>
        )}
        {user?.role?.toLowerCase() === Roles.FRESHER.toLowerCase()  && (
          <SidebarGroup>
            <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link to="/team-analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
              
  
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Assigned Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Application
              </Button>
            </Link>
          </SidebarGroup>
        )}
        { user?.role?.toLowerCase() === Roles.TL_IC.toLowerCase() && (
          <SidebarGroup>
            <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link to="/team-analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Team Analytics
             
                </Button>
              </Link>
              
  
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Assigned Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Application
              </Button>
            </Link>
          </SidebarGroup>
        )}
        { user?.role === Roles.LEAD_GEN_MANAGER && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
               <Link to="/analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                All Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                   Leave Application
              </Button>
            </Link>
          </SidebarGroup>
        )}
        {user?.role === Roles.VERTICAL_MANAGER   && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
               <Link to="/analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                All Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Applicatiobn
              </Button>
            </Link>
          </SidebarGroup>
        )}
        {user?.role === Roles.MARKETING_HEAD && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
               <Link to="/analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                All Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Applicatiobn
              </Button>
            </Link>
          </SidebarGroup>
        )}

        {user?.role === Roles.EXECUTIVE && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
               <Link to="/team-analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Team Analytics
             
                </Button>
              </Link>
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                All Leads
              </Button>
            </Link>
               <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                    Leave Application
              </Button>
            </Link>
          </SidebarGroup>
        )}
        
        {user?.role === Roles.HR && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
            <Link to="/staff-logins" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Staff logins
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Application
              </Button>
            </Link>
            <Link to="/leave-dashboard" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Dashboard
              </Button>
            </Link>
          </SidebarGroup>
        )}
         {user?.role === Roles.OPSTEAM && (
          <SidebarGroup>
             <Link to="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
               <Link to="/ops-analytics" className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
                >
                  <ChartNoAxesColumnIncreasingIcon className="mr-2 h-5 w-5" />
                  Analytics
             
                </Button>
              </Link>
            <Link to="/allLeads" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                 Leads
              </Button>
            </Link>
            <Link to="/leave-application" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-full mb-1"
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Leave Application
              </Button>
            </Link>
         
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={() => logout()}
    disabled={user?.isActive} // 🔒 disables logout while active
    className={`w-full justify-start rounded-r-full ${
      user?.isActive
        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
    }`}
        >
          <LogOutIcon className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
