import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-dvh w-full bg-gray-50">
        <div className="flex h-full">
          {/* Sidebar */}
          <AppSidebar />

          {/* Right side */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Fixed navbar */}
            <Navbar />

            {/* The ONLY scroll container */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[1600px] px-6 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
