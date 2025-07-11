import "./App.css";
import Home from "@/pages/Home";
import Layout from "@/layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/pages/ProtectedRoutes";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useRef } from "react";

import Employe from "@/pages/Employe";
import AddRole from "@/pages/AddRole";
import Leads from "@/pages/Leads";
import AddEmployee from "@/pages/AddEmployee";
import Team from "@/pages/Team";
import AddTeam from "@/pages/AddTeam";
// import Analytics from "./pages/Analytics";
import RolePage from "./pages/Role";
import { Roles } from "./contants/role.constant";
import HrDashboard from "./pages/HrDashboard";

function App() {
  const { checkAuth, loading, user } = useAuthStore();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once when app starts, user is null, and not on login page
    if (!hasCheckedAuth.current && !user && window.location.pathname !== '/login') {
      hasCheckedAuth.current = true;
      checkAuth();
    } else if (window.location.pathname === '/login') {
      // If on login page, just set loading to false
      hasCheckedAuth.current = true;
    }
  }, []); // Empty dependency array to run only once

  // Show loading while checking auth and no user exists (but not on login page)
  if (loading && !user && window.location.pathname !== '/login') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
                <Home />
              </Layout>
            }
          />
        </Route>
        {/* Protected Route - accessible to all authenticated users */}
        <Route element={<ProtectedRoute requiredRole={[Roles.EXECUTIVE,Roles.LEAD_MANAGER,Roles.VERTICAL_MANAGER]} />}>

          <Route
            path="/allLeads"
            element={
              <Layout>
                <Leads />
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
          {/* Uncomment when Analytics page is ready */}
          {/* <Route
        path="/analytics"
        element={
          <Layout>
            <Analytics />
          </Layout>
        }
      /> */}
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
        </Route>


      </Routes>
    </BrowserRouter>

  );
}

export default App;
