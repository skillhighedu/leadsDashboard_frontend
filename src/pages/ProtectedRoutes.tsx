import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { toast } from "sonner";
import { Roles } from "@/constants/role.constant";

interface ProtectedRouteProps {
  requiredRole: string[];
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuthStore();

  console.log("user inside route:", user,requiredRole);
  // ✅ Correct loading check
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but no role, redirect to login
  if (!user.role) {
    return <Navigate to="/login" replace />;
  }


  const isAllowed =
    requiredRole.includes(Roles.ALL) || requiredRole.includes(user.role);
    console.log("isAllowed:", isAllowed, "user role:", user.role, "requiredRole:", requiredRole); 
  if (!isAllowed) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};
