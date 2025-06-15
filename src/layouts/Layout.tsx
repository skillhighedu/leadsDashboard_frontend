import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
         <SidebarTrigger />
      <main className="pl-64 min-h-screen bg-gray-50">
     
        {children}
      </main>
    </SidebarProvider>
  );
}
