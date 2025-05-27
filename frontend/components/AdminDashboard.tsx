"use client";

import { useRouter } from "next/navigation";

const metrics = [
  { id: 1, title: "Total Products", value: 350, icon: "📦" },
  { id: 2, title: "Total Orders", value: 1245, icon: "🛒" },
  { id: 3, title: "Total Revenue", value: "$98,230", icon: "💰" },
];

export default function AdminDashboard() {
  const router = useRouter();

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
            <p className="text-2xl font-bold mt-2">{value}</p>
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
