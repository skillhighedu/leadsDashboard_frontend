import React, { createContext, useState, type ReactNode, useEffect } from "react";
import { checkRole } from "@/services/auth.services";

// Type for a single user
export interface User {
  role: string;
}

// Context shape
interface StoreContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await checkRole();
        setUser({ role: userData.role });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <StoreContext.Provider value={{ user, setUser, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
