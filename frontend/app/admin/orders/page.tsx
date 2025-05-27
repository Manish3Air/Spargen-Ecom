"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import BASE_URL from "../../../utils/api";
import { toast } from "sonner";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
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

      toast.success("Order Status Updated");

      // Update state with new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderstatus: newStatus as Order["orderstatus"] } : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.warning("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-[#f0f5ff] dark:bg-black min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">🧾 All Orders (Admin)</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="space-y-6 max-w-6xl mx-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-3"
            >
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p><strong>Order ID:</strong> #{order._id}</p>
                  <p><strong>Email:</strong> {order.userEmail}</p>

                  <label className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status:
                    <select
                      value={order.orderstatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="mt-1 border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      disabled={loading}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </label>
                </div>
                <div className="text-right">
                  <p>
                    <strong>Placed on:</strong><br />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border rounded p-2 bg-gray-50 dark:bg-gray-900"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                    <div>
                      <p className="font-semibold">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Shipping To:</strong> {order.shippingInfo.name},{" "}
                  {order.shippingInfo.address}, {order.shippingInfo.city} -{" "}
                  {order.shippingInfo.zip}
                </p>
              </div>

              <div className="text-right mt-2">
                <p className="text-sm">Actual: ₹{order.actualTotal.toFixed(2)}</p>
                <p className="text-green-600 text-sm">
                  Discount: ₹{(order.actualTotal - order.total).toFixed(2)}
                </p>
                <p className="text-lg font-bold">
                  Total Paid: ₹{order.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
