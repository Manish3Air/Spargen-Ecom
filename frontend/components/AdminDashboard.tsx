"use client";

import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import BASE_URL from "@/utils/api";
import axios from "axios";



interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  orderStatusDistribution: { status: string; count: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const metrics = [
  { id: 1, title: "Total Products", value: stats?.totalProducts, icon: "📦" },
  { id: 2, title: "Total Orders", value: stats?.totalOrders, icon: "🛒" },
  { id: 3, title: "Total Revenue", value: stats?.totalRevenue, icon: "💰" },
];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}/api/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-[#f0f5ff] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8">👨‍💼 Admin Dashboard</h1>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map(({ id, title, value, icon }) => (
          <div
            key={id}
            className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-neumorphic flex flex-col items-center"
          >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl font-bold mt-2">₹{value}</p>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-neumorphic text-center">
          <h2 className="text-xl font-semibold mb-2">📦 Products</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Manage your product inventory
          </p>
          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 rounded shadow font-semibold transition"
          >
            Manage Products
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-neumorphic text-center">
          <h2 className="text-xl font-semibold mb-2">🛒 Orders</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">View all customer orders</p>
          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 rounded shadow font-semibold transition"
          >
            View Orders
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-neumorphic text-center">
          <h2 className="text-xl font-semibold mb-2">📊 Analytics</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Dashboard stats and metrics</p>
          <button
            onClick={() => router.push("/admin/analytics")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 rounded shadow font-semibold transition"
          >
            View Analytics
          </button>
        </div>
      </div>
    </main>
  );
}
