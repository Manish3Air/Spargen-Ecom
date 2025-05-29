"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BASE_URL from "../../utils/api";
import Image from "next/image";
import { toast } from "sonner";
interface Order {
  _id: string;
  createdAt: string;
  items: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  actualTotal: number;
  shippingInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  orderstatus?: "Placed" | "Shipped" | "Out for Delivery" | "Delivered";
  paymentstatus?: string;
  paidAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();
  const router = useRouter();

  // const actualTotal = cartItems.reduce((total, item) => {
  //   const discountPercent = 20; // or item.discount if dynamic
  //   const discountedPrice = item.price - item.price * (discountPercent / 100);
  //   return total + discountedPrice * item.quantity;
  // }, 0);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser) {
        toast.warning("You must be logged in to access this page.");
        router.push("/login");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Auth token missing. Please log in again.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: Order[] = await res.json();

        const updated = data.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
          })),
        }));

        setOrders(updated);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        toast.warning("Failed to load order history. Please try again.");
      }
    };

    fetchUserOrders();
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
    <main className="p-4 sm:p-6 bg-[#f0f5ff] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        📦 Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No past orders found.
        </p>
      ) : (
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          {orders.map((order: Order) => {
            const dateOnly = new Date(order.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6"
              >
                {/* Order Meta Info */}
                <div className="mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <strong>Order ID:</strong> #{order._id} <br />
                  <strong>Date:</strong> {dateOnly}
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-300 dark:divide-gray-600">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="py-3 flex flex-col sm:flex-row justify-between items-start gap-4"
                    >
                      <div className="w-full sm:w-3/4">
                        <strong className="text-sm">Product ID:</strong>{" "}
                        {item._id}
                        <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-4">
                          <Image
                            src={item.image}
                            alt="Image"
                            height={54}
                            width={54}
                            className="object-contain border-2 rounded-md shadow-sm"
                          />
                          <p className="font-mono text-pink-500 text-base sm:text-lg">
                            {item.name}
                          </p>
                          <p className="text-sm">
                            Qty:{" "}
                            <span className="rounded border px-3 py-1 text-sm bg-white dark:bg-gray-200 text-black">
                              {item.quantity}
                            </span>
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                          Price: ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      {/* Status & Subtotal */}
                      <div className="text-right space-y-1 w-full sm:w-1/4">
                        <div
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            order.orderstatus || "Placed"
                          )}`}
                        >
                          {order.orderstatus || "Placed"}
                        </div>
                        <div className="font-semibold text-gray-700 dark:text-gray-200 mt-2">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="mt-3 sm:mt-4 px-2 text-right text-sm sm:text-base text-gray-700 dark:text-gray-200">
                  <p>Actual Price: ₹{order.total.toFixed(2)}</p>
                  <p className="text-green-600 animate-bounce">
                    Discount: - ₹{(order.total - order.actualTotal).toFixed(2)}
                  </p>
                  <p className="font-bold text-lg">
                    Total Paid: ₹{order.actualTotal.toFixed(2)}
                  </p>

                  {/* Payment Info */}
                  <div className="mt-2 text-sm">
                    <p>
                      <strong className="text-gray-400">Payment Status:</strong>{" "}
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {order.paymentstatus || "Pending"}
                      </span>
                    </p>

                    {order.paidAt && (
                      <p className="text-gray-500 mt-1">
                        <strong>Paid on:</strong>{" "}
                        {new Date(order.paidAt).toLocaleString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
                  <h3 className="font-semibold mb-1">Shipping Info:</h3>
                  <p>Name: {order.shippingInfo.name}</p>
                  <p>Email: {order.shippingInfo.email}</p>
                  <p>
                    Address: {order.shippingInfo.address},{" "}
                    {order.shippingInfo.city}, {order.shippingInfo.zip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
