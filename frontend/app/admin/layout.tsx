"use client";

import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
