"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Order {
  id: string;
  date: string;
  items: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    image: string;
    status?: "Placed" | "Shipped" | "Out for Delivery" | "Delivered";
  }[];
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();

  const actualTotal = cartItems.reduce((total, item) => {
    const discountPercent = 20; // or item.discount if dynamic
    const discountedPrice = item.price - item.price * (discountPercent / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (!currentUser) {
      alert("You must be logged in to access this page.");
      router.push("/login");
      return;
    }

    const stored = localStorage.getItem(`orders-${currentUser.email}`);
    if (stored) {
      const loaded: Order[] = JSON.parse(stored);
      const updated = loaded.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          status: item.status || "Placed", // default status
        })),
      }));
      setOrders(updated);
    }
  }, [currentUser, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="p-6 bg-[#e0e5ec] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">📦 Order History</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No past orders found.</p>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          {orders.map((order) => {
            const discount = actualTotal - order.total;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-neumorphic dark:shadow-md p-6"
              >
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Order ID:</strong> #{order.id} <br />
                  <strong>Date:</strong> {order.date}
                </div>

                <div className="divide-y divide-gray-300 dark:divide-gray-600">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium">{item.name} × {item.quantity}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          MRP: ₹{item.originalPrice?.toFixed(2) || item.price.toFixed(2)}<br />
                          Discounted: ₹{item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status || "Placed")}`}>
                          {item.status}
                        </div>
                        <div className="font-semibold text-gray-700 dark:text-gray-200">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="mt-4 space-y-1 text-sm text-right text-gray-700 dark:text-gray-200">
                  <div>Actual Price: ₹{actualTotal.toFixed(2)}</div>
                  <div className="text-green-600">Discount: - ₹{discount.toFixed(2)}</div>
                  <div className="font-bold text-lg">Total Paid: ₹{order.total.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
