import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";
import { Toaster } from "sonner";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your HTML file.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);