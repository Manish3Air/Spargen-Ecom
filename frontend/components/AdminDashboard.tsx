"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BASE_URL from "@/utils/api";
import axios from "axios";
import { runFullDiagnosis } from "@/utils/testApi";
import {
  BarChart3,
  Boxes,
  IndianRupee,
  ReceiptText,
  Users,
  // TrendingUp,
  ShoppingCart,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { purple } from "next/dist/lib/picocolors";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  orderStatusDistribution: { status: string; count: number }[];
}

// Animated Counter Component
function AnimatedCounter({
  value,
  duration = 2000,
  formatter = (v: number) => v.toString(),
}: {
  value: number;
  duration?: number;
  formatter?: (v: number) => string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplayValue(0);
      return;
    }

    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;

    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{formatter(displayValue)}</span>;
}

// StatCard Component with gradient and animation
function StatCard({ title, value, icon: Icon, formatter, trend, color, delay = 0 }: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  formatter: (v: number) => string;
  trend?: number; // percentage change vs last month
  color?: "blue" | "purple" | "emerald" | "orange" | "pink";
  delay?: number; // animation delay in ms
}) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    emerald: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/50 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color || "blue"]} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            <AnimatedCounter value={value} formatter={formatter} />
          </p>

          {trend && (
            <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>

        <div className={`rounded-xl bg-gradient-to-br ${gradients[color || "blue"]} p-3 text-white shadow-lg transition-transform duration-500 group-hover:rotate-12`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setError("No authentication token found. Please login first.");
          setLoading(false);
          return;
        }

        console.log("Fetching dashboard stats from:", `${BASE_URL}/api/analytics`);
        console.log("Token:", token ? "Present" : "Missing");

        const res = await axios.get(`${BASE_URL}/api/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Dashboard stats response:", res.data);
        setStats(res.data);
        setError(null);
      } catch (error: unknown) {
        console.error("Failed to fetch dashboard stats:", error);
        const errorMsg = (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (error as { message?: string }).message || "Failed to load dashboard data";
        setError(errorMsg);
        
        // Set mock data for demonstration if API fails
        setStats({
          totalUsers: 1245,
          totalProducts: 89,
          totalOrders: 342,
          totalRevenue: 8750000,
          monthlyRevenue: [
            { month: "Jan", revenue: 1200000 },
            { month: "Feb", revenue: 1450000 },
            { month: "Mar", revenue: 1100000 },
            { month: "Apr", revenue: 1800000 },
            { month: "May", revenue: 2100000 },
            { month: "Jun", revenue: 2000000 },
          ],
          orderStatusDistribution: [
            { status: "Placed", count: 45 },
            { status: "Shipped", count: 120 },
            { status: "Out for Delivery", count: 89 },
            { status: "Delivered", count: 88 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Prepare chart data with better formatting
  const chartData = stats?.monthlyRevenue?.map((item) => ({
    month: item.month.substring(0, 3),
    revenue: Math.round(item.revenue / 1000), // in thousands
    fullRevenue: item.revenue,
  })) || [];

  const orderData = stats?.orderStatusDistribution?.map((item) => ({
    name: item.status,
    value: item.count,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 p-4 sm:p-6 lg:p-8">

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 rounded-full bg-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-300">Failed to load data</p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">Demo data is being shown. Please check your backend connection.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 transition"
                >
                  🔄 Retry
                </button>
                <button
                  onClick={() => runFullDiagnosis()}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition"
                >
                  🔧 Debug (Check Console)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col items-start gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-950/30">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Live Dashboard</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back 👋
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400">Here&apos;s what&apos;s happening with your store today</p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
            <p className="mt-4 text-slate-600 dark:text-zinc-400">Loading dashboard data...</p>
          </div>
        </div>
      ) : 
      ( <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* {console.log("Rendering StatCards with stats:", stats)} */}
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue ?? 5}
            icon={IndianRupee}
            color="blue"
            formatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`}
            trend={12.5}
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingCart}
            color="purple"
            formatter={(v: number) => v.toString()}
            trend={8.2}
            delay={100}
          />
          <StatCard
            title="Products"
            value={stats?.totalProducts ?? 0}
            icon={Boxes}
            color="emerald"
            formatter={(v: number) => v.toString()}
            trend={-2.4}
            delay={200}
          />
          <StatCard
            title="Active Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            color="orange"
            formatter={(v: number) => v.toString()}
            trend={15.3}
            delay={300}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend</h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400">Monthly revenue performance</p>
              </div>
              <Activity className="h-5 w-5 text-slate-400 dark:text-zinc-600" />
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    labelStyle={{ color: "#f1f5f9" }}
                    formatter={(value: number) => `₹${value}K`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <div className="text-center">
                  <Activity className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-700" />
                  <p className="mt-2 text-slate-500 dark:text-zinc-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Status Distribution */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order Status</h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400">Current distribution</p>
            </div>

            {orderData.length > 0 ? (
              <div className="space-y-4">
                {orderData.map((item, idx) => {
                  const total = orderData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = ((item.value / total) * 100).toFixed(0);
                  const colors = ["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-purple-500"];

                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{item.name}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${colors[idx % colors.length]} transition-all duration-700`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-slate-500 dark:text-zinc-500">No order data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Products",
              description: "Manage your inventory",
              href: "/admin/products",
              button: "Go to Products",
              icon: Boxes,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              title: "Orders",
              description: "Review and update orders",
              href: "/admin/orders",
              button: "View Orders",
              icon: ReceiptText,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              title: "Analytics",
              description: "Detailed performance metrics",
              href: "/admin/analytics",
              button: "Open Analytics",
              icon: BarChart3,
              gradient: "from-emerald-500 to-emerald-600",
            },
          ].map(({ title, description, href, button, icon: Icon, gradient }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/50 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />

              <div className="relative">
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{description}</p>

                <button
                  onClick={() => router.push(href)}
                  className="group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg dark:from-white dark:to-white dark:text-slate-900"
                >
                  {button}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "System Status", status: "Operational", indicator: "emerald" },
            { label: "API Health", status: "Healthy", indicator: "emerald" },
            { label: "Database", status: "Connected", indicator: "emerald" },
            { label: "Server Load", status: "Normal", indicator: "emerald" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200/50 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-zinc-400">{item.label}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full bg-${item.indicator}-500 animate-pulse`} />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.status}</p>
              </div>
            </div>
          ))}
        </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

      </div> )}


        </div>
    
  )
};
