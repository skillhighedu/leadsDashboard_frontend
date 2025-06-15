import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/context/authStore";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};