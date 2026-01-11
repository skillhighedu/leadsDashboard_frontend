import "./App.css";

import Layout from "@/layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/pages/ProtectedRoutes";
import { useAuthStore } from "@/store/AuthStore";
import {  useEffect, useRef } from "react";
import Employe from "@/pages/Employe";
import AddRole from "@/pages/AddRole";
import Leads from "@/pages/Leads";
import AddEmployee from "@/pages/AddEmployee";
import Team from "@/pages/Team";
import AddTeam from "@/pages/AddTeam";
import RolePage from "@/pages/Role";
import { Roles } from "@/constants/role.constant";
import LeaveApplication from "@/pages/LeaveApplication";
import HrDashboard from "@/pages/HrDashboard";
import Rules from "@/pages/Rules";
import LeaveDashboard from "@/pages/LeaveDashboard";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { toast } from "sonner";
import Analytics from "@/pages/Analytics";
// import TeamAnalytics from "@/pages/analytics/TeamAnalytics";

import Profile from "./pages/Profile";

import OpsAnalytics from "./pages/OpsAnalytics";
import AnalyticsHub from "./pages/analytics/AnalyticsHub";
import AdminAnalytics from "./pages/analytics/AdminAnalytics";


function App() {
  const { checkAuth, loading, user } = useAuthStore();
  console.log("USER", user)

  const hasCheckedAuth = useRef(false);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {

      toast.error("Check your internet connection");

    }
  }, [isOnline]);

  useEffect(() => {
    // Only check auth once when app starts, user is null, and not on login page
    if (
      !hasCheckedAuth.current &&
      !user &&
      window.location.pathname !== "/login"
    ) {
      hasCheckedAuth.current = true;
      checkAuth();
    } else if (window.location.pathname === "/login") {
      // If on login page, just set loading to false
      hasCheckedAuth.current = true;
    }
  }, []); // Empty dependency array to run only once

  // Show loading while checking auth and no user exists (but not on login page)
  if (loading && !user && window.location.pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route - accessible to all authenticated users */}
        <Route element={<ProtectedRoute requiredRole={[Roles.ALL]} />}>
          <Route
            path="/"
            element={
              <Layout>
                <Rules />
              </Layout>
            }
          />
        </Route>
        {/* Protected Route - accessible to all authenticated users */}
        <Route
          element={
            <ProtectedRoute
              requiredRole={[
                Roles.EXECUTIVE,
                Roles.VERTICAL_MANAGER,
                Roles.LEAD_GEN_MANAGER,
                Roles.MARKETING_HEAD,
                Roles.INTERN,
                Roles.TL_IC,
                Roles.HR,
                Roles.OPSTEAM,
                Roles.ADMIN,
                Roles.FRESHER
              ]}
            />
          }
        >
          <Route
            path="/allLeads"
            element={
              <Layout>
                <Leads />
              </Layout>
            }
          />

          <Route
            path="/leave-application"
            element={
              <Layout>
                <LeaveApplication />
              </Layout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute requiredRole={[Roles.ADMIN]} />}>
          <Route
            path="/roles"
            element={
              <Layout>
                <RolePage />
              </Layout>
            }
          />

          <Route
            path="/create-role"
            element={
              <Layout>
                <AddRole />
              </Layout>
            }
          />

          <Route
            path="/adminAnalytics"
            element={
              <Layout>
                <AdminAnalytics />
              </Layout>
            }
          />

          <Route
            path="/employees"
            element={
              <Layout>
                <Employe />
              </Layout>
            }
          />
          <Route
            path="/teams"
            element={
              <Layout>
                <Team />
              </Layout>
            }
          />
          <Route
            path="/add_employee"
            element={
              <Layout>
                <AddEmployee />
              </Layout>
            }
          />
          <Route
            path="/create_team"
            element={
              <Layout>
                <AddTeam />
              </Layout>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              requiredRole={[
                Roles.VERTICAL_MANAGER,
                Roles.MARKETING_HEAD,
                Roles.LEAD_GEN_MANAGER,
              ]}
            />
          }
        >
          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />
        </Route>
        

        <Route
          element={
            <ProtectedRoute
              requiredRole={[Roles.EXECUTIVE, Roles.INTERN, Roles.FRESHER, Roles.TL_IC]}
            />
          }
        >
          <Route
            path="/team-analytics"
            element={
              <Layout>
                <AnalyticsHub />
              </Layout>
            }
          />
        </Route>
           <Route element={<ProtectedRoute requiredRole={[Roles.OPSTEAM]} />}>
         
           <Route
            path="/ops-analytics"
            element={
              <Layout>
                <OpsAnalytics/> 
              </Layout>
            }
          />
        

        </Route>

        <Route
          element={
            <ProtectedRoute
              requiredRole={[ Roles.EXECUTIVE,
                Roles.LEAD_MANAGER,
                Roles.VERTICAL_MANAGER,
                Roles.LEAD_GEN_MANAGER,
                Roles.MARKETING_HEAD,
                Roles.INTERN,
                Roles.FRESHER,
                Roles.TL_IC,
                Roles.HR,
                Roles.OPSTEAM, Roles.ADMIN]}
            />
          }
        >
          <Route
            path="/profile"
            element={
              <Layout>
                < Profile/>
              </Layout>
            }
          />
        </Route>


        <Route
          element={<ProtectedRoute requiredRole={[Roles.HR, Roles.ADMIN]} />}
        >
          <Route
            path="/staff-logins"
            element={
              <Layout>
                <HrDashboard />
              </Layout>
            }
          />

          <Route
            path="/leave-dashboard"
            element={
              <Layout>
                <LeaveDashboard />
              </Layout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute requiredRole={[Roles.HR]} />}>
          <Route
            path="/staff-logins"
            element={
              <Layout>
                <HrDashboard />
              </Layout>
            }
          />

          <Route
            path="/leave-dashboard"
            element={
              <Layout>
                <LeaveDashboard />
              </Layout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute requiredRole={[Roles.OPSTEAM]} />}>
          <Route
            path="/lead-payments"
            element={
              <Layout>
                <Leads />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
