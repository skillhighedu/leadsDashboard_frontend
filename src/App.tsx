import "./App.css";
import Home from "@/pages/Home";
import Layout from "@/layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/pages/ProtectedRoutes";
import { useStore } from "@/context/useStore";
import { useEffect } from "react";
import Role from "./pages/Role";
import Employe from "./pages/Employe";
import AddRole from "./pages/AddRole";
import Leads from "./pages/Leads";
import AddEmployee from "./pages/AddEmployee";
import Team from "./pages/Team";
import AddTeam from "./pages/AddTeam";
// import Analytics from "./pages/Analytics";

function App() {
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      console.log("User:", user.role);
    }
  }, [user]);



  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route - accessible to all authenticated users */}
        <Route element={<ProtectedRoute requiredRole={['administrator', 'intern',"leadManager"]} />}>

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
        <Route element={<ProtectedRoute requiredRole={["leadManager"]} />}>

          <Route
            path="/allLeads"
            element={
              <Layout>
                <Leads />
              </Layout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute requiredRole={['administrator']} />}>

          <Route
            path="/roles"
            element={
              <Layout>
                <Role />
              </Layout>
            }
          />
           <Route
            path="/create-role"
            element={
              <Layout>
                <AddRole/>
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



      </Routes>
    </BrowserRouter>

  );
}

export default App;
