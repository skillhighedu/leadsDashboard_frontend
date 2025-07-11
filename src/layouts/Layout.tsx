import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}


export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <AppSidebar />

        {/* Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Navbar: full-width always */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

