import { useContext } from "react";
import AuthContext from "./AuthContext";

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }
  return context;
};