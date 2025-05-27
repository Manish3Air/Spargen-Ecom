"use client";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/components/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminRoute>
  );
}
