"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Admin Header - Mobile Only */}
      <AdminHeader onMenuToggle={handleMenuToggle} />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          aria-label="Close admin navigation"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex min-h-[calc(100vh-64px)] lg:min-h-screen">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onNavigate={handleCloseSidebar} />

        {/* Main Content */}
        <div className="w-full flex-1 overflow-auto lg:ml-64">
          <div className="min-h-full">
            <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
