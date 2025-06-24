import { useContext } from "react";
import StoreContext from "./AppContext";

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};