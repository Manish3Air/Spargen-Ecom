// components/AdminLayout.tsx
"use client";

import { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { AuthProvider } from "../context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#f0f5ff] dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
    </AuthProvider>
    
  );
}
