import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { useState, type ReactNode } from "react";
import { useDailyPopup } from "@/hooks/useDailyPopup";

interface LayoutProps {
  children: ReactNode;
}


export default function Layout({ children }: LayoutProps) {
    
    const [open, setOpen] = useState(false);

    useDailyPopup(()=> setOpen(true), 19,55, 0) 


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
          <main className=" relative flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
        </div>
        {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 rounded-xl bg-white p-6 shadow-xl max-w-sm w-[90%]">
            <h2 className="text-lg font-semibold mb-2">Heads up!</h2>
            <p className="mb-4">It’s 7:55 PM — 5 minutes later hit on the deactivate button.</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border px-3 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </SidebarProvider>
  );
}

