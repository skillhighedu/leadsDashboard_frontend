
import { create } from "zustand";
import api from "@/config/axiosConfig";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

interface User {
  role: string;
  isActive?: boolean; // Optional for admin
  permissions? : {
    assignData: boolean,
    createData: boolean,
    deleteData: boolean,
    editData: boolean,
    uploadData: boolean
  }
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // Add flag to prevent multiple simultaneous checks
  checkAuth: () => Promise<void>;
  logout: () => void;
  login: (userData: { role: string }) => void;
  updateIsActive: (active: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isCheckingAuth: false,

  checkAuth: async () => {
    // Prevent multiple simultaneous auth checks
    if (get().isCheckingAuth) {
    //   console.log("Auth check already in progress, skipping...");
      return;
    }

    // Check if we're on login page - if so, don't check auth
    if (window.location.pathname === "/login") {
    //   console.log("On login page, skipping auth check");
      set({ loading: false, isCheckingAuth: false });
      return;
    }

    set({ isCheckingAuth: true });

    try {
      const res = await api.get("/check/auth/role", {
        withCredentials: true, // send cookie
      });

      // Handle different possible response structures
      //   let userRole = null;

      //   if(res.data && res.data.additional && res.data.additional.role)
      //   {
      //     userRole = res.data.additional.role;
      //   }

      const role = res.data?.additional?.role;
      const isActive = res.data?.additional?.isActive;
      const permissions = res.data?.additional?.permissions;
      
      
      


      if (role) {
        set({
          user: { role: role, isActive, permissions },
          loading: false,
          error: null,
          isCheckingAuth: false,
        });
        
      } else {
        // console.warn("No role found in response:", res.data);
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      }
    } catch (err: unknown) {
    //   console.error("Auth check error:", err);
      // Handle 401 errors gracefully - just clear user state
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 401
      ) {
        // console.log("401 Unauthorized - clearing user state");
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      } else {
        // For other errors, still clear state but log the error
        set({ user: null, loading: false, error: null, isCheckingAuth: false });
      }
    }
  },

  logout: async () => {
    const {user} = get();
    if (user?.isActive) {
    toast.warning("Please deactivate before logging out.");
    return;
  }
    try {
        
      // Call logout API
      await api.put("/staff/logout", {}, { withCredentials: true });

      toast.success("Logged out successfully");
      set({ user: null, loading: false, error: null, isCheckingAuth: false });
        window.location.href = "/login";
    } catch (err: unknown) {
        handleApiError( err);
        toast.error("To logout, first activate your login and then deactivate.");
    } 
  },

  login: (userData: User) => {
    set({ user: userData, loading: false, error: null, isCheckingAuth: false });
  },

  updateIsActive: (active: boolean) => {
    set((state) => {
        if (!state.user) return {};
        return {
            user: {
                ...state.user,
                isActive: active
            }
        }
    })
  },

  setUser: (user: User | null) => {
    set({user});
  }
}));
