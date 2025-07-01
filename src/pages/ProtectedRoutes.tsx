import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/context/useStore";
import { toast } from "sonner";

interface ProtectedRouteProps {
  requiredRole: string[];
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useStore();

  if (loading) {
    return <div>Loading...</div>; // Optional spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log("User role:", user.role);
  console.log("Required role:", requiredRole);
  if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
