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
         <SidebarTrigger className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer" />
      <main className="min-h-screen">

        {children}
      </main>
    </SidebarProvider>
  );
}
