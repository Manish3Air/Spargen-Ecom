"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import BASE_URL from "../../../utils/api";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  orderStatusDistribution: { status: string; count: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

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
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Admin Analytics Dashboard</h1>

      {stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card title="Total Users" value={stats.totalUsers} />
            <Card title="Total Products" value={stats.totalProducts} />
            <Card title="Total Orders" value={stats.totalOrders} />
            <Card title="Total Revenue" value={`₹{stats.totalRevenue.toFixed(2)}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">📅 Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyRevenue}>
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">📦 Order Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.orderStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {stats.orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">Loading analytics...</p>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white">{title}</h2>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
  );
}
