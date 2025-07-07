// store/AuthStore.ts
import { create } from "zustand";
import api from "@/config/axiosConfig";

interface AuthState {
  user: null | { role: string };
  loading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // Add flag to prevent multiple simultaneous checks
  checkAuth: () => Promise<void>;
  logout: () => void;
  login: (userData: { role: string }) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isCheckingAuth: false,

  checkAuth: async () => {
    // Prevent multiple simultaneous auth checks
    if (get().isCheckingAuth) {
      console.log("Auth check already in progress, skipping...");
      return;
    }

    // Check if we're on login page - if so, don't check auth
    if (window.location.pathname === '/login') {
      console.log("On login page, skipping auth check");
      set({ loading: false, isCheckingAuth: false });
      return;
    }

    set({ isCheckingAuth: true });

    try {
      const res = await api.get("/check/auth/role", {
        withCredentials: true, // send cookie
      });
      
      console.log("Auth response:", res);
      console.log("Response data:", res.data);
      
      // Handle different possible response structures
      let userRole = null;
      
      if(res.data && res.data.additional && res.data.additional.role) 
      {
        userRole = res.data.additional.role;
      }

      if (userRole) {
        set({ user: { role: userRole }, loading: false, error: null, isCheckingAuth: false });
      } else {
        console.warn("No role found in response:", res.data);
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      }
    } catch (err: unknown) {
      console.error("Auth check error:", err);
      // Handle 401 errors gracefully - just clear user state
      if (typeof err === 'object' && err !== null && 'response' in err && (err as { response?: { status?: number } }).response?.status === 401) {
        console.log("401 Unauthorized - clearing user state");
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      } else {
        // For other errors, still clear state but log the error
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      }
    }
  },

  logout: async () => {
    try {
      // Call logout API
      await api.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Always clear local state regardless of API call success
      set({ user: null, loading: false, error: null, isCheckingAuth: false });
    }
  },

  login: (userData: { role: string }) => {
    set({ user: userData, loading: false, error: null, isCheckingAuth: false });
  },
}));
