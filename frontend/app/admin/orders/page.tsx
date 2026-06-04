"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  actualTotal: number;
  userEmail: string;
  user: string;
  shippingInfo: ShippingInfo;
  createdAt: string;
  orderstatus: "Placed" | "Shipped" | "Out for Delivery" | "Delivered";
}

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG = {
  Placed: {
    icon: Package,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    badgeBg: "bg-blue-100",
    dark: {
      bgColor: "dark:bg-blue-950/30",
      textColor: "dark:text-blue-300",
      borderColor: "dark:border-blue-900/30",
      badgeBg: "dark:bg-blue-950",
    },
  },
  Shipped: {
    icon: Truck,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    badgeBg: "bg-purple-100",
    dark: {
      bgColor: "dark:bg-purple-950/30",
      textColor: "dark:text-purple-300",
      borderColor: "dark:border-purple-900/30",
      badgeBg: "dark:bg-purple-950",
    },
  },
  "Out for Delivery": {
    icon: AlertCircle,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    badgeBg: "bg-amber-100",
    dark: {
      bgColor: "dark:bg-amber-950/30",
      textColor: "dark:text-amber-300",
      borderColor: "dark:border-amber-900/30",
      badgeBg: "dark:bg-amber-950",
    },
  },
  Delivered: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    badgeBg: "bg-green-100",
    dark: {
      bgColor: "dark:bg-green-950/30",
      textColor: "dark:text-green-300",
      borderColor: "dark:border-green-900/30",
      badgeBg: "dark:bg-green-950",
    },
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("authToken");
    setUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Order status updated");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderstatus: newStatus as Order["orderstatus"] }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderstatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Update page if filters result in fewer items than current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="h-4 w-1/2 bg-slate-200 rounded dark:bg-zinc-700"></div>
          <div className="mt-4 h-20 w-full bg-slate-200 rounded dark:bg-zinc-700"></div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            FULFILLMENT
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Orders
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Manage {orders.length} orders
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            No orders yet
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            Orders will appear here once customers start placing them
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="space-y-4 lg:flex lg:gap-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ID, email, or name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-600 dark:text-zinc-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredOrders.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(endIndex, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
                No orders found
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Orders List */}
              <div className="space-y-4">
                {paginatedOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    updating={updating}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-md text-sm font-semibold transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

function OrderCard({
  order,
  onStatusChange,
  updating,
}: {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
  updating: boolean;
}) {
  const statusConfig =
    STATUS_CONFIG[order.orderstatus as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;
  const discount = order.actualTotal - order.total;

  return (
    <article
      className={`rounded-xl border transition ${statusConfig.borderColor} ${statusConfig.bgColor} shadow-sm hover:shadow-md dark:border-zinc-700 ${statusConfig.dark.bgColor} ${statusConfig.dark.textColor}`}
    >
      {/* Header */}
      <div className="border-b border-current border-opacity-10 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5 flex-none" />
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.textColor} ${statusConfig.badgeBg}`}
              >
                {order.orderstatus}
              </span>
            </div>
            <p className="break-all font-mono text-sm font-semibold text-slate-950 dark:text-white">
              #{order._id.slice(0, 12)}...
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {order.userEmail}
            </p>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300 lg:text-right">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Placed on
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Update Status:
          </label>
          <select
            value={order.orderstatus}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={updating}
            className="rounded-lg border border-current border-opacity-20 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-current focus:ring-opacity-20 disabled:opacity-50 dark:bg-zinc-950 dark:text-white sm:w-52"
          >
            <option value="Placed">Placed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="border-b border-current border-opacity-10 px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
          Order Items ({order.items.length})
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex min-w-0 gap-3 rounded-lg border border-current border-opacity-20 bg-white/50 p-3 dark:bg-white/5"
            >
              <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Qty: {item.quantity}
                </p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="space-y-4 lg:flex lg:items-start lg:justify-between lg:gap-4">
          {/* Shipping Info */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-400">
              Shipping Address
            </h4>
            <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                {order.shippingInfo.name}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city} - {order.shippingInfo.zip}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-lg border border-current border-opacity-20 bg-white/50 p-4 dark:bg-white/5 lg:w-64">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-400">
              Payment Summary
            </h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Original Price:</span>
                <span className="font-medium">
                  ₹{order.actualTotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span className="font-medium">
                    -₹{discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t border-current border-opacity-20 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Total Paid:
                  </span>
                  <span className="text-lg font-bold text-slate-950 dark:text-white">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
